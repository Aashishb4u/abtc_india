import type { Metadata } from "next";
import { CidescoEventsPage } from "@/components/pages/CidescoEventsPage";

export const metadata: Metadata = {
  title: "CIDESCO Events · ABTC India",
  description: "World congresses and examiner meetings of the Indian Section of CIDESCO.",
};

export default function Page() {
  return <CidescoEventsPage />;
}
