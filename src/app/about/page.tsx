import type { Metadata } from "next";
import CalendlyButton from "@/components/CalendlyButton";
import FlowField from "@/components/FlowField";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Out of the trades, not out of a software company. Four years on the tools and eight years running a systemised electrical business between us.",
  alternates: { canonical: "/about/" },
};

// Photos and bios carried over from the previous site (f21a042) at Ivan's
// request — same shots, same words. Jordan's role label is the one change:
// "Partner" → strategy/advisor while the term sheet is unanswered.
const PEOPLE = [
  {
    n: "01",
    role: "Founder",
    name: "Ivan",
    photo: "/assets/team/ivan.jpg",
    alt: "Ivan Barnett, founder of Flowstate",
    paras: [
      "I spent four years in the trades, most recently as an electrical apprentice. I've been on the tools and on the jobs, so I've seen up close how much time a trade business loses to everything that isn't the actual work.",
      "I'm 20. I grew up with this stuff — AI, automation, the internet — it's second nature to me, not something I crammed for a course. So you're not paying me to figure it out. You're getting someone who already lives in these tools, moves fast, and has everything to prove.",
      "And I'm hands-on across the whole thing — working out what's worth fixing, building it, and making sure it actually works in your business, not just on paper.",
    ],
  },
  {
    n: "02",
    role: "Strategy",
    name: "Jordan",
    photo: "/assets/team/jordan.jpg",
    alt: "Jordan, strategy at Flowstate",
    paras: [
      "Jordan brings the good looks, the beard, and — more usefully — eight years of running his own electrical business. His actual thing is systems: building trade businesses that run efficiently without the owner having to touch everything.",
      "He's found and fixed the leaks in his own operation, so he knows exactly where the time and money go in yours. He brings the business strategy and the trades know-how.",
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
              I was the <span className="text-atlantic">apprentice.</span>
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
              <div
                className={`grid items-start gap-8 border-t border-line py-12 md:gap-14 lg:grid-cols-[22rem_1fr] ${
                  i % 2 === 1 ? "lg:[&>figure]:order-2" : ""
                }`}
              >
                <figure className="overflow-hidden rounded-2xl border border-line-strong bg-atlantic-deep">
                  {/* Plain img: output:"export" with images.unoptimized — no
                      loader to gain anything from, and this keeps the markup
                      static for Netlify. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.photo}
                    alt={p.alt}
                    width={1086}
                    height={1448}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </figure>
                <div className="fs-prose">
                  <div className="flex items-baseline gap-4">
                    <span className="fs-display text-[2.75rem] leading-none text-line-strong">
                      {p.n}
                    </span>
                    <span className="fs-label">{p.role}</span>
                  </div>
                  <h2 className="fs-display mt-4 text-[clamp(1.75rem,3.4vw,2.5rem)] text-ink">
                    {p.name}
                  </h2>
                  <div className="mt-5 space-y-4">
                    {p.paras.map((t) => (
                      <p
                        key={t.slice(0, 24)}
                        className="text-[1.0625rem] text-mute"
                      >
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
        <div className="fs-shell grid items-center gap-10 py-20 md:py-24 lg:grid-cols-[24rem_1fr] lg:gap-16">
          <Reveal>
            <figure className="overflow-hidden rounded-2xl border border-line-strong bg-atlantic-deep">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/team/together.jpg"
                alt="Ivan and Jordan, the Flowstate team"
                width={1086}
                height={1448}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </figure>
          </Reveal>
          <Reveal delay={120}>
            <div className="fs-prose">
              <span className="fs-label">Why we joined forces</span>
              <h2 className="fs-display mt-6 max-w-[18ch] text-[clamp(1.875rem,4.2vw,3rem)] text-ink">
                Stop being the bottleneck.
              </h2>
              <p className="mt-6 text-[1.0625rem] text-mute">
                We found each other through some genuinely terrible cold emails
                — the kind Ivan was firing out trying to land his first clients.
                They were bad. But one of those conversations turned into
                something real, and we&apos;ve been building together since.
              </p>
              <p className="mt-4 text-[1.0625rem] text-mute">
                We joined forces on one thing: getting service-business owners
                out of being the bottleneck. Most owners <em>are</em> the
                business — if they stop, it stops. We build the systems that let
                it run without them, so they get their time back and end up with
                something that&apos;s actually worth selling.
              </p>
              <blockquote className="fs-display mt-8 border-l-2 border-ember pl-6 text-[clamp(1.25rem,2.6vw,1.5rem)] leading-[1.35] text-ink italic">
                You get the strategy and the build from people who&apos;ve
                actually run the work — not a consultant who&apos;s never done
                it.
              </blockquote>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="fs-shell py-24 text-center md:py-28">
        <Reveal>
          <span className="fs-label">
            Free · {site.callMinutes} minutes · no pitch deck
          </span>
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
