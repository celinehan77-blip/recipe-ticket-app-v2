"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import type { EmailOtpType } from "@supabase/supabase-js";
import { IosStatusBar } from "@/components/layout/IosStatusBar";
import { IphoneFrame } from "@/components/layout/IphoneFrame";
import { getAuthClient } from "@/lib/auth/client";
import { syncLocalFavoritesToSupabase } from "@/lib/data";

const FAVORITE_SYNC_KEY_PREFIX = "recipe-ticket:favorites-synced-at";

function getFavoriteSyncKey(userId: string) {
  return `${FAVORITE_SYNC_KEY_PREFIX}:${userId}`;
}

async function syncFavoritesOnceAfterLogin(userId: string) {
  if (typeof window === "undefined") return;

  const syncKey = getFavoriteSyncKey(userId);

  if (window.localStorage.getItem(syncKey)) {
    return;
  }

  const result = await syncLocalFavoritesToSupabase();

  if (!result.skipped) {
    window.localStorage.setItem(syncKey, new Date().toISOString());
  }
}

export function AuthCallbackScreen() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    const handleCallback = async () => {
      const supabase = getAuthClient();

      if (!supabase) {
        setErrorMessage("当前未配置 Supabase 登录。");
        return;
      }

      const currentUrl = new URL(window.location.href);
      const code = currentUrl.searchParams.get("code");
      const tokenHash = currentUrl.searchParams.get("token_hash");
      const type = currentUrl.searchParams.get("type") as EmailOtpType | null;

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          if (active) {
            setErrorMessage(error.message || "登录回调处理失败。");
          }
          return;
        }
      } else if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type,
        });

        if (error) {
          if (active) {
            setErrorMessage(error.message || "登录回调处理失败。");
          }
          return;
        }
      } else {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          if (active) {
            setErrorMessage("登录链接无效或已过期，请重新发送。");
          }
          return;
        }
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.id) {
        await syncFavoritesOnceAfterLogin(user.id);
      }

      if (active) {
        router.replace("/me");
      }
    };

    void handleCallback();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <IphoneFrame>
      <IosStatusBar />

      <div className="app-content flex flex-col items-center justify-center px-6 text-center">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="paper-card rounded-[28px] px-5 py-7"
        >
          <div className="relative z-10">
            {errorMessage ? (
              <>
                <h1 className="font-display text-[28px] tracking-[0.06em] text-[#3a2a1d]">
                  登录未完成
                </h1>
                <p className="mt-3 text-[13px] leading-6 text-[#a15f45]">
                  {errorMessage}
                </p>
                <Link
                  href="/login"
                  className="mx-auto mt-5 flex h-11 w-[142px] items-center justify-center gap-1.5 rounded-full bg-[#8a5a35] text-[14px] font-semibold text-[#fffaf2]"
                >
                  重新登录
                  <ArrowRight size={16} />
                </Link>
              </>
            ) : (
              <>
                <Loader2
                  size={28}
                  className="mx-auto animate-spin text-[#8a5a35]"
                />
                <h1 className="font-display mt-5 text-[28px] tracking-[0.06em] text-[#3a2a1d]">
                  正在登录
                </h1>
                <p className="mt-3 text-[13px] leading-6 text-[#75695f]">
                  正在确认你的邮箱登录链接
                </p>
              </>
            )}
          </div>
        </motion.section>
      </div>
    </IphoneFrame>
  );
}
