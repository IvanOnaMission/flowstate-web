---
title: Page briefs
purpose: How to write a brief for an approved backlog row, and the template to copy
read_when: writing a brief, or preparing an interview with /seo-interview
updated: 2026-11-26
audience: [Johan, agents]
status: active
stability: stable
owner: Johan
supersedes: none
---

Write a brief only for a row Johan has marked "build" in `docs/backlog.md`. Name it `docs/briefs/<slug>.md`, using the page's proposed slug. Its "Question pack" section is what `/seo-interview` reads. The method is playbook 4.7 and Appendix A, written here in our own words (D29).

## Template

```
---
title: Brief, <page title>
purpose: What the page must answer, what it feeds, and what Ivan must supply
read_when: drafting this page, or running its interview
updated: <yyyy-mm-dd>
audience: [Johan, agents]
status: draft
stability: changing
owner: Johan
supersedes: none
---

Backlog row: <#, score, date triaged>
Main searched question (exact words):
Slug (3 to 7 words, no year, no "best"):        H1 (60 characters or fewer):
Money page (one):                                Secondary (two at most):
Why that money page: (Search Console pairing or inbound links, with date)
Linked from (2 to 3 live pages, each with the sentence and anchor text to add):
Demand evidence: measured (Search Console or Bing, date) / string exists (autocomplete, People also ask) / estimate
Scores: D __ G __ F __ = __        Proof gate: pass / pending (what is missing)
Gate likely to fail: 0 indexed / 1 retrieval / 2 naming, and why

## Questions the page answers

Every searched wording gets one fate: H2, FAQ item, answered on another page (with a link), or dropped (with a reason).

## Pages that rank now

Rank, URL, type, what each answers and what it misses. For reference only: never quoted or paraphrased.

## Proof

Claims the page will need, each with its source in `decisions.md`, `content/answers-batch-1.md` or `interviews/`. Anything missing goes into the question pack.

## Question pack

Five to eight questions for Ivan, one per line, numbered Q1, Q2 and so on. Each asks for something only Flowstate can say: a real job, a figure, a name Ivan can share, a date, a result. Never put an answer in the question.

## How we'll check it worked

What to measure, from what date and against which baseline (for example: indexed on Google and Bing; Search Console impressions for the main question after 28 days; named in the next monthly sweep).
```
