import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "white" | "ghost-dark";

const styles: Record<Variant, string> = {
  primary:
    "bg-electric-blue text-white shadow-md hover:bg-electric-dark hover:shadow-glow",
  outline:
    "border border-royal-navy/20 bg-white/70 text-royal-navy backdrop-blur-md shadow-sm hover:border-royal-navy hover:bg-white/95 hover:shadow-md",
  white: "bg-white/90 text-royal-navy shadow-md hover:bg-white hover:shadow-glass",
  "ghost-dark": "border border-white/30 text-white hover:bg-white/10",
};

export function Button({
  href,
  children,
  variant = "primary",
  icon,
  iconLeft,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  icon?: string;
  iconLeft?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "btn-shimmer group inline-flex h-12 items-center justify-center gap-2 rounded-xl px-7 text-xs font-bold uppercase tracking-wider transition-all duration-300",
        styles[variant],
        className
      )}
    >
      {iconLeft && <Icon name={iconLeft} className="text-base" />}
      <span>{children}</span>
      {icon && (
        <Icon
          name={icon}
          className="text-base transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </Link>
  );
}
