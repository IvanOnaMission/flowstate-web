---
title: Baseline Protocol
purpose: Exact method for the visibility baseline, so the "after" run repeats it
read_when: running or comparing the "after" visibility run
updated: 2026-11-26
---

The "after" run (2026-12-21, D20) must repeat this exactly.

## Scope
- Questions: the 12 in `questions.md`, word for word.
- Runs: 5 fresh runs per question per engine (60 checks per engine, 360 in total).
- Browser: Johan's logged-in Chrome.

## Setup per engine (D10)

| engine | mode |
|---|---|
| ChatGPT | Temporary Chat, personalisation off |
| Gemini | Temporary chat |
| Google AI Overviews | Normal search on google.co.nz, logged in |
| Perplexity | Logged in |
| Claude | Incognito, web search on |
| Bing AI answer | Bing AI answer (Copilot needed a sign-in) |

## What counts as "named"
Settled in D23 (2026-11-25), for the baseline and the "after" run alike:

- **Named:** the answer uses "Flowstate", "FlowState" or "Flow State" as the name of a business (not the phrase "flow state"), and also either links a flowstate.net.nz page or describes that business as doing AI or automation for trade businesses. This rules out other businesses with the name, such as Flow State, the NZ mushroom-supplement brand.
- **Name only:** a business-name mention without that link or description. Record it, but don't count it towards D17.
- Record each check as `y` (named), `name only` or `n`. For `y` and `name only`, save the link or quote the words that decided it. Johan makes the call.

Baseline reclassified (2026-11-25): the 4 Gemini hits (Q1, Q2, Q5) were "FlowState" or "Flowstate" in a list of NZ automation agencies, with no link and no detail (baseline session results summary, 2026-11-23; the answer text wasn't kept). All 4 are name only, so the baseline is 0 of 360 named.

## Sources recorded in the "after" run (D37)
Added 2026-11-26, for the 2026-12-21 run only. It changes no question, engine, mode or run count, and the D17 count still uses only the `flowstate_named` column.

- Each engine's results file in `results/` (`<engine>.csv`, like `gemini.csv`; create it for an engine that has none yet) gets one more column, `sources`: the URLs the answer shows as its sources, separated by "; ", in the order shown. Perplexity: its sources list. ChatGPT: its citations. Google AI Overviews: the links in the overview. Bing: the references under the answer. Claude: the search results it cites. Gemini: its sources, where it shows any.
- Write `none shown` when the engine shows no sources for that check. Leave the column blank in the baseline rows, which didn't record it.

## Known limits
- Gemini's free tier stopped the run with "Limit reached. Resets Nov 24"; the last 6 Gemini checks ran on 2026-11-24 after the reset.
