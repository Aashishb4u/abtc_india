"use client";

import Link from "next/link";
import { IMAGES } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { SplitCopy } from "@/components/motion/SplitCopy";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { PanelShell } from "@/components/motion/PanelShell";
import { TiltCard } from "@/components/motion/TiltCard";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 sm:px-6">
      <PanelShell className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-glass backdrop-blur-xl sm:p-12 md:p-14">
        <div className="grid grid-cols-1 items-center gap-10 md:gap-14 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-7">
            <Reveal>
              <Badge className="!border-electric-blue/20 !bg-ice-blue !text-electric-blue">WHO WE ARE</Badge>
            </Reveal>

            <SplitHeading type="words" className="font-display text-2xl font-bold leading-snug tracking-tight text-royal-navy sm:text-3xl md:text-4xl">
              Shaping the Future of Professional Beauty
            </SplitHeading>

            <div className="space-y-4 text-sm font-normal leading-relaxed text-text-subtle sm:text-base">
              <SplitCopy delay={0.1}>
                <p>
                  <strong className="font-semibold text-royal-navy">
                    ABTC is a Non Profit Organization in Mumbai
                  </strong>
                  , who is India&apos;s leading professional educational body in India.
                </p>
              </SplitCopy>
              <SplitCopy delay={0.05}>
                <p>
                  Our mission is to provide the advanced training you need and to develop your
                  competitive edge to succeed within today&apos;s aesthetic industry. We are
                  constantly updating our programs to include the latest, most in-demand services
                  and industry advancements, so that our graduates are always ahead of the
                  competition.
                </p>
              </SplitCopy>
              <SplitCopy>
                <div className="rounded-xl border-l-4 border-electric-blue bg-ice-blue/50 p-4 text-sm font-medium italic text-royal-navy backdrop-blur-sm transition-colors duration-300 hover:bg-ice-blue/70 sm:text-base">
                  This enables our graduates to work independently in their own business or in some
                  of the most prestigious beauty spas in India &amp; abroad.
                </div>
              </SplitCopy>
            </div>

            <Reveal delay={0.3} className="pt-2">
              <Link
                href="#education"
                className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-royal-navy transition-colors hover:text-electric-blue"
              >
                <span className="border-b-2 border-electric-blue pb-0.5">Discover Our Story</span>
                <Icon
                  name="arrow_forward"
                  className="text-sm transition-transform duration-300 group-hover:translate-x-1.5"
                />
              </Link>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <TiltCard max={5} className="mx-auto max-w-md lg:max-w-none">
              <img
                src={IMAGES.about}
                alt="Academy students in a treatment room. Aesthetic Academy Training, Standard of Practical Excellence."
                className="h-auto w-full object-contain"
              />
            </TiltCard>
          </div>
        </div>
      </PanelShell>
    </section>
  );
}
