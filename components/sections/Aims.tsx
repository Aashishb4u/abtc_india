"use client";

import { motion } from "framer-motion";
import { AIMS } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { TiltCard } from "@/components/motion/TiltCard";

export function Aims() {
  return (
    <section id="aims" className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-glass backdrop-blur-xl sm:p-12 md:p-14">
        <div className="mb-8 max-w-3xl space-y-3">
          <Reveal>
            <Badge className="!border-electric-blue/20 !bg-ice-blue !text-electric-blue">
              OBJECTIVES &amp; MANDATE
            </Badge>
          </Reveal>
          <SplitHeading className="font-display text-2xl font-bold tracking-tight text-royal-navy sm:text-3xl md:text-4xl">
            ABTC Aim &amp; Agenda
          </SplitHeading>
          <Reveal delay={0.1}>
            <p className="text-sm text-text-subtle">
              Core charter guiding the national section and upholding international benchmarks
              across India.
            </p>
          </Reveal>
        </div>

        <Stagger className="grid grid-cols-1 gap-3.5 md:grid-cols-2" stagger={0.07}>
          {AIMS.map((text, i) => (
            <StaggerItem key={text} className={i === AIMS.length - 1 ? "md:col-span-2" : undefined}>
              <TiltCard
                max={3}
                scale={1.01}
                className="flex items-start gap-3.5 rounded-xl border border-ice-blue bg-white/60 p-3.5 shadow-sm transition-colors duration-300 hover:border-electric-blue/30 hover:bg-white hover:shadow-md"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -90 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.15 + i * 0.05 }}
                  className="mt-0.5 flex-shrink-0 text-electric-blue"
                >
                  <Icon name="check_circle" filled className="text-lg" />
                </motion.span>
                <span className="text-sm leading-snug text-accent-navy">{text}</span>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-royal-navy/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-text-subtle">
            Join India&apos;s national standard network for beauty therapy professionals.
          </p>
          <Magnetic strength={0.2}>
            <Button href="#footer" icon="arrow_forward" className="h-10 px-6">
              Become a Member
            </Button>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
