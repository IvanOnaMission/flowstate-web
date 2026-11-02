// Handles every AI Makeover and Quote Machine form submission. Netlify runs this automatically for
// each verified Netlify Forms submission (event-triggered function: the filename is
// the event name, and Netlify signs the call, so it can't be triggered from outside).
// The business quiz is saved as preparation notes; it never creates another lead
// or sends another booking notification. Other forms are ignored.
//
// The lead goes to Kit and the Notion CRM straight away, but the Telegram alert is
// held for LEAD_ALERT_DELAY_SECONDS (default 120) so they can pick a Calendly time
// first. If they book inside that window, lead-alert.mjs cancels the hold and Ivan
// only gets the "New call booked" message. pending-lead-alerts.mjs sends the rest.
// If the holding list is unavailable the alert goes out immediately instead.
// Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (plus the Kit and Notion keys in ../lib/crm.mjs)
import {addToKit, crmLead, crmQuiz, safely} from '../lib/crm.mjs';
import {quizAnswers, quizContact, verifiedQuizBooking} from '../lib/booking-quiz.mjs';
import {aboutLead} from '../lib/about.mjs';
import {clean, formLeadMessage} from '../lib/messages.mjs';
import {holdLead} from '../lib/pending.mjs';
import {OFFER as QUOTE_MACHINE, sourceLine} from '../lib/quote-machine.mjs';
import {sendAlert, sendContact} from '../lib/telegram.mjs';
import {recordFormLead} from '../lib/ads-tracking.mjs';
import {trackingDatabase} from '../lib/tracking-server.mjs';
import {acceptedMatch, sendCrmEvent} from '../lib/meta-capi.mjs';
const FORMS = ['ai-makeover', 'quote-machine'];

export default async (req) => {
  let payload;
  try { ({payload} = await req.json()); } catch { return new Response('bad json', {status: 400}); }
  const data = payload?.data || {};
  const formName = payload?.form_name || data['form-name'];
  if (formName === 'business-quiz') {
    try {
      const answers = quizAnswers(data);
      const contact = data.booking_invitee
        ? await verifiedQuizBooking(data.booking_invitee, process.env.CALENDLY_TOKEN || process.env.Calendly_Token)
        : quizContact(data);
      let linked = contact && await crmQuiz({...contact, answers, submissionId: payload.id});
      if (!linked && contact && !data.booking_invitee) {
        // The enquiry event may still be creating this contact when the quiz arrives.
        await crmLead({...contact, source: 'business quiz'});
        linked = await crmQuiz({...contact, answers, submissionId: payload.id});
      }
      if (!linked) console.warn('business-quiz: saved in Netlify Forms; CRM match unavailable');
      return new Response(linked ? 'quiz linked' : 'quiz saved in Netlify Forms', {status: 200});
    } catch (err) {
      console.error('business-quiz CRM sync failed:', err.message);
      return new Response('quiz saved in Netlify Forms; CRM sync failed', {status: 502});
    }
  }
  if (!FORMS.includes(formName)) return new Response('ignored', {status: 200});

  const quoteMachine = formName === 'quote-machine';
  const lead = {email: clean(data.email), name: clean(data.name), phone: clean(data.phone),
    ...(quoteMachine ? {offer: QUOTE_MACHINE, source: sourceLine(data)} : {})};
  const contact = {email: lead.email, name: lead.name, phone: lead.phone};
  const submittedAt = payload.created_at || new Date().toISOString();
  const click = acceptedMatch({fbclid: data.fbclid, fbc: data.fbc, fbp: data.fbp}, Date.parse(submittedAt) || Date.now());
  // Keep the existing lead tag and automations; the separate Quote Machine tag starts its booking reminder.
  const kitTag = process.env.KIT_TAG_MAKEOVER_LEAD;
  await Promise.all([
    safely('kit lead', () => addToKit({...contact, tagId: kitTag, tagIds: quoteMachine ? [process.env.KIT_TAG_QUOTE_MACHINE_LEAD] : []})),
    safely('notion lead', () => crmLead({...contact, source: quoteMachine ? 'Quote Machine page' : 'form', customerType: data.customer_type, adId: data.ad_id, ...click, metaLeadId: click.meta_lead_id})),
    safely('marketing lead', async () => { const db=trackingDatabase(); if(db)await recordFormLead(db,{...data, ...click}, submittedAt); }),
    safely('meta crm lead', () => sendCrmEvent({eventName: 'Lead', eventTime: submittedAt, email: lead.email, phone: lead.phone, name: lead.name, ...click, leadId: click.meta_lead_id})),
  ]);

  try {
    await holdLead(lead);
    return new Response('held', {status: 200});
  } catch (err) {
    console.error('submission-created: could not hold lead, alerting now:', err.message);
  }
  try {
    await sendAlert(formLeadMessage(lead, await aboutLead(lead).catch(() => [])));
    await sendContact({...contact, label: `${lead.offer || 'AI Makeover'} lead`});
    return new Response('sent', {status: 200});
  } catch (err) {
    console.error('submission-created alert failed:', err.message);
    return new Response('alert failed', {status: 502});
  }
};
