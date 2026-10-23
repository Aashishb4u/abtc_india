"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/motion/Magnetic";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { PanelShell } from "@/components/motion/PanelShell";
import { RiseGrid } from "@/components/motion/RiseGrid";
import { SplitCopy } from "@/components/motion/SplitCopy";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { TiltCard } from "@/components/motion/TiltCard";

const light = "rounded-3xl border border-white/80 bg-white/70 p-6 shadow-glass backdrop-blur-xl sm:p-10 md:p-14";
const dark = "rounded-3xl border border-white/10 bg-gradient-to-br from-midnight via-royal-navy to-royal-purple p-6 text-white shadow-glass-dark sm:p-10 md:p-14";

const BOARD = [
  ["President", "Smita Deo", "ABTC Executive Council", "badge", "/images/committee/committee-whatsapp-image-2026-06-07-at-12-44-56-pm-rolihc87n8cvvbs4u6or1bhw2htmd6j6t45sud0fc0.jpeg"],
  ["Chairperson", "Anjali Joshi", "Governing Chair", "gavel", "/images/committee/committee-whatsapp-image-2026-06-07-at-12-44-55-pm-rolihc87n8cvvbs4u6or1bhw2htmd6j6t45sud0fc0.jpeg"],
  ["Secretary", "Vandana Jagtap", "National Secretariat", "assignment", "/images/committee/committee-whatsapp-3image-2026-06-07-at-12-44-57-pm-rolihacj9kab83uv55vhwbyyvq2vxsbq4uutvt37og.jpeg"],
  ["Treasurer", "Namrata Goud", "Financial Administration", "account_balance_wallet", "/images/committee/committee-whatsapp-image-2026-06-07-at-12-44-57-pm-rolihacj9kab83uv55vhwbyyvq2vxsbq4uutvt37og.jpeg"],
  ["Education", "Deepaa Bhagwat", "Education incharge & school co-ordinator", "menu_book", "/images/committee/committee-whatsapp-image-2026-06-07-at-12-44-58-pm-rolih8guvw7qkvxlg528rcg1oyc5ie49gljux9600w.jpeg"],
  ["Education", "Bina Chetty", "Education incharge & school co-ordinator", "school", "/images/committee/committee-whatsapp1-image-2026-06-07-at-12-44-58-pm-rolih7j0p26g99yylmnm6uol3kgsap0j4gwdfz7e74.jpeg"],
  ["Programs", "Rashmi Tapkir", "Program in charge", "event_seat", "/images/committee/committee-whatsapp-image-2026-06-07-at-12-44-59-pm-rolih6l6i855xo0br48zmcx4i6lf2zwssc8vyp8sdc.jpeg"],
  ["Programs", "Geeta Pardeshi", "Program in charge", "campaign", "/images/committee/committee-file-00000000b0c87209a92408bf5a0fe391-rollqabby6g6crwqy8iqrb3grben1hsxvy5lcpm36o.png"],
] as const;

const SUB = [
  ["Madhuri Bhandare", "Practical syllabus review board", "/images/committee/committee-whatsapp-image-2026-06-07-at-12-45-00-pm-rolih3rnxq1ayu4f7l13wvmqq0zbfwllryafivcyw0.jpeg"],
  ["Rakhee Rathod", "Curriculum & student evaluation", "/images/committee/committee-whatsapp2-image-2026-06-07-at-12-44-59-pm-rolih4pi4k2lag3223fqhde7beuonlpc42xx05bkps.jpeg"],
] as const;

