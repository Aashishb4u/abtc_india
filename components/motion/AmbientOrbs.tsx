"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Fixed atmosphere: three drifting gradient orbs that also parallax with
 * scroll at different rates, plus the dot mesh.
 */
export function AmbientOrbs() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const y1 = useTransform(p, [0, 1], [0, -260]);
  const y2 = useTransform(p, [0, 1], [0, 340]);
  const y3 = useTransform(p, [0, 1], [0, -180]);

  const drift = (x: number[], y: number[], s: number[], d: number) =>
    reduce
      ? undefined
      : {
          x,
          y,
          scale: s,
          transition: { duration: d, repeat: Infinity, ease: "easeInOut" as const },
        };

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden transform-gpu will-change-transform">
      <div className="mesh-dots absolute inset-0 opacity-80" />

      <motion.div style={{ y: y1 }} className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 transform-gpu">
        <motion.div
          animate={drift([0, 45, -30, 0], [0, -35, 25, 0], [1, 1.08, 0.95, 1], 24)}
          className="h-[580px] w-[580px] rounded-full bg-gradient-to-br from-electric-blue/15 to-transparent blur-[140px] transform-gpu will-change-transform"
        />
      </motion.div>

      <motion.div style={{ y: y2 }} className="absolute left-0 top-1/3 -translate-x-1/3 transform-gpu">
        <motion.div
          animate={drift([0, -40, 35, 0], [0, 30, -20, 0], [1, 1.1, 0.92, 1], 28)}
          className="h-[480px] w-[480px] rounded-full bg-gradient-to-tr from-royal-purple/15 to-transparent blur-[130px] transform-gpu will-change-transform"
        />
      </motion.div>

      <motion.div style={{ y: y3 }} className="absolute bottom-1/4 right-1/4 transform-gpu">
        <motion.div
          animate={drift([0, 30, 0], [0, 40, 0], [1, 1.06, 1], 22)}
          className="h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-electric-blue/10 via-royal-navy/10 to-transparent blur-[150px] transform-gpu will-change-transform"
        />
      </motion.div>
    </div>
  );
}
