"use client";

import { motion } from "framer-motion";
import { BriefcaseBusiness, Feather, MapPinned, Utensils } from "lucide-react";
import { StationTicket } from "@/components/flavor-map/StationTicket";
import { IosStatusBar } from "@/components/layout/IosStatusBar";
import { IphoneFrame } from "@/components/layout/IphoneFrame";
import { TabBar } from "@/components/layout/TabBar";
import { stations } from "@/lib/mockData";

export function FlavorMapScreen() {
  return (
    <IphoneFrame>
      <IosStatusBar />

      <section className="app-content tab-page-content overflow-hidden px-5 pt-6">
        <div className="pointer-events-none absolute right-7 top-[128px] z-0 h-[92px] w-[72px] rounded-[9px] bg-[#eadcc8]/72 px-3 py-4 shadow-[0_18px_42px_rgba(84,58,36,0.09)]">
          <span className="absolute left-1/2 top-[-12px] h-7 w-7 -translate-x-1/2 rounded-full bg-[#cfa06e] shadow-[0_8px_16px_rgba(116,75,38,0.16)]" />
          <MapPinned className="absolute right-3 top-3 text-[#8a5a35]/48" size={13} />
          <p className="mt-4 text-[10px] font-semibold text-[#5e4633]">
            探索美食世界
          </p>
          <p className="mt-1 text-[9px] text-[#9a826d]">从这里出发</p>
          <div className="mt-3 h-px border-t border-dashed border-[#b99a79]/45" />
          <div className="barcode mt-3 h-[18px] opacity-22" />
        </div>

        <div className="relative z-10 flex items-start justify-between">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <h1 className="font-display text-[45px] leading-none tracking-[0.1em] text-[#3a2a1d]">
              风味地图
            </h1>
            <div className="mt-1 flex items-center gap-3 text-[#c8a06d]/72">
              <span className="font-script text-[25px] leading-none">
                Flavor Map
              </span>
              <span className="h-px w-9 bg-[#c8a06d]/42" />
            </div>
          </motion.div>

          <div className="mt-1 flex h-10 items-center rounded-full border border-[#d9cdbc]/55 bg-[#f3ebdd]/48 p-1 text-[12px] font-semibold text-[#8a8178] shadow-[0_12px_28px_rgba(80,52,32,0.07)]">
            <span className="flex h-8 items-center gap-1.5 rounded-full bg-[#6f4a2e] px-3 text-[#faf6f0] shadow-[0_7px_16px_rgba(74,52,33,0.13)]">
              <Utensils size={14} />
              食材地图
            </span>
            <span className="flex h-8 items-center gap-1.5 px-3">
              <BriefcaseBusiness size={14} />
              风味地图
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.55 }}
          className="relative z-10 mt-7"
        >
          <p className="text-[21px] font-medium leading-[1.48] tracking-[0.04em] text-[#4b392b]">
            每一张票根
            <br />
            都是一道值得收藏的菜
          </p>
          <div className="mt-3 h-[3px] w-15 rounded-full bg-gradient-to-r from-[#8a5a35] via-[#c8a06d]/70 to-transparent" />
        </motion.div>

        <div className="relative z-10 mt-20">
          {stations.map((station, index) => (
            <motion.div
              key={station.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 + index * 0.12, duration: 0.55 }}
              className={index > 0 ? "-mt-[18px]" : ""}
            >
              <StationTicket station={station} isPrimary={index === 0} />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 mt-5 flex items-center justify-center gap-2 text-[13px] font-medium text-[#95887a]">
          <span className="h-px w-8 border-t border-dashed border-[#dec9b4]" />
          <span className="grid h-7 w-7 place-items-center rounded-full border border-[#b9aa9b]/60 bg-white/28">
            <Feather size={15} />
          </span>
          <span>滑动探索更多站点</span>
          <span className="h-px w-8 border-t border-dashed border-[#dec9b4]" />
        </div>
      </section>

      <TabBar current="flavor-map" />
    </IphoneFrame>
  );
}
