import { getSupabaseClient } from "@/lib/supabase/client";
import type { SupabaseStationRow } from "@/lib/data/supabase/mappers";

export async function getAllStationsFromSupabase(): Promise<
  SupabaseStationRow[]
> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("stations")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function getStationBySlugFromSupabase(
  slug: string,
): Promise<SupabaseStationRow | null> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("stations")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}
