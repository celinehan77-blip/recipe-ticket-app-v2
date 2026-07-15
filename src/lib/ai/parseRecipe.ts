import { mockRecipeParser } from "@/lib/ai/mockRecipeParser";
import { parseRecipeWithDeepSeek } from "@/lib/ai/providers/deepseek";
import type {
  RecipeParseInput,
  RecipeParseProvider,
  RecipeParseResult,
} from "@/types/ai";

function getConfiguredProvider(): RecipeParseProvider {
  const provider = process.env.AI_PROVIDER;

  if (
    provider === "deepseek" ||
    provider === "openai" ||
    provider === "qwen" ||
    provider === "mock"
  ) {
    return provider;
  }

  return "mock";
}

export async function parseRecipeInput(
  input: RecipeParseInput,
): Promise<RecipeParseResult> {
  const provider = getConfiguredProvider();

  if (provider === "deepseek") {
    const deepSeekResult = await parseRecipeWithDeepSeek(input);

    if (deepSeekResult.ok && deepSeekResult.draft) {
      return {
        ...deepSeekResult,
        model: deepSeekResult.diagnostics?.model ?? null,
        provider: "deepseek",
        usedFallback: false,
      };
    }

    const fallbackResult = await mockRecipeParser(input);

    return {
      ...fallbackResult,
      error: deepSeekResult.error,
      errorCode: deepSeekResult.errorCode,
      model: deepSeekResult.diagnostics?.model ?? null,
      provider: "mock",
      usedFallback: true,
      diagnostics: deepSeekResult.diagnostics,
    };
  }

  if (provider === "openai" || provider === "qwen") {
    const fallbackResult = await mockRecipeParser(input);

    return {
      ...fallbackResult,
      error: `${provider} provider is not implemented.`,
      errorCode: "PROVIDER_UNAVAILABLE",
      provider: "mock",
      usedFallback: true,
    };
  }

  return mockRecipeParser(input);
}
