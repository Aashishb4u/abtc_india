import { Hero } from "@/components/sections/Hero";
import { TrustMarquee } from "@/components/sections/TrustMarquee";
import { About } from "@/components/sections/About";
import { Cidesco } from "@/components/sections/Cidesco";
import { Aims } from "@/components/sections/Aims";
import { Education } from "@/components/sections/Education";
import { News } from "@/components/sections/News";
import { MemorialModal } from "@/components/layout/MemorialModal";

export default function HomePage() {
  return (
    <div className="space-y-16 md:space-y-24">
      <MemorialModal />
      <Hero />
      <TrustMarquee />
      <About />
      <Cidesco />
      <Aims />
      <Education />
      <News />
    </div>
  );
}
