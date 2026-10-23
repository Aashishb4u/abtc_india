"use client";

import Link from "next/link";
import { QUALIFICATIONS } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { TiltCard } from "@/components/motion/TiltCard";
import { cn } from "@/lib/utils";

export function Education() {
  return (
    <section id="education" className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="mx-auto mb-10 max-w-3xl space-y-3 text-center">
        <Reveal>
          <Badge className="!border-electric-blue/20 !bg-ice-blue !text-electric-blue">
            LEARN · DEVELOP · EXCEL
          </Badge>
        </Reveal>
        <SplitHeading className="font-display text-3xl font-bold tracking-tight text-royal-navy sm:text-4xl">
          Education That Shapes Excellence
        </SplitHeading>
        <Reveal delay={0.1}>
          <p className="text-sm leading-relaxed text-text-subtle sm:text-base">
            Abtc&apos; main agenda is to provide a sound education of a very high standard,
            providing an excellent training, which creates consistently competent and well-rounded,
            skilled therapists. Our courses are developed by our education Committee who are
            CIDESCO diploma holders.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <p className="text-xs leading-relaxed text-text-subtle/80 sm:text-sm">
            The beauty therapy industry is a thriving and expanding vocation. The job satisfaction
            and the increasing self-esteem you experience show one&apos;s confidence and expertise,
            an asset to both you &amp; your client.
          </p>
        </Reveal>
      </div>

      <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-3" stagger={0.14}>
        {QUALIFICATIONS.map((q) => (
          <StaggerItem key={q.title} className={cn("h-full", q.featured && "md:-mt-4 md:mb-4")}>
            <TiltCard
              max={6}
              className={cn(
                "group flex h-full flex-col justify-between rounded-2xl p-7 backdrop-blur-xl transition-[box-shadow,border-color] duration-300",
                q.featured
                  ? "border-2 border-electric-blue/40 bg-white/90 shadow-glass hover:border-electric-blue hover:shadow-glow"
                  : "border border-white/80 bg-white/80 shadow-sm hover:border-electric-blue/40 hover:shadow-glass-hover"
              )}
            >
              {q.featured && (
                <span className="absolute right-4 top-4 rounded-full border border-electric-blue/30 bg-ice-blue px-2.5 py-1 text-[9px] font-extrabold uppercase text-electric-blue shadow-sm transition-transform duration-300 group-hover:scale-105">
                  Modular Global
                </span>
              )}
              <div>
                <div
                  className={cn(
                    "mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110",
                    q.featured
                      ? "bg-royal-navy text-electric-blue shadow-sm"
                      : "border border-electric-blue/20 bg-ice-blue text-electric-blue"
                  )}
                >
                  <Icon name={q.icon} filled={q.featured} className="text-2xl" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-electric-blue">{q.eyebrow}</p>
                <h4 className="mb-3 mt-1 font-display text-xl font-bold text-royal-navy">{q.title}</h4>
                <p className="mb-6 text-xs leading-relaxed text-text-subtle sm:text-sm">{q.body}</p>
              </div>
              <Link
                href="#footer"
                className="flex w-full items-center justify-between border-t border-royal-navy/10 pt-3 text-xs font-bold uppercase tracking-wider text-royal-navy transition-colors group-hover:text-electric-blue"
              >
                <span>Explore Qualification</span>
                <Icon
                  name="arrow_forward"
                  className="text-sm transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </TiltCard>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
