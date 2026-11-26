---
title: Google and LinkedIn Profile Copy
purpose: Paste-ready copy for the Google Business Profile and the LinkedIn company page, built from Ivan's answers (batch 1)
read_when: editing the Google profile or LinkedIn page, writing their posts, replying to reviews
updated: 2026-11-25
status: Google profile fields pasted 2026-11-25 (categories, description, website, LinkedIn link, services); Google posts, review replies and photos not done
owner: Johan
---

Copy for audit items 2 to 6 and 9 to 15 in `docs/audits/gbp-audit-2026-11-24.md`, plus the LinkedIn company page (D09). Johan pastes and posts it himself; nothing here has been sent. Every claim traces to a decision, shown as `[D..]` or `[Q..]` notes for review. **Remove the notes before pasting.**

## Rules for this copy

- "Flowstate", one word, every time (D04). The name comes paired with what we do (audit item 14).
- No prices, no percentages, no "$" or "%" (D06, D12 without "95%").
- Only claims cleared in D12 to D15, D24, D25, D28 and D38 to D42. Never used here: the AI receptionist offer (D16), a paid diagnostic (dropped, D38), any default hosting region such as Singapore (D40), training sessions (D41), and "client" or "we work with" for the Q20 business, which is Jordan's own (D42). Still held: the cheat sheet and 30 days of support (Q16), "a person checks every draft for the first month" and "Flowstate fixes it" (Q14), and "business AI plans don't train on your data" (Q15). Cleared: the system runs on the client's own accounts (D39).
- "Six years" belongs to the electrical company behind Flowstate, never to Flowstate (D13). No founding year or opening date.
- Bold, but every line can be proven. No "best", "leading", "#1" or "hottest". The attention comes from concrete numbers that are true (10+ clients, 3 and 7 days, 2 to 3 days, 150 reviews in three months) and from Ivan's own straight talk.
- Same facts and wording as the site, so Google, LinkedIn and AI assistants read one story.

## Links (UTM tags, audit item 15, D22)

| where | URL |
|---|---|
| Google profile, website field | `https://flowstate.net.nz/?utm_source=google&utm_medium=organic&utm_campaign=gbp` |
| Google posts, button link | `https://flowstate.net.nz/<page>/?utm_source=google&utm_medium=organic&utm_campaign=gbp-post&utm_content=<post-id>` |
| LinkedIn page, website field | `https://flowstate.net.nz/?utm_source=linkedin&utm_medium=social&utm_campaign=company-page` |
| LinkedIn posts, link | `https://flowstate.net.nz/<page>/?utm_source=linkedin&utm_medium=social&utm_campaign=li-post&utm_content=<post-id>` |

The tags only count once the site has analytics (D22). They do no harm before that.

---

# Google Business Profile

## Before anything else

1. **Pending Google update (item 2).** On 2026-11-25 the list showed "Google updates (1)" before the edits and 0 after them, so nothing was left to accept or reject. Open "Google updates" in the profile manager. Accept a change only if it matches this doc: name "Flowstate", phone 027 200 6121, website flowstate.net.nz, hours open 24 hours (D28), service area New Zealand (D28). Reject anything else, such as an address, different hours or a two-word name.
2. **Categories (item 4).** Primary: **Automation company**. Secondary: **Software company**, **Business management consultant**. Pasted 2026-11-25: the picker offered all three exactly; they replace "Consultant".
3. **Social profiles (item 9).** LinkedIn: `https://www.linkedin.com/company/146714299/` (the same URL as `sameAs` in `src/lib/site.ts`).
4. **Opening date (item 10).** Leave blank.

## Business description (item 5)

Limit 750 characters, and Google allows no URLs or prices. This draft is 737 characters.

