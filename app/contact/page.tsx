import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/ContactPage";

export const metadata: Metadata = {
  title: "Contact · ABTC India",
  description: "ABTC India secretariat, Mahim, Mumbai. Committee contacts for 2026–2029.",
};

export default function Page() {
  return <ContactPage />;
}
