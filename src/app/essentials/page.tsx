import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { site } from "@/lib/site";

const path = "/essentials/";
const title = "Business Essentials";
const description =
  "Watch Ivan explain Business Essentials, then book a free 30-minute audit. Enquiry replies, quote follow-ups and invoice reminders, drafted for you to approve.";

const calendly =
  "https://calendly.com/ivan-flowstate/30min?utm_source=flowstate&utm_medium=direct-booking&utm_campaign=business-essentials";

const included = [
  ["Enquiry replies", "New enquiries get a reply drafted with the right next step, so people hear back while they're still keen."],
  ["Quote follow-ups", "Quotes that haven't been answered get a follow-up drafted at the right time, in your voice."],
  ["Invoice reminders", "Overdue invoices get polite reminders drafted, so you're not the one having the awkward conversation."],
  ["Review requests", "Happy customers get asked for a review once the job is done."],
  ["On-site helper", "Your team can ask how you do things and get your answer, without ringing you."],
  ["Less double handling", "Fewer things get typed twice across email, job software and accounts."],
  ["Quotes that turn into jobs", "You can see how many quotes turn into jobs."],
  ["One dashboard", "All of it sits in one dashboard built for your business."],
] as const;

const suits = [
  "You run an electrical or trade business in New Zealand and you're still the one doing the quoting, chasing and replying at night.",
  "Work keeps coming back to you because the answers live in your head.",
  "You already use job software such as Fergus or Tradify, and the manual work around it still lands on you.",
  "You want AI working in the business, whether you want to learn it yourself or have as little to do with it as possible.",
] as const;

const field =
  "min-h-12 w-full rounded-lg border border-hair bg-white px-4 py-3 text-base text-ink " +
  "transition-colors duration-200 placeholder:text-mute/50 focus:border-ink";

const primaryButton =
  "inline-flex items-center justify-center rounded-full bg-gold font-bold text-ink " +
  "cursor-pointer transition-[transform,box-shadow,background] duration-200 " +
  "[transition-timing-function:var(--ease-out-soft)] hover:-translate-y-0.5 hover:bg-gold-hover " +
  "hover:shadow-[0_16px_32px_-14px_rgba(245,204,71,.55)]";

export const metadata: Metadata = {
  title,
  description,
  // Unlisted ad page. /business-essentials/ is the page that should rank.
  robots: { index: false, follow: false },
  alternates: { canonical: path },
  openGraph: {
    title: "Business Essentials | Flowstate",
    description,
    url: path,
    images: [
      {
        url: "/assets/business-essentials/business-essentials-vsl-poster.jpg",
        width: 1920,
        height: 1080,
        alt: "Ivan Barnett introducing Business Essentials",
      },
    ],
  },
};

