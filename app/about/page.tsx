import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/AboutPage";

export const metadata: Metadata = {
  title: "About ABTC · Association of Beauty Therapy and Cosmetology (India)",
  description:
    "The Indian Section of CIDESCO International. Founders, examiners, aims, and accredited schools.",
};

export default function Page() {
  return <AboutPage />;
}
