"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Link2,
  ScanLine,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { IosStatusBar } from "@/components/layout/IosStatusBar";
import { IphoneFrame } from "@/components/layout/IphoneFrame";
import { TabBar } from "@/components/layout/TabBar";
import { LeafMark } from "@/components/ui/LeafMark";
import { recentRecipes } from "@/lib/mockData";

export function HomeScreen() {
  return (
    <IphoneFrame>
      <IosStatusBar />

      <div className="app-content tab-page-content flex flex-col px-7">
        <div className="flex justify-end">
          <button
            aria-label="更多设置"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/45 text-[#8a5a35] shadow-[0_14px_34px_rgba(74,48,27,0.08)]"
          >
            <Settings2 size={18} />
          </button>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="pt-20 text-center"
        >
          <LeafMark />
          <h1 className="font-display mt-7 text-[38px] leading-[1.22] tracking-[0.06em] text-[#5a3a20]">
            收藏每一道
            <br />
            属于你的好味道
          </h1>
          <p className="mt-5 text-[17px] font-medium leading-8 tracking-[0.08em] text-[#a2968a]">
            粘贴视频链接，生成干净菜谱
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass-panel mt-10 rounded-[28px] p-5"
        >
          <div className="flex h-[70px] items-center gap-4 rounded-[22px] border border-[#ded3c7]/70 bg-white/42 px-5 text-[#b4aaa1] shadow-inner">
            <Link2 size={23} />
            <span className="flex-1 text-left text-[18px] font-semibold tracking-[0.03em]">
              粘贴小红书 / 抖音链接
            </span>
            <ScanLine size={24} className="text-[#7c5638]" />
          </div>

          <Link href="/loading" className="block">
            <motion.div
              whileTap={{ scale: 0.985 }}
              className="mt-5 flex h-[64px] items-center justify-center rounded-[20px] bg-gradient-to-r from-[#8a4f1f] via-[#955d28] to-[#8a4f1f] text-[20px] font-semibold tracking-[0.08em] text-white shadow-[0_18px_34px_rgba(104,61,24,0.28)]"
            >
              <span className="flex-1 text-center">生成菜谱</span>
              <span className="mr-3 grid h-10 w-10 place-items-center rounded-full bg-white/16">
                <ArrowRight size={22} />
              </span>
            </motion.div>
          </Link>
        </motion.section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.34, duration: 0.6 }}
          className="mt-6 flex items-center justify-center gap-3 text-[14px] font-medium text-[#9b9086]"
        >
          <ShieldCheck size={17} className="fill-[#8b9a7a] text-[#8b9a7a]" />
          <span>仅识别公开内容</span>
          <span>·</span>
          <span>安全</span>
          <span>·</span>
          <span>无广告</span>
        </motion.div>

        <section className="mt-auto pt-10">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-[21px] tracking-[0.08em] text-[#5a3a20]">
              最近生成
            </h2>
            <Link
              href="/flavor-map"
              className="text-[13px] font-medium text-[#9a7b58]"
            >
              查看风味地图
            </Link>
          </div>
          <div className="grid gap-2">
            {recentRecipes.map((recipe) => (
              <div
                key={recipe.title}
                className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/38 px-4 py-3 text-sm text-[#78685c]"
              >
                <span className="font-display text-[17px] text-[#4d3521]">
                  {recipe.title}
                </span>
                <span>{recipe.subtitle}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <TabBar current="home" />
    </IphoneFrame>
  );
}
