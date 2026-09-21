// Texts Ivan the moment a quoting lead arrives, so he can call them straight away.
//   Kit webhook      POST /.netlify/functions/lead-alert?source=kit
//   Calendly webhook POST /.netlify/functions/lead-alert?source=calendly
// Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
// Optional hardening: KIT_WEBHOOK_TOKEN (then add &token=… to the Kit URL),
//   CALENDLY_SIGNING_KEY (signature check) or CALENDLY_TOKEN (confirms the booking with Calendly).
import crypto from 'node:crypto';
import {addToKit, crmBooked, safely} from '../lib/crm.mjs';
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

function calendlyMessage(body) {
  const p = body.payload || {};
  const answers = p.questions_and_answers || [];
  const phone = answers.find(a => /phone/i.test(a.question))?.answer || p.text_reminder_number || 'not given';
  const when = p.scheduled_event?.start_time ? nzTime(p.scheduled_event.start_time) : 'time unknown';
  const verb = body.event === 'invitee.canceled' ? 'Call CANCELLED' : 'New call booked';
  const basic = `${verb}\n${p.name || 'Unknown'}\nPhone: ${phone}\n${p.email || ''}\n${when}`;
  if (body.event === 'invitee.canceled') return basic;
  // Anything else they typed into the booking form (e.g. "what will help prepare for our meeting").
  const notes = answers
    .filter(a => !/phone/i.test(a.question) && String(a.answer || '').trim())
    .map(a => `${String(a.question).trim()}\n${String(a.answer).trim()}`);
  const first = String(p.name || '').trim().split(/\s+/)[0] || 'there';
  const start = p.scheduled_event?.start_time ? new Date(p.scheduled_event.start_time) : null;
  const day = start ? start.toLocaleDateString('en-NZ', {timeZone: 'Pacific/Auckland', weekday: 'long'}) : '[day]';
  const time = start ? start.toLocaleTimeString('en-NZ', {timeZone: 'Pacific/Auckland', hour: 'numeric', minute: '2-digit'}) : '[time]';
  return [
    basic,
    ...(notes.length ? ['', 'THEIR NOTES', ...notes] : []),
    '',
    'Call them now.',
    '',
    'CALL SCRIPT',
    `"Hey ${first}, it's Ivan from Flowstate. You just booked a call about the 2-Day AI Makeover, so I wanted to say g'day and thanks.`,
    'Quick one so I can make the most of our time: what made you book? [listen]',
    'And if you could get one thing out of this call, what would it be? [listen]',
    `Perfect. So on ${day} at ${time} we'll spend 30 minutes looking at how you quote and where the time goes, and I'll tell you honestly if the Makeover's a fit.`,
    'If anything comes up before then, will you flick me a text so we can move it? [wait for yes]',
    `Awesome. I'll send you a text now so you've got my number. Talk ${day}."`,
    '',
    'NO ANSWER: ring straight back once, then text:',
    `"Hey ${first}, Ivan from Flowstate here. Just tried calling to say thanks for booking in for ${day} at ${time}. This is my number if you need to move it. Talk then!"`,
    '',
    'REMINDER TEXTS',
    `Night before: "Hey ${first}, looking forward to our chat tomorrow at ${time}. Ivan"`,
    `Morning of: "Morning ${first}! Still good for ${time} today?"`,
    `1 hour before: "Talk in an hour, ${first}. I'll call you on this number."`,
  ].join('\n');
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
    text = calendlyMessage(body);
    if (body.event === 'invitee.created') {
      const p = body.payload || {};
      const phone = (p.questions_and_answers || []).find(a => /phone/i.test(a.question))?.answer || p.text_reminder_number || '';
      const booked = {email: p.email, name: p.name, phone, start: p.scheduled_event?.start_time};
      contact = {...booked, label: 'AI Makeover booked'};
      await Promise.all([
        safely('kit booked', () => addToKit({...booked, tagId: process.env.KIT_TAG_MAKEOVER_BOOKED})),
        safely('notion booked', () => crmBooked(booked)),
        // They filled the form minutes ago: drop the waiting "not booked yet" alert.
        safely('release pending', () => releaseLead(booked)),
      ]);
    }
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
