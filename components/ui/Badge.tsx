import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  dark,
  className,
}: {
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 backdrop-blur-md",
        dark
          ? "border-white/15 bg-white/10 text-secondary-fixed"
          : "border-electric-blue/30 bg-ice-blue/80 text-royal-navy",
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-blue opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-electric-blue" />
      </span>
      <span className="text-[11px] font-bold uppercase tracking-widest">{children}</span>
    </div>
  );
}
