import type { Metadata } from "next";
import { CidescoPage } from "@/components/pages/CidescoPage";

export const metadata: Metadata = {
  title: "About CIDESCO · ABTC India",
  description:
    "CIDESCO International, founded in Zurich in 1946. Diplomas, certificates, and the Indian section administered by ABTC India.",
};

export default function Page() {
  return <CidescoPage />;
}
