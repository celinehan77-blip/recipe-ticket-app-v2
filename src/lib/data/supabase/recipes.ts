import { getSupabaseClient } from "@/lib/supabase/client";
import type {
  SupabaseIngredientRow,
  SupabaseRecipeRow,
  SupabaseRecipeStepRow,
} from "@/lib/data/supabase/mappers";

export type SupabaseRecipeDetail = {
  recipe: SupabaseRecipeRow;
  ingredients: SupabaseIngredientRow[];
  steps: SupabaseRecipeStepRow[];
};

export async function getAllRecipesFromSupabase(): Promise<
  SupabaseRecipeRow[]
> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("recipes")
    .select("*, stations(slug)")
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function getRecipeBySlugFromSupabase(
  slug: string,
): Promise<SupabaseRecipeRow | null> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("recipes")
    .select("*, stations(slug)")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

export async function getRecipesByStationSlugFromSupabase(
  stationSlug: string,
): Promise<SupabaseRecipeRow[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("recipes")
    .select("*, stations!inner(slug)")
    .eq("stations.slug", stationSlug)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function getRecipeDetailBySlugFromSupabase(
  slug: string,
): Promise<SupabaseRecipeDetail | null> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return null;
  }

  const recipe = await getRecipeBySlugFromSupabase(slug);

  if (!recipe || typeof recipe.id !== "string") {
    return null;
  }

  const [ingredientsResult, stepsResult] = await Promise.all([
    supabase
      .from("ingredients")
      .select("*")
      .eq("recipe_id", recipe.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("recipe_steps")
      .select("*")
      .eq("recipe_id", recipe.id)
      .order("sort_order", { ascending: true }),
  ]);

  return {
    recipe,
    ingredients: ingredientsResult.error ? [] : ingredientsResult.data ?? [],
    steps: stepsResult.error ? [] : stepsResult.data ?? [],
  };
}
