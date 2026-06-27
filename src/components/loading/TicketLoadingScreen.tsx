"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Circle, Soup, Star } from "lucide-react";
import { IosStatusBar } from "@/components/layout/IosStatusBar";
import { IphoneFrame } from "@/components/layout/IphoneFrame";
import { loadingSteps } from "@/lib/mockData";

export function TicketLoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.push("/recipe/kung-pao-chicken?from=loading");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <IphoneFrame>
      <IosStatusBar />

      <section className="relative z-10 px-7 pb-12 pt-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.58 }}
        >
          <h1 className="font-display text-[30px] leading-tight tracking-[0.08em] text-[#3a2a1d]">
            正在制作收藏票根
          </h1>
          <p className="mt-3 text-[15px] tracking-[0.06em] text-[#8a8178]">
            请稍候，美味即将抵达你的收藏夹
          </p>
        </motion.div>

        <div className="relative mx-auto mt-9 h-[382px] w-[305px]">
          <motion.div
            initial={{ opacity: 0, y: 24, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ delay: 0.1, duration: 0.55 }}
            className="paper-card ticket-edge ticket-float absolute inset-x-2 top-0 z-30 h-[148px] rounded-[16px] p-6 text-left"
            style={{ "--rotate": "-2deg" } as React.CSSProperties}
          >
            <div className="relative z-10 flex justify-between text-[10px] uppercase tracking-[0.14em] text-[#5c493a]">
              <span>Flavor Ticket</span>
              <span>No.20240520</span>
            </div>
            <h2 className="font-display relative z-10 mt-5 text-center text-[29px] tracking-[0.1em]">
              宫保鸡丁
            </h2>
            <p className="relative z-10 mt-1 text-center font-serif text-[15px]">
              Kung Pao Chicken
            </p>
            <div className="relative z-10 mt-5 flex items-end justify-between border-t border-[#7e6044]/15 pt-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#7e6958]">
                  From
                </p>
                <p className="font-display text-[15px]">小红书</p>
              </div>
              <span className="pb-1 text-2xl text-[#aa927b]">✈</span>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#7e6958]">
                  To
                </p>
                <p className="font-display text-[15px]">你的收藏夹</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26, rotate: 1.5 }}
            animate={{ opacity: 1, y: 0, rotate: 1.5 }}
            transition={{ delay: 0.35, duration: 0.55 }}
            className="paper-card ticket-edge absolute inset-x-5 top-[126px] z-20 h-[116px] rounded-[15px] p-6 text-left"
          >
            <div className="relative z-10">
              <p className="font-display text-[18px] tracking-[0.08em]">
                食材识别完成
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#6d5f54]">
                Ingredients Verified
              </p>
            </div>
            <div className="absolute right-7 top-5 grid h-[64px] w-[64px] rotate-[-13deg] place-items-center rounded-full border-2 border-[#6f8b63] text-center text-[9px] font-bold uppercase leading-3 tracking-[0.12em] text-[#6f8b63]">
              <span>Ingredient<br />Verified</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: -1 }}
            transition={{ delay: 0.62, duration: 0.55 }}
            className="paper-card ticket-edge absolute inset-x-3 top-[218px] z-10 h-[126px] rounded-[15px] p-6 text-left"
          >
            <div className="relative z-10">
              <p className="font-display text-[18px] tracking-[0.08em]">
                步骤整理完成
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#6d5f54]">
                Recipe Created
              </p>
            </div>
            <div className="absolute right-7 top-6 grid h-[64px] w-[64px] rotate-[12deg] place-items-center rounded-full border-2 border-[#a96a31] text-[#a96a31]">
              <Soup size={24} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.45 }}
            className="absolute bottom-1 right-8 z-40 grid h-[68px] w-[68px] rotate-[-10deg] place-items-center rounded-full border-2 border-[#c65f3f] text-[#c65f3f]"
          >
            <Star size={25} className="fill-[#c65f3f]/10" />
          </motion.div>
        </div>

        <div className="mx-auto mt-2 w-[245px] text-left">
          {loadingSteps.map((step, index) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + index * 0.18, duration: 0.35 }}
              className="relative flex items-center gap-4 py-2 text-[14px]"
            >
              {index < loadingSteps.length - 1 ? (
                <span className="absolute left-[10px] top-7 h-6 w-px bg-[#d8cbbb]" />
              ) : null}
              <span
                className={`relative z-10 grid h-5 w-5 place-items-center rounded-full ${
                  step.active
                    ? "bg-[#8b9a7a] text-white"
                    : "border border-[#d7cabb] text-[#d0bfae]"
                }`}
              >
                {step.active ? <Check size={13} /> : <Circle size={10} />}
              </span>
              <span
                className={
                  step.active
                    ? "font-medium text-[#5b4737]"
                    : "text-[#aa9d91]"
                }
              >
                {step.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>
    </IphoneFrame>
  );
}
