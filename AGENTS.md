Context index for the Flow State SEO and AI-visibility project: read this first. Current status lives in `docs/status.md`. Source of truth: this repo (`flowstate-web`). The Claude Team Project holds copies; never edit a copy.

Flow State (flowstate.net.nz) builds AI automation for NZ trade businesses. Johan runs the SEO and AI-visibility work from Jordan's SEO plan, so search engines and AI assistants (ChatGPT, Gemini, Google AI Overviews, Perplexity, Claude, Bing) name Flow State when tradies ask about automation.

## Documents

| path | purpose | read_when | stability | edits |
|---|---|---|---|---|
| `AGENTS.md` | This index and the rules | every session | stable | propose |
| `docs/decisions.md` | Settled, proposed and open decisions | before any public change, pricing, naming or targeting work | changing | propose |
| `docs/status.md` | Phase, focus, blockers, recent changes | starting a session, planning the week | changing | direct |
| `docs/brief.md` | Problem, people, requirements (not yet written) | scoping new work | stable | propose |
| `docs/mvp-plan.md` | Scope, timeline, success threshold (not yet written) | planning, estimating | stable | propose |
| `docs/plan-jordan-gaps.md` | What from Jordan's SEO plan is done, what Johan can do now, and what waits on someone else | planning site or visibility work against Jordan's plan | changing | direct |
| `docs/content/answers-batch-1.md` | Ivan's answers to the 20 customer questions (source material for pages) | writing site pages, LinkedIn posts, FAQ | stable | propose |
| `docs/content/profile-copy-google-linkedin.md` | Paste-ready Google profile and LinkedIn page copy, with sources per claim | editing the Google profile or LinkedIn page, writing their posts, replying to reviews | changing | direct |
| `docs/baseline/` | Visibility baseline: protocol, questions, raw results per engine | running or comparing the "after" run | stable | propose |
| `docs/audits/` | Dated audits of external profiles (Google Business Profile first) with proposed fixes | editing the Google profile or planning local or AI-visibility work | changing | direct |
| `docs/backlog.md` | Ranked page backlog: scores, evidence, Johan's triage | choosing the next pages, writing a brief | changing | direct |
| `docs/briefs/` | One brief per approved backlog row, with its question pack; template in its README | drafting a page, preparing an interview | changing | direct |
| `docs/interviews/` | Ivan's answers word for word, recorded by `/seo-interview` | drafting from a brief, checking where a claim came from | stable | propose (new answer files are created by `/seo-interview`; recorded answers are never edited, corrections are added as dated lines) |
| `docs/sops/blog-posts.md` | SOP for blog posts: Jordan's questions and answers to a live, indexed guide, with gates, cadence, photos and bylines | Jordan sends answers or copy, drafting or publishing a post, planning the publishing week | changing | direct |
| `docs/research/` | Dated research, such as the third-party source map; a study's own raw data sits in `docs/research/data/` | outreach, listings, planning pages | changing | direct |
| `docs/sweeps/` | Dated monthly checks (index check, visibility sweep) | the monthly sweep, indexing questions | changing | direct |
| `docs/data/` | Raw exports by month (Search Console, Bing, autocomplete) | scoring the backlog, checking an evidence line | stable | propose (new months are added directly) |
| `.claude/agents/flowstate-seo.md`, `.claude/commands/seo-interview.md`, `.claude/commands/seo-draft.md` | SEO agent rules, the interview command and the post formatter | research or drafting sessions, running an interview, formatting a post | stable | propose |
| Jordan's SEO plan (tasks T1...), Project only | Original plan and task ids | checking task ids or original scope | stable | propose (owned by Jordan, not edited here) |
| Jordan's playbook: `marketing/seo/claude-seo-aio-playbook.md` in the private repo `IvanOnaMission/flowstate-business` (linked, never copied here: this repo is public, D29) | Full method for SEO and AI-answer work: agent setup, question data, interview, page rules, Google profile, measurement, mistakes log. Where it differs from our decisions, see D29 to D35 | planning pages, the Google profile, measurement or the monthly sweep | stable | propose (owned by Jordan, not edited here) |

## Rules

- Brand name: "Flow State", two words, in all visible copy and schema `name` (D43). "Flowstate" appears only as schema `alternateName`; the domain, emails, URLs and internal keys stay `flowstate`.
- No prices or percentages on any public page (D06).
- Every public claim about clients, numbers or results needs a source in `decisions.md` before it goes live.
- Never send messages, posts or emails to anyone without Johan's explicit go-ahead in the session.
- Never type or store passwords. Johan logs in himself.
- Tasks are GitHub Issues on `flowstate-web`, one per deliverable, each with an owner and a `Context:` line listing 1 to 3 docs.
- Website changes go through PRs on `flowstate-web`; check the Netlify preview before merging.
- The "after" visibility run must repeat `docs/baseline/protocol.md` exactly (same questions, engines, modes, run count).

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
