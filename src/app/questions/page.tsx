import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";
import StructuredData from "@/components/StructuredData";
import { site, callPromise } from "@/lib/site";

// The FAQ hub: short answers to Ivan's batch 1 questions (docs/content/answers-batch-1.md, D25),
// each linking to the page that answers it in full. Held: Q15 hosting, Q16 package terms, Q14 draft
// checks and "Flow State fixes it", the D16 receptionist line.
type Item = { q: string; a: string; more?: { href: string; label: string } };

const groups: { title: string; items: Item[] }[] = [
  {
    title: "Cost and value",
    items: [
      { q: "How much does AI automation cost for a small trade business in NZ?", a: "Flow State has no set price list. It's one fee up front for a one-off build, or a monthly retainer if you want it maintained and added to. Flow State works the price out from the size of the business and what the problem is costing you, and the build has to pay for itself. You also pay your own running costs for hosting and AI.", more: { href: "/ai-automation-cost/", label: "What AI automation costs" } },
      { q: "How long until AI automation pays for itself?", a: "It depends on what you do with the time you get back. Before Flow State builds anything, it works it out as hours saved a week times your hourly rate times 52, so you know what it's worth going in.", more: { href: "/ai-automation-cost/", label: "When it pays for itself" } },
      { q: "Is AI worth it for a business with 1 to 5 staff?", a: "Yes. In a small business it's usually the owner doing the quoting, invoicing and chasing on top of the actual work, so that's where it helps most. Flow State would start with the one or two jobs that eat the most time.", more: { href: "/ai-automation-cost/", label: "AI for a small team" } },
    ],
  },
  {
    title: "What it does",
    items: [
      { q: "Is an AI receptionist worth it for a tradie?", a: "Flow State's answer: as a backstop, yes. As a replacement for a person, not yet. Have it take basic details and then ring the customer back yourself.", more: { href: "/blog/ai-receptionist-for-tradies/", label: "AI receptionist and phone answering" } },
      { q: "Can AI answer my phone and book jobs while I'm on site?", a: "Flow State's answer: AI can answer and take the details, then you or the office call back and book it. The way Flow State sets things up, the AI captures the job and puts it in front of you, and you say yes.", more: { href: "/blog/ai-receptionist-for-tradies/", label: "AI phone answering for electricians" } },
      { q: "Can AI write my quotes and invoices?", a: "It can prepare them, you approve them. The AI drafts the quote or invoice in Xero or your job software from your price list and the job notes, and anything it can't price gets marked CHECK instead of a made-up number. Flow State can also pull in your supplier pricing and put the quote together as a PDF quote pack from a proposal template.", more: { href: "/ai-quoting-for-electricians/", label: "AI quoting for electricians" } },
      { q: "How can AI follow up leads I don't have time to call back?", a: "With Flow State's setup, new enquiries get a reply drafted within minutes, and quotes with no reply get followed up at 3 and 7 days. They start as drafts you approve, and once you trust it you can switch it to send on its own. It stops as soon as someone replies.", more: { href: "/quote-and-lead-follow-up/", label: "Quote and lead follow-up" } },
      { q: "Can AI get me more Google reviews?", a: "Flow State sets it up so you ask every customer. When a job's paid it drafts a review request from your own phone or email, and skips anyone asked in the last year. Never ask for 5 stars or only ask happy customers: Google bans both.", more: { href: "/quote-and-lead-follow-up/", label: "Getting more Google reviews" } },
      { q: "What admin can a tradie hand over to AI today?", a: "Flow State starts with whatever is slowing your growth down the most: getting leads, pricing quotes, landing jobs, admin, emails, or getting everything on one screen. AI drafts and you approve. It can't price jobs on its own or sign off compliance paperwork.", more: { href: "/guides/ai-for-builders-nz/", label: "How NZ builders use AI" } },
    ],
  },
  {
    title: "Job software",
    items: [
      { q: "What can you automate in Fergus?", a: "Through Fergus's API, Flow State can create quotes from you talking into your phone, update jobs, schedule work and pull job and financial info together. Fergus's API doesn't do invoices or payments, so those run through Xero.", more: { href: "/fergus-automation/", label: "Fergus automation" } },
      { q: "What can you automate in Simpro?", a: "Flow State can automate quotes, invoices, payments, suppliers, purchase orders and stock, on Simpro's Premium plan with Simpro's approval. Jordan, who looks after strategy at Flow State, runs his electrical business fully automated through Simpro.", more: { href: "/simpro-automation/", label: "Simpro automation" } },
      { q: "Does it work with Tradify, ServiceM8, AroFlo or Xero?", a: "Yes, Flow State can work with any job management software. Xero and AroFlo have full API access. Tradify doesn't, so there the AI works through the browser, which is more fiddly and can break when the screens change.", more: { href: "/guides/job-software-or-custom-ai/", label: "Job software or custom AI" } },
    ],
  },
  {
    title: "Trust and risk",
    items: [
      { q: "Will AI sound robotic to my customers?", a: "Not if it's set up right. Flow State builds a voice profile from your meetings, emails and texts, so it writes the way you talk, with a different tone for a supplier than a new customer. You can tell it which words to use and never use. Everything goes out from your own email or phone, signed by you, and you see the draft first." },
      { q: "What happens if the AI makes a mistake with a customer?", a: "With Flow State, drafts come to you to approve by default. Anything it isn't sure about gets marked CHECK rather than guessed, and every helper is tested on real past jobs before it goes live. If something Flow State built isn't working right, fixes come within the support agreed for your business." },
      { q: "Do I need to be good with tech to use this?", a: "No. If you can use a phone and send an email you'll be fine. It runs in the background on the software you already use, and the drafts come to you to approve. Flow State does the setup, and support is agreed for your business." },
    ],
  },
  {
    title: "Getting started",
    items: [
      { q: "Who can automate my trade business in NZ, and what makes Flow State different?", a: `${site.entity} It's trained and backed by a real electrical company that's been automating its own business for the last six years, and it has delivered for 10+ clients across different trades. Flow State builds on the software you already use, and if AI isn't the answer for something, it'll tell you straight. The goal is to be New Zealand's go-to for AI in trade businesses.`, more: { href: "/about/", label: "About Flow State" } },
      { q: "What does getting set up look like, and how long does it take?", a: "Flow State starts with a free 30-minute call to work out where the time's going. If it's a fit, Flow State builds a custom implementation plan. Then it builds the foundation: set up the accounts in your name, connect your job software and Xero and build the AI brain of your prices, rules and processes, which takes 2 to 3 days. It runs on your own accounts, so you own it. After that it builds helpers one at a time, each tested on real past jobs.", more: { href: "/workflow-diagnostic/", label: "How getting started works" } },
      { q: "What do you need from me to get started?", a: "Flow State just needs 30 minutes to start. Once the build starts, it needs things like your price list, some past quotes and invoices, and access to your job software and Xero, which you log into yourself." },
    ],
  },
  {
    title: "Industry",
    items: [
      { q: "How are NZ builders, plumbers and electricians using AI in 2026?", a: "Flow State sees the ones getting ahead using it on the admin, not the tools. One Auckland electrical business has quotes coming back almost fully built, an AI assistant with its own email and phone line, and a review system that added 150 reviews in three months.", more: { href: "/guides/ai-for-builders-nz/", label: "How NZ trades use AI" } },
    ],
  },
];

