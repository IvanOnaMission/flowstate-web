---
title: Page backlog, ranked
purpose: The ranked list of pages to write next, scored Demand x Gap x Fit with evidence, for Johan to triage row by row (playbook-gaps step 3, issue 76)
read_when: choosing the next pages, writing a brief, planning an interview with Ivan
updated: 2026-11-26
audience: [Johan, Ivan, agents]
status: draft (awaiting Johan's triage)
stability: changing
owner: Johan
supersedes: none
---

Fifteen candidate pages, ranked. The top row scores 125 and the bottom five 18. No page gets written until Johan marks it "build" (D03), and December takes at most four (D30, proposed). Most demand evidence is autocomplete strings, because Search Console data is thin and mostly brand searches.

## Method and inputs

All free (Decision B: free first; a DataForSEO volume pull is Ivan's call under D11).

| input | file | date | type |
|---|---|---|---|
| Search Console queries and pages, full history (7 Sep to 24 Nov 2026: 51 clicks, 389 impressions, the property totals shown in the Performance report on 26 Nov and not stored in the exports, which hold the top rows only) | `data/2026-11/2026-11-26-gsc-queries.csv`, `…-gsc-pages.csv` | 2026-11-26 | measured |
| Bing Webmaster query stats (3 clicks, 73 impressions; all brand except one typo'd electrician query) | `data/2026-11/2026-11-26-bing-queries.csv` | 2026-11-26 | measured |
| Google autocomplete and People also ask, 23 seeds | `data/2026-11/2026-11-26-google-questions.md` | 2026-11-26 | measured (the strings exist; no volumes) |
| Competitor and third-party results for the 16 searches | `research/third-party-sources-2026-11.md` and its `data/` files | 2026-11-26 | measured |
| Proof | `decisions.md` (D05, D12 to D15, D24, D25, D36), `content/answers-batch-1.md` | | |

Folder note: the plan said `docs/data/2026-12/`. The exports were made on 26 Nov, so they sit in `docs/data/2026-11/`.

Scoring (playbook 4.5 with the Flowstate adjustments):
- **Demand (D):** 5 if Search Console shows impressions for the wording, 4 if only Bing does, otherwise 2 for an autocomplete or People also ask string (no volume data). Plus 1 if any listed wording is a "who can / how much / is it worth it" question, plus 1 if customer-sourced. Capped at 5.
- **Gap (G):** 5 if Search Console shows position 11 to 30; 4 if measured anywhere else (Search Console outside that range, or Flowstate absent in the 26 Nov searches); 3 if unmeasured.
- **Fit (F):** 2, plus 2 if the page's main question is a comparison or cost question, plus 1 if a live money page exists for it to feed.
- **Proof gate:** no showable proof means parked, not scored. "Pending" means Ivan can supply it in the next interview, and the row says what to ask.
- Ties go to measured evidence, then customer-sourced questions, then sourced proof over pending, then the number of wordings.
- Gate likely to fail (playbook 2.2): 0 indexed, 1 retrieval (the engine doesn't read the page), 2 naming (it reads the page but doesn't name Flowstate). Every new page meets gate 0 first: 7 of the 19 live pages weren't on Bing yet on 26 Nov. The row gives the gate after that. "Other risk" covers the dedupe, D30 and proof checks.
- Proposed slugs: 3 to 7 words, no year, no "best" (playbook 4.7). The brief settles the final slug.

## Gaps found

### AI-question gap (the 12 baseline questions)

Position is Google, 26 Nov (`research/third-party-sources-2026-11.md`).

| Q | question (short) | page that answers it | Google | gap |
|---|---|---|---|---|
| Q1 | Who can automate my trade business in NZ? | `/`, `/fergus-automation/` | #1 | none |
| Q2 | Best AI automation company for tradies in NZ | no page | absent | **no page**: row 6 |
| Q3 | How much does AI automation cost? | `/ai-automation-cost/` | #4 | none |
| Q4 | Can AI answer my phone and book jobs? | `/ai-receptionist-for-tradies/` | #1 | none |
| Q5 | Who can automate Fergus? | `/fergus-automation/` | #1 | none |
| Q6 | Who can automate SimPRO for an electrical contractor? | `/simpro-automation/` | page doesn't rank (receptionist page #9) | improvement I1 |
| Q7 | AI receptionist for tradies in NZ | `/ai-receptionist-for-tradies/` | #15 | improvement I2 |
| Q8 | Job management software or custom AI? | `/guides/job-software-or-custom-ai/` | guide doesn't rank (`/questions/` #15) | improvement I3 |
| Q9 | How can a NZ builder use AI to cut admin? | `/guides/ai-for-builders-nz/` (new, 25 Nov) | absent | wait for indexing; recheck 7 Dec |
| Q10 | AI automation agency Auckland | no page | absent | **no page**: row 10 |
| Q11 | Who can set up AI to follow up quotes and leads? | `/quote-and-lead-follow-up/` | #1 | none |
| Q12 | Recommend a company to automate admin for an electrician | `/ai-for-electricians/` (partly) | absent | improvement I4 |

### Competitor gap

Reference only: nothing below is copied or paraphrased into our pages.

| search | competitor page with a dedicated answer | Flowstate |
|---|---|---|
| Q2 | automateai.co.nz `/industries/construction/`, strideai.co.nz `/tradesandconstruction/`, ez-ai.nz `/ai-for-construction-nz` | no trades-wide page |
| Q6, S2 | ez-ai.nz `/simpro-automation-nz` (#4 on S2) | `/simpro-automation/` exists but doesn't rank |
| Q8 | automateai.co.nz blog post, sophiie.ai article | guide exists but doesn't rank |
| Q9 | ez-ai.nz construction page (#1) | new guide not indexed yet |
| Q10 | strideai.co.nz home, automateai.co.nz `/locations/auckland/`, ez-ai.nz `/ai-automation-auckland` | no Auckland page |
| Q12 | fylo.co.nz (#4) | absent |
| S3 (ai receptionist nz) | talkify.nz, firstvoice.co.nz, ez-ai.nz `/ai-receptionist-nz` | receptionist page absent on S3 |

## Dedupe (dropped rows)

Layers: measured collision (Search Console already shows a live page), title, H1 or slug overlap with a live page on the same subject and intent, and drafts in the pipeline (none).

| candidate | dropped because | goes to |
|---|---|---|
| AI quote generator for electricians ("ai trade quote generator", "ai quoting for tradies", GSC "ai electrical quote generator" #80) | live `/ai-quoting-for-electricians/` and its guide cover it | improvement I5 |
| Simpro automation cost, Fergus automation cost | live Simpro and Fergus pages; a cost page needs figures we can't publish (D06) | I1 |
| AI receptionist cost, "is ai receptionist worth it", "ai receptionist vs human receptionist", "ai receptionist nz" | same subject and intent as `/ai-receptionist-for-tradies/` | I2 |
| Missed calls for tradies | same intent as the receptionist page | I2 |
| AI for electricians cost NZ / Auckland | `/ai-automation-cost/` and `/ai-for-electricians/` (GSC: 47 impressions) | I4 |
| AI consultant NZ, best AI consultant NZ | same intent as rows 6 and 10 | rows 6 and 10 |
| How to start an electrical business (GSC 1 impression, #9) | not a buyer of automation; fails Fit | rejected |
| "business essentials" (GSC 2 impressions, #3) | brand-like; `/essentials/` is noindex and the old `/business-essentials/` returns 404 | adjacent issue A1 |

## Ranked rows

Score = D x G x F (maximum 125). Triage: Johan writes build, park or reject in the last column. Rejected rows are never resurfaced.

| # | page (proposed slug) | D | G | F | score | gate | proof | triage |
|---|---|---|---|---|---|---|---|---|
| 1 | Which job software can you automate? (`/guides/automate-your-job-management-software/`) | 5 | 5 | 5 | 125 | 1 | sourced | |
| 2 | AI phone answering for electricians (`/ai-answering-for-electricians/`) | 5 | 4 | 3 | 60 | 1 | sourced | |
| 3 | Fergus or Tradify: what you can automate (`/guides/fergus-or-tradify-automation/`) | 3 | 3 | 5 | 45 | 1 | sourced | |
| 4 | Is AI worth it for a trade business? (`/guides/is-ai-worth-it-for-trades/`) | 3 | 3 | 5 | 45 | 2 | sourced | |
| 5 | ServiceM8 vs Simpro: what you can automate (`/guides/servicem8-vs-simpro-automation/`) | 3 | 3 | 5 | 45 | 1 | pending | |
| 6 | AI automation for NZ trade businesses (`/ai-for-trades-businesses/`) | 3 | 4 | 3 | 36 | 1 | sourced (D12 part pending) | |
| 7 | Fergus vs Simpro: what you can automate (`/guides/fergus-vs-simpro-automation/`) | 2 | 3 | 5 | 30 | 1 | sourced | |
| 8 | Invoice follow-up automation (`/invoice-follow-up-automation/`) | 3 | 3 | 3 | 27 | 1 | partly sourced | |
| 9 | AI for plumbers in NZ (`/ai-for-plumbers/`) | 3 | 3 | 3 | 27 | 1 | pending | |
| 10 | AI automation in Auckland (`/ai-automation-auckland/`) | 2 | 4 | 3 | 24 | 1 | pending (D12) | |
| 11 | Tradify automation (`/tradify-automation-for-trades/`) | 2 | 3 | 3 | 18 | 1 | sourced | |
| 12 | AroFlo automation (`/aroflo-automation-for-trades/`) | 2 | 3 | 3 | 18 | 1 | sourced | |
| 13 | ServiceM8 automation (`/servicem8-automation-for-trades/`) | 2 | 3 | 3 | 18 | 1 | pending | |
| 14 | Automatic review requests for tradies (`/review-requests-for-tradies/`) | 2 (estimate) | 3 | 3 | 18 | 1 | sourced (D12 figure pending) | |
| 15 | AI for HVAC businesses in NZ (`/ai-for-hvac-businesses/`) | 2 (estimate) | 3 | 3 | 18 | 1 | pending | |

Ties are ordered by the rule above. Rows 3, 5 and 7 overlap each other and row 1: build at most one of them per month, and only after row 1, or the D30 similarity check will likely fail.

### Row details

**1. Which job software can you automate?** Money page: `/services/`. Linked from `/guides/job-software-or-custom-ai/`, `/fergus-automation/`, `/simpro-automation/`.
- Wordings: GSC "job management systems" and "job management"; "best job management software for electricians nz"; "What is the best job management software for tradies?" (People also ask); "fergus integration"; "tradify integrations"; "servicem8 automations"; "aroflo automation". The two GSC strings count because they are the head terms of this page's subject (job management software), and Google already shows Flowstate for them.
- Evidence: GSC "job management systems" 2 impressions at #3 and "job management" 1 impression at #26 (measured, 7 Sep to 24 Nov; the export doesn't show the landing page). Autocomplete and People also ask, 26 Nov (measured).
- Scores: D 5 (GSC impressions for the wording "job management"), G 5 (#26 is inside 11 to 30), F 5 (comparison, feeds `/services/`). If Johan doesn't accept the two GSC strings as this page's wordings, it is D 2, G 4, so 40.
- Proof: sourced. D25 (h) Fergus API, D25 (i) with D24 Simpro API and Jordan's business, D25 (j) with D14 Xero and AroFlo full API, Tradify by browser, any job software.
- Gate likely to fail: 1, retrieval (Search Console already shows "job management" at #26, so ranking is the work).
- Other risk: dedupe against `/guides/job-software-or-custom-ai/`, which shares "job software" but answers "software or custom AI". Keep this page to what each product lets Flowstate automate, not a product review. If Johan judges it too close, fold it into that guide instead.

**2. AI phone answering for electricians.** Money page: `/ai-receptionist-for-tradies/`. Linked from `/ai-for-electricians/`, `/ai-receptionist-for-tradies/`, `/questions/`.
- Wordings: GSC "ai answering for electricians nz"; Q4 "Can AI answer my phone and book jobs for my electrical business in NZ?"; "ai receptionist for electricians"; "ai answering service tradies".
- Evidence: GSC 2 impressions at #51 (measured). Q4 ranks #1 through the tradies page (measured).
- Scores: D 5, G 4 (measured, outside 11 to 30), F 3.
- Proof: sourced. D25 (k) the AI takes details and a person calls back, D25 (o) a backstop, not a replacement.
- Gate likely to fail: 1, retrieval (#51 today).
- Other risk: dedupe and D30 similarity with `/ai-receptionist-for-tradies/`. The alternative is an electricians section on that page (improvement I2).

**3. Fergus or Tradify: what you can automate.** Money page: `/fergus-automation/`. Linked from `/fergus-automation/`, `/guides/job-software-or-custom-ai/`, `/questions/`.
- Wordings: "fergus or tradify"; "tradify vs fergus"; "fergus vs tradify nz"; "fergus vs tradify cost nz"; "best fergus vs tradify reddit".
- Evidence: autocomplete, 26 Nov (measured).
- Scores: D 3 (2, plus 1 for "fergus vs tradify cost nz"), G 3, F 5.
- Proof: sourced. D25 (h) Fergus API, D25 (j) Tradify through the browser, which can break.
- Gate likely to fail: 1, retrieval (unmeasured).
- Other risk: Fit in practice. The buyer is choosing software, which Flowstate doesn't sell, so the page has to stay on the automation angle. It also overlaps row 1.

**4. Is AI worth it for a trade business?** Money page: `/ai-automation-cost/`. Linked from `/ai-automation-cost/`, `/guides/where-to-start-with-ai/`, `/questions/`.
- Wordings: "is ai worth it for a trade business nz"; "do i need ai in my business"; "how can ai help small businesses"; "is ai automation nz legit".
- Evidence: autocomplete, 26 Nov (measured; no volume).
- Scores: D 3 (2, plus 1 for "is it worth it"), G 3 (unmeasured), F 5 (cost question, feeds the cost page).
- Proof: sourced. D25 (l) value = hours saved a week x hourly rate x 52, D25 (m) what it can't do, D25 (n) how builds are priced, with no figures (D06).
- Gate likely to fail: 2, naming (cost and value pages get used without the business being named; name Flowstate inside each claim).
- Other risk: D06. The page must show the method, never a number or a percentage.

**5. ServiceM8 vs Simpro: what you can automate.** Money page: `/simpro-automation/`. Linked from `/simpro-automation/`, `/guides/job-software-or-custom-ai/`.
- Wordings: "servicem8 vs simpro"; "servicem8 vs simpro integration"; "servicem8 vs simpro cost comparison".
- Evidence: autocomplete, 26 Nov (measured).
- Scores: D 3 (2, plus 1 for "servicem8 vs simpro cost comparison"), G 3, F 5.
- Proof: pending. Ask Ivan what ServiceM8's API allows, and whether Flowstate has built on it.
- Gate likely to fail: 1, retrieval (unmeasured).
- Other risk: proof.

**6. AI automation for NZ trade businesses.** Money page: `/services/`. Linked from `/`, `/ai-for-electricians/`, `/guides/where-to-start-with-ai/`.
- Wordings: Q2 "Best AI automation company for tradies in New Zealand"; "ai automation for tradies"; "ai for tradies"; "best ai for tradies"; "ai tools for tradies"; "who can automate my trade business nz"; "best ai for tradesmen".
- Evidence: Flowstate absent on Q2, Google and Bing, 26 Nov (measured). Autocomplete (measured). Context, not scored: the old URL `/ai-for-trades-businesses/` had 15 impressions at #16.3 and now returns 404 (GSC pages export, measured); that is page-level data, and the queries export has no trades-wide wording, so it doesn't count under the scoring method.
- Scores: D 3 (2, plus 1 for "who can automate my trade business nz"), G 4 (absent on Q2, measured), F 3 (feeds `/services/`).
- Proof: sourced, except D12. D13 ("10+ clients", "six years" for the electrical company), D25 (e) and (p). D12 (the Auckland client) is pending until Ivan answers whether that business is Jordan's own (`status.md`, Questions for Ivan); if it is, "client" is wrong.
- Gate likely to fail: 1, retrieval (absent on Q2; engines read competitor trade pages).
- Other risk: D30 similarity with `/` and `/ai-for-electricians/`. Needs its own material, such as which trades Flowstate has built for, from Ivan. Reusing the old slug recovers the 404 (adjacent issue A1).

**7. Fergus vs Simpro: what you can automate.** Money page: `/fergus-automation/`. Linked from `/fergus-automation/`, `/simpro-automation/`, `/guides/job-software-or-custom-ai/`.
- Wordings: "fergus automation vs simpro"; "simpro automation vs fergus".
- Evidence: autocomplete, 26 Nov (measured).
- Scores: D 2, G 3, F 5.
- Proof: sourced. D25 (h) and (i): Fergus has no invoices or payments in its API, while Simpro covers them but needs Premium and approval.
- Gate likely to fail: 1, retrieval (unmeasured).
- Other risk: D30 similarity with row 1.

**8. Invoice follow-up automation.** Money page: `/quote-and-lead-follow-up/`. Linked from `/quote-and-lead-follow-up/`, `/ai-automation-cost/`.
- Wordings: "invoice follow up automation cost nz"; "how to follow up on an invoice"; "how to automate invoices"; "invoice automation software".
- Evidence: autocomplete (measured).
- Scores: D 3 (2, plus 1 for "invoice follow up automation cost nz"), G 3, F 3 (the page's main question is how to automate it, not cost).
- Proof: partly sourced. D25 (c) covers drafting invoices in Xero or the job software, but chasing unpaid invoices isn't sourced. Ask Ivan whether Flowstate chases overdue invoices, and how.
- Gate likely to fail: 1, retrieval (unmeasured).
- Other risk: proof.

**9. AI for plumbers in NZ.** Money page: `/services/`. Linked from `/`, `/ai-for-electricians/`, `/ai-receptionist-for-tradies/`.
- Wordings: "ai for plumbers nz"; "ai for plumbers nz cost"; "best ai for plumbers nz auckland"; "ai for electricians and plumbers".
- Evidence: autocomplete (measured).
- Scores: D 3 (2, plus 1 for "ai for plumbers nz cost"), G 3, F 3 (the page's main question isn't a cost question).
- Proof: pending. D05 sets the audience, but there's no plumbing client example. Ask Ivan for one.
- Gate likely to fail: 1, retrieval (unmeasured).
- Other risk: proof, and the D30 similarity check with `/ai-for-electricians/`.

**10. AI automation in Auckland.** Money page: `/services/`. Linked from `/`, `/about/`, `/contact/`.
- Wordings: Q10 "AI automation agency Auckland"; "ai automation auckland"; "ai consultant auckland"; "best ai consultant nz auckland"; "ai automation agency nz".
- Evidence: Flowstate absent on Q10, Google and Bing, 26 Nov; three baseline competitors have Auckland pages (measured). Autocomplete (measured).
- Scores: D 2 (none of the wordings is a who can, how much or is it worth it question), G 4, F 3.
- Proof: pending. It rests on D12 alone (Auckland electrical business, "150 reviews in three months"; the "95%" figure can't go on a public page, D06), and Ivan hasn't yet said whether that business is Jordan's own (`status.md`, Questions for Ivan).
- Gate likely to fail: 1, retrieval (three competitors already have Auckland pages).
- Other risk: thin page (D30: under 300 words of its own). A location page is also a targeting choice, so Ivan should confirm.

**11. Tradify automation.** Money page: `/services/`. Linked from `/fergus-automation/`, `/guides/job-software-or-custom-ai/`.
- Wordings: "tradify integrations"; "tradify integration with xero"; "tradify api integration"; "tradify supplier integration".
- Evidence: autocomplete (measured). People also ask: "What is Tradify used for?" (measured).
- Scores: D 2, G 3, F 3.
- Proof: sourced, D25 (j). The page must state the browser limit honestly.
- Gate likely to fail: 1, retrieval (unmeasured).
- Other risk: D30 similarity with `/fergus-automation/` and `/simpro-automation/` (a family of job-software pages).

**12. AroFlo automation.** Money page: `/services/`. Linked from `/simpro-automation/`, `/guides/job-software-or-custom-ai/`.
- Wordings: "aroflo automation"; "how aroflo automation works"; "aroflo automation vs xero".
- Evidence: autocomplete (measured).
- Scores: D 2, G 3, F 3.
- Proof: sourced, D25 (j) full API. No client example yet, so ask Ivan for one.
- Gate likely to fail: 1, retrieval (unmeasured).
- Other risk: D30 similarity (job-software family).

**13. ServiceM8 automation.** Money page: `/services/`. Linked from `/simpro-automation/`, `/guides/job-software-or-custom-ai/`.
- Wordings: "servicem8 automations"; "best servicem8 automations nz"; "servicem8 recurring jobs"; "servicem8 automation vs tradify".
- Evidence: autocomplete (measured). servicem8.com appears on 4 of the 16 searches (measured).
- Scores: D 2, G 3, F 3.
- Proof: pending. D25 (j) says only "any job software". Ask Ivan what ServiceM8 allows and for a client example.
- Gate likely to fail: 1, retrieval (unmeasured).
- Other risk: proof.

**14. Automatic review requests for tradies.** Money page: `/quote-and-lead-follow-up/`. Linked from `/quote-and-lead-follow-up/`, `/ai-for-electricians/`, `/about/`.
- Wordings: none pulled. This wasn't a 4.2 seed, so add "google reviews tradie" to the next pull.
- Evidence: estimate (no data yet).
- Scores: D 2 (estimate), G 3, F 3.
- Proof: sourced. D25 (f): a request is drafted when a job is paid, goes from the owner's own phone or email, and skips anyone asked in the last year. The D12 result ("150 reviews in three months") is pending until Ivan says whether that business is Jordan's own.
- Gate likely to fail: 1, retrieval (unmeasured).
- Other risk: demand (unmeasured).

**15. AI for HVAC businesses in NZ.** Money page: `/services/`. Linked from `/`, `/ai-for-electricians/`.
- Wordings: none pulled. Add "ai for hvac nz" to the next pull.
- Evidence: estimate.
- Scores: D 2 (estimate), G 3, F 3.
- Proof: pending (D05). Ask Ivan for an HVAC example.
- Gate likely to fail: 1, retrieval (unmeasured).
- Other risk: proof and demand.

Not in the backlog: trades beyond D05 (electricians, plumbing, HVAC). Builders already have a guide. Any other trade is Ivan's targeting call.

## Parked (proof gate)

None. Every candidate has sourced proof or proof Ivan can give in an interview, and those rows are marked pending.

## Improvements to live pages (not new pages; outside the D30 cap)

- **I1** `/simpro-automation/`: doesn't rank for Q6 or S2, while ez-ai's Simpro page is #4. Lead with D24 (Jordan's Simpro-run business) in the title area. Don't change the title, H1 or URL of a page that already ranks; this one doesn't rank yet.
- **I2** `/ai-receptionist-for-tradies/`: #15 for Q7 and absent for S3. Answer "is it worth it" and "AI vs a person" from D25 (k) and (o), with no prices, and add an electricians section if row 2 isn't built.
- **I3** `/guides/job-software-or-custom-ai/`: Q8 is answered by `/questions/` at #15, not by the guide. Link the guide from the Q8 answer on `/questions/`.
- **I4** `/ai-for-electricians/`: 47 impressions at #8.3, but absent on Q12. Answer "who can automate admin for an electrician" in its first lines, and link `/guides/ai-quoting-for-electricians/` (today only `/guides/` links to it, and it sits at #20.7).
- **I5** `/ai-quoting-for-electricians/`: add the wordings "ai trade quote generator" and "ai quoting for tradies" where they fit naturally.

## Customer-sourced questions (input 5)

Not received yet. This draft is for Johan to send to Ivan, or to use in the next interview. **It hasn't been sent.**

> Hi Ivan, quick one for the website. What are the five questions prospects ask you most often before they book a call? Their own words if you remember them, even roughly. We'll use them to pick the next pages. Also, if you can: (1) do we chase overdue invoices for any client, and how? (2) have we built on ServiceM8? (3) any plumbing or HVAC client we could mention, even without naming them? (4) do you want a page aimed at Auckland businesses?

Answers add 1 to Demand on matching rows and may add new rows.

## Adjacent issues recorded (not fixed here)

- **A1** Old URLs in Search Console: `/ai-for-trades-businesses/` (15 impressions, #16.3) and `/business-essentials/` (15 impressions, #6.3) return 404. `/ai-makeover/` returns a 302. Redirect them, or reuse the first one for row 6. It's a site change, so it needs its own PR.
- **A2** Bing: meta description and title lengths on `/`, `/about/` and `/workflow-diagnostic/` (from the index check).
