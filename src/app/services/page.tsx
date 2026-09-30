import SoftwareExplanation from "@/components/SoftwareExplanation";
import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";
import { callPromise } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/services/" },
  openGraph: { url: "/services/", images: ["/assets/hero/workshop-hook.jpg"] },
  title: "Workflow diagnostic and ongoing AI partner",
  description: "Start with a paid workflow diagnostic and prioritised roadmap. After the diagnostic, agree the scope and rate for an ongoing AI partnership: implementation, training and support.",
};

const paragraph = "mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute";
const heading = "h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink";

export default function Page() {
  return (
    <>
      <SiteNav />
      <main id="main" className="shell py-[clamp(3rem,6vw,5rem)]">
        <article className="max-w-[52rem]">
          <p className="eyebrow mb-5 text-atlantic">Diagnostic &amp; AI partner</p>
          <h1 className="h-hero max-w-[24ch] text-ink">Start with a diagnostic. Then work with your AI partner.</h1>
          <p className={paragraph}>Flowstate helps New Zealand electrical businesses find where AI could make a useful difference, then put the agreed changes into practice. The paid diagnostic comes first. The ongoing AI partner scope and rate are agreed after the diagnostic.</p>
          <SoftwareExplanation />
          <h2 className={heading}>1. A free introductory call</h2>
          <p className={paragraph}>About 30 minutes with Ivan to discuss how your business runs, the software you use and where work gets held up. We decide whether a paid diagnostic is a useful next step and agree its scope and fee before starting.</p>
          <div className="mt-7"><CallButton tone="atlantic">Discuss your diagnostic</CallButton></div>
          <h2 className={heading}>2. The paid diagnostic</h2>
          <p className={paragraph}>We review your workflows with you, using real examples to understand where time goes, what information the work needs and what your existing software supports.</p>
          <ul className="mt-5 max-w-[65ch] list-disc space-y-3 pl-6 text-[1.0625rem] leading-relaxed text-mute">
            <li><strong className="text-ink">Workflow review</strong> – trace the repeated work, handovers and bottlenecks.</li>
            <li><strong className="text-ink">AI opportunities</strong> – assess what could help, the requirements and the constraints.</li>
            <li><strong className="text-ink">Prioritised roadmap</strong> – decide what is worth tackling first and what needs to be in place.</li>
          </ul>
          <p className={paragraph}>The diagnostic gives you a basis for deciding what to do next. Any implementation is agreed afterwards.</p>
          <h2 className={heading}>3. Agree the AI partnership</h2>
          <p className={paragraph}>After the diagnostic, we review the roadmap together and agree the scope and rate for the ongoing AI partnership. That includes the implementation priorities, delivery plan, training and support. Any software subscriptions or other third-party costs are discussed as part of the scope.</p>
          <h2 className={heading}>4. Implementation, training and support</h2>
          <p className={paragraph}>I work with you on the agreed priorities: build and test workflows, help your team use them on real work, and support and improve them within our agreed scope. We review how they are working before deciding what to tackle next.</p>
          <p className={paragraph}>Your team keeps control of important decisions. For a quoting workflow, you supply the job information, quantities and prices, then review and approve the draft before it is sent.</p>
          <p className="mt-6"><Link className="font-semibold text-atlantic underline underline-offset-4" href="/ai-quoting-for-electricians/">Explore quoting as one possible workflow →</Link></p>
          <h2 className={heading}>What to bring</h2>
          <p className={paragraph}>Start with a recent example of work that gets held up. Before the diagnostic, we agree which workflows, records and people to include. You do not need to be technical.</p>
          <h2 className={heading}>Tell me where work is getting stuck.</h2>
          <p className={paragraph}>Book a free introductory call to discuss the paid diagnostic and whether it is right for your business.</p>
          <div className="mt-7"><CallButton tone="atlantic" /></div>
          <p className="mt-3 text-sm text-mute">{callPromise}</p>
        </article>
      </main>
    </>
  );
}
