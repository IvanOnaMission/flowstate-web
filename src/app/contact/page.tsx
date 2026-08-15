import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";
import Reveal from "@/components/Reveal";
import { callPromise, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Book a free ${site.callMinutes}-minute call with Ivan, or email him directly. AI systems for New Zealand trade businesses.`,
};

/**
 * Deliberately not a form.
 *
 * The site has one conversion and it is the call. A contact form adds a step,
 * needs a backend the static export doesn't have, and converts worse than a
 * booking link. Email and phone are here for people who'd rather not book.
 */
export default function Contact() {
  return (
    <>
      <SiteNav />

      <main id="main">
        <section className="shell pb-[clamp(2.5rem,5vw,4rem)] pt-[clamp(3rem,6vw,4.5rem)]">
          <Reveal>
            <p className="eyebrow mb-5 text-atlantic">Contact</p>
            <h1 className="h-hero max-w-[16ch] text-ink">
              Book the call.{" "}
              <span className="text-atlantic">
                Worst case you learn something.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={90}>
            <p className="mt-7 max-w-[52ch] text-[1.1rem] leading-relaxed text-mute">
              {site.callMinutes} minutes and no deck. I ask questions about how
              the work moves through your business, and you get a straight
              answer on where your hours are going and whether a machine could
              take any of them. If there&apos;s nothing there, I&apos;ll tell
              you that.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <CallButton tone="atlantic" />
              <span className="text-[0.85rem] text-mute">{callPromise}</span>
            </div>
          </Reveal>
        </section>

        <section className="border-t border-hair">
          <div className="shell py-[clamp(3rem,6vw,4.5rem)]">
            <Reveal>
              <p className="eyebrow mb-6 text-mute">Or just get hold of me</p>
            </Reveal>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                { label: "Email", value: site.email, href: `mailto:${site.email}` },
                { label: "Phone", value: site.phone, href: site.phoneHref },
                { label: "Based in", value: site.city, href: null },
              ].map((item, i) => (
                <Reveal key={item.label} delay={i * 70}>
                  <div className="border-t border-hair pt-5">
                    <p className="eyebrow text-mute">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="mt-2 inline-block text-[1.0625rem] font-semibold text-ink underline decoration-hair underline-offset-4 transition-colors duration-200 hover:decoration-atlantic"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-2 text-[1.0625rem] font-semibold text-ink">
                        {item.value}
                      </p>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-hair bg-sky-50">
          <div className="shell py-[clamp(3rem,6vw,4.5rem)]">
            <Reveal>
              <p className="eyebrow mb-4 text-mute">Before you book</p>
              <h2 className="h-sec max-w-[24ch] text-ink">
                Two things worth knowing.
              </h2>
            </Reveal>
            <div className="mt-8 grid max-w-[62rem] gap-8 md:grid-cols-2">
              <Reveal>
                <div className="max-w-[46ch] space-y-3 text-[1.0625rem] leading-relaxed text-mute">
                  <p className="font-[750] text-ink">
                    I&apos;ll tell you if it&apos;s not worth doing.
                  </p>
                  <p>
                    Some businesses aren&apos;t ready and some problems
                    aren&apos;t AI problems. You&apos;ll get that answer on the
                    call, not after an invoice.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={80}>
                <div className="max-w-[46ch] space-y-3 text-[1.0625rem] leading-relaxed text-mute">
                  <p className="font-[750] text-ink">
                    I take a few businesses at a time.
                  </p>
                  <p>
                    I build these myself, so if the calendar is full I&apos;ll
                    say so rather than take your money and queue you.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
