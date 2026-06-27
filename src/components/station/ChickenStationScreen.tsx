"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, type Transition } from "framer-motion";
import {
  BarChart3,
  Bookmark,
  ChevronLeft,
  Clock3,
  MoreHorizontal,
  Soup,
  Tags,
} from "lucide-react";
import { IosStatusBar } from "@/components/layout/IosStatusBar";
import { IphoneFrame } from "@/components/layout/IphoneFrame";
import { chickenStationRecipes } from "@/lib/mockData";
import type { StationRecipe } from "@/types";

const ingredientLabels = [
  { name: "干辣椒", note: "香辣提味", left: "13%", top: "31%" },
  { name: "花生仁", note: "增香酥脆", left: "70%", top: "36%" },
  { name: "鸡腿肉", note: "鲜嫩多汁", left: "12%", top: "65%" },
  { name: "花椒", note: "麻香点睛", left: "70%", top: "68%" },
  { name: "葱段", note: "清香提鲜", left: "43%", top: "78%" },
];

const cardTransition: Transition = { duration: 0.45, ease: "easeOut" };

function StationFoodMap({ compact = false }: { compact?: boolean }) {
  const sizeClass = compact ? "h-[210px]" : "h-[286px]";

  return (
    <div className={`relative mx-auto mt-8 w-full ${sizeClass}`}>
      <div className="absolute left-1/2 top-1/2 h-24 w-28 -translate-x-1/2 -translate-y-1/2 rounded-[40px] bg-[#efb195] shadow-[inset_0_-8px_18px_rgba(177,94,67,0.18)]" />
      {[
        ["44%", "45%", "12deg"],
        ["53%", "47%", "-9deg"],
        ["48%", "56%", "4deg"],
      ].map(([left, top, rotate], index) => (
        <span
          key={`station-chicken-${index}`}
          className="absolute h-12 w-14 rounded-[22px] bg-[#f2bea7] shadow-[inset_0_-7px_12px_rgba(177,94,67,0.16)]"
          style={{ left, top, transform: `rotate(${rotate})` }}
        />
      ))}

      {[
        ["31%", "23%", "-22deg"],
        ["40%", "18%", "20deg"],
        ["25%", "44%", "18deg"],
        ["37%", "52%", "-30deg"],
      ].map(([left, top, rotate], index) => (
        <span
          key={`station-chili-${index}`}
          className="absolute h-4 w-16 rounded-full bg-gradient-to-r from-[#8f1f16] via-[#c93526] to-[#8f1f16]"
          style={{ left, top, transform: `rotate(${rotate})` }}
        />
      ))}

      {[
        ["58%", "23%"],
        ["66%", "26%"],
        ["72%", "31%"],
        ["63%", "38%"],
        ["76%", "42%"],
        ["56%", "34%"],
        ["66%", "48%"],
      ].map(([left, top], index) => (
        <span
          key={`station-peanut-${index}`}
          className="absolute h-4 w-6 rotate-[-18deg] rounded-full bg-[#c98c4f]"
          style={{ left, top }}
        />
      ))}

      {[
        ["58%", "59%"],
        ["62%", "66%"],
        ["70%", "62%"],
        ["75%", "70%"],
        ["66%", "75%"],
        ["81%", "63%"],
      ].map(([left, top], index) => (
        <span
          key={`station-pepper-${index}`}
          className="absolute h-2.5 w-2.5 rounded-full bg-[#65422d]"
          style={{ left, top }}
        />
      ))}

      <span className="absolute bottom-8 left-[45%] h-3 w-[72px] rotate-[52deg] rounded-full bg-[#85a765]" />
      <span className="absolute bottom-6 left-[48%] h-3 w-20 rotate-[48deg] rounded-full bg-[#6f9651]" />

      {!compact
        ? ingredientLabels.map((item) => (
            <div
              key={item.name}
              className="absolute text-[13px] leading-5 text-[#5f5043]"
              style={{ left: item.left, top: item.top }}
            >
              <p className="font-semibold">{item.name}</p>
              <p className="text-[11px] text-[#9b8d80]">{item.note}</p>
            </div>
          ))
        : null}
    </div>
  );
}

