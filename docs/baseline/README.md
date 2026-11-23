---
title: Visibility Baseline
purpose: Where the baseline protocol and raw results live, and how to rerun it
read_when: running or comparing the "after" visibility run
updated: 2026-11-24
---

The baseline (2026-11-23 to 2026-11-24) found Flowstate in 4 of 360 checks, all on Gemini; the "after" run on 2026-12-21 repeats it exactly (D10, D17, D20).

| file | contents | status |
|---|---|---|
| `protocol.md` | Engines, modes, run count, exact setup per engine | done |
| `questions.md` | The 12 unbranded questions | done |
| `results/gemini.csv` | One row per check: question, run, named (y/n), names cited | 60 of 60 (last 6 run on 2026-11-24 after the Gemini limit reset) |
| `results/<engine>.csv` for the other five engines | Per-check rows | not kept; totals below only |

## Totals

| engine | checks | Flowstate named |
|---|---|---|
| ChatGPT | 60 | 0 |
| Google AI Overviews | 60 | 0 |
| Perplexity | 60 | 0 |
| Claude | 60 | 0 |
| Bing AI answer | 60 (no AI answer on 5 of 12 questions) | 0 |
| Gemini | 60 | 4 (Q1, Q2, Q5; counted as Flowstate by assumption; unlinked) |

Competitors named: Automate AI, Stride AI, Ez-AI, Sophiie, TradieCall, Talkify, Wisely, Hyper Digital, e2e Ltd, Torque AI, Fylo, H3llo, FirstVoice.

Gemini `names_cited` lists are partial: they hold the bold text the extractor captured, not every name in the answer. The list above is a sample. `results/gemini.csv` has per-check rows for 37 of the 60 Gemini checks (not the first 23); names from the other engines were not kept.

Proposed: for the "after" run, keep per-check rows for every engine.
