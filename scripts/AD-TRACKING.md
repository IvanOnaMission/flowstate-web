<!-- CURRENT-BUSINESS-DISCOVERY -->
## Current direction — 29 October 2026

Ivan has authorised pausing the broad Quote Machine campaign and bringing back
his original Jordan interview review, with a native Facebook form about the
whole business. The total authorised budget remains NZ$60/day, prepared as
NZ$30/day native form and NZ$30/day original Jordan → original VSL route.
Both routes are now enabled. The original ad still uses its original creative;
its existing /ai-makeover/ link redirects to /transformation-partner/ and plays
the same 274.8-second /assets/makeover/ai-makeover-vsl.mp4 asset. The native
clone keeps the original review video and thumbnail, with a business-discovery
headline, form-specific copy and the new native form1110508731707277.
Final Meta readback at 2026-10-29T04:47:11Z confirms both ads and both adsets
are configured AND effective ACTIVE, with no returned issues. Total configured
daily budget is NZ$60.
The old quoting campaign, adset and individual ads are PAUSED.

Production test1014794661638913 delivered all eight general answers to one
Twenty note and Telegram123 (8/8). Synthetic reporting/email effects were
suppressed; CRM fixture is TEST and its follow-up task DONE. The native preview
completed all dropdowns, contacts, Submit and the correct Calendly destination.
The Calendly description now covers the biggest time sink, training, process
improvement or automation. No booking was made. Tests74/74 and build pass.
The two new time-sink creative variants are copy drafts, not launched ads.

Current operations and exact IDs: `scripts/meta-business-discovery.json`.
The eight business fields have separate `business_` keys; legacy quoting forms
and the independently working website autosave form keep their original schema.
Both native forms remain polled so late old-form submissions are not dropped.
Business leads use business-AI attribution and the existing Makeover lead tag,
without enrolling them in the Quote Machine tag. They receive one CRM note and
an answer-inclusive Telegram notification. Native Meta submissions arrive only
after Submit; abandoned native answers cannot be recovered.

The website autosave evidence below is historical and remains valid for that
website endpoint, but it is no longer the current ad destination.

---

# FlowState Meta ads tracking

Dashboard: https://flowstate.net.nz/ads/ — existing FlowState Auth account
`irbarnett@icloud.com`. Access is limited by `mkt_members`; a Supabase dashboard
login is separate from this application account.

## Data flow

- Supabase project **FlowState**, `ypsejvbfbfnpszxtwwoa`, holds the `mkt_*` tables.
  Existing portal tables remain in place. The Freeflow project is untouched.
- `meta-sync` imports all ads, including new ads without spend, every two hours.
  Each run refreshes 35 days of daily results to incorporate revised attribution.
- Netlify form events and verified Calendly events write leads/bookings immediately.
  A 15-minute scheduled import reconciles forms, Calendly and Notion.
- Forms save an enquiry before the visitor chooses a meeting. Customer type is
  self-reported. A person can appear as an enquiry with no active booking.
- Notion remains the place to update Customer type, Qualification, Call outcome,
  Sale outcome and Sale value. Client — Active / Maintenance implies Won when
  Sale outcome is unset; Lost implies Lost. A past call does not imply attendance.
  Sale value must be entered; proposal amounts do not count as sales.
- An ad's topic, objection, hook and lessons can be edited in its dashboard details.

## Attribution and metrics

New Meta ads should include URL parameters:

```
utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.id}}
```

The page captures these fields in the form and passes them to Calendly. An exact
ad ID is preferred; historical names are matched only when unique. Unknown
sources stay unknown. Attribution follows the earliest captured source, and
later imports do not replace it. Browser campaign storage lasts only the session.

Ad results use delivery dates in the ad account timezone (Pacific/Auckland).
Lead counts use first-captured cohorts, with later bookings and sales attached.
The table shows Meta leads and Meta cost per lead alongside matched form contacts.
Meta cost per lead = spend / Meta-reported website Lead events. These event totals
can differ from unique matched form contacts and are not added together.
Use **Sync Meta now** to run an authenticated import immediately; **Reload data**
only reloads the saved report. Scheduled imports continue every two hours.

CTR = link clicks / impressions. Video milestones are aggregate counts at
25/50/75/95/100%, not second-by-second individual drop-off. Average watch time is
combined across daily records using video plays. Link-click / video-play ratios
cannot establish that the same people watched and clicked. Missing video data
stays null. Meta-reported conversions are separate from captured leads/bookings.
Occupation cannot be inferred for anonymous clickers.

## Operations

- Review the dashboard's import status and `mkt_sync_runs` for failures.
- Meta token expiry or revoked provider access requires updating the encrypted
  `flowstate_marketing_config` in Vault via service-only `mkt_set_config`.
  Configuration includes `meta_token`, `meta_account_id`, `meta_api_version`,
  `notion_token`, `notion_database_id`, `calendly_token`, `calendly_user`,
  `netlify_token`, `netlify_site_id` and `cron_auth`.