export function CommitteePage() {
  return (
    <div className="space-y-16 md:space-y-24">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={`${light} text-center`}>
          <Badge>Executive leadership & governance</Badge>
          <SplitHeading as="h1" type="words" className="mt-4 font-display text-4xl font-bold text-royal-navy sm:text-5xl">
            Committee
          </SplitHeading>
          <SplitCopy className="mx-auto mt-3 max-w-2xl text-lg font-medium text-text-subtle">
            <p>Association of Beauty Therapy & Cosmetology (India)</p>
          </SplitCopy>
          <SplitCopy className="mt-1 text-sm tracking-wide text-text-subtle">
            <p>Indian Section of CIDESCO International · Reg. No. FI1552</p>
          </SplitCopy>
        </PanelShell>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={light}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-electric-blue">Founder member & trustee</p>
          <div className="mt-8 grid items-center gap-8 lg:grid-cols-12">
            <TiltCard max={4} spotlight={false} className="overflow-hidden rounded-2xl border border-white bg-white p-2 shadow-glass lg:col-span-4">
              <ParallaxImage
                alt="Late Maya Paranjapye"
                src="/images/about/maya-paranjapye-founder-portrait.jpg"
                className="aspect-[4/5] w-full rounded-xl"
                position="object-top"
              />
              <p className="py-3 text-center text-[11px] font-bold tracking-widest text-electric-blue">Legacy trustee</p>
            </TiltCard>
            <div className="space-y-4 lg:col-span-8">
              <p className="text-xs font-bold uppercase tracking-widest text-electric-blue">In revered remembrance</p>
              <SplitHeading type="words" className="font-display text-3xl font-bold text-royal-navy sm:text-4xl">
                Late Maya Paranjapye
              </SplitHeading>
              <SplitCopy className="text-base leading-relaxed text-text-subtle">
                <p>
                  Pioneering doyen of scientific beauty therapy in India, whose commitment brought CIDESCO Zurich education to the subcontinent. Founder trustee who helped turn cosmetology into an accredited clinical discipline.
                </p>
              </SplitCopy>
              <RiseGrid className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Institutional roots", "Founded the ABTC national body", "account_balance"],
                  ["CIDESCO section", "India affiliation FI1552", "verified_user"],
                  ["National benchmark", "Curriculum and diplomas", "military_tech"],
                ].map(([t, b, icon]) => (
                  <div key={t} className="rounded-xl border border-ice-blue bg-white p-4">
                    <Icon name={icon} className="text-electric-blue" />
                    <p className="mt-2 text-sm font-bold text-royal-navy">{t}</p>
                    <p className="text-xs text-text-subtle">{b}</p>
                  </div>
                ))}
              </RiseGrid>
            </div>
          </div>
        </PanelShell>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={light}>
          <div className="mb-8 flex flex-col justify-between gap-3 border-b border-ice-blue pb-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-electric-blue">Executive board</p>
              <SplitHeading type="words" className="font-display text-2xl font-bold text-royal-navy sm:text-3xl">
                Managing Committee Members 2026 – 2029
              </SplitHeading>
            </div>
            <span className="w-fit rounded-lg bg-ice-blue px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-royal-navy">Elected term</span>
          </div>
          <RiseGrid className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BOARD.map(([role, name, note, icon, src]) => (
              <TiltCard key={name} max={5} spotlight={false} className="overflow-hidden rounded-2xl border border-white bg-white p-4 shadow-glass">
                <div className="relative overflow-hidden rounded-xl">
                  <span className="absolute left-2 top-2 z-10 rounded bg-royal-navy px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">{role}</span>
                  <img alt={name} src={src} className="aspect-[4/5] w-full object-cover transition duration-500 hover:scale-[1.03]" />
                </div>
                <h3 className="mt-3 font-display text-lg font-bold text-royal-navy">{name}</h3>
                <p className="text-xs font-bold uppercase tracking-wider text-electric-blue">{role}</p>
                <p className="mt-3 flex items-center justify-between border-t border-ice-blue pt-2 text-xs text-text-subtle">
                  {note}
                  <Icon name={icon} className="text-base" />
                </p>
              </TiltCard>
            ))}
          </RiseGrid>
        </PanelShell>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={light}>
          <SplitHeading type="words" className="font-display text-2xl font-bold text-royal-navy sm:text-3xl">
            Sub Committee for the Year 2026–2029
          </SplitHeading>
          <RiseGrid className="mx-auto mt-8 grid max-w-4xl gap-5 md:grid-cols-2">
            {SUB.map(([name, role, src]) => (
              <TiltCard key={name} max={4} spotlight={false} className="flex flex-col items-center gap-5 rounded-2xl border border-white bg-white p-5 shadow-glass sm:flex-row">
                <img alt={name} src={src} className="aspect-[4/5] w-40 rounded-xl object-cover" />
                <div className="text-center sm:text-left">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-electric-blue">Sub committee</span>
                  <h3 className="font-display text-xl font-bold text-royal-navy">{name}</h3>
                  <p className="mt-1 text-sm text-text-subtle">Member · 2026–2029</p>
                  <p className="mt-3 text-sm text-text-subtle">{role}</p>
                </div>
              </TiltCard>
            ))}
          </RiseGrid>
        </PanelShell>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={dark}>
          <Badge dark>Official secretariat</Badge>
          <SplitHeading type="words" className="mt-3 font-display text-2xl font-bold sm:text-3xl">
            Official Committee Inquiries & School Affiliations
          </SplitHeading>
          <p className="mt-3 max-w-2xl text-white/75">
            Institutions seeking ABTC syllabus recognition, or candidates applying for CIDESCO examinations, route submissions through the verified committee officers.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Magnetic strength={0.2}>
              <Button href="mailto:abtcindia@gmail.com" variant="white" iconLeft="mail">Contact secretariat</Button>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Button href="/contact" variant="ghost-dark" iconLeft="how_to_reg">Verify credentials</Button>
            </Magnetic>
          </div>
        </PanelShell>
      </section>
    </div>
  );
}
