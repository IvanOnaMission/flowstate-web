import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";
import FaqBlock from "@/components/FaqBlock";
import StructuredData from "@/components/StructuredData";
import { site } from "@/lib/site";

const path = "/business-essentials/";
const title = "Business Essentials | AI Foundation for NZ Trades | Flowstate";
const description =
  "Business Essentials sets up the AI foundation for your NZ trade business: enquiries answered, quotes followed up, invoices chased. You approve everything.";

const faqs = [
  {
    question: "What is Business Essentials?",
    answer:
      "Business Essentials is Flowstate's starting AI package for New Zealand electrical and trade businesses. It sets up AI around your pricing, jobs and customer communication so enquiry replies, quote follow-ups, invoice reminders and review requests are drafted for you to approve.",
  },
  {
    question: "Who is Business Essentials for?",
    answer:
      "It's for owners of electrical and trade businesses in New Zealand who still handle the quoting, chasing and admin themselves and want that repeat work taken off them.",
  },
  {
    question: "What does Business Essentials include?",
    answer:
      "Enquiry replies, quote follow-ups, invoice reminders, review requests, an AI helper your team can ask on site, less double handling between email and your software, a view of how many quotes turn into jobs, and one custom dashboard. You approve anything that goes to a customer.",
  },
  {
    question: "Will AI send messages to my customers without me checking?",
    answer:
      "No. Business Essentials drafts and you approve. Nothing goes out to a customer until you say yes. Once you trust it, you can choose to let parts of it run on their own.",
  },
  {
    question: "Why is it called a foundation?",
    answer:
      "Because AI is only as useful as what it knows about your business. Business Essentials captures your prices, job types and the way you work, and every automation added later builds on that same knowledge.",
  },
  {
    question: "Does it work with Fergus, Tradify or Xero?",
    answer:
      "We look at the software you already use before anything is agreed. Fergus, Tradify, Xero and Groundplan are the tools our quoting work connects to, where that software allows it. Your job management and accounting software runs the jobs and the books. Business Essentials handles the manual work around them that still lands on you.",
  },
  {
    question: "My job software is adding AI features. Do I still need this?",
    answer:
      "Job software AI usually works inside that one app. Replying to enquiries, chasing people and answering your team's questions still lands on you. Business Essentials is set up around the whole business, using the software you already have.",
  },
  {
    question: "Do I need to be good with technology?",
    answer:
      "No. If you can send a text, you can use it. You can learn as much or as little about AI as you like.",
  },
  {
    question: "Who sets it up?",
    answer:
      "Ivan Barnett, Flowstate's founder. He spent four years in the trades, most recently as an electrical apprentice, and he builds the systems himself. Flowstate is based in Auckland and works with trade businesses across New Zealand.",
  },
  {
    question: "What happens after setup?",
    answer:
      "You can carry on with ongoing support and add new automations as you find more work worth handing over. That's agreed with you as you go.",
  },
] as const;

const suits = [
  "You run an electrical or trade business in New Zealand and you're still the one doing the quoting, chasing and replying at night.",
  "Work keeps coming back to you because the answers live in your head.",
  "You already use job software such as Fergus or Tradify, and the manual work around it still lands on you.",
  "You want AI working in the business, whether you want to learn it yourself or have as little to do with it as possible.",
] as const;

