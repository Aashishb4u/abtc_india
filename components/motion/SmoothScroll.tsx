"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIntro } from "@/lib/intro";
import { setLenis } from "@/lib/lenis";

/**
 * Lenis smooth scroll driven by the GSAP ticker so ScrollTrigger stays in
 * perfect sync. Scrolling is locked until the preloader has lifted.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const { ready } = useIntro();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: { offset: -110, duration: 1.6 },
    });
    lenisRef.current = lenis;
    setLenis(lenis);
    lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = ready ? "" : "hidden";
    if (ready) {
      lenisRef.current?.start();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }, [ready]);

  return null;
}
