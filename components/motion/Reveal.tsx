"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { useIntro } from "@/lib/intro";

export const EASE = [0.16, 1, 0.3, 1] as const;

type BaseProps = { children: ReactNode; className?: string };

/** Smooth fade + rise when scrolled into view (pure GPU transforms, zero blur jank). */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: BaseProps & { delay?: number; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.85, ease: EASE, delay }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}

/** Same as Reveal but waits for the preloader (above-the-fold content). */
export function IntroReveal({
  children,
  className,
  delay = 0,
  y = 28,
}: BaseProps & { delay?: number; y?: number }) {
  const { ready } = useIntro();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 1.1, ease: EASE, delay: ready ? delay : 0 }}
    >
      {children}
    </motion.div>
  );
}

const container = (stagger: number, delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE },
  },
};

/** Staggered group — wrap children in <StaggerItem>. */
export function Stagger({
  children,
  className,
  stagger = 0.09,
  delay = 0,
}: BaseProps & { stagger?: number; delay?: number }) {
  return (
    <motion.div
      className={className}
      variants={container(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: BaseProps) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}
