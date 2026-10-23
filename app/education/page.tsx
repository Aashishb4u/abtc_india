import type { Metadata } from "next";
import { EducationPage } from "@/components/pages/EducationPage";

export const metadata: Metadata = {
  title: "Education · ABTC India",
  description: "ABTC and CIDESCO certification, aims, and regional education faculty.",
};

export default function Page() {
  return <EducationPage />;
}
