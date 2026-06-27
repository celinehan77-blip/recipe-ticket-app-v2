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

const peanuts = [
  ["18%", "31%", "-16deg"],
  ["32%", "22%", "12deg"],
  ["48%", "34%", "-8deg"],
  ["63%", "24%", "18deg"],
  ["72%", "42%", "-20deg"],
  ["28%", "52%", "8deg"],
  ["52%", "58%", "-12deg"],
  ["40%", "70%", "16deg"],
  ["66%", "70%", "-6deg"],
];

const peppercorns = [
  ["24%", "42%"],
  ["31%", "62%"],
  ["50%", "30%"],
  ["61%", "54%"],
  ["76%", "44%"],
  ["68%", "74%"],
  ["43%", "78%"],
];

const bottomActions = [
  { label: "分享", icon: Share2 },
  { label: "收藏", icon: Heart },
  { label: "记笔记", icon: NotebookPen },
];

function FoodStillLife() {
  return (
    <div className="recipe-hero-photo pointer-events-none absolute -right-7 top-[72px] h-[254px] w-[238px]">
      <div className="absolute right-0 top-0 h-[146px] w-[170px] rotate-[9deg] rounded-[54px] border border-[#d0b996]/45 bg-[#efe0ca] shadow-[0_24px_44px_rgba(83,55,31,0.16)]">
        <span className="absolute inset-3 rounded-[42px] bg-[#fbefe2]" />
        {[
          ["22%", "34%", "-10deg"],
          ["42%", "28%", "8deg"],
          ["58%", "42%", "-14deg"],
          ["34%", "58%", "12deg"],
          ["54%", "67%", "-7deg"],
        ].map(([left, top, rotate], index) => (
          <span
            key={`hero-chicken-${index}`}
            className="absolute z-10 h-9 w-11 rounded-[18px] bg-[#efb39a] shadow-[inset_0_-8px_12px_rgba(174,94,66,0.18),0_7px_14px_rgba(102,58,34,0.12)]"
            style={{ left, top, transform: `rotate(${rotate})` }}
          />
        ))}
      </div>

      <div className="absolute right-[78px] top-[106px] h-[118px] w-[136px] rotate-[-10deg] rounded-full border border-[#d0b996]/45 bg-[#ead9bf] shadow-[0_20px_34px_rgba(83,55,31,0.14)]">
        <span className="absolute inset-3 rounded-full bg-[#fff2df]" />
        {peanuts.map(([left, top, rotate], index) => (
          <span
            key={`hero-peanut-${index}`}
            className="absolute z-10 h-4 w-6 rounded-[999px] bg-[#c9874c] shadow-[inset_0_-3px_5px_rgba(116,70,34,0.22)]"
            style={{ left, top, transform: `rotate(${rotate})` }}
          />
        ))}
      </div>

      {[
        ["28px", "84px", "-29deg"],
        ["58px", "111px", "-12deg"],
        ["18px", "142px", "15deg"],
        ["89px", "92px", "22deg"],
        ["80px", "171px", "-35deg"],
      ].map(([left, top, rotate], index) => (
        <span
          key={`hero-chili-${index}`}
          className="absolute h-4 w-20 rounded-full bg-gradient-to-r from-[#8d1e16] via-[#c33a2a] to-[#8d1e16] shadow-[0_7px_14px_rgba(106,28,18,0.18)]"
          style={{ left, top, transform: `rotate(${rotate})` }}
        />
      ))}

      <span className="absolute bottom-10 right-2 h-3 w-[116px] rotate-[-20deg] rounded-full bg-[#86a25d] shadow-[0_5px_10px_rgba(72,94,50,0.12)]" />
      <span className="absolute bottom-4 right-11 h-3 w-28 rotate-[-24deg] rounded-full bg-[#6f924d] shadow-[0_5px_10px_rgba(72,94,50,0.12)]" />
      <span className="absolute right-2 top-[158px] h-16 w-16 rounded-full border-[10px] border-[#fbefe2] bg-[#7a2f20] shadow-[0_18px_32px_rgba(83,55,31,0.12)]" />

      {peppercorns.map(([left, top], index) => (
        <span
          key={`hero-pepper-${index}`}
          className="absolute h-2.5 w-2.5 rounded-full bg-[#61402b] shadow-[0_2px_4px_rgba(80,52,32,0.2)]"
          style={{ left, top }}
        />
      ))}
    </div>
  );
}

