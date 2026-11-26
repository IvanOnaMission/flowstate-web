import type { Metadata } from "next";
import Script from "next/script";
import EssentialsQuiz from "./EssentialsQuiz";
import { formFields } from "./questions";

const path = "/essentials/";
const title = "Business Essentials | AI foundation for NZ trades | Flowstate";
const description =
  "The AI foundation for a New Zealand trades business. Answer 7 quick questions, then book a free 30-minute audit with Ivan.";

const calendly =
  "https://calendly.com/ivan-flowstate/30min?utm_source=flowstate&utm_medium=direct-booking&utm_campaign=business-essentials";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  // Unlisted ad page; keep it out of search. The old /business-essentials/ URL now redirects to /services/.
  robots: { index: false, follow: false },
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: path,
    images: [
      {
        url: "/assets/business-essentials/business-essentials-vsl-poster.jpg",
        width: 1920,
        height: 1080,
        alt: "Ivan Barnett introducing Business Essentials",
      },
    ],
  },
};

export default function Page() {
  return (
    <main id="main">
      <EssentialsQuiz />

      {/* Netlify Forms reads this at deploy so every quiz field is kept. The quiz posts to it with fetch. */}
      <form name="essentials-quiz" method="POST" action={path} data-netlify="true" netlify-honeypot="bot-field" hidden aria-hidden="true">
        <input type="hidden" name="form-name" value="essentials-quiz" />
        <input type="hidden" name="bot-field" />
        {formFields.map((name) => (
          <input key={name} type="hidden" name={name} />
        ))}
      </form>

      <noscript>
        <p style={{ padding: "24px 16px", textAlign: "center" }}>
          <a href={calendly}>Book your free 30-minute audit with Ivan</a>
        </p>
      </noscript>

      <Script src="/assets/quoting/analytics.js?v=2" strategy="afterInteractive" />
      <Script src="/assets/quoting/meta-click.js?v=1" strategy="afterInteractive" />
      <Script src="/assets/quoting/booking.js?v=6" strategy="afterInteractive" />
    </main>
  );
}
