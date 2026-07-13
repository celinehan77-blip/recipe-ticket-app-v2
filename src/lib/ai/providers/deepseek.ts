import {
  buildRecipeParserUserPrompt,
  recipeParserSystemPrompt,
} from "@/lib/ai/prompts/recipeParserPrompt";
import { validateParsedRecipeDraft } from "@/lib/ai/validateParsedRecipe";
import type { RecipeParseInput, RecipeParseResult } from "@/types/ai";

const DEFAULT_DEEPSEEK_BASE_URL = "https://api.deepseek.com";
const DEFAULT_DEEPSEEK_MODEL = "deepseek-v4-flash";
const DEEPSEEK_TIMEOUT_MS = 25000;

type DeepSeekChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

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

export async function parseRecipeWithDeepSeek(
  input: RecipeParseInput,
): Promise<RecipeParseResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      draft: null,
      error: "DeepSeek API key is not configured.",
      provider: "deepseek",
      usedFallback: true,
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEEPSEEK_TIMEOUT_MS);

  try {
    const response = await fetch(getDeepSeekEndpoint(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || DEFAULT_DEEPSEEK_MODEL,
        messages: [
          { role: "system", content: recipeParserSystemPrompt },
          { role: "user", content: buildRecipeParserUserPrompt(input) },
        ],
        response_format: { type: "json_object" },
        max_tokens: 2200,
        stream: false,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        ok: false,
        draft: null,
        error: `DeepSeek request failed with status ${response.status}.`,
        provider: "deepseek",
        usedFallback: true,
      };
    }

    const result = (await response.json()) as DeepSeekChatCompletionResponse;
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      return {
        ok: false,
        draft: null,
        error: "DeepSeek returned empty content.",
        provider: "deepseek",
        usedFallback: true,
      };
    }

    const draft = parseDraftContent(content);

    if (!draft) {
      return {
        ok: false,
        draft: null,
        error: "DeepSeek returned invalid recipe JSON.",
        provider: "deepseek",
        usedFallback: true,
      };
    }

    return {
      ok: true,
      draft,
      error: null,
      provider: "deepseek",
      usedFallback: false,
    };
  } catch (error) {
    return {
      ok: false,
      draft: null,
      error:
        error instanceof Error && error.name === "AbortError"
          ? "DeepSeek request timed out."
          : "DeepSeek request failed.",
      provider: "deepseek",
      usedFallback: true,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
