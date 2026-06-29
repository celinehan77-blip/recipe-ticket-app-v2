import {
  getRecipeBySlug as getMockRecipeBySlug,
  getRecipeDetailBySlug as getMockRecipeDetailBySlug,
  getRecipesByStationSlug as getMockRecipesByStationSlug,
  recipes,
} from "@/lib/mockData";
import {
  getAllRecipesFromSupabase,
  getRecipeBySlugFromSupabase,
  getRecipeDetailBySlugFromSupabase,
  getRecipesByStationSlugFromSupabase,
} from "@/lib/data/supabase/recipes";
import {
  mapSupabaseRecipeDetailToRecipe,
  mapSupabaseRecipeToRecipe,
} from "@/lib/data/supabase/mappers";
import type { Recipe } from "@/types";

export type RecipeCardData = Pick<
  Recipe,
  | "titleZh"
  | "titleEn"
  | "timeMinutes"
  | "difficulty"
  | "flavor"
  | "mainIngredient"
  | "description"
  | "tags"
  | "slug"
>;

function sortRecipesByMockOrder(nextRecipes: Recipe[]): Recipe[] {
  return [...nextRecipes].sort((left, right) => {
    const leftIndex = recipes.findIndex((recipe) => recipe.slug === left.slug);
    const rightIndex = recipes.findIndex((recipe) => recipe.slug === right.slug);

    return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex);
  });
}

export async function getAllRecipes(): Promise<Recipe[]> {
  try {
    const supabaseRecipes = (await getAllRecipesFromSupabase())
      .map(mapSupabaseRecipeToRecipe)
      .filter((recipe): recipe is Recipe => Boolean(recipe));

    if (supabaseRecipes.length > 0) {
      return sortRecipesByMockOrder(supabaseRecipes);
    }
  } catch {
    return recipes;
  }

  return recipes;
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  try {
    const supabaseRecipe = await getRecipeBySlugFromSupabase(slug);
    const recipe = supabaseRecipe
      ? mapSupabaseRecipeToRecipe(supabaseRecipe)
      : null;

    if (recipe) {
      return recipe;
    }
  } catch {
    return getMockRecipeBySlug(slug);
  }

  return getMockRecipeBySlug(slug);
}

export async function getRecipesByStationId(stationId: string): Promise<Recipe[]> {
  const allRecipes = await getAllRecipes();

  return allRecipes.filter((recipe) => recipe.stationId === stationId);
}

export async function getRecipesByStationSlug(
  stationSlug: string,
): Promise<Recipe[]> {
  try {
    const supabaseRecipes = (await getRecipesByStationSlugFromSupabase(stationSlug))
      .map(mapSupabaseRecipeToRecipe)
      .filter((recipe): recipe is Recipe => Boolean(recipe));

    if (supabaseRecipes.length > 0) {
      return sortRecipesByMockOrder(supabaseRecipes);
    }
  } catch {
    return getMockRecipesByStationSlug(stationSlug);
  }

  return getMockRecipesByStationSlug(stationSlug);
}

export async function getRecipeDetailBySlug(
  slug: string,
): Promise<Recipe | null> {
  try {
    const supabaseRecipeDetail = await getRecipeDetailBySlugFromSupabase(slug);
    const recipe = supabaseRecipeDetail
      ? mapSupabaseRecipeDetailToRecipe(supabaseRecipeDetail)
      : null;

    if (recipe) {
      return recipe;
    }
  } catch {
    return getMockRecipeDetailBySlug(slug);
  }

  return getMockRecipeDetailBySlug(slug);
}

export async function getRecipeCardData(
  slug: string,
): Promise<RecipeCardData | null> {
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    return null;
  }

  return {
    titleZh: recipe.titleZh,
    titleEn: recipe.titleEn,
    timeMinutes: recipe.timeMinutes,
    difficulty: recipe.difficulty,
    flavor: recipe.flavor,
    mainIngredient: recipe.mainIngredient,
    description: recipe.description,
    tags: recipe.tags,
    slug: recipe.slug,
  };
}
