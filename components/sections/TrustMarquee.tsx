import { MARQUEE } from "@/lib/data";
import { Marquee } from "@/components/motion/Marquee";

export function TrustMarquee() {
  return (
    <section aria-label="ABTC India at a glance">
      <Marquee items={MARQUEE} />
    </section>
  );
}
