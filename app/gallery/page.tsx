import type { Metadata } from "next";
import { GalleryPage } from "@/components/pages/GalleryPage";

export const metadata: Metadata = {
  title: "ABTC Events · ABTC India",
  description: "National seminars, examinations, and conclaves of ABTC India.",
};

export default function Page() {
  return <GalleryPage />;
}
