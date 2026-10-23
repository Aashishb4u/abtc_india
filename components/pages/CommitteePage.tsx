"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/motion/Magnetic";
import { PanelShell } from "@/components/motion/PanelShell";
import { RiseGrid } from "@/components/motion/RiseGrid";
import { SplitCopy } from "@/components/motion/SplitCopy";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { TiltCard } from "@/components/motion/TiltCard";

const light = "rounded-3xl border border-white/80 bg-white/70 p-6 shadow-glass backdrop-blur-xl sm:p-10 md:p-14";
const dark = "rounded-3xl border border-white/10 bg-gradient-to-br from-midnight via-royal-navy to-royal-purple p-6 text-white shadow-glass-dark sm:p-10 md:p-14";

const BOARD = [
  ["President", "Smita Deo", "ABTC Executive Council", "badge", "https://lh3.googleusercontent.com/aida-public/AB6AXuAcoKfkuggnFvEz937Tzw-lXXP5Tw9YbQBFhAIYqTynmUYM5AldDOlcOpBxrByuljJ0xwKl4osJlRb3fyQoK5XAmBx7KAMkzuGE_Wi7dn8c10EbNXmgCSle9d5rLm5BXRH8yc8TDtfyhJsjN2X9FIFnxZNNGRWlE2JG3TV6y-MK69g7LLe0MtT5Q7Ld88ho4oAfJt56w9FfO3Ewedz4vKGOpjfKd1PPjzWz5G532QqGhNHB2aScvOGeeQ"],
  ["Chairperson", "Anjali Joshi", "Governing Chair", "gavel", "https://lh3.googleusercontent.com/aida-public/AB6AXuCTwcYQwciopL08FVCkl3UpeN5POX1MDye-5gjHEgw8HS0eFJjpNgiSOhk1SLH6udpkoHUueH4ejAqTQXYxgmwGE_OmDA7A9xg9lzgsbYTO11oiVRXbk5EM9fLVBlngZKXsOJZnfxDJLuAeFUxbjxBJ1zPoM1ioHhTSPtDr82okGji_WlYowXAhfUPOEmv9gBp_34LduVTqjizGjmw8E6dgnriJ3zeJs_kO0HnFAr0Pqs7ZdwTNvxL2-Q"],
  ["Secretary", "Vandana Jagtap", "National Secretariat", "assignment", "https://lh3.googleusercontent.com/aida-public/AB6AXuCwbxVYSTLe0Gh5Aeb1bjUzZCRY7VZOoGAavkEbReLQadiRheuWaB2wWFPqfezTcoTuTExViSwB76pdfAyHcBJ_kj-MFeHEgq7XajeRvjsr4pR68BPb4ldLfLtlqALJX1kiN4GlZrcuwSVQT3jZEfAqg7bXkchQu6MhMItqDlFeltkLFsyYC9NlAor53fhnQ5iGoL_CEGPcGL_7428wu4jLLL8jqxxayxXj-lsIZ0QD6SpXqX7qMMQeGg"],
  ["Treasurer", "Namrata Goud", "Financial Administration", "account_balance_wallet", "https://lh3.googleusercontent.com/aida-public/AB6AXuDEKEgQWscAm_37VsyyFDBtTcACVZJqzvUnZoj8WaH-pk7lYmqWc5ElmcJnGUx-zZVTarQd6STcEdro1ImDOgMo4DTgUBqfAFCoujU7Ow5EmGCuoxwFaAP1Tluy9UMEZmnD-Srfcl3w3o9nFidPgJtpXM98AQ0btiAbC6-clav4fsKi-SP9E9-eTcy8BXLrhFX0Ufr0spKHozLZSBj9ynO3wyj3ROEBAmiL98UjkS8DwIxd8iZWkVZdlg"],
  ["Education", "Deepaa Bhagwat", "Education incharge & school co-ordinator", "menu_book", "https://lh3.googleusercontent.com/aida-public/AB6AXuD0DGpzvCuzNCNJTPTkSMg1SkKn-kbRFnEY6sD4d_5TLxZZ1S7j3CX2yKhVVb7-QgQ5CLXT0MKH8jqDrckBIw7CAji_wdmd8PlIYWEprOght1Q3LjrRzfdrVZeipg1no_L1rdf8e76QxYbSChcBDgNbfiCNrBpo0CUPTPp_SNAV83Aa4WWiXMCk2uL19TubQ4dP6qvRTdzNQJe3mmKL6LOLW3nChjVQu2YQcX2yHy38a9HAV4zyqzGqHg"],
  ["Education", "Bina Chetty", "Education incharge & school co-ordinator", "school", "https://lh3.googleusercontent.com/aida-public/AB6AXuAVANeq3sUpeJ8JQxsPs64mK4C_FEVHNrJAGJA_4DtldS192ND9fQDxAlvqyVfJ6HTi4lBjVa-N6iN2KZqBgYanBPnk3v4HlMMzR7WF9kCOIM-7Ldg4d82uOBsNrutN2p-bipHnmwGfuKKFCahy785F1-f9cx7czVQ87fNsKGQi7HQfCu9enMKkI8ZqoKyDo5Yi7671D_jKkJT6L9B2VtK4NeeapccnRTEDhe76VXOZimYno2Ksmc3tjw"],
  ["Programs", "Rashmi Tapkir", "Program in charge", "event_seat", "https://lh3.googleusercontent.com/aida-public/AB6AXuACOc87mRf6AjhUzkHKVOUMHuy91m509S7N9YvOxnKL9oYACMtvvmb3BS0g-SRgrgs1AupYGfKHertcI2VOHysIQ3ZTaL7FWIkm7ize6V3HnoZrJmlK05XSuBmu7_qPMfUGJA3jKP545D3-rHi9hUiTywCY3L1VOK2gq3MY6f35q_sXN5VVMPC0G-HJsiWeKdEkxXoBog3YGyE9NGrF4R7iL5uZEB3AVz3CLgP5ymlLVx2H1J55Q9HtWQ"],
  ["Programs", "Geeta Pardeshi", "Program in charge", "campaign", "https://lh3.googleusercontent.com/aida-public/AB6AXuChRizj7XVLn4or2BI55Z8YZRnNXZkhtb1OEehD-jygkNKFf_SsRaXnM4hQGg5q-ED4ngvoQIhDSLZ4lPUtkIavD8bX0QUaB7Ye36cxVwbavz0v9F5ZpErSKkGpAVzAklbHv951geIO8kXCFWpsjkMgC27bzhV8_Nj12-T-n3fxV8ZKRUjTEh17k3yYQ-PYEL0A8KSjGvNSNFmHqT6r59JlbfVQUF4HBeoZBg1CdDiW0297bv5Xa-dVBw"],
] as const;

