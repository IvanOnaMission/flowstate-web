import type { Metadata } from "next";
import CalendlyButton from "@/components/CalendlyButton";
import FlowField from "@/components/FlowField";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Two people out of the trades, not out of a software company. Four years on the tools and eight years running a systemised electrical business between us.",
  alternates: { canonical: "/about/" },
};

const PEOPLE = [
  {
    n: "01",
    role: "Founder",
    name: "Ivan",
    paras: [
      "I spent four years in the trades working out what business I wanted to go into. Then I came across AI, saw first hand what it could do, and it clicked. Trade business owners have no time, and this was the thing that could give it back to them.",
      "I'm young, I work hard, and I'm turning running my own business from something I wanted into something I'm doing. If I get something wrong along the way I'll learn from it quickly and I'll make it right with you.",
    ],
  },
  {
    n: "02",
    role: "Strategy",
    name: "Jordan",
    paras: [
      "Eight years running his own electrical business. His actual thing is systems — building trade businesses that run efficiently without the owner having to touch everything.",
      "He's found and fixed the leaks in his own operation, so he knows where the time and the money go in yours. He brings the business strategy and the trades know-how.",
    ],
  },
];

export default function About() {
  return (
    <>
      <section className="relative overflow-hidden bg-paper">
        <FlowField
          className="pointer-events-none absolute inset-y-0 right-0 h-full w-[60%] opacity-60"
          maxAlpha={0.22}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,var(--fs-paper)_34%,transparent_78%)]" />
        <div className="fs-shell relative pt-20 pb-24 md:pt-28 md:pb-28">
          <Reveal>
            <span className="fs-label">About</span>
            <h1 className="fs-display mt-7 max-w-[15ch] text-[clamp(2.5rem,7vw,5rem)] text-ink">
              Two people. One job: get your time back.
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="fs-shell fs-prose grid gap-12 border-t border-line py-20 md:grid-cols-2 md:gap-20">
        <Reveal>
          <span className="fs-label">Where we come from</span>
          <p className="mt-5 text-[1.0625rem] text-ink">
            Out of the trades, not out of a software company. Four years on the
            tools and eight years running a systemised electrical business
            between us. We know which problems are worth fixing and which ones
            you can live with.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <span className="fs-label">Why it exists</span>
          <p className="mt-5 text-[1.0625rem] text-ink">
            Most owners <em>are</em> the business. If they stop, it stops. We
            build the systems that let it run without them — so they get their
            time back, and end up with something that&apos;s actually worth
            selling.
          </p>
        </Reveal>
      </section>

      <section className="fs-shell py-16 md:py-24">
        <Reveal>
          <span className="fs-label">Who you&apos;d be working with</span>
        </Reveal>
        <div className="mt-12 space-y-px">
          {PEOPLE.map((p, i) => (
            <Reveal key={p.n} delay={i * 120}>
              <div className="grid gap-6 border-t border-line py-12 md:grid-cols-[10rem_1fr] md:gap-14">
                <div className="flex items-baseline gap-4 md:flex-col md:gap-2">
                  <span className="fs-display text-[2.75rem] leading-none text-line-strong">
                    {p.n}
                  </span>
                  <span className="fs-label">{p.role}</span>
                </div>
                <div className="fs-prose">
                  <h2 className="fs-display text-[clamp(1.75rem,3.4vw,2.5rem)] text-ink">
                    {p.name}
                  </h2>
                  <div className="mt-5 space-y-4">
                    {p.paras.map((t) => (
                      <p key={t.slice(0, 24)} className="text-[1.0625rem] text-mute">
                        {t}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-mist">
        <div className="fs-shell fs-prose py-20 md:py-24">
          <Reveal>
            <span className="fs-label">How we met</span>
            <h2 className="fs-display mt-6 max-w-[18ch] text-[clamp(1.875rem,4.2vw,3rem)] text-ink">
              Through some genuinely terrible cold emails.
            </h2>
            <p className="mt-6 text-[1.0625rem] text-mute">
              The kind Ivan was firing out trying to land his first clients. They
              were bad — Jordan told him so. But one of those conversations
              turned into something real, and we&apos;ve been building together
              since.
            </p>
            <p className="mt-4 text-[1.0625rem] text-ink">
              You get the strategy and the build from people who have actually
              run the work, not a consultant who has never done it.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="fs-shell py-24 text-center md:py-28">
        <Reveal>
          <span className="fs-label">Free · 30 minutes · no pitch deck</span>
          <h2 className="fs-display mx-auto mt-6 max-w-[18ch] text-[clamp(2rem,5vw,3.5rem)] text-ink">
            Want to see where the time&apos;s leaking?
          </h2>
          <div className="mt-10">
            <CalendlyButton className="inline-flex items-center justify-center rounded-full bg-ember px-8 py-4 font-sans text-[0.9375rem] font-medium text-white transition-all duration-300 [transition-timing-function:var(--fs-ease)] hover:-translate-y-0.5 hover:bg-ember-deep hover:shadow-[0_12px_28px_-10px_rgba(194,65,12,.6)]">
              Book a call
            </CalendlyButton>
          </div>
        </Reveal>
      </section>
    </>
  );
}
