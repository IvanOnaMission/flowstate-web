import type { Metadata } from "next";
import { Btn } from "@/components/Button";
import CalendlyButton from "@/components/CalendlyButton";
import FlowField from "@/components/FlowField";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Audit, plan, build. Fixed scope, end to end. You always know what we're building and why, and you pick what we start with.",
  alternates: { canonical: "/services/" },
};

const PHASES = [
  {
    n: "01",
    kind: "Audit",
    title: "We learn the business inside out",
    body: "A deep-dive call. How jobs flow from quote to invoice. What slows you down. What software you use. What you'd fix first if you could. The more we understand, the sharper the plan.",
  },
  {
    n: "02",
    kind: "Plan",
    title: "You get it back, written down",
    body: "A walkthrough of what we found, where the biggest wins are, and what we'd build first — with the time and the money attached to each one. You pick what we start with. One clear plan.",
  },
  {
    n: "03",
    kind: "Build",
    title: "Foundations first, then the automation",
    body: "Think of it like onboarding a new team member. First everything the AI needs to know about your business, your jobs, your customers, the way you work. Once that's solid, the automations go on top and plug into your existing tools.",
  },
];

const NUMBERS = [
  ["Quoting", "Around 11 hours a week, before anything is automated"],
  ["Leads", "Roughly a third followed up inside the hour"],
  ["Owner", "Evenings on the laptop, after the day's work is done"],
];

export default function Services() {
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
            <span className="fs-label">How it works</span>
            <h1 className="fs-display mt-7 text-[clamp(2.75rem,8vw,6rem)] text-ink">
              Audit. Plan. <span className="text-atlantic">Build.</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="fs-shell fs-prose grid gap-12 border-t border-line py-20 md:grid-cols-2 md:gap-20">
        <Reveal>
          <span className="fs-label">The shape of it</span>
          <p className="mt-5 text-[1.0625rem] text-ink">
            Fixed scope, end to end. You always know what we&apos;re building and
            why, and you pick what we start with.
          </p>
          <div className="mt-8">
            <CalendlyButton className="inline-flex items-center justify-center rounded-full bg-ember px-7 py-3.5 font-sans text-[0.9375rem] font-medium text-white transition-all duration-300 [transition-timing-function:var(--fs-ease)] hover:-translate-y-0.5 hover:bg-ember-deep">
              Book a call
            </CalendlyButton>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <span className="fs-label">What you&apos;re left with</span>
          <p className="mt-5 text-[1.0625rem] text-ink">
            Not software. Your business written down in a form an AI can read,
            and one automation running on top of it — on the tools you already
            use.
          </p>
        </Reveal>
      </section>

      <section className="fs-shell py-16 md:py-24">
        <Reveal>
          <span className="fs-label">The process</span>
        </Reveal>
        <ol className="mt-12 space-y-px">
          {PHASES.map((p, i) => (
            <Reveal as="li" key={p.n} delay={i * 110}>
              <div className="group grid gap-6 border-t border-line py-10 md:grid-cols-[10rem_1fr] md:gap-14">
                <div className="flex items-baseline gap-4 md:flex-col md:gap-2">
                  <span className="fs-display text-[2.75rem] leading-none text-line-strong transition-colors duration-500 group-hover:text-atlantic">
                    {p.n}
                  </span>
                  <span className="fs-label">{p.kind}</span>
                </div>
                <div className="fs-prose">
                  <h2 className="fs-display text-[clamp(1.5rem,2.6vw,2rem)] text-ink">
                    {p.title}
                  </h2>
                  <p className="mt-4 text-[1.0625rem] text-mute">{p.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* The honest-numbers block. These are modelled, and it says so. */}
      <section className="relative overflow-hidden bg-atlantic-deep text-sky">
        <FlowField
          className="pointer-events-none absolute inset-0 h-full w-full opacity-45"
          stroke="196, 248, 255"
          maxAlpha={0.15}
          speed={0.004}
        />
        <div className="fs-shell relative py-24 md:py-28">
          <Reveal>
            <span className="fs-label text-sky/55">What it&apos;s worth</span>
            <h2 className="fs-display mt-6 max-w-[20ch] text-[clamp(2rem,4.6vw,3.5rem)] text-white">
              We don&apos;t sell software. We sell hours back.
            </h2>
            <p className="mt-7 max-w-[62ch] text-[1.0625rem] leading-relaxed text-sky/75">
              The figures below are modelled from trade-industry benchmarks for a
              four-person shop, not measured from a client. They get replaced
              with real numbers as builds ship and the hours are actually
              tracked.
            </p>
          </Reveal>

          <dl className="mt-12 space-y-px">
            {NUMBERS.map(([k, v], i) => (
              <Reveal key={k} delay={i * 100}>
                <div className="grid gap-2 border-t border-white/12 py-6 sm:grid-cols-[9rem_1fr] sm:gap-6">
                  <dt className="fs-label text-ember-lift">{k}</dt>
                  <dd className="text-[1.0625rem] text-sky/85">{v}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="fs-shell py-24 text-center md:py-28">
        <Reveal>
          <span className="fs-label">Free · 30 minutes · no pitch deck</span>
          <h2 className="fs-display mx-auto mt-6 max-w-[16ch] text-[clamp(2rem,5vw,3.5rem)] text-ink">
            Start with the audit.
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <CalendlyButton className="inline-flex items-center justify-center rounded-full bg-ember px-8 py-4 font-sans text-[0.9375rem] font-medium text-white transition-all duration-300 [transition-timing-function:var(--fs-ease)] hover:-translate-y-0.5 hover:bg-ember-deep hover:shadow-[0_12px_28px_-10px_rgba(194,65,12,.6)]">
              Book a call
            </CalendlyButton>
            <Btn href="/#offer" tone="quiet">
              See the offer
            </Btn>
          </div>
        </Reveal>
      </section>
    </>
  );
}
