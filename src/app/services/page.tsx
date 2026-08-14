import type { Metadata } from "next";
import { Btn } from "@/components/Button";
import CalendlyButton from "@/components/CalendlyButton";
import FlowField from "@/components/FlowField";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Work out which rung you're on, then climb one. We learn the business, write it down, and build on top of it. You pick what we start with.",
  alternates: { canonical: "/services/" },
};

const PHASES = [
  {
    n: "01",
    kind: "The call",
    title: "I work out where you actually are",
    body: "How jobs move. Quote out, work done, money in. What you're doing at nine at night that nobody's paying you for. What software you're already stuck with. Fifteen minutes tells me which rung you're on.",
  },
  {
    n: "02",
    kind: "The plan",
    title: "You get it back, written down",
    body: "Where the hours are going, which of them a machine could take, and what the next rung costs. Time and money against each one. You pick what we start with. If nothing on the list is worth it, I'll tell you that instead.",
  },
  {
    n: "03",
    kind: "The build",
    title: "Train it first, automate second",
    body: "Same as putting on an apprentice. Everything about your business goes in first — your jobs, your customers, your pricing, the way you talk to people. Only once that's solid does anything run on its own, on the tools you already use.",
  },
];

const RUNG_SIGNS = [
  [
    "01",
    "Apprentice",
    "Nothing about how you work is written down. It lives in your head and on your phone. Every AI tool you've tried gave you rubbish, because you gave it nothing.",
  ],
  [
    "02",
    "Qualified",
    "The process is out of your head and into something a machine can read. It sorts what comes in and tells you what matters. You're still checking its work, and you should be.",
  ],
  [
    "03",
    "Foreman",
    "The quote that went quiet gets chased without you asking. Jobs keep moving. You find out what needs you before it turns into a problem.",
  ],
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
            <h1 className="fs-display mt-7 max-w-[14ch] text-[clamp(2.75rem,8vw,6rem)] text-ink">
              Which rung are you{" "}
              <span className="text-atlantic">on?</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="fs-shell fs-prose grid gap-12 border-t border-line py-20 md:grid-cols-2 md:gap-20">
        <Reveal>
          <span className="fs-label">The whole job</span>
          <p className="mt-5 text-[1.0625rem] text-ink">
            Find out which rung you&apos;re on, then climb one. That&apos;s it.
            You always know what we&apos;re building and why, and you pick what
            we start with.
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
            Not software. Your business written down in a form a machine can
            read — and something running on top of it that knows how you work.
            The written-down part is yours whatever happens next.
          </p>
        </Reveal>
      </section>

      <section className="fs-shell py-16 md:py-24">
        <Reveal>
          <span className="fs-label">How we get there</span>
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

      {/* The rung diagnostic. Replaced the modelled ROI numbers — those were
          guesses and are deleted for good. The next numbers on this site get
          measured off a real client. */}
      <section className="relative overflow-hidden bg-atlantic-deep text-sky">
        <FlowField
          className="pointer-events-none absolute inset-0 h-full w-full opacity-45"
          stroke="196, 248, 255"
          maxAlpha={0.15}
          speed={0.004}
        />
        <div className="fs-shell relative py-24 md:py-28">
          <Reveal>
            <span className="fs-label text-sky/55">Where you are now</span>
            <h2 className="fs-display mt-6 max-w-[20ch] text-[clamp(2rem,4.6vw,3.5rem)] text-white">
              Most shops are on rung zero.
            </h2>
            <p className="mt-7 max-w-[62ch] text-[1.0625rem] leading-relaxed text-sky/75">
              Not because they&apos;re behind. Because nobody ever asked them to
              write down how they work. Read these and you&apos;ll know which one
              is you before we even talk.
            </p>
          </Reveal>

          <dl className="mt-12 space-y-px">
            {RUNG_SIGNS.map(([n, rung, body], i) => (
              <Reveal key={n} delay={i * 100}>
                <div className="grid gap-3 border-t border-white/12 py-7 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <dt className="flex items-baseline gap-3">
                    <span className="fs-display text-[1.75rem] leading-none text-sky/35">
                      {n}
                    </span>
                    <span className="fs-label text-ember-lift">{rung}</span>
                  </dt>
                  <dd className="max-w-[56ch] text-[1.0625rem] leading-relaxed text-sky/85">
                    {body}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>

          <Reveal delay={340}>
            <p className="mt-10 max-w-[46ch] text-[1.0625rem] leading-relaxed text-white">
              {site.callMinutes} minutes tells you which one you&apos;re on and
              what the next one is worth.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="fs-shell py-24 text-center md:py-28">
        <Reveal>
          <span className="fs-label">
            Free · {site.callMinutes} minutes · no pitch deck
          </span>
          <h2 className="fs-display mx-auto mt-6 max-w-[16ch] text-[clamp(2rem,5vw,3.5rem)] text-ink">
            Find out where you stand.
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <CalendlyButton className="inline-flex items-center justify-center rounded-full bg-ember px-8 py-4 font-sans text-[0.9375rem] font-medium text-white transition-all duration-300 [transition-timing-function:var(--fs-ease)] hover:-translate-y-0.5 hover:bg-ember-deep hover:shadow-[0_12px_28px_-10px_rgba(194,65,12,.6)]">
              Book a call
            </CalendlyButton>
            <Btn href="/#ladder" tone="quiet">
              The three rungs
            </Btn>
          </div>
        </Reveal>
      </section>
    </>
  );
}
