"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/motion/Magnetic";
import { PanelShell } from "@/components/motion/PanelShell";
import { RiseGrid } from "@/components/motion/RiseGrid";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { TiltCard } from "@/components/motion/TiltCard";
import { cn } from "@/lib/utils";

const light = "rounded-3xl border border-white/80 bg-white/70 p-6 shadow-glass backdrop-blur-xl sm:p-10 md:p-14";
const dark = "rounded-3xl border border-white/10 bg-gradient-to-br from-midnight via-royal-navy to-royal-purple p-6 text-white shadow-glass-dark sm:p-10 md:p-14";

const CITIES = ["All", "Pune", "Mumbai", "Nashik", "Kakinada", "Rajahmundry", "Kolhapur", "Solapur", "Ratnagiri"];

const SCHOOLS: { city: string; name: string; address: string; phone: string }[] = [
  { city: "Kakinada", name: "Mina Cosmetology & Wellness Academy", address: "2-27-24, JM's CNR Tower, Gokul St, Srinagar, Kakinada, A.P. 533002", phone: "9848464934, 9052599118" },
  { city: "Pune", name: "A.S. Academy of Beauty (Sarika Pawar / Alka Kulkarni)", address: "1320, opp. Modern High School, J.M. Road, Shivajinagar, Pune 411005", phone: "9975754193, 8308337224" },
  { city: "Pune", name: "Shri Manilal Nanavati Vocational Institute for Women", address: "Karve Nagar, Pune 411052", phone: "9049685922, 9822887966" },
  { city: "Rajahmundry", name: "Jaasmine's Beauty School (Rama Chandana Murli R.)", address: "Danavipeta, Rajahmundry, Andhra Pradesh 533103", phone: "9885166799 · WhatsApp 8341188186" },
  { city: "Pune", name: "Dr. Cyrus Poonawalla Skill Development Center", address: "Veer Savarkar Building, Camp, Pune 411001", phone: "7507507641" },
  { city: "Nashik", name: "Mirror Academy (Neha Khare)", address: "Shop 31–33, SK Open Mall, College Road, Nashik 422005", phone: "9850834848" },
  { city: "Mumbai", name: "Smira Beauty Cosmetology Academy (Smita Narvekar)", address: "17/502, Siddhachal Phase 3, Pokhran Road No. 2, Thane (W) 400610", phone: "9320152079 / 8369006848" },
  { city: "Pune", name: "Blaze Beauty Academy (Smita Deo)", address: "Kshitij Apartment, Erandwane, Pune 411004", phone: "9890744545" },
  { city: "Kakinada", name: "Institute of Beauty & Hair Sciences", address: "JM's CNR Tower, Gokul Street, Srinagar, Kakinada 533003", phone: "9848464934 / 9440318448" },
  { city: "Pune", name: "Fillit Institute of Beauty Management (Prachi Chopade)", address: "Parvati Building, Shashtri Road, Pune 411030", phone: "9503264583" },
  { city: "Pune", name: "Orchid Beauty Skin & Hair Academy (Smita Deshpande)", address: "Kulashree Building, Kothrud, Pune 411036", phone: "9822651303" },
  { city: "Nashik", name: "Saundaryasparsh Beauty Clinic (Ratna Kapadnis / Vandana Jagtap)", address: "Ratnadeep Apartment, Panchvati, Nashik", phone: "9860301750 / 9423181364" },
  { city: "Pune", name: "Sejal International Academy (Ajita Surve)", address: "Todkar Landmark, Pune–Satara Road, Pune 411037", phone: "9370645190" },
  { city: "Pune", name: "Midas (Anjali Joshi)", address: "Shanhari Apartments, Bajirao Road, Pune 411002", phone: "9822272542" },
  { city: "Pune", name: "Lees Beauty Center & Spa (Leena Khandekar)", address: "Kalpana Tarang, Erandwane, Pune 411004", phone: "9822333827" },
  { city: "Kolhapur", name: "Ava Beauty Institute & Spa (Rashmi Bhosale)", address: "Atharva Empire, Tarabai Park, Kolhapur 416003", phone: "9923810777" },
  { city: "Mumbai", name: "Identity Hair & Beauty Institute (Aparna Jadhav)", address: "Singh Estate, Kandivali (E), Mumbai 400101", phone: "9819633206 / 9320031204" },
  { city: "Solapur", name: "Suvarna Beauty Clinic & Spa (Sunanda Maharana)", address: "Bhawani Peth, Solapur 413002", phone: "9370773059 / 9595903059" },
  { city: "Ratnagiri", name: "Royal n' Plush Spa & Beauty Salon (Pragati Waje)", address: "Arihant Tower, Malnaka, Ratnagiri 415612", phone: "9623181998 / 9834076098" },
];

