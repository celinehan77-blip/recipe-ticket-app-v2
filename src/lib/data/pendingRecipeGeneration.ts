"use client";

import {
  clearLatestParsedDraft,
  isParsedRecipeDraft,
  saveLatestParsedDraft,
} from "@/lib/data/parsedDrafts";
import {
  completeMockGenerationTask,
  createMockGenerationTask,
  failGenerationTask,
} from "@/lib/data/generationTasks";
import { createRecipeFromParsedDraft } from "@/lib/data/recipes";
import {
  getCachedGeneratedRecipeSlug,
  saveGeneratedRecipeSourceCache,
} from "@/lib/data/sourceGenerationCache";
import {
  extractHttpUrlFromSharedText,
  sanitizeSharedSourceForStorage,
} from "@/lib/source/sharedInput";
import type {
  ParsedRecipeDraft,
  RecipeParseResult,
  RecipeParseSourcePlatform,
} from "@/types/ai";

const PENDING_GENERATION_KEY = "recipe-ticket:pending-recipe-generation";
const GENERATION_ERROR_KEY = "recipe-ticket:pending-generation-error";
const PARSE_TIMEOUT_MS = 120_000;

export type PendingRecipeGeneration = {
  jobId: string;
  message?: string;
  recipeSlug?: string;
  sourcePlatform: RecipeParseSourcePlatform;
  sourceValue: string;
  startedAt: string;
  status: "processing" | "completed" | "failed";
  taskId?: string;
};

export type PendingRecipeGenerationResult =
  | { ok: true; slug: string }
  | { ok: false; message: string };

type ParsedSourceResult =
  | {
      ok: true;
      draft: ParsedRecipeDraft;
      sourcePlatform: RecipeParseSourcePlatform;
      sourceUrl?: string;
      usedFallback: boolean;
    }
  | {
      ok: false;
      message: string;
      shouldContinueWithFallback: boolean;
    };

type BackgroundGenerationStatus = {
  errorCode?: string;
  result?: RecipeParseResult;
  status: "pending" | "processing" | "completed" | "failed";
};

const activeJobs = new Map<string, Promise<PendingRecipeGenerationResult>>();

function canUseLocalStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}

export function isLikelyRecipeUrl(value: string) {
  const normalized = value.toLowerCase();
  return (
    /^https?:\/\//.test(normalized) ||
    normalized.startsWith("www.") ||
    normalized.includes("xiaohongshu") ||
    normalized.includes("xhs") ||
    normalized.includes("douyin") ||
    normalized.includes(".com") ||
    normalized.includes(".cn")
  );
}

export function getRecipeSourcePlatform(
  value: string,
): RecipeParseSourcePlatform {
  const normalized = value.toLowerCase();
  if (normalized.includes("xiaohongshu") || normalized.includes("xhs")) {
    return "xiaohongshu";
  }
  if (normalized.includes("douyin")) {
    return "douyin";
  }
  return isLikelyRecipeUrl(value) ? "mock" : "manual";
}

function savePendingGeneration(pending: PendingRecipeGeneration) {
  if (!canUseLocalStorage()) return;
  try {
    window.localStorage.setItem(PENDING_GENERATION_KEY, JSON.stringify(pending));
  } catch {
    return;
  }
}

export function getPendingRecipeGeneration(): PendingRecipeGeneration | null {
  if (!canUseLocalStorage()) return null;
  try {
    const value = JSON.parse(
      window.localStorage.getItem(PENDING_GENERATION_KEY) || "null",
    ) as PendingRecipeGeneration | null;
    return value && typeof value.jobId === "string" ? value : null;
  } catch {
    return null;
  }
}

export function clearPendingRecipeGeneration() {
  if (!canUseLocalStorage()) return;
  try {
    window.localStorage.removeItem(PENDING_GENERATION_KEY);
  } catch {
    return;
  }
}

export function consumePendingGenerationError() {
  if (!canUseLocalStorage()) return "";
  try {
    const message = window.localStorage.getItem(GENERATION_ERROR_KEY) || "";
    window.localStorage.removeItem(GENERATION_ERROR_KEY);
    return message;
  } catch {
    return "";
  }
}

function saveGenerationError(message: string) {
  if (!canUseLocalStorage()) return;
  try {
    window.localStorage.setItem(GENERATION_ERROR_KEY, message);
  } catch {
    return;
  }
}

function waitForPoll(delayMs: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(resolve, delayMs);
    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        reject(new DOMException("Generation aborted.", "AbortError"));
      },
      { once: true },
    );
  });
}

async function waitForBackgroundGeneration(
  jobId: string,
  sourceUrl: string,
  signal: AbortSignal,
) {
  const startResponse = await fetch("/api/generate-recipe-background", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobId, sourceUrl }),
    signal,
  });

  if (!startResponse.ok) {
    return null;
  }

  while (!signal.aborted) {
    await waitForPoll(1500, signal);
    const statusResponse = await fetch(`/api/generation-status/${jobId}`, {
      cache: "no-store",
      signal,
    });
    const status = (await statusResponse.json()) as BackgroundGenerationStatus;

    if (status.status === "completed" && status.result) {
      return status.result;
    }
    if (status.status === "failed") {
      return null;
    }
  }

  return null;
}

