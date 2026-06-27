import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Beef,
  Bird,
  Clock3,
  Fish,
  Soup,
} from "lucide-react";
import type { Station } from "@/types";

type StationTicketProps = {
  station: Station;
  isPrimary?: boolean;
};

const toneMap = {
  sage: {
    bg: "from-[#f4eedf] via-[#efe6d2] to-[#e7ddc6]",
    icon: "bg-[#8b9a7a]",
    text: "text-[#3a2a1d]",
    muted: "text-[#776956]",
    stamp: "text-[#9aa286]",
    side: "bg-[#f5eddf]/54",
    Icon: Bird,
  },
  caramel: {
    bg: "from-[#f4e2c8] via-[#efd1aa] to-[#e7c59d]",
    icon: "bg-[#8a5a35]",
    text: "text-[#3a2a1d]",
    muted: "text-[#7b5a3f]",
    stamp: "text-[#c89458]",
    side: "bg-[#faead6]/48",
    Icon: Beef,
  },
  blue: {
    bg: "from-[#e8f1f5] via-[#d7e7ef] to-[#c6dce8]",
    icon: "bg-[#5e8298]",
    text: "text-[#254357]",
    muted: "text-[#5b7280]",
    stamp: "text-[#8fb0c1]",
    side: "bg-[#eef7fa]/45",
    Icon: Fish,
  },
} as const;

export function StationTicket({ station, isPrimary = false }: StationTicketProps) {
  const tone = toneMap[station.tone];
  const Icon = tone.Icon;
  const englishLines = station.englishTitle.toUpperCase().split(" ");
  const content = (
    <article
      className={`ticket-edge paper-card flavor-ticket relative grid h-[142px] grid-cols-[1fr_80px] overflow-hidden rounded-[14px] bg-gradient-to-br ${tone.bg} ${
        isPrimary
          ? "shadow-[0_18px_42px_rgba(75,52,31,0.2)]"
          : "shadow-[0_14px_34px_rgba(75,52,31,0.14)]"
      }`}
    >
      <span className="ticket-notch ticket-notch-left-top" />
      <span className="ticket-notch ticket-notch-left-bottom" />
      <span className="ticket-notch ticket-notch-split-top" />
      <span className="ticket-notch ticket-notch-split-bottom" />
      <span className="ticket-notch ticket-notch-right-top" />
      <span className="ticket-notch ticket-notch-right-bottom" />

      <div className="relative z-10 p-5 pr-2">
        <p className={`text-[10px] font-semibold uppercase tracking-[0.19em] ${tone.muted}`}>
          Flavor Ticket
        </p>
        <span className="absolute left-[105px] top-[19px] text-[#a9957c]/45">
          ✦
        </span>
        <h2 className={`font-display mt-4 text-[35px] leading-none tracking-[0.07em] ${tone.text}`}>
          {station.title}
        </h2>
        <p className={`mt-3 text-[15px] tracking-[0.03em] ${tone.text}`}>
          {station.subtitle}
        </p>

        <div className="mt-5 grid grid-cols-[48px_1fr_1fr_1fr] items-center gap-2.5">
          <span className={`grid h-[45px] w-[45px] place-items-center rounded-full ${tone.icon} text-white shadow-[inset_0_-8px_14px_rgba(58,42,29,0.12)]`}>
            <Icon size={24} className="fill-white/10" />
          </span>
          <div className="border-l border-[#6b5541]/16 pl-3">
            <Soup size={15} />
            <p className="mt-0.5 text-[11px] text-[#706154]">菜谱</p>
            <p className="text-[17px] font-semibold leading-none">
              {station.recipes} <span className="text-[13px]">道</span>
            </p>
          </div>
          <div className="border-l border-[#6b5541]/16 pl-3">
            <Clock3 size={15} />
            <p className="mt-0.5 text-[11px] text-[#706154]">平均时间</p>
            <p className="text-[17px] font-semibold leading-none">
              {station.averageTime}
            </p>
          </div>
          <div className="border-l border-[#6b5541]/16 pl-3">
            <BarChart3 size={15} />
            <p className="mt-0.5 text-[11px] text-[#706154]">难度</p>
            <p className="text-[17px] font-semibold leading-none">
              {station.difficulty}
            </p>
          </div>
        </div>

        <div className={`ticket-stamp mini-ticket-stamp absolute right-5 top-12 ${tone.stamp}`}>
          <span>{englishLines[0]}</span>
          <Icon size={18} />
          <span>STATION</span>
        </div>
      </div>

      <div className={`relative z-10 border-l border-dashed border-[#8f7b68]/35 ${tone.side} px-4 py-4 text-center`}>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em]">
          Station
        </p>
        <p className={`font-display mt-3 text-[38px] leading-none ${tone.text}`}>
          {station.stationNo}
        </p>
        <div className="mx-auto my-3 h-px w-8 bg-[#806b55]/28" />
        <p className="text-[9px] font-bold uppercase leading-3 tracking-[0.07em]">
          {englishLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
        <ArrowRight className="mx-auto mt-3" size={18} />
        <div className="barcode mx-auto mt-3 h-[22px] w-12" />
      </div>
    </article>
  );

  if (station.id === "chicken") {
    return (
      <Link
        href="/station/chicken"
        aria-label="进入羽禽驿站"
        className="block transition-transform duration-150 active:scale-[0.98]"
      >
        {content}
      </Link>
    );
  }

  return content;
}
