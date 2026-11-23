---
title: Decision Log
purpose: Single source of truth for settled, proposed and open decisions
read_when: before any public change, pricing, naming or targeting work
updated: 2026-11-24
audience: [Ivan, Johan, agents]
status: active
stability: changing
owner: Johan
supersedes: none
---

Ivan answered ten setup questions (D01-D09). On 2026-11-23 Johan settled the doc standard and doc location under D02; measurement and tools wait on D22, and the definition of "named" in the visibility checks is open (D23). Eight decisions stay open, mostly about public claims in the answer batch.

| id | date | decision | why | decided by | status | source | replaces |
|---|---|---|---|---|---|---|---|
| D23 | 2026-11-24 | Open: what counts as "Flowstate named" in a visibility check? Proposed: settle before the 2026-12-21 run and apply it to both baseline and "after" results. The 4 baseline hits (Gemini, Q1 Q2 Q5) were counted as Flowstate by assumption | The baseline has no written definition; D17's threshold depends on it | | open | `docs/baseline/protocol.md`, "What counts as named" | none |
| D22 | 2026-11-23 | Open: does Johan decide SEO execution beyond publishing (measurement method, success threshold, tools within budget)? Proposed: yes. Doc location is settled in D19 under D02 | D03 only covers publishing without sign-off; Q2 and Q3 do not cover measurement or tools | | open | Ivan's reply, Q2, Q3 | none |
| D21 | 2026-11-23 | Adopt the project-kickoff doc standard: extend AGENTS.md into the context index (CLAUDE.md already imports it); add docs/decisions.md, docs/status.md, docs/content/answers-batch-1.md, docs/baseline/README.md | Shared context for Johan and agents | Johan | settled | Johan: "ok this is fine", kickoff session; within D02 (repo docs are PRs on flowstate-web) | D18 |
| D20 | 2026-11-23 | "After" visibility run on 2026-12-21 (4 weeks after baseline) | Fixed comparison date | Johan | proposed (Johan; settled once Ivan confirms D22) | Johan, kickoff session | none |
| D19 | 2026-11-23 | Docs live in `flowstate-web/docs/` (source); Claude Team Project holds copies of the index and stable docs; tasks are GitHub Issues on `flowstate-web` | One source, readable from chat and repo | Johan | settled | Johan, kickoff session; within D02 (flowstate-web PRs) and D08 (Claude Team account) | none |
| D17 | 2026-11-23 | Success threshold for the 2026-12-21 run: Flowstate named in at least 30 of 360 checks, on at least 3 of 6 engines | Baseline (4 of 360) gives a number to beat | Johan | proposed (Johan; settled once Ivan confirms D22) | Johan: "ok this is fine", kickoff session | none |
| D16 | 2026-11-23 | Open: publish the limits in answers Q4 (no standalone receptionist) and Q11 (no full Simpro build yet)? Proposed: yes, as written | Honest limits build trust | | open | answers batch 1 | none |
| D15 | 2026-11-23 | Open: Q18 setup timeframe is missing. Proposed: ask Ivan for a typical range in weeks | Question asks how long | | open | answers batch 1 | none |
| D14 | 2026-11-23 | Open: Q12 has no ServiceM8 answer. Proposed: ask Ivan | Question names ServiceM8 | | open | answers batch 1 | none |
| D13 | 2026-11-23 | Open: verify "10+ clients" and "six years" (Q17) before publishing. Proposed: Ivan confirms both | Public claims need a source | | open | answers batch 1 | none |
| D12 | 2026-11-23 | Open: may Q20 name or describe the Auckland electrical client ("95% built", "150 reviews in three months")? Proposed: get that client's written OK; say so if it is Jordan's business | Client stats need consent | | open | answers batch 1 | none |
| D11 | 2026-11-23 | Open: budget for tools (not ads). Proposed: free tools only until Ivan approves a specific tool | Ivan only answered ad spend | | open | Ivan's reply, Q8 | none |
| D10 | 2026-11-23 | Visibility baseline: 12 unbranded questions, 5 runs each on ChatGPT (Temporary Chat, personalisation off), Gemini (temporary chat), Google AI Overviews, Perplexity, Claude (incognito, web search on), Bing AI answer; Johan's logged-in Chrome | Repeatable before/after comparison | Johan | proposed (Johan; settled once Ivan confirms D22) | baseline session notes | none |
| D09 | 2026-11-23 | Start with LinkedIn: company page, Ivan, Johan | Ivan's choice | Ivan | settled | Ivan's reply, Q10 | none |
| D08 | 2026-11-23 | Use Flowstate's Claude Team account; Ivan adds Johan to CRM and all GitHub repos | Company tooling | Ivan | settled | Ivan's reply, Q8, Q9 | none |
| D07 | 2026-11-23 | Jordan advises; he does not sign off | Ivan's call | Ivan | settled | Ivan's reply, Q7 | none |
| D06 | 2026-11-23 | No prices on the site. Explain pricing: one-off fee or monthly retainer, set by business size and scope, based on what the problem costs; client pays own hosting and AI costs. Do not publish the "~10% of audit findings" idea | No set pricing yet | Ivan | settled | Ivan's reply, Q6; answer Q1 | Johan's 10% proposal |
| D05 | 2026-11-23 | Electricians are the main audience; add pages for nearby trades (plumbing, HVAC) | Most clients are electricians | Ivan | settled | Ivan's reply, Q5 | none |
| D04 | 2026-11-23 | Brand name "Flowstate", one word, everywhere; rename Google profile and LinkedIn | Consistent entity for search and AI | Ivan | settled | Ivan's reply, Q4 | none |
| D03 | 2026-11-23 | Johan publishes without Ivan's pre-approval | Speed | Ivan | settled | Ivan's reply, Q3 | none |
| D02 | 2026-11-23 | Johan opens and merges his own PRs on flowstate-web; Netlify preview per PR | Speed | Ivan | settled | Ivan's reply, Q2 | none |
| D01 | 2026-11-23 | Search Console: Johan has Full access (johandegel@gmail.com); sitemap submitted; robots.txt allows AI crawlers | Already set up | Ivan | settled | Ivan's reply, Q1 | none |
