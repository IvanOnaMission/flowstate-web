---
title: Third-party sources, November 2026 (Pass A)
purpose: Which third-party pages rank for our 12 baseline questions and 4 seeds, which name competitors, and the honest way onto each (playbook-gaps step 2, issue 75)
read_when: before any new directory sign-up, outreach or listing work; planning pages; the 21 Dec "after" run (Pass B)
updated: 2026-11-26
audience: [Ivan, Johan, agents]
status: draft
stability: changing
owner: Johan
supersedes: none
---

Third-party pages are a small part of what ranks: 618 results across 273 domains, and most are AI providers' own sites. Five targets are worth acting on. Flowstate ranks on Google for 9 of the 16 searches and on Bing for none.

## Method (Pass A)

- Searches: the 12 baseline questions word for word (`docs/baseline/questions.md`), plus the seeds "fergus automation" (S1), "simpro automation" (S2), "ai receptionist nz" (S3) and "ai automation nz" (S4). All run on 2026-11-26.
- Google: google.co.nz, `gl=nz`, `hl=en`, `pws=0`, top 20 organic results (ads, maps and AI Overview excluded), read in Johan's Chrome. Bing: `cc=NZ`, `setlang=en`, first 20 organic results.
- Raw lists: `data/2026-11-26-google-top20.txt` and `data/2026-11-26-bing-top20.txt`. Every result is tagged by type in `data/2026-11-26-results-tagged.csv`. Per-domain counts are in `data/2026-11-26-domain-counts.csv`.
- Types are mapped by domain by hand. Any domain not mapped is tagged "other AI or automation provider", which the plan calls "competitor's own site". "competitor (baseline 13)" marks the 13 named in the baseline.
- Each flagged page was read on 2026-11-26. The flagged pages are every third-party domain found on 3 or more searches, plus every listing page that names a baseline competitor.
- Limits: this is a proxy. Search results aren't what the AI engines read. Pass B (below) checks it on 21 Dec. Bing read "trade" in Q1 as share trading, so its Q1 list is off-topic.

## What ranks

Results by type, both engines (618 results):

| type | results | domains |
|---|---|---|
| other AI or automation provider | 261 | 138 |
| software vendor or marketplace | 143 | 55 |
| competitor (baseline 13) | 93 | 13 |
| publisher or news | 38 | 17 |
| other | 30 | 24 |
| review site | 14 | 10 |
| directory | 13 | 8 |
| Flowstate | 9 | 1 |
| forum or Reddit | 9 | 2 |
| government | 8 | 5 |

Domains on 3 or more of the 16 searches (G = Google, B = Bing):

| domain | type | searches | where |
|---|---|---|---|
| automateai.co.nz | competitor | 13 | G 12, B 7 |
| ez-ai.nz | competitor | 9 | G 9, B 3 |
| flowstate.net.nz | Flowstate | 9 | G: Q1, Q3, Q4, Q5, Q6, Q7, Q8, Q11, S1; B: none |
| tradeflow.org.nz | publisher | 7 | G: Q2, Q3, Q5, Q7, Q8, Q11, Q12; B: Q2, Q7, Q8, Q11 |
| enterprisedna.co, manatech.nz | provider blogs | 6 each | mostly G |
| strideai.co.nz | competitor | 6 | G 6, B 5 |
| levystreet.com | provider (comparison pages) | 5 | G: Q1, Q3, Q7, Q10, S4 |
| hyperdigital.nz, sophiie.ai | competitor | 5 each | |
| intellecttechnologies.co.nz | provider | 5 | G only |
| facebook.com | forum (groups) | 5 | G: Q5, Q12, S1, S2; B: Q1 |
| capterra.co.nz | review site | 4 | G: Q12, S2; B: Q12, S1, S3 |
| servicem8.com | software vendor | 4 | |
| aiagency.nz, ailabs.co.nz, harknessai.nz, heyjodie.com, tkfsolutions.co.nz | providers | 4 each | |
| talkify.nz | competitor | 4 | |
| workflowtrade.co.nz | software vendor | 4 | |
| agencies.nz | directory | 3 | B: Q2, Q10, S4 |
| fergus.com | software vendor | 3 | G and B: Q5, Q12, S1 |
| firstvoice.co.nz, h3llo.nz | competitor | 3 each | |
| aivolve, answr, arkhamsolutions, heyautomate, johnni.ai, kingtide, servicegecko, tamakiai, tradienet | providers | 3 each | |

