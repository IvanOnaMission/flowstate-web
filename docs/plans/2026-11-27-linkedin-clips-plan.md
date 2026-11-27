---
title: Jordan clips on LinkedIn, end-to-end plan
purpose: Pick, fix, clear and post Jordan's Mastercraft talk clips and September interview clips on the Flow State LinkedIn page
read_when: preparing, clearing or scheduling a Jordan video post
updated: 2026-11-27
audience: [Johan, Ivan]
status: proposed
stability: changing
owner: Johan
supersedes: none
---

Source: Ivan's email to Johan (2026-11-27) and the shared Drive folder "Mastercraft talk clips 2026-11" (both sets sit in one folder: 20 talk clips dated Nov 26, 22 interview clips dated Sep 20, plus `CLIPS.md`, `mastercraft-clips.html`, `checksums.sha256` and `mastercraft-rebuild-kit.tgz`).

## 1. What "professional" means here

- No audible swearing, no jokes about staff, no named people who didn't agree to it.
- Every number or result in a post traces to a decision in `docs/decisions.md` (AGENTS.md rule). No "$" or "%" in our post text (copy rule, D06), and no burned-in card that breaks it.
- One look: same headline card, captions and a Flow State end card on every clip. The old "2-Day AI Makeover" card is gone from all of them.
- Honest framing: Jordan is "Partner, Business Strategy at Flow State" (D46). His business is his own, never "a client" (D42). His praise of Ivan is shown with that relationship stated.
- Fewer, better posts: a steady weekly series, not a dump of 20 videos.

## 2. Triage of the 20 Mastercraft talk clips

From `CLIPS.md` (timestamps, transcripts, "needs care" notes). Talk clips are phone footage, punched in, so they look softer than the studio interviews.

### Use (batch 1)

| # | Clip | Why it works | Before posting | Link |
|---|---|---|---|---|
| 17 | Keep human checkpoints | Matches our own rule: AI drafts, people check (D25a) | Nothing sensitive ("admin lady" unnamed) | `/quote-and-lead-follow-up/` |
| 11 | Quotes built from the inbox | Best proof clip; matches Q20 and `/ai-quoting-for-electricians/` | Cleared | `/ai-quoting-for-electricians/` |
| 07 | 100 pre-builds from two prompts | Video version of li-04 (Simpro pre-builds) | Cleared | `/simpro-automation/` |
| 06 | Solar proposals in 20 minutes | Concrete before and after | Cleared | `/simpro-automation/` |
| 04 | One brain connected to everything | Plain explainer of how the system works | None | `/questions/` |
| 18 | Systems before automation | Our "fix the system first" message, and Jordan names Ivan as doing it properly | Cleared; post text frames it as "pick someone who fixes the systems first" | `/services/` |
| 20 | Getting started with AI | Useful, low-risk tip (connect Xero, Fergus) | None (price aside already cut) | `/fergus-automation/` |
| 19 | Go to Ivan | Strong close to the series | Cleared; post states his role at Flow State (D46) | `/contact/` |

### Use after a fix (batch 2)

| # | Clip | Fix |
|---|---|---|
| 16 | Admin staff don't need to learn AI | Cut the opening "older admin people" sentence; re-cut to start at "We build everything into status dropdowns" |
| 05 | The regulations agent | Dip "pissed off" (claim cleared) |
| 03 | From advisor to worker | Mute the one audible swear ("f*** it up") with a short audio dip, not a bleep |
| 15 | 20k off overheads in a weekend | New headline card without "$" (for example "Overheads cut in one weekend"); mute one swear (claims cleared) |
| 02 | AI is the new power drill | Best metaphor in the talk but five audible swears. Only if the dips sound natural; otherwise skip |

### Skip

| # | Clip | Reason |
|---|---|---|
| 01 | Five staff, zero systems | Two audible swears plus panic attacks and the doctor. Cleared, but skipped on tone; a fit for Jordan's own profile if he wants it |
| 08 | Replacing the SEO agency | "$2,000 a month" on the burned-in card; a named-friend supplier dropped |
| 09 | 25,000 AI mentions a month | Unverified numbers, a "top five" joke that reads as a claim, and it clashes with our own measured baseline (0 of 360) |
| 10 | 150 more Google reviews | "No. 1 in Auckland" on the card (copy rule bans "#1"); the 150 reviews are better told from the interview clips (D12) |
| 12 | AI on the phones | "50% / 25%" on the card; also an AI-receptionist message, which we don't lead with (D16) |
| 13 | Relationships still matter | Joke about a staff member's hair, and a client revenue figure |
| 14 | Every call on record | Call-recording privacy questions; the Q&A right after says callers aren't told |

