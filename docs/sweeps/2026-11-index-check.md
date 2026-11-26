---
title: Index check, November 2026
purpose: Google and Bing index state of every sitemap URL (playbook-gaps step 1, issue 74)
read_when: planning pages, the 7 Dec recheck, or the monthly sweep
updated: 2026-11-26
audience: [Ivan, Johan, agents]
status: active
stability: changing
owner: Johan
supersedes: none
---

Indexed 19 of 19 on Google and 12 of 19 on Bing (2026-11-26). The 7 not on Bing were all discovered on 25 Nov (the IndexNow run) and not crawled yet.

## Method

- URL list: the 19 paths in `src/app/sitemap.ts` (13 fixed plus the six `answerPages` in `src/lib/answers.ts`), which match the live sitemap.
- Excluded by design, not inspected: `/private/p/*` and `/audit*` (not in the sitemap).
- Google: Search Console URL Inspection on the domain property, read in Johan's Chrome on 2026-11-26. Claude read results only and pressed no "Request indexing". Search Console no longer reports mobile usability, so that column from the plan is dropped.
- Bing: Bing Webmaster Tools URL Inspection, same day, read only.

## Results

"Canonical" means the Google-selected canonical is the inspected URL (it matches the user-declared canonical). All 19 pages: crawl allowed, fetch successful, indexing allowed.

| URL | Google | Google last crawl (2026) | Canonical | Bing | Bing SEO/GEO issues |
|---|---|---|---|---|---|
| `/` | Indexed | 21 Nov | match | Indexed | Meta description length |
| `/services/` | Indexed | 28 Oct | match | Indexed | none |
| `/about/` | Indexed | 18 Nov | match | Indexed | Meta description length |
| `/contact/` | Indexed | 20 Nov | match | Indexed | none |
| `/ai-for-electricians/` | Indexed | 3 Nov | match | Indexed | none |
| `/workflow-diagnostic/` | Indexed | 24 Nov | match | Indexed | Title too long; meta description length |
| `/ai-quoting-for-electricians/` | Indexed | 10 Sep | match | Indexed | none |
| `/guides/` | Indexed | 24 Oct | match | Indexed | none |
| `/guides/ai-quoting-for-electricians/` | Indexed | 10 Sep | match | Indexed | none |
| `/guides/where-to-start-with-ai/` | Indexed | 25 Nov | match | Indexed | none |
| `/guides/job-software-or-custom-ai/` | Indexed | 11 Sep | match | Indexed | none |
| `/guides/ai-industrial-electrical-business/` | Indexed | 25 Nov | match | Indexed | none |
| `/questions/` | Indexed | 25 Nov | match | Discovered, not crawled (25 Nov) | n/a |
| `/ai-automation-cost/` | Indexed | 25 Nov | match | Discovered, not crawled (25 Nov) | n/a |
| `/simpro-automation/` | Indexed | 26 Nov | match | Discovered, not crawled (25 Nov) | n/a |
| `/fergus-automation/` | Indexed | 26 Nov | match | Discovered, not crawled (25 Nov) | n/a |
| `/ai-receptionist-for-tradies/` | Indexed | 25 Nov | match | Discovered, not crawled (25 Nov) | n/a |
| `/quote-and-lead-follow-up/` | Indexed | 25 Nov | match | Discovered, not crawled (25 Nov) | n/a |
| `/guides/ai-for-builders-nz/` | Indexed | 25 Nov | match | Discovered, not crawled (25 Nov) | n/a |

## Notes

- `/fergus-automation/` was "Discovered - currently not indexed" earlier on 26 Nov; after Johan's indexing request Google crawled it at 9:16 AM the same day and it is now indexed.
- Five pages show "Temporary processing error" as their sitemap read status in URL Inspection (`/ai-for-electricians/`, three guides, `/questions/`). They are all indexed, so this is not blocking; recheck on 7 Dec.
- `/guides/ai-quoting-for-electricians/` has no referring page detected by Google. It is reached through the sitemap only; consider an internal link when step 3 plans pages.
- Google's Pages report (last updated 16 Nov) shows 15 indexed and 6 not indexed. The 6 are all intended: 3 redirects (`http://`, `www.`, a Scamadviser UTM URL), 2 noindex (`/contact/thanks/`, `/quoting-privacy/`), 1 canonical alternate (the HTTPS Scamadviser UTM URL).
- Bing flags meta description length on 3 pages and title length on 1. These are small fixes for a later site PR, not indexing blockers.

## Actions

- Google: nothing to request; all 19 indexed.
- Bing: Johan presses "Request indexing" once for each of the 7 "Discovered, not crawled" URLs (Claude presses nothing). They were already sent through IndexNow on 25 Nov.
- Recheck both engines on Mon 7 Dec with the `site:` check in `status.md`, then monthly the week before each sweep (next: week of 14 Dec).
