"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useRef, type ReactNode, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. Keep tiny (1–2) for large containers. */
  max?: number;
  scale?: number;
  spotlight?: boolean;
};

/**
 * Spring-physics 3D tilt with a cursor-tracking specular spotlight.
 * Pointer-type aware: touch / pen never tilt, reduced motion disables it.
 */
export function TiltCard({
  children,
  className,
  max = 5,
  scale = 1.012,
  spotlight = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const reduce = useReducedMotion();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 180, damping: 20, mass: 0.4 });
  const sy = useSpring(ry, { stiffness: 180, damping: 20, mass: 0.4 });
  const mx = useMotionValue(-999);
  const my = useMotionValue(-999);
  const bg = useMotionTemplate`radial-gradient(520px circle at ${mx}px ${my}px, rgba(7,153,232,0.16), transparent 60%)`;

  const onEnter = () => {
    if (ref.current) rectRef.current = ref.current.getBoundingClientRect();
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    if (!rectRef.current && ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
    const r = rectRef.current;
    if (!r) return;
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    mx.set(x);
    my.set(y);
    ry.set((x / r.width - 0.5) * 2 * max);
    rx.set(-(y / r.height - 0.5) * 2 * max);
  };

  const onLeave = () => {
    rectRef.current = null;
    rx.set(0);
    ry.set(0);
    mx.set(-999);
    my.set(-999);
  };

  return (
    <motion.div
      ref={ref}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      whileHover={reduce ? undefined : { scale }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      style={{
        rotateX: sx,
        rotateY: sy,
        transformPerspective: 1100,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative will-change-transform", className)}
    >
      {children}
      {spotlight && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit]"
          style={{ background: bg }}
        />
      )}
    </motion.div>
  );
}
