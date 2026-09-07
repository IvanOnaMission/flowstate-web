import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";
import { callPromise, site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/contact/thanks/" },
  openGraph: { url: "/contact/thanks/", images: ["/assets/hero/workshop-hook.jpg"] },
  title: "Thanks",
  description: "Your message is through. Ivan will come back to you the same day.",
  robots: { index: false, follow: false },
};

/**
 * Where the contact form lands. This route existed on the previous site and
 * is kept at the same URL so the form's action doesn't 404 — and so does
 * anything else still pointing at it.
 */
export default function Thanks() {
  return (
    <>
      <SiteNav />
      <main id="main" className="shell py-[clamp(4rem,10vw,7rem)]">
        <p className="eyebrow mb-5 text-atlantic">Message sent</p>
        <h1 className="h-hero max-w-[16ch] text-ink">
          Got it. <span className="text-atlantic">I&apos;ll be in touch.</span>
        </h1>
        <p className="mt-7 max-w-[46ch] text-[1.1rem] leading-relaxed text-mute">
          I&apos;ll come back to you the same day. If it&apos;s urgent,{" "}
          <a
            href={site.phoneHref}
            className="font-semibold text-ink underline decoration-hair underline-offset-4 hover:decoration-atlantic"
          >
            {site.phone}
          </a>{" "}
          is the fastest way to reach me.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-hair pt-9">
          <CallButton tone="atlantic">Book the call anyway</CallButton>
          <span className="text-[0.85rem] text-mute">{callPromise}</span>
        </div>

        <p className="mt-8">
          <Link
            href="/"
            className="text-[1rem] font-semibold text-ink underline decoration-hair underline-offset-4 transition-colors duration-200 hover:decoration-atlantic"
          >
            Back to the site
          </Link>
        </p>
      </main>
    </>
  );
}
