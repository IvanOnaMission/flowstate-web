import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

// Zodiak is the brand display face and is self-hosted — see the 2026-08-13
// decision to stop pulling it from a CDN.
const zodiak = localFont({
  src: [
    { path: "../../public/assets/fonts/zodiak-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/assets/fonts/zodiak-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-zodiak",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jet = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jet",
  display: "swap",
});

const SITE = "https://flowstate.net.nz";
const TITLE = "Flowstate — AI systems for NZ trade businesses";
const DESC =
  "The office side of the job should run without you in the room. Flowstate builds AI systems for New Zealand trade businesses — quotes, follow-ups, review chasing, the inbox.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: TITLE, template: "%s — Flowstate" },
  description: DESC,
  authors: [{ name: "Ivan Barnett" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE,
    title: TITLE,
    description: "The office side of the job should run without you in the room.",
    siteName: "Flowstate",
    locale: "en_NZ",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "The office side of the job should run without you in the room.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-NZ"
      className={`${zodiak.variable} ${inter.variable} ${jet.variable} h-full`}
    >
      <head>
        {/*
          Marks the document as JS-capable before first paint. The reveal
          animation only arms itself behind this class, so with JS off (or
          slow) the page renders fully visible instead of blank.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-atlantic focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteNav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
