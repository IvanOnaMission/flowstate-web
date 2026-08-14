import { Btn } from "@/components/Button";
import CalendlyButton from "@/components/CalendlyButton";
import FlowField from "@/components/FlowField";
import Reveal from "@/components/Reveal";

const STEPS = [
  {
    n: "01",
    when: "Week one",
    title: "We find where the hours actually go",
    body: "Not a questionnaire. I go through how the work really moves — job in, quote out, money in — and mark every place something gets done twice. You get it back written down, with the time and the money attached to each one.",
  },
  {
    n: "02",
    when: "Week two",
    title: "Your business gets written down",
    body: "Pricing, process, tone. In one place, in plain language, in a format an AI can actually read. This is the step everyone skips and the reason most people's AI gives them useless answers.",
  },
  {
    n: "03",
    when: "Week three",
    title: "One automation goes live and stays live",
    body: "Running in your business, on the tools you already use, before I leave. Then you and the crew get shown how it works, so it keeps running once I'm gone.",
  },
];

const INCLUDED = [
  ["Audit", "Every process mapped, with the leaks named and costed"],
  ["Brain", "Your business written down so any AI tool can use it"],
  ["Build", "One automation live in your business inside the three weeks"],
  ["Train", "You and your team shown how to run it without me"],
];

export default function Home() {
  return (
    <>
      {/* ── The statement ───────────────────────────────────── */}
      <section className="relative overflow-hidden bg-paper">
        <FlowField
          className="pointer-events-none absolute inset-y-0 right-0 h-full w-[72%] opacity-70"
          maxAlpha={0.26}
        />
        {/* Fades the current out before it reaches the headline. */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,var(--fs-paper)_28%,transparent_72%)]" />

        <div className="fs-shell relative pt-24 pb-28 md:pt-36 md:pb-36">
          <Reveal>
            <span className="fs-label">AI systems for NZ trade businesses</span>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="fs-display mt-8 max-w-[16ch] text-[clamp(2.75rem,8.2vw,6.25rem)] text-ink">
              The office side of the job should run{" "}
              <span className="text-atlantic">without you in the room.</span>
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <CalendlyButton className="inline-flex items-center justify-center rounded-full bg-ember px-8 py-4 font-sans text-[0.9375rem] font-medium text-white shadow-[0_1px_2px_rgba(11,27,38,.16)] transition-all duration-300 [transition-timing-function:var(--fs-ease)] hover:-translate-y-0.5 hover:bg-ember-deep hover:shadow-[0_12px_28px_-10px_rgba(194,65,12,.6)]">
                Book a call
              </CalendlyButton>
              <Btn href="#offer" tone="quiet">
                See the offer
              </Btn>
              <span className="fs-label ml-1">Free · 30 min · no pitch deck</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── What this is / who you are ──────────────────────── */}
      <section className="fs-shell fs-prose grid gap-12 border-t border-line py-20 md:grid-cols-2 md:gap-20 md:py-24">
        <Reveal>
          <span className="fs-label">What this is</span>
          <p className="mt-5 text-[1.0625rem] text-ink">
            Quotes, follow-ups, review chasing, the inbox. I build the systems
            that handle them, for trade businesses that have outgrown doing it at
            nine at night.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <span className="fs-label">Who you&apos;d be working with</span>
          <p className="mt-5 text-[1.0625rem] text-ink">
            Ivan Barnett. An electrical apprentice in Auckland, which means
            I&apos;ve stood at the switchboard as well as the spreadsheet. Two
            clients a month, so the work gets done properly rather than quickly.
          </p>
        </Reveal>
      </section>

      {/* ── The argument, on the deep field ─────────────────── */}
      <section className="relative overflow-hidden bg-atlantic-deep text-sky">
        <FlowField
          className="pointer-events-none absolute inset-0 h-full w-full opacity-50"
          stroke="196, 248, 255"
          maxAlpha={0.16}
          speed={0.004}
        />
        <div className="fs-shell relative py-24 md:py-32">
          <Reveal>
            <span className="fs-label text-sky/55">The part everyone skips</span>
            <h2 className="fs-display mt-6 max-w-[20ch] text-[clamp(2rem,4.6vw,3.5rem)] text-white">
              Most people wire AI into a task, then wonder why the answers are
              generic.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10 max-w-[62ch] space-y-5 text-[1.0625rem] leading-relaxed text-sky/85">
              <p>
                Because it doesn&apos;t know anything about you. Your business
                gets written down first — what you charge, how you quote, the way
                you talk to customers. Every automation built after that reads
                the same page.
              </p>
              <p className="text-white">
                That file is the thing you actually own at the end. The
                automations sit on top of it.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── The sequence ────────────────────────────────────── */}
      <section className="fs-shell py-24 md:py-32">
        <Reveal>
          <span className="fs-label">How it goes</span>
        </Reveal>

        <ol className="mt-14 space-y-px">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 110}>
              <div className="group grid gap-6 border-t border-line py-10 transition-colors duration-500 md:grid-cols-[10rem_1fr] md:gap-14">
                <div className="flex items-baseline gap-4 md:flex-col md:gap-2">
                  <span className="fs-display text-[2.75rem] leading-none text-line-strong transition-colors duration-500 group-hover:text-atlantic">
                    {s.n}
                  </span>
                  <span className="fs-label">{s.when}</span>
                </div>
                <div className="fs-prose">
                  <h3 className="fs-display text-[clamp(1.5rem,2.6vw,2rem)] text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-4 text-[1.0625rem] text-mute">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ── Proof. Only what can be checked. ────────────────── */}
      <section className="bg-mist">
        <div className="fs-shell py-24 md:py-28">
          <Reveal>
            <span className="fs-label">Proof</span>
          </Reveal>
          <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-20">
            <Reveal delay={80}>
              <div className="fs-display text-[clamp(3.5rem,8vw,5.5rem)] leading-none text-atlantic">
                478
              </div>
              <span className="fs-label mt-3 block">
                five-star Google reviews
              </span>
              <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-relaxed text-mute">
                The Conduction Company in Onehunga automated their own review
                chasing. Jordan built it himself over four months. Most owners
                don&apos;t have four months — that part is the job.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <blockquote className="fs-display border-l-2 border-ember pl-6 text-[clamp(1.5rem,3vw,2.125rem)] leading-[1.2] text-ink">
                &ldquo;These emails look like the 50 other spam emails I get every
                day.&rdquo;
              </blockquote>
              <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-relaxed text-mute">
                Jordan&apos;s reply to my first cold email. He was right. Fixing
                what he was pointing at is how the two of us ended up working
                together.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── The offer ───────────────────────────────────────── */}
      <section id="offer" className="fs-shell scroll-mt-24 py-24 md:py-32">
        <div className="grid gap-16 md:grid-cols-[1fr_1fr] md:gap-24">
          <div>
            <Reveal>
              <span className="fs-label">The offer</span>
              <h2 className="fs-display mt-6 text-[clamp(2.25rem,5vw,3.75rem)] text-ink">
                The 21-Day AI Head Start
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <div className="mt-10 flex flex-wrap items-baseline gap-4">
                <span className="fs-display text-[clamp(3rem,7vw,4.5rem)] leading-none text-atlantic">
                  $2,500
                </span>
                <span className="fs-display text-[1.75rem] text-mute line-through decoration-ember decoration-2">
                  $5,000
                </span>
              </div>
              <span className="fs-label mt-4 block">
                Founding rate · two places
              </span>
            </Reveal>

            <Reveal delay={200}>
              {/* The guarantee earns the one warm rule on the page. */}
              <div className="mt-10 border-l-2 border-ember bg-paper py-5 pr-6 pl-6">
                <span className="fs-label text-ember">The guarantee</span>
                <p className="mt-3 text-[1.0625rem] leading-relaxed font-medium text-ink">
                  If I don&apos;t find where you&apos;re leaking time and leave
                  you an automation that works, you don&apos;t pay.
                </p>
              </div>

              <div className="mt-10">
                <CalendlyButton className="inline-flex items-center justify-center rounded-full bg-ember px-8 py-4 font-sans text-[0.9375rem] font-medium text-white transition-all duration-300 [transition-timing-function:var(--fs-ease)] hover:-translate-y-0.5 hover:bg-ember-deep hover:shadow-[0_12px_28px_-10px_rgba(194,65,12,.6)]">
                  Book a call
                </CalendlyButton>
              </div>
            </Reveal>
          </div>

          <Reveal delay={140}>
            <dl className="space-y-px">
              {INCLUDED.map(([k, v]) => (
                <div
                  key={k}
                  className="grid gap-2 border-t border-line py-6 sm:grid-cols-[7rem_1fr] sm:gap-6"
                >
                  <dt className="fs-label text-atlantic">{k}</dt>
                  <dd className="text-[1.0625rem] leading-relaxed text-mute">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>
    </>
  );
}