async function parseRecipeSource(
  sourceValue: string,
  jobId: string,
): Promise<ParsedSourceResult> {
  const extractedUrl = extractHttpUrlFromSharedText(sourceValue);
  const looksLikeUrl = Boolean(extractedUrl) || isLikelyRecipeUrl(sourceValue);
  const sourcePlatform = getRecipeSourcePlatform(sourceValue);
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), PARSE_TIMEOUT_MS);

  try {
    let result: RecipeParseResult | null;

    if (looksLikeUrl) {
      result = await waitForBackgroundGeneration(
        jobId,
        extractedUrl ?? sourceValue,
        controller.signal,
      );
    } else {
      const response = await fetch("/api/parse-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: sourceValue, sourcePlatform }),
        signal: controller.signal,
      });
      result = (await response.json()) as RecipeParseResult;

      if (!response.ok) {
        result = null;
      }
    }

    if (!result?.ok || !isParsedRecipeDraft(result.draft)) {
      return {
        ok: false,
        message: looksLikeUrl
          ? "暂时无法读取这条分享链接，请粘贴正文或字幕。"
          : "菜谱解析请求失败，请稍后重试。",
        shouldContinueWithFallback: !looksLikeUrl,
      };
    }

    const generation = result.generation;

    saveLatestParsedDraft(result.draft, {
      generation: generation
        ? {
            asrModel: generation.asrModel,
            asrProvider: generation.asrProvider,
            processingTimeMs: generation.processingTimeMs,
            stages: generation.stages,
            usedAsrFallback: generation.usedAsrFallback,
          }
        : undefined,
      model: result.model ?? result.diagnostics?.model ?? null,
      provider: result.provider,
      usedFallback: result.usedFallback,
    });

    return {
      ok: true,
      draft: result.draft,
      sourcePlatform,
      sourceUrl: looksLikeUrl
        ? result.source?.canonicalUrl ?? extractedUrl ?? sourceValue
        : undefined,
      usedFallback: result.usedFallback,
    };
  } catch {
    return {
      ok: false,
      message: looksLikeUrl
        ? "暂时无法读取这条分享链接，请粘贴正文或字幕。"
        : "菜谱解析超时或网络异常，请稍后重试。",
      shouldContinueWithFallback: !looksLikeUrl,
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function runPendingGeneration(
  pending: PendingRecipeGeneration,
  requestSourceValue = pending.sourceValue,
): Promise<PendingRecipeGenerationResult> {
  const parsed = await parseRecipeSource(requestSourceValue, pending.jobId);

  if (!parsed.ok) {
    clearLatestParsedDraft();
    await failGenerationTask("ai_provider_failed", "kung-pao-chicken", pending.taskId);
    const failed = { ...pending, message: parsed.message, status: "failed" as const };
    savePendingGeneration(failed);
    saveGenerationError(parsed.message);
    return { ok: false, message: parsed.message };
  }

  const createdRecipe = await createRecipeFromParsedDraft({
    draft: parsed.draft,
    preferLocal: parsed.usedFallback,
    sourcePlatform: parsed.sourcePlatform,
    sourceUrl: parsed.sourceUrl,
  });

  if (parsed.usedFallback) {
    await failGenerationTask("ai_fallback_used", createdRecipe.slug, pending.taskId);
  } else if (createdRecipe.usedFallback) {
    await failGenerationTask("recipe_save_failed", createdRecipe.slug, pending.taskId);
  } else {
    await completeMockGenerationTask(createdRecipe.slug, pending.taskId);
  }

  if (parsed.sourceUrl) {
    await saveGeneratedRecipeSourceCache(parsed.sourceUrl, createdRecipe.slug);
    await saveGeneratedRecipeSourceCache(pending.sourceValue, createdRecipe.slug);
  }

  savePendingGeneration({
    ...pending,
    recipeSlug: createdRecipe.slug,
    status: "completed",
  });
  return { ok: true, slug: createdRecipe.slug };
}

export async function beginPendingRecipeGeneration(sourceValue: string) {
  const sourcePlatform = getRecipeSourcePlatform(sourceValue);
  const persistedSourceValue = sanitizeSharedSourceForStorage(sourceValue);
  const cachedSlug = isLikelyRecipeUrl(sourceValue)
    ? await getCachedGeneratedRecipeSlug(sourceValue)
    : null;
  const task = await createMockGenerationTask(
    persistedSourceValue,
    sourcePlatform,
  );
  const pending: PendingRecipeGeneration = {
    jobId: window.crypto.randomUUID(),
    recipeSlug: cachedSlug ?? undefined,
    sourcePlatform,
    sourceValue: persistedSourceValue,
    startedAt: new Date().toISOString(),
    status: cachedSlug ? "completed" : "processing",
    taskId: task.id,
  };

  savePendingGeneration(pending);

  if (cachedSlug) {
    await completeMockGenerationTask(cachedSlug, task.id);
    activeJobs.set(pending.jobId, Promise.resolve({ ok: true, slug: cachedSlug }));
  } else {
    activeJobs.set(
      pending.jobId,
      runPendingGeneration(pending, sourceValue),
    );
  }

  return pending;
}

export function resumePendingRecipeGeneration(
  pending: PendingRecipeGeneration,
): Promise<PendingRecipeGenerationResult> {
  if (pending.status === "completed" && pending.recipeSlug) {
    return Promise.resolve({ ok: true, slug: pending.recipeSlug });
  }
  if (pending.status === "failed") {
    return Promise.resolve({
      ok: false,
      message: pending.message || "生成失败，请稍后重试。",
    });
  }

  const active = activeJobs.get(pending.jobId);
  if (active) return active;

  const resumed = runPendingGeneration(pending);
  activeJobs.set(pending.jobId, resumed);
  return resumed;
}