## 3. The 22 September interview clips

No notes exist for these, so they get the same treatment `CLIPS.md` gave the talk clips: transcript, "needs care" note, decision.

Final picks after transcribing all 21 downloaded clips (full notes in `notes/interview-notes.md`, local):

| Verdict | Clips |
|---|---|
| Use | 01, 03, 04, 06 (ranking claim cut), 08 (new card over "95%"), 09, 12, 14, 17 ("Flowstate" name card patched), 18, 19 |
| Held (built, not scheduled) | 07 (phone line, D16), 10 (same point as 17), 11 (too technical) |
| Skip | 02 (promotes a third party's paid course), 05 (money figure, same story as talk 08), 13 (repeats 10), 16 (8 seconds, garbled count), 20 and 21 (off topic), 22 (plugs Jordan's own website) |

Provisional read from the titles, before watching (kept for the record):

| Likely use | Clips |
|---|---|
| Strong | 01 Meet Jordan (series opener), 02 What got Jordan into AI, 03 AI can do more than write emails, 06 Asking customers for reviews, 08 Quote built after the site visit, 16 Google review count, 18 Systems before scaling, 19 Taking a week off |
| Maybe | 04 Small workflow efficiencies, 05 Website workflow, 09 Advice on getting started, 10 Reinvesting saved time, 11 Simple scripts and automations, 12 Process for customer calls, 13 Working on the business, 14 Faster answers for customers, 17 Finding time to start |
| Probably skip | 07 AI assistant for calls and emails (receptionist angle, D16), 20 AI editing website video and 21 AI music for videos (off topic for tradies), 22 Bonus website plug (likely plugs the old offer) |

For every interview clip used:
1. Trim the "2-Day AI Makeover" end card (find its first frame with scene detection, cut a few frames before it, re-encode so the cut is frame-accurate).
2. Add the new Flow State end card (section 4).
3. Check the review numbers against D12 ("150 reviews in three months") and that nothing says "client" about Jordan's business (D42) or mentions the makeover, a paid diagnostic (D38), training sessions (D41) or prices.

## 4. Production polish (all clips used)

- **End card, new:** 2 to 3 seconds, Flow State logo (`public/assets/live/flowstate-logo-light.svg`), "AI automation for NZ trade businesses", flowstate.net.nz. Same card on talk and interview clips, so the series looks like one set. "Flow State", two words (D43). No dashes (D34).
- **Swearing:** a short volume dip on the word (word times from a fresh transcript), not a bleep. Captions already show f***; where the dip makes the word unheard, change the caption to "[...]" or drop it.
- **Loudness:** keep -14 LUFS so talk and interview clips play at the same level back to back.
- **Thumbnail:** the headline-card frame, uploaded as the custom thumbnail on each post.
- **Length:** most clips are 22 to 78 seconds, which suits LinkedIn. Native upload only (no YouTube links), vertical 1080x1920 as delivered.
- **Re-check:** after any re-cut, re-transcribe and compare with the intended edit, the same QA as `CLIPS.md`.
- **Tools:** this PC has no ffmpeg or Whisper yet. Install ffmpeg (winget) and faster-whisper (pip) with Johan's OK. The rebuild kit (`.tgz`) stays unopened unless Ivan says it's safe and needed; the fixes above don't need it.
- **Storage:** finished files go back to Drive in a new "LinkedIn ready" subfolder. No video goes in this repo (public, and too large).

## 5. Clearances

Johan reported on 2026-11-27 that all flagged items in `CLIPS.md` (claims, staff, call recording, EWRB, the Ivan endorsement, Mastercraft use) are resolved. That is proposed, not settled: public claims are Ivan's call, so the row below becomes settled only when its source quotes Ivan's email or reply, with its date. Ivan's text must also cover the September interview clips (their notes were written after his email), or they get their own row. No post goes live before that. The skips in section 2 are tone and copy-rule choices, not open questions.

Proposed row (for `decisions.md`, after a judge review):

