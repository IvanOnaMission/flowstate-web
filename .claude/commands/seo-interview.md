---
description: Interview Ivan from a page brief's question pack, one question at a time, recording his answers word for word
argument-hint: <path to brief, e.g. docs/briefs/ai-automation-auckland.md>
---

You are running an interview for a Flowstate page. Johan is on a call with Ivan and types Ivan's answers. Your job is to ask and record. You don't write the page.

Brief: $ARGUMENTS

## Before the first question

1. Read the brief. If it has no "Question pack" section, or the file doesn't exist, stop and say so.
2. Take the slug from the brief's file name. The answers file is `docs/interviews/<slug>-answers.md`. If it already exists, ask Johan whether to continue it or start a new file with today's date in the name. Never overwrite it.
3. Create the answers file with this header, then tell Johan the number of questions and ask the first one:

```
---
title: Interview answers, <page title from the brief>
purpose: Ivan's answers, word for word, for the page in <brief path>
read_when: drafting or checking claims for that page
updated: <today>
audience: [Johan, agents]
status: recorded
stability: stable
owner: Johan
supersedes: none
---

Interviewee: Ivan. Typed by Johan on <today>, during a call. Source for any claim drawn from this file: "<this path>, Q<n>".
```

## Asking

- Ask one question at a time, using the brief's wording. Wait for the answer before moving on.
- Write each answer to the file as soon as you get it, under `## Q<n>. <question>`, exactly as typed: same words, spelling and order. Don't fix grammar, summarise, merge or tidy it. If Johan marks part of an answer as his own note, record it as `Note (Johan): …`, kept apart from Ivan's words.
- At most one follow-up per question, and only when the answer is vague on a figure, a name, a date or a result ("a lot of time", "a client in Auckland", "recently", "it worked well"). Record it as `Follow-up:` with the answer under it. If it's still vague, move on.
- Never suggest an answer, offer example answers, or finish Ivan's sentence. If Ivan asks what to say, reply that it has to be his own words, or he can skip the question.
- "Skip", "don't know" or "ask me later" is recorded as given, and the question goes on the GAPS list.

## At the end

1. Add `## GAPS`: every question skipped, unanswered or still vague, each with what is missing (a figure, a name, a date or a result).
2. Pick the three strongest lines: specific, checkable, and things only Flowstate can say. Quote them exactly and ask Ivan, through Johan, a yes or no for each to be used publicly under his name. Record each answer under `## Read-back` as `yes`, `no` or `change: …` with his words. Only lines with a yes may be published. Prices and percentages stay off public pages even with a yes (D06); say so when a line contains one.
3. Tell Johan the file path and the GAPS count. Stop there: no drafting, no claims added to `decisions.md`, no commit unless Johan asks.

## Never

- Invent, guess or fill in an answer.
- Send anything to anyone. This command only writes the answers file.
- Store a password, an email address or a client's personal details. If one comes up, replace it with `[removed]` and tell Johan.
