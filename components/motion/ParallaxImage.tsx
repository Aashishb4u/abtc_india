"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useIntro } from "@/lib/intro";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Parallax travel in % of the image height. */
  speed?: number;
  /** Wait for the preloader before the clip-path reveal. */
  intro?: boolean;
  position?: string;
};

/**
 * Image with a clip-path reveal and scroll-scrubbed parallax. The inner layer
 * is oversized by 10% on every side so travel never exposes an edge.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  sizes = "(min-width:1024px) 40vw, 100vw",
  priority,
  speed = 7,
  intro = false,
  position = "object-center",
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const { ready } = useIntro();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (intro && !ready) {
          gsap.set(wrap.current, { clipPath: "inset(100% 0% 0% 0%)" });
          return;
        }

        gsap.fromTo(
          layer.current,
          { yPercent: -speed },
          {
            yPercent: speed,
            ease: "none",
            scrollTrigger: {
              trigger: wrap.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );

        gsap.fromTo(
          wrap.current,
          { clipPath: intro ? "inset(100% 0% 0% 0%)" : "inset(14% 10% 14% 10%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.6,
            ease: "expo.out",
            delay: intro ? 0.15 : 0,
            clearProps: "clipPath",
            scrollTrigger: intro ? undefined : { trigger: wrap.current, start: "top 88%", once: true },
          }
        );

        gsap.fromTo(
          layer.current,
          { scale: 1.25 },
          {
            scale: 1,
            duration: 2,
            ease: "expo.out",
            delay: intro ? 0.15 : 0,
            scrollTrigger: intro ? undefined : { trigger: wrap.current, start: "top 88%", once: true },
          }
        );
      });
    },
    { scope: wrap, dependencies: [ready], revertOnUpdate: true }
  );

  return (
    <div ref={wrap} className={cn("relative overflow-hidden", className)}>
      <div ref={layer} className="absolute -inset-[10%] will-change-transform">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", position)}
        />
      </div>
    </div>
  );
}
