import type { Metadata } from "next";
import { AccreditationsPage } from "@/components/pages/AccreditationsPage";

export const metadata: Metadata = {
  title: "Accreditations · ABTC India",
  description: "CIDESCO school and centre accreditation, and ABTC affiliated schools.",
};

export default function Page() {
  return <AccreditationsPage />;
}
