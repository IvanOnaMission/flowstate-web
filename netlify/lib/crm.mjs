// Puts leads into Kit and the Twenty CRM (TWENTY_API_URL, server-only TWENTY_API_KEY).
// Twenty is the only CRM: the Notion CRM was retired on 31 October 2026.
// Each step is optional and independent: a missing key or a failed call is logged and skipped,
// so a lead alert to Ivan is never blocked by the CRM.
// Env: KIT_API_KEY, KIT_TAG_MAKEOVER_LEAD, KIT_TAG_MAKEOVER_BOOKED, TWENTY_API_URL, TWENTY_API_KEY
import {twentyLead,twentyBooked,twentyQuiz} from './twenty-crm.mjs';

async function kit(path, body) {
  const res = await fetch(`https://api.kit.com/v4${path}`, {
    method: 'POST',
    headers: {'content-type': 'application/json', 'x-kit-api-key': process.env.KIT_API_KEY},
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Kit ${path} ${res.status} ${(await res.text()).slice(0, 200)}`);
}

export async function addToKit({email, name, phone, tagId, tagIds = []}) {
  if (!process.env.KIT_API_KEY || !email) return;
  const first = String(name || '').trim().split(/\s+/)[0] || undefined;
  try {
    await kit('/subscribers', {email_address: email, first_name: first, fields: {phone: phone || '', full_name: name || ''}});
  } catch (err) {
    // Custom fields may not exist in the account: retry with the basics.
    console.error('kit subscriber with fields failed, retrying:', err.message);
    await kit('/subscribers', {email_address: email, first_name: first});
  }
  for (const id of new Set([tagId, ...tagIds].filter(Boolean))) {
    await kit(`/tags/${id}/subscribers`, {email_address: email});
  }
}

// A form lead: create the CRM opportunity, or refresh it if they've been here before.
export const crmLead = input => twentyLead(input);

// A booked discovery call: move the opportunity to screening with the call time.
export const crmBooked = input => twentyBooked(input);

// Append preparation notes without changing the booking stage, next action or
// existing notes. The verified Calendly email may differ from the lead form email.
export const crmQuiz = input => twentyQuiz(input);

export async function safely(label, fn) {
  try { await fn(); } catch (err) { console.error(`${label} failed:`, err.message); }
}
