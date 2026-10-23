"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/motion/Magnetic";
import { PanelShell } from "@/components/motion/PanelShell";
import { RiseGrid } from "@/components/motion/RiseGrid";
import { SplitCopy } from "@/components/motion/SplitCopy";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { TiltCard } from "@/components/motion/TiltCard";
import { cn } from "@/lib/utils";

const light = "rounded-3xl border border-white/80 bg-white/70 p-6 shadow-glass backdrop-blur-xl sm:p-10 md:p-14";
const dark = "rounded-3xl border border-white/10 bg-gradient-to-br from-midnight via-royal-navy to-royal-purple p-6 text-white shadow-glass-dark sm:p-10 md:p-14";

const FAQS = [
  ["abtc", "What is ABTC?", "ABTC is the registered Association of Beauty Therapy & Cosmetology, India, born in 1986 to promote scientific knowledge of beauty therapy and the wellbeing of the industry. It is affiliated to CIDESCO and CIBTAC."],
  ["abtc", "What is the ABTC exam?", "A national examination for qualified beauty therapists, covering clinical practical skill and scientific theory: dermatology, hygiene, facial electrotherapy, body therapies, and salon administration."],
  ["abtc", "Why should I appear for the ABTC exam?", "It gives national recognition, stronger career credibility, eligibility for advanced training, and a distinction that luxury wellness groups and medi-spas look for."],
  ["abtc", "What are the benefits of ABTC life membership?", "Lifelong affiliation, seminars, discounted examination entry, a verified practitioner listing, and a voice in national committee proceedings."],
  ["cidesco", "What is CIDESCO?", "Comité International d'Esthétique et de Cosmétologie, founded in Zurich in 1946 and active in more than 40 countries. It sets the benchmark for beauty and spa therapy."],
  ["cidesco", "What is the CIDESCO diploma?", "The highest worldwide qualification in aesthetics. It certifies anatomy, physiology, clinical treatments, and a scientific case project, and supports work across member countries."],
  ["accreditation", "Does ABTC provide training for the exams?", "ABTC coordinates examinations through accredited schools. Training is delivered by those schools. ABTC is the national assessing and accrediting body."],
  ["accreditation", "What are CIDESCO accredited schools?", "Schools inspected to teach the official CIDESCO syllabus, with the required labs, qualified examiners, and clinical equipment."],
  ["cidesco", "How can I get a CIDESCO diploma?", "Enrol at an accredited CIDESCO school, complete the theory and clinical hours, pass the practical and written examinations, and submit the required case work."],
] as const;

const FILTERS = [
  ["all", "All questions"],
  ["abtc", "ABTC board & exams"],
  ["cidesco", "CIDESCO"],
  ["accreditation", "Accreditation & schools"],
] as const;

export function FaqPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number][0]>("all");
  const [open, setOpen] = useState(0);
  const items = FAQS.map((row, i) => ({ row, i })).filter(({ row }) => filter === "all" || row[0] === filter);

  return (
    <div className="space-y-16 md:space-y-24">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={`${light} text-center`}>
          <Badge>Knowledge base & admissions</Badge>
          <SplitHeading as="h1" type="words" className="mt-4 font-display text-4xl font-bold text-royal-navy sm:text-5xl">
            Frequently Asked Questions
          </SplitHeading>
          <SplitCopy className="mx-auto mt-3 max-w-2xl text-text-subtle">
            <p>Clear guidance on ABTC examinations, CIDESCO international diplomas, accreditation, and membership.</p>
          </SplitCopy>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {FILTERS.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => { setFilter(id); setOpen(0); }}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider",
                  filter === id ? "bg-royal-navy text-white" : "border border-ice-blue bg-white text-text-subtle"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </PanelShell>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <RiseGrid className="grid gap-4 md:grid-cols-3">
          {[
            ["school", "Zurich curriculum", "Regulated under CIDESCO guidelines since 1946."],
            ["verified_user", "Reg. No. FI1552", "The national section for professional cosmetology."],
            ["public", "40+ member nations", "A qualification recognised across the CIDESCO network."],
          ].map(([icon, title, body]) => (
            <TiltCard key={title} max={4} spotlight={false} className="rounded-2xl border border-white/80 bg-white/80 p-6 shadow-glass">
              <Icon name={icon} className="text-2xl text-electric-blue" />
              <h3 className="mt-3 font-display text-lg font-bold text-royal-navy">{title}</h3>
              <p className="mt-1 text-sm text-text-subtle">{body}</p>
            </TiltCard>
          ))}
        </RiseGrid>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6">
        <RiseGrid key={filter} className="space-y-3">
          {items.map(({ row, i }, index) => {
            const on = open === index;
            return (
              <TiltCard key={row[1]} max={2} spotlight={false} className="overflow-hidden rounded-2xl border border-white/80 bg-white shadow-glass">
                <button
                  type="button"
                  aria-expanded={on}
                  onClick={() => setOpen(on ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-royal-navy text-sm font-bold text-white">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-lg font-semibold text-royal-navy">{row[1]}</span>
                  </span>
                  <Icon name="expand_more" className={cn("text-electric-blue transition", on && "rotate-180")} />
                </button>
                {on && <p className="border-t border-ice-blue px-5 py-4 text-sm leading-relaxed text-text-subtle">{row[2]}</p>}
              </TiltCard>
            );
          })}
        </RiseGrid>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={dark}>
          <Badge dark>Executive secretariat</Badge>
          <SplitHeading type="words" className="mt-3 font-display text-3xl font-bold">Still have questions?</SplitHeading>
          <SplitCopy className="mt-2 max-w-xl text-white/75"><p>The registrar can help with school affiliation, syllabus checks, and overseas credentials.</p></SplitCopy>
          <div className="mt-6">
            <Magnetic strength={0.2}>
              <Button href="mailto:abtcindia@gmail.com" variant="white" iconLeft="mail">Contact secretariat</Button>
            </Magnetic>
          </div>
        </PanelShell>
      </section>
    </div>
  );
}
