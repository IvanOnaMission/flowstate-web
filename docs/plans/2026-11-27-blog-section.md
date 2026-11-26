---
title: Plan, a Blog section and Jordan's first post
purpose: End-to-end plan to add /blog/ with a "Blog" nav link and publish "Is an AI receptionist any use to a tradie?"
read_when: building the blog section, formatting or publishing Jordan's posts
updated: 2026-11-27
audience: [Johan, agents]
status: done
stability: changing
owner: Johan
supersedes: none
---

Outcome (2026-11-27): Johan approved C1 to C4 as written ("this is fine"), so the post keeps its figures, title and client lines (D45, D46, Ivan to confirm), and C5 went with the 301 (D44). Built on branch `claude/ai-receptionist-blog-753e72`. Ivan gave his go the same day, so D45 and D46 are settled and `/about/` now shows "Partner, Business Strategy".

Source: Jordan's Slack message (2026-11-27) and his copy `ai-receptionist-for-tradies.md`. Jordan asks for a "Blog" link in the top nav, a page like `/guides/`, and posts at `/blog/<slug>`. He wants 2 to 4 posts a week.

## What already exists

The blog pipeline is already merged: `src/lib/post-rules.ts` (Post type and rules, which the build enforces), `src/lib/posts.ts` (empty list), `src/components/GuidePost.tsx` (renders the post, byline, BlogPosting and FAQPage schema, sources, "More guides"), `npm run check:posts`, `/seo-draft`, and `docs/sops/blog-posts.md`. Posts currently go to `/guides/<slug>/`. None are published, so moving them to `/blog/` needs no redirects.

## Conflicts in the post as sent (fix before it goes live)

