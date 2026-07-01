import { parseRecipeInput } from "@/lib/ai";
import type { RecipeParseInput, RecipeParseSourcePlatform } from "@/types/ai";

const allowedSourcePlatforms = new Set<RecipeParseSourcePlatform>([
  "xiaohongshu",
  "douyin",
  "manual",
  "mock",
]);

function asOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asSourcePlatform(value: unknown): RecipeParseSourcePlatform | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  return allowedSourcePlatforms.has(value as RecipeParseSourcePlatform)
    ? (value as RecipeParseSourcePlatform)
    : undefined;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        ok: false,
        draft: null,
        error: "请求 body 必须是 JSON。",
        provider: "mock",
        usedFallback: true,
      },
      { status: 400 },
    );
  }

  const requestBody = body && typeof body === "object" ? body : {};
  const sourceUrl = asOptionalString(
    "sourceUrl" in requestBody ? requestBody.sourceUrl : undefined,
  );
  const rawText = asOptionalString(
    "rawText" in requestBody ? requestBody.rawText : undefined,
  );

  if (!sourceUrl && !rawText) {
    return Response.json(
      {
        ok: false,
        draft: null,
        error: "sourceUrl 和 rawText 不能同时为空。",
        provider: "mock",
        usedFallback: true,
      },
      { status: 400 },
    );
  }

  const input: RecipeParseInput = {
    sourceUrl,
    rawText,
    sourcePlatform: asSourcePlatform(
      "sourcePlatform" in requestBody ? requestBody.sourcePlatform : undefined,
    ),
    userId: null,
  };

  try {
    return Response.json(await parseRecipeInput(input));
  } catch {
    return Response.json(
      {
        ok: false,
        draft: null,
        error: "解析服务暂时不可用。",
        provider: "mock",
        usedFallback: true,
      },
      { status: 500 },
    );
  }
}
