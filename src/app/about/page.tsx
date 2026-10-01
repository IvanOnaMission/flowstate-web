import type { Metadata } from "next";
import Image from "next/image";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";
import Reveal from "@/components/Reveal";
import { callPromise, site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/about/" },
  openGraph: { url: "/about/", images: ["/assets/hero/workshop-hook.jpg"] },
  title: "About",
  description:
    "Who you'd be working with at Flowstate — Ivan builds the systems, Jordan handles strategy. Both out of the trades, not out of a software company.",
};

/**
 * Photos and bios carried over from the previous site — same shots, same
 * words. They are the strongest proof this business has while there are no
 * case studies, so they survive the rebuild unchanged.
 *
 * ⚠️ Jordan's role label is deliberately "Strategy", NOT "Partner". The 10%
 * equity term sheet was sent 2026-06-29 and is still unanswered, so claiming
 * a partnership publicly would be ahead of the facts. Do not "tidy" this to
 * Partner without checking [[jordan]] first.
 */
const people = [
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
] as const;

export default function About() {
  return (
    <>
      <SiteNav />

      <main id="main">
        <section className="shell pb-[clamp(2rem,4vw,3rem)] pt-[clamp(3rem,6vw,4.5rem)]">
          <Reveal>
            <p className="eyebrow mb-5 text-atlantic">About</p>
            <h1 className="h-hero max-w-[18ch] text-ink">
              Who you&apos;d be{" "}
              <span className="text-atlantic">working with.</span>
            </h1>
          </Reveal>
        </section>

        {/* ── Who you'd be working with ──────────────────────────── */}
        <section className="shell pb-[clamp(3rem,6vw,5rem)]">
          <ol className="space-y-[clamp(2.5rem,5vw,4rem)]">
            {people.map((p, i) => (
              <Reveal as="li" key={p.name} delay={i * 80}>
                <div className="grid items-start gap-8 border-t border-hair pt-[clamp(1.75rem,3vw,2.5rem)] md:grid-cols-[20rem_1fr] md:gap-14">
                  <div className="relative aspect-4/5 overflow-hidden bg-atlantic">
                    <Image
                      src={p.photo}
                      alt={p.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 20rem"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-[2rem] font-extrabold leading-none tracking-[-0.04em] text-atlantic">
                        {p.n}
                      </span>
                      <span className="eyebrow text-mute">{p.role}</span>
                    </div>
                    <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.1rem)] font-[750] leading-tight tracking-[-0.028em] text-ink">
                      {p.name}
                    </h2>
                    <div className="mt-4 max-w-[54ch] space-y-4 text-[1.0625rem] leading-relaxed text-mute">
                      {p.paras.map((para) => (
                        <p key={para.slice(0, 24)}>{para}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* ── Why we joined forces ──────────────────────────────────
            Carried over from the previous site. Same photo, same argument,
            trimmed. Note it says "joined forces" and not "partners" — same
            reason Jordan's label above is Strategy. */}
        <section className="shell pb-[clamp(3rem,6vw,5rem)]">
          <div className="grid items-center gap-10 border-t border-hair pt-[clamp(1.75rem,3vw,2.5rem)] md:grid-cols-[22rem_1fr] md:gap-16">
            <Reveal>
              <div className="relative aspect-3/4 overflow-hidden bg-atlantic">
                <Image
                  src="/assets/team/together.jpg"
                  alt="Ivan and Jordan, the Flowstate team"
                  fill
                  sizes="(max-width: 768px) 100vw, 22rem"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div>
                <p className="eyebrow mb-4 text-mute">Why we joined forces</p>
                <h2 className="h-sec max-w-[18ch] text-ink">
                  Most owners <em className="not-italic text-atlantic">are</em>{" "}
                  the business.
                </h2>
                <div className="mt-6 max-w-[54ch] space-y-4 text-[1.0625rem] leading-relaxed text-mute">
                  <p>
                    If they stop, it stops. We joined forces on one thing:
                    getting trade business owners out of being the bottleneck.
                  </p>
                  <p>
                    We build the systems that let it run without them, so they
                    get their time back and end up with something that&apos;s
                    actually worth selling.
                  </p>
                </div>
                <blockquote className="mt-8 border-l-2 border-atlantic-500 pl-6 text-[clamp(1.15rem,2.2vw,1.45rem)] font-[750] leading-snug tracking-[-0.02em] text-ink">
                  You get the strategy and the build from people who&apos;ve
                  actually done the work &mdash; not a consultant who never
                  has.
                </blockquote>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── How I work ───────────────────────────────────────────── */}
        <section className="border-y border-hair bg-sky-50">
          <div className="shell py-[clamp(3rem,6vw,5rem)]">
            <Reveal>
              <p className="eyebrow mb-4 text-mute">How I work</p>
              <h2 className="h-sec max-w-[22ch] text-ink">
                Four things I&apos;ll hold to, whether or not you hire me.
              </h2>
            </Reveal>
            <dl className="mt-9 max-w-[62rem]">
              {[
                [
                  "I'll tell you if it won't work",
                  "Some businesses aren't ready, and some problems aren't AI problems. Saying so costs me a sale and saves you a project.",
                ],
                [
                  "If it isn't doing the job, I keep going",
                  "We agree what it should be doing before I start. If it isn't doing that, I keep working until it is — you don't get another invoice for me finishing what I said I'd finish.",
                ],
                [
                  "My entire reputation is ahead of me, not behind me",
                  "I don't have the luxury of coasting on past accomplishments, which means every project gets my absolute focus and highest standard of work.",
                ],
                [
                  "I train your team, not just the software",
                  "Most of these projects die because nobody ends up using the thing. So it isn't finished when it's built. It's finished when your people are using it without being reminded to.",
                ],
              ].map(([term, def], i) => (
                <Reveal key={term} delay={i * 70}>
                  <div className="grid gap-1 border-t border-hair py-5 sm:grid-cols-[17rem_1fr] sm:gap-6">
                    <dt className="text-[1.0625rem] font-[750] tracking-[-0.015em] text-ink">
                      {term}
                    </dt>
                    <dd className="max-w-[56ch] text-[1.0625rem] leading-relaxed text-mute">
                      {def}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>

        <section className="shell py-[clamp(3rem,6vw,5rem)]">
          <Reveal>
            <h2 className="h-sec max-w-[20ch] text-ink">
              Easiest way to judge me is {site.callMinutes} minutes on the
              phone.
            </h2>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <CallButton tone="atlantic" />
              <span className="text-[0.85rem] text-mute">{callPromise}</span>
            </div>
          </Reveal>
        </section>
      </main>
    </>
  );
}
