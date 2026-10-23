"use client";

import { motion } from "framer-motion";
import { IMAGES } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/motion/Magnetic";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
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
            <TiltCard max={5} className="group mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-electric-blue/30 to-royal-purple/30 opacity-75 blur-lg transition duration-500 group-hover:opacity-100" />
              <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl md:rounded-3xl">
                <ParallaxImage
                  intro
                  priority
                  src={IMAGES.hero}
                  alt="Indian woman receiving a gentle clinical skincare treatment in a bright, minimalist aesthetic academy clinic"
                  sizes="(min-width:1024px) 40vw, 90vw"
                  speed={6}
                  className="h-[460px] sm:h-[520px]"
                />
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-x-4 bottom-4 z-10"
                >
                  <div className="flex items-center justify-between rounded-xl border border-white/20 bg-midnight/70 p-4 text-white shadow-glass-dark backdrop-blur-xl">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-blue opacity-70" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-electric-blue" />
                        </span>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary-fixed">
                          Swiss Academic Rigor
                        </p>
                      </div>
                      <p className="font-display text-sm font-semibold tracking-wide">
                        Global Aesthetic Standards
                      </p>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-electric-blue backdrop-blur-md transition-transform duration-300 group-hover:rotate-12">
                      <Icon name="verified_user" filled className="text-xl" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </TiltCard>
          </div>
        </div>
      </PanelShell>
    </section>
  );
}
