import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";
import StructuredData from "@/components/StructuredData";

const title = "Your job management software runs the job. There’s still manual work around it.";
const description = "Flowstate builds AI workflows to take on that repetitive work, using your processes and the software you already have. Your team checks the results and stays in control.";
const path = "/guides/job-software-or-custom-ai/";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, images: ["/assets/guides/job-information-to-invoice.webp"] },
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
        image: "https://flowstate.net.nz/assets/guides/job-information-to-invoice.webp",
      }} />
      <main id="main" className="shell py-[clamp(3rem,6vw,5rem)]">
        <article>
          <h1 className="max-w-[30ch] text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.1] tracking-tight text-ink">{title}</h1>
          <p className="mt-6 text-sm text-mute">By Ivan Barnett · 9 September 2026</p>
          <ul className="mt-9 grid max-w-[60rem] gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {["Entering information.", "Gathering photos and job notes.", "Preparing invoices.", "Updating records.", "Summarising what happened on site."].map((task) => (
              <li key={task} className="rounded-xl border border-hair bg-sky/20 px-5 py-4 text-lg font-medium text-atlantic">{task}</li>
            ))}
          </ul>
          <figure className="mt-10 overflow-hidden rounded-2xl border border-hair">
            <Image src="/assets/guides/job-information-to-invoice.webp" alt="Illustrative workflow: scattered job photos, notes and timesheets become an organised job pack and invoice draft ready for review." width={1774} height={887} sizes="100vw" className="h-auto w-full" />
          </figure>
          <p className="mt-9 max-w-[65ch] text-xl leading-relaxed text-mute">{description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <CallButton tone="atlantic" />
            <Link className="font-semibold text-atlantic underline underline-offset-4" href="/workflow-diagnostic/">See what the diagnostic includes</Link>
          </div>
        </article>
      </main>
    </>
  );
}
