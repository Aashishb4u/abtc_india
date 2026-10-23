"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/motion/Magnetic";
import { PanelShell } from "@/components/motion/PanelShell";
import { RiseGrid } from "@/components/motion/RiseGrid";
import { SplitCopy } from "@/components/motion/SplitCopy";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { TiltCard } from "@/components/motion/TiltCard";

const light = "rounded-3xl border border-white/80 bg-white/70 p-6 shadow-glass backdrop-blur-xl sm:p-10 md:p-14";
const dark = "rounded-3xl border border-white/10 bg-gradient-to-br from-midnight via-royal-navy to-royal-purple p-6 text-white shadow-glass-dark sm:p-10 md:p-14";

const AIMS = [
  "The primary aim was, to form a section, registered in India.",
  "To be affiliated with CIDESCO International body.",
  "Bring all the beauty professionals together on a common platform.",
  "To impart knowledge and to educate them to an international level.",
  "To groom aspiring beauty therapists to achieve their goals and make them independent professionals.",
  "To promote ABTC certification for beauty therapists who successfully pass the examination.",
  "Recognition and acceptance of ABTC beyond the boundaries of Maharashtra.",
  "Promoting ABTC and CIDESCO schools in India.",
  "Encouraging corporates to be a part of the ABTC.",
];

const FACULTY: [string, string[]][] = [
  ["Mumbai", ["Menorama Kantawala (Mena)", "Minal Bhaindarkar", "Rajashri Sabastain", "Smita Narvekar", "Trupti Shah", "Varda More"]],
  ["Pune", ["Ajita Surve", "Anita Kakodkar", "Anjali Joshi", "Kalpana Bhatt", "Monika Palande", "Namarta Goud", "Prachi Chopde", "Priti Pawar", "Sarika Bedre", "Sheetal Kamble", "Smita Deo", "Vrushali Salve"]],
  ["District", ["Deepa Bhagwat – Ahmednagar", "Pragati Vaje – Ratnagiri", "Arun Lonkar – Phaltan, Satara", "Mrinalini Kolekar – Satara", "Sunanda Maharana – Solapur"]],
  ["A.P. Kakinada", ["Appasani Krishnakumar", "Metta Radha Saraswati", "Mohammad Mina Farheen", "Mohammad Jareena Begum", "Rubina Mohammad"]],
  ["A.P. Rajamahendravaram", ["Rayavarapu Chaitanya Rama Chandana"]],
];

export function EducationPage() {
  return (
    <div className="space-y-16 md:space-y-24">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={light}>
          <Badge>Professional curricula & clinical faculty</Badge>
          <SplitHeading as="h1" type="words" className="mt-4 font-display text-4xl font-bold text-royal-navy sm:text-5xl">
            Education
          </SplitHeading>
          <p className="mt-3 max-w-2xl text-text-subtle">
            Academic standards, international certifications, and regional faculty under the Indian Section of CIDESCO International (Reg. No. FI1552).
          </p>
        </PanelShell>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <RiseGrid className="grid gap-5 md:grid-cols-2">
          <TiltCard max={4} spotlight={false} className="rounded-2xl border border-white bg-white p-8 shadow-glass">
            <span className="text-[11px] font-bold uppercase tracking-wider text-electric-blue">National framework</span>
            <h2 className="mt-2 font-display text-2xl font-bold text-royal-navy">ABTC Certification</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-subtle">
              Qualified skin therapists who have completed basic and advanced beauty training can sit the ABTC certificate examination. Schools may offer the additional certificate by entering students for the exam.
            </p>
          </TiltCard>
          <TiltCard max={4} spotlight={false} className="rounded-2xl border border-white bg-white p-8 shadow-glass">
            <span className="text-[11px] font-bold uppercase tracking-wider text-electric-blue">Global benchmark</span>
            <h2 className="mt-2 font-display text-2xl font-bold text-royal-navy">CIDESCO Certification</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-subtle">
              Since 1946, CIDESCO has been a major international body in aesthetics. The CIDESCO Diploma is among the most widely recognised beauty therapy qualifications.
            </p>
          </TiltCard>
        </RiseGrid>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={light}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-electric-blue">Institutional mission</p>
          <SplitHeading type="words" className="mt-2 font-display text-3xl font-bold text-royal-navy">ABTC India Aim & Agenda</SplitHeading>
          <RiseGrid className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {AIMS.map((aim, i) => (
              <div key={aim} className="flex items-start gap-3 rounded-xl border border-ice-blue bg-white p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ice-blue text-sm font-bold text-royal-navy">{i + 1}</span>
                <p className="text-sm text-accent-navy">{aim}</p>
              </div>
            ))}
          </RiseGrid>
        </PanelShell>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={light}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-electric-blue">Authorized section committee</p>
          <SplitHeading type="words" className="mt-2 font-display text-3xl font-bold text-royal-navy">
            Education Faculty & Regional Coordinators
          </SplitHeading>
          <div className="mt-8 space-y-8">
            {FACULTY.map(([region, people]) => (
              <div key={region}>
                <h3 className="font-display text-xl font-bold text-royal-navy">{region}</h3>
                <p className="text-xs font-bold uppercase tracking-wider text-text-subtle">{people.length} members</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {people.map((name) => (
                    <div key={name} className="flex items-center gap-3 rounded-xl border border-ice-blue bg-white px-4 py-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-royal-navy text-xs font-bold text-white">
                        {name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-royal-navy">{name}</p>
                        <p className="text-[11px] uppercase tracking-wider text-text-subtle">Faculty · {region}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PanelShell>
      </section>

      <section id="syllabus" className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={dark}>
          <Badge dark>CIDESCO registration FI1552</Badge>
          <SplitHeading type="words" className="mt-3 font-display text-3xl font-bold">Accreditation & examination verification</SplitHeading>
          <SplitCopy className="mt-3 max-w-2xl text-white/80">
            <p>Practitioners seeking ABTC credentials or a CIDESCO Diploma can ask for the examination syllabus, confirm a registered school, and request testing dates.</p>
          </SplitCopy>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Magnetic strength={0.2}>
              <Button href="mailto:abtcindia@gmail.com" variant="white" icon="arrow_forward">Inquire about examinations</Button>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Button href="/accreditations" variant="ghost-dark" iconLeft="description">Registered schools</Button>
            </Magnetic>
          </div>
        </PanelShell>
      </section>
    </div>
  );
}
