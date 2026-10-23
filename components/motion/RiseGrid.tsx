"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Cards rise in, one after another, when the group scrolls into view. */
export function RiseGrid({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = ref.current ? Array.from(ref.current.children) : [];
        if (!items.length) return;
        gsap.from(items, {
          y: 28,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.06,
          ease: "expo.out",
          immediateRender: false,
          scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
        });
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
