import type { Session, User } from "@supabase/supabase-js";
import { getAuthClient, isAuthConfigured } from "@/lib/auth/client";

export type AuthSendErrorCode =
  | "over_email_send_rate_limit"
  | "over_request_rate_limit"
  | "invalid_email"
  | "redirect_not_allowed"
  | "unknown_error";

type AuthErrorLike = {
  code?: string;
  message?: string;
  name?: string;
  status?: number;
};

export type SignInWithEmailResult = {
  ok: boolean;
  message: string;
  errorCode?: AuthSendErrorCode;
};

export function classifyAuthSendError(error: AuthErrorLike): AuthSendErrorCode {
  const code = error.code?.toLowerCase() ?? "";
  const message = error.message?.toLowerCase() ?? "";
  const name = error.name?.toLowerCase() ?? "";
  const combined = `${code} ${message} ${name}`;

  if (
    code === "over_email_send_rate_limit" ||
    /email.*rate limit|rate limit.*email|email rate limit exceeded/.test(
      combined,
    )
  ) {
    return "over_email_send_rate_limit";
  }

  if (
    code === "over_request_rate_limit" ||
    error.status === 429 ||
    /too many requests|rate limit exceeded|request rate limit/.test(combined)
  ) {
    return "over_request_rate_limit";
  }

  if (/invalid.*email|email.*invalid/.test(combined)) {
    return "invalid_email";
  }

  if (
    /redirect.*not.*allowed|not.*allowed.*redirect|redirect.*url/.test(combined)
  ) {
    return "redirect_not_allowed";
  }

  return "unknown_error";
}

export function getAuthSendErrorMessage(errorCode: AuthSendErrorCode) {
  if (
    errorCode === "over_email_send_rate_limit" ||
    errorCode === "over_request_rate_limit"
  ) {
    return "登录邮件发送过于频繁，请稍后再试。";
  }

  if (errorCode === "invalid_email") {
    return "请输入有效的邮箱地址。";
  }

  if (errorCode === "redirect_not_allowed") {
    return "登录回跳地址未被允许，请检查登录配置。";
  }

  return "登录链接发送失败，请稍后再试。";
}

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

export async function signInWithEmail(
  email: string,
): Promise<SignInWithEmailResult> {
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
    const errorCode = classifyAuthSendError(error);

    return {
      ok: false,
      message: getAuthSendErrorMessage(errorCode),
      errorCode,
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
