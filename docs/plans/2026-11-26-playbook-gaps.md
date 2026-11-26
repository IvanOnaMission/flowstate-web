---
title: Plan for the four playbook steps not done yet
purpose: End-to-end plan for the index check, the third-party source map, the ranked page backlog and the optional interview agent
read_when: working on any of these four steps
updated: 2026-11-26
audience: [Johan, agents]
status: draft
stability: changing
owner: Johan
supersedes: none
---

The four steps run in this order: index check, source map, backlog, then the interview set-up. Each one feeds the next. The index check finds pages that collide with backlog rows, and the source map shows the competitor gap. The backlog decides what the interview asks about. Nothing here is paid, nothing is published, and nothing needs new infrastructure. The work is Search Console, Bing, a browser and files in this repo.

Method source: Jordan's playbook (linked in `AGENTS.md`, D29). Sections 4.3 to 4.9, 5, 12.2 item 4, 12.4 and 13. Where it differs from our decisions, D04, D06 and D29 to D35 win.

## Timeline

| step | when | who | output | needs |
|---|---|---|---|---|
| 1. Index check | Thu 26 to Fri 27 Nov, recheck Mon 7 Dec | Johan logs in; Claude reads and records | `docs/sweeps/2026-11-index-check.md` | Search Console and Bing access (have both) |
| 2. Third-party source map | Fri 27 Nov to Tue 1 Dec; engine sources added on 21 Dec | Claude researches; Johan reviews | `docs/research/third-party-sources-2026-11.md` | Decision A below |
| 3. Ranked page backlog | Wed 2 to Fri 4 Dec | Claude builds; Johan triages row by row (D03) | `docs/backlog.md` | Steps 1 and 2; Decision B |
| 4. Interview agent and command (optional) | Any time, about half a day; before the next interview with Ivan | Claude builds; Johan reviews | `.claude/agents/flowstate-seo.md`, `.claude/commands/seo-interview.md` | Judge review (stable doc change to `AGENTS.md`) |

One GitHub issue per step on `flowstate-web` (AGENTS.md rule), owner Johan:

- Step 1: `Context: docs/status.md, docs/baseline/protocol.md`
- Step 2: `Context: docs/baseline/questions.md, docs/status.md`
- Step 3: `Context: docs/decisions.md, docs/content/answers-batch-1.md`
- Step 4: `Context: AGENTS.md, docs/content/answers-batch-1.md`

## Step 1: URL Inspection of every sitemap URL

Why: playbook 4.9 rule 7 says to run an index check on every sitemap URL monthly. The step-3 backlog also needs to know which live pages Google has indexed, because an indexed page that already covers a topic is a collision, not a new page. And no probe is read on a page that isn't indexed (playbook 10.4).

1. List the 19 URLs from `src/app/sitemap.ts`: 13 fixed paths plus the six `answerPages` in `src/lib/answers.ts`. Check them against the live `https://flowstate.net.nz/sitemap.xml` so the list matches what Google reads.
2. Johan opens Search Console in his Chrome and logs in himself. Claude in Chrome runs URL Inspection on each URL and reads the result without pressing "Request indexing" or changing anything. For each URL it records:
   - Coverage state ("Submitted and indexed", "Discovered - currently not indexed", "Crawled - currently not indexed", and so on)
   - Last crawl date
   - Google-selected canonical versus user-declared canonical
   - Whether the URL appears in the sitemap and is mobile-usable
3. Bing Webmaster Tools: do the same with Bing's URL Inspection. Bing's index feeds ChatGPT search and Copilot.
4. Record everything in `docs/sweeps/2026-11-index-check.md` as a table: URL, Google state, Google last crawl, canonical match, Bing state. Add a summary line, for example "indexed 18 of 19 on Google, x of 19 on Bing", with denominators.
5. For any URL that isn't indexed, Johan presses "Request indexing" himself, once per URL. `/fergus-automation/` was already requested on 26 Nov, so don't request it again within a week. Note the date.
6. Recheck on Mon 7 Dec together with the `site:` check already planned in `status.md`. Then run the check monthly, the week before each sweep. The next run is the week of 14 Dec, ahead of the 21 Dec run.
7. Pages that the site serves but leaves out of the sitemap on purpose (`/private/p/*`, `/audit*`) are not inspected. Note them as excluded by design.

Done when: all 19 URLs are recorded on both engines, non-indexed pages are requested, and `status.md` has a one-line result.

## Step 2: Third-party sites the AI engines read for our 12 questions

Why: playbook 12.2 item 4 and 12.4. AI answers draw on a small set of sources, and being on the right few pages matters more than being on many. This step tells us where Flowstate needs to be mentioned. More directory sign-ups wait for it. The Fergus and Simpro applications (T17) were already submitted, so they continue.

The baseline didn't keep source URLs. `gemini.csv` has only the competitors each answer named, and the other engines kept summary counts. `status.md` also says not to re-run the baseline questions before 21 Dec. So the map is built in two passes:

