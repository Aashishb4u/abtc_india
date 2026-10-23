"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/motion/Magnetic";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { PanelShell } from "@/components/motion/PanelShell";
import { RiseGrid } from "@/components/motion/RiseGrid";
import { SplitCopy } from "@/components/motion/SplitCopy";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { TiltCard } from "@/components/motion/TiltCard";

const light = "rounded-3xl border border-white/80 bg-white/70 p-6 shadow-glass backdrop-blur-xl sm:p-10 md:p-14";
const dark = "rounded-3xl border border-white/10 bg-gradient-to-br from-midnight via-royal-navy to-royal-purple p-6 text-white shadow-glass-dark sm:p-10 md:p-14";

const STATS = [
  { icon: "public", value: "40+", label: "Countries" },
  { icon: "military_tech", value: "1946", label: "Zurich Origin", accent: true },
  { icon: "workspace_premium", value: "8", label: "Diplomas" },
];

const NARRATIVE = [
  {
    n: "01",
    text: "CIDESCO has long been regarded as the leading international qualification in beauty therapy. Founded in 1946 with its head office in Zurich, Switzerland, CIDESCO International is represented in over 40 countries.",
    foot: "Zurich headquarters · 40+ nations",
    icon: "location_on",
  },
  {
    n: "02",
    text: "This world-renowned qualification is the pinnacle of professionalism, opening doors to many prestigious career opportunities all over the world as employers and clients recognize the value and skills that this achievement represents.",
    foot: "Unrestricted global mobility",
    icon: "public",
  },
];

const HALLMARKS = [
  { icon: "account_balance", kicker: "Foundational base", title: "Zurich, Switzerland", body: "Established in 1946 in Zurich, housing the International Secretariat overseeing curriculum compliance across all sections." },
  { icon: "public", kicker: "Global reach", title: "40+ member nations", body: "Represented across five continents, harmonizing aesthetic education through identical international practical testing protocols." },
  { icon: "menu_book", kicker: "Academic rigor", title: "SCQF framework", body: "Formally recognized under the Scottish Qualification framework, validating its scientific and academic prestige." },
  { icon: "flight_takeoff", kicker: "Global careers", title: "Worldwide mobility", body: "Preferred by luxury hotel chains, destination medical spas, and cruise operators." },
];

const DIPLOMAS = [
  ["01", "Core standard", "Beauty Therapy Diploma", "Full facial treatments, body analysis, electrical aesthetic devices, and manicure and pedicure care.", "Full curriculum"],
  ["02", "Post graduate", "Post Graduate Beauty Therapy Diploma", "Available to qualified therapists with a minimum of three years' professional experience.", "Experience validated"],
  ["03", "Post graduate", "Post Graduate Spa Diploma", "Accreditation for experienced spa therapists advancing into holistic wellness and resort protocol.", "Spa resort protocol"],
  ["04", "Wellness arts", "Spa Therapy Diploma", "Wet treatments, hydrotherapy, balneotherapy, wraps, body scrubs, and relaxation arts.", "Hydro & balneotherapy"],
  ["05", "Executive", "Beauty & Spa Management Diploma", "Operations, finance, hygiene, marketing, team leadership, and spa administration.", "Operations & finance"],
  ["06", "Post graduate", "Post Graduate Aromatherapy Diploma", "Essential oils, therapeutic blending, customized application, and body rituals.", "Olfactory chemistry"],
  ["07", "Post graduate", "Post Graduate Electrical Epilation Diploma", "Thermolysis, galvanic, and blend techniques for permanent hair removal.", "Advanced electrolysis"],
  ["08", "Creative arts", "Media Make-up Diploma", "Photography, television, cinema, runway, and character transformations.", "HD cinema & runway"],
] as const;

const CERTS = [
  { icon: "sanitizer", k: "Certificate 01", title: "Certificate of Skincare", body: "Skin consultation, dermatological understanding, customized facial treatments, and active ingredients.", tag: "Dermatological focus" },
  { icon: "face", k: "Certificate 02", title: "Certificate in Aesthetics", body: "Aesthetic facial techniques, colour theory, eyebrow design, temporary epilation, and client presentation.", tag: "Aesthetic procedures" },
  { icon: "accessibility_new", k: "Certificate 03", title: "Certificate in Body Therapy", body: "Body anatomy, classical massage sequences, figure diagnosis, and electrotherapy contouring.", tag: "Electrotherapy & contouring" },
];

const card = "h-full rounded-2xl border border-white/80 bg-white/80 p-6 shadow-glass";

