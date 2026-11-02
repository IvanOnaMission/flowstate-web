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
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description:
    "Flowstate helps New Zealand electricians and trade businesses use AI on repetitive admin. You approve what goes to a customer. Based in Auckland.",
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
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${site.url}/#organization`,
              name: site.name,
              url: site.url,
              logo: {
                "@type": "ImageObject",
                url: `${site.url}/assets/makeover/flowstate-logo.svg`,
              },
              email: site.email,
              telephone: "+64272006121",
              areaServed: { "@type": "Country", name: "New Zealand" },
              address: {
                "@type": "PostalAddress",
                addressLocality: site.city,
                addressCountry: "NZ",
              },
              founder: { "@id": `${site.url}/about/#ivan` },
            },
            {
              "@type": "ProfessionalService",
              "@id": `${site.url}/#business`,
              name: site.name,
              url: site.url,
              image: `${site.url}/assets/makeover/flowstate-logo.svg`,
              email: site.email,
              telephone: "+64272006121",
              description: site.tagline,
              serviceType: "AI implementation for trade businesses",
              areaServed: { "@type": "Country", name: "New Zealand" },
              address: {
                "@type": "PostalAddress",
                addressLocality: site.city,
                addressCountry: "NZ",
              },
              parentOrganization: { "@id": `${site.url}/#organization` },
            },
          ],
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