function IngredientArt({ id }: { id: IngredientGroup["id"] }) {
  if (id === "main") {
    return (
      <div className="ingredient-photo relative mt-auto h-[82px] overflow-hidden rounded-[18px] bg-[#ead8c1]">
        <div className="absolute left-3 top-5 h-14 w-24 rounded-full bg-[#f8eadb] shadow-inner" />
        {[
          ["26px", "34px", "-10deg"],
          ["50px", "27px", "12deg"],
          ["70px", "42px", "-4deg"],
          ["38px", "50px", "8deg"],
        ].map(([left, top, rotate], index) => (
          <span
            key={`main-${index}`}
            className="absolute h-7 w-9 rounded-[14px] bg-[#efad92]"
            style={{ left, top, transform: `rotate(${rotate})` }}
          />
        ))}
        <span className="absolute right-7 top-7 h-8 w-8 rounded-full bg-[#8b9a7a]/75" />
        <span className="absolute right-3 top-10 h-9 w-4 rotate-[42deg] rounded-full bg-[#8b9a7a]/65" />
      </div>
    );
  }

  if (id === "side") {
    return (
      <div className="ingredient-photo relative mt-auto h-[82px] overflow-hidden rounded-[18px] bg-[#efe1cf]">
        <div className="absolute right-2 top-3 h-12 w-14 rounded-full bg-[#f8ecd9] shadow-inner" />
        {peanuts.slice(0, 6).map(([left, top], index) => (
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
    <div className="ingredient-photo relative mt-auto h-[82px] overflow-hidden rounded-[18px] bg-[#f0e2d1]">
      {[
        ["14px", "18px", "#5b2c1b"],
        ["52px", "18px", "#b63720"],
        ["35px", "49px", "#d68c36"],
        ["76px", "47px", "#f5f0e8"],
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
    <div className="step-thumb relative h-[52px] w-[54px] shrink-0 overflow-hidden rounded-[16px] bg-[#efe3d3] shadow-inner">
      <span className={`absolute left-2.5 top-4 h-5 w-8 rounded-full ${tones[index]}`} />
      <span className="absolute right-2 top-3 h-3 w-3 rounded-full bg-[#c98c4f]" />
      <span className="absolute bottom-2 left-5 h-2 w-7 rounded-full bg-[#8b9a7a]" />
    </div>
  );
}

export function RecipeDetailScreen({ backHref }: RecipeDetailScreenProps) {
  return (
    <IphoneFrame>
      <IosStatusBar />

      <div className="app-content recipe-detail-scroll pb-[150px]">
        <section className="relative min-h-[374px] px-6 pt-5">
          <div className="relative z-30 flex items-center justify-between">
            <Link
              href={backHref}
              aria-label="返回"
              className="recipe-nav-button"
            >
              <ChevronLeft size={26} />
            </Link>
            <div className="flex gap-3">
              <button
                aria-label="收藏"
                className="recipe-nav-button"
              >
                <Bookmark size={21} />
              </button>
              <button
                aria-label="更多"
                className="recipe-nav-button"
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
            className="relative z-20 mt-10 max-w-[232px]"
          >
            <p className="font-display text-[58px] leading-none text-[#c9b9a9]">
              {kungPaoRecipe.no}
            </p>
            <div className="mt-2 h-px w-14 bg-[#8b9a7a]" />
            <h1 className="font-display mt-5 text-[40px] leading-none tracking-[0.1em] text-[#3a2a1d]">
              {kungPaoRecipe.title}
            </h1>
            <p className="mt-3 font-serif text-[20px] leading-none text-[#8a5a35]">
              {kungPaoRecipe.englishTitle}
            </p>
            <p className="mt-5 text-[15px] leading-7 text-[#75695f]">
              {kungPaoRecipe.description}
            </p>
          </motion.div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.6 }}
          className="recipe-stats-card mx-5 -mt-3 grid grid-cols-5 rounded-[22px] px-2 py-3"
        >
          {kungPaoRecipe.stats.map((stat, index) => {
            const Icon = statIcons[index];
            return (
              <div
                key={stat.label}
                className="flex min-h-[70px] flex-col items-center justify-center border-r border-[#d8cabb]/65 px-1 text-center last:border-r-0"
              >
                <Icon size={18} strokeWidth={1.7} className="text-[#8a8178]" />
                <p className="mt-1.5 text-[10px] text-[#8a8178]">{stat.label}</p>
                <p className="mt-1 text-[16px] font-semibold leading-tight text-[#6f7d55]">
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

          <div className="grid grid-cols-3 gap-2.5">
            {kungPaoRecipe.ingredientGroups.map((group, index) => (
              <motion.article
                key={group.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.08, duration: 0.45 }}
                className="recipe-ingredient-card flex min-h-[226px] flex-col rounded-[20px] p-3"
              >
                <div className="relative z-10 flex min-h-full flex-col">
                  <h3 className="font-display text-[18px] tracking-[0.05em] text-[#3a2a1d]">
                    {group.title}
                  </h3>
                  <div className="mt-3 min-h-[86px] space-y-1">
                    {group.items.map((item) => (
                      <p
                        key={`${group.id}-${item.name}`}
                        className="text-[11px] leading-[17px] text-[#69594b]"
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

          <div className="recipe-steps-card rounded-[24px] px-4 py-3">
            {kungPaoRecipe.steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.05, duration: 0.42 }}
                className="relative flex gap-3 border-b border-[#dfd1c1]/75 py-3.5 last:border-b-0"
              >
                {index < kungPaoRecipe.steps.length - 1 ? (
                  <span className="absolute left-[15px] top-12 h-[78px] border-l border-dashed border-[#c9bcae]" />
                ) : null}
                <span className="relative z-10 mt-2 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#8b9a7a] text-[14px] font-semibold text-[#fffaf2] shadow-[0_8px_16px_rgba(99,114,75,0.2)]">
                  {index + 1}
                </span>
                <StepThumb index={index} />
                <div className="min-w-0 flex-1 pr-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display max-w-[128px] text-[18px] leading-6 text-[#3a2a1d]">
                      {step.title}
                    </h3>
                    <span className="shrink-0 rounded-full bg-[#f4eadc] px-2.5 py-1 text-[12px] font-medium text-[#6a5748]">
                      {step.minutes}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[12px] leading-5 text-[#8a8178]">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <div className="safe-bottom pointer-events-none absolute inset-x-0 bottom-0 z-40 mx-auto px-4">
        <div className="recipe-action-bar pointer-events-auto grid h-[76px] grid-cols-[1fr_1fr_1.75fr_1fr] items-center rounded-[28px] px-2 text-[#8b7e72]">
          {bottomActions.slice(0, 2).map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className="flex flex-col items-center gap-1 text-[12px]"
              >
                <Icon size={22} strokeWidth={1.8} />
                {action.label}
              </button>
            );
          })}
          <button className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#8b9a7a] text-[15px] font-semibold tracking-[0.04em] text-[#fffaf2] shadow-[0_14px_30px_rgba(91,105,64,0.25)]">
            <Bookmark size={20} />
            加入收藏
          </button>
          {bottomActions.slice(2).map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className="flex flex-col items-center gap-1 text-[12px]"
              >
                <Icon size={22} strokeWidth={1.8} />
                {action.label}
              </button>
            );
          })}
        </div>
      </div>
    </IphoneFrame>
  );
}
