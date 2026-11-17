// Puts leads into Kit and the selected CRM. CRM_BACKEND=twenty routes leads,
// bookings and quiz notes to TWENTY_API_URL using the server-only TWENTY_API_KEY.
// The Notion path remains available for rollback while its source records are retained.
// Each step is optional and independent: a missing key or a failed call is logged and skipped,
// so a lead alert to Ivan is never blocked by the CRM.
// Env: KIT_API_KEY, KIT_TAG_MAKEOVER_LEAD, KIT_TAG_MAKEOVER_BOOKED, NOTION_TOKEN, NOTION_CRM_DATABASE_ID
const today = () => new Date().toLocaleDateString('en-CA', {timeZone: 'Pacific/Auckland'});
import {CUSTOMER_LABELS,customerType as normaliseCustomerType} from './ads-tracking.mjs';
import {twentyLead,twentyBooked,twentyQuiz} from './twenty-crm.mjs';

async function kit(path, body) {
  const res = await fetch(`https://api.kit.com/v4${path}`, {
    method: 'POST',
    headers: {'content-type': 'application/json', 'x-kit-api-key': process.env.KIT_API_KEY},
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Kit ${path} ${res.status} ${(await res.text()).slice(0, 200)}`);
}

export async function addToKit({email, name, phone, tagId, tagIds = [], sequenceIds = []}) {
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
  // A sequence starts sending its first email as soon as they're added.
  for (const id of new Set(sequenceIds.filter(Boolean))) {
    await kit(`/sequences/${id}/subscribers`, {email_address: email});
  }
}

async function notion(path, method, body) {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method,
    headers: {
      authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      'notion-version': '2022-06-28',
      'content-type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Notion ${path} ${res.status} ${out.message || ''}`);
  return out;
}

async function findByEmail(email) {
  const db = process.env.NOTION_CRM_DATABASE_ID;
  const out = await notion(`/databases/${db}/query`, 'POST', {filter: {property: 'Email', email: {equals: email}}, page_size: 1});
  return out.results?.[0] || null;
}

const text = value => ({rich_text: [{text: {content: String(value).slice(0, 1900)}}]});
const date = start => ({date: {start}});

// A form lead: create the CRM row, or refresh it if they've been here before.
export async function crmLead({email, name, phone, source, customerType, adId, fbclid, fbc, fbp, metaLeadId}) {
  if(process.env.CRM_BACKEND==='twenty')return twentyLead({email,name,phone,source,customerType,adId,fbclid,fbc,fbp,metaLeadId});
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_CRM_DATABASE_ID || !email) return;
  const props = {
    'Next action': text('Call within 5 minutes'),
    'Next action date': date(today()),
    'Last touch': date(today()),
  };
  const kind=normaliseCustomerType(customerType);
  if(kind!=='unknown')props['Customer type']={select:{name:CUSTOMER_LABELS[kind]}};
  if(/^\d{8,30}$/.test(adId||''))props['Source ad ID']=text(adId);
  const existing = await findByEmail(email);
  if (existing) return notion(`/pages/${existing.id}`, 'PATCH', {properties: props});
  return notion('/pages', 'POST', {
    parent: {database_id: process.env.NOTION_CRM_DATABASE_ID},
    properties: {
      Name: {title: [{text: {content: name || email}}]},
      Email: {email},
      Phone: {phone_number: phone || null},
      Stage: {select: {name: 'Lead'}},
      Type: {select: {name: 'Warm'}},
      ...(kind==='electrical_owner'?{Trade:text('Electrical')}:{}),
      'Plan / value': text('Workflow diagnostic → AI partnership (scope and rate agreed after diagnostic)'),
      'Wiki / notes': text(`Came in through the workflow diagnostic page${source ? ` (${source})` : ''}.`),
      ...props,
    },
  });
}

// A booked discovery call: move the row to Discovery with the call time.
export async function crmBooked({email, name, phone, start}) {
  if(process.env.CRM_BACKEND==='twenty')return twentyBooked({email,name,phone,start});
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_CRM_DATABASE_ID || !email) return;
  const props = {
    Stage: {select: {name: 'Discovery'}},
    'Next action': text('Discovery call'),
    'Next action date': date(start || today()),
    'Last touch': date(today()),
  };
  const existing = await findByEmail(email);
  if (existing) return notion(`/pages/${existing.id}`, 'PATCH', {properties: props});
  return notion('/pages', 'POST', {
    parent: {database_id: process.env.NOTION_CRM_DATABASE_ID},
    properties: {
      Name: {title: [{text: {content: name || email}}]},
      Email: {email},
      Phone: {phone_number: phone || null},
      Type: {select: {name: 'Warm'}},
      'Plan / value': text('Workflow diagnostic → AI partnership (scope and rate agreed after diagnostic)'),
      ...props,
    },
  });
}

// Append preparation notes without changing the booking stage, next action or
// existing notes. The verified Calendly email may differ from the lead form email.
export async function crmQuiz({email, uri, answers, submissionId}) {
  if(process.env.CRM_BACKEND==='twenty')return twentyQuiz({email,uri,answers,submissionId});
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_CRM_DATABASE_ID || !email) return false;
  const existing = await findByEmail(email);
  if (!existing) return false; // The original answers remain in Netlify Forms.
  const marker = `Business quiz submission: ${submissionId || uri}`;
  let cursor;
  do {
    const page = await notion(`/blocks/${existing.id}/children?page_size=100${cursor ? `&start_cursor=${encodeURIComponent(cursor)}` : ''}`, 'GET');
    if (page.results?.some(block => block.paragraph?.rich_text?.some(part => part.plain_text === marker || part.text?.content === marker))) return true;
    cursor = page.has_more ? page.next_cursor : null;
  } while (cursor);
  const paragraph = content => ({object: 'block', type: 'paragraph', paragraph: text(content)});
  await notion(`/blocks/${existing.id}/children`, 'PATCH', {children: [
    {object: 'block', type: 'heading_2', heading_2: text('Pre-call business quiz')},
    paragraph(marker),
    paragraph(`Booking: ${uri || 'Not booked yet'}`),
    ...answers.map(({question, answer}) => paragraph(`${question}: ${answer}`)),
  ]});
  return true;
}

export async function safely(label, fn) {
  try { await fn(); } catch (err) { console.error(`${label} failed:`, err.message); }
}
