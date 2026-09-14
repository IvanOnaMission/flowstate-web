import SoftwareExplanation from "@/components/SoftwareExplanation";
import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";

export const metadata: Metadata = {
  alternates: { canonical: "/services/" },
  openGraph: { url: "/services/", images: ["/assets/hero/workshop-hook.jpg"] },
  title: "How the 2-Day AI Makeover works",
  description: "Book a call, then the 2-Day AI Makeover at your business: AI set up properly, your quoting handed over, and ongoing support from Flowstate.",
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
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"1. Book a call"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Fill in a short form and pick a time that suits you."}</p>
          <div className="mt-7"><CallButton tone="atlantic" /></div>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"2. A 30-minute discovery call"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"We talk about your business, how you quote and the software you use. We check it will work with your software before you commit."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"3. The Makeover call"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"We walk through the 2-Day AI Makeover for your business and decide together whether it's the right fit."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"4. 2 days at your business"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"The 2-Day AI Makeover is done with you, 1:1, over two days at your business."}</p>
          <ul className="mt-5 max-w-[65ch] list-disc space-y-3 pl-6 text-[1.0625rem] leading-relaxed text-mute"><li><strong className="text-ink">{"Business Brain"}</strong>{" – AI learns how your business works."}</li><li><strong className="text-ink">{"Tool connections"}</strong>{" – your software, connected."}</li><li><strong className="text-ink">{"AI Gap Check"}</strong>{" – what AI does for you now vs what it could."}</li><li><strong className="text-ink">{"Quoting handed over"}</strong>{" – built on your real jobs."}</li><li><strong className="text-ink">{"Roadmap"}</strong>{" – what to hand over next."}</li><li><strong className="text-ink">{"Education and training"}</strong>{" – plain English, no tech speak."}</li></ul>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"AI prepares the drafts. You make the final call on pricing."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"No-Regrets Guarantee: not happy within 30 days? Full refund. You keep everything."}</p>
          <p className="mt-6"><a className="font-semibold text-atlantic underline underline-offset-4" href="/ai-makeover/">{"See the 2-Day AI Makeover →"}</a></p>
          <p className="mt-6"><Link className="font-semibold text-atlantic underline underline-offset-4" href="/ai-quoting-for-electricians/">{"Explore the quoting workflow →"}</Link></p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"5. Ongoing support"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Ask Ivan questions any time, plus quarterly check-ins. If you want more handed over, we pick the next job from your roadmap."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"What you'll need to bring"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Set aside 2 days and have a few recent quotes ready. You don't need to be technical. If you can send a text, you can use it."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Tell me where work is getting stuck."}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Book a free discovery call. We'll check the 2-Day AI Makeover fits your business and your software before you commit."}</p>
          <div className="mt-7"><CallButton tone="atlantic" /></div>
          <p className="mt-3 text-sm text-mute">{"Free · about 30 minutes · no pitch deck"}</p>
        </article>
      </main>
    </>
  );
}
