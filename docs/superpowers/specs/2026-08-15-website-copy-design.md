# Website copy rewrite — design

**Date:** 2026-08-15
**Branch:** `design/nextjs-rebuild`
**Scope:** All copy across the four app pages. No layout or component restructuring.

---

## 1. The problem this solves

Every previous version of this site hard-codes a specific offer into the page. The offer
keeps moving — Ivan's own words, 2026-08-15: *"my offer is constantly changing and I think it
will continue to while I figure out the best way to deliver."* So the page needs rewriting
every time he changes his mind.

Four faults with the current copy, all confirmed by Ivan:

1. Too vague on what he actually does — a reader can't picture the thing he hands over.
2. Doesn't sound like him — consultant-careful, not how he'd say it to a sparky in a van.
3. Sounds like every other AI agency — "automation", "hours back", "AI that knows your business".
4. Doesn't sell hard enough — explains, never pushes. No tension, no cost of doing nothing.

## 2. Goal and success criteria

**One job: book the 15-minute call.** Nothing else on the public site is a conversion.

Success = a trade owner who arrived from a reel understands within one screen what Ivan
builds, believes he's different from the AI crowd, and books.

**Non-goals:** selling the build, explaining pricing, listing inclusions, collecting emails.

## 3. Audience and traffic

Primary: **content-led.** They watched a reel or carousel, liked Ivan, clicked to check he's
real. They already half-trust him — the site does not need to build rapport from zero, it
needs to be specific and make them act.

Secondary: cold prospects mid-conversation Googling him; and people he sends the link to
after a call.

**ICP: electrical-first.** The 2026-07-02 decision to widen to construction-adjacent trades
is deferred — ship electrical, widen once there's a case study. (Ivan, 2026-08-15.)

## 4. The framing — the apprentice ladder

The organising idea, and the thing that fixes fault #3.

> Every trade owner started as an apprentice and worked up. Describing the AI as a hire who
> climbs that same ladder means Ivan is not explaining AI — he's describing a career path
> the reader has personally walked.

**The hook is the objection.** To a trade owner "apprentice" is not purely positive: an
apprentice is a year of cost and hassle, and then they leave. Hit that head-on, because the
answer is the differentiator — **you train this one once and it doesn't leave.**

### The three rungs (locked)

| # | Rung | The promise |
|---|------|-------------|
| 01 | **Apprentice** | You train it. |
| 02 | **Qualified** | It starts pulling its weight. |
| 03 | **Foreman** | It runs the day. |

**01 Apprentice — you train it.**
Everything about how you work goes in. Pricing, process, the way you talk to a customer.
It's not useful yet. Neither was your first apprentice. This is the part everyone skips, and
it's exactly why their AI gives them rubbish.

**02 Qualified — it starts pulling its weight.**
The day-to-day, done properly. Sorts what comes in, tells you what actually matters, handles
the stuff you've been doing at 9pm. You still check its work. It's earning its keep.

**03 Foreman — it takes a chunk of the day off you.**
Chases the quote that went quiet. Keeps jobs moving. Flags what needs you before it becomes
a problem. You stop being the bottleneck.

### Honesty constraint on the ladder

The ladder is a roadmap Ivan will be held to. Evidence from the Bryce build:
classification worked (3,623 emails sorted); **draft adoption was 0/63** — nobody used the
AI-written replies.

So: rung 01 is proven, rung 02 is harder than it sounds, rung 03 is not proven. Copy must
present 02 and 03 as **where this goes**, never as what's guaranteed in three weeks. No
"never", "zero time", or "no learning curve" claims — carried over from
`founding-operator-offer.md` §positioning.

### Why this survives the offer changing

The audit's job becomes obvious and permanent: **work out which rung you're on and what the
next one costs.** The offer underneath can move without the story changing.

## 5. Page structure

### Home
1. **Hero** — "You can't hire your way out of this. So train something that doesn't leave."
2. **The apprentice argument** — they started useless, you trained them, they left. This one doesn't.
3. **The ladder** — the three rungs.
4. **The part everyone skips** — why untrained AI gives rubbish answers. Ivan's real point of
   view; the one section of the current site worth keeping.
5. **Founder video** — 60–90s direct to camera. Not yet filmed; ships behind a text fallback.
6. **What happens in the 15 minutes** — concrete. Replaces the old offer/value-stack block.
7. **CTA.**

### /services/ — "Which rung are you on?"
The audit is the front door. What comes after is *"depends what we find."* Phases stay
(learn the business → written up → foundations then automation), reframed against the ladder.

