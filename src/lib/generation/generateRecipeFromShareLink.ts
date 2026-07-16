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

export type ShareLinkTranscriptionResult = Omit<
  ShareLinkGenerationResult,
  "draft"
>;

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
  __recipeTicketTranscriptionJobs?: Map<
    string,
    Promise<ShareLinkTranscriptionResult>
  >;
};
const shareJobs =
  globalCache.__recipeTicketShareJobs ??
  (globalCache.__recipeTicketShareJobs = new Map());
const transcriptionJobs =
  globalCache.__recipeTicketTranscriptionJobs ??
  (globalCache.__recipeTicketTranscriptionJobs = new Map());

async function transcribeUncachedShareLink(
  sourceUrl: string,
): Promise<ShareLinkTranscriptionResult> {
  const startedAt = Date.now();
  const stages: ShareLinkGenerationResult["stages"] = [
    { stage: "resolving_link", completedAtMs: 0 },
  ];
  const audio = await extractAudioWithYtDlp(sourceUrl);
  stages.push({ stage: "extracting_audio", completedAtMs: Date.now() - startedAt });

  const asr = await transcribeAudio(audio.audio);
  stages.push({ stage: "transcribing", completedAtMs: Date.now() - startedAt });

  return {
    asr,
    canonicalUrl: audio.canonicalUrl,
    durationSeconds: audio.durationSeconds,
    sourceHash: audio.sourceHash,
    stages,
    title: audio.title,
    transcript: asr.transcript,
  };
}

export async function transcribeShareLink(sourceUrl: string) {
  const { sourceHash } = normalizeShareUrl(sourceUrl);
  const existing = transcriptionJobs.get(sourceHash);

  if (existing) {
    return existing;
  }

  const transcription = transcribeUncachedShareLink(sourceUrl);
  if (transcriptionJobs.size >= 20) {
    const oldestKey = transcriptionJobs.keys().next().value;
    if (oldestKey) {
      transcriptionJobs.delete(oldestKey);
    }
  }
  transcriptionJobs.set(sourceHash, transcription);

  try {
    return await transcription;
  } catch (error) {
    transcriptionJobs.delete(sourceHash);
    throw error;
  }
}

async function generateUncachedRecipeFromShareLink(
  sourceUrl: string,
): Promise<ShareLinkGenerationResult> {
  const transcribed = await transcribeShareLink(sourceUrl);
  const startedAt = Date.now() - (transcribed.stages.at(-1)?.completedAtMs ?? 0);
  const stages = [...transcribed.stages];

  const parsed = await parseRecipeWithDeepSeek({
    rawText: transcribed.transcript,
    sourcePlatform: "xiaohongshu",
    sourceUrl: transcribed.canonicalUrl,
    userId: null,
  });
  stages.push({ stage: "parsing", completedAtMs: Date.now() - startedAt });

  if (!parsed.ok || !parsed.draft) {
    throw new Error(parsed.errorCode || "DEEPSEEK_PARSE_FAILED");
  }

  validateGroundedRecipe(parsed.draft, transcribed.transcript);
  stages.push({ stage: "validating", completedAtMs: Date.now() - startedAt });
  stages.push({ stage: "completed", completedAtMs: Date.now() - startedAt });

  return {
    asr: transcribed.asr,
    canonicalUrl: transcribed.canonicalUrl,
    draft: parsed.draft,
    durationSeconds: transcribed.durationSeconds,
    sourceHash: transcribed.sourceHash,
    stages,
    title: transcribed.title,
    transcript: transcribed.transcript,
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
