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
 * Scroll-velocity marquee: drifts on its own, speeds up and reverses
 * direction with scroll. Track holds 4 copies; one copy = 25% of width.
 */
export function Marquee({ items, speed = 2.2 }: { items: string[]; speed?: number }) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 60, stiffness: 350 });
  const factor = useTransform(smooth, [0, 1000], [0, 4.5], { clamp: false });
  const dir = useRef(-1);
  const currentSpeed = useRef(speed);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    // Clamp delta to prevent sudden jumps on tab switch / GC hiccups
    const dt = Math.min(delta, 50) / 1000;
    const f = factor.get();

    // Smoothly ease direction instead of snapping hard
    const targetDir = f < -0.08 ? 1 : f > 0.08 ? -1 : dir.current;
    dir.current += (targetDir - dir.current) * Math.min(1, dt * 8);

    // Target velocity with smooth acceleration and gentle decay
    const targetSpeed = speed * (1 + Math.min(Math.abs(f), 4.5));
    currentSpeed.current += (targetSpeed - currentSpeed.current) * Math.min(1, dt * 10);

    const move = dir.current * currentSpeed.current * dt;
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
