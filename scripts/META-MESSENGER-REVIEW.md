# Flowstate Messenger review preparation — 29 October 2026

**Draft only. Public Messenger access is blocked.** The admin-account end-to-end
test is verified; it does not establish access for public prospects. No ads were
launched and the live website budget remains NZ$60/day.

## Exact Meta state and next owner action

- App: **Flowstate Ads**, `4854641474862084`.
- Business portfolio: **Ivan Barnett**, `2087399378511036`, `not_verified`.
- Page: **Ivan Barnett**, `1095779013619484`.
- Permission: `pages_messaging`.
- [Review draft 4950633641929533](https://developers.facebook.com/apps/4854641474862084/app-review/submissions/?submission_id=4950633641929533&business_id=2087399378511036): **NOT SUBMITTED**.
- [Business verification](https://business.facebook.com/latest/settings/security_center/?business_id=2087399378511036): eligible, not completed.

The verification wizard is open at **Select your business type**, after choosing
New Zealand. Ivan must choose his actual legal structure: sole proprietorship,
partnership, private company, corporation or institution. Do not infer the legal
structure from the portfolio display name. Meta then requires business name,
address, phone, email and website, confirmation of the owner's connection, and
may request accepted documents if it cannot find the business. Enter those
details and any documents directly in Meta; keep them out of git and chat.
No verification details or declarations have been submitted on Ivan's behalf.

## Prepared permission explanation

This text is saved in the draft, with the Ivan Barnett Page selected. The allowed
usage agreement is unchecked; a partial saved draft is not a completed review.

> Flowstate Ads responds to people who choose to continue their free audit
> enquiry in Messenger. A person first submits name, email and phone through our
> Facebook Instant Form, then initiates the Page chat. The app matches the email
> they confirm to the enquiry and sends ten optional business-process questions,
> one at a time, with answer buttons, a skip choice and a Calendly booking button
> on every question. Each supplied answer updates the same enquiry note in Twenty
> through Netlify, and Ivan receives a delayed Telegram summary. People can stop
> or book without completing the questions. `pages_messaging` is needed to receive
> their messages and postbacks and send interactive responses. This permission
> is not used to initiate unsolicited chats or process unrelated Page conversations.
> The app also supports Flowstate's existing advertising operations. The actual
> admin-account flow was tested on 29 October 2026; public access is pending
> business verification and permission review.

## Reviewer reproduction draft

The draft in Meta explicitly says a fresh fixture and recording are still
required. Do not submit those preparation notes as final reviewer instructions.

1. Use a real Facebook account with the app Tester role. The permission dialog
   explicitly says App Roles test users cannot receive bot messages. Ivan must
   supply/control the appropriate real tester account; do not invent an account,
   share his personal credentials, or grant an unknown person a role.
2. Before review, prepare a **fresh synthetic native lead** on contact-only form
   `1091630220564926` with a controlled email and clearly marked test contact.
   Suppress tracking and Kit for the synthetic record. The previous test lead
   `2255373378659141` is complete and cannot demonstrate a new conversation.
3. Open `https://m.me/1095779013619484?ref=fs_audit_v1` and Get Started if shown.
   Confirm the same email as the submitted native contact. Allow one scheduled
   import minute if it has not appeared yet.
4. Answer some questions using quick replies, including a non-first choice.
   Skip at least one question and confirm it advances. Show the booking button
   on every question. Pause midway to show answers persist, then complete.
5. Confirm the completion message and open the booking link. It must show
   **Free 30-minute audit**, 30 minutes, Auckland timezone and the campaign UTMs.
   Do not make a booking.
6. Supporting private operator checks: one Twenty note receives each answer;
   stopped chats retain contact details and supplied answers; after 120 seconds
   quiet, the worker sends/edits a single Telegram summary. Do not provide CRM,
   Telegram, Netlify or Meta access tokens to reviewers.

## Real screen recording still required

The permission dialog requires a recording, not just screenshots. No recording
has been uploaded. The existing screenshot of the real completed admin test is
supporting evidence only. Do not present a mockup, reenactment or generated UI
as a recording of the live flow.

Record the fresh synthetic contact submission, the Messenger start/email match,
quick replies and skip, booking button, completion and actual Calendly destination.
Keep the recording confined to the relevant form/chat; hide unrelated inbox
content, account details, credentials and real prospects. If showing the CRM or
Telegram, show only the matching synthetic record. Explain any time jump used
for the quiet-period wait. Agent can finish fixture/recording preparation when
the required real tester account is available; do not shift technical work to
the owner as if it were a legal verification requirement.

## Data flow facts for the owner's declarations

| Recipient / service | Actual purpose and data |
| --- | --- |
| Meta | Native contact submission and user-initiated Page Messenger conversation; Page-scoped sender ID, email confirmation, selected answers, message/postback IDs |
| Netlify | Function hosting, signed webhook processing, native lead import, durable contact/chat state, queued events, per-record processing locks, retry outbox and last sent summary |
| Twenty | Person, opportunity and same-note updates containing contact details and supplied optional answers |
| Telegram | Ivan's contact/answer summary; later answers edit the original notification |
| Supabase | Existing campaign/lead attribution through the importer tracking stage; optional questionnaire answers are not sent by the pixel |
| Kit | Existing audit booking-reminder subscription; synthetic test enrolment suppressed |
| Calendly | Separate user-initiated booking; opening the booking page alone is not a booking |

No new AI model processes this questionnaire. Webhook authenticity uses
HMAC-SHA256 with the app secret and Page ID filtering. Runtime secrets are private
in Netlify, not browser code or git. This is evidence about this implementation,
not a certification of the owner's full organization, contracts, retention
policy, government-request history or every legacy app use case.

The actual Data handling screen asks for processors/service providers, the legal
data controller and its country, whether personal data was supplied to public
authorities for national-security requests in the past 12 months, and which
request-review/challenge/minimization/documentation policies exist. These fields
were inspected and left unanswered. The implementation establishes service use;
it cannot establish the owner's legal identity, history or organizational policy.

Manual deletion requests go to `ivan@flowstate.net.nz`. Relevant copies can span
the native importer outbox, chat state, email and sender pointers, queued events,
CRM note/targets and contact records, Telegram summary and any matching
marketing/reminder/booking records. There is no automated deletion endpoint or
fixed automatic retention expiry in this implementation. Do not claim either.
Resolve pending workers/retries when executing a future authorized deletion so
they cannot recreate removed data. No deletion was performed during preparation.

## Before submitting the review

- Complete owner business verification and select the verified portfolio.
- Use the current privacy notice `https://flowstate.net.nz/quoting-privacy/` and
  deletion instructions `https://flowstate.net.nz/data-deletion/` in app settings
  after their production deployment is verified. Do not use Facebook's homepage
  as a purported Flowstate terms or deletion policy.
- Complete app icon, category and domain requirements, based on the actual app.
  Do not invent legal terms to fill an optional placeholder.
  A 1024 × 1024 PNG rendered from the existing Flowstate vector logo is prepared
  at `/Users/ivanbarnett/flowstate-output/marketing/flowstate-meta-app-icon-1024.png`.
  The extension blocked file upload because file-URL access is disabled; the
  icon has not been uploaded. Ivan can use **App settings → Basic → App icon**
  to upload that file directly. No extension permission was changed.
- Finalize a fresh reviewer fixture and real screen recording, replace the draft
  preparation notes with reproducible final instructions and upload the recording.
- The permission dialog currently reports **0 of 1 API calls** and says test data
  can take **24 hours** to show. Production Send API messages worked; the counter
  is still incomplete. Recheck the Testing screen and resolve before submission.
- Ivan must review the app-wide data-handling questions and the usage declaration
  against his actual practices. Do not guess answers or accept agreements for him.
- Submit only when all steps are complete, then record the actual submission
  outcome. The present draft is not "awaiting review".
- After access is approved, test with a real non-role account. Ads remain paused
  until that succeeds and Ivan authorizes launch and any budget change.

See [AD-TRACKING.md](AD-TRACKING.md) and `meta-native-audit-test.json` for current
ad IDs, creative IDs, runtime configuration and verified synthetic test evidence.
