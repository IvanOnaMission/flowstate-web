import type { Metadata } from "next";
import Image from "next/image";
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
          {/* Ivan's answer Q12 with D14 (D25 j). */}
          <h2 className="mt-14 max-w-[34ch] border-t border-hair pt-9 text-2xl font-bold text-ink">Should I use job management software or custom AI automation for my trade business?</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">Both. Keep the job software: it runs the job. Custom AI takes on the repetitive work around it, and it works best when it&apos;s connected to the job software, Xero and everything else, so the AI can see the whole business.</p>
          <h2 className="mt-12 max-w-[34ch] text-2xl font-bold text-ink">Does it work with Tradify, ServiceM8, AroFlo or Xero?</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">Pretty much, yes. Flowstate can work with any job management software, ServiceM8 included. The easiest is software with full API access, which is a proper way for other systems to plug into it. Xero has that, and so does AroFlo.</p>
          <p className="mt-4 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">Tradify doesn&apos;t have full API access, so there we automate through the browser, with the AI clicking through the screens like a person would. That works, it&apos;s just more fiddly and can break when they change their screens. If you&apos;re not sure about your job software, check whether it has full API access.</p>
          <p className="mt-4 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">For the detail on the two most common ones, see <a className="font-semibold text-atlantic underline underline-offset-4" href="/fergus-automation/">Fergus automation</a> and <a className="font-semibold text-atlantic underline underline-offset-4" href="/simpro-automation/">Simpro automation</a>.</p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <CallButton tone="atlantic" />
            <a className="font-semibold text-atlantic underline underline-offset-4" href="/workflow-diagnostic/">Explore the diagnostic and AI partnership</a>
          </div>
        </article>
      </main>
    </>
  );
}
