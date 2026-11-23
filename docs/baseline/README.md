---
title: Visibility Baseline
purpose: Where the baseline protocol and raw results live, and how to rerun it
read_when: running or comparing the "after" visibility run
updated: 2026-11-23
---

The baseline (2026-11-23) found Flowstate in 4 of 323 AI answers; the "after" run on 2026-12-21 repeats it exactly (D10, D17, D20).

| file | contents | status |
|---|---|---|
| `protocol.md` | Engines, modes, run count, exact setup per engine | to copy in from Johan's working folder |
| `questions.md` | The 12 unbranded questions | to copy in |
| `results/<engine>.csv` | One row per check: question, run, named (y/n), names cited | to copy in |

Setup per engine (D10): ChatGPT Temporary Chat with personalisation off; Gemini temporary chat; Google normal search (google.co.nz, logged in); Perplexity logged in; Claude incognito with web search on; Bing AI answer (Copilot needed sign-in). Five fresh runs per question per engine.
