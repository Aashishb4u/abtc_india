"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV } from "@/lib/data";
import { getLenis } from "@/lib/lenis";
import { cn } from "@/lib/utils";
import { AbtcSeal } from "@/components/ui/Seals";
import { Icon } from "@/components/ui/Icon";
import { EASE } from "@/components/motion/Reveal";

const ICONS: Record<string, string> = {
  Home: "home",
  About: "account_balance",
  Committee: "groups",
  Accreditations: "verified",
  Education: "school",
  Gallery: "photo_library",
  FAQ: "help",
  "Contact Us": "mail",
};

export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    getLenis()?.stop();
    document.documentElement.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("keydown", esc);
      document.documentElement.style.overflow = "";
      getLenis()?.start();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-midnight/70 backdrop-blur-md"
          />
          <motion.aside
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.65, ease: EASE }}
            className="fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col border-r border-white/10 bg-midnight/95 text-white shadow-glass-dark backdrop-blur-2xl"
          >
            <div className="flex h-full flex-col space-y-6 overflow-y-auto p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <AbtcSeal tone="dark" className="h-7 w-9" />
                  <div>
                    <p className="font-display text-sm font-bold leading-tight">ABTC INDIA</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-electric-blue">
                      CIDESCO Section FI1552
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close menu"
                  className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Icon name="close" className="text-2xl" />
                </button>
              </div>

              <nav className="flex-1 space-y-1.5">
                {NAV.map((item, i) => {
                  const kids = "children" in item ? item.children : undefined;
                  const active = kids
                    ? kids.some((child) => pathname === child.href)
                    : !item.href.includes("#") && pathname === item.href;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, ease: EASE, delay: 0.15 + i * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-200 hover:translate-x-1",
                          active
                            ? "border-white/15 bg-white/10 font-semibold text-white"
                            : "border-transparent text-white/80 hover:border-white/5 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <Icon name={ICONS[item.label] ?? "circle"} filled={active} className="text-electric-blue" />
                        {item.label}
                      </Link>
                      {kids && (
                        <div className="ml-8 mt-1 space-y-1 border-l border-white/10 pl-3">
                          {kids.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={onClose}
                              className={cn(
                                "block rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider",
                                pathname === child.href ? "text-white" : "text-white/65 hover:text-white"
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </nav>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
