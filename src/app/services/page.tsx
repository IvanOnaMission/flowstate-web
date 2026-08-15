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
 * The long version of the ladder. The home page sells it; this page explains
 * it honestly, including where it is hard and where it is unproven.
 *
 * No pricing anywhere. That lives only on the private page sent after a call
 * so the offer can move without a rewrite (spec §7).
 */
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
                <div className="grid items-start gap-7 border-t border-hair pt-[clamp(1.5rem,3vw,2.25rem)] md:grid-cols-[1fr_1.15fr] md:gap-14">
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
                      {
                        [
                          "Most of this stage is you talking and me listening. Quotes you're proud of, jobs that went wrong, the customers you want more of. It feels like nothing is happening. That's the part that decides whether the rest works.",
                          "This is where it earns its keep, and it's also where most people stop. Getting something to draft in your voice is harder than getting it to sort your inbox — I'd rather tell you that now than discover it halfway through.",
                          "This is the one worth aiming at, and it's built on the two underneath it — there's no shortcut straight to here. When it's working, the jobs that used to live in your head keep moving without you holding them, and the business is tighter for it.",
                        ][i]
                      }
                    </p>
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
                  "First, you talk",
                  "A few sessions, an hour or so each. How the work moves, what you're proud of, what goes wrong. I take it away.",
                ],
                [
                  "Then you correct it",
                  "You look at what it produces and tell me where it's wrong. That correction is the training — it's the bit that can't be skipped or rushed.",
                ],
                [
                  "Then it runs live",
                  "It works on real jobs while you watch it. We fix what breaks.",
                ],
                [
                  "From there",
                  "It keeps learning as you correct it. There's no finish line, which is the point.",
                ],
              ].map(([term, def], i) => (
                <Reveal key={term} delay={i * 70}>
                  <div className="grid gap-1 border-t border-hair py-5 sm:grid-cols-[12rem_1fr] sm:gap-6">
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
