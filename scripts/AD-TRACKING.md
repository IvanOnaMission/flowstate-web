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


## Native Facebook audit form test (29 October 2026)

The ten optional questions are inside Meta's Instant Form. There is no separate
website questionnaire. All answers arrive only when the prospect presses Submit.
Meta's fixed standard form places custom questions before the contact block.
Flexible form delivery is enabled in Manual mode for just question/contact
reordering and moving/skipping optional questions. This lets Meta show contact
first but does not force that order for every visitor. There is no booking link
on every question.
The final screen links to the existing free 30-minute Calendly audit. Skipping
optional questions does not prevent a contact-only submission. No abandoned
contact details or unfinished answers can be imported.

The draft uses More volume, no greeting, no role question, and required name,
email and mobile. Meta may skip optional questions; the completion/booking screen is preserved.
Question export field names match `netlify/lib/meta-audit-questions.mjs`.
Software is a single choice for the main tool, as offered by this native builder.

`audit-lead-sync` checks the single configured form every minute. Required private
production variables: `META_AUDIT_FORM_ID` and `META_LEADS_TOKEN`. The token needs
Page lead access, including `leads_retrieval`; form management also requires
`pages_manage_ads`. The existing ads-management connection lacks both permissions.
Do not activate the test until a real permissioned connection and a Meta test lead
have verified the whole delivery path. Never put access tokens in git or URLs.

Each submitted lead has independently retried CRM, answers, tracking, Kit and
Telegram steps in private Netlify Blobs. Twenty reuses the contact/opportunity by
email, preserves a booked call and existing follow-up, and attaches one note per
Meta submission, titled **Facebook audit enquiry — [name]**, to both the person and
opportunity. The note contains all ten questions; skipped answers say Not answered.
This does not assert that the prospect owns a business. Existing Kit reminder and
confirmed Calendly booking processing remain separate from form submissions.

Proposed launch allocation: NZ$30/day existing website ad set + NZ$30/day native
forms, within the existing NZ$60/day total. Preparation leaves the website at
NZ$60/day and all new ads/ad set paused. Apply both budget changes together only
at launch. Compare confirmed bookings, qualified calls and cost per qualified
booking; a form submission alone is not a booked call.


Current build blockers: Meta rejects even validate-only native ad-set creation
with code 100 / subcode 1815089: the Page has not accepted Lead Generation Terms
of Service. Acceptance needs the owner's explicit confirmation. The form remains
a saved draft and native ad-set/ads have not been created. Exact proposed copy,
verified footage IDs, unchanged budget and planned paused status are recorded in
`scripts/meta-native-audit-test.json`. Do not describe those records as ads already
created. The separate website questionnaire was removed after the owner confirmed
that every question must be inside Facebook.
