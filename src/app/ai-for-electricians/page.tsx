import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";

export const metadata: Metadata = {
  alternates: { canonical: "/ai-for-electricians/" },
  openGraph: { url: "/ai-for-electricians/", images: ["/assets/hero/workshop-hook.jpg"] },
  title: "AI implementation for electricians in New Zealand",
  description: "Explore AI implementation for your electrical business. Flowstate starts with a quoting or sales diagnostic and scopes a practical first workflow.",
};

export default function Page() {
  return (
    <>
      <SiteNav />
      <main id="main" className="shell py-[clamp(3rem,6vw,5rem)]">
        <article className="max-w-[52rem]">
          <p className="eyebrow mb-5 text-atlantic">{"AI for electrical businesses"}</p>
          <h1 className="h-hero max-w-[24ch] text-ink">{"When the work comes back to you, start there."}</h1>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"The job notes are on your phone. The pricing needs checking. The quote is waiting for you to sit down and pull it together."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Flowstate helps New Zealand electrical business owners assess where AI could fit into that work, then scope a practical first implementation around their information and existing software."}</p>
          <div className="mt-7"><CallButton tone="atlantic" /></div>
          <p className="mt-3 text-sm text-mute">{"Free · about 30 minutes · no pitch deck"}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Start with quoting or sales"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"A paid diagnostic looks at one agreed area: quoting and estimating, or sales. We map the workflow, examine the information it relies on and recommend a first implementation."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"That might reveal a useful role for AI. It might also reveal missing information or a process problem that needs sorting first. The diagnostic makes those requirements visible before the build is scoped."}</p>
          <p className="mt-6"><Link className="font-semibold text-atlantic underline underline-offset-4" href="/workflow-diagnostic/">{"See what a diagnostic includes →"}</Link></p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"A first application: job notes to a draft quote"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"We're developing a quoting workflow that starts with job information, quantities and prices supplied by the owner. It checks for missing details and prepares a draft in the job-management system for review, subject to the software access and connections available."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"You check the scope, quantities, prices and wording before sending. Independent calculation of quantities and prices is outside this initial workflow."}</p>
          <p className="mt-6"><Link className="font-semibold text-atlantic underline underline-offset-4" href="/ai-quoting-for-electricians/">{"See the proposed quoting workflow →"}</Link></p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Build around how your business works"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Your pricing, processes and customer communication need to be understood before a workflow can use them well. The planned implementation combines that foundation with a first agreed AI skill or automation and practical education."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"The software connections and delivery scope are checked and agreed for your business. A tool name on its own doesn't establish whether a particular workflow is possible."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Work directly with Ivan"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Flowstate is based in Auckland. Ivan builds the systems himself and brings a background in trades, most recently as an electrical apprentice."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"The work starts with the owner and can expand to the team as the implementation develops."}</p>
          <p className="mt-6"><Link className="font-semibold text-atlantic underline underline-offset-4" href="/about/">{"About Ivan and Flowstate →"}</Link></p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Bring a recent example."}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"A quote that took too long. An enquiry that slipped through. Something you keep having to chase yourself. We'll use it to work out whether a diagnostic would be useful."}</p>
          <div className="mt-7"><CallButton tone="atlantic" /></div>
        </article>
      </main>
    </>
  );
}
