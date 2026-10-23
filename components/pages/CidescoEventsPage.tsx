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

type Event = { cat: string; badge: string; place: string; date: string; kicker: string; title: string; body: string; foot: string; src: string };

const EVENTS: Event[] = [
  { cat: "world", badge: "66th Congress", place: "Stockholm", date: "6–9 Sep 2018", kicker: "International assembly", title: "66th CIDESCO World Congress, Stockholm", body: "The Indian delegation at the congress on education standards and aesthetic syllabus.", foot: "Stockholm, Sweden", src: "/images/brand/cidesco-international-logo.png" },
  { cat: "world", badge: "65th Congress", place: "Mumbai", date: "18–19 Sep 2017", kicker: "World congress", title: "65th CIDESCO World Congress, Mumbai", body: "ABTC hosted worldwide delegates at Hall 2A, Mumbai.", foot: "Hall 2A, Mumbai", src: "/images/gallery/cidesco/65th-cidesco-world-congress-september-2017-mumbai-01.jpg" },
  { cat: "world", badge: "Cultural gala", place: "Bandra", date: "16 Sep 2017", kicker: "Cultural night", title: "Congress 2017 cultural evening, Hotel Rangsharda", body: "Delegates were hosted for cultural fellowship and executive networking in Bandra.", foot: "Rangsharda, Bandra", src: "/images/gallery/cidesco/cidesco-congress-2017-india-16th-september-cultural-evening-hotel-rangsharda-bandra-mumbai-01.jpg" },
  { cat: "examiners", badge: "Schools", place: "Taj Lands End", date: "16 Sep 2017", kicker: "School council", title: "CIDESCO international schools meeting", body: "Syllabus criteria across accredited academies and Zurich guidelines.", foot: "Taj Lands End", src: "/images/gallery/cidesco/cidesco-congress-2017-india-16th-september-cidesco-international-schools-meeting-taj-lands-end-bandra-004-1.jpg" },
  { cat: "examiners", badge: "Examiners", place: "Bandra", date: "15 Sep 2017", kicker: "Examiner calibration", title: "CIDESCO examiners’ meet, Taj Lands End", body: "Grading protocols, practical metrics, and clinical hygiene audits.", foot: "Examiner council", src: "/images/gallery/cidesco/cidesco-congress-2017-india-15th-september-cidesco-examiners-meet-taj-lands-end-bandra-01.jpg" },
  { cat: "world", badge: "China", place: "Wuhan", date: "2013", kicker: "Diplomacy", title: "CIDESCO World Congress, Wuhan", body: "ABTC India represented holistic aesthetics and botanical dermato-cosmetology.", foot: "Wuhan, China", src: "/images/gallery/cidesco/wuhan-2013-the-cidesco-world-congress-china-01.jpg" },
  { cat: "examiners", badge: "Diploma", place: "Pune", date: "Sep 2013", kicker: "Convocation", title: "CIDESCO Section India exam, Pune", body: "Practical and theory evaluation under Zurich standards.", foot: "Pune division", src: "/images/gallery/cidesco/association-of-beauty-therapy-cosmetology-cidesco-section-india-exam-sept-2013-pune-04-1.jpg" },
  { cat: "national", badge: "Conference", place: "India", date: "2013", kicker: "Industry partnership", title: "CIDESCO National Division Conference, India 2013", body: "Keynote with industry partners aligning research and clinical practice.", foot: "Symposium", src: "/images/gallery/cidesco/cidesco-national-division-conference-india-2013-01.jpg" },
  { cat: "national", badge: "Charter", place: "Mumbai", date: "2011", kicker: "Foundation", title: "Formation of the national CIDESCO division, Mumbai", body: "The Indian Section was formally established under charter FI1552.", foot: "Charter 2011", src: "/images/gallery/cidesco/formation-of-national-cidesco-division-mumbai-2011-04-3.jpg" },
  { cat: "examiners", badge: "Exams", place: "National", date: "Session", kicker: "Clinical audits", title: "The CIDESCO exams delegation", body: "Practical assessments with visiting international invigilators.", foot: "FI1552 exam", src: "/images/gallery/cidesco/the-cidesco-exams-06-1.jpg" },
  { cat: "history", badge: "Tribute", place: "Archive", date: "Section", kicker: "Heritage", title: "India as a CIDESCO section", body: "Decades of work to place Indian vocational credentials on a global footing.", foot: "ABTC India", src: "/images/gallery/cidesco/india-as-a-cidesco-section-04-5.jpg" },
  { cat: "history", badge: "1985–1995", place: "Chronicle", date: "A decade", kicker: "Annals", title: "The history of CIDESCO: 1985 – 1995", body: "The decade when international standards were set into the modern diploma framework.", foot: "Charter heritage", src: "/images/gallery/cidesco/the-history-of-cidesco-from-1985-1995-01-7.jpg" },
];

