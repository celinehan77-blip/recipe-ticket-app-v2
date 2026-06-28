"use client";

import { motion } from "framer-motion";
import { Bookmark, ChevronRight, Heart, Settings2, Sparkles } from "lucide-react";
import { IosStatusBar } from "@/components/layout/IosStatusBar";
import { IphoneFrame } from "@/components/layout/IphoneFrame";
import { TabBar } from "@/components/layout/TabBar";

const profileSections = [
  {
    title: "我的菜谱",
    icon: Bookmark,
    rows: ["已收藏 1 道", "已生成 1 道"],
  },
  {
    title: "偏好设置",
    icon: Settings2,
    rows: ["口味偏好", "常用食材", "饮食习惯"],
  },
  {
    title: "版本说明",
    icon: Sparkles,
    rows: ["Recipe Ticket MVP", "Local Demo"],
  },
];

export function MeScreen() {
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

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45 }}
          className="paper-card mt-7 rounded-[26px] px-4 py-4"
        >
          <div className="relative z-10 space-y-2.5">
            <div className="flex items-center gap-3 border-b border-[#d8cabb]/70 pb-4">
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
            </div>

            {profileSections.map((section) => {
              const Icon = section.icon;

              return (
                <article
                  key={section.title}
                  className="rounded-[22px] bg-[#fffaf2]/42 px-3.5 py-3"
                >
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
                </article>
              );
            })}
          </div>
        </motion.section>
      </div>

      <TabBar current="profile" />
    </IphoneFrame>
  );
}
