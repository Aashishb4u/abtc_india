"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { useIntro } from "@/lib/intro";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  intro?: boolean;
  delay?: number;
};

/** Body copy revealed word by word, masked so each word rises into place. */
export function SplitCopy({ children, className, intro = false, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
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
          type: "words",
          mask: "words",
          autoSplit: true,
          wordsClass: "split-word",
          onSplit: (self) =>
            gsap.from(self.words, {
              yPercent: 110,
              duration: 1.05,
              ease: "expo.out",
              stagger: 0.032,
              delay,
              scrollTrigger: intro ? undefined : { trigger: el, start: "top 90%", once: true },
            }),
        });
      });
    },
    { scope: ref, dependencies: [ready], revertOnUpdate: true }
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
