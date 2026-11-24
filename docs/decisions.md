---
title: Decision Log
purpose: Single source of truth for settled, proposed and open decisions
read_when: before any public change, pricing, naming or targeting work
updated: 2026-11-25
audience: [Ivan, Johan, agents]
status: active
stability: changing
owner: Johan
supersedes: none
---

Ivan answered ten setup questions (D01-D09). On 2026-11-23 Johan settled the doc standard and doc location under D02. On 2026-11-25 Ivan settled D11, D12, D14, D15 and the Q11 part of D16 (now D24), and handed D23 to Johan, who settled it. Three stay open: D13, D16 (Q4 only) and D22.

| id | date | decision | why | decided by | status | source | replaces |
|---|---|---|---|---|---|---|---|
| D24 | 2026-11-25 | Drop the Q11 line "Flowstate hasn't done a full Simpro client build end to end yet". Lead with Jordan's electrical business, fully automated through Simpro, as the Simpro proof point | Ivan: the line is out of date | Ivan | settled | Ivan, message to Johan, 2026-11-25, D16 | Q11 part of D16 |
| D23 | 2026-11-25 | "Flowstate named" counts only when the answer uses "Flowstate", "FlowState" or "Flow State" as the name of a business (not the phrase "flow state") and also either links a flowstate.net.nz page or describes that business as doing AI or automation for trade businesses. Otherwise a business-name mention is "name only" and doesn't count towards D17. Johan makes the call per check and records the link or quoted detail as evidence. The same rule applies to the baseline and the 2026-12-21 run. The 4 baseline Gemini hits were reclassified from the saved summary (no link, no detail; raw text not kept): all 4 are name only, so the baseline is 0 of 360 named and 4 of 360 name only | A name alone can't be told apart from another Flow State; D17 needs one fixed rule for both runs | Johan | settled | Ivan, message to Johan, 2026-11-25 ("your call"); hit detail from the baseline session's results summary, 2026-11-23 (the raw answer text wasn't kept) | open proposal of 2026-11-24 |
| D22 | 2026-11-23 | Open: does Johan decide SEO execution beyond publishing (measurement method, success threshold, tools within budget)? Proposed: yes. Doc location is settled in D19 under D02 | D03 only covers publishing without sign-off; Q2 and Q3 do not cover measurement or tools | | open | Ivan's reply, Q2, Q3 | none |
| D21 | 2026-11-23 | Adopt the project-kickoff doc standard: extend AGENTS.md into the context index (CLAUDE.md already imports it); add docs/decisions.md, docs/status.md, docs/content/answers-batch-1.md, docs/baseline/README.md | Shared context for Johan and agents | Johan | settled | Johan: "ok this is fine", kickoff session; within D02 (repo docs are PRs on flowstate-web) | D18 |
| D20 | 2026-11-23 | "After" visibility run on 2026-12-21 (4 weeks after baseline) | Fixed comparison date | Johan | proposed (Johan; settled once Ivan confirms D22) | Johan, kickoff session | none |
| D19 | 2026-11-23 | Docs live in `flowstate-web/docs/` (source); Claude Team Project holds copies of the index and stable docs; tasks are GitHub Issues on `flowstate-web` | One source, readable from chat and repo | Johan | settled | Johan, kickoff session; within D02 (flowstate-web PRs) and D08 (Claude Team account) | none |
| D17 | 2026-11-23 | Success threshold for the 2026-12-21 run: Flowstate named in at least 30 of 360 checks, on at least 3 of 6 engines | Baseline (0 of 360 named under D23, 4 name only) gives a number to beat | Johan | proposed (Johan; settled once Ivan confirms D22). Counts "named" under D23 (not name only); 30 was set before D23, so confirm it still fits | Johan: "ok this is fine", kickoff session | none |
| D16 | 2026-11-23 | Open: publish the limit in answer Q4 (no standalone receptionist)? Proposed: yes, as written. The Q11 part is settled in D24 | Honest limits build trust | | open | answers batch 1 | none |
| D15 | 2026-11-25 | Q18 setup time: the foundation is set up in 2 to 3 days | Question asks how long | Ivan | settled | Ivan, message to Johan, 2026-11-25 | open question of 2026-11-23 |
| D14 | 2026-11-25 | Q12: yes, ServiceM8 counts; Flowstate can work with any job management software | Question names ServiceM8 | Ivan | settled | Ivan, message to Johan, 2026-11-25 | open question of 2026-11-23 |
| D13 | 2026-11-23 | Open: verify "10+ clients" and "six years" (Q17) before publishing. Proposed: Ivan confirms both | Public claims need a source | | open | answers batch 1 | none |
| D12 | 2026-11-25 | Q20's Auckland electrical client stats ("95% built", "150 reviews in three months") may be used | Ivan: "all good, you can use them" | Ivan | settled | Ivan, message to Johan, 2026-11-25 | open question of 2026-11-23 |
| D11 | 2026-11-25 | Tools: Ivan has invited Johan to the Claude Team plan. Any other paid tool: Johan proposes it with what it's for and what it costs, and Ivan decides | Ivan only answered ad spend at first | Ivan | settled | Ivan, message to Johan, 2026-11-25 | open question of 2026-11-23 |
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
