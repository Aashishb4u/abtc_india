"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { SplitCopy } from "@/components/motion/SplitCopy";
import { PanelShell } from "@/components/motion/PanelShell";
import { RiseGrid } from "@/components/motion/RiseGrid";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { TiltCard } from "@/components/motion/TiltCard";

const light = "rounded-3xl border border-white/80 bg-white/70 p-6 shadow-glass backdrop-blur-xl sm:p-10 md:p-14";
const dark = "rounded-3xl border border-white/10 bg-gradient-to-br from-midnight via-royal-navy to-royal-purple p-6 text-white shadow-glass-dark sm:p-10 md:p-14";

const FOUNDERS = [
  ["01", "Sushma Hora", "Executive founding trustee", "Nepeancy Road"],
  ["02", "Rechel Stevension", "Founding member & academician", "Peddar Road"],
  ["03", "Mariam Zaveri", "Founding member", "Bandra"],
  ["04", "Kiyoko Motoshiromizo", "Aesthetic pioneer & founder", "Breach Candy"],
  ["05", "Maya Paranjapye", "Founding trustee & examiner", "Santacruz"],
  ["06", "Zeb Rangoonwala", "Founding trustee", "Kemps Corner"],
  ["07", "Late. Sushila Waswani", "Founding member (in memoriam)", "Sion"],
  ["08", "Noor Porbanderwala", "Founding member", "Bandra"],
] as const;

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

const EXAMINERS = [
  ["MP", "Maya Paranjapye", "Founding trustee & veteran educator"],
  ["NM", "Neela Mhatre", "Cosmetology & clinical specialist"],
  ["SG", "Seema Gopujkar", "Curriculum board member"],
  ["JT", "Jyotsna Thopte", "International practical auditor"],
  ["PP", "Prajakta Paranjapye", "Dermatological aesthetic assessor"],
] as const;

const SCHOOLS: [string, string][] = [
  ["Seema's Institute of Beauty & Cosmetology", "Mumbai, Maharashtra"],
  ["LTA School of Beauty (Mumbai - Andheri & Thane)", "Mumbai / Thane, Maharashtra"],
  ["LTA School of Beauty (Pune)", "Pune, Maharashtra"],
  ["Blossom Kochhar College of Creative Arts & Design", "New Delhi, Delhi NCR"],
  ["Anoos Institute of Beauty", "Hyderabad, Telangana"],
  ["Enrich Salons & Academy", "Mumbai, Maharashtra"],
  ["Orane International Institute of Beauty & Wellness", "Chandigarh, Punjab"],
  ["Orane International Academy (Delhi Campus)", "New Delhi, Delhi NCR"],
  ["Orane International (Mumbai & Pune)", "Mumbai / Pune, Maharashtra"],
  ["Orane International Academy (Jaipur)", "Jaipur, Rajasthan"],
  ["ISAS International Beauty School (Pune Main)", "Pune, Maharashtra"],
  ["ISAS International Beauty School (Ahmedabad)", "Ahmedabad, Gujarat"],
  ["Blaze Beauty Academy", "Pune, Maharashtra"],
  ["Lees Beauty & Cosmetology Centre", "Pune, Maharashtra"],
  ["Sejal's International School of Beauty & Hair", "Pune, Maharashtra"],
  ["Meerra's International Institute of Aesthetic Arts", "Mumbai, Maharashtra"],
  ["VLCC Institute of Beauty & Nutrition", "New Delhi, Delhi NCR"],
  ["Cherag's Magical Makeovers & Academy", "Mumbai, Maharashtra"],
  ["CVPro International Academy", "Mumbai, Maharashtra"],
  ["IBHS Academy of Beauty & Wellness", "Visakhapatnam, Andhra Pradesh"],
  ["Impression Academy of Beauty Therapy", "Pune, Maharashtra"],
  ["Orchid Beauty Academy", "Pune, Maharashtra"],
  ["YLG Salon & Academy", "Bangalore, Karnataka"],
  ["Zeenat Merchant Academy of Aesthetics", "Mumbai, Maharashtra"],
  ["CWM Academy (Cosmetology & Wellness)", "Indore / Bhopal, Madhya Pradesh"],
  ["IBT International Beauty Training", "Nashik, Maharashtra"],
  ["Glam International Cosmetology School", "Palakkad, Kerala"],
  ["Glizz Gurukulam School of Aesthetics", "Rajkot, Gujarat"],
  ["Lakme Academy (CIDESCO Wing)", "Pune, Maharashtra"],
  ["Symbiosis School of Culinary Arts & Aesthetic Sciences", "Pune, Maharashtra"],
  ["UK International Beauty School", "Noida, Uttar Pradesh"],
  ["Nirupama Academy of Aesthetics", "Kolkata, West Bengal"],
  ["Aura International College of Hair & Cosmetology", "Nagpur, Maharashtra"],
  ["Pinnacle Institute of Aesthetic Sciences", "Chennai, Tamil Nadu"],
];