### Pass A, now: search-result proxy (no AI engine re-run)

Google AI Overviews and ChatGPT search draw on the Google and Bing indexes, so the pages that rank for our questions are the best free proxy for what the engines read.

1. For each of the 12 baseline questions, word for word, record Google's top 20 organic results. Use google.co.nz in a signed-out or incognito window, location New Zealand. Record Bing's top 20 the same way.
2. Also run the four job-software and buyer seeds from playbook 4.2 that the questions miss: "fergus automation", "simpro automation", "ai receptionist nz" and "ai automation nz".
3. Tag each result by type: directory, review site, forum or Reddit, software vendor or marketplace, publisher or news, competitor's own site, government, other.
4. For each domain, count how many questions it appears on, for example "found on 7 of 12". Flag the domains that appear on 3 or more questions, and every listing page that names any of the 13 baseline competitors (Automate AI, Stride AI, and the rest in `status.md`).
5. For each flagged page, record:
   - The exact URL
   - Whether Flowstate is on it
   - Which competitors are on it
   - The honest way on, such as a genuine listing, a guest article with a real byline, a case study with the client's permission or a vendor marketplace listing
   - Rough effort
   - Whether it is free or paid (paid goes to Ivan, D11)
6. Don't plan any of these, per playbook 12.2 items 4 and 7:
   - Planted mentions or posts asking people to recommend us
   - A Reddit programme or self-ranked "best of" lists
   - Bought placements or press releases written for links
   - Wikidata

   Reddit threads are recorded if they rank, but nobody posts in them.

### Pass B, 21 Dec: the engines' own sources

During the "after" run, for each check also record the source URLs the engine shows: Perplexity's sources, ChatGPT's citations, AI Overview links, Bing's references, Claude's search results and Gemini's sources where shown. The questions, engines, modes and run count stay exactly as in `protocol.md`, so the D17 count isn't affected. Recording one extra column is a change to a stable doc, so it is proposed (D37 below) and gets a judge review before 21 Dec. Pass B then confirms or corrects Pass A's ranking.

Output: `docs/research/third-party-sources-2026-11.md`. It holds the ranked list of target pages, the Pass A evidence table and a short "do next" list of three to five targets. A one-line pointer goes in `status.md`. Getting onto a target is a separate task. Anything that sends a message, creates an account or submits a form needs Johan's go-ahead in the session.

Done when: Pass A is recorded for 16 searches on both engines, targets are ranked, and Johan has picked the next three to five.

## Step 3: Ranked page backlog

Why: playbook 4.4 to 4.7. Nothing gets written unless it is on a ranked list that has been approved. D30 (proposed) caps new pages at four a month, so the backlog decides which four.

### Inputs

All free unless noted:

1. **Measured demand.** Search Console Performance, query by page, for the full history (the site is new, so data is thin). Export to CSV and save it under `docs/data/2026-12/`. Do the same for Bing query stats. Keep rows at position 4 to 20, and keep everything else too, because volumes are tiny. Silence is not a "no" (playbook 4.0).
2. **Real question wordings.**
   - Run Google autocomplete and "People also ask" for the playbook 4.2 seed clusters, using the browser on google.co.nz and recording the strings. This is free and slower.
   - Paid alternative: DataForSEO autocomplete, People also ask and the Google Ads NZ volume (about US$0.09). This is a paid tool, so Ivan decides (D11). See Decision B.
3. **Competitor gap.** From the step-2 map and the 13 baseline competitors, find which of the 12 questions and seeds each competitor answers with a dedicated page and Flowstate doesn't. Record the competitor URL and what it covers and misses. This is reference only. Nothing is copied or paraphrased.
4. **AI-question gap.** Use the 12 baseline questions themselves. Each one should have a live page that answers it. Q8, Q9, Q10 and Q12 have the thinnest coverage now. Map each to its page or mark it "no page".
5. **Customer-sourced questions.** Ask Ivan for the five questions prospects most often ask before they book. This goes in the next interview pack (step 4) or a single message, sent only with Johan's go-ahead.

### Build

1. **Dedupe** in three layers (playbook 4.4):
   - Measured collision: Search Console already shows a live page for the query.
   - Title, H1 and slug overlap with the 19 live pages, with at least one shared subject word.
   - Overlap with drafts already in the pipeline.
   Log every dropped row with a reason.
2. **Score** Demand x Gap x Fit, each 1 to 5, with the Flowstate adjustments from playbook 4.5:
   - Add 1 to Demand for a "who can / how much / is it worth it" question, and 1 for a customer-sourced one.
   - Add 2 to Fit for a comparison or cost question, and 1 if a live page exists for it to feed.
3. **Proof gate.** A topic with no showable proof is parked, not scored. Proof means a claim already sourced in `decisions.md`, a line in answers batch 1 (D25, D36) or something Ivan can supply in the next interview. Proof-pending rows say what proof the interview must get.
4. **Write `docs/backlog.md`** with the top 15 rows. Each row has:
   - The question wordings
   - An evidence line with source and date, labelled measured or estimate
   - The three scores
   - The money page it feeds
   - The two to three live pages that will link to it
   - The likely failing gate
   - The proof status
