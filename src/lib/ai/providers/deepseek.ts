import {
  buildRecipeParserUserPrompt,
  recipeParserSystemPrompt,
} from "@/lib/ai/prompts/recipeParserPrompt";
import { groundParsedRecipeDraft } from "@/lib/ai/groundParsedRecipe";
import { validateParsedRecipeDraft } from "@/lib/ai/validateParsedRecipe";
import type {
  RecipeParseErrorCode,
  RecipeParseInput,
  RecipeParseResult,
} from "@/types/ai";

const DEFAULT_DEEPSEEK_BASE_URL = "https://api.deepseek.com";
const DEFAULT_DEEPSEEK_MODEL = "deepseek-v4-flash";
const DEFAULT_DEEPSEEK_TIMEOUT_MS = 30000;
const DEFAULT_DEEPSEEK_MAX_RETRIES = 1;
const DEFAULT_DEEPSEEK_MAX_TOKENS = 3000;

type DeepSeekChatCompletionResponse = {
  model?: string;
  choices?: Array<{
    finish_reason?: string | null;
    message?: {
      content?: string | null;
    };
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
};

function getBoundedInteger(
  value: string | undefined,
  fallback: number,
  minimum: number,
  maximum: number,
) {
  const parsed = Number.parseInt(value ?? "", 10);

  return Number.isFinite(parsed)
    ? Math.min(maximum, Math.max(minimum, parsed))
    : fallback;
}

function getDeepSeekEndpoint() {
  const baseUrl =
    process.env.DEEPSEEK_BASE_URL?.replace(/\/$/, "") ||
    DEFAULT_DEEPSEEK_BASE_URL;

  return `${baseUrl}/chat/completions`;
}

function extractJsonObject(value: string) {
  const trimmedValue = value.trim();

  if (trimmedValue.startsWith("{") && trimmedValue.endsWith("}")) {
    return trimmedValue;
  }

  const fencedJson = trimmedValue.match(/```(?:json)?\s*([\s\S]*?)```/i);

  if (fencedJson?.[1]) {
    return fencedJson[1].trim();
  }

  const firstBrace = trimmedValue.indexOf("{");
  const lastBrace = trimmedValue.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmedValue.slice(firstBrace, lastBrace + 1);
  }

  return null;
}

function parseDraftContent(content: string) {
  const jsonText = extractJsonObject(content);

  if (!jsonText) {
    return null;
  }

  try {
    return validateParsedRecipeDraft(JSON.parse(jsonText));
  } catch {
    return null;
  }
}

function isRetryableStatus(status: number) {
  return status === 408 || status === 429 || status >= 500;
}

function getStatusErrorCode(status: number): RecipeParseErrorCode {
  if (status === 429) {
    return "PROVIDER_RATE_LIMIT";
  }

  return "PROVIDER_UNAVAILABLE";
}

function normalizeUsage(result: DeepSeekChatCompletionResponse) {
  const usage = result.usage;

  if (!usage) {
    return null;
  }

  return {
    promptTokens: usage.prompt_tokens ?? 0,
    completionTokens: usage.completion_tokens ?? 0,
    totalTokens: usage.total_tokens ?? 0,
  };
}

export async function parseRecipeWithDeepSeek(
  input: RecipeParseInput,
): Promise<RecipeParseResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const model = process.env.DEEPSEEK_MODEL || DEFAULT_DEEPSEEK_MODEL;
  const timeoutMs = getBoundedInteger(
    process.env.DEEPSEEK_TIMEOUT_MS,
    DEFAULT_DEEPSEEK_TIMEOUT_MS,
    5000,
    60000,
  );
  const maxRetries = getBoundedInteger(
    process.env.DEEPSEEK_MAX_RETRIES,
    DEFAULT_DEEPSEEK_MAX_RETRIES,
    0,
    2,
  );
  const maxTokens = getBoundedInteger(
    process.env.DEEPSEEK_MAX_TOKENS,
    DEFAULT_DEEPSEEK_MAX_TOKENS,
    1000,
    8000,
  );
  const startedAt = Date.now();

  if (!apiKey) {
    return {
      ok: false,
      draft: null,
      error: "DeepSeek API key is not configured.",
      errorCode: "PROVIDER_NOT_CONFIGURED",
      provider: "deepseek",
      usedFallback: true,
      diagnostics: {
        attemptedProvider: "deepseek",
        model,
        durationMs: Date.now() - startedAt,
        attemptCount: 0,
        finishReason: null,
        usage: null,
      },
    };
  }

  let lastError = "DeepSeek request failed.";
  let lastErrorCode: RecipeParseErrorCode = "UNKNOWN";
  let lastFinishReason: string | null = null;
  let lastUsage: ReturnType<typeof normalizeUsage> = null;
  let attemptCount = 0;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    attemptCount = attempt + 1;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(getDeepSeekEndpoint(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: recipeParserSystemPrompt },
            { role: "user", content: buildRecipeParserUserPrompt(input) },
          ],
          response_format: { type: "json_object" },
          thinking: { type: "disabled" },
          temperature: 0.2,
          max_tokens: maxTokens,
          stream: false,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        lastError = `DeepSeek request failed with status ${response.status}.`;
        lastErrorCode = getStatusErrorCode(response.status);

        if (attempt < maxRetries && isRetryableStatus(response.status)) {
          continue;
        }

        break;
      }

      const result = (await response.json()) as DeepSeekChatCompletionResponse;
      const choice = result.choices?.[0];
      const content = choice?.message?.content;
      lastFinishReason = choice?.finish_reason ?? null;
      lastUsage = normalizeUsage(result);

      if (lastFinishReason === "length") {
        lastError = "DeepSeek output was truncated.";
        lastErrorCode = "TRUNCATED_RESPONSE";

        if (attempt < maxRetries) {
          continue;
        }

        break;
      }

      if (!content) {
        lastError = "DeepSeek returned empty content.";
        lastErrorCode = "EMPTY_RESPONSE";

        if (attempt < maxRetries) {
          continue;
        }

        break;
      }

      const parsedDraft = parseDraftContent(content);

      if (!parsedDraft) {
        lastError = "DeepSeek returned invalid recipe JSON.";
        lastErrorCode = "INVALID_RESPONSE";

        if (attempt < maxRetries) {
          continue;
        }

        break;
      }

      const draft = groundParsedRecipeDraft(parsedDraft, input.rawText);

      return {
        ok: true,
        draft,
        error: null,
        errorCode: null,
        provider: "deepseek",
        usedFallback: false,
        diagnostics: {
          attemptedProvider: "deepseek",
          model: result.model ?? model,
          durationMs: Date.now() - startedAt,
          attemptCount,
          finishReason: lastFinishReason,
          usage: lastUsage,
        },
      };
    } catch (error) {
      lastError =
        error instanceof Error && error.name === "AbortError"
          ? "DeepSeek request timed out."
          : "DeepSeek request failed.";
      lastErrorCode =
        error instanceof Error && error.name === "AbortError"
          ? "PROVIDER_TIMEOUT"
          : "PROVIDER_UNAVAILABLE";

      if (attempt >= maxRetries) {
        break;
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return {
    ok: false,
    draft: null,
    error: lastError,
    errorCode: lastErrorCode,
    provider: "deepseek",
    usedFallback: true,
    diagnostics: {
      attemptedProvider: "deepseek",
      model,
      durationMs: Date.now() - startedAt,
      attemptCount,
      finishReason: lastFinishReason,
      usage: lastUsage,
    },
  };
}
