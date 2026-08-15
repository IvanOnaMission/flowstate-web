import type { Metadata } from "next";
import Image from "next/image";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";
import Reveal from "@/components/Reveal";
import { callPromise, rungs, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "What actually happens when Flowstate trains an AI system on how your trade business works, what it asks of your time, and how long it takes for a business your size.",
};

/**
 * The long version of the ladder. The home page sells the idea; this page
 * says what actually happens at each rung — Ivan's own delivery process,
 * given 2026-08-16.
 *
 * No pricing anywhere. That lives only on the private page sent after a call
 * so the offer can move without a rewrite (spec §7).
 */
const detail = [
  {
    lead:
      "This is the foundation, and it's the stage that decides whether the rest works. I sit down with you and with everyone who touches the work, and pull out how the business actually runs — not how the manual says it runs.",
    heading: "What that involves",
    points: [
      "Interviews with you and your team, one at a time",
      "Everything you know about quoting, pricing, process and customers, extracted and written down",
      "A pass over the tools you already use, so it works with your setup instead of replacing it",
      "What each person is actually trying to get done, and what's in their way",
      "All of it built into one place — the brain the system works from",
    ],
  },
  {
    lead:
      "Now it gets put to work. Everyone gets set up on it and we build out the first skills — the specific jobs you want it doing. The hard part here isn't technical, it's getting it into people's day so it actually gets used.",
    heading: "What that involves",
    points: [
      "Everyone set up and shown how to use it on their own work",
      "The first handful of skills built for the jobs that cost you the most time",
      "Working it into the daily routine rather than bolting it on beside it",
      "Corrections from real use fed straight back into the brain",
    ],
  },
  {
    lead:
      "This is the one worth aiming at, and it's built on the two underneath it — there's no shortcut straight to here. It's the point where nobody is thinking about the system any more, they're just using it.",
    heading: "What that looks like",
    points: [
      "The skills are second nature — used without anyone stopping to work out how",
      "The brain keeps getting sharper because people keep correcting it",
      "The jobs that used to live in your head keep moving without you holding them",
      "The business runs tighter, and you're in it because you want to be",
    ],
  },
] as const;

export default function Services() {
  return (
    <>
      <SiteNav />

      <main id="main">
        <section className="shell pb-[clamp(2.5rem,5vw,4rem)] pt-[clamp(3rem,6vw,4.5rem)]">
          <Reveal>
            <p className="eyebrow mb-5 text-atlantic">How it works</p>
            <h1 className="h-hero max-w-[18ch] text-ink">
              Off the ground quickly.{" "}
              <span className="text-atlantic">
                Then it keeps getting better.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={90}>
            <p className="mt-7 max-w-[56ch] text-[1.1rem] leading-relaxed text-mute">
              This isn&apos;t software you get handed. It&apos;s a system that
              learns your business, and like anyone new, it&apos;s only as good
              as what you put into it early on.
            </p>
          </Reveal>
        </section>

        {/* ── The rungs, at length ─────────────────────────────────── */}
        <section className="shell pb-[clamp(3rem,6vw,5rem)]">
          <ol className="space-y-[clamp(2rem,4vw,3.25rem)]">
            {rungs.map((r, i) => (
              <Reveal as="li" key={r.n} delay={i * 70}>
                <div className="grid items-start gap-7 border-t border-hair pt-[clamp(1.5rem,3vw,2.25rem)] md:grid-cols-[1fr_1.3fr] md:gap-14">
                  <div className="relative aspect-4/3 overflow-hidden bg-night">
                    <Image
                      src={`${r.img}.jpg`}
                      alt={r.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 45vw"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-[2rem] font-extrabold leading-none tracking-[-0.04em] text-atlantic">
                        {r.n}
                      </span>
                      <span className="eyebrow text-mute">{r.rung}</span>
                    </div>
                    <h2 className="mt-3 text-[clamp(1.35rem,2.6vw,1.9rem)] font-[750] leading-tight tracking-[-0.025em] text-ink">
                      {r.title}
                    </h2>
                    <p className="mt-4 max-w-[54ch] text-[1.0625rem] leading-relaxed text-mute">
                      {r.body}
                    </p>
                    <p className="mt-4 max-w-[54ch] text-[1.0625rem] leading-relaxed text-mute">
                      {detail[i].lead}
                    </p>

                    <p className="eyebrow mt-7 text-mute">
                      {detail[i].heading}
                    </p>
                    <ul className="mt-3 max-w-[54ch] space-y-2.5">
                      {detail[i].points.map((point) => (
                        <li
                          key={point}
                          className="grid grid-cols-[0.5rem_1fr] items-start gap-3 text-[1.0625rem] leading-relaxed text-mute"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[0.6875rem] block h-px w-2 bg-atlantic-500"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* ── What it costs you, in time not money ─────────────────── */}
        <section className="border-y border-hair bg-sky-50">
          <div className="shell py-[clamp(3rem,6vw,5rem)]">
            <Reveal>
              <p className="eyebrow mb-4 text-mute">What it asks of you</p>
              <h2 className="h-sec max-w-[20ch] text-ink">
                A few hours of your time, spent in the right place.
              </h2>
            </Reveal>
            <Reveal delay={70}>
              <p className="mt-5 max-w-[58ch] text-[1.0625rem] leading-relaxed text-mute">
                The order never changes. How long each part takes does &mdash;
                a two-van operation moves a lot faster than one with thirty
                staff and ten years of habits. I&apos;ll give you a real
                timeframe on the call once I know the size of what we&apos;re
                working with.
              </p>
            </Reveal>
            <dl className="mt-9 max-w-[62rem]">
              {[
                [
                  "Up front",
                  "The interviews. A few sessions of an hour or so, with you and with whoever else touches the work. This is the biggest ask, and it's the one that pays for itself.",
                ],
                [
                  "While it's being built",
                  "Short bursts. You look at what it produces and tell me where it's wrong. You don't need to explain how to fix it — just that it's wrong, and why.",
                ],
                [
                  "Once it's running",
                  "Minutes, not hours. You correct it when it gets something wrong, the same way you'd correct anyone new, and it stops getting that thing wrong.",
                ],
              ].map(([term, def], i) => (
                <Reveal key={term} delay={i * 70}>
                  <div className="grid gap-1 border-t border-hair py-5 sm:grid-cols-[13rem_1fr] sm:gap-6">
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
              The {site.callMinutes} minutes tells us both whether this is
              worth doing.
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
