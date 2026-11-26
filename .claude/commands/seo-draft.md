---
description: Format a recorded answers file into a guide post (data file, page, registry entry), adding nothing that isn't in the answers
argument-hint: <answers file, e.g. docs/interviews/ai-quoting-time-answers-jordan.md>
---

You are formatting a Flow State guide post from answers a real person gave. You format; you don't write new material. The process is `docs/sops/blog-posts.md`, step 3.

Answers file: $ARGUMENTS

## Before drafting

1. Read the answers file, `docs/sops/blog-posts.md`, `src/lib/post-rules.ts`, and the brief `docs/briefs/<slug>.md` if it exists. If the answers file doesn't exist, stop and say so.
2. Read the claim rules: `AGENTS.md` (Rules), and in `docs/decisions.md` D06, D25, D30, D34, D42 and D43.
3. Check that the question isn't already answered by a live page. Grep `src/app` for the main question's key words. If a live page answers it, stop and propose adding the answer to that page instead.
4. Set the author to the person who gave the answers. That person must be in `authors` in `src/lib/post-rules.ts`; if they aren't, stop and say so.

## Drafting

1. Write a coverage map first, in your report: every question in the answers file, with its fate. Each fate is H2, FAQ item, "answered on <page>", or "dropped: <reason>".
2. Write `src/content/posts/<slug>.ts`, exporting `default` a `Post`, with `import type { Post } from "@/lib/post-rules";` as its only import.
   - Use the speaker's own sentences, cut and reordered to fit the template. You may fix spelling, join two of their sentences, or turn a run of items into a list. You may not add a fact, a figure, an example, a tool name, a quote or an opinion that isn't in the answers.
   - The direct answer is their two or three sentences that answer the H1. Add "Flow State" only where they said "we" or "us" about Flow State.
   - Set `published` to the planned release day. Don't set `updated`.
   - Fill `claims` with one line per factual statement: `"<claim>: docs/interviews/<file>, Q<n>"`, or a D-number.
   - If a sentence has no source, put it in your report as `UNSOURCED: <sentence>` and leave it out of the post.
3. Write `src/app/guides/<slug>/page.tsx`, copying an existing post page if there is one:
   ```tsx
   import GuidePost, { postMetadata } from "@/components/GuidePost";
   import post from "@/content/posts/<slug>";
   export const metadata = postMetadata(post);
   export default function Page() { return <GuidePost post={post} />; }
   ```
4. Import the post in `src/lib/posts.ts` and add it at the top of `posts`, which is ordered newest first.
5. Run `npm run check:posts`. Fix what it reports by cutting or reordering the speaker's words, never by adding new ones. Repeat until it passes.

## Report

1. The coverage map.
2. The `UNSOURCED` lines.
3. Gaps: what the post needed that the answers didn't give.
4. Any claim about clients, numbers or results without a `decisions.md` row, written as a one-line question for Ivan, to batch under "Questions for Ivan" in `docs/status.md`.
5. The claims list, to paste into the PR body.

Stop there. Don't commit, push or publish unless Johan asks.

## Never

- Edit the answers file.
- Invent an author, a quote, a client, a figure or a photo, or use a stock or AI-made image.
- Put a price or a percentage on the page, even if the speaker said one (D06).
- Send anything to anyone.