export function CidescoPage() {
  return (
    <div className="space-y-16 md:space-y-24">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={light}>
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-electric-blue/15 blur-3xl" />
        <div className="relative grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="space-y-6 lg:col-span-7">
            <Reveal>
              <Badge>Swiss accreditation · Founded 1946</Badge>
            </Reveal>
            <SplitHeading as="h1" type="words" className="font-display text-3xl font-bold leading-tight tracking-tight text-royal-navy sm:text-4xl md:text-5xl">
              The Pinnacle of International Beauty Therapy
            </SplitHeading>
            <Reveal>
              <blockquote className="rounded-r-2xl border border-white/80 border-l-4 border-l-electric-blue bg-white/90 p-6 font-display text-base italic leading-relaxed text-royal-navy shadow-glass sm:text-lg">
                Comité International d&apos;Esthétique et de Cosmétologie — defining the global gold standard for beauty and spa therapy education since 1946.
              </blockquote>
            </Reveal>
            <RiseGrid className="grid grid-cols-3 gap-3 pt-1">
              {STATS.map((s) => (
                <TiltCard key={s.label} max={4} scale={1.02} spotlight={false} className="rounded-xl border border-white bg-white/80 p-4 text-center shadow-glass">
                  <Icon name={s.icon} className="mx-auto text-electric-blue" />
                  <span className={`mt-1 block font-display text-2xl font-bold sm:text-3xl ${s.accent ? "text-electric-blue" : "text-royal-navy"}`}>{s.value}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">{s.label}</span>
                </TiltCard>
              ))}
            </RiseGrid>
          </div>
          <div className="lg:col-span-5">
            <TiltCard max={5} spotlight={false} className="rounded-2xl border-2 border-white bg-white p-2 shadow-glass">
              <ParallaxImage
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeIGFAkQHCYQUOWRchI7UyHj5oiMK47cEtw3mWnJZbigK-WvJe2c9tEcQTh_Bfqs8FkF5LUv1LT2T4rzXAfN5xKcgiDwj2dqFjpsp95NPwVyj5mnFnJRdD9bCjrrA8tXkncn9W56HiLDO9_wKrrkzBO8uclI5Eo4sWFTr6JHVBqiXIyeeVTLvtIu50CSWz7czXhsoF8VjrDZ1pM-qEg9p4z46JgMDVMhk4QM521IFYY_qNvYFX-eWtag"
                alt="Clinical aesthetic treatment room reflecting Swiss-standard cosmetology education"
                className="aspect-[4/5] h-auto"
              />
              <div className="pointer-events-none absolute inset-x-2 bottom-2 rounded-b-xl bg-gradient-to-t from-midnight/80 to-transparent p-5 text-white">
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary-fixed">Clinical excellence</p>
                <p className="mt-1 text-sm">Practical assessments under CIDESCO International examiners.</p>
              </div>
            </TiltCard>
          </div>
        </div>
        </PanelShell>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={`${light} space-y-10`}>
          <div className="max-w-3xl">
            <Badge>Institutional heritage</Badge>
            <SplitHeading type="words" className="mt-3 font-display text-2xl font-bold tracking-tight text-royal-navy sm:text-3xl md:text-4xl">
              An International Authority in Cosmetology & Aesthetic Sciences
            </SplitHeading>
          </div>
          <RiseGrid className="grid gap-6 md:grid-cols-2">
            {NARRATIVE.map((item) => (
              <TiltCard key={item.n} max={3} scale={1.01} spotlight={false} className={`${card} flex flex-col justify-between bg-gradient-to-br from-white to-ice-blue/60`}>
                <div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-royal-navy font-display text-lg text-white">{item.n}</span>
                  <SplitCopy className="pt-4 text-base leading-relaxed text-accent-navy sm:text-lg">
                    <p>{item.text}</p>
                  </SplitCopy>
                </div>
                <p className="mt-6 flex items-center gap-2 border-t border-ice-blue pt-4 text-[11px] font-bold uppercase tracking-wider text-electric-blue">
                  <Icon name={item.icon} className="text-base" />
                  {item.foot}
                </p>
              </TiltCard>
            ))}
          </RiseGrid>
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-midnight via-royal-navy to-midnight p-8 text-white shadow-glass-dark md:p-12">
              <Badge dark>Standard of excellence</Badge>
              <SplitCopy className="mt-4 max-w-4xl text-base leading-relaxed text-white/90 sm:text-lg">
                <p>
                  Studying at a CIDESCO International School ensures the highest standards of education and assessment. Many major Indian and international employers insist on the CIDESCO Diploma for therapists in their business. The CIDESCO Diploma and certificate courses are the world&apos;s most prestigious qualification in beauty therapy, covering Beauty Therapy, Aromatherapy, Spa Therapy, Epilation, Beauty and Spa Management, and Media Make-up.
                </p>
              </SplitCopy>
            </div>
          </Reveal>
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-electric-blue/30 bg-gradient-to-r from-ice-blue via-white to-ice-blue p-6 sm:flex-row sm:items-center md:p-8">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-electric-blue shadow-sm">
                  <Icon name="verified" filled />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-electric-blue">Official qualification milestone</p>
                  <p className="mt-1 font-display text-base font-bold text-royal-navy sm:text-lg">
                    In March it was announced that the CIDESCO beauty therapy diploma is now recognized on the Scottish Qualification framework.
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-royal-navy px-4 py-2.5 text-xs font-bold text-white">
                <Icon name="account_balance" className="text-sm" />
                Framework validated
              </span>
            </div>
          </Reveal>
        </PanelShell>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={light}>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <Badge>Benchmarks of excellence</Badge>
          <SplitHeading type="words" className="mt-3 font-display text-2xl font-bold text-royal-navy sm:text-3xl">
            CIDESCO Institutional Hallmarks
          </SplitHeading>
          <p className="mt-2 text-sm text-text-subtle sm:text-base">Core pillars that establish CIDESCO as a global aesthetic authority.</p>
        </div>
        <RiseGrid className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {HALLMARKS.map((h) => (
            <TiltCard key={h.title} max={5} spotlight={false} className={`${card} group`}>
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-ice-blue text-electric-blue transition-transform duration-300 group-hover:scale-110">
                <Icon name={h.icon} className="text-2xl" />
              </span>
              <p className="text-[11px] font-bold uppercase tracking-wider text-electric-blue">{h.kicker}</p>
              <h3 className="mt-1 font-display text-lg font-bold text-royal-navy">{h.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-subtle">{h.body}</p>
            </TiltCard>
          ))}
        </RiseGrid>
        </PanelShell>
      </section>

      <section id="diplomas" className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={light}>
          <div className="mb-10 flex flex-col justify-between gap-4 border-b border-ice-blue pb-6 md:flex-row md:items-end">
            <div>
              <Badge>Globally recognized curriculum</Badge>
              <SplitHeading type="words" className="mt-3 font-display text-2xl font-bold text-royal-navy sm:text-4xl">
                CIDESCO Diplomas Include
              </SplitHeading>
            </div>
            <span className="inline-flex items-center gap-2 rounded-lg border border-electric-blue/30 bg-ice-blue px-4 py-2 text-xs font-bold uppercase tracking-wider text-royal-navy">
              <Icon name="award_star" className="text-base text-electric-blue" />
              8 international specializations
            </span>
          </div>
          <RiseGrid className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {DIPLOMAS.map(([n, tag, title, body, foot]) => (
              <TiltCard key={n} max={4} spotlight={false} className={`${card} flex flex-col justify-between bg-gradient-to-b from-white to-ice-blue/50`}>
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-display text-2xl font-bold text-electric-blue">{n}</span>
                    <span className="rounded-full border border-ice-blue bg-white px-2.5 py-1 text-[10px] font-bold uppercase text-royal-navy">{tag}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold leading-snug text-royal-navy">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-subtle">{body}</p>
                </div>
                <p className="mt-6 flex items-center justify-between border-t border-ice-blue pt-3 text-xs font-bold text-electric-blue">
                  {foot}
                  <Icon name="arrow_forward" className="text-sm" />
                </p>
            </TiltCard>
          ))}
          </RiseGrid>
        </PanelShell>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={light}>
        <div className="mb-10 max-w-2xl">
          <Badge>Targeted modular certifications</Badge>
          <SplitHeading type="words" className="mt-3 font-display text-2xl font-bold text-royal-navy sm:text-4xl">
            CIDESCO Certificates Include
          </SplitHeading>
        </div>
        <RiseGrid className="grid gap-6 md:grid-cols-3">
          {CERTS.map((c) => (
            <TiltCard key={c.title} max={4} spotlight={false} className={`${card} relative overflow-hidden pt-8`}>
              <span className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-electric-blue to-royal-navy" />
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-ice-blue text-electric-blue">
                <Icon name={c.icon} className="text-2xl" />
              </span>
              <p className="text-[11px] font-bold uppercase tracking-wider text-electric-blue">{c.k}</p>
              <h3 className="mt-1 font-display text-xl font-bold text-royal-navy">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-subtle">{c.body}</p>
              <p className="mt-6 flex items-center justify-between border-t border-ice-blue pt-4 text-xs font-bold text-royal-navy">
                {c.tag}
                <Icon name="verified" filled className="text-electric-blue" />
              </p>
            </TiltCard>
          ))}
        </RiseGrid>
        </PanelShell>
      </section>

      <section id="verify" className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={dark}>
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-electric-blue/20 blur-3xl" />
          <div className="relative mx-auto max-w-3xl text-center">
            <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-electric-blue/40 bg-electric-blue/15 text-secondary-fixed">
              <Icon name="shield_person" filled className="text-3xl" />
            </span>
            <Badge dark>Accreditation bridgeway</Badge>
            <SplitHeading type="words" className="mt-4 font-display text-2xl font-bold sm:text-4xl">
              Pursue CIDESCO Certification with ABTC India
            </SplitHeading>
            <SplitCopy className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              <p>
                ABTC India serves as the national bridge connecting beauty schools, educators, and aspiring therapists with CIDESCO International standards, curricula, and official examinations.
              </p>
            </SplitCopy>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Magnetic strength={0.2}>
                <Button href="#diplomas" icon="east">Explore accreditations</Button>
              </Magnetic>
              <Magnetic strength={0.2}>
                <Button href="mailto:abtcindia@gmail.com" variant="ghost-dark" iconLeft="mail">Contact national secretariat</Button>
              </Magnetic>
            </div>
          </div>
        </PanelShell>
      </section>
    </div>
  );
}