| id | date | decision | why | decided by | status | source | replaces |
|---|---|---|---|---|---|---|---|
| D48 | 2026-11-27 | Jordan's Mastercraft talk clips and September interview clips may be posted on the Flow State LinkedIn page as edited (cuts, dips and cards as in `docs/content/linkedin-clips.md`). Cleared in the clip audio and pictures: the `CLIPS.md` flags (Jordan's reported results in his own business, staff references, call recording, the EWRB standards, the Ivan endorsement, use of the Mastercraft footage) and, in the interview clips, his own estimates of time saved and output, the review count (D12) and the "95% of jobs quoted" line (audio only). Post text repeats none of his figures or results unless another D-row backs them | Every `CLIPS.md` "needs care" flag needed an answer before posting | pending Ivan (public claims) | proposed | Johan, session 2026-11-27: "all issues are resolved"; to settle, quote Ivan's email or reply with its date | none |

Judge review 2026-11-27: upheld with conditions (new id, Ivan's text as source, interview clips covered, no figures in post text, D46 role wording). All but the Ivan source are applied.

## 6. Posting plan

- **Where:** Flow State company page, native video. Ivan and Johan reshare from their own profiles (D09); ask Jordan to reshare or comment from his.
- **Cadence:** one video a week on Tuesday, alongside the weekly text post (li-03, li-04 and on). Pause for the trade shutdown, 21 Dec to 11 Jan.
- **Post text:** 2 to 4 short lines in house style: a hook that isn't the card repeated, one line of context, one line linking it to what Flow State does, then the link. No "$" or "%", no "best", "leading" or "#1", no dashes, NZ spelling. Every line backed by a D-row.
- **Links:** to the matching page, UTM tagged as in `profile-copy-google-linkedin.md`, with `utm_content=li-vNN` (v for video).
- **Order (batch 1, adjust once the interview clips are watched):**

| Week of | Clip | Link |
|---|---|---|
| 8 Dec | Interview 01 Meet Jordan | `/about/` |
| 15 Dec | Talk 17 Keep human checkpoints | `/quote-and-lead-follow-up/` |
| 12 Jan | Talk 11 Quotes built from the inbox | `/ai-quoting-for-electricians/` |
| 19 Jan | Interview 08 Quotes built on the drive back | `/ai-quoting-for-electricians/` |
| 26 Jan | Talk 07 100 pre-builds from two prompts | `/simpro-automation/` |
| 2 Feb | Talk 04 One brain connected to everything | `/questions/` |
| 9 Feb | Interview 19 Taking a week off | `/services/` |
| 16 Feb | Talk 06 Solar proposals in 20 minutes | `/simpro-automation/` |
| 23 Feb | Talk 18 Systems before automation | `/services/` |
| 2 Mar | Talk 20 Getting started with AI | `/fergus-automation/` |
| 9 Mar | Talk 19 Go to Ivan | `/contact/` |

Batch 2, weekly from 16 Mar: interviews 06, 17, 14, 18, 03, 09, 12 and 04 (li-v12 to li-v19, dates in the tracker), then the fixed talk clips once they pass QA. Interview 16 was dropped (8 seconds, a garbled review count); 08 takes its slot.

## 7. Tracking

- A tracker table in `docs/content/` (one row per clip: status, fixes done, D-row, post date, URL, utm_content).
- Monthly, with the sweep: LinkedIn views, average watch time and clicks per video; site visits by `utm_content`; contact-form "How did you hear about us?" answers (D35). Drop the clip style that underperforms after four posts.

## 8. Steps and owners

| Step | Owner | When |
|---|---|---|
| 1. Install ffmpeg and faster-whisper; download the clips used | Johan, with Claude | 30 Nov |
| 2. Transcribe and write notes for the 22 interview clips; final picks | Claude, Johan decides | 30 Nov to 1 Dec |
| 3. Make the end card; trim the makeover card; re-cut 16; dips on 03, 05; re-card 15 | Claude | 1 to 3 Dec |
| 4. QA every output (re-transcript, frames, loudness); Johan watches each one end to end | Claude, Johan | 3 to 4 Dec |
| 5. Upload to Drive "LinkedIn ready"; draft all post texts with sources | Claude, Johan | 4 Dec |
| 6. Log the clearance as a D-row (proposed, judge review); start the tracker | Claude, Johan | 30 Nov |
| 7. Schedule the first two posts on LinkedIn | Johan | by 7 Dec |
| 8. Monthly review of results | Johan | with each sweep |

Progress, 27 Nov: steps 1 to 5 done. 27 clips built and passing QA (format, loudness -14 LUFS, A/V sync, frame checks); the interviewer name card "Ivan / Flowstate" is covered with "Flow State" wherever it shows (D43). All 27 are in the Drive folder "LinkedIn ready", inside "Jordan interview clips for LinkedIn (Johan to sort)". Open: Johan listens to talk 02's dips; D48 waits on Ivan's own text (step 6); scheduling (step 7).