const MEMBERS: [string, string][] = [
  ["LTA Academy", "Mumbai & Pune"],
  ["Seema's Academy", "Mumbai, Maharashtra"],
  ["ISAS International Academy", "Pune & Ahmedabad"],
  ["Orane International", "Pan-India network"],
  ["Enrich Academy", "Mumbai, Maharashtra"],
  ["Anoos Academy", "Hyderabad, Telangana"],
  ["Blossom Kochhar Academy", "New Delhi, Delhi NCR"],
  ["VLCC Institute", "National branch network"],
  ["Sejal's Beauty Academy", "Pune, Maharashtra"],
  ["Meerra's International", "Mumbai, Maharashtra"],
  ["Impression Academy", "Pune, Maharashtra"],
  ["Orchid Academy", "Pune, Maharashtra"],
  ["YLG Institute", "Bangalore, Karnataka"],
  ["IBHS Academy", "Visakhapatnam, AP"],
  ["CWM Academy", "Indore & Bhopal"],
  ["IBT Beauty Training", "Nashik, Maharashtra"],
  ["Glam International", "Palakkad, Kerala"],
  ["Glizz Gurukulam", "Rajkot, Gujarat"],
  ["UK International", "Noida, Uttar Pradesh"],
];

const card = "rounded-2xl border border-white/80 bg-white shadow-glass";

