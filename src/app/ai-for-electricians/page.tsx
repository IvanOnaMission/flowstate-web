import Image from "next/image";
import SoftwareExplanation from "@/components/SoftwareExplanation";
import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";
import FaqBlock from "@/components/FaqBlock";

const faqs = [
  {
    question: "What does Flowstate do for an electrical business?",
    answer:
      "Flowstate builds and configures AI around your team's processes, business knowledge and existing tools. That helps reduce repetitive work, bring information together, and keep work moving between people and systems. We start by finding where it could help, in industrial, commercial or residential electrical work.",
  },
  {
    question: "What does the paid diagnostic include?",
    answer:
      "We review your workflows, software and business information and give you a prioritised roadmap, including the requirements for the work worth tackling first. After that we agree the scope and rate for an ongoing AI partnership covering implementation, training and support.",
  },
  {
    question: "What can the quoting workflow do?",
    answer:
      "The quoting workflow is in development. You supply the job information, quantities and prices. It checks for missing details and prepares a draft in the job-management system for review, where the software access allows it. You check the scope, quantities, prices and wording before sending. It does not calculate quantities and prices on its own.",
  },
  {
    question: "What should I bring to the call?",
    answer:
      "A recent example: a quote that took too long, an enquiry that slipped through, or something you keep chasing yourself. The call is free and takes about 30 minutes. We use the example to discuss whether a paid diagnostic would help.",
  },
  {
    question: "Who would I be working with?",
    answer:
      "Ivan Barnett, in Auckland. He builds the systems himself. He spent four years in the trades, most recently as an electrical apprentice. The work starts with the owner and can expand to the team as the implementation develops.",
  },
] as const;

export const metadata: Metadata = {
  alternates: { canonical: "/ai-for-electricians/" },
  openGraph: { url: "/ai-for-electricians/", images: ["/assets/hero/workshop-hook.jpg"] },
  title: "AI implementation for electricians in New Zealand",
  description: "Explore AI implementation for your electrical business. Flowstate examines where AI could make the biggest difference and scopes a practical first workflow.",
};

export default function Page() {
  return (
    <>
      <SiteNav />
      <main id="main" className="shell py-[clamp(3rem,6vw,5rem)]">
        <article className="max-w-[52rem]">
          <p className="eyebrow mb-5 text-atlantic">{"AI for electrical businesses"}</p>
          <h1 className="h-hero max-w-[24ch] text-ink">{"When the work comes back to you, start there."}</h1>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Flowstate builds and configures AI around your team’s processes, business knowledge and existing tools. We help reduce repetitive work, bring information together and keep work moving between people and systems."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"We start by finding where AI could make the biggest difference—whether you work in industrial, commercial or residential electrical."}</p>
          <aside className="mt-8 max-w-[65ch] border-l-4 border-gold pl-6">
            <p className="eyebrow inline-block bg-gold px-2 py-1 text-ink">In short</p>
            <p className="mt-3 text-[1.15rem] font-[750] leading-snug tracking-[-0.02em] text-ink">
              Flowstate builds AI for New Zealand electrical businesses around the team&apos;s processes, knowledge and existing tools. The work starts with whatever keeps coming back to the owner, and you check quotes before they are sent.
            </p>
          </aside>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
            <Link className="font-semibold text-atlantic underline underline-offset-4" href="/ai-for-trades-businesses/">Other trades</Link>
            {" are on the trades page. The starting package for the admin around the job is "}
            <Link className="font-semibold text-atlantic underline underline-offset-4" href="/business-essentials/">Business Essentials</Link>
            .
          </p>
          <SoftwareExplanation />
          <div className="mt-7"><CallButton tone="atlantic" /></div>
          <p className="mt-3 text-sm text-mute">{"Free · about 30 minutes · no pitch deck"}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Start with a paid diagnostic"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"We review your workflows, software and business information to see where AI could make a useful difference."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"You get a prioritised roadmap, including the requirements and constraints for the work worth tackling first. After the diagnostic, we agree the scope and rate for an ongoing AI partnership covering implementation, training and support."}</p>
          <p className="mt-6"><a className="font-semibold text-atlantic underline underline-offset-4" href="/workflow-diagnostic/">{"Explore the diagnostic and AI partnership →"}</a></p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"A first application: job notes to a draft quote"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"We're developing a quoting workflow that starts with job information, quantities and prices supplied by the owner. It checks for missing details and prepares a draft in the job-management system for review, subject to the software access and connections available."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"You check the scope, quantities, prices and wording before sending. Independent calculation of quantities and prices is outside this initial workflow."}</p>
          <p className="mt-6"><Link className="font-semibold text-atlantic underline underline-offset-4" href="/ai-quoting-for-electricians/">{"See the proposed quoting workflow →"}</Link></p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Build around how your business works"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Your pricing, processes and customer communication need to be understood before a workflow can use them well. The planned implementation combines that foundation with a first agreed AI skill or automation and practical education."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"The software connections and delivery scope are checked and agreed for your business. A tool name on its own doesn't establish whether a particular workflow is possible."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Work directly with Ivan"}</h2>
          <div className="mt-6 grid items-start gap-7 sm:grid-cols-[11rem_1fr]">
            <Image src="/assets/team/ivan.jpg" alt="Ivan Barnett, founder of Flowstate" width={900} height={1200} sizes="(max-width: 639px) 240px, 176px" className="h-auto w-full max-w-[15rem] rounded-xl" />
            <div>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Flowstate is based in Auckland. Ivan builds the systems himself and brings a background in trades, most recently as an electrical apprentice."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"The work starts with the owner and can expand to the team as the implementation develops."}</p>
          <p className="mt-6"><Link className="font-semibold text-atlantic underline underline-offset-4" href="/about/">{"About Ivan and Flowstate →"}</Link></p>
            </div>
          </div>
          <FaqBlock faqs={faqs} path="/ai-for-electricians/" />
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Bring a recent example."}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"A quote that took too long. An enquiry that slipped through. Something you keep having to chase yourself. We'll use it to discuss whether a paid diagnostic would help you decide where to start."}</p>
          <div className="mt-7"><CallButton tone="atlantic" /></div>
        </article>
      </main>
    </>
  );
}
