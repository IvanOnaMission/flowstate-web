import type { Metadata } from "next";
import CalendlyButton from "@/components/CalendlyButton";
import FlowField from "@/components/FlowField";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Half an hour, no slides. A quick chat about where your week's time is leaking and whether AI can actually help.",
  alternates: { canonical: "/contact/" },
};

const field =
  "mt-2 w-full rounded-xl border border-line-strong bg-white px-4 py-3 " +
  "text-[1rem] text-ink transition-colors duration-200 placeholder:text-mute/60 " +
  "focus:border-atlantic focus:outline-none";

export default function Contact() {
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
            <span className="fs-label">Contact</span>
            <h1 className="fs-display mt-7 text-[clamp(2.75rem,8vw,6rem)] text-ink">
              Half an hour. <span className="text-atlantic">No slides.</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="fs-shell grid gap-14 border-t border-line py-20 md:grid-cols-[1fr_1.1fr] md:gap-24 md:py-24">
        <div>
          <Reveal>
            <span className="fs-label">What the call is</span>
            <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-relaxed text-ink">
              A quick chat — what your week looks like, where time&apos;s
              leaking, whether AI can actually help. If there&apos;s a fit we
              talk about a paid audit. If there isn&apos;t, you&apos;ve lost half
              an hour.
            </p>
            <div className="mt-8">
              <CalendlyButton className="inline-flex items-center justify-center rounded-full bg-ember px-7 py-3.5 font-sans text-[0.9375rem] font-medium text-white transition-all duration-300 [transition-timing-function:var(--fs-ease)] hover:-translate-y-0.5 hover:bg-ember-deep">
                Book on Calendly
              </CalendlyButton>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-14 border-t border-line pt-8">
              <span className="fs-label">Or just reach us</span>
              <ul className="mt-5 space-y-2.5 text-[1.0625rem]">
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-atlantic underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-atlantic"
                  >
                    {site.email}
                  </a>
                </li>
                <li>
                  <a
                    href={site.phoneHref}
                    className="text-atlantic underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-atlantic"
                  >
                    {site.phone}
                  </a>
                </li>
              </ul>
              <p className="mt-5 max-w-[42ch] text-[0.9375rem] leading-relaxed text-mute">
                Auckland, New Zealand. We work with trade businesses across the
                country — most of the build happens remotely.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <div className="rounded-2xl border border-line bg-paper p-7 md:p-9">
            <span className="fs-label">Or send a message</span>
            <h2 className="fs-display mt-4 text-[clamp(1.5rem,3vw,2rem)] text-ink">
              Tell us what you need.
            </h2>

            {/*
              Netlify picks the form up from the exported HTML at deploy time,
              so the name / data-netlify / hidden form-name trio all have to be
              in the markup — not added by JS.
            */}
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              action="/contact/thanks/"
              className="mt-7 space-y-5"
            >
              <input type="hidden" name="form-name" value="contact" />
              <p className="hidden">
                <label>
                  Leave this empty if you&apos;re human:{" "}
                  <input name="bot-field" tabIndex={-1} autoComplete="off" />
                </label>
              </p>

              <div>
                <label htmlFor="name" className="fs-label">
                  Name
                </label>
                <input id="name" name="name" required className={field} />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="fs-label">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={field}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="fs-label">
                    Phone
                  </label>
                  <input id="phone" name="phone" type="tel" className={field} />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="fs-label">
                  What&apos;s this about?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className={`${field} resize-y`}
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-ember px-8 py-4 font-sans text-[0.9375rem] font-medium text-white transition-all duration-300 [transition-timing-function:var(--fs-ease)] hover:-translate-y-0.5 hover:bg-ember-deep sm:w-auto"
              >
                Send message
              </button>
            </form>
          </div>
        </Reveal>
      </section>
    </>
  );
}