function RecipeCard({
  recipe,
  isActive,
}: {
  recipe: StationRecipe;
  isActive: boolean;
}) {
  return (
    <article
      className={`paper-card relative h-full overflow-hidden rounded-[28px] p-7 text-center transition ${
        isActive ? "shadow-[0_26px_70px_rgba(72,49,30,0.22)]" : "opacity-75"
      }`}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <span className="text-[12px] uppercase tracking-[0.22em] text-[#aa8060]">
            {recipe.englishTitle}
          </span>
          <Bookmark className="fill-[#b47b42]/18 text-[#a86f38]" size={22} />
        </div>
        <h2 className="font-display mt-7 text-[42px] leading-none tracking-[0.12em] text-[#3a2a1d]">
          {recipe.title}
        </h2>
        <p className="mt-4 text-[16px] leading-7 text-[#8a6f58]">
          {recipe.subtitle}
        </p>
        <div className="mx-auto mt-4 h-1 w-11 rounded-full bg-[#c4a07e]" />

        <StationFoodMap compact={!isActive} />

        <div className="mt-7 grid grid-cols-3 divide-x divide-[#d8c9b8] text-[#4a3a2f]">
          <div className="flex items-center justify-center gap-2">
            <Clock3 size={19} />
            <span>{recipe.minutes}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <BarChart3 size={19} />
            <span>{recipe.difficulty}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Tags size={19} />
            <span>{recipe.flavor}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ChickenStationScreen() {
  const [activeIndex, setActiveIndex] = useState(1);
  const activeRecipe =
    chickenStationRecipes[activeIndex] ?? chickenStationRecipes[1];

  return (
    <IphoneFrame>
      <IosStatusBar />

      <section className="relative z-10 flex min-h-[calc(100svh-54px)] flex-col px-6 pb-8 pt-7">
        <div className="flex items-center justify-between">
          <Link
            href="/flavor-map"
            aria-label="返回风味地图"
            className="grid h-14 w-14 place-items-center rounded-full bg-white/52 text-[#7b634e] shadow-[0_16px_40px_rgba(82,55,34,0.1)]"
          >
            <ChevronLeft size={28} />
          </Link>
          <div className="text-left">
            <h1 className="font-display text-[38px] leading-none text-[#3a2a1d]">
              Chicken Station
            </h1>
            <p className="mt-3 text-[18px] font-medium text-[#9a7655]">
              128 Recipes
            </p>
          </div>
          <div className="flex gap-2">
            <button
              aria-label="收藏驿站"
              className="grid h-12 w-12 place-items-center rounded-full bg-white/45 text-[#7b634e]"
            >
              <Bookmark size={20} />
            </button>
            <button
              aria-label="更多"
              className="grid h-12 w-12 place-items-center rounded-full bg-white/45 text-[#7b634e]"
            >
              <MoreHorizontal size={22} />
            </button>
          </div>
        </div>

        <div className="relative mt-14 h-[520px]">
          {chickenStationRecipes.map((recipe, index) => {
            const isActive = index === activeIndex;
            const isLeft = index < activeIndex;
            const positionClass = isActive
              ? "left-1/2 z-30 h-[500px] w-[270px] -translate-x-1/2"
              : isLeft
                ? "left-[-74px] z-10 h-[430px] w-[238px] rotate-[-5deg] scale-[0.92] blur-[0.4px]"
                : "right-[-74px] z-10 h-[430px] w-[238px] rotate-[5deg] scale-[0.92] blur-[0.4px]";

            const cardMotion = {
              initial: { opacity: 0, y: 24 },
              animate: {
                opacity: isActive ? 1 : 0.66,
                y: isActive ? 0 : 42,
              },
              transition: cardTransition,
            };

            if (isActive) {
              return (
                <Link
                  key={recipe.id}
                  href="/recipe/kung-pao-chicken"
                  aria-label="打开宫保鸡丁菜谱详情"
                  className={`absolute top-0 ${positionClass}`}
                >
                  <motion.div {...cardMotion} className="h-full w-full">
                    <RecipeCard recipe={recipe} isActive />
                  </motion.div>
                </Link>
              );
            }

            return (
              <motion.button
                key={recipe.id}
                type="button"
                aria-label={`切换到${recipe.title}`}
                onClick={() => setActiveIndex(index)}
                {...cardMotion}
                className={`absolute top-0 ${positionClass} text-left`}
              >
                <RecipeCard recipe={recipe} isActive={false} />
              </motion.button>
            );
          })}
        </div>

        <div className="mt-2 flex justify-center gap-3">
          {chickenStationRecipes.map((recipe, index) => (
            <button
              key={`dot-${recipe.id}`}
              type="button"
              aria-label={`查看${recipe.title}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition ${
                index === activeIndex ? "w-6 bg-[#c28d58]" : "w-2.5 bg-[#ddd3c8]"
              }`}
            />
          ))}
        </div>

        <motion.div
          key={activeRecipe.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="glass-panel mt-7 grid min-h-[112px] grid-cols-3 divide-x divide-[#ded2c5]/80 rounded-[26px] px-4 py-5"
        >
          <div className="flex items-center gap-3">
            <Clock3 className="text-[#8a8178]" size={26} />
            <div>
              <p className="text-[12px] text-[#8a8178]">烹饪时间</p>
              <p className="mt-2 text-[21px] font-semibold text-[#6f7d55]">
                {activeRecipe.minutes}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 px-3">
            <BarChart3 className="text-[#8a8178]" size={26} />
            <div>
              <p className="text-[12px] text-[#8a8178]">难度等级</p>
              <p className="mt-2 text-[21px] font-semibold text-[#6f7d55]">
                {activeRecipe.difficulty}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pl-4">
            <Soup className="text-[#8a8178]" size={26} />
            <div>
              <p className="text-[12px] text-[#8a8178]">主要食材</p>
              <p className="mt-2 text-[15px] font-semibold leading-6 text-[#4a3a2f]">
                {activeRecipe.ingredients.join(" · ")}
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </IphoneFrame>
  );
}
