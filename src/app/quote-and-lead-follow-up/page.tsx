import AnswerPage, { answerMetadata } from "@/components/AnswerPage";

// Ivan's answers Q7 and Q8 (D25 a, e, f).
const page = {
  title: "AI quote and lead follow-up for NZ tradies",
  description: "How AI replies to new enquiries, follows up quotes nobody answered, and makes sure every customer gets asked for a Google review, with you approving drafts until you choose to let it send.",
  path: "/quote-and-lead-follow-up/",
  sections: [
    {
      q: "Who can set up AI to follow up quotes and leads for a NZ tradie?",
      a: [
        "Flow State sets this up for trade businesses. New enquiries get a reply drafted within minutes, asking the right questions, and quotes with no reply get followed up at 3 and 7 days until the customer answers.",
        "Flow State sets these up as drafts first that you approve, then once you trust it you can switch it to send on its own. It stops as soon as someone replies or says stop.",
      ],
    },
    {
      q: "Can AI get me more Google reviews?",
      a: [
        "Yeah, it can make sure you actually ask every customer. When a job's paid, it drafts a review request that goes from your own phone or email, signed by you, and it skips anyone you've already asked in the last year.",
        "It runs in the background, so asking stops relying on you remembering at the end of a long day.",
        "One rule we stick to: never ask for a 5-star review and never only ask the happy customers. Google bans both, and it can get reviews taken down.",
      ],
    },
  ],
} as const;

export const metadata = answerMetadata(page);

export default function Page() {
  return <AnswerPage {...page} />;
}
