import type { Metadata } from "next";
import Image from "next/image";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";
import StructuredData from "@/components/StructuredData";

const title = "AI for the work around industrial electrical projects.";
const description = "Flow State builds AI workflows around your processes and existing software. Your team reviews the output and keeps control of technical decisions.";
const path = "/guides/ai-industrial-electrical-business/";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, images: ["/assets/guides/industrial-handover.webp"] },
};

export default function Page() {
  return (
    <>
      <SiteNav />
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `https://flowstate.net.nz${path}#article`,
        headline: title,
        description,
        datePublished: "2026-09-09",
        author: { "@type": "Person", name: "Ivan Barnett", url: "https://flowstate.net.nz/about/" },
        publisher: { "@id": "https://flowstate.net.nz/#organization" },
        mainEntityOfPage: `https://flowstate.net.nz${path}`,
        image: "https://flowstate.net.nz/assets/guides/industrial-handover.webp",
      }} />
      <main id="main" className="shell py-[clamp(3rem,6vw,5rem)]">
        <article>
          <h1 className="max-w-[30ch] text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.1] tracking-tight text-ink">{title}</h1>
          <p className="mt-6 text-sm text-mute">By Ivan Barnett · 9 September 2026</p>
          <p className="mt-7 max-w-[65ch] text-xl leading-relaxed text-mute">Your team handles the technical work. AI can help with the repetitive processes around it:</p>
          <ul className="mt-9 grid gap-4 sm:grid-cols-2">
            {[
              ["Project updates", "Turn job notes into clear progress summaries."],
              ["Handovers and invoicing", "Gather photos, records and outstanding items."],
              ["Tender preparation", "Organise documents and flag information for the estimator to review."],
              ["Business knowledge", "Find the right procedure or past job information without hunting through folders."],
            ].map(([heading, detail]) => (
              <li key={heading} className="rounded-xl border border-hair bg-sky/20 p-6">
                <h2 className="text-xl font-semibold text-atlantic">{heading}</h2>
                <p className="mt-3 text-lg leading-relaxed text-mute">{detail}</p>
              </li>
            ))}
          </ul>
          <figure className="mt-10 overflow-hidden rounded-2xl border border-hair">
            <Image src="/assets/guides/industrial-handover.webp" alt="Illustrative workflow: scattered site photos, notes and project documents become an organised handover pack for review." width={1774} height={887} sizes="100vw" className="h-auto w-full" />
          </figure>
          <h2 className="mt-10 max-w-[35ch] text-2xl font-bold text-ink">Start with whatever takes the most time in your business.</h2>
          <p className="mt-6 max-w-[65ch] text-xl leading-relaxed text-mute">{description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <CallButton tone="atlantic" />
            <a className="font-semibold text-atlantic underline underline-offset-4" href="/workflow-diagnostic/">See how getting started works</a>
          </div>
        </article>
      </main>
    </>
  );
}
