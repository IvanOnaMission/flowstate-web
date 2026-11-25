import AnswerPage, { answerMetadata } from "@/components/AnswerPage";

// Ivan's answers Q5 and Q4 (D25 a, k). D16: never say Flowstate doesn't sell a receptionist, and
// never offer one as a product. Q4's caller split is described without numbers (no percentages).
const page = {
  title: "AI receptionist and phone answering for NZ tradies and electricians",
  description: "Flowstate's view on AI phone answering: what AI can do on the phone for a trade business today, why a person should still book the job, and when an AI receptionist is worth having.",
  path: "/ai-receptionist-for-tradies/",
  sections: [
    {
      q: "Can AI answer my phone and book jobs for my electrical business in NZ?",
      a: [
        "It can answer and take the details, and then you or the office call back and book it.",
        "I wouldn't have it booking jobs straight into your calendar on its own, customers don't trust it with that yet and you lose control of the diary.",
        "The way Flowstate sets things up, the AI captures the job and puts it in front of you, and you say yes.",
      ],
    },
    {
      q: "Is an AI receptionist worth it for a tradie?",
      a: [
        "Flowstate's honest answer: as a backstop, yes; as a replacement for a person, not yet.",
        "What Jordan's found running one is that some callers are fine with it, some hate it, and the rest push through. It's better than voicemail.",
        "If you set one up, have it take basic details and then you ring them back as a human.",
      ],
    },
  ],
} as const;

export const metadata = answerMetadata(page);

export default function Page() {
  return <AnswerPage {...page} />;
}
