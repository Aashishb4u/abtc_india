"use client";

import { IMAGES } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/motion/Magnetic";
import { SplitCopy } from "@/components/motion/SplitCopy";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { PanelShell } from "@/components/motion/PanelShell";
import { TiltCard } from "@/components/motion/TiltCard";
import { IntroReveal } from "@/components/motion/Reveal";

export function Hero() {
  return (
    <section id="hero" className="relative mx-auto max-w-7xl px-4 sm:px-6">
      <PanelShell
        intro
        className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-glass backdrop-blur-xl sm:p-10 md:p-14"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-electric-blue/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-royal-purple/10 blur-3xl" />

        <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="space-y-6 text-left lg:col-span-7">
            <IntroReveal delay={0.1}>
              <Badge>ABTC INDIA · PROFESSIONAL BEAUTY EDUCATION</Badge>
            </IntroReveal>

            <SplitHeading
              as="h1"
              intro
              type="words"
              delay={0.15}
              className="font-display text-3xl font-bold leading-[1.18] tracking-tight text-royal-navy sm:text-4xl md:text-5xl lg:text-[3.25rem]"
            >
              Elevating the Standards of Beauty &amp; Wellness Education
            </SplitHeading>

            <SplitCopy intro delay={0.45} className="max-w-xl text-base font-normal leading-relaxed text-text-subtle sm:text-lg">
              <p>
                Advancing professional excellence in beauty therapy and cosmetology through
                education, internationally recognised qualifications, and industry collaboration.
              </p>
            </SplitCopy>

            <IntroReveal delay={0.7}>
              <div className="flex flex-col items-stretch gap-3.5 pt-2 sm:flex-row sm:items-center">
                <Magnetic strength={0.2}>
                  <Button href="#education" icon="arrow_forward">
                    Explore Our Programs
                  </Button>
                </Magnetic>
                <Magnetic strength={0.2}>
                  <Button href="#about" variant="outline">
                    Discover ABTC India
                  </Button>
                </Magnetic>
              </div>
            </IntroReveal>
          </div>

          <div className="lg:col-span-5">
            <TiltCard max={5} className="mx-auto w-full max-w-md overflow-hidden rounded-3xl lg:max-w-none">
              <PhotoFrame
                src={IMAGES.hero}
                alt="ABTC seminar hall during a hands-on aesthetic training session."
                caption="Live training session"
                className="aspect-[5/4] sm:aspect-[4/5]"
                position="object-[center_58%]"
              />
            </TiltCard>
          </div>
        </div>
      </PanelShell>
    </section>
  );
}
