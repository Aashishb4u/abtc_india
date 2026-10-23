"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/motion/Magnetic";
import { PanelShell } from "@/components/motion/PanelShell";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { RiseGrid } from "@/components/motion/RiseGrid";
import { SplitCopy } from "@/components/motion/SplitCopy";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { TiltCard } from "@/components/motion/TiltCard";
import { cn } from "@/lib/utils";

const light = "rounded-3xl border border-white/80 bg-white/70 p-6 shadow-glass backdrop-blur-xl sm:p-10 md:p-14";
const dark = "rounded-3xl border border-white/10 bg-gradient-to-br from-midnight via-royal-navy to-royal-purple p-6 text-white shadow-glass-dark sm:p-10 md:p-14";

type Event = {
  loc: string;
  place: string;
  date: string;
  kicker: string;
  title: string;
  body: string;
  foot: string;
  src: string;
};

const EVENTS: Event[] = [
  { loc: "pune", place: "Pune", date: "Outreach", kicker: "Community initiative", title: "Free Beauty Course – Swadhar NGO, Pune", body: "Foundational aesthetics, skin hygiene, and salon practice for community development.", foot: "Accredited workshop", src: "/images/gallery/abtc/free-beauty-course-swadhar-ngo-pune-01.jpg" },
  { loc: "nashik", place: "Nashik", date: "10 Dec 2018", kicker: "National conclave", title: "ABTC Grand Seminar, Nashik", body: "Regional practitioners reviewed CIDESCO clinical hygiene modules and peel certifications.", foot: "State conclave", src: "/images/gallery/abtc/abtc-grand-seminar-conducted-at-nasik-on-10th-dec-2018-2-1.jpg" },
  { loc: "kakinada", place: "Kakinada", date: "17 Mar 2019", kicker: "State chapter", title: "Opening of the Andhra Pradesh chapter, Kakinada", body: "Charter installation for the Andhra Pradesh branch of international certifications.", foot: "Inaugural session", src: "/images/gallery/abtc/grand-opening-ceremony-of-association-of-beauty-cosmetology-apandhrapradesh-kakinada-on-17th-march-2019-16-1.jpg" },
  { loc: "pune", place: "Pune", date: "22 Oct 2018", kicker: "Continuing education", title: "Refresher course, Pune", body: "Lymphatic drainage, electronic facials, and clinic sterilisation protocols.", foot: "Certified faculty", src: "/images/gallery/refreshre-course-pune-22-10-2018-9-1.jpg" },
  { loc: "mumbai", place: "Mumbai", date: "1 Sep 2018", kicker: "Practical assessment", title: "Examiners’ practical exam, Mumbai", body: "Clinical assessment by national examiners under CIDESCO Zurich criteria.", foot: "Practical jury", src: "/images/gallery/abtc/examiners-practical-exam-01-09-18-mumbai-3-2.jpg" },
  { loc: "pune", place: "Pune", date: "31 Aug 2018", kicker: "Diploma panel", title: "Examiners’ practical exam, Pune", body: "Electrotherapy, body massage, and clinical client consultation.", foot: "Diploma jury", src: "/images/gallery/abtc/examiners-practical-exam-31-08-18pune-5-2.jpg" },
  { loc: "mumbai", place: "Mumbai", date: "20 Aug 2018", kicker: "Written exam", title: "Written examination, Mumbai", body: "Anatomy, cosmetic chemistry, physiology, and health codes under proctoring.", foot: "Written exam", src: "/images/gallery/abtc/examiners-written-exam-20-08-18-mumbai-1-4.jpg" },
  { loc: "mumbai", place: "Mumbai", date: "1 Jan 2018", kicker: "Centre assessment", title: "ABTC exam at Mena Kantawala Institute, Mumbai", body: "New Year cohort on cosmetic therapeutics and salon management.", foot: "Centre exam", src: "/images/gallery/abtc/1st-january-2018-abtc-exam-mena-kantawala-institute-mumbai-1st-january-2018-abtc-exam.jpg" },
  { loc: "nashik", place: "Nashik", date: "30 Jan 2017", kicker: "Regional exam", title: "ABTC exam, Nashik", body: "Diploma examinations for northern Maharashtra under CIDESCO guidelines.", foot: "Regional convocation", src: "/images/gallery/abtc/30th-january-2017-abtc-exam-nashik-01-8.jpg" },
  { loc: "pune", place: "Pune", date: "16 Dec 2016", kicker: "Winter session", title: "ABTC exam, Pune", body: "Winter practicals on diagnostics, face-lifting equipment, and facial treatments.", foot: "Winter series", src: "/images/gallery/abtc/16th-december-2016-abtc-exam-pune-001-2.jpg" },
  { loc: "pune", place: "Pune", date: "22 Apr 2016", kicker: "Spring cohort", title: "ABTC exam, Pune", body: "Spring graduation and theory series for newly certified therapists.", foot: "Certified batch", src: "/images/gallery/abtc/22nd-april-2016-abtc-exam-june-03-7.jpg" },
  { loc: "solapur", place: "Solapur", date: "1 Oct 2015", kicker: "Regional centre", title: "ABTC exam, Solapur", body: "Standardised testing extended to Solapur centres.", foot: "Solapur centre", src: "/images/gallery/abtc/1st-october-2015-abtc-exam-solapur-01-9.jpg" },
  { loc: "pune", place: "Pune", date: "11 Aug 2015", kicker: "Seminar", title: "ABTC seminar, Pune", body: "Presentations on dermal histology, anti-ageing, and curriculum across academies.", foot: "Symposium", src: "/images/gallery/abtc/11th-august-2015-abtc-seminar-pune-006-1.jpg" },
  { loc: "pune", place: "Pune", date: "5 Aug 2015", kicker: "Mid-year exam", title: "ABTC exam, Pune", body: "Diploma assessment with peer evaluation by national examiners.", foot: "Mid-year cohort", src: "/images/gallery/abtc/5th-august-2015-abtc-exam-pune-01-10.jpg" },
  { loc: "pune", place: "Pune", date: "17 May 2015", kicker: "Clinical evaluation", title: "ABTC exam, Pune", body: "Skin analysis, diagnostic records, microdermabrasion, and aftercare.", foot: "May session", src: "/images/gallery/abtc/17th-may-2015-abtc-exam-pune-01-14.jpg" },
  { loc: "pune", place: "National", date: "20 Jan 2014", kicker: "Masterclass", title: "ABTC seminar", body: "Skin-peel safety, facial electrical contraindications, and sanitisation.", foot: "Technical series", src: "/images/gallery/abtc/20th-january-2014-abtc-seminar-11-1.jpg" },
  { loc: "archive", place: "Pune", date: "Nov 2013", kicker: "Archive", title: "Association of Beauty Therapy exams, November 2013", body: "A national batch completed CIDESCO competency milestones.", foot: "National batch", src: "/images/gallery/abtc/association-of-beauty-thearpy-exams-002-3.jpg" },
  { loc: "archive", place: "CIDESCO 2013", date: "Sept 2013", kicker: "Milestone conclave", title: "CIDESCO Section India exam, Pune, September 2013", body: "National sitting with international delegates confirming standard alignment.", foot: "CIDESCO Section India", src: "/images/gallery/cidesco/association-of-beauty-therapy-cosmetology-cidesco-section-india-exam-sept-2013-pune-04-1.jpg" },
  { loc: "archive", place: "Heritage", date: "1990–2000", kicker: "Foundational decades", title: "The ABTC activities: 1990 – 2000", body: "The founding board’s work to introduce formal scientific aesthetic qualifications in India.", foot: "Foundational era", src: "/images/gallery/abtc/the-abtc-activities-1990-2000-20-1.jpg" },
];

