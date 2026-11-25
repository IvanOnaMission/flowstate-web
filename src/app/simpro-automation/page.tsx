import AnswerPage, { answerMetadata } from "@/components/AnswerPage";

// Ivan's answer Q11, with the "no full Simpro build yet" line dropped and Jordan's business as the proof point (D24, D25 i).
const page = {
  title: "Simpro automation for NZ electrical contractors",
  description: "Flowstate automates Simpro for NZ electrical contractors. Here's what AI can do in Simpro, what you need first, and why the value comes from connecting it to the rest of your business.",
  path: "/simpro-automation/",
  sections: [
    {
      q: "Who can automate Simpro for an electrical contractor in NZ?",
      a: [
        "Flowstate does. Jordan, who looks after strategy at Flowstate, runs his electrical business on Simpro, and it's fully automated through Simpro. He has his AI pulling supplier pricing into his catalogue and building pre-builds.",
        "So what Flowstate builds for Simpro is already running in a real electrical business.",
      ],
    },
    {
      q: "What can you automate in Simpro?",
      a: [
        "Through Simpro's API, Flowstate can automate quotes, invoices, payments, suppliers, purchase orders and stock. That goes further than Fergus.",
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
