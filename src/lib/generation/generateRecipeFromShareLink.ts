import { parseRecipeWithDeepSeek } from "@/lib/ai/providers/deepseek";
import { scoreParsedRecipeDraft } from "@/lib/ai/scoreParsedRecipe";
import { transcribeAudio, type TranscriptionResult } from "@/lib/asr/transcribeAudio";
import { extractAudioWithYtDlp } from "@/lib/media/extractAudio";
import { normalizeShareUrl } from "@/lib/media/extractAudio";
import type { ParsedRecipeDraft } from "@/types/ai";

export type GenerationStage =
  | "resolving_link"
  | "extracting_audio"
  | "transcribing"
  | "parsing"
  | "validating"
  | "completed";

export type ShareLinkGenerationResult = {
  asr: TranscriptionResult;
  canonicalUrl: string;
  draft: ParsedRecipeDraft;
  durationSeconds: number;
  sourceHash: string;
  stages: Array<{ stage: GenerationStage; completedAtMs: number }>;
  title: string | null;
  transcript: string;
};

function validateGroundedRecipe(draft: ParsedRecipeDraft, transcript: string) {
  const quality = scoreParsedRecipeDraft(draft);
  const namedItems = [...draft.ingredients, ...draft.seasonings].filter((item) =>
    transcript.includes(item.name),
  );
  const repeatedTitleSteps = draft.steps.filter(
    (step) => step.description.trim() === draft.titleZh.trim(),
  );

  if (
    transcript.trim().length < 30 ||
    draft.ingredients.length < 2 ||
    draft.steps.length < 3 ||
    namedItems.length < 2 ||
    repeatedTitleSteps.length > 0 ||
    !quality.passed
  ) {
    throw new Error("RECIPE_QUALITY_FAILED");
  }
}

const globalCache = globalThis as typeof globalThis & {
  __recipeTicketShareJobs?: Map<string, Promise<ShareLinkGenerationResult>>;
};
const shareJobs =
  globalCache.__recipeTicketShareJobs ??
  (globalCache.__recipeTicketShareJobs = new Map());

async function generateUncachedRecipeFromShareLink(
  sourceUrl: string,
): Promise<ShareLinkGenerationResult> {
  const startedAt = Date.now();
  const stages: ShareLinkGenerationResult["stages"] = [
    { stage: "resolving_link", completedAtMs: 0 },
  ];
  const audio = await extractAudioWithYtDlp(sourceUrl);
  stages.push({ stage: "extracting_audio", completedAtMs: Date.now() - startedAt });

  const asr = await transcribeAudio(audio.audio);
  stages.push({ stage: "transcribing", completedAtMs: Date.now() - startedAt });

  const parsed = await parseRecipeWithDeepSeek({
    rawText: asr.transcript,
    sourcePlatform: "xiaohongshu",
    sourceUrl: audio.canonicalUrl,
    userId: null,
  });
  stages.push({ stage: "parsing", completedAtMs: Date.now() - startedAt });

  if (!parsed.ok || !parsed.draft) {
    throw new Error(parsed.errorCode || "DEEPSEEK_PARSE_FAILED");
  }

  validateGroundedRecipe(parsed.draft, asr.transcript);
  stages.push({ stage: "validating", completedAtMs: Date.now() - startedAt });
  stages.push({ stage: "completed", completedAtMs: Date.now() - startedAt });

  return {
    asr,
    canonicalUrl: audio.canonicalUrl,
    draft: parsed.draft,
    durationSeconds: audio.durationSeconds,
    sourceHash: audio.sourceHash,
    stages,
    title: audio.title,
    transcript: asr.transcript,
  };
}

export async function generateRecipeFromShareLink(sourceUrl: string) {
  const { sourceHash } = normalizeShareUrl(sourceUrl);
  const existing = shareJobs.get(sourceHash);

  if (existing) {
    return existing;
  }

  const generation = generateUncachedRecipeFromShareLink(sourceUrl);
  if (shareJobs.size >= 20) {
    const oldestKey = shareJobs.keys().next().value;
    if (oldestKey) {
      shareJobs.delete(oldestKey);
    }
  }
  shareJobs.set(sourceHash, generation);

  try {
    return await generation;
  } catch (error) {
    shareJobs.delete(sourceHash);
    throw error;
  }
}
