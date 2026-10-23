"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { SplitCopy } from "@/components/motion/SplitCopy";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { PanelShell } from "@/components/motion/PanelShell";

export function Cidesco() {
  const root = useRef<HTMLElement>(null);

  // Scroll-scrubbed watermark + background glow parallax
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".cid-mark", {
          rotate: 120,
          yPercent: -18,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
        });
        gsap.to(".cid-glow", {
          yPercent: 35,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
        });
      });
    },
    { scope: root }
  );

  return (
    <section id="cidesco" ref={root} className="mx-auto max-w-7xl px-4 sm:px-6">
      <PanelShell className="rounded-3xl border border-white/10 bg-gradient-to-br from-midnight via-royal-navy to-royal-purple p-7 text-white shadow-glass-dark sm:p-12 md:p-14">
        <div className="cid-glow pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-electric-blue/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 flex h-80 w-80 items-center justify-center rounded-full border border-white/10">
          <span className="cid-mark select-none font-display text-9xl font-bold text-white/5">©</span>
        </div>

        <div className="relative z-10 max-w-4xl space-y-6">
          <Reveal>
            <Badge dark>SWISS ACCREDITATION</Badge>
          </Reveal>

          <SplitHeading type="words" className="font-display text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl md:text-4xl">
            The Pinnacle of International Beauty Therapy
          </SplitHeading>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm font-light leading-relaxed text-white/90 backdrop-blur-md transition-colors duration-300 hover:border-white/20 sm:text-base">
            <SplitCopy>
              <p>
                CIDESCO has long been regarded as the leading international qualification in beauty
                therapy. Founded in 1946 with head office in Zurich, Switzerland, CIDESCO
                International is represented in over 40 countries.
              </p>
            </SplitCopy>
            <SplitCopy>
              <p>
                This world-renowned qualification is the pinnacle of professionalism, opening doors
                to many prestigious career opportunities all over the world as employers and clients
                recognize the value and skills that this achievement represents.
              </p>
            </SplitCopy>
            <SplitCopy>
              <p className="border-t border-white/10 pt-2 text-xs text-white/75 sm:text-sm">
                Studying at a CIDESCO International School ensures the highest standards of
                education and assessment. Many major Indian and international employers insist on
                the CIDESCO Diploma for therapists in their business. The CIDESCO Diploma &amp;
                certificate courses are the world&apos;s most prestigious qualification in the field
                of beauty therapy.
              </p>
            </SplitCopy>
          </div>

          <Reveal delay={0.2} className="pt-2">
            <Magnetic strength={0.2}>
              <Button href="#education" variant="white" iconLeft="school" className="h-11 px-6">
                Discover CIDESCO
              </Button>
            </Magnetic>
          </Reveal>
        </div>
      </PanelShell>
    </section>
  );
}
