import SoftwareExplanation from "@/components/SoftwareExplanation";
import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";

export const metadata: Metadata = {
  alternates: { canonical: "/services/" },
  openGraph: { url: "/services/", images: ["/assets/hero/workshop-hook.jpg"] },
  title: "AI implementation: how it works",
  description: "Start with a paid AI opportunity diagnostic. Then scope an AI foundation, a first useful workflow and practical training with Flowstate.",
};

export default function Page() {
  return (
    <>
      <SiteNav />
      <main id="main" className="shell py-[clamp(3rem,6vw,5rem)]">
        <article className="max-w-[52rem]">
          <p className="eyebrow mb-5 text-atlantic">{"How it works"}</p>
          <h1 className="h-hero max-w-[24ch] text-ink">{"Start with the work that's getting held up."}</h1>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Flowstate builds and configures AI around your team’s processes, business knowledge and existing tools. We help reduce repetitive work, bring information together and keep work moving between people and systems."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"We start by finding where AI could make the biggest difference—whether you work in industrial, commercial or residential electrical."}</p>
          <SoftwareExplanation />
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"1. A free call to work out fit"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"We'll talk about how your business runs, your current software and a recent example of work getting stuck. The call takes about 30 minutes and helps us decide whether a paid diagnostic is the right next step."}</p>
          <div className="mt-7"><CallButton tone="atlantic" /></div>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"2. Understand the business"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"We examine how your business runs, where work gets held up and what takes more time or effort than it should. The diagnostic identifies and prioritises opportunities based on the pain involved, potential return and how practical they are to implement."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"You receive a workflow map, findings, the information and system requirements for an AI foundation, and a recommendation for what to implement first. We discuss the findings with you so the next decision is clear."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"The diagnostic is a separate paid engagement. Its scope, fee and timing are agreed before it starts. Implementation is scoped separately."}</p>
          <p className="mt-6"><Link className="font-semibold text-atlantic underline underline-offset-4" href="/workflow-diagnostic/">{"What the diagnostic includes →"}</Link></p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"3. A foundation and a first useful workflow"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"The planned implementation brings the relevant business knowledge, information and agreed software connections together, then adds the first usable AI skill or automation."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"We start with the owner and include practical education so you can use the workflow and review its output. The exact connections, responsibilities and delivery scope are agreed for your business."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Quoting is one possible starting point we are testing. The application in development follows a simple sequence: you supply job information, quantities and prices; the workflow checks for missing details and prepares a draft quote; you review it before sending."}</p>
          <p className="mt-6"><Link className="font-semibold text-atlantic underline underline-offset-4" href="/ai-quoting-for-electricians/">{"Explore the quoting workflow →"}</Link></p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"4. Decide what to build next"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Once the first implementation is in use, we identify the next area worth improving. Optional ongoing development can add skills, automations and further education under a separately agreed scope."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"What you'll need to bring"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"A recent example of the work, an explanation of how you handle it today, and time to answer questions and review what we build. We'll establish the required access to software and information before committing to the implementation."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"The time involved depends on the agreed scope. We work that out with you rather than promising the same schedule for every business."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Tell me where work is getting stuck."}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Bring one example to a free discovery call. We'll work out whether a diagnostic would help identify where AI could make the biggest difference."}</p>
          <div className="mt-7"><CallButton tone="atlantic" /></div>
          <p className="mt-3 text-sm text-mute">{"Free · about 30 minutes · no pitch deck"}</p>
        </article>
      </main>
    </>
  );
}
