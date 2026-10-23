"use client";

import Link from "next/link";
import { AbtcSeal } from "@/components/ui/Seals";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

const ACCREDITATIONS = [
  { label: "Academic Accreditations", href: "/accreditations" },
  { label: "CIDESCO Diplomas", href: "/education" },
  { label: "ABTC Certification", href: "/education" },
  { label: "Swiss Examination Standards", href: "/cidesco" },
  { label: "Aim & Agenda", href: "/about#agenda" },
  { label: "Archival Landmark News", href: "/#news" },
];

const GLOBAL = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "CIDESCO", href: "/cidesco" },
  { label: "Aim & Agenda", href: "/about#agenda" },
  { label: "Education", href: "/education" },
  { label: "News", href: "/#news" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer
      id="footer"
      className="relative mt-20 w-full overflow-hidden border-t border-white/10 bg-gradient-to-b from-midnight via-[#050040] to-midnight text-white"
    >
      <div className="pointer-events-none absolute right-1/4 top-0 h-96 w-96 rounded-full bg-royal-purple/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
        <Stagger className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-12" stagger={0.12}>
          <StaggerItem className="space-y-4 md:col-span-5">
            <div className="flex items-center gap-3">
              <AbtcSeal tone="dark" className="h-8 w-12" />
              <div>
                <p className="font-display text-base font-bold tracking-wide">ABTC INDIA</p>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary-fixed">
                  Indian Section of CIDESCO International
                </p>
              </div>
            </div>
            <p className="max-w-sm text-xs font-light leading-relaxed text-white/70">
              Association of Beauty Therapy and Cosmetology (India) · Indian Section of CIDESCO
              International (Zurich, Switzerland). Registered No. FI1552. Dedicated to academic
              excellence, medical cosmetology standards, and sovereign accreditation across India.
            </p>
            <div className="space-y-1.5 pt-2 text-xs">
              <p>
                <span className="font-semibold text-secondary-fixed">Official Secretariat:</span>{" "}
                <a className="underline transition-colors hover:text-electric-blue" href="mailto:abtcindia@gmail.com">
                  abtcindia@gmail.com
                </a>
              </p>
              <p>
                <span className="font-semibold text-secondary-fixed">National Portal:</span>{" "}
                <a className="underline transition-colors hover:text-electric-blue" href="https://www.abtcindia.com">
                  www.abtcindia.com
                </a>
              </p>
            </div>
          </StaggerItem>

          <StaggerItem className="space-y-3 md:col-span-3">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-fixed">Accreditations</p>
            <ul className="space-y-2 text-xs font-light text-white/70">
              {ACCREDITATIONS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="block transition-all duration-200 hover:translate-x-1 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem className="space-y-4 md:col-span-4">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-fixed">Global Navigation</p>
            <div className="flex flex-wrap gap-2 text-xs">
              {GLOBAL.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 transition-all duration-200 hover:scale-105 hover:bg-white/15"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="pt-2">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-secondary-fixed">
                OFFICIAL SOCIAL CHANNELS
              </p>
              <div className="flex items-center gap-2.5">
                {[
                  { t: "Facebook", c: "f" },
                  { t: "Instagram", c: "ig" },
                  { t: "LinkedIn", c: "in" },
                ].map((s) => (
                  <a
                    key={s.t}
                    href="#"
                    title={s.t}
                    aria-label={s.t}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-electric-blue"
                  >
                    {s.c}
                  </a>
                ))}
              </div>
            </div>
          </StaggerItem>
        </Stagger>

        {/* Oversized wordmark */}
        <div aria-hidden className="select-none overflow-hidden border-t border-white/10 pt-8">
          <SplitHeading
            as="p"
            type="chars"
            start="top 95%"
            className="whitespace-nowrap text-center font-display text-[17vw] font-bold leading-[0.9] tracking-tight text-white/[0.06]"
          >
            ABTC INDIA
          </SplitHeading>
        </div>

        <Reveal className="space-y-1.5 border-t border-white/10 pt-8 text-center">
          <p className="text-xs text-white/70">
            © Association of Beauty Therapy and Cosmetology (India). Indian Section of CIDESCO
            International · Reg. No. FI1552. All rights reserved.
          </p>
          <p className="text-[11px] text-white/40">
            Copyrights ABTC India | abtcindia@gmail.com | www.abtcindia.com
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
