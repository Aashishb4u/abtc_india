"use client";

import Link from "next/link";
import { IMAGES } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { TiltCard } from "@/components/motion/TiltCard";

export function News() {
  return (
    <section id="news" className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-glass backdrop-blur-xl sm:p-12 md:p-14">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-royal-navy/10 pb-6 md:flex-row md:items-end">
          <div className="space-y-2">
            <Reveal>
              <Badge className="!border-electric-blue/20 !bg-ice-blue !text-electric-blue">NEWS &amp; UPDATES</Badge>
            </Reveal>
            <SplitHeading className="font-display text-2xl font-bold tracking-tight text-royal-navy sm:text-3xl md:text-4xl">
              The Latest from ABTC India
            </SplitHeading>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-xs text-text-subtle">
              Historic accreditation agreements and official activities of the Indian Section of
              CIDESCO International.
            </p>
          </Reveal>
        </div>

        <div className="space-y-6">
          <Reveal>
            <TiltCard
              max={1.5}
              scale={1}
              className="rounded-2xl border-l-4 border-electric-blue bg-ice-blue/40 p-5 shadow-sm backdrop-blur-sm transition-colors duration-300 hover:bg-ice-blue/60 sm:p-6"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-electric-blue">MILESTONE EVENT</span>
              <h4 className="mb-3 mt-1 font-display text-xl font-bold text-royal-navy sm:text-2xl">
                Land Mark in the History of ABTC INDIA
              </h4>
              <p className="text-sm leading-relaxed text-text-subtle sm:text-base">
                Enrich salons signed up 75 salons for CIDESCO beauty center Accreditation under the
                leadership of Ms Maya Paranjapye Trustee and CIDESCO in charge section India, Ms
                Seema Gopujkar. Thanks to Enrich group for supporting us and getting this long
                awaited CIDESCO beauty center accreditation done.
              </p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-royal-navy sm:text-base">
                It is a landmark in the history of cidesco as yours will be the first huge group to
                get accreditation in the world. Thank you Vikram, Bhupesh, Sachin, Rohit and
                Rushmani.
              </p>
            </TiltCard>
          </Reveal>

          <Stagger className="grid grid-cols-1 gap-5 pt-2 sm:grid-cols-3" stagger={0.14}>
            {IMAGES.news.map((n) => (
              <StaggerItem key={n.caption}>
                <TiltCard
                  max={5}
                  className="group overflow-hidden rounded-2xl border border-white/80 bg-white shadow-sm transition-shadow duration-300 hover:shadow-glass-hover"
                >
                  <ParallaxImage
                    src={n.src}
                    alt={n.alt}
                    sizes="(min-width:640px) 30vw, 90vw"
                    speed={5}
                    className="h-52"
                  />
                  <div className="border-t border-royal-navy/10 bg-white/90 p-3 text-xs font-semibold text-accent-navy backdrop-blur-md transition-colors group-hover:bg-white">
                    {n.caption}
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="flex items-center justify-between border-t border-royal-navy/10 pt-4">
            <span className="font-mono text-[11px] text-text-subtle">Archival Document Ref: FI1552-ENRICH</span>
            <Link
              href="#footer"
              className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-electric-blue hover:underline"
            >
              <span>Read Full Story</span>
              <Icon name="arrow_forward" className="text-sm transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
