import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";

export const metadata: Metadata = {
  alternates: { canonical: "/guides/" },
  openGraph: { url: "/guides/", images: ["/assets/hero/workshop-hook.jpg"] },
  title: "Practical AI guides for electrical businesses",
  description: "Flowstate's plain-language guides to AI implementation for electrical businesses, starting with quote preparation, business information and owner review.",
};

export default function Page() {
  return (
    <>
      <SiteNav />
      <main id="main" className="shell py-[clamp(3rem,6vw,5rem)]">
        <article className="max-w-[52rem]">
          <h1 className="h-hero max-w-[24ch] text-ink">{"Practical AI guides for electrical business owners"}</h1>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Flowstate's guides show where AI could fit into your business, what it needs and what you still check."}</p>
          <h2 className="mt-10 text-2xl font-bold text-ink">How NZ builders and tradies use AI to cut admin</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">Which admin a builder, plumber or electrician can hand to AI today, what stays with you, and what the trade businesses getting ahead are doing differently.</p>
          <p className="mt-6"><Link className="font-semibold text-atlantic underline underline-offset-4" href="/guides/ai-for-builders-nz/">Read the guide →</Link></p>
          <h2 className="mt-10 text-2xl font-bold text-ink">AI for the work around industrial electrical projects.</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">Flowstate builds AI for the repetitive processes around your team&apos;s technical work.</p>
          <p className="mt-6"><Link className="font-semibold text-atlantic underline underline-offset-4" href="/guides/ai-industrial-electrical-business/">Read the guide →</Link></p>
          <h2 className="mt-10 text-2xl font-bold text-ink">Your job management software runs the job. There’s still manual work around it.</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">Entering information. Gathering photos and job notes. Preparing invoices. Updating records. Summarising what happened on site.</p>
          <p className="mt-6"><Link className="font-semibold text-atlantic underline underline-offset-4" href="/guides/job-software-or-custom-ai/">Read the guide →</Link></p>
          <h2 className="mt-10 text-2xl font-bold text-ink">Where should an electrical business start with AI?</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">Start by freeing up the owner’s time. Define a repetitive task, brief AI like an employee, then test and improve a reusable workflow.</p>
          <p className="mt-6"><Link className="font-semibold text-atlantic underline underline-offset-4" href="/guides/where-to-start-with-ai/">Read the guide →</Link></p>
          <h2 className="mt-10 text-2xl font-bold text-ink">{"AI quoting for electricians: what it can prepare, what you still check"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"A practical starting scope for quote preparation, the inputs it needs and the review that stays with the owner."}</p>
          <p className="mt-6"><Link className="font-semibold text-atlantic underline underline-offset-4" href="/guides/ai-quoting-for-electricians/">{"Read the guide →"}</Link></p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Want to look at your own quoting process?"}</p>
          <div className="mt-7"><CallButton tone="atlantic" /></div>
        </article>
      </main>
    </>
  );
}
