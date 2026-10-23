import type { Metadata } from "next";
import { CommitteePage } from "@/components/pages/CommitteePage";

export const metadata: Metadata = {
  title: "Committee · ABTC India",
  description: "Managing committee and sub-committee of ABTC India, 2026–2029.",
};

export default function Page() {
  return <CommitteePage />;
}
