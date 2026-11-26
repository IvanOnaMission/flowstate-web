# Meta CRM events (Conversions API)

Flow State sends lead-quality events to dataset `3159317364459626` so Meta can learn which ads produce people who book, attend and pay. This does not change any campaign, ad set, ad or budget. With `META_CAPI_TOKEN` unset, every existing lead path behaves as before: the new calls log once and return.

The metric this is for is **cost per attended call**. In Ads Manager, Conversion Leads optimisation is available on instant-form campaigns. Website campaigns still use the browser pixel’s `Lead` and `Schedule` events. The CRM events below are separate (`action_source` `system_generated`) and are not deduplicated with those pixel events.

## What Ivan sets in Netlify

| Variable | Required | Value |
| --- | --- | --- |
| `META_CAPI_TOKEN` | Yes, to send anything | Conversions API token from Events Manager. Server only. |
| `META_CAPI_DATASET_ID` | Yes, to send anything | `3159317364459626` |
| `META_CAPI_TEST_EVENT_CODE` | Only while checking | Code from Test Events, such as `TEST12345`. Remove it to go live. |
| `META_CAPI_LEAD_EVENT_SOURCE` | No | Defaults to `Twenty`. Sent as `custom_data.lead_event_source`. |
| `META_CAPI_ATTENDED_STAGES` | No | Comma-separated Twenty stage API values. Default `MEETING,ATTENDED`. |
| `META_CAPI_WON_STAGES` | No | Default `CUSTOMER,MAINTENANCE,WON`. |

`TWENTY_API_URL` and `TWENTY_API_KEY` are already used for the CRM. Stage polling does nothing without them. `MKT_SUPABASE_URL` and `MKT_SUPABASE_SERVICE_KEY` are already used to store match keys on `mkt_leads.tracking`.

## Create the token

