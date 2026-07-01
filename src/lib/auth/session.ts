import type { Session, User } from "@supabase/supabase-js";
import { getAuthClient, isAuthConfigured } from "@/lib/auth/client";

export async function getCurrentSession(): Promise<Session | null> {
  const supabase = getAuthClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    return null;
  }

  return data.session;
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = getAuthClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return data.user;
}

export async function signInWithEmail(email: string) {
  const supabase = getAuthClient();

  if (!supabase || !isAuthConfigured()) {
    return {
      ok: false,
      message: "当前是 Local Demo，暂未配置 Supabase 登录。",
    };
  }

  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : undefined;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
      shouldCreateUser: true,
    },
  });

  if (error) {
    return {
      ok: false,
      message: error.message || "登录链接发送失败，请稍后再试。",
    };
  }

  return {
    ok: true,
    message: "登录链接已发送，请检查邮箱。",
  };
}

export async function signOut() {
  const supabase = getAuthClient();

  if (!supabase) {
    return {
      ok: false,
      message: "当前未配置 Supabase 登录。",
    };
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      ok: false,
      message: error.message || "退出登录失败，请稍后再试。",
    };
  }

  return {
    ok: true,
    message: "已退出登录。",
  };
}
