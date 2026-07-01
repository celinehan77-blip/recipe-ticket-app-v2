import type { User } from "@supabase/supabase-js";
import { getAuthClient } from "@/lib/auth/client";
import { getCurrentUser } from "@/lib/auth/session";

export type UserProfile = {
  id: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
};

type ProfileRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

export function mapUserToLocalProfile(user: User): UserProfile {
  return {
    id: user.id,
    email: user.email ?? null,
    displayName: null,
    avatarUrl: null,
  };
}

export async function getCurrentProfile(): Promise<UserProfile | null> {
  const supabase = getAuthClient();
  const user = await getCurrentUser();

  if (!supabase || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,display_name,avatar_url")
    .eq("id", user.id)
    .maybeSingle<ProfileRow>();

  if (error || !data) {
    return mapUserToLocalProfile(user);
  }

  return {
    id: data.id,
    email: data.email ?? user.email ?? null,
    displayName: data.display_name,
    avatarUrl: data.avatar_url,
  };
}