Flowstate's Google positions: Q1 #1 (`/fergus-automation/`), Q3 #4, Q4 #1, Q5 #1, Q6 #9 (`/ai-receptionist-for-tradies/`; `/simpro-automation/` doesn't rank), Q7 #15, Q8 #15 (`/questions/`; the job-software guide doesn't rank), Q11 #1, S1 #2. Absent on Q2, Q9, Q10, Q12, S2, S3 and S4. The Q1 AI Overview cited Automate AI, Momentum CRM and Stride AI, not Flowstate, although Flowstate is the #1 organic result.

On Bing, Flowstate is absent from all 16. 7 of its 19 pages aren't crawled on Bing yet (`docs/sweeps/2026-11-index-check.md`). This is a bigger gap than any third-party page.

## Evidence: flagged pages

Read 2026-11-26. Flowstate is on none of them.

| page | type | competitors named | honest way on | effort | cost |
|---|---|---|---|---|---|
| tradeflow.org.nz/…/best-ai-tools-for-tradies-nz | editorial guide (TradeFlow, says it is not affiliated, promotes Tradify; published 1 Jul, checked 11 Oct 2026) | none (software only) | editorial contact: offer a sourced service entry or a guest piece with Ivan's byline | medium, uncertain | free |
| tradeflow.org.nz/…/ai-receptionist-for-tradies-nz | editorial price comparison | Talkify, FirstVoice (plus Bizzyboss, Tamaki AI) | same contact; their table lists prices, so ask for "price on request" (D06 governs our own pages, and we don't supply figures) | medium | free |
| tradeflow.org.nz/…/ai-for-electricians-nz | editorial guide | none | same contact | medium | free |
| levystreet.com/compare/ai-automation-agencies-nz/ | comparison run by a provider (Levy Street ranks itself first); says no provider paid; updated 19 Oct 2026 | Automate AI, Ez-AI (plus Harkness AI, Avtrix, others) | its free "tell us" corrections link: ask to be added with our sourced facts | low | free |
| levystreet.com/compare/ai-receptionists-nz/ | same publisher and policy | Automate AI, Ez-AI, FirstVoice, Talkify (plus Tamaki AI, Waboom, KiwiAgent, others) | same link | low | free |
| agencies.nz/specialty/ai-automation | independent directory; "No paid placements" | Ez-AI, Automate AI (plus Waboom AI, Tuned Automation, others) | "Add an agency" form (`/agencies/new`), free, no account, reviewed against public sources before it goes live | low (about 20 min) | free |
| cofounderbase.com, top AI automation agencies NZ | ranked directory; says rank is never sold and paid placements are labelled; updated 25 Nov 2026 | Ez-AI, Automate AI (plus Waboom AI, Arkham, Harkness AI, others) | "List your agency" (`/join/`). The whole site showed "deployment paused" later on 26 Nov, so its pricing isn't known | low | unknown |
| fergus.com/nz/certified-partner/, advisor-partners | software vendor partner programme | none | already applied (T17). A Partner Directory listing is a Certified-tier benefit, which needs a training course | in progress | free |
| partners.simprogroup.com; marketplace.simprogroup.com workflows-and-automations | partner directory (190) and marketplace (63) | none | already applied (T17); the marketplace goes through the partner programme | in progress | free |
| capterra.co.nz (electrical software category) | software review site | not read (403) | lists software products, and Flowstate is a service; poor fit | n/a | n/a |
| heyjodie.com, wiselyglobal.tech, aiforsmallbusiness.co.nz | providers' self-ranked "best" lists | TradieCall, Talkify, FirstVoice (heyjodie); none (others) | none; self-ranked lists are excluded | n/a | n/a |
| enterprisedna, manatech, ailabs, servicegecko, tradienet, aiagency.nz | provider blogs or service pages | none | none | n/a | n/a |
| nzbusinesstools.co.nz Fergus review | affiliate review | none | none found | n/a | n/a |
| revenuebase.ai (Auckland list) | data-vendor list | none | none | n/a | n/a |

Not read: tradiecorner.com (503 error), f6s.com (405 error), topsoftwarecompanies.co (Bing Q10, twice), business.govt.nz and branz.co.nz (Q9; government and an industry publisher with no listing route). The reddit r/nzbusiness thread on Q4 is recorded only; nobody posts in it.

## Ranked targets

Ranked by searches covered, baseline competitors named, whether an honest route exists, and cost.

1. **agencies.nz, AI automation specialty.** An independent directory with no paid placements and a free reviewed form, naming Ez-AI and Automate AI. It ranks on Bing for Q2, Q10 and S4, which is where Flowstate is weakest. Route: the "Add an agency" form, using only facts sourced in `decisions.md`. Submitting it needs Johan's go-ahead.
2. **levystreet.com comparisons (2 pages).** Found on 5 Google searches (Q1, Q3, Q7, Q10, S4), naming 4 baseline competitors. It is a provider's own list, but it publishes a free corrections route and says no provider paid. Route: one "tell us" message with sourced facts and no price. Sending it needs Johan's go-ahead.
3. **tradeflow.org.nz guides.** The most frequent third-party domain (7 Google and 4 Bing searches), and its receptionist guide names Talkify and FirstVoice. There's no listing route, so the honest way is one editorial email offering a sourced entry or a guest piece with Ivan's real byline. Low odds and medium effort. Sending it needs Johan's go-ahead.
4. **Fergus and Simpro partner directory and marketplace (T17).** Found on Q5, Q12, S1 and S2. Already applied; keep it going. Ask Fergus whether the Certified course is needed for the directory listing.
5. **cofounderbase.com.** One Google search (Q2), naming Ez-AI and Automate AI. The site was paused on 26 Nov. Recheck in December, and list only if free (paid goes to Ivan, D11).

Not targets: providers' self-ranked lists and blogs, the data-vendor list, government pages, and Reddit or Facebook groups. These are excluded by the plan, or have no honest way on. Capterra: park, because it lists software, not services.

Not third-party, but larger than any target: getting the 7 uncrawled pages onto Bing (Johan presses "Request indexing", per the index check), and pages for the 7 searches where Flowstate is absent on Google (step 3 backlog).

## Do next (Johan picks 3 to 5)

- [ ] agencies.nz: Claude drafts the form text from sourced facts; Johan submits it.
- [ ] levystreet.com: Claude drafts one "tell us" note covering both pages; Johan sends it.
- [ ] tradeflow.org.nz: Claude drafts one editorial email; Johan sends it, or skips it.
- [ ] T17: keep going; ask Fergus about the Certified requirement for the directory.
- [ ] cofounderbase.com: recheck in the week of 14 Dec; act only if free.

Decision C (directory pause): new sign-ups were paused until this list existed. It exists now, so once Johan picks, the pause lifts for the picked items only.

## Pass B, 21 Dec (proposed, D37)

Proposed row for `docs/decisions.md`. It needs Johan's yes under D22 and a judge review before 21 Dec, because it adds a column to the stable baseline protocol:

| id | date | decision | why | decided by | status | source | replaces |
|---|---|---|---|---|---|---|---|
| D37 | 2026-11-26 | In the 21 Dec "after" run, also record the source URLs each engine shows (Perplexity sources, ChatGPT citations, AI Overview links, Bing references, Claude search results, Gemini sources where shown), without changing questions, engines, modes or run count | Pass A is a proxy built from search results; the engines' own sources confirm or correct the target ranking, and the D17 count is unaffected | Johan (D22) | proposed | `docs/plans/2026-11-26-playbook-gaps.md` Decision A | none |
