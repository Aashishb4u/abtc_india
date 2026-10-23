"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Still section panel. No tilt and no light sweep. */
export function PanelShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  intro?: boolean;
}) {
  return <div className={cn("relative overflow-hidden", className)}>{children}</div>;
}
