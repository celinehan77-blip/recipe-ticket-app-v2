import type { ReactNode } from "react";

type IphoneFrameProps = {
  children: ReactNode;
  className?: string;
};

export function IphoneFrame({ children, className = "" }: IphoneFrameProps) {
  return (
    <main className="app-shell">
      <section className={`phone-screen grain ${className}`}>{children}</section>
    </main>
  );
}