5. **Triage.** Johan goes through the rows one at a time: build, park or reject (D03). Rejected rows are never resurfaced. The first December batch is at most four pages (D30). Pages for a new trade audience beyond D05 (electricians, plumbing, HVAC) are a targeting call for Ivan.
6. Approved rows get a brief (playbook Appendix A) with a question pack. The pack feeds step 4's interview.

Likely candidates, to be scored and not assumed:
- Plumbing and HVAC pages (D05, not built yet; run the D30 similarity check)
- Tradify, ServiceM8 and AroFlo pages (proof from D25(j))
- A "Fergus vs Simpro for a growing trade business: what Flowstate connects" comparison
- A page for Q10 ("AI automation agency Auckland")
- A page for Q12 ("Recommend a company to automate admin for an electrician in NZ")

Done when: `docs/backlog.md` has 15 scored rows with evidence, Johan has triaged them, and the first batch of up to four has briefs.

## Step 4 (optional): `flowstate-seo` agent and `/seo-interview` command

Why: the next pages need Ivan's own answers (playbook 5). A command that asks one question at a time and records answers word for word keeps the provenance record clean. The agent wraps the rules so research and drafting sessions don't rely on memory.

1. **Write both files in our own words** (D29: the playbook is never copied into this public repo; link it instead):
   - `.claude/commands/seo-interview.md` takes a brief path as its argument. It reads the brief's question pack and asks one question at a time. It records every answer verbatim in `docs/interviews/<slug>-answers.md` and allows at most one follow-up, only when an answer is vague on a figure, name, date or result. It never supplies an answer, lists GAPS at the end, and reads back the three strongest lines for Ivan's yes or no. It doesn't draft.
   - `.claude/agents/flowstate-seo.md` is for research, backlog, briefs, drafting from recorded answers only, claims checks against `decisions.md`, audits and the monthly sweep. It never publishes, posts, submits, requests indexing or spends. Its rules:
     - "Flowstate", one word (D04)
     - No prices or percentages (D06)
     - No dashes, NZ spelling (D34)
     - Every claim sourced in `decisions.md`
     - Name "Flowstate" in each claim passage
     - At most four pages a month and the similarity check (D30)
     - Never edit the title, H1 or URL of a page that already ranks
     - Mark unsourced sentences UNSOURCED
     - Read the playbook through `gh` when a method question comes up
2. **Adapt the playbook's paths** to ours. Its `seo/` folders become `docs/backlog.md`, `docs/briefs/`, `docs/interviews/`, `docs/sweeps/` and `docs/research/`. Its claims log is `decisions.md` plus `answers-batch-1.md`. Its `CLAUDE.md` snippet becomes rows in the `AGENTS.md` index.
3. **Decide who runs the interview.** Ivan doesn't use Claude Code. Recommended: Johan runs `/seo-interview` on a call with Ivan and types his answers word for word. Alternative: playbook 1.6's Claude Team Project for Ivan, though that loses the file record.
4. **Dry run.** Johan answers a three-question test pack. Check that the answers file is verbatim, gaps are listed and nothing is invented. Then delete the test file.
5. Add the `AGENTS.md` index rows and the new `docs/` paths. That's a stable doc change, so it gets a judge review before merge.

Done when: both files are merged, the dry run passes, and the first real interview is booked against an approved backlog row.

## Decisions this plan needs

- **A. Source map method.** Recommended: Pass A (search results) now, and Pass B (engine sources) recorded as an extra column on 21 Dec. Alternative: a separate engine run now, recording sources only, which goes against the `status.md` "don't re-run before 21 Dec" note. To record: proposed D37, "Record engine source URLs in the 21 Dec run without changing questions, engines, modes or run count". Johan decides under D22, with a judge review.
- **B. Question data.** Recommended: free browser autocomplete and "People also ask" first. Alternative: DataForSEO (about US$0.09 for NZ volume, plus cents for autocomplete and "People also ask"). That one is paid, so Ivan decides (D11).
- **C. Directory pause.** No new directory sign-ups until step 2's "do next" list exists. T17 continues. Johan decides (D03).
- **D. Step 4 at all.** It is optional. It is worth doing before the next interview, because it is the guard against invented content. The agent half adds little over `AGENTS.md`, so the command alone is the minimum.

## Risks

- **Too little data.** Search Console data is thin on a site this new, so most Demand scores will be 2 to 3. Ties go to measured evidence and customer-sourced questions.
- **The proxy can mislead.** Search results aren't what the engines read. Pass B on 21 Dec is the check, so don't spend money on targets before then unless the target is clearly cheap.
- **Re-running the baseline too early.** Running the 12 questions early can taint the 21 Dec comparison. Pass A uses search only.
- **The D17 threshold** (30 of 360) is likely out of reach (D32 is open). This plan doesn't change it.