const SUB = [
  ["Madhuri Bhandare", "Practical syllabus review board", "https://lh3.googleusercontent.com/aida-public/AB6AXuCCP9wzaHPi8lR8dr-bCldCdW-iPEGXyqy3T4tkspkgowyfZUndIlxezm4kWKuLbSny883gumpHbSOWeKb_NXsptDnzKKOkZ59BQwSx5POhRLjPYnsWgWhrG5qQhtI9Q2jC-7xx2RpyF1bui9SKsiPKCLusnPi3u-6fldqldS0jAHsV4TepxkZwC2O4OtSgipb53-yT8rffgGSC8hbAVevI5wod3UfGfOaZ1_VWmJkWQ13P6kqXvXwbLQ"],
  ["Rakhee Rathod", "Curriculum & student evaluation", "https://lh3.googleusercontent.com/aida-public/AB6AXuDsfEPFgqKzzu13LmnPDRE4F7kAzS-g4DmicnOfm2oZT449yRWol65o71Sa-ZTpV5KBVk8KPug06zCu7kwiantTvZ6VV93BnOPtGCiXKgLEA5FtmkByUNhhiwv9JRJDIuEdR4v_HDF9zflY9CVaSqohF1LYx7OSKy7xMD5ubnM54_CIoLMqNSXMi3vBDI81Z-LGLQiXXkAhS8nc4PqzAcBc9lwiBV3ZO5hszOZBN0Kwrt0XsTE9G4hcJw"],
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
          <p className="mx-auto mt-3 max-w-2xl text-lg font-medium text-text-subtle">
            Association of Beauty Therapy & Cosmetology (India)
          </p>
          <p className="mt-1 text-sm tracking-wide text-text-subtle">Indian Section of CIDESCO International · Reg. No. FI1552</p>
        </PanelShell>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <PanelShell className={light}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-electric-blue">Founder member & trustee</p>
          <div className="mt-8 grid items-center gap-8 lg:grid-cols-12">
            <TiltCard max={4} spotlight={false} className="overflow-hidden rounded-2xl border border-white bg-white p-2 shadow-glass lg:col-span-4">
              <img
                alt="Late Maya Paranjapye"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDR-O6_crpA2nbM0AUkDq21akrW3ZKN53gmZtVf6uAOyJnJVgVx5uaBR1CM-A5cvztmjFslVrz64BtqvffDVmDKlNRbnIiLnKZAy2J69o9hvm7C49qiPJceB9f9pzJMsygS10NxeT1zJrhvxcrV9RPLEzLRvY4CjJuWnF4oPVUxbLjj_5g2tryR9ZQrpBNkrc6h2c-3T7g0wqebA1oLUTSHIG2SZt1kTiREqXe-fKFCeDNpe5to2ZDe9A"
                className="aspect-[4/5] w-full rounded-xl object-cover object-top"
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
