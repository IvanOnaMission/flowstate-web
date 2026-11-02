import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";
import FaqBlock from "@/components/FaqBlock";

const path = "/ai-for-trades-businesses/";
const title = "AI for NZ trade businesses";
const description =
  "AI help for NZ electricians, plumbers, builders and HVAC businesses. Flowstate drafts the admin. You approve what a customer sees.";

const faqs = [
  {
    question: "What does AI for a trade business mean?",
    answer:
      "It means using AI to draft the repetitive admin around the tools: quoting, invoicing, job notes, follow-ups, scheduling and compliance paperwork. The owner checks the work and decides what a customer receives.",
  },
  {
    question: "Which trades does Flowstate work with?",
    answer:
      "Flowstate publishes the most detail for electricians. Plumbers, builders, HVAC businesses and other New Zealand trades can start the same way, with a free introductory call of about 30 minutes.",
  },
  {
    question: "Will messages go out to customers on their own?",
    answer:
      "Drafts wait for you. You approve enquiry replies, quotes and other customer messages before they go out. Letting a part of it send on its own is a later choice, once you trust it.",
  },
  {
    question: "Do I have to replace my job software?",
    answer:
      "Your job management and accounting software keeps running the jobs and the books. Flowstate works on the manual jobs around that software. Fergus, Tradify, Xero and Groundplan are the tools our quoting work connects to, where the software allows it. Any connection is checked before it is agreed.",
  },
  {
    question: "Who does the setup?",
    answer:
      "Ivan Barnett. He spent four years in the trades, most recently as an electrical apprentice, and he builds the systems himself. Flowstate is based in Auckland and works with trade businesses across New Zealand.",
  },
  {
    question: "Where should I read next?",
    answer:
      "Electricians can start with the electrician page and the quoting page. The guides cover where an electrical business can start, what to check on an AI quote, the manual work around job software, and admin around industrial electrical projects. Business Essentials is the starting package for the admin.",
  },
] as const;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    description,
    url: path,
    images: ["/assets/hero/workshop-hook.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <SiteNav />
      <main id="main" className="shell py-[clamp(3rem,6vw,5rem)]">
        <article className="max-w-[52rem]">
          <p className="eyebrow mb-5 text-atlantic">AI for trade businesses</p>
          <h1 className="h-hero max-w-[18ch] text-ink">
            AI for New Zealand <span className="bg-gold px-1.5 text-ink box-decoration-clone">trade businesses</span>
          </h1>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
            Electricians, plumbers, builders, HVAC and other tradies lose the same hours to admin once the tools are down. Enquiries, quotes, invoices, job notes and paperwork sit with the owner. Flowstate sets up AI to draft that work. You check it before a customer sees it.
          </p>
          <aside className="mt-10 max-w-[65ch] border-l-4 border-gold pl-6">
            <p className="eyebrow inline-block bg-gold px-2 py-1 text-ink">In short</p>
            <p className="mt-3 text-[1.15rem] font-[750] leading-snug tracking-[-0.02em] text-ink">
              Flowstate helps New Zealand trade businesses use AI to draft the repetitive admin around a job, from quoting and invoicing to job notes, follow-ups, scheduling and compliance paperwork, with the owner approving anything a customer sees.
            </p>
          </aside>
          <div className="mt-7">
            <CallButton tone="atlantic">Book a free introductory call</CallButton>
          </div>
          <p className="mt-3 text-sm text-mute">About 30 minutes. The diagnostic is quoted separately.</p>

          <h2 className="h-sec mb-3 mt-14 max-w-[28ch] border-t border-hair pt-9 text-ink">
            What AI can take off the admin
          </h2>
          <div className="mt-5 max-w-[65ch] space-y-4 text-[1.0625rem] leading-relaxed text-mute">
            <p>
              A diagnostic decides which of these are worth doing first. You still approve anything a customer sees.
            </p>
            <p>
              Quoting can start from the job notes, quantities and prices you already have. You check the scope and the numbers before anything is sent. Electricians can read the quoting workflow we are developing on its own page.
            </p>
            <p>
              Invoicing is often the same details typed again at the end of the day. AI can gather them into a draft invoice for someone to review.
            </p>
            <p>
              Job notes sit on a phone, in a notebook, or in someone&apos;s head. AI can turn them into a record the office can use, and point out what is missing.
            </p>
            <p>
              Follow-ups are the enquiry that landed while you were on the tools, and the quote that went quiet. AI can draft the reply or the nudge in your voice. You send it.
            </p>
            <p>
              Scheduling still needs a person to decide who is on which job. AI can draft the messages and the reminders. Whoever runs the diary still makes the booking.
            </p>
            <p>
              Compliance paperwork covers the forms, certificates and records that repeat on each job. AI can assemble a draft from the job details. The person who knows the job checks it before it is sent or lodged.
            </p>
          </div>

          <h2 className="h-sec mb-3 mt-14 max-w-[28ch] border-t border-hair pt-9 text-ink">
            How Flowstate does it
          </h2>
          <div className="mt-5 max-w-[65ch] space-y-4 text-[1.0625rem] leading-relaxed text-mute">
            <p>
              We start with a free introductory call of about 30 minutes. You bring one example of work that gets held up. If a paid diagnostic makes sense, we agree its scope and fee before it starts. The diagnostic looks at how work moves through the business and which jobs are worth handing to AI first. After that we agree what to build, and the rate.
            </p>
            <p>
              <Link className="font-semibold text-atlantic underline underline-offset-4" href="/business-essentials/">
                Business Essentials
              </Link>{" "}
              is the starting package. It learns your prices, job types and the way you talk to customers, then drafts enquiry replies, quote follow-ups, invoice reminders and review requests for you to approve.
            </p>
            <p>
              Ivan Barnett does the setup. He spent four years in the trades, most recently as an electrical apprentice, and he builds the systems himself. Flowstate is based in Auckland and works across New Zealand. The electrical pages go further, because that is where his time on the tools was.
            </p>
          </div>

          <h2 className="h-sec mb-3 mt-14 max-w-[28ch] border-t border-hair pt-9 text-ink">
            Where to go next
          </h2>
          <ul className="mt-5 max-w-[65ch] list-disc space-y-3 pl-6 text-[1.0625rem] leading-relaxed text-mute">
            <li>
              <Link className="font-semibold text-atlantic underline underline-offset-4" href="/ai-for-electricians/">
                AI for electricians
              </Link>
              , including industrial, commercial and residential work.
            </li>
            <li>
              <Link className="font-semibold text-atlantic underline underline-offset-4" href="/ai-quoting-for-electricians/">
                AI quoting for electricians
              </Link>
              , the workflow in development: you supply the job details, quantities and prices, and you review the draft.
            </li>
            <li>
              <Link className="font-semibold text-atlantic underline underline-offset-4" href="/guides/where-to-start-with-ai/">
                Where an electrical business can start with AI
              </Link>
              .
            </li>
            <li>
              <Link className="font-semibold text-atlantic underline underline-offset-4" href="/guides/ai-quoting-for-electricians/">
                What you still check on an AI quote
              </Link>
              .
            </li>
            <li>
              <Link className="font-semibold text-atlantic underline underline-offset-4" href="/guides/job-software-or-custom-ai/">
                The manual work around job software
              </Link>
              .
            </li>
            <li>
              <Link className="font-semibold text-atlantic underline underline-offset-4" href="/guides/ai-industrial-electrical-business/">
                Admin around industrial electrical projects
              </Link>
              .
            </li>
            <li>
              <Link className="font-semibold text-atlantic underline underline-offset-4" href="/services/">
                How the call, diagnostic and AI partnership work
              </Link>
              .
            </li>
          </ul>

          <FaqBlock faqs={faqs} path={path} />

          <h2 className="h-sec mb-3 mt-14 max-w-[24ch] border-t border-hair pt-9 text-ink">
            Bring one job that got stuck
          </h2>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
            A quote that sat too long, an enquiry you answered at 9pm, an invoice you meant to chase. The introductory call is free. If I can&apos;t help, I&apos;ll say so.
          </p>
          <div className="mt-7">
            <CallButton tone="atlantic">Book a free introductory call</CallButton>
          </div>
          <p className="mt-3 text-sm text-mute">Free · about 30 minutes · no pitch deck</p>
        </article>
      </main>
    </>
  );
}