```
Flowstate is an Auckland company that builds AI automation for New Zealand trade businesses. Electricians first, plus plumbing and HVAC businesses. We take the admin off the owner: AI drafts quotes and invoices from your price list and job notes, drafts replies to new enquiries within minutes, follows up quotes nobody answered, and writes emails in your own voice. You approve the drafts, until you choose to let follow-ups send on their own. It runs on the software you already use, like Xero, Fergus, Simpro, AroFlo, Tradify and ServiceM8. Flowstate has delivered for 10+ clients across different trades and is backed by an electrical company that has been automating its own business for six years. Start with a free 30-minute call.
```

Sources: entity sentence (D23 / `site.entity`); trades D05; quotes and invoices D25(c); enquiries and follow-up D25(e); voice D25(g); approval D25(a); tools Q10 to Q12 with D14; 10+ clients and six years D13; free 30-minute call D25(p) and the site's call button.

## Services (item 6)

Add each one as a custom service. Google allows up to 300 characters per description. Keep exactly these five.

**1. AI quote and invoice drafting** (Q6, D25 b, c)
```
AI drafts your quotes and invoices in Xero or your job software from your price list and job notes. Anything it can't price is marked CHECK instead of a made-up number. It can pull in supplier pricing and build a PDF quote pack from your proposal template. You check it and press send.
```

**2. Lead and quote follow-up** (Q7, D25 e)
```
New enquiries get a reply drafted within minutes, asking the right questions. Quotes with no reply get followed up at 3 and 7 days, and it stops as soon as someone replies or says stop. Drafts first that you approve; once you trust it, switch it to send on its own.
```

**3. Email replies in your voice** (Q13, D25 g)
```
We build a voice profile from your meetings, emails and texts, so the AI writes the way you talk: a different tone for a supplier than a new customer, with the words you always use and the ones you never use. Everything goes out from your own email or phone, signed by you.
```

"Own email or phone, signed by you" is cleared for review requests in D25(f) and is the site's Q13 wording on `/questions/`.

**4. Job software and Xero integration** (Q10 to Q12, Q18, D14, D25 h, i, j)
```
We connect your job software and Xero so the AI sees the whole business, not one piece of it. Fergus, Simpro, AroFlo, Tradify, ServiceM8 and more: Flowstate can work with any job management software. Tradify is automated through the browser, which can break when Tradify changes its screens.
```

**5. Setup and AI foundation** (Q18, Q19, D15, D25 p, D38)
```
It starts with a free 30-minute call to find where the time goes. If it's a fit, we build a custom implementation plan. Then we build the foundation in 2 to 3 days: accounts set up in your name, job software and Xero connected, and the AI brain of your prices, rules and processes. Then helpers, one at a time, each tested on real past jobs.
```

Audit item 6 named "setup with training sessions". Training sessions aren't a standard part of the offer (D41), so service 5 leaves them out. The live Google service 5 still says "paid diagnostic" (pasted 2026-11-25): replace it with the text above (D38).

## Review replies (item 3)

The reviewers' names and text aren't in the repo, so fill in each reply from the review itself. The rules:

- Thank them by first name.
- Echo one thing they wrote, in their words.
- Add nothing new about them, their business or the work.
- Sign off as Ivan, as owner.
- Keep it to two or three short sentences. No sales line, no link.

Template:
```
Thanks [first name], really appreciate you taking the time. [One sentence that picks up only what they wrote, e.g. "Glad the quoting is taking less of your evenings."] Ivan, Flowstate
```

Example for a review that only says "Great to work with, highly recommend":
```
Thanks [first name], that means a lot coming from you. Great working with you too. Ivan, Flowstate
```

## Weekly posts (item 12)

One a week, in this order. Post type "Update", with button "Learn more" pointing at the page shown (UTM as above, `utm_content` = the post id). No phone number in the post body, because Google can reject posts that contain one. Add a photo to each post (see Photos).

**gbp-01: Who we are** (button: `/about/`)
```
Same team, one word: Flowstate.

Flowstate is an Auckland company that builds AI automation for New Zealand trade businesses. We're backed by an electrical company that has been automating its own business for six years, and we've delivered for 10+ clients across different trades.

We build on the software you already use. And if AI isn't the answer for something, we'll tell you straight.
```
Sources: D04, D23, D13, D25(q) Q17 trimmed.

