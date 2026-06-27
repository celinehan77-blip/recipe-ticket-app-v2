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
    bg: "from-[#f6efe2] via-[#f3ebdd] to-[#e9dfca]",
    icon: "bg-[#8b9a7a]",
    text: "text-[#3a2a1d]",
    muted: "text-[#786958]",
    stamp: "text-[#8b9a7a]/58",
    side: "bg-[#f4ead9]/58",
    shadow: "shadow-[0_18px_42px_rgba(75,52,31,0.18)]",
    Icon: Bird,
  },
  caramel: {
    bg: "from-[#eeddbf] via-[#e8d6b8] to-[#e5d0aa]",
    icon: "bg-[#8a5a35]",
    text: "text-[#3a2a1d]",
    muted: "text-[#77553b]",
    stamp: "text-[#8a5a35]/48",
    side: "bg-[#eedbbd]/50",
    shadow: "shadow-[0_15px_34px_rgba(75,52,31,0.14)]",
    Icon: Beef,
  },
  blue: {
    bg: "from-[#e8f0f1] via-[#dde8ea] to-[#d7e5ea]",
    icon: "bg-[#6f8fa0]",
    text: "text-[#2f5263]",
    muted: "text-[#5f7681]",
    stamp: "text-[#6f8fa0]/48",
    side: "bg-[#e7f0f2]/46",
    shadow: "shadow-[0_12px_28px_rgba(75,52,31,0.1)]",
    Icon: Fish,
  },
} as const;

export function StationTicket({ station, isPrimary = false }: StationTicketProps) {
  const tone = toneMap[station.tone];
  const Icon = tone.Icon;
  const englishLines = station.englishTitle.toUpperCase().split(" ");
  const content = (
    <article
      className={`ticket-edge paper-card flavor-ticket relative grid h-[142px] grid-cols-[1fr_86px] overflow-hidden rounded-[14px] bg-gradient-to-br ${tone.bg} ${tone.shadow} ${
        isPrimary ? "border-[#c9bca6]/60" : "border-[#c9bca6]/38"
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

        <div className={`ticket-stamp mini-ticket-stamp absolute right-6 top-12 ${tone.stamp}`}>
          <span>{englishLines[0]}</span>
          <Icon size={18} />
          <span>STATION</span>
        </div>
      </div>

      <div className={`relative z-10 border-l border-dashed border-[#7d6956]/24 ${tone.side} px-3 py-3.5 text-center`}>
        <p className="text-[9px] font-bold uppercase tracking-[0.13em]">
          Station
        </p>
        <p className={`font-display mt-2.5 text-[37px] leading-none ${tone.text}`}>
          {station.stationNo}
        </p>
        <div className="mx-auto my-2.5 h-px w-8 bg-[#806b55]/22" />
        <p className="text-[8px] font-bold uppercase leading-[11px] tracking-[0.06em]">
          {englishLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
        <ArrowRight className="mx-auto mt-2.5 text-current/70" size={17} />
        <div className="barcode mx-auto mt-2.5 h-[20px] w-12 opacity-45" />
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
