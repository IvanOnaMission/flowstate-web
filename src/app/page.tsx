import { Btn } from "@/components/Button";
import CalendlyButton from "@/components/CalendlyButton";
import FlowField from "@/components/FlowField";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

// Set this to the file path once the founder video is filmed. Until then the
// page renders the written version in its place — see THE VIDEO section.
const FOUNDER_VIDEO: string | null = null;

const RUNGS = [
  {
    n: "01",
    rung: "Apprentice",
    title: "You train it",
    body: "Everything about how you work goes in. Your pricing, your process, the way you talk to a customer. It isn't useful yet. Neither was your first apprentice. This is the part everyone skips, and it's exactly why their AI gives them rubbish.",
  },
  {
    n: "02",
    rung: "Qualified",
    title: "It starts pulling its weight",
    body: "The day-to-day, done properly. It sorts what comes in, tells you what actually matters, and takes on the stuff you've been doing at nine at night. You still check its work. It's earning its keep.",
  },
  {
    n: "03",
    rung: "Foreman",
    title: "It runs the day",
    body: "Chases the quote that went quiet. Keeps jobs moving. Flags what needs you before it turns into a problem. You stop being the thing everything waits on.",
  },
];

const FIFTEEN = [
  ["You talk", "How the work moves. Job in, quote out, money in. I mostly listen."],
  ["I point", "Where your hours are going, and which of them a machine could take."],
  ["You decide", "Which rung you're on and whether the next one is worth it. If it isn't, I'll say so."],
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
            <h1 className="fs-display mt-8 max-w-[17ch] text-[clamp(2.75rem,8.2vw,6.25rem)] text-ink">
              You can&apos;t hire your way out of this.{" "}
              <span className="text-atlantic">
                So train something that doesn&apos;t leave.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <CalendlyButton className="inline-flex items-center justify-center rounded-full bg-ember px-8 py-4 font-sans text-[0.9375rem] font-medium text-white shadow-[0_1px_2px_rgba(11,27,38,.16)] transition-all duration-300 [transition-timing-function:var(--fs-ease)] hover:-translate-y-0.5 hover:bg-ember-deep hover:shadow-[0_12px_28px_-10px_rgba(194,65,12,.6)]">
                Book a call
              </CalendlyButton>
              <Btn href="#ladder" tone="quiet">
                See how it works
              </Btn>
              <span className="fs-label ml-1">
                Free · {site.callMinutes} min · no pitch deck
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── The argument. This is the whole pitch in six lines. ─ */}
      <section className="fs-shell fs-prose border-t border-line py-20 md:py-24">
        <Reveal>
          <span className="fs-label">Why this one is different</span>
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-8 max-w-[58ch] space-y-5 text-[1.125rem] leading-relaxed text-ink">
            <p>
              Every good tradie you&apos;ve ever hired started out useless. You
              showed them how you quote. How you talk to a customer. What good
              looks like on site. A year later they were worth every cent.
            </p>
            <p>Then they left, and you started again.</p>
            <p className="font-medium">
              AI is the same deal with one difference. You train it once. It
              doesn&apos;t get poached, doesn&apos;t call in sick, and
              doesn&apos;t take everything it learned down the road to a
              competitor.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── The ladder ──────────────────────────────────────── */}
      <section id="ladder" className="fs-shell scroll-mt-24 py-20 md:py-28">
        <Reveal>
          <span className="fs-label">The ladder</span>
          <h2 className="fs-display mt-6 max-w-[22ch] text-[clamp(2rem,4.6vw,3.25rem)] text-ink">
            It climbs the same ladder everyone in your business climbed.
          </h2>
        </Reveal>

        <ol className="mt-14 space-y-px">
          {RUNGS.map((r, i) => (
            <Reveal as="li" key={r.n} delay={i * 110}>
              <div className="group grid gap-6 border-t border-line py-10 transition-colors duration-500 md:grid-cols-[10rem_1fr] md:gap-14">
                <div className="flex items-baseline gap-4 md:flex-col md:gap-2">
                  <span className="fs-display text-[2.75rem] leading-none text-line-strong transition-colors duration-500 group-hover:text-atlantic">
                    {r.n}
                  </span>
                  <span className="fs-label">{r.rung}</span>
                </div>
                <div className="fs-prose">
                  <h3 className="fs-display text-[clamp(1.5rem,2.6vw,2rem)] text-ink">
                    {r.title}
                  </h3>
                  <p className="mt-4 text-[1.0625rem] text-mute">{r.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>

        {/* Says out loud where the ladder actually stops today. Keeping this
            honest is the point — rung 03 is the roadmap, not the promise. */}
        <Reveal delay={340}>
          <p className="mt-12 max-w-[58ch] border-l-2 border-line-strong pl-6 text-[1.0625rem] leading-relaxed text-mute">
            Most shops start at 01 and get to 02 quickly. How far past that you
            go depends on your business, and I&apos;d rather look at it than
            guess.
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
              Nobody hands a first-year the keys to the van on day one.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10 max-w-[62ch] space-y-5 text-[1.0625rem] leading-relaxed text-sky/85">
              <p>
                But that&apos;s what people do with AI. They point it at a job
                it knows nothing about and then decide the whole thing is
                overhyped when the answers come back generic.
              </p>
              <p>
                So we do the training first. What you charge, how you quote, the
                way you talk to customers — written down properly, in one place,
                in a form a machine can actually read.
              </p>
              <p className="text-white">
                That file is the thing you own at the end. Every automation
                after it reads the same page.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── THE VIDEO. Written fallback until it's filmed. ───── */}
      <section className="bg-mist">
        <div className="fs-shell py-24 md:py-28">
          <Reveal>
            <span className="fs-label">Who you&apos;d be working with</span>
          </Reveal>

          {FOUNDER_VIDEO ? (
            <Reveal delay={100}>
              <video
                className="mt-10 w-full max-w-[52rem] rounded-2xl border border-line"
                src={FOUNDER_VIDEO}
                controls
                playsInline
                preload="metadata"
              />
            </Reveal>
          ) : (
            <Reveal delay={100}>
              <div className="mt-10 grid gap-12 md:grid-cols-[1.15fr_1fr] md:gap-20">
                <div className="fs-prose max-w-[54ch] space-y-5 text-[1.0625rem] leading-relaxed text-ink">
                  <p>
                    Ivan Barnett. I spent four years in the trades in Auckland
                    working out what I wanted to do, then found AI and it
                    clicked. Trade owners have no time. This is the thing that
                    gives it back.
                  </p>
                  <p>
                    I&apos;m early and I&apos;m not going to pretend otherwise.
                    The numbers that would prove this properly are a few weeks
                    away, not a few years. So I&apos;m not going to show you a
                    wall of logos I haven&apos;t earned.
                  </p>
                  <p className="font-medium">
                    Here&apos;s what I&apos;ll do instead. Give me{" "}
                    {site.callMinutes} minutes and I&apos;ll tell you where your
                    week is going. If there&apos;s nothing there worth fixing,
                    I&apos;ll tell you that too and we&apos;re done.
                  </p>
                </div>

                <blockquote className="fs-display border-l-2 border-ember pl-6 text-[clamp(1.5rem,3vw,2.125rem)] leading-[1.2] text-ink">
                  I&apos;d rather be the guy who says it&apos;s not worth it
                  than the guy who sold you something.
                </blockquote>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── The call. The only conversion on the page. ───────── */}
      <section className="fs-shell scroll-mt-24 py-24 md:py-32">
        <div className="grid gap-16 md:grid-cols-[1fr_1fr] md:gap-24">
          <div>
            <Reveal>
              <span className="fs-label">The next step</span>
              <h2 className="fs-display mt-6 max-w-[16ch] text-[clamp(2.25rem,5vw,3.75rem)] text-ink">
                {site.callMinutes} minutes, and you&apos;ll know.
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <p className="mt-8 max-w-[46ch] text-[1.0625rem] leading-relaxed text-mute">
                No slides, no proposal to sit through. A straight conversation
                about where your week is leaking and whether any of it is worth
                automating.
              </p>

              <div className="mt-10">
                <CalendlyButton className="inline-flex items-center justify-center rounded-full bg-ember px-8 py-4 font-sans text-[0.9375rem] font-medium text-white transition-all duration-300 [transition-timing-function:var(--fs-ease)] hover:-translate-y-0.5 hover:bg-ember-deep hover:shadow-[0_12px_28px_-10px_rgba(194,65,12,.6)]">
                  Book a call
                </CalendlyButton>
              </div>
            </Reveal>
          </div>

          <Reveal delay={140}>
            <dl className="space-y-px">
              {FIFTEEN.map(([k, v]) => (
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
