import { getSupabaseClient } from "@/lib/supabase/client";

export type SupabaseGenerationTaskStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type SupabaseGenerationTaskRow = {
  id: string;
  user_id: string | null;
  source_url: string;
  source_platform: string | null;
  status: SupabaseGenerationTaskStatus;
  generated_recipe_id: string | null;
  error_message: string | null;
  created_at: string | null;
  completed_at: string | null;
};

type SupabaseResult<T> = {
  data: T;
  ok: boolean;
};

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

async function getRecipeSlugById(recipeId: string): Promise<string | null> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("recipes")
    .select("slug")
    .eq("id", recipeId)
    .maybeSingle<{ slug: string }>();

  if (error || !data?.slug) {
    return null;
  }

  return data.slug;
}

export async function tryCreateGenerationTaskInSupabase(
  userId: string,
  sourceUrl: string,
  sourcePlatform = "mock",
): Promise<SupabaseResult<SupabaseGenerationTaskRow | null>> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { data: null, ok: false };
  }

  const { data, error } = await supabase
    .from("generation_tasks")
    .insert({
      user_id: userId,
      source_url: sourceUrl,
      source_platform: sourcePlatform,
      status: "processing",
      generated_recipe_id: null,
      error_message: null,
    })
    .select("*")
    .maybeSingle<SupabaseGenerationTaskRow>();

  if (error) {
    return { data: null, ok: false };
  }

  return { data, ok: true };
}

export async function createGenerationTaskInSupabase(
  userId: string,
  sourceUrl: string,
  sourcePlatform = "mock",
): Promise<SupabaseGenerationTaskRow | null> {
  return (await tryCreateGenerationTaskInSupabase(userId, sourceUrl, sourcePlatform))
    .data;
}

export async function tryCompleteGenerationTaskInSupabase(
  taskId: string,
  generatedRecipeSlug: string,
): Promise<SupabaseResult<boolean>> {
  const supabase = getSupabaseClient();
  const recipeId = await getRecipeIdBySlug(generatedRecipeSlug);

  if (!supabase || !recipeId) {
    return { data: false, ok: false };
  }

  const { data, error } = await supabase
    .from("generation_tasks")
    .update({
      status: "completed",
      generated_recipe_id: recipeId,
      error_message: null,
      completed_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .select("id")
    .maybeSingle<{ id: string }>();

  if (error || !data?.id) {
    return { data: false, ok: false };
  }

  return { data: true, ok: true };
}

export async function tryFailGenerationTaskInSupabase(
  taskId: string,
  errorCode: string,
): Promise<SupabaseResult<boolean>> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { data: false, ok: false };
  }

  const { data, error } = await supabase
    .from("generation_tasks")
    .update({
      status: "failed",
      generated_recipe_id: null,
      error_message: errorCode,
      completed_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .select("id")
    .maybeSingle<{ id: string }>();

  if (error || !data?.id) {
    return { data: false, ok: false };
  }

  return { data: true, ok: true };
}

export async function completeGenerationTaskInSupabase(
  taskId: string,
  generatedRecipeSlug: string,
): Promise<boolean> {
  return (
    await tryCompleteGenerationTaskInSupabase(taskId, generatedRecipeSlug)
  ).data;
}

export async function tryGetLatestGenerationTaskFromSupabase(
  userId: string,
): Promise<SupabaseResult<SupabaseGenerationTaskRow | null>> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { data: null, ok: false };
  }

  const { data, error } = await supabase
    .from("generation_tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<SupabaseGenerationTaskRow>();

  if (error) {
    return { data: null, ok: false };
  }

  return { data, ok: true };
}

export async function getLatestGenerationTaskFromSupabase(
  userId: string,
): Promise<SupabaseGenerationTaskRow | null> {
  return (await tryGetLatestGenerationTaskFromSupabase(userId)).data;
}

export async function tryGetLatestGeneratedRecipeSlugFromSupabase(
  userId: string,
): Promise<SupabaseResult<string | null>> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { data: null, ok: false };
  }

  const { data, error } = await supabase
    .from("generation_tasks")
    .select("generated_recipe_id")
    .eq("user_id", userId)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ generated_recipe_id: string | null }>();

  if (error) {
    return { data: null, ok: false };
  }

  if (!data?.generated_recipe_id) {
    return { data: null, ok: true };
  }

  return { data: await getRecipeSlugById(data.generated_recipe_id), ok: true };
}

export async function getLatestGeneratedRecipeSlugFromSupabase(
  userId: string,
): Promise<string | null> {
  return (await tryGetLatestGeneratedRecipeSlugFromSupabase(userId)).data;
}
