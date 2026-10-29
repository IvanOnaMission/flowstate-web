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


## Native Facebook audit questionnaire (29 October 2026)

Current route: **Facebook/Instagram ad → native Instant Form → Submit → optional
Calendly booking**. All ten optional business questions and required contact
fields are inside Meta's form. There is no Messenger step or separate website
questionnaire. The user chose this straightforward submission flow instead of
the custom contact-first Messenger route.

Active form `1116182244474862`, **FS | Free 30-minute audit | 10 optional questions
| 2026-10-29**, contains industry, main software, biggest business pain, team size,
AI experience, timing, response speed, site visits, quote preparation time and
follow-up, plus full name, email and phone. The completion screen links directly
to `https://calendly.com/ivan-flowstate/30min?utm_source=facebook&utm_medium=instant_form&utm_campaign=quote-machine`.
Booking is optional and separate from the enquiry submission.

Meta controls the question/contact ordering and can use the form's enabled
flexible delivery. Contact-first ordering and a booking button on each question
are not guarantees of this native form. We receive details and answers when the
person presses Submit; abandoned and unsubmitted fields cannot be recovered.
Skipped questions are stored as **Not answered**. No ownership inference is made.

### Production delivery

`audit-lead-sync` retrieves form `1116182244474862` every minute through the
existing private Page lead-access token. It saves a durable integration outbox,
updates the Twenty contact/opportunity and one note containing all ten questions,
records campaign attribution, applies the existing Kit reminder tags, and queues
an answer-inclusive Telegram summary headed **New lead form**. Independently
completed stages are not repeated on retry. The same note links to the person
and opportunity. A native form submission is not a confirmed booking.

`META_AUDIT_FORM_ID=1116182244474862`. The legacy variable
`META_AUDIT_CONTACT_FIRST=true` is retained to enable the existing durable summary
worker. This is an internal configuration name, not the prospect experience.
The summary worker stores the submitted answers and sends Telegram after its
120-second quiet period; the minute schedule normally makes delivery roughly
2–3 minutes after import. No Messenger conversation is needed. Do not set this
flag false without preserving the answer-inclusive digest route: the older alert
path sends a different contact-only notification. Netlify runtime secrets remain
private; never overwrite a secret with a masked API value.

### Ads and budget

All three prepared ads and their parent form ad set remain **PAUSED**. Approved
copy, footage, thumbnails and disabled creative enhancements are preserved.
They use the native questionnaire, not the contact-only/Messenger form:

| Ad | Ad ID | Creative ID | Native form ID |
| --- | --- | --- | --- |
| Power tools | 120250507913830753 | 2542272709588100 | 1116182244474862 |
| Replies on site | 120250507984940753 | 3278630962527733 | 1116182244474862 |
| Unbillable time | 120250507984950753 | 2057600894939587 | 1116182244474862 |

Website ad set `120250452722710753` stays **ACTIVE, NZ$60/day**. Native form ad set
`120250507913820753` stays **PAUSED, NZ$30/day**. The proposed NZ$30/NZ$30 split
has not been applied. No launch or budget change was made during simplification.
Normal Meta ad review and delivery rules still apply when the owner launches.

### Verification

The real Meta native test record `1135595305639949` contains all ten supplied
answers and the synthetic contact **[TEST] Meta CRM connection**. Fresh API
retrieval confirms those values. Twenty has exactly one linked note
`3746b0e5-189f-5734-97ef-f6d22b5eb2a7` with all ten answers and the correct option
text. Opportunity `ed40b017-5781-5971-8b23-ac5e05c15fb7` remains **TEST**; follow-up
is **DONE**. The existing synthetic fixture is retained rather than deleted.
The notification stage was replayed through the production minute worker. It
sent **Telegram message 118 with all ten answers**; durable state confirms
`revision=notifiedRevision=0`, summary count 10 and `crmDirty=false`. Tracking and Kit remain suppressed for the
fixture; no fake conversion or reminder email is created.

Meta's native preview was completed through all ten question choices, synthetic
contact details, Submit and the success screen. Its booking button opened the
actual **Free 30-minute audit** Calendly event, 30 minutes, Auckland timezone and
instant-form campaign UTMs; no booking was made. The preview itself is not a new
API lead: the retained real test record above supplied the delivery check.

Status: **NATIVE_FORM_AND_DELIVERY_VERIFIED_ADS_PAUSED**. Automated suite 60/60 and
production build pass. Verified native delivery deployment:
`6ae2815bb5a2c4ad477289e3` (existing runtime commit
`09476ea32604b268de50fc148a4b0264e65cf77e`, rebuilt with the native form ID).
Screenshots in `/Users/ivanbarnett/flowstate-output/marketing/`:
`native-quick-form-questions-2026-10-29.jpg` and
`native-quick-form-complete-2026-10-29.jpg`. See
`meta-native-audit-test.json` for the detailed receipt.

### Retired Messenger route

Contact-only form `1091630220564926` and the ordering experiment
`2230455587511903` remain stored but are unused by the current ads/importer.
The custom Messenger implementation and its historical test evidence remain in
the repository, but they are not in the current native lead journey.

Business portfolio `2087399378511036` was unverified and custom
`pages_messaging` review draft `4950633641929533` was not submitted. Those were
blockers for the optional custom Messenger bot. They are **not prerequisites
introduced by this native questionnaire route**. Do not ask the owner to finish
that bot's review, tester setup or recording to run this form. The retired
[META-MESSENGER-REVIEW.md](META-MESSENGER-REVIEW.md) is historical reference only.
Existing Page leads access and Lead Ads Terms are already configured.

The lead token expires **28 December 2026, 08:12 NZDT**
(`2026-12-27T19:12:11Z`); rotate privately before expiry. Deployment must preserve
Netlify functions: use the connected Git build, not a static-only upload.