**gbp-02: Quotes that build themselves** (button: `/ai-quoting-for-electricians/`)
```
Still writing quotes at 9pm?

Flowstate sets up AI that drafts your quotes and invoices in Xero or your job software, from your price list and the job notes. Anything it can't price gets marked CHECK. It never guesses a number. You look it over and press send.

It works best on repeatable jobs. Big tender-style jobs still need your judgement.
```
Sources: D25(b), (c); "repeatable jobs" and "tender-style" are Ivan's Q6 wording.

**gbp-03: The follow-up nobody has time for** (button: `/quote-and-lead-follow-up/`)
```
Quotes don't win jobs. Follow-up does.

New enquiries get a reply drafted within minutes. Quotes with no reply get followed up at 3 and 7 days, and it stops as soon as the customer replies or says stop.

It starts as drafts you approve. Once you trust it, you switch it to send on its own.
```
Sources: D25(a), (e). The opening line is a view, not a claim about results.

**gbp-04: 150 reviews in three months** (button: `/quote-and-lead-follow-up/`)
```
One Auckland electrical business has a review system that added 150 reviews in three months.

Here's how a system like that works: it asks every customer, every time. When a job's paid, AI drafts a review request that goes from your own phone or email, signed by you, and skips anyone you've asked in the last year.

One rule: never ask for 5 stars and never only ask the happy customers. Google bans both.
```
Sources: D12 ("150 reviews in three months"), D25(f), Q8. Doesn't say "client" or "we work with": it's Jordan's own business (D42).

**gbp-05: Running your business on Fergus?** (button: `/fergus-automation/`)
```
Running your business on Fergus?

Flowstate builds automation on Fergus for New Zealand trade businesses. Through Fergus's API, the AI can create quotes from you talking into your phone, update jobs, schedule work and pull your job and financial info together.

Fergus's API doesn't do invoices or payments, so those run through Xero. The real value comes when Fergus is connected to everything else: your calendar, your email and your AI.
```
Sources: D25(h), Q10 (same wording as `/fergus-automation/`).

**gbp-06: Simpro, fully automated** (button: `/simpro-automation/`)
```
An electrical business run on Simpro, fully automated.

Jordan, who looks after strategy at Flowstate, runs his electrical business on Simpro, and it's fully automated through Simpro. His AI pulls supplier pricing into his catalogue and builds pre-builds.

Through Simpro's API, Flowstate can automate quotes, invoices, payments, suppliers, purchase orders and stock. You need Simpro's Premium plan for the API and quotes, and Simpro has to approve the connection.
```
Sources: D24, D25(i), Q11. Covers the same ground as li-04; post them in different weeks.

**gbp-07: What stays with you** (button: `/guides/ai-for-builders-nz/`)
```
What AI shouldn't do in your business.

Flowstate's view: leads, quotes, follow-up, emails and admin can all be handed to AI today, as long as it drafts and you approve. Two things stay with you: pricing jobs on its own and signing off compliance paperwork.

Anything it can't price gets marked CHECK. It never guesses a number.
```
Sources: D25(m), (a), (b); the task list is Ivan's Q9 wording, shortened.

**gbp-08: What an hour of admin is worth** (button: `/ai-automation-cost/`)
```
What's an hour of admin worth to you?

Before Flowstate builds anything, it does one sum: hours saved a week, times your hourly rate, times 52. That's what the build is worth to you, worked out before it starts.

There's no set price list. Each build is priced from the size of your business and what the problem is costing you.
```
Sources: D25(l), (n). No figures (D06).

**gbp-09: Job software or AI? Both** (button: `/guides/job-software-or-custom-ai/`)
```
Job software or custom AI? Both.

Your job software runs the job. Custom AI from Flowstate takes on the repetitive work around it, and works best connected to your job software, Xero and everything else.

Flowstate can work with any job management software. Xero and AroFlo have full API access. Tradify doesn't, so there the AI works through the browser, which is more fiddly and can break when Tradify changes its screens.
```
Sources: D14, D25(j), Q12.

