"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bookmark,
  ChevronRight,
  Heart,
  LogOut,
  Mail,
  NotebookTabs,
  Sparkles,
  UserRound,
} from "lucide-react";
import { IosStatusBar } from "@/components/layout/IosStatusBar";
import { IphoneFrame } from "@/components/layout/IphoneFrame";
import { TabBar } from "@/components/layout/TabBar";
import { getCurrentProfile, type UserProfile } from "@/lib/auth/profile";
import { signOut } from "@/lib/auth/session";
import {
  getFavoriteSlugs,
  getLatestGenerationTask,
  getRecipeBySlug,
  syncLocalFavoritesToSupabase,
} from "@/lib/data";

type LocalProfileState = {
  favoriteSlugs: string[];
  generatedRecipeSlug: string | null;
  generationStatus: string;
  generationSyncLabel: string;
  recentFavoriteTitle: string;
  recentGeneratedTitle: string;
};

const defaultLocalProfileState: LocalProfileState = {
  favoriteSlugs: [],
  generatedRecipeSlug: null,
  generationStatus: "暂无",
  generationSyncLabel: "本地演示",
  recentFavoriteTitle: "暂无",
  recentGeneratedTitle: "暂无",
};

async function getRecipeTitle(slug: string | null) {
  if (!slug) return "暂无";

  return (await getRecipeBySlug(slug))?.titleZh ?? "暂无";
}