const title = "Questions NZ tradies ask about AI automation";
const description = "Flow State's straight answers to tradies' questions about AI: cost, quoting, follow-up, reviews, phone answering, Fergus, Simpro and getting started.";
const path = "/questions/";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, images: ["/assets/hero/workshop-hook.jpg"] },
};

export default function QuestionsPage() {
  const all = groups.flatMap((g) => g.items);
  return (
    <>
      <SiteNav />
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${site.url}${path}#faq`,
        mainEntity: all.map((i) => ({
          "@type": "Question",
          name: i.q,
          acceptedAnswer: { "@type": "Answer", text: i.a },
        })),
      }} />
      <main id="main" className="shell py-[clamp(3rem,6vw,5rem)]">
        <article className="max-w-[52rem]">
          <h1 className="h-hero max-w-[24ch] text-ink">{title}</h1>
          <p className="mt-6 max-w-[65ch] text-[1.0625rem] font-semibold leading-relaxed text-ink">{site.entity}</p>
          <p className="mt-4 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">Answers from Ivan Barnett, Flow State&apos;s founder, to the questions trade business owners ask most. Each one links to a page with the full answer.</p>
          {groups.map((g) => (
            <section key={g.title}>
              <h2 className="h-sec mt-14 border-t border-hair pt-9 text-ink">{g.title}</h2>
              {g.items.map((i) => (
                <div key={i.q} className="mt-8">
                  <h3 className="max-w-[40ch] text-lg font-bold text-ink">{i.q}</h3>
                  <p className="mt-3 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{i.a}</p>
                  {i.more && (
                    <p className="mt-2"><Link className="font-semibold text-atlantic underline underline-offset-4" href={i.more.href}>{i.more.label} →</Link></p>
                  )}
                </div>
              ))}
            </section>
          ))}
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <CallButton tone="atlantic" />
            <a className="font-semibold text-atlantic underline underline-offset-4" href="/workflow-diagnostic/">See how getting started works</a>
          </div>
          <p className="mt-3 text-sm text-mute">{callPromise}</p>
        </article>
      </main>
    </>
  );
}