| # | Issue | Rule | Who decides | Proposed fix |
|---|---|---|---|---|
| C1 | Percentages: 87%, 57%, 20%, 52.5%, 53.8%, 25% | No percentages on any public page (D06, `AGENTS.md`). The build fails on them | Ivan (D06 is his) | Either Ivan narrows D06 to Flow State's own prices and results, or we reword as counts: "51 of 90", "about half", "52 of 99 before, 28 of 52 after", "nearly nine in ten", "one caller in four" |
| C2 | Prices: "$200 a month", "$199 a month" (body and FAQ) | No prices (D06). The build fails | Ivan | Same choice. Reword option: "a standalone one is a monthly subscription; one extra job a month more than pays for it", keeping the Talkify link as the source |
| C3 | Byline "Jordan Statham, Partner, Business Strategy" | `/about/` and `post-rules.ts` say "Strategy", never "Partner", because the equity term sheet is unanswered | Ivan (public claims) | Use "Jordan Statham, Strategy at Flow State" unless Ivan confirms the partnership. Adding the surname is fine: Jordan supplied it |
| C4 | Client claims: "Flow State has set them up for clients", "seen clients get bad reviews", "most of the receptionists Flow State sets up sit inside an internet phone system" | Every client claim needs a source in `decisions.md`. D16: never offer a receptionist as a product | Ivan | One question for Ivan. Until answered, either hold the post or cut those three lines (the post stands on Jordan's own business) |
| C5 | Same question as the live `/ai-receptionist-for-tradies/` (ranks #1 for Q4, #15 for Q7) | One page per question (SOP step 1, backlog I2) | Johan | 301 the old page to the new post, which covers everything it says and more. Alternative: keep the old URL and list it on `/blog/` |
| C6 | Author box claims (registered electrician, electrical inspector) | Claims need a source | Johan | Jordan's own statement about himself: record it as a claim line from his copy |

No em dashes, "Flow State" is two words, the slug is 4 words, H1 is 42 characters, the meta title is 55 and there are 6 FAQ items, so the rest passes the rules.

## Build steps

1. **Routes.** Add `src/app/blog/page.tsx`, the index, built from `posts` like `/guides/`. Replace the one-file-per-post pattern with `src/app/blog/[slug]/page.tsx` using `generateStaticParams` and `dynamicParams = false`. A new post is then one data file plus one line in `posts.ts`. Read the Next 16 docs in `node_modules/next/dist/docs/` first (`AGENTS.md`).
2. **Nav.** Add `{ href: "/blog/", label: "Blog" }` to `nav` in `src/lib/site.ts`, after Guides. That makes 7 links: check the desktop row at `lg` and the mobile wrap.
3. **Paths.** Change `/guides/<slug>/` to `/blog/<slug>/` in `postMetadata`, `posts.ts` comments, `sitemap.ts`, `public/llms.txt` (add the blog), and the "More guides" heading ("More from the blog"). `/guides/` keeps its 5 hand-written guides and stops listing posts.
4. **Template additions** that Jordan's format needs (`post-rules.ts` and `GuidePost.tsx`, renamed `BlogPost`):
   - `intro?: string`, the opening paragraph before the bolded direct answer;
   - H3 subsections inside a section (`{ h3: string }` block);
   - inline links written `[text](url)` in strings, rendered as `<a>` (external links get `rel="noopener"`). `visibleText` strips the URL, so the rules check only the words;
   - an "About the author" box after the FAQ: photo left, text right. Add `bio` and `photo` to `authors` (Jordan: `/assets/team/jordan.jpg`);
   - closing CTA line from the post (optional `cta`), falling back to the current one.
   - Keep the schema built from the data (it already makes BlogPosting and FAQPage), so the JSON blocks in Jordan's file aren't pasted. Fix `jobTitle` to match C3.
5. **Redirect (C5).** Add `/ai-receptionist-for-tradies/ /blog/ai-receptionist-for-tradies/ 301` to `public/_redirects`. Delete `src/app/ai-receptionist-for-tradies/`, remove it from `src/lib/answers.ts`, and repoint links from `/questions/`, `/ai-for-electricians/` and any others (grep).
6. **Content.** Save Jordan's file exactly as sent to `docs/interviews/ai-receptionist-for-tradies-answers-jordan.md` with the interview header ("Sent by Slack on 2026-11-27"). Run `/seo-draft` on it. It writes `src/content/posts/ai-receptionist-for-tradies.ts`, applies the C1 to C4 outcome, and fills `claims` and `sources`. Set `published` to the release day.
7. **Checks.** Run `npm run check:posts`, `npm run lint` and `npm run build`. A fresh agent does the claims check (SOP step 4). Open the local preview: nav, `/blog/`, the post, the author box, inline links, the FAQ, View source for both schemas, `/sitemap.xml`, and the redirect on the branch deploy (`_redirects` only works on Netlify).
8. **Docs.** SOP and `/seo-draft`: `/blog/` paths, plus intake of finished copy (Jordan sends whole posts, not Q&A), handled like answers: saved verbatim, then formatted. Add `decisions.md` rows, proposed: D44 posts live at `/blog/<slug>/` with a Blog nav link (Johan, D03); D45 the outcome of C1 to C3 if Ivan rules. Update `status.md` Focus 6 and backlog row I2. A judge review is needed (public URL structure, a new decision row), per `AGENTS.md`.
9. **Publish.** One PR on this branch, checked on the branch deploy, merged on release day (one paid production deploy; see the batching memory). Then follow SOP step 7: fetch it live, run IndexNow, resubmit the sitemap in Google and Bing, request indexing for the post and `/blog/`, and run URL Inspection 3 to 7 days later.

## Cadence

Jordan wants 2 to 4 a week. D30 (proposed, Johan's call) caps new pages at 4 a month until the sweep shows them indexed and clean, then 2 a week. His own playbook says cadence is SEO-neutral. Proposal: Jordan writes at his pace, finished posts queue in the PR, and one weekly release goes out. December gets this post plus up to 3 more, before the 2026-12-21 "after" run.

## Message to Jordan (draft, not sent)

> Blog's going in: "Blog" in the top nav, posts at flowstate.net.nz/blog/<slug>. Yours is first. Three things before it goes live: (1) site rule is no percentages or prices on public pages (Ivan's call), so the hang-up stats will read as counts ("51 of 90") unless Ivan OKs numbers; (2) your title shows as "Strategy" like the About page until the partnership's confirmed; (3) the lines about clients need Ivan's OK. Keep the copy coming; we'll release weekly, about 4 a month to start, and queue the rest.