Ideas for after gbp-09, with the same checks: the voice profile (D25 g) and testing every helper on real past jobs (D25 d).

## Photos (item 11)

| photo | Google | LinkedIn |
|---|---|---|
| Logo | Square, at least 250 × 250 px (720 × 720 works well) | 400 × 400 px |
| Cover | 16:9, 1080 × 608 px | 1128 × 191 px |
| Team | Ivan and Jordan photo from PR 45, once it's merged | same |
| Work | 3 to 5 screenshots of real builds: a drafted quote with a CHECK line, a follow-up draft, a review request. Remove every client name, address, phone number, price and email | same, for posts |

Photos must be real. No stock shots of tradies, and no screenshots with client details left in.

## Review-request flow (item 13)

1. In the profile manager, open "Ask for reviews" and copy the short review link.
2. Send it by SMS to every client when their build is finished, from Ivan's phone, signed by Ivan.
3. Ask every client, not only the happy ones, and never ask for a star rating (Google policy, Q8).
4. One ask per client. Keep a short list of who was asked and when, so nobody is asked twice.

Template:
```
Hi [first name], Ivan from Flowstate here. If you've got a minute, a Google review about working with us would help other tradies find us: [review link]. Thanks, Ivan
```

---

# LinkedIn company page (D09)

| field | value |
|---|---|
| Name | Flowstate |
| Tagline (limit 120) | see below |
| Website | LinkedIn URL from the Links table |
| Industry | IT Services and IT Consulting |
| Company type | Privately held |
| Headquarters | Auckland, New Zealand |
| Founded | leave blank (same reason as item 10) |
| Button | "Visit website" |
| Logo and cover | see Photos |

## Tagline

This one is 74 characters:
```
AI automation for NZ trade businesses. Less admin, more time on the tools.
```
Shorter option, 46 characters:
```
AI automation for New Zealand trade businesses
```

## Overview (About)

LinkedIn allows up to 2000 characters. This one is 1,446 characters.

```
Flowstate is an Auckland company that builds AI automation for New Zealand trade businesses.

Most tradies didn't get into the trade to do paperwork. Yet in a small business it's usually the owner doing the quoting, invoicing and chasing on top of the actual work. That's the work we take off them.

What Flowstate builds:
- Quotes and invoices drafted in Xero or your job software from your price list and job notes. Anything the AI can't price is marked CHECK, never guessed.
- Replies to new enquiries drafted within minutes, and quotes followed up at 3 and 7 days until the customer answers.
- Review requests drafted when a job's paid, then sent from your own phone or email.
- Emails written in your own voice, from a profile built on how you actually talk.

AI drafts, you approve, until you choose to let follow-ups send on their own. Every helper is tested on real past jobs before it goes live.

It runs on the software you already use: Xero, Fergus, Simpro, AroFlo, Tradify, ServiceM8. Flowstate can work with any job management software.

Flowstate is backed by an electrical company that has been automating its own business for six years, and has delivered for 10+ clients across different trades. Electricians first, plus plumbing and HVAC businesses. If AI isn't the answer for something, we'll tell you straight.

The goal: to be New Zealand's go-to for AI in trade businesses.

Start with a free 30-minute call: flowstate.net.nz
```
Sources: D23; Q3 view D25(q); D25(a) to (g), (j), (p) (sending from your own phone or email: D25 f); D14; D13; D05; Q17 trimmed D25(q).

## Specialties

LinkedIn allows up to 20. Paste these:
```
AI automation, Trade business automation, AI for electricians, AI for plumbers, HVAC business automation, AI quoting, Invoice automation, Lead follow-up, Google review automation, Xero integration, Fergus, Simpro, AroFlo, Tradify, ServiceM8, Workflow automation, New Zealand
```

## First posts

One a week, posted from the company page, with a link carrying the UTM tags. Ivan and Johan reshare from their own profiles (D09).

