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
