"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Soft follower ring (desktop pointers only). Uses gsap.quickTo for
 * jank-free tracking and grows over interactive elements.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const rx = gsap.quickTo(ring.current, "x", { duration: 0.55, ease: "power3.out" });
      const ry = gsap.quickTo(ring.current, "y", { duration: 0.55, ease: "power3.out" });
      const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3.out" });
      const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3.out" });

      gsap.set([ring.current, dot.current], { xPercent: -50, yPercent: -50, opacity: 0 });

      const move = (e: PointerEvent) => {
        gsap.to([ring.current, dot.current], { opacity: 1, duration: 0.3, overwrite: "auto" });
        rx(e.clientX);
        ry(e.clientY);
        dx(e.clientX);
        dy(e.clientY);
      };
      const over = (e: Event) => {
        const t = (e.target as HTMLElement).closest("a, button, [data-cursor]");
        gsap.to(ring.current, {
          scale: t ? 1.9 : 1,
          backgroundColor: t ? "rgba(7,153,232,0.12)" : "rgba(7,153,232,0)",
          duration: 0.45,
          ease: "power3.out",
        });
        gsap.to(dot.current, { scale: t ? 0.4 : 1, duration: 0.3 });
      };
      const leave = () => gsap.to([ring.current, dot.current], { opacity: 0, duration: 0.3 });

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerover", over);
      document.documentElement.addEventListener("pointerleave", leave);
      return () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerover", over);
        document.documentElement.removeEventListener("pointerleave", leave);
      };
    });
  });

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-9 w-9 rounded-full border border-electric-blue/60 md:block"
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-1.5 w-1.5 rounded-full bg-electric-blue md:block"
      />
    </>
  );
}
