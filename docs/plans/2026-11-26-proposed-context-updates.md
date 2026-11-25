---
title: Proposed context updates from the playbook-gaps work
purpose: Changes to AGENTS.md and decisions.md that the playbook-gaps steps need, set out for review and Johan's yes before they are applied
read_when: reviewing or applying these changes
updated: 2026-11-26
audience: [Johan, agents]
status: proposed
stability: changing
owner: Johan
supersedes: none
---

Both files are `propose` in the `AGENTS.md` index, so neither is edited until Johan says yes and a judge review has passed (`AGENTS.md` context rules).

## 1. New rows for the `AGENTS.md` documents table

Insert after the `docs/audits/` row:

| path | purpose | read_when | stability | edits |
|---|---|---|---|---|
| `docs/backlog.md` | Ranked page backlog: scores, evidence, Johan's triage | choosing the next pages, writing a brief | changing | direct |
| `docs/briefs/` | One brief per approved backlog row, with its question pack; template in its README | drafting a page, preparing an interview | changing | direct |
| `docs/interviews/` | Ivan's answers word for word, recorded by `/seo-interview` | drafting from a brief, checking where a claim came from | stable | propose (new answer files are created by `/seo-interview`; recorded answers are never edited, corrections are added as dated lines) |
| `docs/research/` | Dated research, such as the third-party source map; a study's own raw data sits in `docs/research/data/` | outreach, listings, planning pages | changing | direct |
| `docs/sweeps/` | Dated monthly checks (index check, visibility sweep) | the monthly sweep, indexing questions | changing | direct |
| `docs/data/` | Raw exports by month (Search Console, Bing, autocomplete) | scoring the backlog, checking an evidence line | stable | propose (new months are added directly) |
| `.claude/agents/flowstate-seo.md`, `.claude/commands/seo-interview.md` | SEO agent rules and the interview command | research or drafting sessions, running an interview | stable | propose |

Why: plan step 4.5 maps the playbook's `seo/` folders onto ours, and an agent finds a doc only through this index. `docs/plans/` isn't indexed either; that's left as it is here (recorded, not part of this change).

## 2. D37 for `docs/decisions.md`

| id | date | decision | why | decided by | status | source | replaces |
|---|---|---|---|---|---|---|---|
| D37 | 2026-11-26 | In the 21 Dec "after" run, also record the source URLs each engine shows (Perplexity sources, ChatGPT citations, AI Overview links, Bing references, Claude search results, Gemini sources where shown), without changing questions, engines, modes or run count | Pass A is a proxy built from search results; the engines' own sources confirm or correct the target ranking, and the D17 count is unaffected | Johan (D22) | proposed | `docs/plans/2026-11-26-playbook-gaps.md` Decision A | none |

It stays "proposed" until Johan says yes. It adds a recording column to the stable baseline protocol (`docs/baseline/protocol.md`), which is why it gets a judge review first. Once Johan settles it, the matching `protocol.md` edit (a sources column) is drafted and reviewed as its own change, and the summary paragraph at the top of `decisions.md` mentions D37.

## Review

Judge review, 2026-11-26 (independent agent): UPHELD WITH CONDITIONS. Condition 1 (the `docs/interviews/` edits value must allow `/seo-interview` to create answer files) is applied above. Minor findings handled: raw data in `docs/research/data/` is now named in the research row and in the agent file; the D37 protocol edit and the decision-log summary are noted as follow-ups. Not changed: `docs/briefs/README.md` stays `stable` while the folder is `direct`, because briefs change and the template doesn't.
