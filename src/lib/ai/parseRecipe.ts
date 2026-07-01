import { mockRecipeParser } from "@/lib/ai/mockRecipeParser";
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

  if (provider !== "mock") {
    const fallbackResult = await mockRecipeParser(input);

    return {
      ...fallbackResult,
      provider,
      usedFallback: true,
    };
  }

  return mockRecipeParser(input);
}
