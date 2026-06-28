import Link from "next/link";
import { tabItems } from "@/lib/mockData";
import type { TabKey } from "@/types";

type TabBarProps = {
  current: TabKey;
};

export function TabBar({ current }: TabBarProps) {
  return (
    <nav className="safe-bottom pointer-events-none absolute inset-x-0 bottom-0 z-30 mx-auto flex w-full justify-center px-5">
      <div className="glass-panel pointer-events-auto grid h-[78px] w-full grid-cols-5 items-center rounded-[32px] px-2">
        {tabItems.map((item) => {
          const Icon = item.icon;
          const active = item.id === current;

          return (
            <Link
              key={item.id}
              href={item.route}
              className={`relative flex h-[64px] flex-col items-center justify-center gap-1 rounded-[24px] text-[12px] transition ${
                active
                  ? "bg-[#fffaf2]/66 text-[#3a2a1d] shadow-[0_12px_30px_rgba(78,52,29,0.1)]"
                  : "text-[#8a8178]/72"
              }`}
            >
              <Icon
                size={23}
                strokeWidth={active ? 2.7 : 2.2}
                className={active ? "fill-[#8a5a35]/12" : ""}
              />
              <span className="font-medium">{item.label}</span>
              {active ? (
                <span className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-[#6f4a2e]" />
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
