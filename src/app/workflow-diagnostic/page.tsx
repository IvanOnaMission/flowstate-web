import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";

export const metadata: Metadata = {
  title: "Quoting and sales workflow diagnostic",
  description: "A paid assessment of one business area: quoting and estimating, or sales. Get a workflow map, findings and a recommendation for your first AI implementation.",
};

export default function Page() {
  return (
    <>
      <SiteNav />
      <main id="main" className="shell py-[clamp(3rem,6vw,5rem)]">
        <article className="max-w-[52rem]">
          <p className="eyebrow mb-5 text-atlantic">{"Paid workflow diagnostic"}</p>
          <h1 className="h-hero max-w-[24ch] text-ink">{"Work out what to improve before you build."}</h1>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"A workflow diagnostic examines one agreed area of your business: quoting and estimating, or sales. We map how the work happens today and identify what an AI implementation would need to be useful."}</p>
          <div className="mt-7"><CallButton tone="atlantic" /></div>
          <p className="mt-3 text-sm text-mute">{"Start with a free discovery call of about 30 minutes."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Choose the area"}</h2>
          <h3 className="mt-8 text-xl font-bold text-ink">{"Quoting and estimating"}</h3>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"How job information is gathered, estimates are prepared, quotes are drafted, reviewed and sent, follow-up is handled, and accepted work is handed over."}</p>
          <h3 className="mt-8 text-xl font-bold text-ink">{"Sales"}</h3>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"How enquiries arrive, how you decide which opportunities to pursue, how follow-up works, and how opportunities become booked work."}</p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"If both areas need assessment, we agree a combined scope, fee and timeframe before starting, accounting for the work they share."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"What you receive"}</h2>
          <ul className="mt-5 max-w-[65ch] list-disc space-y-3 pl-6 text-[1.0625rem] leading-relaxed text-mute"><li>{"A map of the workflow in the agreed area."}</li><li>{"Findings on the delays, repeated work and information gaps we identify."}</li><li>{"The business information and system requirements for the AI foundation."}</li><li>{"A prioritised recommendation for the first implementation."}</li><li>{"Later opportunities to consider."}</li><li>{"A discussion of the findings and next steps."}</li></ul>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"What to prepare"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Bring a recent example from the area we're assessing, explain the tools you use and show how the work moves between people and systems. We'll agree what further information or access is needed for the diagnostic."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"What happens afterwards"}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"We use the findings to discuss whether an implementation is worth pursuing and what its scope should be. The diagnostic does not include building every workflow or auditing the whole business. Implementation is agreed separately."}</p>
          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{"Scope and price are agreed first."}</h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"The fee, timing and investigation scope are confirmed before you commit. Start with a free call to decide which area would be most useful to assess."}</p>
          <div className="mt-7"><CallButton tone="atlantic" /></div>
        </article>
      </main>
    </>
  );
}
