# Audit backend — setup (~10 min, one time)

The audit page captures leads. This connects it to a Google Sheet that stores every lead, emails the lead their proposal, and texts/emails you to follow up. It's one free Google Apps Script — no server.

## 1. Make the Sheet
1. Go to **sheets.google.com** (logged into the account you want — e.g. ivan@barnettdigital.co) → **Blank spreadsheet**.
2. Name it **Audit Leads**. (The script creates a `Leads` tab automatically on first submission.)

## 2. Add the script
1. In that Sheet: **Extensions → Apps Script**.
2. Delete the placeholder `function myFunction()`, then paste the entire contents of **`Code.gs`** (in this folder).
3. At the top, check the **CONFIG** lines:
   - `OWNER_EMAIL` — where your lead alerts go
   - `BOOK_CALL_URL` — your real Calendly/booking link (the button in the lead's email)
4. **Save** (💾).

## 3. Deploy it as a web app
1. **Deploy → New deployment**.
2. Gear icon → **Web app**.
3. **Execute as: Me** · **Who has access: Anyone**.
4. **Deploy** → authorise (it'll warn it's unverified — that's your own script, click through: Advanced → Go to project → Allow).
5. **Copy the Web app URL** (ends in `/exec`).

## 4. Connect the page
1. Open `audit/index.html` → find `var LEAD_ENDPOINT = '';` near the top of the `<script>`.
2. Paste your URL between the quotes: `var LEAD_ENDPOINT = 'https://script.google.com/macros/s/..../exec';`
3. Redeploy the site: `cd ~/code/flowstate-web && node build.js && npx netlify-cli deploy --dir=dist --prod`

## Done — test it
Fill out the live audit with your own email. Within a few seconds you should see:
- a new row in the **Audit Leads** Sheet
- the **proposal email** in your inbox (you were the "lead")
- the **alert email** to `OWNER_EMAIL` with the phone number to call

## Notes
- Emails send from the Google account that owns the script. A Workspace domain (barnettdigital.co) = good deliverability. Consumer Gmail caps at ~100 emails/day (fine for leads).
- To change the proposal email wording, edit `proposalHtml()` in the Sheet's Apps Script and **redeploy** (Deploy → Manage deployments → edit → new version).
- If you ever leave `LEAD_ENDPOINT` blank, the page falls back to Netlify Forms so leads are still captured (just no auto-email).
