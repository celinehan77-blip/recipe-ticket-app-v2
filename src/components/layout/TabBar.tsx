import Link from "next/link";
import { tabs } from "@/lib/mockData";
import type { TabKey } from "@/types";

type TabBarProps = {
  current: TabKey;
};

export function TabBar({ current }: TabBarProps) {
  return (
    <nav className="safe-bottom pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto flex w-full max-w-[393px] justify-center px-5">
      <div className="glass-panel pointer-events-auto grid h-[86px] w-full grid-cols-5 items-center rounded-[34px] px-2">
        {tabs.map((item) => {
          const Icon = item.icon;
          const active = item.key === current;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`relative flex h-[72px] flex-col items-center justify-center gap-1.5 rounded-[26px] text-[12px] transition ${
                active
                  ? "bg-white/64 text-[#5c3718] shadow-[0_14px_34px_rgba(78,52,29,0.12)]"
                  : "text-[#b2a79d]"
              }`}
            >
              <Icon
                size={24}
                strokeWidth={active ? 2.7 : 2.2}
                className={active ? "fill-[#8a5a35]/15" : ""}
              />
              <span className="font-medium">{item.label}</span>
              {active ? (
                <span className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-[#8a5a35]" />
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
