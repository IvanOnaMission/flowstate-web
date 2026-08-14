import type { Metadata } from "next";
import { Btn } from "@/components/Button";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Message sent",
  description: "Thanks — your message is through. We'll come back to you shortly.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/contact/thanks/" },
};

export default function Thanks() {
  return (
    <section className="fs-shell flex min-h-[60vh] flex-col justify-center py-24">
      <Reveal>
        <span className="fs-label">Message sent</span>
        <h1 className="fs-display mt-6 max-w-[16ch] text-[clamp(2.25rem,6vw,4.5rem)] text-ink">
          Got it. We&apos;ll come back to you.
        </h1>
        <p className="mt-7 max-w-[52ch] text-[1.0625rem] leading-relaxed text-mute">
          Usually same day. If it&apos;s urgent, ring{" "}
          <a
            href={site.phoneHref}
            className="text-atlantic underline decoration-line-strong underline-offset-4 hover:decoration-atlantic"
          >
            {site.phone}
          </a>
          .
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Btn href="/" tone="atlantic">
            Back to the site
          </Btn>
          <Btn href="/services/" tone="quiet">
            How it works
          </Btn>
        </div>
      </Reveal>
    </section>
  );
}
