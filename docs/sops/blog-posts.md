---
title: SOP, blog posts from Jordan's answers
purpose: The repeatable path from a searched question to a live, indexed guide post, with who does what and the gates in between
read_when: Jordan sends answers or copy, drafting or publishing a post, planning the publishing week
updated: 2026-11-26
audience: [Johan, Jordan, agents]
status: active
stability: changing
owner: Johan
supersedes: none
---

A blog post here is a guide at `/guides/<slug>/`. Every post answers one question tradies really search, in the words of the real person who knows the answer, and names Flow State in its answer so search engines and AI assistants can quote it. This is Jordan's playbook (sections 4.3, 5, 6.1, 8.6, 9.10, 12.5) applied to our site, with our decisions on top. The playbook lives in the private `flowstate-business` repo (D29).

## Who does what

| who | does | never |
|---|---|---|
| Jordan | Pulls the searched questions (playbook 4.3), answers them in his own words, sends real photos | Writes in someone else's name |
| Johan | Saves Jordan's answers as they arrived, runs `/seo-draft`, reads the draft, says the publishing yes, presses Request indexing | Edits a saved answers file |
| Agent (`/seo-draft`) | Formats the answers into the post template, checks the rules, lists every claim with its source | Adds a fact, figure, example or quote that isn't in the answers |
| Ivan | Answers the monthly batch of "Questions for Ivan" (new client claims, new numbers) | Is asked about anything this SOP already settles |

Ivan decides public claims, pricing, naming and spend. Johan decides content and publishing (D03). So a post built only from Jordan's own experience, with no new client claim, needs nothing from Ivan.

## The steps

### 1. Questions (Jordan)

Jordan's "blog interview questions pull" is playbook step 4.3: the questions people actually search (Search Console, Bing, Google autocomplete and People also ask, AI fan-out searches). For each question he will answer, he sends:

```
Question (exact searched words):
Where it came from (Search Console / autocomplete / People also ask / AI fan-out / customer), with date:
Related questions people also ask (one per line):
```

Johan adds each one to `docs/backlog.md` if it isn't already there. If a live page already answers it, the answer improves that page and doesn't become a new post (no two pages for one question).

### 2. Answers (Jordan)

Jordan answers in his own words: by Slack message, a doc, or a voice note transcript. Prose copy is fine too; it's still his words. What makes a post worth publishing (playbook 5.2):

- the direct answer, the way he'd say it to a tradie on site, in two or three sentences;
- one real job: the problem, what was done, the result (no client names unless the client agreed in writing);
- any number, where it came from, and what it doesn't include;
- what people get wrong, what not to do, and where it breaks.

Johan saves the answers exactly as they arrived in `docs/interviews/<slug>-answers-jordan.md`, with the same header as `/seo-interview` files, and "Interviewee: Jordan. Sent by Slack on <date>". Never tidy, fix or shorten it. It's the proof that a real person supplied the substance (playbook 5.3, rule 12). A correction is a new dated line under the answer.

### 3. Draft (agent)

Run `/seo-draft docs/interviews/<slug>-answers-jordan.md`. The command:

1. writes a coverage map: every question gets one fate (heading, FAQ item, answered on another page, or dropped with a reason);
2. builds `src/content/posts/<slug>.ts` and `src/app/guides/<slug>/page.tsx`, and adds the post to `src/lib/posts.ts`;
3. uses Jordan's sentences, reordered into the template; it cuts and orders, it doesn't invent;
4. marks any sentence it can't source as `UNSOURCED` in its report, and leaves that sentence out;
5. runs `npm run check:posts` until it passes;
6. reports the claims list with sources, the gaps, and the questions for Ivan, if any.

The template is enforced in code (`src/lib/post-rules.ts`). The build fails if a post breaks it, so the Netlify preview fails instead of shipping a broken post:

