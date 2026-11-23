---
title: Status
purpose: Current phase, this week's focus, blockers and recent changes
read_when: starting a session, planning the week
updated: 2026-11-24
audience: [Ivan, Johan, agents]
status: active
stability: changing
owner: Johan
supersedes: none
---

Baseline done: Flowstate appeared in 4 of 360 checks, all on Gemini and unlinked.

## Phase
Setup and baseline (week of 2026-11-23). "After" run: 2026-12-21 (D20).

## This week's focus
1. Rename Google profile and LinkedIn to "Flowstate" (D04); expect Google re-verification.
2. Turn answers batch 1 into site pages, after D12 to D16 are resolved.
3. Directory listings: Fergus marketplace and Simpro partner directory (T17).
4. Google Business Profile audit (T2): drafted in `docs/audits/gbp-audit-2026-11-24.md`. Fixes wait on the rename (item 1) and Ivan's answers below.

## Baseline results

| engine | checks done | Flowstate named |
|---|---|---|
| ChatGPT | 60 of 60 | 0 |
| Google AI Overviews | 60 of 60 | 0 |
| Perplexity | 60 of 60 | 0 |
| Claude | 60 of 60 | 0 |
| Bing AI answer | 60 of 60 | 0 |
| Gemini | 60 of 60 | 4 (Q1, Q2, Q5; counted as Flowstate by assumption) |

Competitors named across engines: Automate AI, Stride AI, Ez-AI, Sophiie, TradieCall, Talkify, Wisely, Hyper Digital, e2e Ltd, Torque AI, Fylo, H3llo, FirstVoice.

## Findings
- Brand search (2026-11-24): on Google, "flowstate nz" returns only Flow State, an NZ mushroom-supplement brand (flowstate.nz), including the AI Overview and an ad. Flowstate doesn't appear. Fixes in `docs/audits/gbp-audit-2026-11-24.md`.

## Blockers
- Copilot needs a Microsoft sign-in; Bing AI answer used instead (no AI answer on 5 of 12 questions).
- Access pending from Ivan: CRM, Claude Team, Netlify (GitHub access granted).
- Netlify deploy previews fail on PR 47 (docs only; `npm run build` passes locally). The log needs Netlify access, so the preview check before merging (D02) can't be done yet.
- Jordan's SEO plan not yet in this project; brief, MVP plan and issues wait on it.
- Open questions for Ivan: D11 to D16, D22, plus the Google profile questions below.

## Questions for Ivan
- D11: Any budget for tools, or free only?
- D12: May we use the Auckland client's numbers (95% built, 150 reviews in 3 months)? Is that Jordan's business?
- D13: Can you confirm "10+ clients" and "six years"?
- D14: Does it work with ServiceM8?
- D15: How long does a typical setup take?
- D22: Do I decide the measurement method, success threshold and tools within budget myself? (Doc setup is settled under D02.)
- Google profile: What is Flowstate's own start date, for the opening date?
- Google profile: Should it name only the D05 trades (electricians, plumbing, HVAC), or builders too?
- Google profile: Is the proposed services list right (audit item 6)?
- Google profile: What are the real opening hours, and which regions or cities should be listed as service areas?

## Changes since last update
Google Business Profile audit drafted, independently reviewed and added to `docs/audits/` (2026-11-24); nothing on the live profile has changed yet. Earlier: adopted project-kickoff standard (D21) and settled doc location (D19) under D02; PR 47 open. Before that: baseline protocol, questions and Gemini results saved in `docs/baseline/`; Gemini finished 60 of 60 on 2026-11-24.
