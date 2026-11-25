import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { site } from "@/lib/site";
import SiteFooter from "@/components/SiteFooter";
import WorkshopBar from "@/components/WorkshopBar";
import "./globals.css";
import StructuredData from "@/components/StructuredData";

/**
 * next/font downloads and self-hosts at build time, so there is no request to
 * Google at runtime and no flash of fallback text. Works with `output: export`.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  verification: { other: { "msvalidate.01": "A54314F7256E7BFBC7446A0D056C0FE8" } },
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description:
    "Flowstate helps you rethink how that work gets done. We identify the repetitive steps AI could take on, build around your processes and information, and keep your judgement where it matters.",
  openGraph: {
    type: "website",
    locale: "en_NZ",
    url: site.url,
    siteName: site.name,
    images: ["/assets/hero/workshop-hook.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-NZ" className={jakarta.variable}>
      <head>
        {/*
          Runs before first paint and arms the scroll-reveal CSS. Without it
          the reveal styles never apply, so the page renders fully visible.
          That is the intended failure mode — never a blank hero.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <StructuredData data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${site.url}/#organization`,
          name: site.name,
          url: site.url,
          email: site.email,
          telephone: site.phone,
          description: site.entity,
          address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: "NZ" },
          areaServed: { "@type": "Country", name: "New Zealand" },
          knowsAbout: ["AI automation for trade businesses", "Simpro", "Fergus", "ServiceM8", "Xero", "AroFlo", "Tradify"],
          ...(site.sameAs.length > 0 && { sameAs: site.sameAs }),
        }} />
        {/* Keyboard users land here first. Hidden until focused. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-atlantic focus:px-5 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>
        <WorkshopBar />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
