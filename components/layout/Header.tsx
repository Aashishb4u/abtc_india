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
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  const isActive = (href: string) => !href.includes("#") && pathname === href;

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : { y: -60, opacity: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: ready ? 0.15 : 0 }}
        className="sticky top-0 z-50 w-full"
      >
        {/* Unified Luxury Glassmorphic Navigation Bar */}
        <div
          className={cn(
            "glass-header w-full transition-all duration-300 ease-out",
            scrolled
              ? "bg-[#030822]/85 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
              : "bg-[#030822]/65 py-3.5 backdrop-blur-xl"
          )}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
            
            {/* Left: Brand Identity (Logo + Typography) */}
            <Link
              href="/"
              aria-label="ABTC India home"
              className="group flex min-w-0 items-center gap-2.5 transition-transform sm:gap-3 md:flex-shrink-0 duration-300 hover:scale-[1.02]"
            >
              <div className="relative flex h-10 w-12 shrink-0 items-center justify-center sm:h-11 sm:w-14">
                <img
                  src={IMAGES.logo}
                  alt="ABTC India Logo"
                  className="h-full w-full object-contain filter drop-shadow-[0_2px_8px_rgba(7,153,232,0.35)]"
                />
              </div>
              <div className="flex min-w-0 flex-col justify-center">
                <span className="truncate font-display text-lg font-bold tracking-[0.06em] text-white transition-colors group-hover:text-cyan-200 sm:text-xl lg:text-[22px]">
                  ABTC INDIA
                </span>
                <span className="truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-cyan-300/85 sm:text-[10px]">
                  CIDESCO SECTION · FI1552
                </span>
              </div>
            </Link>

            {/* Center: Desktop Navigation Bar */}
            <nav
              className="hidden items-center gap-1 text-xs font-semibold uppercase tracking-wider md:flex lg:gap-1.5 xl:gap-2"
              onMouseLeave={() => setHover(null)}
              aria-label="Main Navigation"
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
                        "relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.09em] transition-colors xl:px-3.5 xl:text-[13px]",
                        active
                          ? "font-bold text-white"
                          : "text-white/80 hover:text-white"
                      )}
                    >
                      {/* Subtle hover glass indicator */}
                      {hover === item.label && (
                        <motion.span
                          layoutId="nav-hover"
                          className="absolute inset-0 rounded-lg bg-white/[0.09] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      
                      <span className="relative z-10">{item.label}</span>
                      
                      {kids && (
                        <Icon
                          name="keyboard_arrow_down"
                          className={cn(
                            "relative z-10 text-sm transition-transform duration-200",
                            hover === item.label ? "rotate-180 text-cyan-300" : "text-white/60"
                          )}
                        />
                      )}

                      {/* Active Indicator Bar (Matching reference image cyan highlight) */}
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-x-2 -bottom-1 h-[2.5px] rounded-full bg-gradient-to-r from-cyan-400 to-electric-blue shadow-[0_0_10px_rgba(56,189,248,0.9)]"
                          transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        />
                      )}
                    </Link>

                    {/* Dropdown Menu with Glassmorphism */}
                    <AnimatePresence>
                      {kids && hover === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="absolute left-0 top-full z-50 pt-2"
                        >
                          <div className="glass-dropdown min-w-[13.5rem] p-1.5">
                            {kids.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  "block rounded-lg px-3.5 py-2.5 text-[11.5px] font-medium tracking-wide transition-all",
                                  isActive(child.href)
                                    ? "bg-white/15 font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                                    : "text-white/80 hover:bg-white/[0.08] hover:text-white"
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

            {/* Right: Actions & Accreditation Badges */}
            <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
              
              {/* CIDESCO International Shield Badge */}
              <div
                className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 text-white/90 backdrop-blur-md transition-all hover:bg-white/[0.08] sm:flex"
                title="Affiliated with CIDESCO International, Zurich (1946)"
              >
                <img
                  src={IMAGES.cidescoLogo}
                  alt="CIDESCO"
                  className="h-5 w-5 object-contain"
                />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-200">
                  Zurich 1946
                </span>
              </div>

              {/* Verify Diploma Glassmorphic CTA Button */}
              <Magnetic strength={0.2}>
                <Link
                  href="/education"
                  className="glass-btn inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-[0_4px_16px_rgba(7,153,232,0.2)] hover:text-cyan-200 sm:h-10 sm:px-4"
                >
                  <Icon name="verified" filled className="text-sm text-cyan-300" />
                  <span className="hidden sm:inline">Verify Diploma</span>
                  <span className="sm:hidden">Verify</span>
                </Link>
              </Magnetic>

              {/* Mobile Navigation Toggle Button */}
              <button
                onClick={() => setOpen(true)}
                className="glass-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-cyan-300 transition-all hover:text-white active:scale-95 md:hidden"
                aria-label="Open mobile menu"
              >
                <Icon name="menu" className="text-2xl" />
              </button>
            </div>

          </div>
        </div>
      </motion.header>

      <MobileDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
