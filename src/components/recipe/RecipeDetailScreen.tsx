"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  Bookmark,
  ChefHat,
  ChevronDown,
  ChevronLeft,
  Clock3,
  Flame,
  Heart,
  MoreHorizontal,
  NotebookPen,
  Share2,
} from "lucide-react";
import { IosStatusBar } from "@/components/layout/IosStatusBar";
import { IphoneFrame } from "@/components/layout/IphoneFrame";
import { kungPaoRecipe } from "@/lib/mockData";
import type { IngredientGroup } from "@/types";

type RecipeDetailScreenProps = {
  backHref: string;
};

const statIcons = [Clock3, BarChart3, Flame, ChefHat, Heart];

const peanutDots = [
  ["18%", "34%"],
  ["31%", "25%"],
  ["46%", "32%"],
  ["62%", "25%"],
  ["73%", "39%"],
  ["27%", "48%"],
  ["54%", "50%"],
  ["42%", "64%"],
  ["66%", "63%"],
];

const pepperDots = [
  ["20%", "38%"],
  ["28%", "58%"],
  ["48%", "28%"],
  ["58%", "52%"],
  ["74%", "40%"],
  ["68%", "70%"],
  ["39%", "76%"],
];

function FoodStillLife() {
  return (
    <div className="pointer-events-none absolute -right-10 top-[54px] h-[276px] w-[264px]">
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[#8b9a7a]/20 blur-2xl" />
      <div className="absolute right-5 top-0 h-24 w-28 rotate-[18deg] rounded-[999px] border-t-[10px] border-[#8b9a7a]/35 blur-[1px]" />
      <div className="absolute right-2 top-8 h-20 w-24 rotate-[-20deg] rounded-[999px] border-t-[9px] border-[#8b9a7a]/25 blur-[1px]" />

      <div className="absolute right-8 top-[68px] h-[106px] w-[116px] rounded-full border border-[#b69573]/35 bg-[#e8d7bf] shadow-[0_18px_38px_rgba(80,52,32,0.14)]">
        <div className="absolute inset-3 rounded-full bg-[#f7ead9]" />
        {peanutDots.map(([left, top], index) => (
          <span
            key={`hero-peanut-${index}`}
            className="absolute z-10 h-4 w-6 rotate-[-18deg] rounded-[999px] bg-[#c98c4f] shadow-inner"
            style={{ left, top }}
          />
        ))}
      </div>

      <div className="absolute right-[78px] top-[140px] h-[116px] w-[144px] rotate-[8deg] rounded-full border border-[#b69573]/35 bg-[#e8d6bf] shadow-[0_18px_38px_rgba(80,52,32,0.16)]">
        <div className="absolute inset-3 rounded-full bg-[#fbefe0]" />
        {[
          ["24%", "34%", "-10deg"],
          ["43%", "28%", "9deg"],
          ["59%", "40%", "-14deg"],
          ["33%", "55%", "12deg"],
          ["53%", "62%", "-8deg"],
        ].map(([left, top, rotate], index) => (
          <span
            key={`hero-chicken-${index}`}
            className="absolute z-10 h-9 w-11 rounded-[18px] bg-[#f2b59c] shadow-[inset_0_-6px_12px_rgba(182,102,72,0.18)]"
            style={{ left, top, transform: `rotate(${rotate})` }}
          />
        ))}
      </div>

      {[
        ["34px", "98px", "-28deg"],
        ["58px", "128px", "-12deg"],
        ["24px", "156px", "16deg"],
        ["84px", "105px", "22deg"],
        ["78px", "182px", "-35deg"],
      ].map(([left, top, rotate], index) => (
        <span
          key={`hero-chili-${index}`}
          className="absolute h-4 w-20 rounded-full bg-gradient-to-r from-[#8e1f16] via-[#c93022] to-[#8e1f16] shadow-[0_5px_10px_rgba(106,28,18,0.18)]"
          style={{ left, top, transform: `rotate(${rotate})` }}
        />
      ))}

      <span className="absolute bottom-6 right-2 h-3 w-[120px] rotate-[-20deg] rounded-full bg-[#86a25d]" />
      <span className="absolute bottom-2 right-10 h-3 w-32 rotate-[-24deg] rounded-full bg-[#6f924d]" />

      {pepperDots.map(([left, top], index) => (
        <span
          key={`hero-pepper-${index}`}
          className="absolute h-2.5 w-2.5 rounded-full bg-[#63412c] shadow-[0_2px_4px_rgba(80,52,32,0.2)]"
          style={{ left, top }}
        />
      ))}
    </div>
  );
}

function IngredientArt({ id }: { id: IngredientGroup["id"] }) {
  if (id === "main") {
    return (
      <div className="relative mt-4 h-[92px] overflow-hidden rounded-[18px] bg-[#ead8c1]">
        <div className="absolute left-5 top-7 h-16 w-24 rounded-full bg-[#f8eadb] shadow-inner" />
        {[
          ["38px", "42px", "-10deg"],
          ["61px", "35px", "12deg"],
          ["82px", "48px", "-4deg"],
          ["50px", "58px", "8deg"],
        ].map(([left, top, rotate], index) => (
          <span
            key={`main-${index}`}
            className="absolute h-7 w-9 rounded-[14px] bg-[#efad92]"
            style={{ left, top, transform: `rotate(${rotate})` }}
          />
        ))}
        <span className="absolute right-8 top-8 h-8 w-8 rounded-full bg-[#8b9a7a]/75" />
        <span className="absolute right-4 top-11 h-9 w-4 rotate-[42deg] rounded-full bg-[#8b9a7a]/65" />
      </div>
    );
  }

  if (id === "side") {
    return (
      <div className="relative mt-4 h-[92px] overflow-hidden rounded-[18px] bg-[#efe1cf]">
        <div className="absolute right-4 top-4 h-12 w-14 rounded-full bg-[#f8ecd9] shadow-inner" />
        {peanutDots.slice(0, 6).map(([left, top], index) => (
          <span
            key={`side-peanut-${index}`}
            className="absolute h-3 w-5 rotate-[-18deg] rounded-full bg-[#c98c4f]"
            style={{ left, top }}
          />
        ))}
        <span className="absolute left-5 top-[52px] h-3 w-16 rotate-[-22deg] rounded-full bg-[#b92a1f]" />
        <span className="absolute left-8 top-[68px] h-3 w-14 rotate-[18deg] rounded-full bg-[#cb3726]" />
        <span className="absolute bottom-3 right-9 h-3 w-12 rotate-[-8deg] rounded-full bg-[#7e9f55]" />
      </div>
    );
  }

  return (
    <div className="relative mt-4 h-[92px] overflow-hidden rounded-[18px] bg-[#f0e2d1]">
      {[
        ["20px", "22px", "#5b2c1b"],
        ["64px", "22px", "#b63720"],
        ["45px", "55px", "#d68c36"],
        ["88px", "55px", "#f5f0e8"],
      ].map(([left, top, color], index) => (
        <span
          key={`seasoning-${index}`}
          className="absolute h-9 w-9 rounded-full border-[5px] border-[#f8efe4] shadow-[0_8px_16px_rgba(80,52,32,0.12)]"
          style={{ left, top, backgroundColor: color }}
        />
      ))}
    </div>
  );
}

function StepThumb({ index }: { index: number }) {
  const tones = [
    "bg-[#f0b69b]",
    "bg-[#7a2e1d]",
    "bg-[#c53a28]",
    "bg-[#d77a35]",
    "bg-[#a54824]",
  ];

  return (
    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-[18px] bg-[#efe3d3] shadow-inner">
      <span className={`absolute left-3 top-4 h-5 w-9 rounded-full ${tones[index]}`} />
      <span className="absolute right-3 top-3 h-3 w-3 rounded-full bg-[#c98c4f]" />
      <span className="absolute bottom-2 left-6 h-2 w-8 rounded-full bg-[#8b9a7a]" />
    </div>
  );
}

export function RecipeDetailScreen({ backHref }: RecipeDetailScreenProps) {
  return (
    <IphoneFrame>
      <IosStatusBar />

      <div className="app-content pb-28">
        <section className="relative min-h-[376px] px-7 pt-5">
          <div className="relative z-30 flex items-center justify-between">
            <Link
              href={backHref}
              aria-label="返回"
                className="grid h-12 w-12 place-items-center rounded-full bg-white/56 text-[#7b634e] shadow-[0_16px_40px_rgba(82,55,34,0.1)]"
            >
              <ChevronLeft size={26} />
            </Link>
            <div className="flex gap-3">
              <button
                aria-label="收藏"
                className="grid h-12 w-12 place-items-center rounded-full bg-white/56 text-[#7b634e]"
              >
                <Bookmark size={21} />
              </button>
              <button
                aria-label="更多"
                className="grid h-12 w-12 place-items-center rounded-full bg-white/56 text-[#7b634e]"
              >
                <MoreHorizontal size={23} />
              </button>
            </div>
          </div>

          <FoodStillLife />

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 mt-10"
          >
            <p className="font-display text-[62px] leading-none text-[#c9b9a9]">
              {kungPaoRecipe.no}
            </p>
            <div className="mt-2 h-px w-14 bg-[#8b9a7a]" />
            <h1 className="font-display mt-5 text-[42px] leading-none tracking-[0.1em] text-[#3a2a1d]">
              {kungPaoRecipe.title}
            </h1>
            <p className="mt-3 font-serif text-[22px] leading-none text-[#a57956]">
              {kungPaoRecipe.englishTitle}
            </p>
            <p className="mt-5 max-w-[248px] text-[15px] leading-7 text-[#75695f]">
              {kungPaoRecipe.description}
            </p>
            <span className="mt-4 inline-flex rounded-full border border-[#9aa583] px-4 py-1 text-[13px] font-medium text-[#6f7d5a]">
              {kungPaoRecipe.tag}
            </span>
          </motion.div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.6 }}
          className="glass-panel mx-5 -mt-2 grid grid-cols-5 rounded-[24px] px-2 py-3"
        >
          {kungPaoRecipe.stats.map((stat, index) => {
            const Icon = statIcons[index];
            return (
              <div
                key={stat.label}
                className="flex min-h-[72px] flex-col items-center justify-center border-r border-[#d8cabb]/55 px-1 text-center last:border-r-0"
              >
                <Icon size={20} className="text-[#8a8178]" />
                <p className="mt-1.5 text-[10px] text-[#8a8178]">{stat.label}</p>
                <p className="mt-1 text-[17px] font-semibold leading-tight text-[#6f7d55]">
                  {stat.value}
                </p>
                {stat.suffix ? (
                  <p className="text-[10px] font-medium text-[#6f7d55]">
                    {stat.suffix}
                  </p>
                ) : null}
              </div>
            );
          })}
        </motion.section>

        <section className="mt-6 px-5">
          <div className="mb-4 flex items-end justify-between px-1">
            <div>
              <h2 className="font-display text-[23px] tracking-[0.08em] text-[#3a2a1d]">
                食材准备
              </h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-[#8b9a7a]" />
            </div>
            <button className="flex items-center gap-1 text-[15px] text-[#5a4636]">
              {kungPaoRecipe.servings}
              <ChevronDown size={17} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {kungPaoRecipe.ingredientGroups.map((group, index) => (
              <motion.article
                key={group.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.08, duration: 0.45 }}
                className="paper-card rounded-[20px] p-3.5"
              >
                <div className="relative z-10">
                  <h3 className="font-display text-[19px] tracking-[0.06em] text-[#3a2a1d]">
                    {group.title}
                  </h3>
                  <div className="mt-3 space-y-1">
                    {group.items.map((item) => (
                      <p
                        key={`${group.id}-${item.name}`}
                        className="text-[12px] leading-[18px] text-[#69594b]"
                      >
                        {item.name} {item.amount}
                      </p>
                    ))}
                  </div>
                  <IngredientArt id={group.id} />
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mt-6 px-5">
          <div className="mb-4 px-1">
            <h2 className="font-display text-[23px] tracking-[0.08em] text-[#3a2a1d]">
              烹饪步骤
            </h2>
            <div className="mt-2 h-1 w-12 rounded-full bg-[#8b9a7a]" />
          </div>

          <div className="glass-panel rounded-[22px] px-4 py-3">
            {kungPaoRecipe.steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.05, duration: 0.42 }}
                className="relative flex gap-3 border-b border-[#dfd1c1]/75 py-2.5 last:border-b-0"
              >
                {index < kungPaoRecipe.steps.length - 1 ? (
                  <span className="absolute left-[15px] top-11 h-[72px] border-l border-dashed border-[#c9bcae]" />
                ) : null}
                <span className="relative z-10 mt-2 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#7d8d61] text-[14px] font-semibold text-white">
                  {index + 1}
                </span>
                <StepThumb index={index} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-[19px] leading-7 text-[#3a2a1d]">
                      {step.title}
                    </h3>
                    <span className="shrink-0 rounded-full bg-white/60 px-3 py-1 text-[13px] font-medium text-[#6a5748]">
                      {step.minutes}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] leading-5 text-[#8a8178]">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <div className="safe-bottom absolute inset-x-0 bottom-0 z-40 mx-auto px-4">
        <div className="glass-panel grid h-[72px] grid-cols-[1fr_1fr_1.7fr_1fr] items-center rounded-[30px] px-2 text-[#8b7e72]">
          <button className="flex flex-col items-center gap-1 text-[12px]">
            <Share2 size={22} />
            分享
          </button>
          <button className="flex flex-col items-center gap-1 text-[12px]">
            <Heart size={24} />
            收藏
          </button>
          <button className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#738253] text-[16px] font-semibold tracking-[0.06em] text-white shadow-[0_14px_30px_rgba(91,105,64,0.25)]">
            <Bookmark size={20} />
            加入收藏
          </button>
          <button className="flex flex-col items-center gap-1 text-[12px]">
            <NotebookPen size={22} />
            记笔记
          </button>
        </div>
      </div>
    </IphoneFrame>
  );
}
