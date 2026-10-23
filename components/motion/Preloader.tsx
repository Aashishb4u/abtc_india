"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useIntro } from "@/lib/intro";

/**
 * Cinematic intro: seal draws itself, wordmark rises, counter runs to 100,
 * then the panel lifts away with a curved trailing edge while the hero
 * animates in underneath. Skipped for reduced motion and repeat visits
 * within the same session.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const { setReady, setCleared } = useIntro();
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let seen = false;
      try {
        seen = sessionStorage.getItem("abtc-intro") === "1";
        sessionStorage.setItem("abtc-intro", "1");
      } catch {}

      if (reduce || seen) {
        setReady(true);
        setCleared(true);
        setDone(true);
        return;
      }

      const counter = { v: 0 };
      const tl = gsap.timeline();

      tl.fromTo(
        ".pl-ring",
        { strokeDashoffset: 310 },
        { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" },
        0
      )
        .fromTo(
          ".pl-ring-inner",
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: "power1.out" },
          0.7
        )
        .fromTo(
          ".pl-word",
          { yPercent: 110 },
          { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.07 },
          0.5
        )
        .fromTo(
          ".pl-sub",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          1
        )
        .to(
          counter,
          {
            v: 100,
            duration: 1.9,
            ease: "power2.inOut",
            onUpdate: () => {
              if (num.current)
                num.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
            },
          },
          0
        )
        .fromTo(
          ".pl-bar",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.9, ease: "power2.inOut" },
          0
        )
        .to(
          ".pl-content",
          { opacity: 0, y: -24, duration: 0.55, ease: "power2.in" },
          "+=0.2"
        )
        .to(
          root.current,
          {
            yPercent: -100,
            borderBottomLeftRadius: "50% 14vw",
            borderBottomRightRadius: "50% 14vw",
            duration: 1.25,
            ease: "expo.inOut",
            onComplete: () => {
              setDone(true);
              setCleared(true);
            },
          },
          ">-0.1"
        )
        .add(() => setReady(true), "<+0.4");
    },
    { scope: root }
  );

  if (done) return null;

  return (
    <div
      id="preloader"
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-midnight text-white will-change-transform"
    >
      <div className="pl-content flex flex-col items-center gap-6">
        <svg viewBox="0 0 120 75" className="w-40 sm:w-52" fill="none" aria-hidden>
          <ellipse
            className="pl-ring"
            cx="60"
            cy="37.5"
            rx="58"
            ry="35"
            stroke="#fff"
            strokeWidth="1.6"
            strokeDasharray="310"
            strokeDashoffset="310"
          />
          <ellipse
            className="pl-ring-inner"
            cx="60"
            cy="37.5"
            rx="53"
            ry="30.5"
            stroke="#0799E8"
            strokeWidth="1"
            strokeDasharray="2.5 2"
            opacity="0"
          />
        </svg>
        <div className="-mt-[5.5rem] sm:-mt-28 flex flex-col items-center">
          <span className="block overflow-hidden pb-1">
            <span className="pl-word inline-block font-display text-4xl font-bold tracking-[0.12em] sm:text-5xl">
              ABTC
            </span>
          </span>
          <span className="pl-sub mt-1 text-[10px] font-bold uppercase tracking-[0.35em] text-electric-blue">
            India
          </span>
        </div>
        <p className="pl-sub mt-16 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
          Section of CIDESCO International
        </p>
      </div>

      <div className="pl-content absolute inset-x-6 bottom-8 flex items-end justify-between sm:inset-x-12 sm:bottom-12">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
          Reg. No. FI1552
        </span>
        <span
          ref={num}
          className="font-display text-6xl font-semibold tabular-nums leading-none text-white sm:text-8xl"
        >
          000
        </span>
      </div>
      <div className="pl-content absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
        <div className="pl-bar h-full origin-left bg-gradient-to-r from-electric-blue to-secondary-fixed" />
      </div>
    </div>
  );
}