export default function Page() {
  return (
    <>
      <header className="border-b border-hair bg-white">
        <div className="shell flex items-center justify-between gap-4 py-3">
          <Link href="/" className="text-[1.0625rem] font-[750] tracking-[-0.015em] text-ink">
            {site.name}
          </Link>
          <a href="#book-call" className={`${primaryButton} min-h-11 px-5 py-2 text-[0.875rem]`}>
            Book a free audit
          </a>
        </div>
      </header>

      <main id="main" className="shell pb-16 pt-5 sm:pt-6">
        <div className="mx-auto max-w-[40rem]">
          <p className="eyebrow mb-3 text-atlantic">Business Essentials</p>
          <h1 className="text-balance text-[clamp(1.9rem,3.4vw,2.7rem)] font-extrabold leading-[1.08] tracking-[-0.035em] text-ink">
            Business Essentials: the{" "}
            <span className="box-decoration-clone bg-gold px-1.5 text-ink">AI foundation</span>{" "}
            for your trade business
          </h1>
          <p className="mt-3 text-balance text-[clamp(1.25rem,2.2vw,1.5rem)] font-[750] leading-snug tracking-[-0.02em] text-ink sm:mt-2">
            Running your business better, faster, cheaper
          </p>
          <p className="mt-3 text-[1.0625rem] leading-relaxed text-mute sm:mt-2">
            Your enquiries answered, your quotes followed up and your invoices chased, set up around how your business already runs. It drafts. You approve. Nothing goes to a customer until you say yes.
          </p>

          <figure className="mt-5">
            <video
              className="vsl block aspect-video w-full rounded-2xl bg-black"
              aria-label="Ivan explains Business Essentials for New Zealand trade businesses"
              title="Ivan explains Business Essentials"
              controls
              playsInline
              preload="metadata"
              poster="/assets/business-essentials/business-essentials-vsl-poster.jpg"
              width={1920}
              height={1080}
              data-name="Business Essentials"
            >
              <source src="/assets/business-essentials/business-essentials-vsl.mp4" type="video/mp4" />
            </video>
            <figcaption className="mt-2 text-center text-sm leading-relaxed text-mute">
              Ivan on what Business Essentials sets up. Just under 3 minutes, with sound.
            </figcaption>
          </figure>

          <section
            id="book-call"
            className="mt-5 scroll-mt-6 border-t border-hair pt-5 sm:rounded-2xl sm:border sm:bg-white sm:p-8 sm:pt-3 sm:shadow-[0_24px_60px_-40px_rgba(6,40,61,0.45)]"
            aria-labelledby="book-title"
          >
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-mute">
              Step 1 of 2 · Your details
            </p>
            <h2 id="book-title" className="mt-2 text-[clamp(1.6rem,2.8vw,2rem)] font-bold leading-[1.15] tracking-[-0.03em] text-ink">
              Book your free 30-minute audit.
            </h2>
            <p className="mt-3 max-w-[42ch] text-[0.98rem] leading-relaxed text-mute">
              Leave your details, then choose a time. It takes about 30 minutes. Tell me what&apos;s taking up your time. You&apos;ll leave knowing what I&apos;d look at first. If I can&apos;t help, I&apos;ll say so. The diagnostic is quoted separately.
            </p>

            <form
              id="essentials-booking"
              name="ai-makeover"
              method="POST"
              action={path}
              data-netlify="true"
              netlify-honeypot="bot-field"
              data-offer="Business Essentials"
              className="mt-8"
            >
              <input type="hidden" name="form-name" value="ai-makeover" />
              <input type="hidden" name="ad_id" />
              <input type="hidden" name="utm_source" defaultValue="flowstate" />
              <input type="hidden" name="utm_medium" defaultValue="direct-booking" />
              <input type="hidden" name="utm_campaign" defaultValue="business-essentials" />
              <input type="hidden" name="utm_content" />
              <input type="hidden" name="utm_term" />
              <input type="hidden" name="landing_path" defaultValue={path} />
              <input type="hidden" name="fbclid" />
              <input type="hidden" name="fbc" />
              <input type="hidden" name="fbp" />
              <p className="hidden" aria-hidden="true">
                <label>
                  Leave this empty if you&apos;re human:{" "}
                  <input name="bot-field" tabIndex={-1} autoComplete="off" />
                </label>
              </p>

              <div className="grid gap-6">
                <div>
                  <label htmlFor="ess-name" className="mb-1.5 block text-[0.8125rem] font-medium text-mute">Name</label>
                  <input id="ess-name" name="name" type="text" autoComplete="name" maxLength={120} required className={field} />
                </div>
                <div>
                  <label htmlFor="ess-phone" className="mb-1.5 block text-[0.8125rem] font-medium text-mute">Phone</label>
                  <input id="ess-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} required className={field} />
                </div>
                <div>
                  <label htmlFor="ess-email" className="mb-1.5 block text-[0.8125rem] font-medium text-mute">Email</label>
                  <input id="ess-email" name="email" type="email" autoComplete="email" maxLength={200} required className={field} />
                </div>
                <div>
                  <label htmlFor="ess-customer-type" className="mb-1.5 block text-[0.8125rem] font-medium text-mute">Which best describes you?</label>
                  <select id="ess-customer-type" name="customer_type" required className={field}>
                    <option value="">Choose an option</option>
                    <option value="electrical_owner">Electrical business owner</option>
                    <option value="other_trade_owner">Owner of another trade business</option>
                    <option value="employee_apprentice">Employee or apprentice</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <button type="submit" className={`${primaryButton} mt-8 min-h-12 w-full px-7 py-3 text-[0.95rem] sm:w-auto`}>
                Continue to choose a time
              </button>
              <p data-feedback role="status" aria-live="polite" className="mt-3 min-h-[1.25em] text-sm text-ink" />
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-mute">
                Next: choose a time in the calendar. I&apos;ll use your details to contact you about the call.{" "}
                <Link className="underline decoration-hair underline-offset-4 hover:decoration-atlantic" href="/quoting-privacy/">
                  Privacy notice
                </Link>
                . Or call Ivan on{" "}
                <a className="underline decoration-hair underline-offset-4 hover:decoration-atlantic" href={site.phoneHref}>
                  {site.phone}
                </a>
                .
              </p>
            </form>

            <div
              className="booking mt-10 border-t border-hair pt-8"
              data-after-lead
              hidden
              data-calendly-background="ffffff"
              data-calendly-text="06283d"
              data-calendly-primary="0f4b70"
            >
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-mute">
                Step 2 of 2 · Your call
              </p>
              <h2 className="mt-2 text-[clamp(1.45rem,2.4vw,1.75rem)] font-bold leading-[1.15] tracking-[-0.03em] text-ink">
                Choose a time that suits you.
              </h2>
              <a href={calendly} className={`${primaryButton} mt-6 min-h-12 px-7 py-3 text-[0.95rem]`}>
                Choose a time
              </a>
              <p className="mt-3 text-[0.8125rem] text-mute">Free · 30 minutes with Ivan</p>
            </div>
            <noscript>
              <p className="mt-4 text-sm text-mute">
                You can also{" "}
                <a className="underline decoration-hair underline-offset-4" href={calendly}>
                  book your free 30-minute audit directly
                </a>
                .
              </p>
            </noscript>
          </section>
        </div>

        <section className="mx-auto mt-16 max-w-[72rem] border-t border-hair pt-9">
          <span className="mb-3 block h-1 w-10 bg-gold" aria-hidden="true" />
          <h2 className="h-sec max-w-[28ch] text-ink">In short</h2>
          <p className="mt-4 max-w-[65ch] text-[1.15rem] font-[750] leading-snug tracking-[-0.02em] text-ink">
            Business Essentials is Flowstate&apos;s starting package for New Zealand electrical and trade businesses. It sets up AI around your pricing, your jobs and the way you talk to customers, so enquiry replies, quote follow-ups, invoice reminders and review requests are drafted for you to approve. Later automations use that same knowledge of the business.
          </p>
        </section>

        <section className="mx-auto mt-16 max-w-[72rem] border-t border-hair pt-9">
          <span className="mb-3 block h-1 w-10 bg-gold" aria-hidden="true" />
          <h2 className="h-sec max-w-[28ch] text-ink">What&apos;s included</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {included.map(([itemTitle, body]) => (
              <li key={itemTitle} className="rounded-2xl border border-hair bg-white p-5">
                <h3 className="text-[1.05rem] font-[750] tracking-[-0.015em] text-ink">{itemTitle}</h3>
                <p className="mt-2 text-[1.02rem] leading-relaxed text-mute">{body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
            It drafts. You approve. Nothing goes out to a customer until you say yes. Once you trust it, you can let parts of it run on their own.
          </p>
        </section>

        <section className="mx-auto mt-16 max-w-[72rem] border-t border-hair pt-9">
          <span className="mb-3 block h-1 w-10 bg-gold" aria-hidden="true" />
          <h2 className="h-sec max-w-[28ch] text-ink">Who it&apos;s for</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {suits.map((item) => (
              <li key={item} className="rounded-2xl border border-hair bg-white p-5 text-[1.02rem] leading-relaxed text-mute">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto mt-16 max-w-[72rem] border-t border-hair pt-9">
          <span className="mb-3 block h-1 w-10 bg-gold" aria-hidden="true" />
          <h2 className="h-sec max-w-[28ch] text-ink">How it works</h2>
          <ol className="mt-8 max-w-[68rem]">
            <Step n="1" title="Book a free 30-minute audit" last={false}>
              <p>
                It takes about 30 minutes. Tell me what&apos;s taking up your time. You&apos;ll leave knowing what I&apos;d look at first. If I can&apos;t help, I&apos;ll say so.
              </p>
            </Step>
            <Step n="2" title="A paid workflow diagnostic" last={false}>
              <p>
                We look at your enquiries, quotes, invoices and the software you already use. The diagnostic scope and fee are agreed before it starts, and you get a prioritised roadmap.
              </p>
            </Step>
            <Step n="3" title="The build" last>
              <p>You get a clear scope and fee for Business Essentials before any build starts. You approve what goes to customers.</p>
            </Step>
          </ol>
        </section>

        <section className="mx-auto mt-16 max-w-[72rem] border-t border-hair pt-9">
          <span className="mb-3 block h-1 w-10 bg-gold" aria-hidden="true" />
          <h2 className="h-sec max-w-[28ch] text-ink">Who you&apos;ll be working with</h2>
          <div className="mt-6 grid items-start gap-7 sm:grid-cols-[11rem_1fr]">
            <Image
              src="/assets/team/ivan.jpg"
              alt="Ivan Barnett, founder of Flowstate"
              width={900}
              height={1200}
              sizes="(max-width: 639px) 240px, 176px"
              className="h-auto w-full max-w-[15rem] rounded-xl"
            />
            <div>
              <p className="max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
                I&apos;m Ivan Barnett. I spent four years in the trades, most recently as an electrical apprentice. I&apos;ve been on the tools and on the jobs. I build the systems myself, so the person you talk to on the call is the person setting it up.
              </p>
              <p className="mt-6">
                <a href="#book-call" className={`${primaryButton} min-h-12 px-7 py-3 text-[0.95rem]`}>
                  Book a free 30-minute audit
                </a>
              </p>
              <p className="mt-6">
                <Link className="font-semibold text-atlantic underline underline-offset-4" href="/about/">
                  More about who you&apos;d be working with →
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        #book-call .calendly-inline-widget{min-width:0;height:740px;margin-top:24px;border:1px solid #d6e4ec;border-radius:16px;overflow:hidden;background:#fff}
        #book-call .small{margin:14px 0 0;font-size:0.8125rem;line-height:1.5;color:#3f5f73}
        #book-call .small a{color:#0f4b70}
        @media(max-width:700px){#book-call .calendly-inline-widget{height:1040px}}
      `}</style>
      <Script src="/assets/quoting/analytics.js?v=2" strategy="afterInteractive" />
      <Script src="/assets/quoting/meta-click.js?v=1" strategy="afterInteractive" />
      <Script src="/assets/business-essentials/landing.js?v=1" strategy="afterInteractive" />
      <Script src="/assets/quoting/booking.js?v=6" strategy="afterInteractive" />
    </>
  );
}

function Step({
  n,
  title,
  last,
  children,
}: {
  n: string;
  title: string;
  last: boolean;
  children: ReactNode;
}) {
  return (
    <li className="grid grid-cols-[3rem_1fr] gap-4 sm:grid-cols-[3.5rem_1fr]">
      <div className="flex flex-col items-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-lg font-extrabold text-ink">
          {n}
        </span>
        {last ? null : <span className="mt-2 w-px flex-1 bg-hair" aria-hidden="true" />}
      </div>
      <div className={`max-w-[65ch] space-y-3 text-[1.0625rem] leading-relaxed text-mute ${last ? "" : "pb-10"}`}>
        <h3 className="text-xl font-bold text-ink">{title}</h3>
        {children}
      </div>
    </li>
  );
}
