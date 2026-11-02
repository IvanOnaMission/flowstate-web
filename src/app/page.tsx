import SoftwareExplanation from "@/components/SoftwareExplanation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";
import Reveal from "@/components/Reveal";
import { callPromise, rungs } from "@/lib/site";

const title = "AI for NZ electricians and trade businesses — Flowstate";
const description =
  "Less admin for NZ electricians, tradies and trade businesses. Free introductory call, then a paid diagnostic. The AI partnership is agreed after that.";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: { absolute: title },
  description,
  openGraph: {
    title,
    description,
    url: "/",
    images: ["/assets/hero/workshop-hook.jpg"],
  },
};

/**
 * The home page has one job: book the discovery call. Everything here either
 * earns that click or gets cut.
 */
export default function Home() {
  return (
    <>
      {/* ── The hero ──────────────────────────────────────────────────
          Full bleed, full viewport height.
          The image is 16:9 and the viewport rarely is, so cropping is
          unavoidable — focus sits at 62% across to keep the hi-vis in frame
          and the dark side under the type. */}
      <section className="relative isolate bg-night on-dark">
        <Image
          src="/assets/hero/workshop-hook.jpg"
          alt="A workshop with the owner's hi-vis vest and hard hat hanging on a hook, the crew still working behind"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center]"
        />
        {/* Carries the headline. Must reach ~58% before fading or a full
            line of type drifts onto the bright part of the workshop.
            Desktop only — see the flat scrim below for why. */}
        <div className="absolute inset-0 hidden md:block md:bg-[linear-gradient(96deg,rgba(3,16,26,.97)_0%,rgba(3,16,26,.92)_36%,rgba(3,16,26,.66)_58%,rgba(3,16,26,.2)_80%,rgba(3,16,26,.03)_94%)]" />
        {/* On a phone the text column is full width, so a left-to-right
            gradient would leave the headline sitting on the bright hi-vis.
            A flat scrim keeps every line legible at 390px. */}
        <div className="absolute inset-0 bg-[rgba(3,16,26,.84)] md:hidden" />
        <div className="absolute inset-x-0 top-0 h-[150px] bg-[linear-gradient(rgba(3,16,26,.72),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-[120px] bg-[linear-gradient(transparent,rgba(3,16,26,.85))]" />

        {/* Fill the visible screen, allowing the content to grow on smaller
            devices or when the visitor increases their text size. */}
        <div className="relative z-10 flex min-h-dvh flex-col">
          <SiteNav ground="dark" />

          <div
            id="main"
            className="flex flex-1 items-center py-[clamp(3.5rem,7vw,6rem)]"
          >
            <div className="shell w-full">
              <div className="flex max-w-[70rem] flex-col gap-6">
                <Reveal>
                  <p className="eyebrow text-sky/90">AI help for New Zealand electricians and tradies</p>
                </Reveal>
                <Reveal delay={90}>
                  <h1 className="home-hero-title max-w-[21ch] text-white">
                    <span className="block w-fit bg-gold px-2 text-ink">Less admin.</span>
                    <span className="block text-sky">More time to run your business.</span>
                  </h1>
                </Reveal>
                <Reveal delay={160}>
                  <p className="max-w-[46ch] text-[1.05rem] leading-relaxed text-white/80">
                    Flowstate works with electrical businesses, and with plumbers, builders, HVAC and other trade businesses across New Zealand.
                  </p>
                </Reveal>
                <Reveal delay={240}>
                  <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
                    <CallButton tone="sky" className="!px-6 !py-4">Book a free call</CallButton>
                    <Link href="/business-essentials/" className="inline-flex min-h-11 items-center font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">Business Essentials →</Link>
                    <Link href="/services/" className="inline-flex min-h-11 items-center font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">See how it works →</Link>
                  </div>
                  <p className="mt-4 max-w-[52ch] text-[0.8rem] text-white/75">Free introductory call · about 30 minutes · diagnostic quoted separately</p>
                </Reveal>
              </div>
            </div>
          </div>

          {/* Tells a visitor on a full-height hero that the page continues.
              Decorative, so it's hidden from screen readers, and it stops
              animating under reduced-motion via the global rule. */}
          <a
            href="#how-it-fits"
            aria-hidden="true"
            tabIndex={-1}
            className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 md:block"
          >
            <span className="block h-9 w-px animate-[cue_2.6s_ease-in-out_infinite] bg-[linear-gradient(rgba(196,248,255,0),rgba(196,248,255,.85))]" />
          </a>
        </div>
      </section>

      <section id="how-it-fits" className="shell scroll-mt-8 py-[clamp(3.25rem,7vw,5.75rem)]">
        <Reveal>
          <section aria-labelledby="diagnostic-heading" className="grid gap-6 rounded-2xl border border-atlantic/15 border-l-4 border-l-atlantic bg-[#EBFDFF] p-[clamp(1.5rem,4vw,3rem)] md:grid-cols-[1fr_1.2fr] md:gap-12">
            <h2 id="diagnostic-heading" className="h-sec max-w-[18ch] text-atlantic">A clear roadmap. An AI partner to help you act on it.</h2>
            <div>
              <p className="max-w-[60ch] text-[1.0625rem] leading-relaxed text-mute">
                The paid diagnostic reviews how your business works and identifies where AI could help. Your roadmap sets the priorities; the ongoing AI partnership brings agreed implementation, training and support.
              </p>
              <a href="/workflow-diagnostic/" className="mt-6 inline-flex min-h-11 items-center gap-3 font-semibold text-atlantic underline decoration-atlantic/30 underline-offset-4 transition-colors hover:decoration-atlantic">Explore the diagnostic and AI partnership →</a>
            </div>
          </section>
          <SoftwareExplanation />
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-atlantic">
            <Link href="/ai-for-trades-businesses/">AI for trade businesses →</Link>
            <Link href="/business-essentials/">Business Essentials →</Link>
            <Link href="/ai-for-electricians/">AI for electrical businesses →</Link>
            <a href="/workflow-diagnostic/">Explore the diagnostic and AI partnership →</a>
          </div>
        </Reveal>
      </section>

      {/* ── The ladder ────────────────────────────────────────────────
          Cards, not heroes. The hero is the emotional hit; this explains.
          One statue across three frames — see spec §4.5 before regenerating
          any of these images. */}
      <section id="ladder" className="shell scroll-mt-8 pb-[clamp(3.25rem,7vw,5.75rem)]">
        <Reveal>
          <p className="eyebrow mb-4 text-mute">The ladder</p>
          <h2 className="h-sec max-w-[22ch] text-ink">
            It climbs the same ladder everyone in your business climbed.
          </h2>
        </Reveal>

        <ol className="mt-[clamp(1.875rem,4vw,2.875rem)] grid gap-[clamp(1rem,2vw,1.625rem)] md:grid-cols-3">
          {rungs.map((r, i) => (
            <Reveal as="li" key={r.n} delay={i * 90}>
              <article className="group flex h-full flex-col overflow-hidden border border-hair bg-white transition-[border-color,box-shadow,transform] duration-300 [transition-timing-function:var(--ease-out-soft)] hover:-translate-y-[3px] hover:border-[#bfd6e3] hover:shadow-[0_18px_40px_-24px_rgba(6,40,61,.42)]">
                <div className="relative aspect-4/3 bg-night">
                  <Image
                    src={`${r.img}.jpg`}
                    alt={r.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2.5 p-[clamp(1.125rem,2vw,1.625rem)]">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[1.55rem] font-extrabold leading-none tracking-[-0.04em] text-atlantic">
                      {r.n}
                    </span>
                    <span className="eyebrow text-mute">{r.rung}</span>
                  </div>
                  <h3 className="text-[1.18rem] font-[750] leading-tight tracking-[-0.02em] text-ink">
                    {r.title}
                  </h3>
                  <p className="text-[0.95rem] leading-relaxed text-mute">
                    {r.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </ol>

        {/* Expansion follows demonstrated value, not an automatic progression. */}
        <Reveal delay={120}>
          <p className="mt-[clamp(1.5rem,3vw,2.25rem)] max-w-[60ch] border-l-2 border-hair pl-4 text-[0.93rem] text-mute">
            Start with one useful workflow. Expand as it proves its value.
          </p>
        </Reveal>
      </section>

      {/* ── The part everyone skips ──────────────────────────────────── */}
      <section className="relative bg-atlantic on-dark">
        <div className="shell py-[clamp(3.5rem,8vw,6.5rem)]">
          <Reveal>
            <p className="eyebrow mb-4 text-sky/90">The part everyone skips</p>
            <h2 className="h-sec max-w-[20ch] text-white">
              AI needs to know how your business works.
            </h2>
          </Reveal>
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <Reveal delay={90}>
            <div className="mt-8 max-w-[58ch] space-y-4 text-[1.0625rem] leading-relaxed text-sky/85">
              <p>
                A useful workflow needs your business information and clear
                instructions: how a job moves through your team, where the
                details live and what a good result looks like.
              </p>
              <p>
                That&apos;s where the diagnostic starts. We review the work,
                identify what AI would need and decide which tasks are worth
                tackling. Your team keeps control of pricing, technical
                decisions and final approval.
              </p>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <Image
              src="/assets/business-context.webp"
              alt="Illustration of business documents and processes feeding into AI."
              width={1200}
              height={800}
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="h-auto w-full rounded-2xl lg:mt-8"
            />
          </Reveal>
          </div>
        </div>
      </section>

      {/* ── Who you'd be working with ────────────────────────────────
          The video slot degrades to written text so going live is not
          blocked on filming. Swap the panel for the embed when it exists. */}
      <section className="shell py-[clamp(3.25rem,7vw,5.75rem)]">
        <Reveal>
          <p className="eyebrow mb-4 text-mute">Who you&apos;d be working with</p>
        </Reveal>
        <div className="grid items-start gap-10 md:grid-cols-[16rem_1fr] md:gap-14">
          <Reveal>
            <div className="relative aspect-4/5 overflow-hidden bg-atlantic">
              <Image
                src="/assets/team/ivan.jpg"
                alt="Ivan Barnett, founder of Flowstate"
                fill
                sizes="(max-width: 768px) 100vw, 16rem"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="max-w-[54ch] space-y-4 text-[1.0625rem] leading-relaxed text-mute">
              <p className="text-ink">
                I&apos;m Ivan. I build the systems myself.
              </p>
              <p>
                I grew up around technology and computers, so this stuff is
                second nature &mdash; not something I crammed for a course last
                year. I also like getting outside, exploring, and playing
                sport. I&apos;m not a full tech nerd.
              </p>
              <p>
                I started a business because I wanted what I get out of it to
                match the work I put in. I&apos;m in it for the challenge.
              </p>
              <p>
                If I don&apos;t think this will move the needle for you,
                I&apos;ll say so on the call rather than sell you a project.
              </p>
              <blockquote className="mt-6 border-l-2 border-atlantic-500 pl-6 text-[clamp(1.15rem,2.1vw,1.45rem)] font-[750] leading-snug tracking-[-0.02em] text-ink">
                The goal isn&apos;t to add AI to your business. It&apos;s to
                stop your business waiting on you.
              </blockquote>
              <p className="!mt-6">
                <Link
                  href="/about/"
                  className="text-[1rem] font-semibold text-ink underline decoration-hair underline-offset-4 transition-colors duration-200 hover:decoration-atlantic"
                >
                  More about who you&apos;d be working with
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── What happens on the call ───────────────────────────── */}
      <section className="border-t border-hair bg-sky-50">
        <div className="shell py-[clamp(3.25rem,7vw,5.75rem)]">
          <Reveal>
            <p className="eyebrow mb-4 text-mute">
              What happens on the call
            </p>
            <h2 className="h-sec max-w-[20ch] text-ink">
              A few questions about your business.
            </h2>
          </Reveal>
          <Reveal delay={90}>
            <div className="mt-7 max-w-[58ch] space-y-4 text-[1.0625rem] leading-relaxed text-mute">
              <p>
                {"We'll talk about how your business runs, the software you use and where work gets held up. Bring one recent example — a quote that took too long to prepare, or an enquiry that went quiet."}
              </p>
              <p>
                {"The introductory call is free and takes about 30 minutes. We'll discuss whether a paid diagnostic is a useful next step. Its scope and fee are agreed before you commit; the ongoing AI partner scope and rate are agreed after the diagnostic."}
              </p>
            </div>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <CallButton tone="atlantic" />
              <span className="text-[0.85rem] text-mute">{callPromise}</span>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
