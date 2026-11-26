import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { callPromise, site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/contact/" },
  openGraph: { url: "/contact/", images: ["/assets/hero/workshop-hook.jpg"] },
  title: "Contact",
  description: "Book a free 30-minute call with Ivan about your NZ electrical business. If it's a fit, we build a custom implementation plan, with scope and rate agreed before any build starts.",
};

/**
 * Booking is the primary action; the form is the fallback.
 *
 * The form is carried over from the previous site rather than dropped. Some
 * people won't book a slot but will leave a number, and removing a live lead
 * path in a redesign is the kind of loss nobody notices until the enquiries
 * stop. It posts to Netlify Forms exactly as it did before.
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
              Let&apos;s find where{" "}
              <span className="text-atlantic">AI could help.</span>
            </h1>
          </Reveal>
          <Reveal delay={90}>
            <p className="mt-7 max-w-[52ch] text-[1.1rem] leading-relaxed text-mute">
              {"About 30 minutes, free, with no pitch deck. Tell me how your business runs and where work gets held up. If it's a fit, we build a custom implementation plan from there. Scope and rate are agreed before any build starts."}
            </p>
          </Reveal>
          <Reveal delay={160}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <CallButton tone="atlantic" />
              <span className="text-[0.85rem] text-mute">{callPromise}</span>
            </div>
          </Reveal>
        </section>

        {/* ── Or leave your details ─────────────────────────────────
            Kept from the previous site. Some people won't book a call but
            will leave a number — losing that in the rebuild would have cost
            a live lead path. Booking stays the primary action above. */}
        <section className="border-t border-hair bg-sky-50">
          <div className="shell py-[clamp(3rem,6vw,4.5rem)]">
            <Reveal>
              <p className="eyebrow mb-4 text-mute">
                Rather not book a time?
              </p>
              <h2 className="h-sec max-w-[22ch] text-ink">
                Leave your details and I&apos;ll call you.
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <div className="mt-8">
                <ContactForm />
              </div>
            </Reveal>
          </div>
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
