import {
  createMockGenerationTask,
  completeMockGenerationTask,
} from "@/lib/data/generationTasks";
import { createRecipeFromParsedDraft } from "@/lib/data/recipes";
import {
  getLocalGeneratedDraftBySlug,
  isLocalGeneratedRecipeSlug,
} from "@/lib/data/localGeneratedRecipe";
import {
  readMockGenerationTask,
} from "@/lib/mockGenerationTask";
import { replaceFavoriteRecipeSlug } from "@/lib/localFavorites";
import type { RecipeParseSourcePlatform } from "@/types/ai";

const MIGRATION_KEY_PREFIX = "recipe-ticket:local-recipe-migrated";

export type LocalRecipeMigrationResult = {
  error: string | null;
  migrated: boolean;
  slug: string | null;
};

function getMigrationKey(userId: string) {
  return `${MIGRATION_KEY_PREFIX}:${userId}`;
}

function canUseLocalStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}

function asSourcePlatform(value: string): RecipeParseSourcePlatform {
  if (
    value === "xiaohongshu" ||
    value === "douyin" ||
    value === "manual" ||
    value === "mock"
  ) {
    return value;
  }

  return "manual";
}

export async function migrateLatestLocalRecipeAfterLogin(
  userId: string,
): Promise<LocalRecipeMigrationResult> {
  if (!canUseLocalStorage()) {
    return { error: null, migrated: false, slug: null };
  }

  const migrationKey = getMigrationKey(userId);
  const migratedSlug = window.localStorage.getItem(migrationKey);

  if (migratedSlug) {
    return { error: null, migrated: false, slug: migratedSlug };
  }

  const localTask = readMockGenerationTask();
  const localRecipeSlug = localTask?.generatedRecipeSlug ?? "";
  const draft = getLocalGeneratedDraftBySlug(localRecipeSlug);

  if (
    !draft ||
    !localTask ||
    !isLocalGeneratedRecipeSlug(localRecipeSlug)
  ) {
    return { error: null, migrated: false, slug: null };
  }

  const sourcePlatform = asSourcePlatform(localTask.sourcePlatform);
  const createdRecipe = await createRecipeFromParsedDraft({
    draft,
    sourcePlatform,
    sourceUrl: /^https?:\/\//i.test(localTask.sourceUrl)
      ? localTask.sourceUrl
      : undefined,
  });

  if (!createdRecipe.ok || isLocalGeneratedRecipeSlug(createdRecipe.slug)) {
    return {
      error: createdRecipe.error ?? "Local recipe migration failed.",
      migrated: false,
      slug: null,
    };
  }

  replaceFavoriteRecipeSlug(
    localRecipeSlug,
    createdRecipe.slug,
  );
  window.localStorage.setItem(migrationKey, createdRecipe.slug);

  const cloudTask = await createMockGenerationTask(
    localTask.sourceUrl,
    sourcePlatform,
  );
  await completeMockGenerationTask(createdRecipe.slug, cloudTask.id);

  return {
    error: null,
    migrated: true,
    slug: createdRecipe.slug,
  };
}
