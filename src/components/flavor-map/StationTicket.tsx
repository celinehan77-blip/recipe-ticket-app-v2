import Link from "next/link";
import { BarChart3, Beef, Bird, Clock3, Fish, Soup } from "lucide-react";
import type { Station } from "@/types";

type StationTicketProps = {
  station: Station;
  isPrimary?: boolean;
};

const toneMap = {
  sage: {
    bg: "from-[#efe9d7] to-[#e5dcc3]",
    icon: "bg-[#8b9a7a]",
    text: "text-[#3a2a1d]",
    Icon: Bird,
  },
  caramel: {
    bg: "from-[#f0dfc6] to-[#e7caa8]",
    icon: "bg-[#9a5d2e]",
    text: "text-[#3a2a1d]",
    Icon: Beef,
  },
  blue: {
    bg: "from-[#dceaf1] to-[#c8dbe7]",
    icon: "bg-[#5e8298]",
    text: "text-[#254357]",
    Icon: Fish,
  },
} as const;

export function StationTicket({ station, isPrimary = false }: StationTicketProps) {
  const tone = toneMap[station.tone];
  const Icon = tone.Icon;
  const content = (
    <article
      className={`ticket-edge paper-card relative grid h-[178px] grid-cols-[1fr_82px] overflow-hidden rounded-[18px] bg-gradient-to-br ${tone.bg} ${
        isPrimary ? "shadow-[0_22px_54px_rgba(75,52,31,0.2)]" : ""
      }`}
    >
      <div className="relative z-10 p-6 pr-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#786757]">
          Flavor Ticket
        </p>
        <h2 className={`font-display mt-5 text-[38px] leading-none tracking-[0.08em] ${tone.text}`}>
          {station.title}
        </h2>
        <p className={`mt-4 text-[16px] tracking-[0.04em] ${tone.text}`}>
          {station.subtitle}
        </p>

        <div className="mt-8 grid grid-cols-[54px_1fr_1fr_1fr] items-center gap-3">
          <span className={`grid h-[46px] w-[46px] place-items-center rounded-full ${tone.icon} text-white`}>
            <Icon size={25} className="fill-white/10" />
          </span>
          <div className="border-l border-[#6b5541]/16 pl-3">
            <Soup size={17} />
            <p className="mt-1 text-[12px] text-[#706154]">菜谱</p>
            <p className="font-semibold">{station.recipes} 道</p>
          </div>
          <div className="border-l border-[#6b5541]/16 pl-3">
            <Clock3 size={17} />
            <p className="mt-1 text-[12px] text-[#706154]">平均时间</p>
            <p className="font-semibold">{station.averageTime}</p>
          </div>
          <div className="border-l border-[#6b5541]/16 pl-3">
            <BarChart3 size={17} />
            <p className="mt-1 text-[12px] text-[#706154]">难度</p>
            <p className="font-semibold">{station.difficulty}</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-l border-dashed border-[#8f7b68]/35 bg-white/24 p-5 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em]">Station</p>
        <p className={`font-display mt-4 text-[42px] leading-none ${tone.text}`}>
          {station.stationNo}
        </p>
        <div className="mx-auto my-4 h-px w-9 bg-[#806b55]/35" />
        <p className="text-[10px] font-bold uppercase leading-4 tracking-[0.08em]">
          {station.englishTitle}
        </p>
        <p className="mt-3 text-lg">→</p>
        <div className="barcode mx-auto mt-2 w-12" />
      </div>
    </article>
  );

  if (station.id === "chicken") {
    return (
      <Link href="/station/chicken" aria-label="进入羽禽驿站" className="block">
        {content}
      </Link>
    );
  }

  return content;
}
