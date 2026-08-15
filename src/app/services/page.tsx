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
    heading: "What happens",
    points: [
      "Interviews with you and the team",
      "Your pricing, process and customers, written down",
      "A look at the tools you already use",
      "All of it becomes the brain it works from",
    ],
  },
  {
    heading: "What happens",
    points: [
      "Everyone set up and shown how",
      "First skills built for your biggest time-sinks",
      "Worked into the daily routine, not bolted on beside it",
      "Your corrections feed straight back in",
    ],
  },
  {
    heading: "What it looks like",
    points: [
      "Used without anyone thinking about it",
      "Gets sharper every time it's corrected",
      "Jobs keep moving without you holding them",
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
                    <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-relaxed text-mute">
                      {r.body}
                    </p>

                    <p className="eyebrow mt-6 text-mute">
                      {detail[i].heading}
                    </p>
                    <ul className="mt-3 max-w-[52ch] space-y-2">
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
                  "The interviews. A few sessions of an hour or so. The biggest ask, and the one that pays for itself.",
                ],
                [
                  "While it's built",
                  "Short bursts. You say where it's wrong — not how to fix it.",
                ],
                [
                  "Once it's running",
                  "Minutes, not hours. Correct it like you'd correct anyone new.",
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
