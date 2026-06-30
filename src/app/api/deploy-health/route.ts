import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

async function getTableCount(tableName: "stations" | "recipes") {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { count: 0, ok: false };
  }

  const { count, error } = await supabase
    .from(tableName)
    .select("*", { count: "exact", head: true });

  return {
    count: count ?? 0,
    ok: !error,
  };
}

export async function GET() {
  const configured = isSupabaseConfigured();
  const [stations, recipes] = await Promise.all([
    getTableCount("stations"),
    getTableCount("recipes"),
  ]);

  return Response.json({
    supabaseConfigured: configured,
    stationsCount: stations.count,
    recipesCount: recipes.count,
    stationsReadable: stations.ok,
    recipesReadable: recipes.ok,
    fallbackRetained: true,
  });
}
