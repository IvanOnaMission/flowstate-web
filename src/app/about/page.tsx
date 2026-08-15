import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";
import Reveal from "@/components/Reveal";
import { callPromise, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ivan builds AI systems for New Zealand trade businesses. One person, a few clients at a time, and a straight answer about what AI can and can't do for your trade.",
};

/**
 * The founder page. The video slot degrades to written text on purpose — the
 * 60–90s piece isn't filmed yet and going live must not wait on it. When it
 * exists, swap the panel below for the embed and delete the fallback note.
 */
export default function About() {
  return (
    <>
      <SiteNav />

      <main id="main">
        <section className="shell pb-[clamp(2.5rem,5vw,4rem)] pt-[clamp(3rem,6vw,4.5rem)]">
          <Reveal>
            <p className="eyebrow mb-5 text-atlantic">About</p>
            <h1 className="h-hero max-w-[17ch] text-ink">
              One person, a few businesses at a time,{" "}
              <span className="text-atlantic">and a straight answer.</span>
            </h1>
          </Reveal>
        </section>

        <section className="shell pb-[clamp(3rem,6vw,5rem)]">
          <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
            <Reveal>
              <div className="max-w-[56ch] space-y-4 text-[1.0625rem] leading-relaxed text-mute">
                <p className="text-[1.1rem] text-ink">
                  I&apos;m Ivan. I build AI systems for trade businesses in New
                  Zealand, and I build them myself.
                </p>
                <p>
                  There&apos;s no account manager, no team you get passed to
                  after the sales call, and no offshore build crew. The person
                  who sits in your workshop is the person who writes the thing.
                  That&apos;s the whole reason it works &mdash; you can&apos;t
                  train a system on how a business runs if you weren&apos;t
                  there listening.
                </p>
                <p>
                  It also means I take a few businesses at a time and no more.
                  If I&apos;m full I&apos;ll tell you, and if I don&apos;t think
                  AI is going to move the needle for you I&apos;ll tell you that
                  on the call rather than sell you a project.
                </p>
                <p>
                  I&apos;m young, and I know what that reads like. What I&apos;d
                  say is that I understand these tools in a way most people
                  advising you on them don&apos;t, and I&apos;d rather show you
                  that in fifteen minutes than argue about it.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              {/* Video slot. Written fallback until the 60–90s piece is filmed. */}
              <div className="border border-hair bg-sky-50 p-8">
                <p className="eyebrow text-mute">In his own words</p>
                <blockquote className="mt-5 text-[clamp(1.25rem,2.4vw,1.6rem)] font-[750] leading-snug tracking-[-0.02em] text-ink">
                  The goal isn&apos;t to add AI to your business. It&apos;s to
                  stop your business waiting on you.
                </blockquote>
                <p className="mt-6 max-w-[38ch] text-[0.95rem] leading-relaxed text-mute">
                  A short video walking through how I work is on its way. Until
                  then the fastest way to judge whether I know what I&apos;m
                  talking about is to book the call and ask.
                </p>
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
                  "You own everything",
                  "The system, the training, the accounts it runs on. If we stop working together you keep all of it.",
                ],
                [
                  "It runs on your keys",
                  "Your business connects to your own accounts, not mine. Nothing depends on me still being in the picture.",
                ],
                [
                  "No jargon",
                  "If I can't explain what something does in a sentence you'd repeat to your foreman, I haven't understood it well enough yet.",
                ],
              ].map(([term, def], i) => (
                <Reveal key={term} delay={i * 70}>
                  <div className="grid gap-1 border-t border-hair py-5 sm:grid-cols-[14rem_1fr] sm:gap-6">
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
