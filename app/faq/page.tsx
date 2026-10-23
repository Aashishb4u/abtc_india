import type { Metadata } from "next";
import { FaqPage } from "@/components/pages/FaqPage";

export const metadata: Metadata = {
  title: "FAQ · ABTC India",
  description: "Questions on ABTC examinations, CIDESCO diplomas, and accreditation.",
};

export default function Page() {
  return <FaqPage />;
}