1. Open [Events Manager](https://eventsmanager.facebook.com/) and select the Flowstate dataset `3159317364459626`.
2. Open **Settings**.
3. Under **Conversions API**, choose **Generate access token** (direct integration). If the page offers “Set up direct integration” first, use that, then generate the token.
4. Copy the token into Netlify as `META_CAPI_TOKEN`. Do not commit it and do not put it in the browser.
5. Set `META_CAPI_DATASET_ID` to `3159317364459626`.

The token is sent as an `Authorization` header, not in the URL.

## Check it before it counts

1. In Events Manager open the dataset → **Test events**.
2. Copy the test event code into Netlify as `META_CAPI_TEST_EVENT_CODE`.
3. Deploy, then either submit a real form or move a Twenty opportunity (see the stages below).
4. The event should show on the Test events tab within a couple of minutes, with `action_source` System generated and `custom_data.event_source` `crm`. Test events are not used for optimisation.
5. Delete `META_CAPI_TEST_EVENT_CODE` and redeploy when the payload looks right. Until that variable is removed, events stay in the test tab.

The first minute after the token is set, `crm-stage-sync` records the current Twenty stages and does not replay old deals. It does send `FS_Booked`, `FS_Attended` and `FS_Won` for opportunities **created in the last 7 days** that have already reached those stages. It does not send `Lead` for them. Wait for that first run (Netlify function log: `meta-capi: baselined …`) before moving a stage you want to see as a new event. Meta drops events older than 7 days.

## Stage names

Website ad sets optimise on the pixel’s standard `Lead` and `Schedule` events. A Conversions API event with either of those exact names is counted as that conversion, including when the event comes from an older CRM record. The stage poll therefore uses custom names only, so those updates stay available in Events Manager and do not train Lead optimisation. The browser pixel on the landing pages is unchanged: a real form submit still sends `Lead`, and a confirmed Calendly booking still sends `Schedule`.

| When | `event_name` | Where it fires |
| --- | --- | --- |
| Website form, audit instant form (`META_AUDIT_FORM_ID`), or audit enquiry is first saved | `Lead` | `submission-created`, or once from `audit-lead-sync` |
| Admin instant forms (`META_LEAD_FORM_IDS`; default `1174559812181344`, `1480350577329067`) | *(none)* | Telegram alert and Twenty contact only. No `Lead` event. Later `FS_Booked` / `FS_Attended` / `FS_Won` still come from `crm-stage-sync` when the deal moves. |
| Calendly `invitee.created` (not a reschedule or cancellation) | `Booked` | `lead-alert` |
| Twenty reaches booked (`SCREENING`, `PROPOSAL`, or any later stage), first time only | `FS_Booked` | `crm-stage-sync`, every minute |
| Twenty stage `MEETING` or `ATTENDED`, or `callOutcome` `ATTENDED`, first time only | `FS_Attended` | `crm-stage-sync` |
| Twenty stage `CUSTOMER`, `MAINTENANCE` or `WON`, or `saleOutcome` `WON`, first time only | `FS_Won` | `crm-stage-sync` |

`crm-stage-sync` never sends `Lead` or `Schedule`. `SCREENING` is the stage the site already sets when someone books. The poll treats it as booked, so a missed Calendly event is sent as `FS_Booked` once. `PROPOSAL` stays “booked” only. A sale does **not** imply the call was attended. Move the opportunity to `MEETING` when they show up, and to `CUSTOMER` when they pay. If the workspace uses different API values, set `META_CAPI_ATTENDED_STAGES` and `META_CAPI_WON_STAGES` to those exact values (comma-separated, case-insensitive).

`LOST` sends nothing.

## Why a poll, not a Twenty webhook

Attended and won are set by hand in Twenty. A one-minute scheduled function (`crm-stage-sync`) is soon enough for ad delivery, and a failed Meta call is tried again on the next run. A successful send is stored against the opportunity and against the `event_id` (a hash of the custom event name and the email), so the next poll does not send that stage again. A webhook would need a new public URL and signing secret, and a dropped delivery would stay dropped unless Twenty retried it. No Twenty webhook is required.

The first run snapshots current stages. After that, only a change to the stage, call outcome or sale outcome sends the new custom event. Duplicates and test records are skipped.

## Match keys

Instant-form leads store Meta’s 15–17 digit lead id (`leadgen_id`) as `meta_lead_id` on the Supabase lead (`mkt_leads.tracking`). Website forms store `fbclid`, and `fbc` / `fbp` when the Meta cookie or the click id is present. Later `Booked`, `FS_Booked`, `FS_Attended` and `FS_Won` events reuse those keys. Email and phone are SHA-256 hashed after normalising (email trimmed and lowercased; `021…` becomes `64…`). They are not written to logs. The access token is not written to logs.

Optional Twenty opportunity fields, all text: `metaLeadId`, `fbclid`, `fbc`, `fbp`. If those fields do not exist, the lead is still saved and the keys stay on the Supabase record. One warning is logged. Creating the fields lets the CRM record itself carry the lead id.

## What is never sent

- Names starting with `[TEST]`, any `@example.invalid` address, any `@flowstate.net.nz` address, and Twenty records marked `TEST`.
- `Lead` from the admin instant-form webhook (`META_LEAD_FORM_IDS`). That path texts Ivan and saves the Twenty contact. It does not call the Conversions API.
- Calendly reschedules and cancellations.
- Events with no email, phone, lead id or click id.
- Events whose time is older than 7 days.

## Open points

- Confirm the Twenty stage API values. The defaults assume `MEETING` means they attended and `CUSTOMER` / `MAINTENANCE` means they paid, which matches the stages this repo already writes and Twenty’s standard pipeline. The ads notes still describe call outcome as something edited in Notion. If attended and won are only updated there, this poll will not see them.
- Conversion Leads as an Ads Manager goal applies to instant forms. Choosing it, or changing budgets, is a separate step and is not part of this change.
- Say if other internal addresses should be excluded. `irbarnett@icloud.com` is not filtered.
- The privacy notice does not yet mention that click ids are stored for ad matching.
