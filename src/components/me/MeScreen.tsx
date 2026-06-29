"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  ChevronRight,
  Heart,
  NotebookTabs,
  Sparkles,
} from "lucide-react";
import { IosStatusBar } from "@/components/layout/IosStatusBar";
import { IphoneFrame } from "@/components/layout/IphoneFrame";
import { TabBar } from "@/components/layout/TabBar";
import {
  getFavoriteSlugs,
  getLatestGenerationTask,
  getRecipeBySlug,
} from "@/lib/data";

type LocalProfileState = {
  favoriteSlugs: string[];
  generatedRecipeSlug: string | null;
  recentFavoriteTitle: string;
  recentGeneratedTitle: string;
};

const defaultLocalProfileState: LocalProfileState = {
  favoriteSlugs: [],
  generatedRecipeSlug: null,
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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void (async () => {
      const task = getLatestGenerationTask();
      const favoriteSlugs = getFavoriteSlugs();
      const generatedRecipeSlug = task?.generatedRecipeSlug ?? null;
      const favoriteRecipeSlug =
        favoriteSlugs[favoriteSlugs.length - 1] ?? null;

      setLocalProfile({
        favoriteSlugs,
        generatedRecipeSlug,
        recentFavoriteTitle: await getRecipeTitle(favoriteRecipeSlug),
        recentGeneratedTitle: await getRecipeTitle(generatedRecipeSlug),
      });
      })();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const favoriteCount = localProfile.favoriteSlugs.length;
  const generatedCount = localProfile.generatedRecipeSlug ? 1 : 0;
  const recentGeneratedTitle = localProfile.recentGeneratedTitle;
  const recentFavoriteTitle = localProfile.recentFavoriteTitle;

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
        rows: [
          `最近生成：${recentGeneratedTitle}`,
          `来源：${generatedCount > 0 ? "Local Demo" : "暂无"}`,
          `状态：${generatedCount > 0 ? "已完成" : "暂无"}`,
          `最近收藏：${recentFavoriteTitle}`,
        ],
      },
      {
        title: "当前模式",
        icon: Sparkles,
        rows: ["Recipe Ticket MVP", "Local Demo", "数据仅保存在当前浏览器"],
      },
    ],
    [favoriteCount, generatedCount, recentFavoriteTitle, recentGeneratedTitle],
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
