// Handles every AI Makeover form submission. Netlify runs this automatically for
// each verified Netlify Forms submission (event-triggered function: the filename is
// the event name, and Netlify signs the call, so it can't be triggered from outside).
// Only the "ai-makeover" form counts; the contact form and anything else are ignored.
//
// The lead goes to Kit and the Notion CRM straight away, but the Telegram alert is
// held for LEAD_ALERT_DELAY_SECONDS (default 120) so they can pick a Calendly time
// first. If they book inside that window, lead-alert.mjs cancels the hold and Ivan
// only gets the "New call booked" message. pending-lead-alerts.mjs sends the rest.
// If the holding list is unavailable the alert goes out immediately instead.
// Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (plus the Kit and Notion keys in ../lib/crm.mjs)
import {addToKit, crmLead, safely} from '../lib/crm.mjs';
import {aboutLead} from '../lib/about.mjs';
import {clean, formLeadMessage} from '../lib/messages.mjs';
import {holdLead} from '../lib/pending.mjs';
import {sendAlert, sendContact} from '../lib/telegram.mjs';
import {recordFormLead} from '../lib/ads-tracking.mjs';
import {trackingDatabase} from '../lib/tracking-server.mjs';
const FORM = 'ai-makeover';

export default async (req) => {
  let payload;
  try { ({payload} = await req.json()); } catch { return new Response('bad json', {status: 400}); }
  const data = payload?.data || {};
  const formName = payload?.form_name || data['form-name'];
  if (formName !== FORM) return new Response('ignored', {status: 200});

  const lead = {email: clean(data.email), name: clean(data.name), phone: clean(data.phone)};
  await Promise.all([
    safely('kit lead', () => addToKit({...lead, tagId: process.env.KIT_TAG_MAKEOVER_LEAD})),
    safely('notion lead', () => crmLead({...lead, source: 'form', customerType: data.customer_type, adId: data.ad_id})),
    safely('marketing lead', async () => { const db=trackingDatabase(); if(db)await recordFormLead(db,data,payload.created_at || new Date().toISOString()); }),
  ]);

  try {
    await holdLead(lead);
    return new Response('held', {status: 200});
  } catch (err) {
    console.error('submission-created: could not hold lead, alerting now:', err.message);
  }
  try {
    await sendAlert(formLeadMessage(lead, await aboutLead(lead).catch(() => [])));
    await sendContact(lead);
    return new Response('sent', {status: 200});
  } catch (err) {
    console.error('submission-created alert failed:', err.message);
    return new Response('alert failed', {status: 502});
  }
};