li-01 and li-02 follow Alloy Robotics' early posts: a plain introduction with a stated goal, then short posts with bold list lines. Links go to the homepage until the new pages are live in production.

**li-01: Introduction** (link: homepage, `utm_content=li-01`)
```
Hi LinkedIn, we're Flowstate.

We're an Auckland company that builds AI automation for New Zealand trade businesses. Electricians first, then plumbing and HVAC.

The problem we're here for: in a small trade business, it's usually the owner doing the quoting, invoicing and chasing on top of the actual work.

So we put AI on the admin:
𝗤𝘂𝗼𝘁𝗲𝘀 𝗮𝗻𝗱 𝗶𝗻𝘃𝗼𝗶𝗰𝗲𝘀: drafted from your price list and job notes
𝗙𝗼𝗹𝗹𝗼𝘄-𝘂𝗽: replies to new enquiries drafted within minutes, quotes chased at 3 and 7 days
𝗥𝗲𝘃𝗶𝗲𝘄𝘀: a request drafted every time a job's paid

AI drafts, you approve, on the software you already use.

Behind us is an electrical company that's been automating its own business for six years. We've delivered for 10+ clients across different trades. Our goal is to be New Zealand's go-to for AI in trade businesses, and if AI isn't the answer for something, we'll tell you straight.

Over the coming weeks we'll share what's working in NZ trade businesses: real examples, the tools, and what we'd skip.

Follow along 👇
https://flowstate.net.nz/?utm_source=linkedin&utm_medium=social&utm_campaign=li-post&utm_content=li-01
```
Sources: D23; D05; Q3 view D25(q); D25(a), (e), (f); D13; Q17 view D25(q), "go-to" as a goal only.

**li-02: AI is a new employee, not a tool on the side** (link: homepage, `utm_content=li-02`)
```
Our founder Ivan's take: ChatGPT on its own isn't the answer for a tradie. It doesn't know your prices or connect to your software.

Connect AI to your job software and Xero, and it's a different story. One Auckland electrical business shows it:
𝗤𝘂𝗼𝘁𝗲𝘀: coming back almost fully built
𝗔𝗻 𝗔𝗜 𝗮𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝘁: its own email and phone line
𝗥𝗲𝘃𝗶𝗲𝘄𝘀: 150 added in three months

Treat AI like a new employee: train it on your systems once, and it doesn't forget.

Start with a free 30-minute call 👇
https://flowstate.net.nz/?utm_source=linkedin&utm_medium=social&utm_campaign=li-post&utm_content=li-02
```
Sources: Q20 view D25(q); D12 without "95%" or "we work with"; D25(p) 30-minute call, free as the live site sells it.

**li-03: The CHECK rule** (link: `/ai-quoting-for-electricians/`)
```
The rule we build every quoting AI around: if it can't price it, it says so.

Flowstate's AI drafts the quote in Xero or your job software, from your price list and the job notes. Anything it can't price gets marked CHECK instead of a made-up number. Every helper is tested on real past jobs before it goes live.

AI drafts. You approve. That's how it earns trust, one quote at a time.
```
Sources: D25(a), (b), (c), (d).

**li-04: Simpro, done properly** (link: `/simpro-automation/`)
```
Jordan, who looks after strategy at Flowstate, runs his electrical business fully automated through Simpro. His AI pulls supplier pricing into his catalogue and builds pre-builds.

Simpro's API covers quotes, invoices, payments, suppliers, purchase orders and stock. You need Simpro's Premium plan, and Simpro has to approve the connection. Then each status you set up can trigger the next step on its own.

The real gain comes when it's connected to everything else, so the AI sees the whole business.
```
Sources: D24, D25(i), Q11 (Jordan's role as on `/questions/`).

## Not covered here (held or needing Ivan)

- Ivan's and Johan's personal LinkedIn headlines (D09): not drafted; ask if wanted.
- Cheat sheet and 30 days of support (Q16), "business AI plans don't train on your data" (Q15), and "a person checks every draft" (Q14): add once Ivan clears them. Training sessions are out (D41).
