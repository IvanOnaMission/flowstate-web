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


## Contact-first Facebook audit funnel (29 October 2026)

Status: **ADMIN_END_TO_END_VERIFIED_PUBLIC_BLOCKED_BUSINESS_VERIFICATION_AND_APP_REVIEW**.
The actual admin-account flow works. Public prospects have not been verified and
Messenger access remains blocked by the unverified business and App Review.
The review is a draft, not a submitted or approved request.

Native form `1091630220564926` collects required full name, email and phone only
(More volume, no greeting). Contacts are submitted before any optional questions.
Its ending opens `https://m.me/1095779013619484?ref=fs_audit_v1`. Messenger asks for
the same email to match the saved enquiry, then offers ten optional questions,
one at a time. Each question has quick replies, a skip choice and the free audit
booking button. The booking destination is Calendly with Messenger campaign UTMs;
booking is separate from enquiry submission. No website questionnaire is used.

Every reply is saved durably to Netlify Blobs before updating the same Twenty
note, linked to the person and opportunity. Skips say **Not answered**. A partial
conversation preserves contacts and supplied answers. Native abandoned or
unsubmitted fields are unavailable. Unrelated Page conversations are ignored.

`audit-lead-sync` imports the configured native form every minute and retries
outbox stages. Production uses `META_AUDIT_FORM_ID=1091630220564926` and
`META_AUDIT_CONTACT_FIRST=true`. Required private variables are `META_LEADS_TOKEN`,
`META_PAGE_ID`, `META_MESSENGER_TOKEN`, `META_APP_SECRET` and
`META_MESSENGER_VERIFY_TOKEN`. Never copy masked Netlify values back into secrets.
Setup-only temporary secret files were removed; runtime values remain private.

The Page webhook at
`https://flowstate.net.nz/.netlify/functions/meta-audit-messenger` verifies
HMAC-SHA256 and Page ID, queues events durably, and uses leases and retries.
It is subscribed to `messages`, `messaging_postbacks` and `messaging_referrals`
(v26.0). There is **no leadgen webhook subscription**; the minute importer handles
native leads. Page Get Started payload is `FS_AUDIT_START`.

Telegram sends **New lead form**, contact details and supplied answers after
120 seconds without another answer. The minute worker usually makes delivery
2–3 minutes after activity; initial maximum wait is 10 minutes. Contact-only
leads still produce a summary. Later answers edit the original message;
unchanged-text edits are suppressed. No summary implies a confirmed booking.

### Paused ads and budget

Campaign `120250452722590753` remains active. Website ad set
`120250452722710753` remains **ACTIVE at NZ$60/day**. Form ad set
`120250507913820753` remains **PAUSED at NZ$30/day**. All three form ads remain
**PAUSED** and now use contact-only form `1091630220564926`:

| Ad | Ad ID | New creative ID | Original video ID |
| --- | --- | --- | --- |
| Power tools | 120250507913830753 | 2558406464669334 | 3218930068497999 |
| Replies on site | 120250507984940753 | 1126186896465440 | 1643887403786056 |
| Unbillable time | 120250507984950753 | 2340525160043210 | 1454905336568454 |

Readback verified exact original copy, footage, thumbnail hashes and CTA type,
with only the form destination changed. All returned enhancement features are
`OPT_OUT`. Meta v26 rejects the old `standard_enhancements` write field, so clones
use individual feature settings. Creative changes can temporarily show
`IN_PROCESS`; configured ad status and parent ad set remain paused.

The old long form `1116182244474862` and unused ordering experiment
`2230455587511903` remain active but are not used by these ads or the importer.
The ordering experiment proved that contact-first API array order did not change
the native custom-question-first preview. Do not revert to it as a workaround.

The NZ$30 website / NZ$30 form split is an **unapproved, unapplied proposal**.
Do not activate these ads or change either budget without a later launch
instruction after the access blockers and a public non-role test are cleared.

### Verified admin-account evidence

The real contact-first test used synthetic native lead `2255373378659141`.
All ten Messenger steps completed with nine supplied answers and question 8
skipped. Exactly one Twenty note `f0c6c0e5-8eef-5cb9-91ac-2fa60eda6446` contains
the nine answers, correct full option text and **Not answered** for the skip.
It is linked to person `c314ffa2-ebe0-5ec2-afe6-78187f81b816` and opportunity
`2546e0e5-e099-536c-a80d-26ff00c5ff28`. The opportunity is restored to **TEST**;
follow-up task `982d674c-7f0a-5067-aa39-9628baeea892` is **DONE**. Tracking and Kit
were suppressed for this synthetic record; no fake conversion or email was sent.

Production Telegram updated the **same message 117** at 3, 7 and finally 9 answers.
Final durable state: `index=10`, `revision=21`, `notifiedRevision=21`,
`crmDirty=false`, summary count 9. Booking opened the correct live **Free
30-minute audit** page with Auckland timezone and campaign UTMs; no booking was
created. Fresh readback confirms the final CRM and digest state. Automated suite:
60 tests. This admin test does not establish public permission access.

Runtime implementation is in merged PRs #17, #18 and #19. Verified runtime deploy:
`6ae257f4e6798584f3d57154`, commit `684bedbb22743b2a3cad750c89fd07d6f3ce0d31`.
Evidence images are in `/Users/ivanbarnett/flowstate-output/marketing/`:
`contact-first-native-form-2026-10-29.jpg`,
`meta-messenger-live-complete-2026-10-29.png`, and
`meta-messenger-business-verification-required-2026-10-29.jpg`.

The separate lead token expires **28 December 2026, 08:12 NZDT**
(`2026-12-27T19:12:11Z`). Rotate privately before expiry. A Page token lacking
`pages_read_engagement` or `pages_manage_metadata` can deny subscription reads
without being invalid; do not replace runtime secrets based on that read error.

See [META-MESSENGER-REVIEW.md](META-MESSENGER-REVIEW.md) for the exact review
blockers, prepared wording, data flow and owner verification steps.