export function MeScreen() {
  const [localProfile, setLocalProfile] = useState<LocalProfileState>(
    defaultLocalProfileState,
  );
  const [authProfile, setAuthProfile] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [isSyncingFavorites, setIsSyncingFavorites] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void (async () => {
        const task = await getLatestGenerationTask();
        const favoriteSlugs = await getFavoriteSlugs();
        const generatedRecipeSlug = task?.generatedRecipeSlug ?? null;
        const favoriteRecipeSlug =
          favoriteSlugs[favoriteSlugs.length - 1] ?? null;

        setLocalProfile({
          favoriteSlugs,
          generatedRecipeSlug,
          generationStatus: task?.status === "completed" ? "已完成" : "暂无",
          generationSyncLabel:
            task?.syncMode === "cloud" ? "云端记录已开启" : "本地演示",
          recentFavoriteTitle: await getRecipeTitle(favoriteRecipeSlug),
          recentGeneratedTitle: await getRecipeTitle(generatedRecipeSlug),
        });
      })();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let active = true;

    void getCurrentProfile().then((profile) => {
      if (!active) return;

      setAuthProfile(profile);
      setAuthReady(true);
    });

    return () => {
      active = false;
    };
  }, []);

  const favoriteCount = localProfile.favoriteSlugs.length;
  const generatedCount = localProfile.generatedRecipeSlug ? 1 : 0;
  const generationStatus = localProfile.generationStatus;
  const generationSyncLabel = localProfile.generationSyncLabel;
  const recentGeneratedTitle = localProfile.recentGeneratedTitle;
  const recentFavoriteTitle = localProfile.recentFavoriteTitle;
  const isLoggedIn = Boolean(authProfile);

  const handleSignOut = async () => {
    const result = await signOut();

    if (result.ok) {
      setAuthProfile(null);
    }

    setAuthMessage(result.message);
  };

  const handleSyncLocalFavorites = async () => {
    setIsSyncingFavorites(true);
    setAuthMessage("");

    const result = await syncLocalFavoritesToSupabase();

    if (result.skipped) {
      setAuthMessage("当前未登录，本地收藏已保留在当前浏览器。");
    } else if (result.ok) {
      setAuthMessage(`已同步 ${result.synced} 个本地收藏。`);
    } else {
      setAuthMessage(
        `已同步 ${result.synced} 个本地收藏，${result.failed} 个稍后可重试。`,
      );
    }

    setIsSyncingFavorites(false);
  };

  const profileSections = useMemo(
    () => [
      {
        title: "我的菜谱",
        icon: Bookmark,
        rows: [`已收藏 ${favoriteCount} 道`, `已生成 ${generatedCount} 道`],
      },
      {
        title: "最近活动",
        icon: NotebookTabs,
        rows: isLoggedIn
          ? [
              `最近生成：${recentGeneratedTitle}`,
              `状态：${generatedCount > 0 ? generationStatus : "暂无"}`,
              `同步：${generatedCount > 0 ? generationSyncLabel : "暂无"}`,
              `最近收藏：${recentFavoriteTitle}`,
            ]
          : [
              `最近生成：${recentGeneratedTitle}`,
              `来源：${generatedCount > 0 ? "本地演示" : "暂无"}`,
              `状态：${generatedCount > 0 ? generationStatus : "暂无"}`,
              `最近收藏：${recentFavoriteTitle}`,
            ],
      },
      {
        title: "当前模式",
        icon: Sparkles,
        rows: ["Recipe Ticket MVP", "Local Demo", "数据仅保存在当前浏览器"],
      },
    ],
    [
      favoriteCount,
      generatedCount,
      generationStatus,
      generationSyncLabel,
      isLoggedIn,
      recentFavoriteTitle,
      recentGeneratedTitle,
    ],
  );

  return (
    <IphoneFrame>
      <IosStatusBar />

      <div className="app-content tab-page-content px-5 pt-3">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          className="pt-2"
        >
          <p className="text-[13px] font-semibold tracking-[0.22em] text-[#8a5a35]/75">
            Profile
          </p>
          <h1 className="font-display mt-1 text-[38px] leading-none tracking-[0.08em] text-[#3a2a1d]">
            我的
          </h1>
          <p className="mt-2 text-[14px] leading-6 text-[#75695f]">
            管理你的菜谱收藏与偏好
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45 }}
          className="mt-7 space-y-2.5"
        >
          <section className="flex items-center gap-3 rounded-[24px] border border-[#d8cabb]/70 bg-[#fffaf2]/42 px-4 py-3">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#fffaf2]/78 text-[#8a5a35] shadow-[0_12px_28px_rgba(78,52,29,0.1)]">
              <Heart size={24} className="fill-[#8a5a35]/12" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-[22px] leading-none tracking-[0.05em] text-[#3a2a1d]">
                日食笔记
              </p>
              <p className="mt-1.5 text-[12px] leading-5 text-[#8a8178]">
                本地演示账号
              </p>
            </div>
          </section>

          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.38 }}
            className="paper-card rounded-[24px] px-3.5 py-3"
          >
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f4eadc] text-[#8a5a35]">
                    {isLoggedIn ? <Mail size={18} /> : <UserRound size={18} />}
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-display text-[18px] tracking-[0.05em] text-[#3a2a1d]">
                      {isLoggedIn ? "已登录" : "当前模式：本地演示"}
                    </h2>
                    <p className="mt-1 truncate text-[12px] leading-5 text-[#75695f]">
                      {authReady
                        ? authProfile?.email ?? "未登录"
                        : "正在检查登录状态"}
                    </p>
                  </div>
                </div>
                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#fffaf2]/70 px-3 text-[12px] font-semibold text-[#8a5a35]"
                  >
                    <LogOut size={14} />
                    退出登录
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="flex h-9 shrink-0 items-center rounded-full bg-[#8a5a35] px-3 text-[12px] font-semibold text-[#fffaf2]"
                  >
                    登录以同步
                  </Link>
                )}
              </div>

              <div className="mt-3 grid gap-1.5">
                {isLoggedIn ? (
                  <>
                    <p className="rounded-full bg-[#fffaf2]/58 px-3 py-1.5 text-[12px] leading-5 text-[#75695f]">
                      用户邮箱：{authProfile?.email ?? "暂无"}
                    </p>
                    <p className="rounded-full bg-[#fffaf2]/58 px-3 py-1.5 text-[12px] leading-5 text-[#75695f]">
                      云端收藏同步：已开启
                    </p>
                    <p className="rounded-full bg-[#fffaf2]/58 px-3 py-1.5 text-[12px] leading-5 text-[#75695f]">
                      本地收藏会保留作为兜底
                    </p>
                    <button
                      type="button"
                      onClick={handleSyncLocalFavorites}
                      disabled={isSyncingFavorites}
                      className="h-9 rounded-full bg-[#8b9a7a] px-3 text-[12px] font-semibold text-[#fffaf2] disabled:opacity-70"
                    >
                      {isSyncingFavorites ? "同步中" : "同步本地收藏"}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="rounded-full bg-[#fffaf2]/58 px-3 py-1.5 text-[12px] leading-5 text-[#75695f]">
                      未登录
                    </p>
                    <p className="rounded-full bg-[#fffaf2]/58 px-3 py-1.5 text-[12px] leading-5 text-[#75695f]">
                      收藏仅保存在当前浏览器
                    </p>
                    <p className="rounded-full bg-[#fffaf2]/58 px-3 py-1.5 text-[12px] leading-5 text-[#75695f]">
                      登录后可用于云端同步
                    </p>
                  </>
                )}
                {authMessage ? (
                  <p className="rounded-full bg-[#fffaf2]/58 px-3 py-1.5 text-[12px] leading-5 text-[#8a5a35]">
                    {authMessage}
                  </p>
                ) : null}
              </div>
            </div>
          </motion.section>

          {profileSections.map((section, index) => {
            const Icon = section.icon;

            return (
              <motion.article
                key={section.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.05, duration: 0.38 }}
                className="paper-card rounded-[24px] px-3.5 py-3"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-[#f4eadc] text-[#8a5a35]">
                        <Icon size={18} />
                      </span>
                      <h2 className="font-display text-[18px] tracking-[0.05em] text-[#3a2a1d]">
                        {section.title}
                      </h2>
                    </div>
                    <ChevronRight size={17} className="text-[#8a8178]" />
                  </div>

                  <div className="mt-3 grid gap-1.5">
                    {section.rows.map((row) => (
                      <p
                        key={row}
                        className="rounded-full bg-[#fffaf2]/58 px-3 py-1.5 text-[12px] leading-5 text-[#75695f]"
                      >
                        {row}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>

      <TabBar current="profile" />
    </IphoneFrame>
  );
}
