import type { Metadata, Viewport } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import { IntroProvider } from "@/lib/intro";
import { Preloader } from "@/components/motion/Preloader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { AmbientOrbs } from "@/components/motion/AmbientOrbs";
import { Cursor } from "@/components/motion/Cursor";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";

export const metadata: Metadata = {
  title: "ABTC India · Section of CIDESCO International (Reg No. FI1552)",
  description:
    "Association of Beauty Therapy and Cosmetology (India) — the Indian Section of CIDESCO International. Professional beauty therapy education, ABTC certification and CIDESCO diplomas.",
};

export const viewport: Viewport = {
  themeColor: "#030032",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Luxury Beauty Industry Typography System */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..800;1,6..96,400..800&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
        />
        <noscript>
          <style>{`#preloader{display:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <IntroProvider>
          <Preloader />
          <SmoothScroll />
          <ScrollProgress />
          <AmbientOrbs />
          <Cursor />
          <Header />
          <main className="pt-6">{children}</main>
          <Footer />
          <BackToTop />
        </IntroProvider>
      </body>
    </html>
  );
}
