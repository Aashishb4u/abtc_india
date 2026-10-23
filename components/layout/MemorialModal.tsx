"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useIntro } from "@/lib/intro";

const PORTRAIT =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDR-O6_crpA2nbM0AUkDq21akrW3ZKN53gmZtVf6uAOyJnJVgVx5uaBR1CM-A5cvztmjFslVrz64BtqvffDVmDKlNRbnIiLnKZAy2J69o9hvm7C49qiPJceB9f9pzJMsygS10NxeT1zJrhvxcrV9RPLEzLRvY4CjJuWnF4oPVUxbLjj_5g2tryR9ZQrpBNkrc6h2c-3T7g0wqebA1oLUTSHIG2SZt1kTiREqXe-fKFCeDNpe5to2ZDe9A";

export function MemorialModal() {
  const { ready } = useIntro();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    try {
      if (sessionStorage.getItem("abtc-memorial") === "1") return;
    } catch {}
    const timer = window.setTimeout(() => setOpen(true), 1100);
    return () => window.clearTimeout(timer);
  }, [ready]);

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
    setOpen(false);
    try {
      sessionStorage.setItem("abtc-memorial", "1");
    } catch {}
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button type="button" aria-label="Close tribute" className="absolute inset-0 bg-midnight/70 backdrop-blur-sm" onClick={close} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="memorial-title"
        className="relative flex max-h-[min(88vh,640px)] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/80 bg-white shadow-glass-dark"
      >
        <div className="flex items-center justify-between gap-4 border-b border-ice-blue bg-gradient-to-r from-white to-ice-blue/60 px-5 py-3 sm:px-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-electric-blue">In revered remembrance</p>
            <h2 id="memorial-title" className="font-display text-xl font-bold text-royal-navy sm:text-2xl">
              Maya Paranjapye (Late)
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-royal-navy text-white"
            aria-label="Close"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 overflow-y-auto md:grid-cols-[240px_1fr] md:overflow-hidden">
          <div className="flex items-center justify-center bg-ice-blue/40 p-4 md:p-5">
            <img
              src={PORTRAIT}
              alt="Late Maya Paranjapye"
              className="aspect-[4/5] w-44 rounded-2xl object-cover object-top shadow-glass md:w-full"
            />
          </div>
          <div className="space-y-3 overflow-y-auto px-5 py-4 text-sm leading-relaxed text-accent-navy sm:px-6 md:max-h-[520px]">
            <p>
              ABTC (India) deeply regrets to announce the sudden passing away of our Founder Ms Maya Paranjapye on the 21st of September 2019 in USA. Ms Maya Paranjapye who was born on March 1945 was a renowned academician, who in 1996 spearheaded and brought the Beauty industry to its glory of what it is even today. Armed with skills and sheer determination she successfully managed to create a niche for herself and was considered a leader in the beauty world.
            </p>
            <p>
              Maya worked for a year in the school of Chemistry of the University of Geneva (Switzerland) as Laboratory Assistant in Department of Biological and Special Organic Chemistry. During this period she had the opportunity to learn all aspects of modern Bio-Chemistry and Biochemical Analysis. This prompted Maya Paranjapye to undertake personal training in Beauty Culture at Geneva (Switzerland).
            </p>
            <p>
              She continued her journey in the beauty business, did further studies in ‘Beauty Therapy’ diploma from ‘International School of Natural Beauty therapy’ London, U.K. in 1972. After her return from London she started teaching complete Diploma Course in ‘Beauty Therapy’ as per British Association Curriculum and thus Butic Institute was formed.
            </p>
            <p>
              She was instrumental in forming the Association of Beauty therapy & cosmetology (India) in 1986. 1994 Association of Beauty therapy & cosmetology (India) became a CIDESCO section under her leadership. 1997 September her dream came true when India held the 1st ever CIDESCO conference in Mumbai India, which was the highlight of her career.
            </p>
            <p>She was a visionary, who put the Indian section of CIDESCO on the world map.</p>
            <p className="font-display text-base font-semibold italic text-electric-blue">
              We deeply mourn her sudden demise, a big salute to a great pioneer & leader.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
