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
        provider: "deepseek",
        usedFallback: false,
      };
    }

    const fallbackResult = await mockRecipeParser(input);

    return {
      ...fallbackResult,
      error: deepSeekResult.error,
      provider: "mock",
      usedFallback: true,
    };
  }

  if (provider === "openai" || provider === "qwen") {
    const fallbackResult = await mockRecipeParser(input);

    return {
      ...fallbackResult,
      provider: "mock",
      usedFallback: true,
    };
  }

  return mockRecipeParser(input);
}
