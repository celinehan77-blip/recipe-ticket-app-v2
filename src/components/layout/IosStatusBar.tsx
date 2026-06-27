type IosStatusBarProps = {
  dark?: boolean;
};

export function IosStatusBar({ dark = true }: IosStatusBarProps) {
  const tone = dark ? "bg-[#17110b]" : "bg-white";

  return (
    <div className="relative z-20 flex h-[54px] items-center justify-between px-8 pt-3 text-[17px] font-semibold tracking-[-0.03em]">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <div className="flex h-4 items-end gap-0.5">
          <span className={`h-1.5 w-1 rounded-sm ${tone}`} />
          <span className={`h-2.5 w-1 rounded-sm ${tone}`} />
          <span className={`h-3.5 w-1 rounded-sm ${tone}`} />
          <span className={`h-4 w-1 rounded-sm ${tone}`} />
        </div>
        <div className="relative h-4 w-5">
          <span className={`absolute bottom-0 left-0 h-2.5 w-5 rounded-t-full border-2 border-b-0 ${dark ? "border-[#17110b]" : "border-white"}`} />
          <span className={`absolute bottom-0 left-1.5 h-1.5 w-2 rounded-t-full border-2 border-b-0 ${dark ? "border-[#17110b]" : "border-white"}`} />
        </div>
        <div className={`h-3.5 w-6 rounded-[4px] border-2 ${dark ? "border-[#17110b]" : "border-white"} p-0.5`}>
          <div className={`h-full w-4 rounded-[2px] ${tone}`} />
        </div>
      </div>
    </div>
  );
}
