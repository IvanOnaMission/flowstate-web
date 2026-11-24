import AnswerPage, { answerMetadata } from "@/components/AnswerPage";

// Ivan's answer Q11, with the "no full Simpro build yet" line dropped and Jordan's business as the proof point (D24, D25 i).
const page = {
  title: "Simpro automation for NZ electrical contractors",
  description: "What AI can automate in Simpro, what you need before it can, and why the real value comes from connecting Simpro to the rest of your business.",
  path: "/simpro-automation/",
  sections: [
    {
      q: "Who can automate Simpro for an electrical contractor in NZ?",
      a: [
        "Flowstate does. Jordan, who looks after strategy at Flowstate, runs his electrical business on Simpro, and it's fully automated through Simpro. He has his AI pulling supplier pricing into his catalogue and building pre-builds.",
        "So what we build for Simpro has already been worked out in a real electrical business, not on a whiteboard.",
      ],
    },
    {
      q: "What can you automate in Simpro?",
      a: [
        "Simpro's API goes further than Fergus. You can do quotes, invoices, payments, suppliers, purchase orders and stock.",
        "The catch is you need Simpro's Premium plan for the API and for quotes, and Simpro has to approve the connection.",
        "One handy thing about Simpro is you can set up your own drop-down options and statuses inside it, and each one can trigger an automation, so when a job moves to a new status the next step happens on its own.",
        "Same as Fergus though, the big benefit comes when it's connected to all your other software, so the AI can see everything your business is doing.",
      ],
    },
  ],
} as const;

export const metadata = answerMetadata(page);

export default function Page() {
  return <AnswerPage {...page} />;
}
