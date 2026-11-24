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
1. Rename Google profile and LinkedIn to "Flowstate" (D04): Google profile renamed by Johan 2026-11-24, waiting on re-verification before the other profile edits (audit item 1). LinkedIn rename not yet confirmed.
2. Turn answers batch 1 into site pages. D12, D14, D15 and D24 are cleared; leave out what D13 and D16 (Q4 limit) still hold.
3. Directory listings: Fergus marketplace and Simpro partner directory (T17): requirements and draft listing text in `docs/listings/t17-directory-listings.md`. Drafts updated 2026-11-25 with Ivan's answers (D12, D15, D24). Nothing submitted; applying waits on the T17 questions below.
4. Google Business Profile audit (T2): drafted in `docs/audits/gbp-audit-2026-11-24.md`. Fixes wait on the rename (item 1) and Ivan's answers below.

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
- Access pending from Ivan: CRM. Claude Team invite sent by Ivan (2026-11-25), to accept. GitHub granted.
- Netlify fixed (2026-11-25): flowstate-web is now public and relinked, so pushes build previews again. Ivan reports PR 47's preview is live and PRs 48 to 51 passed on retry.
- Jordan's SEO plan not yet in this project; brief, MVP plan and issues wait on it.
- Open questions for Ivan: D13, D16 (Q4 limit), D22, plus the Google profile and T17 questions below.

## Questions for Ivan
- D13: Can you confirm "10+ clients" and "six years"?
- D16: May we publish the Q4 limit as written (Flowstate doesn't sell a standalone AI receptionist)?
- D22: Do I decide the measurement method, success threshold and tools within budget myself? (Doc setup is settled under D02.)
- Google profile: What is Flowstate's own start date, for the opening date?
- Google profile: Should it name only the D05 trades (electricians, plumbing, HVAC), or builders too?
- Google profile: Is the proposed services list right (audit item 6)?
- Google profile: What are the real opening hours, and which regions or cities should be listed as service areas?
- T17: May Johan sign the Fergus and Simpro partner agreements for Flowstate?
- T17: For Simpro referrals, take the referral fee or the subscription discount (only one is allowed)?
- T17: Does Jordan's Simpro setup use Simpro Mobile, so the listing can pick the "Premium & Mobile" expertise?

## Changes since last update
Ivan's answers of 2026-11-25 recorded: D11, D12, D14, D15 settled; Q11's Simpro limit dropped in favour of Jordan's Simpro business (D24); D23 defined by Johan and the 4 Gemini hits reclassified as name only (from the saved summary). T17 drafts, answers batch 1, baseline docs and the Google profile audit updated to match. Netlify previews working again.
Google Business Profile renamed to "Flowstate" (2026-11-24, Johan); re-verification pending.
T17 directory listing research and drafts added to `docs/listings/` (PR 48, 2026-11-24); nothing submitted. PR 47 (kickoff docs) merged. Earlier: Google Business Profile audit drafted, independently reviewed and added to `docs/audits/` (2026-11-24); nothing on the live profile has changed yet. Adopted project-kickoff standard (D21) and settled doc location (D19) under D02. Before that: baseline protocol, questions and Gemini results saved in `docs/baseline/`; Gemini finished 60 of 60 on 2026-11-24.
