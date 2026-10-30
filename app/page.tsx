import { JourneyHero } from "@/components/sections/JourneyHero";
import { TrustMarquee } from "@/components/sections/TrustMarquee";
import { About } from "@/components/sections/About";
import { Cidesco } from "@/components/sections/Cidesco";
import { Aims } from "@/components/sections/Aims";
import { Education } from "@/components/sections/Education";
import { News } from "@/components/sections/News";

export default function HomePage() {
  return (
    <div className="space-y-16 md:space-y-24">
      <JourneyHero />
      <TrustMarquee />
      <About />
      <Cidesco />
      <Aims />
      <Education />
      <News />
    </div>
  );
}
