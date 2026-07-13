import type {
  ParsedIngredient,
  ParsedRecipeDraft,
  ParsedStep,
} from "@/types/ai";
import type { IngredientGroup } from "@/types";

function asString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => asString(item))
    .filter((item) => item.length > 0);
}

function asNumber(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function asDifficulty(value: unknown) {
  return value === "简单" || value === "中等" || value === "复杂"
    ? value
    : "中等";
}

function asIngredientGroup(value: unknown, fallback: IngredientGroup) {
  return value === "main" || value === "side" || value === "seasoning"
    ? value
    : fallback;
}

function normalizeIngredient(
  value: unknown,
  fallbackGroup: IngredientGroup,
): ParsedIngredient | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const item = value as Partial<ParsedIngredient>;
  const name = asString(item.name);

  if (!name) {
    return null;
  }

  return {
    name,
    amount: asString(item.amount, "适量"),
    group: asIngredientGroup(item.group, fallbackGroup),
    note: asString(item.note),
  };
}

function normalizeStep(value: unknown): ParsedStep | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const item = value as Partial<ParsedStep>;
  const title = asString(item.title);
  const description = asString(item.description);

  if (!title && !description) {
    return null;
  }

  return {
    title: title || "继续烹饪",
    description: description || title,
    duration: asString(item.duration, "约 5 分钟"),
    tips: asString(item.tips),
  };
}

function normalizeIngredients(value: unknown, fallbackGroup: IngredientGroup) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => normalizeIngredient(item, fallbackGroup))
    .filter((item): item is ParsedIngredient => Boolean(item));
}

function normalizeSteps(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(normalizeStep)
    .filter((item): item is ParsedStep => Boolean(item));
}

export function validateParsedRecipeDraft(
  data: unknown,
): ParsedRecipeDraft | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const draft = data as Partial<ParsedRecipeDraft>;
  const titleZh = asString(draft.titleZh);
  const mainIngredient = asString(draft.mainIngredient);
  const ingredients = normalizeIngredients(draft.ingredients, "side").map(
    (ingredient, index) => ({
      ...ingredient,
      group:
        ingredient.group === "seasoning"
          ? "side"
          : index === 0
            ? "main"
            : ingredient.group,
    }),
  );
  const seasonings = normalizeIngredients(draft.seasonings, "seasoning").map(
    (ingredient) => ({
      ...ingredient,
      group: "seasoning" as const,
    }),
  );
  const steps = normalizeSteps(draft.steps);

  if (!titleZh || !mainIngredient || ingredients.length === 0 || steps.length === 0) {
    return null;
  }

  const warnings = asStringArray(draft.warnings);

  if (ingredients.length < 3) {
    warnings.push("AI 输出的食材较少，已按可用信息保留。");
  }

  if (steps.length < 3) {
    warnings.push("AI 输出的步骤较少，已按可用信息保留。");
  }

  return {
    titleZh,
    titleEn: asString(draft.titleEn, titleZh),
    description: asString(draft.description, `${titleZh} 的结构化菜谱草稿。`),
    timeMinutes: Math.max(1, asNumber(draft.timeMinutes, 30)),
    difficulty: asDifficulty(draft.difficulty),
    flavor: asString(draft.flavor, "家常"),
    mainIngredient,
    tags: asStringArray(draft.tags).slice(0, 6),
    ingredients,
    seasonings,
    steps,
    confidence: Math.min(1, Math.max(0, asNumber(draft.confidence, 0.72))),
    warnings: Array.from(new Set(warnings)),
  };
}
