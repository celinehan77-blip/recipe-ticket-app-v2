"use client";

import { motion } from "framer-motion";
import { Briefcase, MousePointer2, Route, Utensils } from "lucide-react";
import { StationTicket } from "@/components/flavor-map/StationTicket";
import { IosStatusBar } from "@/components/layout/IosStatusBar";
import { IphoneFrame } from "@/components/layout/IphoneFrame";
import { TabBar } from "@/components/layout/TabBar";
import { stations } from "@/lib/mockData";

export function FlavorMapScreen() {
  return (
    <IphoneFrame>
      <IosStatusBar />

      <section className="app-content tab-page-content px-5 pt-8">
        <div className="absolute right-8 top-[118px] h-[108px] w-[78px] rounded-[10px] bg-[#eadcc8]/80 p-4 shadow-[0_20px_50px_rgba(84,58,36,0.12)]">
          <span className="absolute left-1/2 top-[-13px] h-7 w-7 -translate-x-1/2 rounded-full bg-[#d4ab7d] shadow-[0_8px_16px_rgba(116,75,38,0.18)]" />
          <p className="mt-4 text-[11px] font-semibold text-[#5e4633]">探索美食世界</p>
          <p className="mt-1 text-[10px] text-[#9a826d]">从这里出发</p>
          <div className="barcode mt-5 opacity-30" />
        </div>

        <div className="flex items-start justify-between">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <h1 className="font-display text-[49px] leading-none tracking-[0.12em] text-[#332518]">
              风味地图
            </h1>
            <div className="mt-1 flex items-center gap-4 text-[#e1bd97]">
              <span className="font-script text-[28px] leading-none">
                Flavor Map
              </span>
              <span className="h-px w-12 bg-[#e5c5a6]" />
            </div>
          </motion.div>

          <div className="mt-2 flex h-11 items-center rounded-full border border-[#e3d8cb] bg-white/42 p-1 text-[13px] font-semibold text-[#7a6250] shadow-[0_14px_35px_rgba(80,52,32,0.08)]">
            <span className="flex h-9 items-center gap-1.5 rounded-full bg-[#685744] px-3 text-white">
              <Utensils size={15} />
              食材地图
            </span>
            <span className="flex h-9 items-center gap-1.5 px-3">
              <Briefcase size={15} />
              风味地图
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.55 }}
          className="mt-9"
        >
          <p className="text-[22px] font-medium leading-[1.6] tracking-[0.04em] text-[#4a3a2f]">
            每一张票根
            <br />
            都是一道值得收藏的菜
          </p>
          <div className="mt-3 h-1 w-14 rounded-full bg-[#b78a5f]" />
        </motion.div>

        <div className="mt-12">
          {stations.map((station, index) => (
            <motion.div
              key={station.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 + index * 0.12, duration: 0.55 }}
              className={index > 0 ? "-mt-4" : ""}
            >
              <StationTicket station={station} isPrimary={index === 0} />
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 text-[14px] font-medium text-[#95887a]">
          <span className="h-px w-10 bg-[#dec9b4]" />
          <Route size={24} />
          <span>滑动探索更多站点</span>
          <MousePointer2 size={16} />
          <span className="h-px w-10 bg-[#dec9b4]" />
        </div>
      </section>

      <TabBar current="flavor-map" />
    </IphoneFrame>
  );
}
