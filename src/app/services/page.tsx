import SoftwareExplanation from "@/components/SoftwareExplanation";
import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";

export const metadata: Metadata = {
  alternates: { canonical: "/services/" },
  openGraph: { url: "/services/", images: ["/assets/hero/workshop-hook.jpg"] },
  title: "How the diagnostic and AI partnership work",
  description: "How Flowstate works: a free call, then a paid workflow diagnostic and prioritised roadmap. The ongoing AI partner scope and rate are agreed after the diagnostic.",
};

export default function Page() {
  return (
    <>
      <SiteNav />
      <main id="main" className="shell py-[clamp(3rem,6vw,5rem)]">
        <article className="max-w-[52rem]">
          <p className="eyebrow mb-5 text-atlantic">{"How it works"}</p>
          <h1 className="h-hero max-w-[24ch] text-ink">{"Start with the work that's getting held up."}</h1>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Flowstate builds and configures AI around your team’s processes, business knowledge and existing tools. That helps reduce repetitive work, bring information together and keep work moving between people and systems."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Flowstate starts by finding where AI could make the biggest difference, whether you work in industrial, commercial or residential electrical."}</p>
          <SoftwareExplanation />
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"1. Book a call"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Fill in a short form and pick a time for a call with Flowstate."}</p>
          <div className="mt-7"><CallButton tone="atlantic" /></div>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"2. A 30-minute discovery call"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"You and Ivan from Flowstate talk about your business, how you quote and the software you use, and whether a paid diagnostic is the right next step."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"3. The paid diagnostic"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"You and Flowstate agree the diagnostic scope and fee before starting. Then Flowstate reviews your workflows, business information and existing software to identify where AI could help. You get a prioritised roadmap for what to tackle first."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"4. Your ongoing AI partner"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"After the diagnostic, you and Flowstate agree the scope and rate for an ongoing AI partnership. I work with you on the priorities from your roadmap, with implementation, training and support agreed for your business."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Implementation can include building and testing workflows around your existing tools, helping your team use them on real work, and improving them within the agreed scope."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"For a quoting workflow, AI helps prepare the drafts. You check the scope, quantities and prices, and approve the final quote before it is sent."}</p>
          <p className="mt-6"><a className="font-semibold text-atlantic underline underline-offset-4" href="/workflow-diagnostic/">{"Explore the diagnostic and AI partnership →"}</a></p>
          <p className="mt-6"><Link className="font-semibold text-atlantic underline underline-offset-4" href="/ai-quoting-for-electricians/">{"Explore the quoting workflow →"}</Link></p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"5. Ongoing support"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"You and Flowstate agree what support is included in the AI partnership, review how the work is going and decide together what to tackle next from your roadmap."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"What you'll need to bring"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Have a few recent examples ready. Before the diagnostic, you and Flowstate agree which workflows, records and people to include. You don't need to be technical. If you can send a text, you can use it."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Tell me where work is getting stuck."}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Book a free discovery call with Flowstate to discuss whether the paid diagnostic is right for your business before you commit."}</p>
          <div className="mt-7"><CallButton tone="atlantic" /></div>
          <p className="mt-3 text-sm text-mute">{"Free · about 30 minutes · no pitch deck"}</p>
        </article>
      </main>
    </>
  );
}