const changes = [
  [
    "An enquiry comes in while you're on a job and sits there until tonight.",
    "New enquiries get a reply drafted with the right next step, so people hear back while they're still keen.",
  ],
  [
    "A quote goes out and nobody follows it up, so the job goes to whoever rang back first.",
    "Quotes that haven't been answered get a follow-up drafted at the right time, in your voice.",
  ],
  [
    "Invoices sit unpaid because chasing them is awkward and there's always something more urgent.",
    "Overdue invoices get polite reminders drafted, so you're not the one having the awkward conversation.",
  ],
  [
    "The same details get typed into email, the job software and the accounts.",
    "Fewer things get typed twice across email, job software and accounts.",
  ],
] as const;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: path,
    images: ["/assets/hero/workshop-hook.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <SiteNav />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${site.url}${path}#service`,
          name: "Business Essentials",
          serviceType: "AI implementation for trade businesses",
          description:
            "The AI foundation for New Zealand electrical and trade businesses: enquiry replies, quote follow-ups, invoice chasing, review requests, an on-site team helper and one dashboard, set up around your pricing and jobs. You approve everything before it goes to a customer.",
          provider: { "@id": `${site.url}/#organization` },
          areaServed: { "@type": "Country", name: "New Zealand" },
          audience: {
            "@type": "BusinessAudience",
            audienceType: "Electrical and trade businesses",
          },
          url: `${site.url}${path}`,
        }}
      />
      <main id="main" className="shell py-[clamp(3rem,6vw,5rem)]">
        <article className="max-w-[72rem]">
          <p className="eyebrow mb-5 text-atlantic">Business Essentials</p>
          <h1 className="h-hero max-w-[22ch] text-ink">
            Business Essentials: the{" "}
            <span className="bg-gold px-1.5 text-ink box-decoration-clone">AI foundation</span>{" "}
            for your trade business
          </h1>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
            Your enquiries answered, your quotes followed up and your invoices chased, set up around how your business already runs. It drafts. You approve. Nothing goes to a customer until you say yes.
          </p>
          <div className="mt-7">
            <CallButton tone="atlantic">Book a free introductory call</CallButton>
          </div>
          <p className="mt-3 max-w-[52ch] text-sm text-mute">
            About 30 minutes. Based in Auckland, working with electrical and trade businesses across New Zealand. The diagnostic is quoted separately.
          </p>

          <aside className="mt-10 max-w-[65ch] border-l-4 border-gold pl-6">
            <p className="eyebrow inline-block bg-gold px-2 py-1 text-ink">In short</p>
            <p className="mt-3 text-[1.15rem] font-[750] leading-snug tracking-[-0.02em] text-ink">
              Business Essentials is Flowstate&apos;s starting package for New Zealand electrical and trade businesses. It sets up AI around your pricing, your jobs and the way you talk to customers, so enquiry replies, quote follow-ups, invoice reminders and review requests are drafted for you to approve. Later automations use that same knowledge of the business.
            </p>
          </aside>

          <Section title="Who it's for">
            <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
              Business Essentials suits you if:
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {suits.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-hair bg-white p-5 text-[1.02rem] leading-relaxed text-mute"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
              It&apos;s probably not for you if you don&apos;t have steady work coming in yet, or you want a one-off chatbot on your website.
            </p>
          </Section>

          <Section title="The time goes in the van and at the kitchen table">
            <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="max-w-[65ch] space-y-4 text-[1.0625rem] leading-relaxed text-mute">
                <p>An enquiry comes in while you&apos;re on a job and sits there until tonight.</p>
                <p>
                  A quote goes out and nobody follows it up, so the job goes to whoever rang back first.
                </p>
                <p>
                  Invoices sit unpaid because chasing them is awkward and there&apos;s always something more urgent.
                </p>
                <p>
                  The boys ring you from site to ask something that&apos;s written down somewhere, if only they knew where. Then the same details get typed into email, the job software and the accounts.
                </p>
                <p>None of it is hard. It just never stops, and it all comes back to you.</p>
              </div>
              <Image
                src="/assets/hero/workshop-hook.webp"
                alt="A workshop with the owner's hi-vis vest and hard hat hanging on a hook, the crew still working behind"
                width={1280}
                height={720}
                sizes="(max-width: 1023px) 100vw, 28rem"
                loading="lazy"
                className="h-auto w-full rounded-2xl"
              />
            </div>
          </Section>

          <Section title="What changes">
            <div className="mt-6 grid gap-3">
              {changes.map(([before, after]) => (
                <div
                  key={before}
                  className="grid overflow-hidden rounded-2xl border border-hair md:grid-cols-2"
                >
                  <p className="bg-sky-50 p-5 text-[1.02rem] leading-relaxed text-mute">
                    <span className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink">
                      Before
                    </span>
                    {before}
                  </p>
                  <p className="border-t border-hair p-5 text-[1.02rem] leading-relaxed text-ink md:border-l md:border-t-0">
                    <span className="mb-2 inline-block bg-gold px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink">
                      After
                    </span>
                    <span className="mt-2 block">{after}</span>
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="What's included">
            <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
              We set Business Essentials up around your pricing, your jobs and how you talk to your customers. It covers:
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              <IncludeCard
                title="Enquiry replies"
                body="New enquiries get a reply drafted with the right next step, so people hear back while they're still keen."
              >
                <SmsMock />
              </IncludeCard>
              <IncludeCard
                title="Quote follow-ups"
                body="Quotes that haven't been answered get a follow-up drafted at the right time, in your voice."
              >
                <EmailMock />
              </IncludeCard>
              <IncludeCard
                title="Invoice reminders"
                body="Overdue invoices get polite reminders drafted, so you're not the one having the awkward conversation."
              >
                <InvoiceMock />
              </IncludeCard>
              <IncludeCard
                title="Review requests"
                body="Happy customers get asked for a review once the job is done."
              >
                <ReviewMock />
              </IncludeCard>
              <IncludeCard
                title="On-site helper"
                body="Your team can ask how you do things and get your answer, without ringing you."
              >
                <HelperMock />
              </IncludeCard>
              <IncludeCard
                title="Less double handling"
                body="Fewer things get typed twice across email, job software and accounts."
              >
                <OnceMock />
              </IncludeCard>
              <IncludeCard
                title="Quotes that turn into jobs"
                body="You can see how many quotes turn into jobs."
              >
                <WinMock />
              </IncludeCard>
              <IncludeCard
                title="One dashboard"
                body="All of it sits in one dashboard built for your business."
              >
                <DashboardMock />
              </IncludeCard>
            </ul>
            <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
              It drafts. You approve. Nothing goes out to a customer until you say yes. Once you trust it, you can let parts of it run on their own.
            </p>
          </Section>

          <Section title="Why we call it a foundation">
            <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="max-w-[65ch] space-y-4 text-[1.0625rem] leading-relaxed text-mute">
                <p>
                  AI is only as useful as what it knows about your business. Business Essentials is where it learns your prices, your job types, how you quote, and how you talk to customers.
                </p>
                <p>
                  We put it together from the parts that were a useful starting point on the businesses we&apos;ve built AI for so far. Once that groundwork is in place, each new automation is quicker to add because it uses the same knowledge.
                </p>
                <p>What it opens up next:</p>
                <ul className="grid gap-3 sm:grid-cols-3">
                  {[
                    "Faster quoting built on your own pricing.",
                    "More of the office work handled before it reaches you.",
                    "New automations as you spot more jobs worth handing over.",
                  ].map((item) => (
                    <li key={item} className="rounded-xl border border-hair p-4 text-[0.98rem] leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
                <p>Every couple of hours you get back can go into the next automation.</p>
              </div>
              <Image
                src="/assets/business-context.webp"
                alt="Illustration of business documents and processes feeding into AI."
                width={1200}
                height={800}
                sizes="(max-width: 1023px) 100vw, 32rem"
                loading="lazy"
                className="h-auto w-full rounded-2xl"
              />
            </div>
          </Section>

          <Section title="How it works">
            <ol className="mt-8 max-w-[68rem]">
              <TimelineStep n="1" title="Book a free introductory call" last={false}>
                <p>
                  It takes about 30 minutes. Tell me what&apos;s taking up your time. You&apos;ll leave knowing what I&apos;d look at first. If I can&apos;t help, I&apos;ll say so.
                </p>
              </TimelineStep>
              <TimelineStep n="2" title="A paid workflow diagnostic" last={false}>
                <p>
                  We look at your enquiries, quotes, invoices and the software you already use. The diagnostic scope and fee are agreed before it starts, and you get a prioritised roadmap.
                </p>
                <p>
                  Have a few recent examples ready, such as quotes, enquiries and invoices, plus access to the tools you already use. Before the diagnostic, we agree which workflows, records and people to include. You don&apos;t need to be technical. If you can send a text, you can use it.
                </p>
              </TimelineStep>
              <TimelineStep n="3" title="The build" last>
                <p className="font-[750] text-ink">A scope and fee before any build</p>
                <p>You get a clear scope and fee for Business Essentials before any build starts.</p>
                <p className="font-[750] text-ink">Setup, with your team</p>
                <p>We set Business Essentials up around your business and show you and your team how to use it.</p>
                <p className="font-[750] text-ink">You approve, then we keep improving</p>
                <p>You approve what goes to customers. Ongoing support and new automations are agreed as you go.</p>
              </TimelineStep>
            </ol>
          </Section>

          <Section title="Who you'll be working with">
            <div className="mt-6 grid items-start gap-7 sm:grid-cols-[11rem_1fr]">
              <Image
                src="/assets/team/ivan.jpg"
                alt="Ivan Barnett, founder of Flowstate"
                width={900}
                height={1200}
                sizes="(max-width: 639px) 240px, 176px"
                loading="lazy"
                className="h-auto w-full max-w-[15rem] rounded-xl"
              />
              <div>
                <p className="max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
                  I&apos;m Ivan Barnett. I spent four years in the trades, most recently as an electrical apprentice. I&apos;ve been on the tools and on the jobs. I build the systems myself, so the person you talk to on the call is the person setting it up.
                </p>
                <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
                  I take a few businesses at a time. If the calendar is full, I&apos;ll say so.
                </p>
                <p className="mt-6">
                  <Link className="font-semibold text-atlantic underline underline-offset-4" href="/about/">
                    More about who you&apos;d be working with →
                  </Link>
                </p>
              </div>
            </div>
          </Section>

          <FaqBlock faqs={faqs} path={path} accent />

          <Section title="Find out what to hand over first">
            <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
              Book a free introductory call. Tell me where the time goes and you&apos;ll leave knowing what I&apos;d look at first. If I can&apos;t help, I&apos;ll say so.
            </p>
            <div className="mt-7">
              <CallButton tone="atlantic">Book a free introductory call</CallButton>
            </div>
            <p className="mt-3 text-sm text-mute">
              Or call Ivan on{" "}
              <a className="underline decoration-hair underline-offset-4 hover:decoration-atlantic" href={site.phoneHref}>
                {site.phone}
              </a>{" "}
              or email{" "}
              <a className="underline decoration-hair underline-offset-4 hover:decoration-atlantic" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              .
            </p>
          </Section>
        </article>
      </main>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-16 border-t border-hair pt-9">
      <span className="mb-3 block h-1 w-10 bg-gold" aria-hidden="true" />
      <h2 className="h-sec max-w-[28ch] text-ink">{title}</h2>
      {children}
    </section>
  );
}

function IncludeCard({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <li className="flex flex-col overflow-hidden rounded-2xl border border-hair bg-white">
      <div className="border-b border-hair bg-sky-50 p-4">{children}</div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[1.05rem] font-[750] tracking-[-0.015em] text-ink">{title}</h3>
        <p className="mt-2 text-[1.02rem] leading-relaxed text-mute">{body}</p>
      </div>
    </li>
  );
}

function ExampleFrame({ children }: { children: ReactNode }) {
  return (
    <figure>
      <figcaption className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-mute">
        Example
      </figcaption>
      {children}
    </figure>
  );
}

function SmsMock() {
  return (
    <ExampleFrame>
      <div className="mx-auto max-w-[18rem] rounded-[1.4rem] border border-hair bg-white px-3 py-3">
        <p className="text-center text-[0.68rem] font-semibold text-mute">Messages</p>
        <p className="mt-2 text-[0.75rem] font-semibold text-ink">Sam</p>
        <p className="mt-1 max-w-[85%] rounded-2xl rounded-tl-sm bg-sky-50 px-3 py-2 text-[0.85rem] leading-snug text-ink">
          Can you look at a switchboard?
        </p>
        <p className="ml-auto mt-2 max-w-[90%] rounded-2xl rounded-tr-sm bg-gold px-3 py-2 text-[0.85rem] leading-snug text-ink">
          Thanks Sam. I can come past Thursday morning.
        </p>
        <p className="mt-1 text-right text-[0.68rem] text-mute">Draft, waiting for you</p>
      </div>
    </ExampleFrame>
  );
}

function EmailMock() {
  return (
    <ExampleFrame>
      <div className="rounded-xl border border-hair bg-white p-4 text-[0.9rem] leading-snug">
        <p className="text-[0.75rem] text-mute">To Sam</p>
        <p className="mt-1 font-[750] text-ink">Kitchen rewire quote</p>
        <p className="mt-3 text-ink">
          Just checking you saw the quote. Happy to talk it through.
        </p>
        <p className="mt-3 text-[0.75rem] text-mute">Follow-up draft</p>
      </div>
    </ExampleFrame>
  );
}

function InvoiceMock() {
  return (
    <ExampleFrame>
      <div className="rounded-xl border border-hair bg-white p-4">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-mute">Invoice</p>
        <p className="mt-1 font-[750] text-ink">Kitchen rewire</p>
        <p className="mt-3 text-[0.9rem] leading-snug text-ink">
          A polite reminder is drafted. You send it.
        </p>
      </div>
    </ExampleFrame>
  );
}

function ReviewMock() {
  return (
    <ExampleFrame>
      <div className="rounded-xl border border-hair bg-white p-4">
        <p className="text-[0.75rem] text-mute">Job finished</p>
        <p className="mt-1 font-[750] text-ink">Ask Sam for a review?</p>
        <p className="mt-2 text-[0.9rem] leading-snug text-ink">Kitchen rewire is done.</p>
      </div>
    </ExampleFrame>
  );
}

function HelperMock() {
  return (
    <ExampleFrame>
      <div className="space-y-2 text-[0.85rem] leading-snug">
        <p className="max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-ink">
          How do we leave the board on a kitchen rewire?
        </p>
        <p className="ml-auto max-w-[92%] rounded-2xl rounded-tr-sm bg-gold px-3 py-2 text-ink">
          Your answer shows here, so they don&apos;t have to ring you.
        </p>
      </div>
    </ExampleFrame>
  );
}

function OnceMock() {
  return (
    <ExampleFrame>
      <div className="rounded-xl border border-hair bg-white p-4">
        <p className="text-[0.85rem] font-[750] text-ink">Kitchen rewire</p>
        <p className="mt-1 text-[0.75rem] text-mute">Entered once</p>
        <ul className="mt-3 flex flex-wrap gap-2 text-[0.75rem] font-semibold text-ink">
          {["Email", "Job software", "Accounts"].map((place) => (
            <li key={place} className="rounded-full border border-hair px-3 py-1">
              {place}
            </li>
          ))}
        </ul>
      </div>
    </ExampleFrame>
  );
}

function WinMock() {
  return (
    <ExampleFrame>
      <div className="grid grid-cols-2 gap-2">
        {["Quotes", "Jobs"].map((label) => (
          <div key={label} className="rounded-xl border border-hair bg-white p-3">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-mute">{label}</p>
            <span className="mt-3 block h-2 w-10 rounded-full bg-gold" aria-hidden="true" />
          </div>
        ))}
      </div>
    </ExampleFrame>
  );
}

function DashboardMock() {
  return (
    <ExampleFrame>
      <ul className="grid grid-cols-2 gap-2">
        {["Enquiries", "Quotes", "Invoices", "Reviews"].map((label) => (
          <li key={label} className="rounded-xl border border-hair bg-white px-3 py-3 text-[0.85rem] font-semibold text-ink">
            {label}
          </li>
        ))}
      </ul>
    </ExampleFrame>
  );
}

function TimelineStep({
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