### /about/
The "two people out of the trades, not out of a software company" angle stays and gets
stronger — Ivan was literally an apprentice, which is now the site's central metaphor.
Add the team photos already sitting unused in `public/assets/team/`.

### /contact/
15 minutes, not half an hour. Netlify form unchanged.

## 6. Voice rules

- Short sentences. Second person.
- Say what a tradie would say: "9pm quoting", not "administrative burden".
- Never explain the AI. Always describe the person it's becoming.
- Confident recommendations — "I'd do X", not "you might want to consider X".
- Banned: seamless, leverage, transform, empower, unlock, streamline, robust, cutting-edge,
  "in today's fast-paced", "it's not just X, it's Y".
- Run the `no-ai-slop-writing` skill over every page before commit.

## 7. Removed from the public site

| Removed | Reason |
|---|---|
| $2,500 / $5,000 strikethrough, FOUNDING50, "two places left" | No pricing on the public site (Ivan, 2026-08-15). Pricing lives on the private page sent after the call. |
| The three modelled ROI numbers on `/services/` | **Closes the open Fair Trading substantiation blocker by deletion.** No measured hours-saved numbers exist. |
| 478 five-star Google reviews (The Conduction Company) | Someone else's business being good, not Ivan being good. A reader who works that out trusts him less. |
| Jordan's "50 other spam emails" quote | Jordan is Ivan's own partner. Not third-party proof. |
| Every "30 minutes" / "Half an hour, no slides" | Call is 15 minutes. |

## 8. Technical constraints (do not break)

1. Reveal-on-scroll stays behind `html.js` — the inline head script in `layout.tsx` sets the
   class before first paint. Built this way after a first pass rendered blank until hydration.
2. Contact form keeps `name` / `data-netlify` / hidden `form-name` **in the exported markup**
   (`src/app/contact/page.tsx`). Netlify's form scan is build-time. Do not move it into JS.
3. `netlify.toml` publish stays `out/`.
4. `output: "export"` + `trailingSlash: true` — existing URLs must not 404.
5. `public/private/*` and `public/audit*` are copied through untouched.
6. Palette and type are **locked** and out of scope: Atlantic `#0F4B70`, Soft Sky `#C4F8FF`,
   ember `#C2410C` on light only, `ember-lift #FCA55A` on dark. Zodiak display, Inter body.

## 9. Implementation decisions

- **Call duration is a single constant** in `src/lib/site.ts`, set to `15`. Every page reads
  it. One-line flip back to 30 if Ivan changes his mind.
- **Calendly URL is unchanged** — the existing `calendly.com/ivan-flowstate/30min` link stays
  (Ivan, 2026-08-15). Ivan changes the duration on that event; the URL is untouched.
  ⚠️ Until he does, the site says 15 and Calendly says 30.
- **Founder video ships behind a text fallback** so go-live isn't blocked on filming. Build
  the slot; render the written version until the file exists.

## 10. Open items — not resolved by this work

- **Contradiction to file:** `founding-operator-offer.md` records the 21-Day AI Head Start
  and its value stack as *locked*, and `now.md` says the offer page is live. Ivan now says
  the offer is fluid and should not be priced on the site. Both recorded; Ivan to rule.
- **`brand.md` is stale** — still documents dark ink `#0B0E14` / hero blue `#0096FF` / Geist.
  The site runs the light Atlantic system. Needs updating.
- Founder video not filmed.
- No client logos, testimonials or case-study numbers. The rebuild changed the container, not
  the proof problem. Lachlan (starting end of August) is the first real chance at one.
- Private pricing page still shows the old $8k/$5k setup, contradicting everything public.
- `public/private/p/flowstate-pricing-33f2c76b/index.html` still on the old
  `calendly.com/barnettdigital/discovery_call` handle.
- Mobile responsive verification carried over from v1, still unverified.
- Not merged, not deployed. `main` still serves the old hand-written site.
- Broken logo references remain outside this repo: `flowstate-portal/public/login.html`,
  `flowstate-site/index.html`. A real web lockup still does not exist.

## 11. Testing

No unit tests — this is copy. Verification is:

1. `npm run build` succeeds and `out/` regenerates.
2. No route 404s: `/`, `/services/`, `/about/`, `/contact/`, `/contact/thanks/`, `/audit/`,
   `/private/p/…` both pages.
3. Contact form markup still contains `data-netlify` and hidden `form-name` in `out/`.
4. Grep the built output for every removed string — `2,500`, `5,000`, `FOUNDING50`,
   `two places`, `30 minutes`, `478` — all must return nothing.
5. Read every page at 375px and 1440px before merge.
