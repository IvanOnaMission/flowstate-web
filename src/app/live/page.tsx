import type { Metadata } from "next";
import Script from "next/script";
import LiveSession from "./LiveSession";
import { ANSWERS_FORM, FORM_NAME, VIDEO_POSTER } from "./session";
import { formFields } from "../essentials/questions";

const path = "/live/";
const title = "Free live session for electrical business owners | Flowstate";
const description =
  "A free live session for New Zealand electrical business owners with Jordan from Conduction Company. Tuesday, 10am NZ time.";

const tracking = ["ad_id", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "landing_path", "fbclid", "fbc", "fbp"];
const answerFields = formFields.filter((f) => !["name", "business", "phone", "email", ...tracking].includes(f));

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  // Ad page, kept out of search.
  robots: { index: false, follow: false },
  alternates: { canonical: path },
  openGraph: { title, description, url: path, ...(VIDEO_POSTER ? { images: [{ url: VIDEO_POSTER }] } : {}) },
};

/** Netlify Forms reads these at deploy so every field is kept. The page posts to them with fetch. */
function HiddenForm({ name, fields }: { name: string; fields: string[] }) {
  return (
    <form name={name} method="POST" action={path} data-netlify="true" netlify-honeypot="bot-field" hidden aria-hidden="true">
      <input type="hidden" name="form-name" value={name} />
      <input type="hidden" name="bot-field" />
      {fields.map((f) => (
        <input key={f} type="hidden" name={f} />
      ))}
    </form>
  );
}

export default function Page() {
  return (
    <main id="main">
      <LiveSession />
      <HiddenForm name={FORM_NAME} fields={["name", "email", "phone", ...tracking]} />
      <HiddenForm name={ANSWERS_FORM} fields={["name", "email", "phone", ...answerFields]} />
      <Script src="/assets/quoting/analytics.js?v=2" strategy="afterInteractive" />
      <Script src="/assets/quoting/meta-click.js?v=1" strategy="afterInteractive" />
    </main>
  );
}
