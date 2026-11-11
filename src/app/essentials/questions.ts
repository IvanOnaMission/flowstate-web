/**
 * The /essentials/ quiz, one question per screen. `field` is the Netlify form field
 * name; netlify/lib/essentials-quiz.mjs reads the same names and labels.
 * Kept out of the client component so the server page can list the fields in the
 * static form Netlify detects at deploy.
 */
export type Option = { label: string; level?: 1 | 2 | 3 };
export type Question = { field: string; summary: string; question: string; note?: string; options: Option[] };

const plain = (...labels: string[]): Option[] => labels.map((label) => ({ label }));

export const EMPLOYEE = "Employee or apprentice";

export const questions: Question[] = [
  {
    field: "role",
    summary: "Role",
    question: "What's your role?",
    options: plain("Owner", "Office or ops manager", EMPLOYEE, "Something else"),
  },
  {
    field: "trade",
    summary: "Trade",
    question: "What trade are you in?",
    options: plain("Electrical", "Plumbing & gas", "HVAC", "Building", "Another trade"),
  },
  {
    field: "team_size",
    summary: "Team size",
    question: "How big's the team?",
    note: "Including you.",
    options: plain("Just me", "2–5", "6–20", "20+"),
  },
  {
    field: "job_software",
    summary: "Job software",
    question: "What runs your jobs?",
    options: plain("Simpro", "Fergus", "Tradify", "ServiceM8", "Paper or spreadsheets", "Something else"),
  },
  {
    field: "time_sink",
    summary: "Biggest time-sink",
    question: "What eats most of your time?",
    note: "Pick the one that hurts most.",
    options: plain(
      "Quoting",
      "Getting paid",
      "Replying to enquiries",
      "Email and admin",
      "Getting my team more productive",
      "Still figuring it out",
    ),
  },
  {
    field: "investment",
    summary: "Investment",
    question: "How much are you looking to invest?",
    options: [
      { label: "A few one-off tools", level: 1 },
      { label: "Fix my biggest problem properly", level: 2 },
      { label: "All in on a new way to run my business", level: 3 },
    ],
  },
  {
    field: "timing",
    summary: "Timing",
    question: "When do you want this sorted?",
    options: plain("Now", "In the next few months", "Just looking"),
  },
];

/** Every field the quiz submits, so Netlify Forms keeps them all. */
export const formFields = [
  "name",
  "business",
  "phone",
  "email",
  ...questions.map((q) => q.field),
  "ad_id",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "landing_path",
  "fbclid",
  "fbc",
  "fbp",
] as const;
