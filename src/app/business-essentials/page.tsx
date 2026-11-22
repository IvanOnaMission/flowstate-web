import type { Metadata } from "next";
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
        <article className="max-w-[52rem]">
          <p className="eyebrow mb-5 text-atlantic">Business Essentials</p>
          <h1 className="h-hero max-w-[22ch] text-ink">
            Business Essentials: the AI foundation for your trade business
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

          <aside className="mt-10 max-w-[65ch] border-l-2 border-atlantic pl-6">
            <p className="eyebrow text-mute">In short</p>
            <p className="mt-3 text-[1.15rem] font-[750] leading-snug tracking-[-0.02em] text-ink">
              Business Essentials is Flowstate&apos;s starting package for New Zealand electrical and trade businesses. It sets up AI around your pricing, your jobs and the way you talk to customers, so enquiry replies, quote follow-ups, invoice reminders and review requests are drafted for you to approve. Later automations use that same knowledge of the business.
            </p>
          </aside>

          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">
            Who it&apos;s for
          </h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
            Business Essentials suits you if:
          </p>
          <ul className="mt-5 max-w-[65ch] list-disc space-y-3 pl-6 text-[1.0625rem] leading-relaxed text-mute">
            <li>You run an electrical or trade business in New Zealand and you&apos;re still the one doing the quoting, chasing and replying at night.</li>
            <li>Work keeps coming back to you because the answers live in your head.</li>
            <li>You already use job software such as Fergus or Tradify, and the manual work around it still lands on you.</li>
            <li>You want AI working in the business, whether you want to learn it yourself or have as little to do with it as possible.</li>
          </ul>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
            It&apos;s probably not for you if you don&apos;t have steady work coming in yet, or you want a one-off chatbot on your website.
          </p>

          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">
            The time goes in the van and at the kitchen table
          </h2>
          <div className="mt-5 max-w-[65ch] space-y-4 text-[1.0625rem] leading-relaxed text-mute">
            <p>
              An enquiry comes in while you&apos;re on a job and sits there until tonight. A quote goes out and nobody follows it up, so the job goes to whoever rang back first. Invoices sit unpaid because chasing them is awkward and there&apos;s always something more urgent. The boys ring you from site to ask something that&apos;s written down somewhere, if only they knew where. Then the same details get typed into email, the job software and the accounts.
            </p>
            <p>None of it is hard. It just never stops, and it all comes back to you.</p>
          </div>

          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">
            What&apos;s included
          </h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
            We set Business Essentials up around your pricing, your jobs and how you talk to your customers. It covers:
          </p>
          <ul className="mt-5 max-w-[65ch] list-disc space-y-3 pl-6 text-[1.0625rem] leading-relaxed text-mute">
            <li>New enquiries get a reply drafted with the right next step, so people hear back while they&apos;re still keen.</li>
            <li>Quotes that haven&apos;t been answered get a follow-up drafted at the right time, in your voice.</li>
            <li>Overdue invoices get polite reminders drafted, so you&apos;re not the one having the awkward conversation.</li>
            <li>Happy customers get asked for a review once the job is done.</li>
            <li>Your team can ask how you do things and get your answer, without ringing you.</li>
            <li>Fewer things get typed twice across email, job software and accounts.</li>
            <li>You can see how many quotes turn into jobs.</li>
            <li>All of it sits in one dashboard built for your business.</li>
          </ul>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
            It drafts. You approve. Nothing goes out to a customer until you say yes. Once you trust it, you can let parts of it run on their own.
          </p>

          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">
            Why we call it a foundation
          </h2>
          <div className="mt-5 max-w-[65ch] space-y-4 text-[1.0625rem] leading-relaxed text-mute">
            <p>
              AI is only as useful as what it knows about your business. Business Essentials is where it learns your prices, your job types, how you quote, and how you talk to customers.
            </p>
            <p>
              We put it together from the parts that were a useful starting point on the businesses we&apos;ve built AI for so far. Once that groundwork is in place, each new automation is quicker to add because it uses the same knowledge.
            </p>
            <p>What it opens up next:</p>
          </div>
          <ul className="mt-5 max-w-[65ch] list-disc space-y-3 pl-6 text-[1.0625rem] leading-relaxed text-mute">
            <li>Faster quoting built on your own pricing.</li>
            <li>More of the office work handled before it reaches you.</li>
            <li>New automations as you spot more jobs worth handing over.</li>
          </ul>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
            Every couple of hours you get back can go into the next automation.
          </p>

          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">
            How it works
          </h2>
          <h3 className="mt-8 text-xl font-bold text-ink">1. Book a free introductory call</h3>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
            It takes about 30 minutes. Tell me what&apos;s taking up your time. You&apos;ll leave knowing what I&apos;d look at first. If I can&apos;t help, I&apos;ll say so.
          </p>
          <h3 className="mt-8 text-xl font-bold text-ink">2. A paid workflow diagnostic</h3>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
            We look at your enquiries, quotes, invoices and the software you already use. The diagnostic scope and fee are agreed before it starts, and you get a prioritised roadmap.
          </p>
          <h3 className="mt-8 text-xl font-bold text-ink">3. A scope and fee before any build</h3>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
            You get a clear scope and fee for Business Essentials before any build starts.
          </p>
          <h3 className="mt-8 text-xl font-bold text-ink">4. Setup, with your team</h3>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
            We set Business Essentials up around your business and show you and your team how to use it.
          </p>
          <h3 className="mt-8 text-xl font-bold text-ink">5. You approve, then we keep improving</h3>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
            You approve what goes to customers. Ongoing support and new automations are agreed as you go.
          </p>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
            Have a few recent examples ready, such as quotes, enquiries and invoices, plus access to the tools you already use. Before the diagnostic, we agree which workflows, records and people to include. You don&apos;t need to be technical. If you can send a text, you can use it.
          </p>

          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">
            Who you&apos;ll be working with
          </h2>
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

          <FaqBlock faqs={faqs} path={path} />

          <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">
            Find out what to hand over first
          </h2>
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
        </article>
      </main>
    </>
  );
}
