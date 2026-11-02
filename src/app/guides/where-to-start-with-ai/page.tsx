import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
 title: "Where an electrical business starts with AI",
 description: "Start by freeing up the owner's time. Define a repetitive task, brief AI like an employee, then test and improve a reusable workflow.",
 alternates: { canonical: "/guides/where-to-start-with-ai/" },
 openGraph: { url: "/guides/where-to-start-with-ai/", images: ["/assets/hero/workshop-hook.jpg"] },
};
export default function Page() {
 return <><SiteNav /><StructuredData data={{
 "@context": "https://schema.org", "@type": "BlogPosting",
 "@id": "https://flowstate.net.nz/guides/where-to-start-with-ai/#article",
 headline: "Where should an electrical business start with AI?",
 datePublished: "2026-09-09",
 author: { "@type": "Person", name: "Ivan Barnett", url: "https://flowstate.net.nz/about/" },
 publisher: { "@id": "https://flowstate.net.nz/#organization" },
 mainEntityOfPage: "https://flowstate.net.nz/guides/where-to-start-with-ai/",
 }} /><main id="main" className="shell py-[clamp(3rem,6vw,5rem)]"><article className="max-w-[52rem]">
<h1 className="h-hero max-w-[24ch] text-ink">{"Where should an electrical business start with AI?"}</h1><p className="mt-6 text-sm text-mute">By Ivan Barnett · 9 September 2026</p>
<p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-mute">{"Start with the owner. The goal is to free up your time for work that moves the business forward."}</p>
<p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-mute">{"Choose a repetitive task that keeps coming back to you. Then give AI the information and instructions you would give an employee taking it over."}</p>
<h2 className="mt-12 border-t border-hair pt-8 text-2xl font-bold text-ink">{"1. Pick one repeated task"}</h2>
<p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-mute">{"What do you keep doing yourself? Finding information, preparing a document, checking job notes or answering the same questions?"}</p>
<p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-mute">{"Choose something that takes meaningful time and has a result you can check. This applies to industrial, commercial and residential electrical businesses."}</p>
<h2 className="mt-12 border-t border-hair pt-8 text-2xl font-bold text-ink">{"2. Define the job"}</h2>
<p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-mute">{"Write down four things:"}</p>
<ul className="mt-5 space-y-3 text-lg leading-relaxed text-mute"><li><strong>{"Process:"}</strong>{" What work needs doing?"}</li><li><strong>{"Trigger:"}</strong>{" What starts it—an email, a completed job or your instruction?"}</li><li><strong>{"End goal:"}</strong>{" What should be finished?"}</li><li><strong>{"Good outcome:"}</strong>{" What must the result contain, and how will you know it is right?"}</li></ul>
<p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-mute">{"For example: when job notes arrive, prepare a draft handover using your template. Include the work completed and outstanding items, flag missing details and leave it for review."}</p>
<h2 className="mt-12 border-t border-hair pt-8 text-2xl font-bold text-ink">{"3. Brief it like an employee"}</h2>
<p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-mute">{"If someone started this job tomorrow, what would you give them?"}</p>
<p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-mute">{"Gather the relevant instructions, business knowledge, templates and a good example. Explain where the information comes from, which version to use and what decisions need to come back to you. Start with sample or redacted records while testing."}</p>
<h2 className="mt-12 border-t border-hair pt-8 text-2xl font-bold text-ink">{"4. Ask AI to help build the workflow"}</h2>
<p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-mute">{"Use an AI tool suited to doing the work, such as ChatGPT Work, Claude Cowork, Codex or Claude Code. Which one fits depends on the task and the files, tools and access it needs."}</p>
<p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-mute">{"Give it the brief and supporting information. Ask:"}</p>
<blockquote className="mt-6 rounded-2xl border-l-4 border-atlantic bg-sky/30 p-6 text-lg leading-relaxed text-ink">{"Help me turn this into a repeatable workflow. Ask me any questions you need answered before starting. Flag missing information instead of guessing. Produce a first draft for me to check."}</blockquote>
<p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-mute">{"Ask it to explain any missing software access or setup. Describing a trigger does not connect it automatically."}</p>
<h2 className="mt-12 border-t border-hair pt-8 text-2xl font-bold text-ink">{"5. Test, correct and try again"}</h2>
<p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-mute">{"Check the output against your example and definition of a good result. Be specific about what needs fixing: a missing detail, the wrong source, an unclear instruction or the format."}</p>
<p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-mute">{"Don't give up after one poor answer. Explain the problem, update the instructions and test again on a different example. Include a case with missing information."}</p>
<p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-mute">{"Think of briefing a new employee: feedback helps when it becomes part of how the job is done. Save corrections in the workflow's instructions; AI does not necessarily remember or learn them automatically."}</p>
<p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-mute">{"If the same error keeps returning, narrow the task or change the approach. The aim is a dependable result, not endless retries."}</p>
<h2 className="mt-12 border-t border-hair pt-8 text-2xl font-bold text-ink">{"6. Save it and hand over more gradually"}</h2>
<p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-mute">{"Ask the AI to save the tested instructions, templates and checks as a reusable skill or workflow, where supported. Run it again yourself before connecting an automatic trigger."}</p>
<p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-mute">{"Keep review in place while you build confidence. Measure the time spent checking and correcting as well as producing the output. Expand as the workflow proves useful."}</p>
<h2 className="mt-12 border-t border-hair pt-8 text-2xl font-bold text-ink">{"Think beyond the obvious"}</h2>
<p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-mute">{"Don't stop at emails and quotes. Look at research, tender preparation, project handovers, finding business knowledge and understanding job margins."}</p>
<p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-mute">{"AI can help with a wide range of business processes. Ask what would be needed to make your idea work, then test a manageable first step. Your tools, information and the decisions involved determine how much you can hand over."}</p>
<h2 className="mt-12 border-t border-hair pt-8 text-2xl font-bold text-ink">{"Want help getting started?"}</h2>
<p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-mute">{"Flowstate helps identify where AI could make the biggest difference, then builds and tests workflows around your processes, knowledge and existing software."}</p>
<div className="mt-7 flex flex-wrap items-center gap-6"><a className="font-semibold text-atlantic underline underline-offset-4" href="/workflow-diagnostic/">Explore the diagnostic and AI partnership</a><CallButton tone="atlantic" /></div>
</article></main></>;
}
