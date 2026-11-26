import AnswerPage, { answerMetadata } from "@/components/AnswerPage";

// Ivan's answer Q10 (D25 h).
const page = {
  title: "Fergus automation for NZ trade businesses",
  description: "What AI can automate inside Fergus, what Fergus's API can't do, and why Fergus works best connected to your AI, calendar, email and Xero.",
  path: "/fergus-automation/",
  sections: [
    {
      q: "Who can automate Fergus for my trade business?",
      a: [
        "Flow State builds automation on Fergus for New Zealand trade businesses, and connects it to the rest of your software: Xero, your calendar, your email and your AI.",
      ],
    },
    {
      q: "What can you automate in Fergus?",
      a: [
        "Inside Fergus, we can use the API to create quotes from you talking into your phone, update jobs, schedule work and pull your job and financial info together.",
        "Fergus's API doesn't let you create invoices or record payments, so that side runs through Xero.",
        "But Fergus on its own only adds so much value. Where you really see it is when it's connected to everything else, your AI, your calendar, your email and a company brain that holds all the information about how your business runs. Then the AI sees the whole picture instead of one piece of it.",
      ],
    },
  ],
} as const;

export const metadata = answerMetadata(page);

export default function Page() {
  return <AnswerPage {...page} />;
}
