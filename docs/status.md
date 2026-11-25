---
title: Status
purpose: Current phase, this week's focus, blockers and recent changes
read_when: starting a session, planning the week
updated: 2026-11-25
audience: [Ivan, Johan, agents]
status: active
stability: changing
owner: Johan
supersedes: none
---

Baseline done: Flowstate named in 0 of 360 checks under D23; Gemini gave 4 name-only mentions with no link or detail.

## Phase
Setup and baseline (week of 2026-11-23). "After" run: 2026-12-21 (D20).

## This week's focus
1. Rename Google profile and LinkedIn to "Flowstate" (D04): done, both confirmed renamed by Johan 2026-11-25 (audit item 1). Both are already linked from the site's Organization schema (`sameAs` in `src/lib/site.ts`).
2. Turn answers batch 1 into site pages. Merged 2026-11-25 (PRs 58, 59, 60): FAQ hub `/questions/`, six focused pages, `/about/` and job-software guide updates, Organization schema, llms.txt; "10+ clients" and "six years" (D13) on `/questions/`, `/about/` and llms.txt. Claims sourced in D25; the Q4 receptionist line (D16), Q15 hosting, Q16 package terms and the "a person checks every draft" line stay out until Ivan answers. Next: production is live (2026-11-25), so Johan runs `node scripts/submit-indexnow.mjs`, requests indexing of `/questions/` in Search Console and submits the sitemap in Bing Webmaster Tools. On 2026-12-07 check `site:` results on Google and Bing and record them here; don't re-run the baseline questions before 2026-12-21.
3. Directory listings: Fergus marketplace and Simpro partner directory (T17): requirements and draft listing text in `docs/listings/t17-directory-listings.md`. Drafts updated 2026-11-25 with Ivan's answers (D12, D15, D24). Nothing submitted. Ivan cleared applying (2026-11-25): Johan may sign both partner agreements (D26), Simpro referral fee chosen (D27). Next: Johan registers and signs.
4. Google Business Profile audit (T2): drafted in `docs/audits/gbp-audit-2026-11-24.md`. Rename done, so audit items 2 to 15 can start. Hours and service area stay as they are (D28). Paste-ready Google and LinkedIn copy (categories, description, services, review replies, posts, photos, review-request flow, LinkedIn tagline, overview and first posts) drafted 2026-11-25 in `docs/content/profile-copy-google-linkedin.md`. LinkedIn li-01 (introduction) posted on the Flowstate page 2026-11-25 12:32 NZDT; li-02 scheduled for 13:30 the same day. Next: paste in the Google copy, then li-03 and li-04 about one a week.

## Baseline results

| engine | checks done | Flowstate named (D23) |
|---|---|---|
| ChatGPT | 60 of 60 | 0 |
| Google AI Overviews | 60 of 60 | 0 |
| Perplexity | 60 of 60 | 0 |
| Claude | 60 of 60 | 0 |
| Bing AI answer | 60 of 60 | 0 |
| Gemini | 60 of 60 | 0 (plus 4 name only: Q1, Q2, Q5) |

Competitors named across engines: Automate AI, Stride AI, Ez-AI, Sophiie, TradieCall, Talkify, Wisely, Hyper Digital, e2e Ltd, Torque AI, Fylo, H3llo, FirstVoice.

## Findings
- Brand search (2026-11-24): on Google, "flowstate nz" returns only Flow State, an NZ mushroom-supplement brand (flowstate.nz), including the AI Overview and an ad. Flowstate doesn't appear. Fixes in `docs/audits/gbp-audit-2026-11-24.md`.

## Blockers
- Copilot needs a Microsoft sign-in; Bing AI answer used instead (no AI answer on 5 of 12 questions).
- Access pending from Ivan: CRM. Netlify team access granted (2026-11-25). Claude Team invite sent by Ivan (2026-11-25), to accept. GitHub granted.
- Jordan's SEO plan not yet in this project; brief, MVP plan and issues wait on it.
- Five questions for Ivan, below.

## Questions for Ivan
Only what Johan can't decide himself; everything else Johan settles (D22, D16).
- Site pages: Can the site use your batch 1 answers (Q1, Q2, Q4-Q14, Q18, Q19) as published wording, under your name as author? Yes or no; Johan can skip this if you already said so.
- Site pages: Does the paid diagnostic still sit between the first call and the foundation build? Ivan's Q18 and Q19 skip it, but the live site sells it.
- Site pages: Are two training sessions, a one-page cheat sheet, 30 days of support and "a person checks every draft for the first month" (the check itself, and its length) standard for every client? The live site says these are agreed per client.
- Site pages: Hosting: does the system run on the client's own account (Q15), or in "the automation service we host for them" (privacy page)? Can the site say Singapore by default and that business AI plans don't train on client data?
- Site pages: Is the Auckland electrical business in Q20 (150 reviews in three months) Jordan's own business?

## Changes since last update
Google profile and LinkedIn renamed to "Flowstate" (D04, confirmed 2026-11-25); the Google profile audit fixes are unblocked. Netlify team access added to the access pending from Ivan. First LinkedIn posts: li-01 posted, li-02 scheduled (2026-11-25). Production deploys fixed: Johan has Netlify access; main@210996f was published at 12:30 and the push of main@a84049f (PR 67) built and auto-published at 12:55 with a clean log. All 19 sitemap URLs, `/questions/` included, return 200 on flowstate.net.nz. The earlier production deploys show "skipped: a new one was scheduled for the same branch". IndexNow and Search Console resubmission are unblocked.
Site pages from answers batch 1 merged (PRs 58, 59, 60, 2026-11-25), with the D13 claims added after Ivan confirmed them.
Ivan answered four questions (2026-11-25, 10:03): D13 confirmed ("10+ clients", "six years"), Johan may sign the T17 partner agreements (D26), Simpro referral fee (D27), Google profile keeps 24/7 hours and all of New Zealand (D28). The site-pages questions, incl. publishing his wording under his byline, are still open.
Site pages from answers batch 1 planned and independently reviewed (2026-11-25); D25 added to source their claims; five site-page questions added for Ivan; D25 judge-reviewed (upheld with conditions, conditions applied).
Johan settled D22 (measurement is his call) and D16 (Q4 line left out of public copy), and cut the questions for Ivan to four (2026-11-25). Google profile: trades stay D05, services come from the answers, opening date left blank. Simpro expertise left blank.
Ivan's answers of 2026-11-25 recorded: D11, D12, D14, D15 settled; Q11's Simpro limit dropped in favour of Jordan's Simpro business (D24); D23 defined by Johan and the 4 Gemini hits reclassified as name only (from the saved summary). T17 drafts, answers batch 1, baseline docs and the Google profile audit updated to match. Netlify previews working again.
Google Business Profile renamed to "Flowstate" (2026-11-24, Johan); re-verification pending.
T17 directory listing research and drafts added to `docs/listings/` (PR 48, 2026-11-24); nothing submitted. PR 47 (kickoff docs) merged. Earlier: Google Business Profile audit drafted, independently reviewed and added to `docs/audits/` (2026-11-24); nothing on the live profile has changed yet. Adopted project-kickoff standard (D21) and settled doc location (D19) under D02. Before that: baseline protocol, questions and Gemini results saved in `docs/baseline/`; Gemini finished 60 of 60 on 2026-11-24.
