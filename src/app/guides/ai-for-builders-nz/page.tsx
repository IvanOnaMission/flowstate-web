import AnswerPage, { answerMetadata } from "@/components/AnswerPage";

// Ivan's answers Q9 and Q20 (D12, D25 a, m). Q20: no "95%" (no percentages on public pages) and
// no "we work with" until Ivan confirms whose business it is (status.md, questions for Ivan).
const page = {
  title: "How NZ builders and tradies use AI to cut admin",
  description: "Flowstate's view on which admin a builder, plumber or electrician can hand to AI today, what stays with you, and what the trade businesses getting ahead are doing differently.",
  path: "/guides/ai-for-builders-nz/",
  sections: [
    {
      q: "How can a NZ builder use AI to cut admin?",
      a: [
        "Start with whatever is slowing your growth down the most. For most trade businesses it's one of these: getting new leads; pricing quotes faster; landing more jobs; speeding up admin; answering emails; bringing everything together so it's all on one screen. Whatever's costing you the most is the first thing Flowstate looks at.",
        "All of these can be handed to AI today, as long as it drafts and you approve. What it can't do is price jobs on its own or sign off compliance paperwork, that stays with you.",
      ],
    },
    {
      q: "How are NZ builders, plumbers and electricians using AI in 2026?",
      a: [
        "The ones getting ahead are using it on the admin, not the tools. One Auckland electrical business has quotes coming back almost fully built, an AI assistant with its own email and phone line, and a review system that added 150 reviews in three months.",
        "Most trade businesses Flowstate talks to are still using ChatGPT to write scopes or emails, which is a start, but it doesn't know their prices or connect to their software.",
        "The ones doing it properly treat AI as part of how the business runs, not a tool on the side. They think of it like a new employee: you bring it in, train it on your systems and software, and once it's learned something it doesn't forget. That's what takes the repetitive admin off people who don't need to be doing it anymore.",
      ],
    },
  ],
} as const;

export const metadata = answerMetadata(page);

export default function Page() {
  return <AnswerPage {...page} />;
}
