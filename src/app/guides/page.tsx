import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";

export const metadata: Metadata = {
  alternates: { canonical: "/guides/" },
  openGraph: { url: "/guides/", images: ["/assets/hero/workshop-hook.jpg"] },
  title: "Practical AI guides for electrical businesses",
  description: "Plain-language guides to AI implementation for electrical businesses, starting with quote preparation, business information and owner review.",
};

export default function Page() {
  return (
    <>
      <SiteNav />
      <main id="main" className="shell py-[clamp(3rem,6vw,5rem)]">
        <article className="max-w-[52rem]">
          <h1 className="h-hero max-w-[24ch] text-ink">{"Practical AI guides for electrical business owners"}</h1>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Understand where AI could fit into your business, what information it needs and what you should still check yourself."}</p>
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
