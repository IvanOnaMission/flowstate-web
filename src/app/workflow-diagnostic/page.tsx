import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";

export const metadata: Metadata = {
  alternates: { canonical: "/workflow-diagnostic/" },
  openGraph: { url: "/workflow-diagnostic/", images: ["/assets/hero/workshop-hook.jpg"] },
  title: "AI opportunity diagnostic for your business",
  description: "Identify where AI could make the biggest difference in your business. Prioritise opportunities by pain, potential return and practicality.",
};

export default function Page() {
  return (
    <>
      <SiteNav />
      <main id="main" className="shell py-[clamp(3rem,6vw,5rem)]">
        <article className="max-w-[52rem]">
          <p className="eyebrow mb-5 text-atlantic">{"Paid workflow diagnostic"}</p>
          <h1 className="h-hero max-w-[24ch] text-ink">{"Find where AI could make the biggest difference in your business."}</h1>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"We examine how your business runs, where work gets held up and what takes more time or effort than it should. The diagnostic identifies and prioritises opportunities based on the pain involved, potential return and how practical they are to implement."}</p>
          <div className="mt-7"><CallButton tone="atlantic" /></div>
          <p className="mt-3 text-sm text-mute">{"Start with a free discovery call of about 30 minutes."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">Where should you start?</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Quoting and sales are possible starting points we are exploring, not the limits of what Flowstate does. The diagnostic starts with your business and its pain points, rather than a predetermined workflow."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"From there, we agree on a useful first implementation, test it in practice and use what we learn to decide what comes next."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"What you receive"}</h2>
          <ul className="mt-5 max-w-[65ch] list-disc space-y-3 pl-6 text-[1.0625rem] leading-relaxed text-mute"><li>{"A picture of how work moves through your business and where it gets held up."}</li><li>{"Findings on the delays, repeated work and information gaps we identify."}</li><li>{"The business information and system requirements for the AI foundation."}</li><li>{"Opportunities prioritised by pain, potential return and practicality, with a recommendation for the first implementation."}</li><li>{"Later opportunities to consider."}</li><li>{"A discussion of the findings and next steps."}</li></ul>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"What to prepare"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Bring examples of work that gets held up, explain the tools you use and show how work moves between people and systems. We'll agree what further information or access is needed for the diagnostic."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"What happens afterwards"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"We use the findings to discuss whether an implementation is worth pursuing and what its scope should be. Implementation is agreed separately. We test the first implementation in practice and use what we learn to decide what comes next."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Scope and price are agreed first."}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"The fee, timing and investigation scope are confirmed before you commit. Start with a free call to discuss where work gets held up and whether a diagnostic would help."}</p>
          <div className="mt-7"><CallButton tone="atlantic" /></div>
        </article>
      </main>
    </>
  );
}