const FILTERS = [
  ["all", "All events"],
  ["pune", "Pune"],
  ["mumbai", "Mumbai"],
  ["nashik", "Nashik"],
  ["kakinada", "Kakinada"],
  ["solapur", "Solapur"],
  ["archive", "1990–2013"],
] as const;

export function GalleryPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number][0]>("all");
  const list = useMemo(() => EVENTS.filter((e) => filter === "all" || e.loc === filter), [filter]);

  return (
    <div className="space-y-16 md:space-y-24">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={`${light} text-center`}>
          <Badge>Institutional archives & conclaves</Badge>
          <SplitHeading as="h1" type="words" className="mt-4 font-display text-4xl font-bold text-royal-navy sm:text-5xl">
            ABTC Events & Academic Convocations
          </SplitHeading>
          <SplitCopy className="mx-auto mt-3 max-w-2xl text-text-subtle">
            <p>National milestones, board meetings, CIDESCO examinations, and seminars at accredited institutes.</p>
          </SplitCopy>
          <RiseGrid className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[["1990+", "Legacy"], ["100%", "CIDESCO verified"], ["19+", "Regional hubs"], ["FI1552", "National registry"]].map(([n, l]) => (
              <TiltCard key={l} max={4} spotlight={false} className="rounded-xl border border-ice-blue bg-white p-3">
                <p className="font-display text-2xl font-bold text-royal-navy">{n}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-text-subtle">{l}</p>
              </TiltCard>
            ))}
          </RiseGrid>
        </PanelShell>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={cn("rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider", filter === id ? "bg-royal-navy text-white" : "border border-ice-blue bg-white text-text-subtle")}
              >
                {id === "all" ? `${label} (${EVENTS.length})` : label}
              </button>
            ))}
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-subtle">Showing {list.length}</p>
        </div>
        <RiseGrid key={filter} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((e) => (
            <TiltCard key={e.title + e.date} max={4} spotlight={false} className="flex h-full flex-col overflow-hidden rounded-2xl border border-white bg-white shadow-glass">
              <div className="relative h-56 overflow-hidden">
                <ParallaxImage alt={e.title} src={e.src} className="h-56 w-full" />
                <div className="absolute left-3 top-3 z-10 flex gap-1.5">
                  <span className="rounded bg-royal-navy px-2 py-1 text-[10px] font-bold uppercase text-white">{e.place}</span>
                  <span className="rounded bg-white/90 px-2 py-1 text-[10px] font-bold text-electric-blue">{e.date}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-electric-blue">
                  <Icon name="event" className="text-sm" /> {e.kicker}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold leading-snug text-royal-navy">{e.title}</h3>
                <p className="mt-2 text-sm text-text-subtle">{e.body}</p>
                <p className="mt-4 border-t border-ice-blue pt-3 text-xs font-bold text-royal-navy">{e.foot}</p>
              </div>
            </TiltCard>
          ))}
        </RiseGrid>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={dark}>
          <Badge dark>Reg. No. FI1552</Badge>
          <SplitHeading type="words" className="mt-3 font-display text-3xl font-bold">Need a past certificate checked?</SplitHeading>
          <SplitCopy className="mt-2 max-w-2xl text-white/75"><p>The secretariat keeps examination records from 1990 through the current year.</p></SplitCopy>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Magnetic strength={0.2}><Button href="/contact" variant="white">Verify credentials</Button></Magnetic>
            <Magnetic strength={0.2}><Button href="mailto:abtcindia@gmail.com" variant="ghost-dark">Contact secretariat</Button></Magnetic>
          </div>
        </PanelShell>
      </section>
    </div>
  );
}