- slug of 3 to 7 words, no year, no "best"; H1 of 60 characters or fewer; meta title of 50 to 60; description of 150 to 160;
- direct answer of 40 to 55 words, 320 characters or fewer, naming Flow State;
- one H2 per searched question, each opening with a sentence that answers it;
- "In short" naming Flow State; FAQ of 0, or 3 to 10 questions, rendered and in FAQPage schema word for word;
- BlogPosting schema with the real author and dates;
- no prices or percentages (D06), no em or en dashes (D34), "Flow State" as two words (D43);
- a non-empty claims list.

`scripts/check-posts.mts` adds two checks across posts (playbook 12.5): at least 300 words per post, and no two posts sharing half their wording.

### 4. Claims check (independent)

Before the PR is marked ready, a fresh agent that didn't draft the post compares every sentence with the answers file and the claims list. Anything about clients, numbers or results needs a source in `docs/decisions.md` before it goes live (`AGENTS.md`). Jordan's own business can be named as his own, never as a client (D42).

New client claims or numbers go under "Questions for Ivan" in `docs/status.md`. They are asked once a month in one message. The post either waits for that answer or goes live without the claim.

### 5. PR and preview (Johan)

One PR per release, holding every post that's ready. Check on the Netlify preview: the page renders, the date shows, the FAQ is visible, View source has BlogPosting (and FAQPage if there is a FAQ), the post shows on `/guides/`, and it's in `/sitemap.xml`.

### 6. Publish (Johan)

Merging to `main` is publishing, and every merge to `main` is a paid Netlify production deploy. So there is one release day a week, and one merge per release.

The yes names the posts: "Publish now: <slug>, <slug>". Johan says it in the session (playbook 8.6, gate 1).

### 7. After publishing (Johan, with the agent)

1. Fetch each live post twice, plain and with `?v=<time>`, and check the content, the schema and the sitemap entry.
2. Resubmit the sitemap in Google Search Console and Bing Webmaster Tools.
3. Press Request indexing in Google for each new post. A human does this; it isn't automated.
4. 3 to 7 days later, run URL Inspection on each post, one at a time, and record the result in `docs/sweeps/`.
5. Don't read AI-answer probes for a post until it's indexed.

## How many, how often

- **Jordan can write as fast as he likes.** Approved drafts wait in their PR. Nothing is lost by queueing.
- **Publishing: no more than 4 new pages a month (D30)** until the monthly sweep shows the last batch was indexed and is clean. Then up to 2 a week. December's 4 go out in one or two weekly releases, so the 2026-12-21 run has indexed pages to find.
- Why not 2 to 4 a week from day one? Jordan's own playbook says publishing cadence is SEO-neutral ("Drip-feeding is better" is folklore, section 11, theme L). It also sets the cap of 4 a month until the sweep shows the batch was indexed and clean (12.5). On a new site, the risk is thin or near-duplicate pages (scaled content abuse), not too few posts. Weekly releases also keep Netlify production deploys to about four a month.

## Photos

Real photos only: Jordan's or Ivan's own jobs, the team, real screenshots. Never stock, never AI-made (playbook 9.10, 5.4). No client names, addresses or data in the picture.

Photos help trust and clicks, not ranking (9.10). A post can go live without a photo; the page then uses the site image for link previews.

To add a photo, put it in `public/assets/guides/<slug>/`, at least 1200 pixels wide. Write alt text that says what's in it, and add it as `image` in the post file. Hiring a photographer is Ivan's spend decision. Phone photos from real jobs are fine meanwhile.

## Bylines

The byline is the real person whose answers the post is built from (playbook 5.4: no invented author or persona byline). Authors are listed in `src/lib/post-rules.ts`:

- Ivan Barnett, Founder;
- Jordan, Strategy: the same name and role as `/about/` ("Strategy", never "Partner").

A new author is added only with that person's yes.

## Measuring

- The monthly sweep: Search Console impressions and clicks for each post's main question, Bing, and index status.
- The quarterly AI-visibility run (`docs/baseline/protocol.md`), which repeats the same questions every time.
- Report "indexed" only from URL Inspection, never from the sitemap count (playbook 8.6).
