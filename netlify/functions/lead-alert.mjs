// Texts Ivan the moment a quoting lead arrives, so he can call them straight away.
//   Kit webhook      POST /.netlify/functions/lead-alert?source=kit
//   Calendly webhook POST /.netlify/functions/lead-alert?source=calendly
// Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
// Optional hardening: KIT_WEBHOOK_TOKEN (then add &token=… to the Kit URL),
//   CALENDLY_SIGNING_KEY (signature check) or CALENDLY_TOKEN (confirms the booking with Calendly).
import crypto from 'node:crypto';
import {addToKit, crmBooked, safely} from '../lib/crm.mjs';
import {aboutLead} from '../lib/about.mjs';
import {bookedMessage} from '../lib/messages.mjs';
import {releaseLead} from '../lib/pending.mjs';
import {sendAlert, sendContact} from '../lib/telegram.mjs';

const json = (status, body) => new Response(JSON.stringify(body), {status, headers: {'content-type': 'application/json'}});

function safeEqual(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

// Calendly-Webhook-Signature: t=<unix>,v1=<hex hmac of "t.body">
function calendlySignatureValid(header, raw, key) {
  const parts = Object.fromEntries(String(header || '').split(',').map(p => p.split('=')));
  if (!parts.t || !parts.v1) return false;
  if (Math.abs(Date.now() / 1000 - Number(parts.t)) > 300) return false;
  const expected = crypto.createHmac('sha256', key).update(`${parts.t}.${raw}`).digest('hex');
  return safeEqual(expected, parts.v1);
}

const nzTime = iso => new Date(iso).toLocaleString('en-NZ', {
  timeZone: 'Pacific/Auckland', weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit',
});

// Kit payloads vary ({subscriber}, {data}, {delivery_id, events: [...]}): find the subscriber object.
function kitSubscriber(node, depth = 0) {
  if (!node || typeof node !== 'object' || depth > 6) return null;
  if (typeof node.email_address === 'string') return node;
  for (const value of Object.values(node)) {
    const found = kitSubscriber(value, depth + 1);
    if (found) return found;
  }
  return null;
}
const shape = (node, depth = 0) => node && typeof node === 'object' && depth < 4
  ? Object.fromEntries(Object.entries(Array.isArray(node) ? {0: node[0]} : node).map(([k, v]) => [k, shape(v, depth + 1)]))
  : typeof node;

function kitMessage(body) {
  const s = kitSubscriber(body) || {};
  const f = s.fields || {};
  const name = f.full_name || s.first_name || 'Unknown';
  return `New signup\n${name}\nPhone: ${f.phone || 'not given'}\n${s.email_address || ''}\nCall them now.`;
}

function calendlyMessage(body, aboutLines = []) {
  const p = body.payload || {};
  const answers = p.questions_and_answers || [];
  const phone = answers.find(a => /phone/i.test(a.question))?.answer || p.text_reminder_number || 'not given';
  const when = p.scheduled_event?.start_time ? nzTime(p.scheduled_event.start_time) : 'time unknown';
  if (body.event === 'invitee.canceled') return `Call CANCELLED\n${p.name || 'Unknown'}\nPhone: ${phone}\n${p.email || ''}\n${when}`;
  return bookedMessage({
    name: p.name, phone, email: p.email, when,
    answers: answers.filter(a => !/phone/i.test(a.question)),
  }, aboutLines);
}

export default async (req) => {
  if (req.method !== 'POST') return json(405, {error: 'POST only'});
  const url = new URL(req.url);
  const source = url.searchParams.get('source');
  const raw = await req.text();
  let body;
  try { body = JSON.parse(raw); } catch { return json(400, {error: 'bad json'}); }

  let text, contact = null;
  if (source === 'kit') {
    const token = process.env.KIT_WEBHOOK_TOKEN;
    if (token && !safeEqual(url.searchParams.get('token') || '', token)) return json(401, {error: 'unauthorised'});
    const s = kitSubscriber(body);
    if (!s?.id || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email_address || '')) {
      console.error('lead-alert: unexpected Kit payload shape', JSON.stringify(shape(body)));
      return json(400, {error: 'not a Kit subscriber payload'});
    }
    text = kitMessage(body);
    contact = {name: s.fields?.full_name || s.first_name, phone: s.fields?.phone, email: s.email_address, label: 'Quoting lead'};
  } else if (source === 'calendly') {
    const key = process.env.CALENDLY_SIGNING_KEY, apiToken = process.env.CALENDLY_TOKEN || process.env.Calendly_Token;
    if (key) {
      if (!calendlySignatureValid(req.headers.get('calendly-webhook-signature'), raw, key)) return json(401, {error: 'unauthorised'});
    } else if (apiToken) {
      // No shared secret: confirm the invitee really exists in Ivan's Calendly before texting.
      const uri = body.payload?.uri || '';
      if (!uri.startsWith('https://api.calendly.com/')) return json(400, {error: 'bad payload'});
      const check = await fetch(uri, {headers: {authorization: `Bearer ${apiToken}`}});
      if (!check.ok) return json(401, {error: 'unverified booking'});
    } else {
      return json(401, {error: 'calendly not configured'});
    }
    if (!['invitee.created', 'invitee.canceled'].includes(body.event)) return json(200, {ignored: body.event});
    let aboutLines = [];
    if (body.event === 'invitee.created') {
      const p = body.payload || {};
      const phone = (p.questions_and_answers || []).find(a => /phone/i.test(a.question))?.answer || p.text_reminder_number || '';
      const booked = {email: p.email, name: p.name, phone, start: p.scheduled_event?.start_time};
      contact = {...booked, label: 'AI Makeover booked'};
      await Promise.all([
        aboutLead({email: p.email, tracking: p.tracking}).then(lines => { aboutLines = lines; }, () => {}),
        safely('kit booked', () => addToKit({...booked, tagId: process.env.KIT_TAG_MAKEOVER_BOOKED})),
        safely('notion booked', () => crmBooked(booked)),
        // They filled the form minutes ago: drop the waiting "not booked yet" alert.
        safely('release pending', () => releaseLead(booked)),
      ]);
    }
    text = calendlyMessage(body, aboutLines);
  } else {
    return json(400, {error: 'unknown source'});
  }

  try {
    await sendAlert(text);
    if (contact) await sendContact(contact);
    return json(200, {sent: true});
  } catch (err) {
    console.error('lead-alert failed:', err.message);
    return json(502, {error: 'alert failed'});
  }
};
