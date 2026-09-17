// Texts Ivan the moment an AI Makeover form comes in, so he can call them straight away.
// Netlify runs this automatically for every verified Netlify Forms submission
// (event-triggered function: the filename is the event name, and Netlify signs
// the call, so it can't be triggered from outside). Only the "ai-makeover" form
// alerts; the contact form and anything else are ignored.
// Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (plus the Kit and Notion keys in ../lib/crm.mjs)
import {addToKit, crmLead, safely} from '../lib/crm.mjs';
const FORM = 'ai-makeover';

const clean = (value, max = 200) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

function makeoverMessage(data) {
  const first = clean(data.name).split(' ')[0] || 'there';
  return [
    'New AI Makeover lead (form, not booked yet)',
    clean(data.name) || 'Unknown',
    `Phone: ${clean(data.phone) || 'not given'}`,
    clean(data.email),
    'Call them now.',
    '',
    'CALL SCRIPT',
    `"Hey ${first}, Ivan from Flowstate. You just put your details in on the AI Makeover page, so I thought I'd give you a quick ring.`,
    'What caught your eye? [listen]',
    `Easiest thing is a 30-minute chat where we look at how you quote and whether this fits. I've got [option 1] or [option 2]. Which suits?"`,
    '',
    'NO ANSWER: ring straight back, then text:',
    `"Hey ${first}, Ivan from Flowstate. Tried calling about the AI Makeover. Here's the link to grab a time that suits: flowstate.net.nz/ai-makeover. Or just reply with a good time to call."`,
    '',
    'Until you reach them: call twice a day days 1-3, then once a day until day 7.',
  ].join('\n');
}

async function sendAlert(text) {
  const {TELEGRAM_BOT_TOKEN: bot, TELEGRAM_CHAT_ID: chat} = process.env;
  if (!bot || !chat) throw new Error('Telegram not configured');
  const res = await fetch(`https://api.telegram.org/bot${bot}/sendMessage`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({chat_id: chat, text: text.slice(0, 4000), disable_web_page_preview: true}),
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok || !out.ok) throw new Error(`Telegram ${res.status} ${out.description || ''}`);
}

export default async (req) => {
  let payload;
  try { ({payload} = await req.json()); } catch { return new Response('bad json', {status: 400}); }
  const data = payload?.data || {};
  const formName = payload?.form_name || data['form-name'];
  if (formName !== FORM) return new Response('ignored', {status: 200});

  const lead = {email: clean(data.email), name: clean(data.name), phone: clean(data.phone)};
  await Promise.all([
    safely('kit lead', () => addToKit({...lead, tagId: process.env.KIT_TAG_MAKEOVER_LEAD})),
    safely('notion lead', () => crmLead({...lead, source: 'form'})),
  ]);

  try {
    await sendAlert(makeoverMessage(data));
    return new Response('sent', {status: 200});
  } catch (err) {
    console.error('submission-created alert failed:', err.message);
    return new Response('alert failed', {status: 502});
  }
};