export function AboutPage() {
  const [query, setQuery] = useState("");
  const schools = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SCHOOLS;
    return SCHOOLS.filter(([name, city]) => `${name} ${city}`.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="space-y-16 md:space-y-24">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={light}>
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-electric-blue/10 blur-3xl" />
        <div className="relative max-w-4xl space-y-6">
          <Reveal>
            <Badge>Established 1985 · National section</Badge>
          </Reveal>
          <SplitHeading as="h1" type="words" className="font-display text-3xl font-bold leading-tight tracking-tight text-royal-navy sm:text-4xl md:text-5xl">
            Shaping the Pinnacle of Beauty & Wellness Education
          </SplitHeading>
          <SplitCopy className="text-base leading-relaxed text-text-subtle sm:text-lg">
            <p>
              ABTC is a Non Profit Organization in Mumbai, who is India&apos;s leading professional educational body in India. Our mission is to provide the advanced training you need and to develop your competitive edge to succeed within today&apos;s aesthetic industry. We are constantly updating our programs to include the latest, most in-demand services and industry advancements, so that our graduates are always ahead of the competition. This enables our graduates to work independently in their own business or in some of the most prestigious beauty spas in India and abroad.
            </p>
          </SplitCopy>
          <Reveal>
            <blockquote className="flex items-start gap-4 rounded-2xl border border-electric-blue/30 bg-white p-6 shadow-glass">
              <Icon name="format_quote" filled className="text-3xl text-electric-blue" />
              <div>
                <p className="font-display text-lg italic text-royal-navy">
                  Enabling graduates to lead the nation&apos;s premier aesthetic clinics and global spas.
                </p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-electric-blue">Authoritative standard for aesthetic rigor</p>
              </div>
            </blockquote>
          </Reveal>
        </div>
        <RiseGrid className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <TiltCard max={4} spotlight={false} className={`${card} overflow-hidden`}>
              <ParallaxImage
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiBI6NSNR37YC8FcEr_bDMqcfKj1eq8LCGY_8pN09XAru3V0sZPwyHmdVM0Av5scVyTvBf6TJ_LcggDW82-MRjKyXfiJDSzIsyLxC9rMzLm74Q_vIorjblXbPlOVgiYRNqiYjPxelYe-eTDiz9beSAS5KAbeECe9fXGepIS_Aku_iFYQKpIZosqMRQaJYgEEHjIezOhwFZK2mFhdCuPd2VHzz7TjqDQWkJh6fmfmYcTgLxFY0eyFUB9Q"
                alt="Cosmetology practical examination hall with students in clinical uniforms"
                className="h-80"
              />
              <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-midnight/80 to-transparent p-6 font-display text-white">
                Practical hands-on clinical training modules
              </p>
            </TiltCard>
          </div>
          <TiltCard max={5} spotlight={false} className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-royal-purple via-royal-navy to-midnight p-6 text-white shadow-glass-dark">
            <div>
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-electric-blue/40 bg-white/10">
                <Icon name="school" filled className="text-2xl text-secondary-fixed" />
              </span>
              <h3 className="font-display text-xl font-semibold">Non-profit credentialing</h3>
              <p className="mt-2 text-sm text-white/75">Founded in Mumbai to uphold the CIDESCO curricula across Indian provinces.</p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4 text-xs font-bold uppercase tracking-wider text-secondary-fixed">
              Affiliated: 1985
              <Icon name="verified_user" filled />
            </div>
          </TiltCard>
        </RiseGrid>
        </PanelShell>
      </section>

      <section id="benefactor" className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={dark}>
        <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-electric-blue/20 blur-3xl" />
        <div className="relative">
          <Badge dark>International benefactor & mentor</Badge>
          <SplitHeading type="words" className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            Joan Thorneycroft MBE
          </SplitHeading>
          <p className="mt-2 max-w-2xl text-white/70">
            The visionary leader instrumental in introducing CIDESCO International standards and establishing the official Indian section.
          </p>
          <div className="mt-8 grid items-center gap-8 rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-md md:p-10 lg:grid-cols-12">
            <div className="text-center lg:col-span-4">
              <TiltCard max={4} spotlight={false} className="mx-auto max-w-xs overflow-hidden rounded-xl border-2 border-electric-blue/40">
                <ParallaxImage
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQnlQFhNxmap7GX-ChH2lZRcq8gNWk9_BVXoXLWlr9tYZH5vPV0_wgUbIR8qJR52gloYAbJfBNr8wIuo3OaSXy1OKDsa6MFgvNQxQOrwkqcYNLnWheOpb4mnc1kgz68O0u-UX30ziuBSAdXFR2W9ef9mzaVOjY4iqN6CMer1Nzj1L_6To62f_JWh4pw44QR7OVi3kCPEOT7GBmA4aeeVH4ewH2lW6O7s_vF1jGV3aMJodOHaZeBIWaLXIm9wcvngeEAXI"
                  alt="Joan Thorneycroft MBE"
                  className="aspect-[4/5] h-auto grayscale transition duration-700 hover:grayscale-0"
                  speed={3}
                />
              </TiltCard>
              <p className="mt-4 font-display text-lg font-bold">Joan Thorneycroft MBE</p>
              <p className="text-sm text-white/60">Board member, CIDESCO International</p>
            </div>
            <div className="space-y-4 border-l-2 border-electric-blue pl-6 lg:col-span-8">
              <SplitCopy className="text-base leading-relaxed text-white/90">
                <p>
                  ABTC is grateful to her for helping us get CIDESCO section in India. Having begun her beauty career in 1934 at large London cosmetic house Rubenstein, Joan went on to work as a therapist and trainer, running her own beauty school in Kent for many years. She was also a founder member of associations Babtac in 1977 and BISA in 1998, but is perhaps best known for her work on the board of Cidesco, which saw her travel the world to implement international standards for beauty therapy.
                </p>
              </SplitCopy>
              <SplitCopy className="text-base leading-relaxed text-white/70">
                <p>
                  This series of achievements even led to Thorneycroft being awarded an MBE in 2013 for her role in developing the profession. After joining Cidesco in 1984, Joan&apos;s work took her across the Far East, Africa and India. She gradually established treatment standards that were viable on an international level, winning over the local associations and educators in each country one by one.
                </p>
              </SplitCopy>
              <RiseGrid className="grid grid-cols-3 gap-3 pt-2">
                {[["1934", "Career inception"], ["1984", "Joined CIDESCO"], ["MBE", "2013 honour"]].map(([y, l]) => (
                  <div key={y} className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
                    <p className="font-display text-xl font-bold text-secondary-fixed">{y}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">{l}</p>
                  </div>
                ))}
              </RiseGrid>
            </div>
          </div>
        </div>
        </PanelShell>
      </section>

      <section id="founders" className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={light}>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <Badge>Our foundations</Badge>
          <SplitHeading type="words" className="mt-3 font-display text-3xl font-bold text-royal-navy sm:text-4xl">
            Founder Committee: 1985
          </SplitHeading>
          <p className="mt-2 text-text-subtle">Formally registered in 1986 under Mumbai&apos;s Registrar of Societies.</p>
        </div>
        <RiseGrid className="grid gap-4 md:grid-cols-2">
          {FOUNDERS.map(([n, name, role, place]) => (
            <TiltCard key={n} max={3} scale={1.01} spotlight={false} className={`${card} flex items-center justify-between gap-3 p-5`}>
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-royal-navy text-sm font-bold text-white">{n}</span>
                <div>
                  <h3 className="font-display font-bold text-royal-navy">{name}</h3>
                  <p className="text-sm text-text-subtle">{role}</p>
                </div>
              </div>
              <span className="shrink-0 rounded-md bg-ice-blue px-3 py-1 text-[11px] font-bold text-electric-blue">{place}</span>
            </TiltCard>
          ))}
        </RiseGrid>
        </PanelShell>
      </section>

      <section id="agenda" className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={light}>
          <Badge>Objectives & mandate</Badge>
          <SplitHeading type="words" className="mt-3 font-display text-3xl font-bold text-royal-navy sm:text-4xl">
            ABTC Aim & Agenda
          </SplitHeading>
          <RiseGrid className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {AIMS.map((aim, i) => (
              <TiltCard key={aim} max={4} spotlight={false} className={`${card} flex flex-col justify-between p-6`}>
                <p className="flex items-start gap-3 text-accent-navy">
                  <Icon name="check_circle" filled className="mt-0.5 shrink-0 text-electric-blue" />
                  {aim}
                </p>
                <span className="mt-4 text-right text-[11px] font-bold tracking-wider text-text-subtle">
                  OBJECTIVE {String(i + 1).padStart(2, "0")}
                </span>
              </TiltCard>
            ))}
          </RiseGrid>
        </PanelShell>
      </section>

      <section id="examiners" className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={light}>
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Badge>Academic authorities</Badge>
            <SplitHeading type="words" className="mt-3 font-display text-3xl font-bold text-royal-navy">
              CIDESCO International Examiners
            </SplitHeading>
          </div>
          <span className="w-fit rounded-lg bg-midnight px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">5 registered examiners</span>
        </div>
        <RiseGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {EXAMINERS.map(([ini, name, role]) => (
            <TiltCard key={ini} max={6} spotlight={false} className="rounded-2xl bg-gradient-to-b from-royal-purple to-midnight p-6 text-center text-white shadow-glass-dark">
              <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-electric-blue font-display text-xl">{ini}</span>
              <h3 className="font-display font-bold">{name}</h3>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-secondary-fixed">CIDESCO examiner</p>
              <p className="mt-2 text-xs text-white/60">{role}</p>
            </TiltCard>
          ))}
        </RiseGrid>
        </PanelShell>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <RiseGrid className="grid gap-6 md:grid-cols-2">
        <Reveal>
          <article className={`${card} border-t-4 border-t-electric-blue p-8`}>
            <Icon name="assignment_turned_in" className="text-3xl text-electric-blue" />
            <h3 className="mt-4 font-display text-xl font-semibold text-royal-navy">Examination & accreditation expansion</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-subtle">
              The main focus of CIDESCO is to educate professionals, so we have started having our own examination. Today all over Maharashtra, we have more than 2000 ABTC certified beauticians. In the last 10 years, there has been a tremendous growth in this sector.
            </p>
          </article>
        </Reveal>
        <Reveal delay={0.1}>
          <article className={`${card} border-t-4 border-t-royal-navy p-8`}>
            <Icon name="account_balance" className="text-3xl text-royal-navy" />
            <h3 className="mt-4 font-display text-xl font-semibold text-royal-navy">Wellness industry growth & national advocacy</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-subtle">
              The wellness industry in India has grown leaps and bounds. ABTC for the last 25 years was only spread in Maharashtra. Today, because schools are coming up all over India, we would like to spread our training modules, request government support, and invite the profession to help us grow.
            </p>
          </article>
        </Reveal>
        </RiseGrid>
      </section>

      <section id="schools" className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={light}>
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <Badge>Accredited network</Badge>
              <SplitHeading type="words" className="mt-3 font-display text-3xl font-bold text-royal-navy">
                CIDESCO Certified Schools in India
              </SplitHeading>
            </div>
            <span className="w-fit rounded-lg bg-electric-blue px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">34 institutes</span>
          </div>
          <label className="mb-4 flex items-center gap-2 rounded-xl border border-ice-blue bg-cool-mist px-4 py-3">
            <Icon name="search" className="text-text-subtle" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search school or city"
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
          <div className="overflow-x-auto rounded-2xl border border-ice-blue bg-white shadow-glass">
            <table className="w-full text-left text-sm">
              <thead className="bg-ice-blue text-[11px] font-bold uppercase tracking-wider text-royal-navy">
                <tr>
                  <th className="p-4">No.</th>
                  <th className="p-4">Institute</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ice-blue">
                {schools.map(([name, city]) => (
                  <tr key={name} className="hover:bg-cool-mist">
                    <td className="p-4 font-bold text-text-subtle">{String(SCHOOLS.findIndex((row) => row[0] === name) + 1).padStart(2, "0")}</td>
                    <td className="p-4 font-semibold text-royal-navy">{name}</td>
                    <td className="p-4 text-text-subtle">{city}</td>
                    <td className="p-4"><span className="rounded bg-ice-blue px-2 py-1 text-xs font-semibold text-electric-blue">Active</span></td>
                  </tr>
                ))}
                {schools.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-text-subtle">No schools match that search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </PanelShell>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={light}>
        <Badge>Institutional alliances</Badge>
        <SplitHeading type="words" className="mt-3 font-display text-3xl font-bold text-royal-navy">
          Associate Members of ABTC India
        </SplitHeading>
        <RiseGrid className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MEMBERS.map(([name, place], i) => (
            <Reveal key={name} delay={(i % 6) * 0.04}>
              <div className={`${card} flex items-center justify-between p-4`}>
                <div>
                  <p className="font-display font-bold text-royal-navy">{name}</p>
                  <p className="text-sm text-text-subtle">{place}</p>
                </div>
                <span className="rounded bg-ice-blue px-2 py-1 text-xs font-bold text-electric-blue">{String(i + 1).padStart(2, "0")}</span>
              </div>
            </Reveal>
          ))}
        </RiseGrid>
        </PanelShell>
      </section>
    </div>
  );
}
