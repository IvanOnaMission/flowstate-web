// Texts Ivan the moment a quoting lead arrives, so he can call them straight away.
//   Kit webhook      POST /.netlify/functions/lead-alert?source=kit
//   Calendly webhook POST /.netlify/functions/lead-alert?source=calendly
// Env: CLICKSEND_USERNAME, CLICKSEND_API_KEY, ALERT_PHONE
// Optional hardening: KIT_WEBHOOK_TOKEN (then add &token=… to the Kit URL),
//   CALENDLY_SIGNING_KEY (signature check) or CALENDLY_TOKEN (confirms the booking with Calendly).
import crypto from 'node:crypto';

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

function kitMessage(body) {
  const s = body.subscriber || {};
  const f = s.fields || {};
  const name = f.full_name || s.first_name || 'Unknown';
  return `New workbook signup\n${name}\nPhone: ${f.phone || 'not given'}\n${s.email_address || ''}\nCall them now.`;
}

function calendlyMessage(body) {
  const p = body.payload || {};
  const answers = p.questions_and_answers || [];
  const phone = answers.find(a => /phone/i.test(a.question))?.answer || p.text_reminder_number || 'not given';
  const when = p.scheduled_event?.start_time ? nzTime(p.scheduled_event.start_time) : 'time unknown';
  const verb = body.event === 'invitee.canceled' ? 'Call CANCELLED' : 'New call booked';
  return `${verb}\n${p.name || 'Unknown'}\nPhone: ${phone}\n${p.email || ''}\n${when}`;
}

async function sendSms(text) {
  const {CLICKSEND_USERNAME: user, CLICKSEND_API_KEY: key, ALERT_PHONE: to} = process.env;
  if (!user || !key || !to) throw new Error('SMS not configured');
  const res = await fetch('https://rest.clicksend.com/v3/sms/send', {
    method: 'POST',
    headers: {'content-type': 'application/json', authorization: 'Basic ' + Buffer.from(`${user}:${key}`).toString('base64')},
    body: JSON.stringify({messages: [{to, body: text.slice(0, 600), source: 'flowstate-lead-alert'}]}),
  });
  const out = await res.json().catch(() => ({}));
  const status = out?.data?.messages?.[0]?.status;
  if (!res.ok || (status && status !== 'SUCCESS')) throw new Error(`ClickSend ${res.status} ${status || out?.response_code || ''}`);
}

export default async (req) => {
  if (req.method !== 'POST') return json(405, {error: 'POST only'});
  const url = new URL(req.url);
  const source = url.searchParams.get('source');
  const raw = await req.text();
  let body;
  try { body = JSON.parse(raw); } catch { return json(400, {error: 'bad json'}); }

  let text;
  if (source === 'kit') {
    const token = process.env.KIT_WEBHOOK_TOKEN;
    if (token && !safeEqual(url.searchParams.get('token') || '', token)) return json(401, {error: 'unauthorised'});
    const s = body.subscriber;
    if (!s?.id || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email_address || '')) return json(400, {error: 'not a Kit subscriber payload'});
    text = kitMessage(body);
  } else if (source === 'calendly') {
    const key = process.env.CALENDLY_SIGNING_KEY, apiToken = process.env.CALENDLY_TOKEN;
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
  } else {
    return json(400, {error: 'unknown source'});
  }

  try {
    await sendSms(text);
    return json(200, {sent: true});
  } catch (err) {
    console.error('lead-alert failed:', err.message);
    return json(502, {error: 'sms failed'});
  }
};
