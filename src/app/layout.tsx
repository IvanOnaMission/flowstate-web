import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { site } from "@/lib/site";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

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
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description:
    "You can't hire your way out of this. Flowstate trains an AI system on how your trade business actually works — your pricing, your process, your customers — so it stops being the thing everything waits on.",
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
        {/* Keyboard users land here first. Hidden until focused. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-atlantic focus:px-5 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
