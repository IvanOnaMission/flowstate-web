Context index for the Flowstate SEO and AI-visibility project: read this first. Current status lives in `docs/status.md`. Source of truth: this repo (`flowstate-web`). The Claude Team Project holds copies; never edit a copy.

Flowstate (flowstate.net.nz) builds AI automation for NZ trade businesses. Johan runs the SEO and AI-visibility work from Jordan's SEO plan, so search engines and AI assistants (ChatGPT, Gemini, Google AI Overviews, Perplexity, Claude, Bing) name Flowstate when tradies ask about automation.

## Documents

| path | purpose | read_when | stability | edits |
|---|---|---|---|---|
| `AGENTS.md` | This index and the rules | every session | stable | propose |
| `docs/decisions.md` | Settled, proposed and open decisions | before any public change, pricing, naming or targeting work | changing | propose |
| `docs/status.md` | Phase, focus, blockers, recent changes | starting a session, planning the week | changing | direct |
| `docs/brief.md` | Problem, people, requirements (not yet written) | scoping new work | stable | propose |
| `docs/mvp-plan.md` | Scope, timeline, success threshold (not yet written) | planning, estimating | stable | propose |
| `docs/content/answers-batch-1.md` | Ivan's answers to the 20 customer questions (source material for pages) | writing site pages, LinkedIn posts, FAQ | stable | propose |
| `docs/baseline/` | Visibility baseline: protocol, questions, raw results per engine | running or comparing the "after" run | stable | propose |
| Jordan's SEO plan (tasks T1...), Project only | Original plan and task ids | checking task ids or original scope | stable | propose (owned by Jordan, not edited here) |

## Rules

- Brand name: "Flowstate", one word, everywhere (D04).
- No prices or percentages on any public page (D06).
- Every public claim about clients, numbers or results needs a source in `decisions.md` before it goes live.
- Never send messages, posts or emails to anyone without Johan's explicit go-ahead in the session.
- Never type or store passwords. Johan logs in himself.
- Tasks are GitHub Issues on `flowstate-web`, one per deliverable, each with an owner and a `Context:` line listing 1 to 3 docs.
- Website changes go through PRs on `flowstate-web`; check the Netlify preview before merging.
- The "after" visibility run must repeat `docs/baseline/protocol` exactly (same questions, engines, modes, run count).

## Context rules

> Read this index first, then only docs whose `read_when` matches the task. Put changing facts in the status doc, not in stable docs. Record a decision as settled only when its source shows the person entitled to decide it (see People and decision rights) deciding it; otherwise proposed, or open if still undecided. Edit a doc directly only if its `edits` column says `direct`; otherwise propose the change. At the end of a session that made a decision or changed a file, list proposed context updates (update / add / archive / trim); reviewers and subagents skip only this last step.
>
> Adding or changing a settled decision, and changes to stable docs, schemas/migrations or public interfaces, get an independent review before they are merged or applied (pushed, merged, or written to the shared Project or Doc; local drafts are reviewed as diffs): Claude runs the judge-review skill if it has it; otherwise, and for other agents, flag the change for the user.

## People and decision rights

| name | role | decides |
|---|---|---|
| Ivan | owner | scope, pricing, naming, targeting, budget, public claims |
| Johan | builder | site PRs and repo docs, incl. doc location and this doc standard (D02, D19, D21); content and publishing without sign-off (D03); measurement and tooling pending D22 |
| Jordan | advisor | proposes only (D07) |

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
