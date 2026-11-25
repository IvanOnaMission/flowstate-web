---
title: Gaps against Jordan's SEO plan
purpose: What from Jordan's SEO plan is done, what Johan can do without new input, and what waits on someone else
read_when: planning site or visibility work against Jordan's plan
updated: 2026-11-25
audience: [Ivan, Johan, agents]
status: active
stability: changing
owner: Johan
supersedes: none
---

Checked 2026-11-25 against Jordan's SEO plan (Project only, owned by Jordan). Jordan's paste writes "Flow State"; the brand stays "Flowstate" (D04).

## Done
- Search Console and Bing Webmaster Tools set up, sitemap submitted (plan 4.1; PR 69).
- AI crawlers allowed: `src/app/robots.ts` allows everything (plan 4.1).
- Job-software pages: `/fergus-automation/`, `/simpro-automation/` and the job software vs custom AI guide (plan 4.3).
- Answer pages (plan 4.4): cost (`/ai-automation-cost/`), AI receptionist (`/ai-receptionist-for-tradies/`), and "who can automate my trade business in NZ" on `/about/` and `/questions/`.
- Google profile categories, services and description pasted (plan 4.6).
- Visibility baseline: 360 checks across 6 engines; "after" run 2026-12-21 (D20).
- Directory listings (T17): status in `docs/status.md`.

## Done in this pass (one site PR)
1. Home first sentence (plan 4.1). H1 "Less admin. More time to run your business." left as it is (rule 5). Added under it: "Flowstate builds AI automation for New Zealand trade businesses, mainly electricians." ("mainly electricians": D05.) Home meta description starts with the same sentence.
2. Name Flowstate in every claim (rule 1). Page by page, "we" in claims about Flowstate became "Flowstate", "Flowstate's" or "you and Flowstate" (for things agreed jointly). Page descriptions name Flowstate. Titles, H1s and URLs unchanged (rule 5). Pages: home, `SoftwareExplanation`, default description in `layout.tsx`, about, contact, services, ai-for-electricians, ai-quoting-for-electricians, the guides index and four guides, cost, Fergus, Simpro, AI receptionist, quote and lead follow-up, questions, and the static `/workflow-diagnostic/`.
3. Opening sentences (rule 3). Each page's first sentence carries the main claim, names Flowstate and is 20 words or fewer. Answer pages already open with `site.entity` after the H1; `/about/` now does too.

Judgement calls:
- Generic how-to advice in guides (for example "brief AI like an employee") isn't a claim about Flowstate, so the name isn't forced into every advice sentence. Claims about what Flowstate does, first sentences and descriptions all name it.
- Ivan's first-person lines ("I build the systems myself") stay; the nearby sentence names Flowstate.
- Rule 2 held: no new claims. Wording that's still held stays out: "Flowstate fixes it" (D25, fixes come "within the support agreed"), hosting (Q15), the Auckland business as a Flowstate client (D12, question open with Ivan), and any offer of an AI receptionist (D16). No prices (D06).
- Out of scope: privacy page (legal "we"), "Why we joined forces" on `/about/` (Ivan and Jordan as people), pages not in the sitemap.

## Can do now, later
- No table on the site yet; any future table puts "Flowstate" in the column header (rule 1).
- Headings with the exact searched questions (rule 4): check new pages against Search Console queries once they show.
- Audit after each build (plan 2.7): sitemap, schema, same facts everywhere, broken links, robots.

## Needs input from someone else
- Tradify vs Fergus, ServiceM8 and AroFlo pages (plan 4.3): wait on Jordan's facts.
- GA4 and Microsoft Clarity (plan 2.1): new tracking tools, against the local-first rule. Johan's call (D22).
- Google posts three times a week and a reply to every review (plan 2.8): Johan, using `docs/content/profile-copy-google-linkedin.md`.
- Case studies, podcasts, guest posts (plan 4.5): need Ivan, and the client's permission for case studies.
- Jordan's playbook (`marketing/seo/claude-seo-aio-playbook.md`) isn't in this repo. Check it against this plan once shared.
