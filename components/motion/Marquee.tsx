"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useRef } from "react";

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/**
 * Scroll-velocity marquee: gently drifts with calm luxury pacing, subtly
 * reacting to scroll speed without rushing. Track holds 4 copies; one copy = 25% of width.
 */
export function Marquee({ items, speed = 0.55 }: { items: string[]; speed?: number }) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 60, stiffness: 350 });
  const factor = useTransform(smooth, [0, 1000], [0, 0.8], { clamp: false });
  const dir = useRef(-1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const f = factor.get();
    if (f < -0.05) dir.current = 1;
    else if (f > 0.05) dir.current = -1;
    let move = dir.current * speed * (delta / 1000);
    move += dir.current * Math.abs(f) * speed * (delta / 1000);
    base.set(base.get() + move);
  });

  const x = useTransform(base, (v) => `${wrap(-25, 0, v)}%`);

  const Group = ({ k }: { k: number }) => (
    <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={k > 0}>
      {items.map((t, i) => (
        <div key={t} className="flex items-center gap-10">
          <span
            className={`font-display text-4xl font-semibold tracking-tight md:text-6xl ${
              i % 2 ? "text-outline" : "text-royal-navy"
            }`}
          >
            {t}
          </span>
          <span className="h-2.5 w-2.5 rotate-45 bg-electric-blue" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden border-y border-royal-navy/10 bg-white/50 py-6 backdrop-blur-sm md:py-8">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-cool-mist to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-cool-mist to-transparent" />
      <motion.div style={{ x }} className="flex w-max whitespace-nowrap will-change-transform">
        {[0, 1, 2, 3].map((k) => (
          <Group key={k} k={k} />
        ))}
      </motion.div>
    </div>
  );
}
