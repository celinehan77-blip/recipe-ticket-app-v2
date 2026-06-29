import { getSupabaseClient } from "@/lib/supabase/client";

export type SupabaseFavoriteRow = Record<string, unknown>;

export async function getFavoriteRecipesFromSupabase(
  userId: string,
): Promise<SupabaseFavoriteRow[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("favorites")
    .select("*, recipes(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function addFavoriteRecipeToSupabase(
  userId: string,
  recipeId: string,
): Promise<SupabaseFavoriteRow | null> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("favorites")
    .insert({ user_id: userId, recipe_id: recipeId })
    .select("*")
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

export async function removeFavoriteRecipeFromSupabase(
  userId: string,
  recipeId: string,
): Promise<boolean> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return false;
  }

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("recipe_id", recipeId);

  return !error;
}
