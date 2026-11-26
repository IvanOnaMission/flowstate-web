import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";

export const metadata: Metadata = {
  alternates: { canonical: "/ai-quoting-for-electricians/" },
  openGraph: { url: "/ai-quoting-for-electricians/", images: ["/assets/hero/workshop-hook.jpg"] },
  title: "AI quote preparation for electrical businesses",
  description: "See the quoting workflow Flow State is developing: owner-supplied job details, quantities and prices become a draft quote for the owner to review.",
};

export default function Page() {
  return (
    <>
      <SiteNav />
      <main id="main" className="shell py-[clamp(3rem,6vw,5rem)]">
        <article className="max-w-[52rem]">
          <p className="eyebrow mb-5 text-atlantic">{"Quoting workflow · in development"}</p>
          <h1 className="h-hero max-w-[24ch] text-ink">{"From job notes to a quote you can review."}</h1>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Flow State is developing a quoting workflow for electrical businesses. You provide the job information, quantities and prices. The workflow checks for missing details and prepares a draft quote for your review."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Implementation depends on the agreed scope and the access your job-management software supports. We assess those requirements before committing to a build."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"How the first workflow is intended to work"}</h2>
          <h3 className="mt-8 text-xl font-bold text-ink">{"1. Supply the job information"}</h3>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Start with the information you've gathered about the job, including quantities and prices. The planned starting point is information supplied from your phone."}</p>
          <h3 className="mt-8 text-xl font-bold text-ink">{"2. Check what's missing"}</h3>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"An information-gathering skill checks for gaps and asks for the details needed to prepare the draft."}</p>
          <h3 className="mt-8 text-xl font-bold text-ink">{"3. Prepare the draft"}</h3>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"The workflow uses the supplied information to prepare a draft quote in your job-management system, once the required connection has been verified and implemented."}</p>
          <h3 className="mt-8 text-xl font-bold text-ink">{"4. Review and send"}</h3>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"You check the job scope, quantities, prices and customer-facing wording before sending the quote. Your review remains part of the process."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"The first scope is quote preparation"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Independent calculation of quantities and prices is outside the initial scope. You supply those inputs."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Automated quote follow-up is a possible later workflow with its own scope. Before it sends a reminder, it needs a reliable way to establish whether the quote still needs following up."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Look at quoting on the first call"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"The free call can look at how your quotes are prepared and where work gets held up. If quoting is the priority, we can agree an implementation plan as part of the ongoing AI partnership. AI prepares drafts; you approve the scope, quantities, pricing and final quote."}</p>
          <p className="mt-6"><a className="font-semibold text-atlantic underline underline-offset-4" href="/workflow-diagnostic/">{"See how getting started works →"}</a></p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Would this fit the way you quote?"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Bring a recent example to a free introductory call. We'll work out where the time's going. The scope and rate are agreed before any build starts."}</p>
          <div className="mt-7"><CallButton tone="atlantic" /></div>
          <p className="mt-3 text-sm text-mute">{"Free · about 30 minutes · no pitch deck"}</p>
        </article>
      </main>
    </>
  );
}
