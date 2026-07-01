import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function getAuthClient() {
  return getSupabaseClient();
}

export function isAuthConfigured() {
  return isSupabaseConfigured();
}
