"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { useIntro } from "@/lib/intro";

const PORTRAIT = "/images/about/maya-paranjapye-founder-portrait.jpg";

/** Survives client navigation, resets on a full page load. */
let shownThisVisit = false;

export function MemorialModal() {
  const { cleared } = useIntro();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!cleared || shownThisVisit) return;
    setOpen(true);
  }, [cleared]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function close() {
    shownThisVisit = true;
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-midnight p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <button type="button" aria-label="Close tribute" className="absolute inset-0" onClick={close} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="memorial-title"
            className="relative flex max-h-[min(92vh,720px)] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/70 bg-white shadow-glass-dark md:flex-row"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <figure className="flex shrink-0 flex-col justify-center bg-gradient-to-b from-ice-blue to-white p-4 sm:p-5 md:w-[300px] lg:w-[340px]">
              <img
                src={PORTRAIT}
                alt="Late Maya Paranjapye"
                className="mx-auto h-auto max-h-[34vh] w-full rounded-2xl object-contain object-center shadow-glass md:max-h-[min(58vh,460px)]"
              />
              <figcaption className="mt-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-electric-blue">1945 — 2019</p>
                <p className="font-display text-sm font-semibold text-royal-navy">Founder & trustee</p>
              </figcaption>
            </figure>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-4 px-6 pb-1 pt-5 sm:px-8 sm:pt-6">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-electric-blue">In revered remembrance</p>
                  <h2 id="memorial-title" className="mt-1 font-display text-2xl font-bold text-royal-navy sm:text-3xl">
                    Maya Paranjapye
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ice-blue text-royal-navy transition hover:bg-ice-blue"
                  aria-label="Close"
                >
                  <Icon name="close" />
                </button>
              </div>

              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-6 py-3 text-sm leading-6 text-accent-navy sm:px-8 sm:text-[15px] sm:leading-7">
                <p>
                  ABTC (India) deeply regrets to announce the sudden passing of our Founder, Ms Maya Paranjapye, on 21 September 2019 in the USA. Born in March 1945, she was a renowned academician who, from 1996, helped bring the beauty industry to the standing it holds today.
                </p>
                <p>
                  She spent a year in the School of Chemistry at the University of Geneva as a laboratory assistant, then trained in beauty culture in Geneva. In 1972 she earned a Beauty Therapy diploma from the International School of Natural Beauty Therapy, London. On her return she taught the British Association diploma and founded the Butic Institute.
                </p>
                <p>
                  In 1986 she formed the Association of Beauty Therapy & Cosmetology (India). In 1994 it became a CIDESCO section under her leadership. In September 1997 India hosted its first CIDESCO conference in Mumbai — the highlight of her career. She put the Indian section of CIDESCO on the world map.
                </p>
                <p className="font-display text-base italic text-electric-blue">
                  We deeply mourn her sudden demise. A salute to a great pioneer and leader.
                </p>
              </div>

              <div className="flex justify-end border-t border-ice-blue px-6 py-3 sm:px-8">
                <button
                  type="button"
                  onClick={close}
                  className="rounded-xl bg-royal-navy px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
                >
                  Continue
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