- Netlify uses server environment variables `MKT_SUPABASE_URL`,
  `MKT_SUPABASE_SERVICE_KEY` and `MKT_SUPABASE_ANON_KEY`.
  Never put service credentials in browser code or git.
- For a manual server-side backfill, use `scripts/refresh-ad-tracking.mjs`
  with its documented environment configuration and `--backfill`. Use
  `--source=meta` (or forms/calendly/notion) to import a single source.
- Apply both SQL migrations only to FlowState. Deploy the edge function with
  JWT verification enabled. Its body additionally requires the server role.
- Deploy the website through its connected Git build or the Netlify CLI with
  `netlify/functions` included. A static-only upload drops CRM and alert functions.

Historical form records lack source parameters and role answers, so they cannot
be retroactively classified or reliably attributed. The new form begins that
collection at deployment. Records imported from the CRM/calendar can include
other enquiries; unknown-source records are not assigned to an ad.

## Quote Machine booking funnel (28 October 2026)

An audit booking button first reveals the two-step contact form. Its Meta `Lead` event means
the details were saved successfully, not that a call was booked. Meta `Schedule`
still fires only on a confirmed booking from the embedded Calendly frame.
The confirmed booking also reaches the existing server webhook and dashboard.

New anonymous custom events in Meta Events Manager:

- `QuoteMachineLandingView`: the landing page loaded.
- `QuoteMachineAuditStarted`: a visitor opened the audit details form (once per visit).
- `QuoteMachineCalendarOpened`: step two opened after the contact form.
- `QuoteMachineCalendarLoaded`: the embedded Calendly event type loaded.
- `QuoteMachineTimeSelected`: Calendly reported that a date and time were selected.

Events contain only the offer name; contact details and Calendly payloads are not
forwarded to the pixel. Video engagement events already exist and remain in place.
Attendance and qualification stay explicit CRM outcomes, not inferred from a
meeting date. The intermediate custom events are available in Events Manager;
they are not new columns in the private ads dashboard.

Future Quote Machine enquiries keep the existing Makeover lead tag and also get
Kit tag `quote-machine:lead` (25101853), configured as production Netlify variable
`KIT_TAG_QUOTE_MACHINE_LEAD`. Kit's active tag-added rule subscribes them to
sequence 2947321, a single booking-link email after one hour. The email exclusion
filter suppresses subscribers with any of `makeover:call-booked`, `Calendly booked`,
or `quoting:call-booked`. The existing verified booking webhook applies
`makeover:call-booked` (23507362). No historical contacts were enrolled.

The public Calendly URL remains `/ivan-flowstate/30min`; its display name is now
`Free 30-minute audit`. The page, thank-you page and Kit reminder use the same audit wording.
Availability, reminders and the existing
post-booking welcome video are preserved. A calendar-first variant remains a
later experiment, after enough confirmed booking data is collected.


## Details-first audit enquiry (29 October 2026)

Current implementation: `https://flowstate.net.nz/audit-enquiry/`.
The first screen contains only required name, email and phone. **Save my details
& continue** durably saves those details on the server and attempts the CRM save
before returning the first optional question. The ten questions then appear one
at a time. Choosing an answer or Skip persists that answer before returning the
next question. An unconfirmed or failed save never advances the browser. People
can stop, finish early or book at any point; their previously saved contacts and
answers remain. Reloading or reopening in the same browser resumes the saved
question for up to seven days.

This is a website form, opened directly from the prepared website ads. Meta's
native forms cannot provide guaranteed contact-first and per-answer persistence
before Submit. The earlier native questionnaire and custom Messenger detour are
not the current journey. No Messenger review, tester account, recording or new
business verification is introduced by this website route. Normal ad review
still applies when ads are activated.

### Save and delivery contract

- Endpoint `/.netlify/functions/audit-web` accepts contact creation and separate
  answer/skip/finish requests. It returns a question only for an existing saved
  contact session. Required fields are validated server-side.
- Contact and answer data are durably stored in private Netlify Blobs before
  attempting provider delivery. A random HttpOnly, Secure, SameSite cookie
  authorizes resumption. Contact details, answers and the session capability are
  not put in tracking links. Browser session storage contains no form fields.
- Each answer updates the same **Audit enquiry — [name]** Twenty note, linked to
  the person and opportunity. The note includes the submitted name, email and
  phone even when an existing canonical contact is reused. Existing booked calls
  and follow-up actions remain intact. The private CRM reference keeps subsequent
  answers on the same record, including synthetic records classified TEST.
- Shared leases serialize API and scheduled-worker writes. Duplicate contact or
  answer retries are idempotent; a stale answer cannot overwrite a later one.
