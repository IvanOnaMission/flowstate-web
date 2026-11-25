import StructuredData from "@/components/StructuredData";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";

export const metadata: Metadata = {
  alternates: { canonical: "/guides/ai-quoting-for-electricians/" },
  openGraph: { url: "/guides/ai-quoting-for-electricians/", images: ["/assets/hero/workshop-hook.jpg"] },
  title: "AI quoting for electricians: what you still check",
  description: "Flowstate's practical scope for AI quote preparation: supply job details, quantities and prices, check missing information, then review the draft before sending.",
};

export default function Page() {
  return (
    <>
      <SiteNav />
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": "https://flowstate.net.nz/guides/ai-quoting-for-electricians/#article",
        headline: "AI quoting for electricians: what it can prepare, what you still check",
        datePublished: "2026-09-07",
        author: { "@type": "Person", name: "Ivan Barnett", url: "https://flowstate.net.nz/about/" },
        publisher: { "@id": "https://flowstate.net.nz/#organization" },
        mainEntityOfPage: "https://flowstate.net.nz/guides/ai-quoting-for-electricians/",
      }} />
      <main id="main" className="shell py-[clamp(3rem,6vw,5rem)]">
        <article className="max-w-[52rem]">
          <h1 className="h-hero max-w-[24ch] text-ink">{"AI quoting for electricians: what it can prepare, what you still check"}</h1>
          <p className="mt-6 text-sm text-mute">Ivan Barnett, Flowstate · <time dateTime="2026-09-07">7 September 2026</time></p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"At Flowstate, a useful starting point for AI quoting is preparing a draft from information you supply. That keeps the scope clear: the job details, quantities and prices come from you, and you review the quote before it goes to the customer."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"That's the first quoting workflow Flowstate is developing. It isn't a claim that a finished system can independently estimate an electrical job. Here's the process Flowstate is designing around, and the questions to settle before building it into a business."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Start with a real quote"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Take a recent job and trace how its quote was prepared. Where were the notes? Who supplied the quantities? Where did the prices come from? What had to be clarified before the quote could go out?"}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"This shows which work is information gathering, which is preparation and which requires a decision. It also gives you a concrete example to assess, instead of trying to automate “quoting” as one large, undefined task."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Give the workflow the inputs it needs"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"For the initial workflow, the owner supplies the job information, quantities and prices. An information-gathering skill checks for missing details before a draft is prepared."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"That checking step matters. A polished draft can still be incomplete. For this scope, missing information should be brought back for clarification, rather than silently filled in with invented job details or prices."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Business context matters too: how you describe work, the process you follow and the information you require before a quote is ready. Those requirements belong in the agreed implementation."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Verify the connection to your job software"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Preparing a draft in the job-management system depends on the access and functions that system makes available. That needs checking for the actual workflow before promising an integration."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"The questions are practical: can the implementation create the required draft, put information in the correct fields, and leave it ready for review? What should happen if information is missing or the connection fails?"}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Those questions help define the build. They should be answered before treating the workflow as ready for everyday use."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Keep a deliberate review before sending"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"For this first scope, review remains with the owner. Check:"}</p>
          <ul className="mt-5 max-w-[65ch] list-disc space-y-3 pl-6 text-[1.0625rem] leading-relaxed text-mute"><li>{"Whether the draft describes the work you intend to quote."}</li><li>{"Whether the supplied quantities and prices are represented correctly."}</li><li>{"Whether anything is missing, duplicated or unclear."}</li><li>{"Whether the wording is suitable for the customer."}</li></ul>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Independent calculation of quantities and prices is outside the initial scope. Draft preparation and estimating decisions need to be distinguished when you agree what the implementation will do."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Treat follow-up as a separate step"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Preparing a quote and deciding whether to chase it are different tasks. Before automating reminders, establish how the workflow will know whether the quote was accepted, declined, changed or already followed up."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Follow-up can be considered later under its own scope. It should have reliable status information before sending customer messages."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Test the value with actual work"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Before a pilot, record how long the existing preparation process takes and what causes rework. During the pilot, include the time spent supplying information, correcting the draft and reviewing it."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Compare similar jobs and keep a record of the problems the workflow encounters. That gives you a basis for deciding whether it is helping. Producing a draft quickly, on its own, doesn't establish the overall time saved."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Flowstate isn't quoting a measured customer saving for this workflow. It is in development, and results would need to be established in use."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Want to assess where AI could help your quoting?"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Flowstate starts with a paid diagnostic of your workflows and a prioritised roadmap. Quoting is one possible area to assess. After the diagnostic, you and Flowstate agree the scope and rate for an ongoing AI partnership covering implementation, training and support. You keep approval of quotes and pricing."}</p>
          <p className="mt-6"><a className="font-semibold text-atlantic underline underline-offset-4" href="/workflow-diagnostic/">{"Explore the diagnostic and AI partnership →"}</a></p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Book a free introductory call to discuss the paid diagnostic. Flowstate assesses software access and constraints before agreeing any implementation."}</p>
          <div className="mt-7"><CallButton tone="atlantic" /></div>
        </article>
      </main>
    </>
  );
}
