"use client";

import { createElement, useRef, type ElementType } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { useIntro } from "@/lib/intro";

type Props = {
  as?: ElementType;
  children: string;
  className?: string;
  /** What gets masked and revealed. */
  type?: "lines" | "words" | "chars";
  /** Wait for the preloader instead of scroll position. */
  intro?: boolean;
  delay?: number;
  stagger?: number;
  start?: string;
};

/**
 * GSAP SplitText masked reveal. `autoSplit` re-splits on resize / font load so
 * line breaks are always correct, and the animation is returned from onSplit so
 * GSAP cleans up and replays it safely.
 */
export function SplitHeading({
  as: Tag = "h2",
  children,
  className,
  type = "lines",
  intro = false,
  delay = 0,
  stagger,
  start = "top 88%",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const { ready } = useIntro();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (intro && !ready) {
          gsap.set(el, { autoAlpha: 0 });
          return;
        }
        gsap.set(el, { autoAlpha: 1 });

        SplitText.create(el, {
          type: type === "chars" ? "chars,words" : type,
          mask: type,
          autoSplit: true,
          linesClass: "split-line",
          wordsClass: "split-word",
          charsClass: "split-char",
          onSplit: (self) => {
            const targets =
              type === "chars" ? self.chars : type === "words" ? self.words : self.lines;
            return gsap.from(targets, {
              yPercent: 112,
              duration: 1.25,
              ease: "expo.out",
              stagger: stagger ?? (type === "chars" ? 0.035 : type === "words" ? 0.07 : 0.1),
              delay,
              scrollTrigger: intro ? undefined : { trigger: el, start, once: true },
            });
          },
        });
      });
    },
    { scope: ref, dependencies: [ready], revertOnUpdate: true }
  );

  return createElement(Tag, { ref, className }, children);
}
