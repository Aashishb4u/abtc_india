"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { IMAGES, NAV } from "@/lib/data";
import { useIntro } from "@/lib/intro";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/motion/Magnetic";
import { EASE } from "@/components/motion/Reveal";
import { MobileDrawer } from "./MobileDrawer";

export function Header() {
  const pathname = usePathname();
  const { ready } = useIntro();
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (v) => setCompact(v > 90));

  const isActive = (href: string) => !href.includes("#") && pathname === href;

  return (
    <>
      <motion.header
        initial={{ y: -48, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : { y: -48, opacity: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay: ready ? 0.2 : 0 }}
        className="sticky top-0 z-40"
      >
        {/* Institutional bar — collapses on scroll */}
        <motion.div
          initial={false}
          animate={{ height: compact ? 0 : "auto", opacity: compact ? 0 : 1 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="hidden overflow-hidden border-b border-royal-navy/10 bg-white/95 shadow-sm backdrop-blur-md md:block"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
            <Link href="/" aria-label="ABTC India home" className="flex-shrink-0 transition-transform duration-300 hover:scale-105">
              <img src={IMAGES.logo} alt="ABTC India" className="h-14 w-auto object-contain sm:h-16" />
            </Link>

            <div className="flex-1 px-1 text-center sm:px-4">
              <p className="font-display text-[11px] font-bold uppercase leading-tight tracking-tight text-royal-navy sm:text-sm md:text-base lg:text-lg">
                ASSOCIATION OF BEAUTY THERAPY AND COSMETOLOGY (INDIA)
              </p>
              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-widest text-electric-blue sm:text-xs">
                INDIAN SECTION OF CIDESCO INTERNATIONAL
              </p>
              <p className="mt-0.5 text-[8px] font-medium text-text-subtle sm:text-[10px]">
                Registered No. FI1552
              </p>
            </div>

            <div className="flex-shrink-0 transition-transform duration-300 hover:scale-105">
              <img src={IMAGES.cidescoLogo} alt="CIDESCO International" className="h-14 w-14 object-contain sm:h-16 sm:w-16" />
            </div>
          </div>
        </motion.div>

        {/* Navigation bar */}
        <div className="border-b border-white/10 bg-midnight/85 text-white shadow-lg backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 transition-all hover:bg-white/10 active:scale-95 md:hidden"
              aria-label="Open navigation"
            >
              <Icon name="menu" className="text-xl text-electric-blue" />
              {/* <span className="text-xs font-bold uppercase tracking-wider">Navigation</span> */}
            </button>

            {/* Desktop: compact brand appears once the institutional bar collapses */}
            <motion.div
              initial={false}
              animate={{ width: compact ? 210 : 0, opacity: compact ? 1 : 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="hidden items-center gap-2.5 overflow-hidden md:flex"
            >
              <img src={IMAGES.logo} alt="" className="h-9 w-auto shrink-0 object-contain" />
              <span className="whitespace-nowrap font-display text-sm font-bold">ABTC INDIA</span>
            </motion.div>

            <nav
              className="hidden items-center gap-0.5 text-xs font-semibold uppercase tracking-wider md:flex"
              onMouseLeave={() => setHover(null)}
            >
              {NAV.map((item) => {
                const kids = "children" in item ? item.children : undefined;
                const active = kids
                  ? kids.some((child) => isActive(child.href))
                  : isActive(item.href);
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setHover(item.label)}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "relative flex items-center gap-0.5 px-3.5 py-2 transition-colors",
                        active ? "text-white" : "text-white/75 hover:text-white"
                      )}
                    >
                      {hover === item.label && (
                        <motion.span
                          layoutId="nav-hover"
                          className="absolute inset-0 rounded-lg bg-white/10"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span className="relative">{item.label}</span>
                      {kids && <Icon name="expand_more" className="relative text-base" />}
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-electric-blue shadow-glow"
                        />
                      )}
                    </Link>
                    <AnimatePresence>
                      {kids && hover === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                          className="absolute left-0 top-full z-50 pt-2"
                        >
                          <div className="min-w-[13rem] rounded-xl border border-white/10 bg-midnight p-1.5 shadow-glass-dark">
                            {kids.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  "block rounded-lg px-3 py-2.5 text-[11px] tracking-wider transition-colors",
                                  isActive(child.href)
                                    ? "bg-white/10 text-white"
                                    : "text-white/75 hover:bg-white/10 hover:text-white"
                                )}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            <Magnetic strength={0.25}>
              <Link
                href="/education"
                className="btn-shimmer inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-electric-blue to-electric-dark px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm transition-shadow hover:shadow-glow"
              >
                <Icon name="verified" filled className="text-sm" />
                <span>Verify Diploma</span>
              </Link>
            </Magnetic>
          </div>
        </div>
      </motion.header>

      <MobileDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