- CRM failure leaves `crmDirty=true`; the minute worker retries from the durable
  saved state. Campaign reporting and Kit reminders retry independently and do
  not block saving answers. The existing booking reminder behavior is retained.
- Telegram sends **New lead form**, all three contact details and the supplied
  answers after 120 seconds quiet (normally 2–3 minutes with the minute worker).
  Contact-only and abandoned partial enquiries still notify. Later answers edit
  the original summary rather than create another notification.
- Saving contact details triggers the browser Lead event once; optional answers
  do not create more leads or booked-call events. No form fields are sent to the
  pixel. Campaign attribution uses the existing server reporting adapter.
- Test records require both a `[TEST]` name prefix and `@example.invalid` email;
  reporting and Kit are suppressed for those synthetic records. Telegram test
  summaries are visibly marked. No public client flag can classify a normal
  enquiry as a test.

### Verified production evidence and paused ads

Status: **WEBSITE_CONTACT_FIRST_PER_ANSWER_AND_ABANDONMENT_VERIFIED_ADS_PAUSED**.
The production browser saved all three contact fields and the initial CRM note
with **zero answers before question one was answered**. The same note then
updated after each choice. Closing after three answers preserved them and
reopening resumed on question four. Continuing completed ten steps with nine
answers and question eight deliberately skipped. Exactly one note
`693a3667-8019-5308-9474-7174f34df601` remained linked to the same person/opportunity;
full choice wording and the skipped **Not answered** were checked. Production
Telegram message **119** first contained three answers and later updated to nine;
`revision=notifiedRevision=10`, `crmDirty=false`.

A separate browser test saved contacts and closed before answering anything.
One CRM note `f53d3e31-d4c5-5bb9-88bd-b971776711bc` retained all three fields and
zero answers. Production Telegram message **120** arrived with a contact-only
summary; `revision=notifiedRevision=0`, `crmDirty=false`. Both synthetic
opportunities are TEST and their follow-up tasks DONE. Reporting, Kit and browser
Lead conversions were suppressed for the tests. No booking was created.

The real booking button opened **Free 30-minute audit**, 30 minutes, Auckland
timezone, with campaign UTMs. The browser layout was checked at 390px with no
horizontal overflow. **70 tests** cover failures, retries, partial/contact-only
abandonment, same-message updates, sessions, skips and clearing the browser
session without deleting the saved enquiry. The production build and focused
lint checks pass (zero errors; one existing anonymous-export warning).

Core live verification ran on deploy `6ae2960db86df73b37990484`, commit
`dff787c046c914d3a0fe4baa66dcb90f17c7dff4`. PR #22 contains the final implementation,
operating records and browser-session restart cleanup. Detailed IDs and evidence
filenames are in `meta-native-audit-test.json`. Screenshots are under
`/Users/ivanbarnett/flowstate-output/marketing/`.

Prepared website set: **FS | Audit | Details first + saved answers | Website |
NZ$30 | Paused**, ID `120250510344470753`, destination WEBSITE, Lead pixel
optimization. **All three ads and their parent are PAUSED**, including effective
status. They open directly on `/audit-enquiry/`:

| Creative | Ad ID | Creative ID | Original video |
| --- | --- | --- | --- |
| Power tools | 120250510350140753 | 1016187818179065 | 3218930068497999 |
| Replies on site | 120250510350280753 | 1404950211721853 | 1643887403786056 |
| Unbillable time | 120250510350440753 | 1825709858469755 | 1454905336568454 |

Readback confirms original approved copy, videos and thumbnail hashes, every
returned enhancement OPT_OUT, direct website CTA and ad-ID tracking macros.
The running website set `120250452722710753` stays ACTIVE at **NZ$60/day**.
The old native set `120250507913820753` is named **FS | RETIRED native
questionnaire | Keep paused** and remains PAUSED. The new website set has a
NZ$30/day budget while PAUSED. No ads were launched or live budget changed;
the proposed NZ$30/NZ$30 split is unapproved and unapplied.

### Historical routes

Native questionnaire `1116182244474862` only delivers after Submit, so it does not
meet this requirement. Contact-only native form `1091630220564926` led into the
retired custom Messenger route. Both remain stored for history; neither is the
current ad destination. The unsubmitted Messenger review draft and its
[META-MESSENGER-REVIEW.md](META-MESSENGER-REVIEW.md) checklist are historical only.
Do not send the owner through that verification process for this form.

The old native importer remains configured for retained submissions and retries;
it does not handle the new website form. Its lead token expires **28 December
2026, 08:12 NZDT**. The website route uses the existing private CRM, Kit, reporting
and Telegram runtime configuration without new credentials. Deploy through the
connected Git build, preserving Netlify functions. Never copy masked secret
values back into runtime settings.
