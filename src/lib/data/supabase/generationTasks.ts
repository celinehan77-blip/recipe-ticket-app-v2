import { getSupabaseClient } from "@/lib/supabase/client";

export type SupabaseGenerationTaskRow = Record<string, unknown>;

export type CreateGenerationTaskInput = {
  userId: string;
  sourceUrl: string;
  sourcePlatform?: string;
};

export async function createGenerationTaskInSupabase({
  userId,
  sourceUrl,
  sourcePlatform = "unknown",
}: CreateGenerationTaskInput): Promise<SupabaseGenerationTaskRow | null> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("generation_tasks")
    .insert({
      user_id: userId,
      source_url: sourceUrl,
      source_platform: sourcePlatform,
      status: "pending",
    })
    .select("*")
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

export async function getGenerationTaskFromSupabase(
  taskId: string,
): Promise<SupabaseGenerationTaskRow | null> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("generation_tasks")
    .select("*")
    .eq("id", taskId)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}
