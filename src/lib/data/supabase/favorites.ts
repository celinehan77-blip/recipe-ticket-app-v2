import { getSupabaseClient } from "@/lib/supabase/client";
import {
  mapSupabaseRecipeToRecipe,
  type SupabaseRecipeRow,
} from "@/lib/data/supabase/mappers";
import type { Recipe } from "@/types";

type FavoriteRecipeJoinRow = {
  recipes?: SupabaseRecipeRow | SupabaseRecipeRow[] | null;
};

type SupabaseResult<T> = {
  data: T;
  ok: boolean;
};

function getJoinedRecipe(row: FavoriteRecipeJoinRow): SupabaseRecipeRow | null {
  if (Array.isArray(row.recipes)) {
    return row.recipes[0] ?? null;
  }

  return row.recipes ?? null;
}

async function getRecipeIdBySlug(recipeSlug: string): Promise<string | null> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("recipes")
    .select("id")
    .eq("slug", recipeSlug)
    .maybeSingle<{ id: string }>();

  if (error || !data?.id) {
    return null;
  }

  return data.id;
}

export async function tryGetFavoriteRecipesFromSupabase(
  userId: string,
): Promise<SupabaseResult<Recipe[]>> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { data: [], ok: false };
  }

  const { data, error } = await supabase
    .from("favorites")
    .select("recipes(*, stations(slug))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], ok: false };
  }

  const recipes = (data ?? [])
    .map((row) => getJoinedRecipe(row as FavoriteRecipeJoinRow))
    .filter((recipe): recipe is SupabaseRecipeRow => Boolean(recipe))
    .map(mapSupabaseRecipeToRecipe)
    .filter((recipe): recipe is Recipe => Boolean(recipe));

  return { data: recipes, ok: true };
}

export async function getFavoriteRecipesFromSupabase(
  userId: string,
): Promise<Recipe[]> {
  return (await tryGetFavoriteRecipesFromSupabase(userId)).data;
}

export async function tryGetFavoriteSlugsFromSupabase(
  userId: string,
): Promise<SupabaseResult<string[]>> {
  const favoriteRecipes = await tryGetFavoriteRecipesFromSupabase(userId);

  return {
    data: favoriteRecipes.data.map((recipe) => recipe.slug),
    ok: favoriteRecipes.ok,
  };
}

export async function getFavoriteSlugsFromSupabase(
  userId: string,
): Promise<string[]> {
  return (await tryGetFavoriteSlugsFromSupabase(userId)).data;
}

export async function tryAddFavoriteRecipeToSupabase(
  userId: string,
  recipeSlug: string,
): Promise<SupabaseResult<boolean>> {
  const supabase = getSupabaseClient();
  const recipeId = await getRecipeIdBySlug(recipeSlug);

  if (!supabase || !recipeId) {
    return { data: false, ok: false };
  }

  const { error } = await supabase.from("favorites").upsert(
    {
      user_id: userId,
      recipe_id: recipeId,
    },
    {
      ignoreDuplicates: true,
      onConflict: "user_id,recipe_id",
    },
  );

  if (error) {
    return { data: false, ok: false };
  }

  return { data: true, ok: true };
}

export async function addFavoriteRecipeToSupabase(
  userId: string,
  recipeSlug: string,
): Promise<boolean> {
  return (await tryAddFavoriteRecipeToSupabase(userId, recipeSlug)).data;
}

export async function tryRemoveFavoriteRecipeFromSupabase(
  userId: string,
  recipeSlug: string,
): Promise<SupabaseResult<boolean>> {
  const supabase = getSupabaseClient();
  const recipeId = await getRecipeIdBySlug(recipeSlug);

  if (!supabase || !recipeId) {
    return { data: false, ok: false };
  }

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("recipe_id", recipeId);

  if (error) {
    return { data: false, ok: false };
  }

  return { data: true, ok: true };
}

export async function removeFavoriteRecipeFromSupabase(
  userId: string,
  recipeSlug: string,
): Promise<boolean> {
  return (await tryRemoveFavoriteRecipeFromSupabase(userId, recipeSlug)).data;
}

export async function tryIsRecipeFavoriteInSupabase(
  userId: string,
  recipeSlug: string,
): Promise<SupabaseResult<boolean>> {
  const supabase = getSupabaseClient();
  const recipeId = await getRecipeIdBySlug(recipeSlug);

  if (!supabase || !recipeId) {
    return { data: false, ok: false };
  }

  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("recipe_id", recipeId)
    .maybeSingle<{ id: string }>();

  if (error) {
    return { data: false, ok: false };
  }

  return { data: Boolean(data), ok: true };
}

export async function isRecipeFavoriteInSupabase(
  userId: string,
  recipeSlug: string,
): Promise<boolean> {
  return (await tryIsRecipeFavoriteInSupabase(userId, recipeSlug)).data;
}