export function AccreditationsPage() {
  const [city, setCity] = useState("All");
  const [query, setQuery] = useState("");
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SCHOOLS.filter((s) => {
      const cityOk = city === "All" || s.city === city || (city === "Mumbai" && s.city === "Mumbai");
      const text = `${s.name} ${s.address} ${s.city}`.toLowerCase();
      return cityOk && (!q || text.includes(q));
    });
  }, [city, query]);

  return (
    <div className="space-y-16 md:space-y-24">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={light}>
          <Badge>Institutional accreditations & standards</Badge>
          <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SplitHeading as="h1" type="words" className="font-display text-4xl font-bold text-royal-navy sm:text-5xl">
                Accreditations
              </SplitHeading>
              <p className="mt-3 max-w-2xl text-text-subtle">
                National and global recognition for affiliated academies under CIDESCO International standards.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-ice-blue bg-white p-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-royal-navy text-white">
                <Icon name="verified" filled />
              </span>
              <div>
                <p className="text-sm font-bold text-royal-navy">Reg. No. FI1552</p>
                <p className="text-xs text-text-subtle">CIDESCO Section India</p>
              </div>
            </div>
          </div>
        </PanelShell>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <RiseGrid className="grid gap-5 md:grid-cols-2">
          <TiltCard max={4} spotlight={false} className="rounded-2xl border border-white/80 bg-white/80 p-8 shadow-glass">
            <p className="text-[11px] font-bold uppercase tracking-wider text-electric-blue">Curriculum standard</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-royal-navy">CIDESCO School Accreditation</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-subtle">
              Schools vetted for the international curriculum. The affiliated list is below.
            </p>
            <a href="#schools" className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-electric-blue">
              Affiliated school list <Icon name="arrow_forward" className="text-sm" />
            </a>
          </TiltCard>
          <TiltCard max={4} spotlight={false} className="rounded-2xl border border-white/80 bg-white/80 p-8 shadow-glass">
            <p className="text-[11px] font-bold uppercase tracking-wider text-electric-blue">Clinical quality</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-royal-navy">CIDESCO Centre Accreditation</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-subtle">
              Beauty centres accredited so aesthetic practice meets one high standard, nationally and internationally.
            </p>
            <a href="mailto:abtcindia@gmail.com?subject=CIDESCO%20Center%20Accreditation" className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-electric-blue">
              More details <Icon name="open_in_new" className="text-sm" />
            </a>
          </TiltCard>
        </RiseGrid>
      </section>

      <section id="schools" className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={light}>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <SplitHeading type="words" className="font-display text-3xl font-bold text-royal-navy">
                ABTC Accreditation Schools
              </SplitHeading>
              <p className="mt-2 max-w-xl text-sm text-text-subtle">Certified institutes under syllabus verification.</p>
            </div>
            <label className="flex items-center gap-2 rounded-xl border border-ice-blue bg-white px-3 py-2 lg:w-80">
              <Icon name="search" className="text-text-subtle" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search academy" className="w-full bg-transparent text-sm outline-none" />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCity(c)}
                className={cn("rounded-lg px-3 py-1 text-xs font-bold", city === c ? "bg-royal-navy text-white" : "border border-ice-blue bg-white text-text-subtle")}
              >
                {c === "All" ? `All (${SCHOOLS.length})` : c === "Mumbai" ? "Mumbai / Thane" : c}
              </button>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.map((s) => (
              <article key={s.name} className="flex flex-col justify-between rounded-xl border border-ice-blue bg-white p-5">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-lg bg-ice-blue px-2 py-0.5 text-[11px] font-bold text-royal-navy">{s.city}</span>
                    <Icon name="verified" className="text-electric-blue" />
                  </div>
                  <h3 className="mt-3 font-display text-base font-bold leading-snug text-royal-navy">{s.name}</h3>
                  <p className="mt-2 text-sm text-text-subtle">{s.address}</p>
                </div>
                <p className="mt-4 flex items-center gap-2 border-t border-ice-blue pt-3 text-sm font-semibold text-royal-navy">
                  <Icon name="call" className="text-electric-blue" /> {s.phone}
                </p>
              </article>
            ))}
            {list.length === 0 && <p className="text-sm text-text-subtle">No schools match that search.</p>}
          </div>
        </PanelShell>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={dark}>
          <Badge dark>Verification protocol</Badge>
          <SplitHeading type="words" className="mt-3 font-display text-3xl font-bold">Apply for ABTC & CIDESCO affiliation</SplitHeading>
          <p className="mt-2 max-w-xl text-white/75">Academies need the infrastructure, faculty, and examination standards registered under FI1552.</p>
          <div className="mt-6">
            <Magnetic strength={0.2}>
              <Button href="mailto:abtcindia@gmail.com?subject=Accreditation%20Application" variant="white">Request accreditation kit</Button>
            </Magnetic>
          </div>
        </PanelShell>
      </section>
    </div>
  );
}