const FILTERS = [
  ["all", "All events"],
  ["world", "World congresses"],
  ["national", "National division"],
  ["examiners", "Examiners & schools"],
  ["history", "Historical archive"],
] as const;

export function CidescoEventsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number][0]>("all");
  const list = useMemo(() => EVENTS.filter((e) => filter === "all" || e.cat === filter), [filter]);

  return (
    <div className="space-y-16 md:space-y-24">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={`${light} text-center`}>
          <Badge>World congress & diplomacy</Badge>
          <SplitHeading as="h1" type="words" className="mt-4 font-display text-4xl font-bold text-royal-navy sm:text-5xl">
            CIDESCO Events
          </SplitHeading>
          <SplitCopy className="mx-auto mt-3 max-w-3xl text-text-subtle">
            <p>International congresses, delegations, examination summits, and milestones of the Indian Section of CIDESCO.</p>
          </SplitCopy>
          <RiseGrid className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[["66+", "World congresses"], ["1985", "Foundation era"], ["FI1552", "Section number"], ["Global", "Diplomatic status"]].map(([n, l]) => (
              <TiltCard key={l} max={4} spotlight={false} className="rounded-xl border border-ice-blue bg-white p-3">
                <p className="font-display text-2xl font-bold text-royal-navy">{n}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-text-subtle">{l}</p>
              </TiltCard>
            ))}
          </RiseGrid>
        </PanelShell>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex flex-wrap gap-2">
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
        <RiseGrid key={filter} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((e) => (
            <TiltCard key={e.title} max={4} spotlight={false} className="flex h-full flex-col overflow-hidden rounded-2xl border border-white bg-white shadow-glass">
              <div className="relative aspect-[4/3] overflow-hidden">
                <ParallaxImage alt={e.title} src={e.src} className="aspect-[4/3] w-full" />
                <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
                  <span className="rounded bg-white px-2 py-1 text-[10px] font-bold uppercase text-royal-navy">{e.badge}</span>
                  <span className="rounded bg-electric-blue px-2 py-1 text-[10px] font-bold uppercase text-white">{e.place}</span>
                </div>
                <span className="absolute bottom-3 left-3 z-10 text-[11px] font-semibold text-white">{e.date}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-electric-blue">{e.kicker}</p>
                <h3 className="mt-1 font-display text-lg font-bold leading-snug text-royal-navy">{e.title}</h3>
                <p className="mt-2 text-sm text-text-subtle">{e.body}</p>
                <p className="mt-4 flex items-center gap-1 border-t border-ice-blue pt-3 text-xs font-bold text-royal-navy">
                  <Icon name="pin_drop" className="text-sm text-electric-blue" /> {e.foot}
                </p>
              </div>
            </TiltCard>
          ))}
        </RiseGrid>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={light}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-electric-blue">Chronicle</p>
          <SplitHeading type="words" className="mt-2 font-display text-3xl font-bold text-royal-navy">Four decades of global standard stewardship</SplitHeading>
          <SplitCopy className="mt-3 max-w-3xl text-sm text-text-subtle">
            <p>ABTC is the link between Indian academies and CIDESCO International in Zurich, through congresses, delegations, and examiner training.</p>
          </SplitCopy>
        </PanelShell>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={dark}>
          <SplitHeading type="words" className="font-display text-2xl font-bold sm:text-3xl">Verify event credentials or school accreditation</SplitHeading>
          <p className="mt-2 text-sm text-white/75">Registry for examination centres, past diplomas, and school affiliations in India.</p>
          <div className="mt-6">
            <Magnetic strength={0.2}><Button href="/accreditations" variant="white">Schools & charter</Button></Magnetic>
          </div>
        </PanelShell>
      </section>
    </div>
  );
}
