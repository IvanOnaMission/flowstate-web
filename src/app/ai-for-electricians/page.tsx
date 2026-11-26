import Image from "next/image";
import SoftwareExplanation from "@/components/SoftwareExplanation";
import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";

export const metadata: Metadata = {
  alternates: { canonical: "/ai-for-electricians/" },
  openGraph: { url: "/ai-for-electricians/", images: ["/assets/hero/workshop-hook.jpg"] },
  title: "AI implementation for electricians in New Zealand",
  description: "Explore AI implementation for your electrical business. Flow State examines where AI could make the biggest difference and scopes a practical first workflow.",
};

export default function Page() {
  return (
    <>
      <SiteNav />
      <main id="main" className="shell py-[clamp(3rem,6vw,5rem)]">
        <article className="max-w-[52rem]">
          <p className="eyebrow mb-5 text-atlantic">{"AI for electrical businesses"}</p>
          <h1 className="h-hero max-w-[24ch] text-ink">{"When the work comes back to you, start there."}</h1>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Flow State builds and configures AI around your team’s processes, business knowledge and existing tools. We help reduce repetitive work, bring information together and keep work moving between people and systems."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"We start by finding where AI could make the biggest difference, whether you work in industrial, commercial or residential electrical."}</p>
          <SoftwareExplanation />
          <div className="mt-7"><CallButton tone="atlantic" /></div>
          <p className="mt-3 text-sm text-mute">{"Free · about 30 minutes · no pitch deck"}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Start with a free 30-minute call"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"We work out where the time's going and where AI could make a useful difference in your business."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"If it's a fit, we build a custom implementation plan, and agree the scope and rate before any build starts. We build the foundation in 2 to 3 days, then add helpers one at a time, with an ongoing AI partnership covering implementation and support."}</p>
          <p className="mt-6"><a className="font-semibold text-atlantic underline underline-offset-4" href="/workflow-diagnostic/">{"See how getting started works →"}</a></p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"A first application: job notes to a draft quote"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"We're developing a quoting workflow that starts with job information, quantities and prices supplied by the owner. It checks for missing details and prepares a draft in the job-management system for review, subject to the software access and connections available."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"You check the scope, quantities, prices and wording before sending. Independent calculation of quantities and prices is outside this initial workflow."}</p>
          <p className="mt-6"><Link className="font-semibold text-atlantic underline underline-offset-4" href="/ai-quoting-for-electricians/">{"See the proposed quoting workflow →"}</Link></p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Build around how your business works"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Your pricing, processes and customer communication need to be understood before a workflow can use them well. The planned implementation combines that foundation with a first agreed AI skill or automation."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"The software connections and delivery scope are checked and agreed for your business. A tool name on its own doesn't establish whether a particular workflow is possible."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Work directly with Ivan"}</h2>
          <div className="mt-6 grid items-start gap-7 sm:grid-cols-[11rem_1fr]">
            <Image src="/assets/team/ivan.jpg" alt="Ivan Barnett, founder of Flow State" width={900} height={1200} sizes="(max-width: 639px) 240px, 176px" className="h-auto w-full max-w-[15rem] rounded-xl" />
            <div>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Flow State is based in Auckland. Ivan builds the systems himself and brings a background in trades, most recently as an electrical apprentice."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"The work starts with the owner and can expand to the team as the implementation develops."}</p>
          <p className="mt-6"><Link className="font-semibold text-atlantic underline underline-offset-4" href="/about/">{"About Ivan and Flow State →"}</Link></p>
            </div>
          </div>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Bring a recent example."}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"A quote that took too long. An enquiry that slipped through. Something you keep having to chase yourself. We'll use it to work out where to start."}</p>
          <div className="mt-7"><CallButton tone="atlantic" /></div>
        </article>
      </main>
    </>
  );
}
