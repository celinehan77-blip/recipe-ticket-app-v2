import type { IngredientGroup } from "@/types";

export type RecipeParseSourcePlatform =
  | "xiaohongshu"
  | "douyin"
  | "manual"
  | "mock";

export type RecipeParseProvider = "mock" | "deepseek" | "openai" | "qwen";

export type RecipeParseInput = {
  sourceUrl?: string;
  rawText?: string;
  sourcePlatform?: RecipeParseSourcePlatform;
  userId?: string | null;
};

export type ParsedIngredient = {
  name: string;
  amount: string;
  group: IngredientGroup;
  note: string;
};

export type ParsedStep = {
  title: string;
  description: string;
  duration: string;
  heat: string;
  tips: string;
};

export type RecipeParseErrorCode =
  | "INVALID_INPUT"
  | "PROVIDER_NOT_CONFIGURED"
  | "PROVIDER_TIMEOUT"
  | "PROVIDER_RATE_LIMIT"
  | "PROVIDER_UNAVAILABLE"
  | "EMPTY_RESPONSE"
  | "TRUNCATED_RESPONSE"
  | "INVALID_RESPONSE"
  | "UNKNOWN";

export type ParsedRecipeDraft = {
  titleZh: string;
  titleEn: string;
  description: string;
  timeMinutes: number;
  difficulty: string;
  flavor: string;
  mainIngredient: string;
  tags: string[];
  ingredients: ParsedIngredient[];
  seasonings: ParsedIngredient[];
  steps: ParsedStep[];
  confidence: number;
  warnings: string[];
};

export type RecipeParseResult = {
  ok: boolean;
  draft: ParsedRecipeDraft | null;
  error: string | null;
  errorCode: RecipeParseErrorCode | null;
  provider: RecipeParseProvider;
  usedFallback: boolean;
  model?: string | null;
  diagnostics?: {
    attemptedProvider: RecipeParseProvider;
    model: string | null;
    durationMs: number;
    attemptCount: number;
    finishReason: string | null;
    usage: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    } | null;
  };
};
