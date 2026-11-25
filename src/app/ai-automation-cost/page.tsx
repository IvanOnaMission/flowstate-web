import AnswerPage, { answerMetadata } from "@/components/AnswerPage";

// Ivan's answers Q1 to Q3 (docs/content/answers-batch-1.md). No prices or figures (D06).
const page = {
  title: "How much does AI automation cost for a small trade business in NZ?",
  description: "There's no set price list. Flowstate works the cost out from what the problem is costing you, as a one-off fee or a monthly retainer, and the build has to pay for itself.",
  path: "/ai-automation-cost/",
  sections: [
    {
      q: "How much does AI automation cost for a small trade business in NZ?",
      a: [
        "It depends on what you're after. If it's a one-off build, it's one fee up front. If you want ongoing help, with Flowstate maintaining it and building more over time, there's a monthly retainer.",
        "The price comes down to the size of the business and how much work you want done, and Flowstate works it out from what the problem is costing you. If someone's losing five hours a week to quoting, that's the number Flowstate starts from, and the build has to pay for itself off that. On top of that you pay your own running costs for hosting and AI.",
        "It starts with a free 30-minute call. If it's a fit, a paid diagnostic reviews how your business works and gives you a prioritised roadmap, and you and Flowstate agree the scope and rate before any build starts.",
      ],
    },
    {
      q: "How long until AI automation pays for itself?",
      a: [
        "It depends on what you do with the time you get back. The build pays for itself when the owner puts those hours into work that pushes the business forward.",
        "Say AI lets your estimator get five more quotes out each week. If you've got the demand, that's five more chances to win a job every week, and the build pays for itself pretty quickly. If the saved time just disappears into other admin, it takes a lot longer.",
        "Before Flowstate builds anything, it works it out as hours saved a week times your hourly rate times 52, so you know what it's worth going in.",
      ],
    },
    {
      q: "Is AI worth it for a business with 1 to 5 staff?",
      a: [
        "Yes. AI is worth it for any size of business, from one person up to a big company. What it does is take the repetitive parts of someone's job off them, the stuff they don't need to be doing anymore, so they can spend that time on the higher-priority work that grows the business.",
        "In a 1 to 5 person business that's usually the owner doing the quoting, invoicing and chasing on top of the actual work, so that's where it helps the most. For a small team Flowstate would start with the one or two jobs that eat the most time rather than building everything at once.",
      ],
    },
  ],
} as const;

export const metadata = answerMetadata(page);

export default function Page() {
  return <AnswerPage {...page} />;
}
