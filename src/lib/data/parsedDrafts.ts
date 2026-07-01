import type { ParsedRecipeDraft } from "@/types/ai";

const LATEST_PARSED_DRAFT_KEY = "recipe-ticket:latest-parsed-draft";

function canUseLocalStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function hasParsedDraftShape(value: unknown): value is ParsedRecipeDraft {
  if (!value || typeof value !== "object") {
    return false;
  }

  const draft = value as Partial<ParsedRecipeDraft>;

  return (
    typeof draft.titleZh === "string" &&
    typeof draft.titleEn === "string" &&
    typeof draft.description === "string" &&
    typeof draft.timeMinutes === "number" &&
    typeof draft.difficulty === "string" &&
    typeof draft.flavor === "string" &&
    typeof draft.mainIngredient === "string" &&
    isStringArray(draft.tags) &&
    Array.isArray(draft.ingredients) &&
    Array.isArray(draft.seasonings) &&
    Array.isArray(draft.steps) &&
    typeof draft.confidence === "number" &&
    isStringArray(draft.warnings)
  );
}

export function saveLatestParsedDraft(draft: ParsedRecipeDraft): boolean {
  if (!canUseLocalStorage()) {
    return false;
  }

  try {
    window.localStorage.setItem(LATEST_PARSED_DRAFT_KEY, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}

export function getLatestParsedDraft(): ParsedRecipeDraft | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    const rawDraft = window.localStorage.getItem(LATEST_PARSED_DRAFT_KEY);

    if (!rawDraft) {
      return null;
    }

    const draft = JSON.parse(rawDraft) as unknown;

    return hasParsedDraftShape(draft) ? draft : null;
  } catch {
    return null;
  }
}

export function clearLatestParsedDraft(): boolean {
  if (!canUseLocalStorage()) {
    return false;
  }

  try {
    window.localStorage.removeItem(LATEST_PARSED_DRAFT_KEY);
    return true;
  } catch {
    return false;
  }
}

export function isParsedRecipeDraft(value: unknown): value is ParsedRecipeDraft {
  return hasParsedDraftShape(value);
}
