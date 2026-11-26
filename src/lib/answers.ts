/**
 * The answer pages built from Ivan's answers batch 1 (docs/content/answers-batch-1.md).
 * One list, used by the answer pages' "More answers" links, the footer and the sitemap,
 * so a new page only needs adding here (the home page links a hand-picked few).
 *
 * Every claim on these pages needs a source in docs/decisions.md (D06, D12, D14, D15,
 * D24, D25). Held until Ivan answers, so do not add: "10+ clients" / "six years" (D13),
 * that Flow State doesn't sell an AI receptionist (D16), Q15 hosting claims, Q16 package
 * terms, "first month" checks, and any percentage.
 */
export const answerPages = [
  { href: "/ai-automation-cost/", label: "What AI automation costs" },
  { href: "/simpro-automation/", label: "Simpro automation" },
  { href: "/fergus-automation/", label: "Fergus automation" },
  { href: "/quote-and-lead-follow-up/", label: "Quote and lead follow-up" },
  { href: "/guides/ai-for-builders-nz/", label: "AI for NZ builders" },
] as const;

/** First published date for the answer pages. */
export const answersPublished = "2026-11-25";
