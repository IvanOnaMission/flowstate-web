// Puts AI Makeover leads into Kit (email list) and the Notion CRM.
// Each step is optional and independent: a missing key or a failed call is logged and skipped,
// so a lead alert to Ivan is never blocked by the CRM.
// Env: KIT_API_KEY, KIT_TAG_MAKEOVER_LEAD, KIT_TAG_MAKEOVER_BOOKED, NOTION_TOKEN, NOTION_CRM_DATABASE_ID
const today = () => new Date().toLocaleDateString('en-CA', {timeZone: 'Pacific/Auckland'});

async function kit(path, body) {
  const res = await fetch(`https://api.kit.com/v4${path}`, {
    method: 'POST',
    headers: {'content-type': 'application/json', 'x-kit-api-key': process.env.KIT_API_KEY},
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Kit ${path} ${res.status} ${(await res.text()).slice(0, 200)}`);
}

export async function addToKit({email, name, phone, tagId}) {
  if (!process.env.KIT_API_KEY || !email) return;
  const first = String(name || '').trim().split(/\s+/)[0] || undefined;
  try {
    await kit('/subscribers', {email_address: email, first_name: first, fields: {phone: phone || '', full_name: name || ''}});
  } catch (err) {
    // Custom fields may not exist in the account: retry with the basics.
    console.error('kit subscriber with fields failed, retrying:', err.message);
    await kit('/subscribers', {email_address: email, first_name: first});
  }
  if (tagId) await kit(`/tags/${tagId}/subscribers`, {email_address: email});
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
export async function crmLead({email, name, phone, source}) {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_CRM_DATABASE_ID || !email) return;
  const props = {
    'Next action': text('Call within 5 minutes'),
    'Next action date': date(today()),
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
      Stage: {select: {name: 'Lead'}},
      Type: {select: {name: 'Warm'}},
      Trade: text('Electrical'),
      'Plan / value': text('2-Day AI Makeover'),
      'Wiki / notes': text(`Came in through the AI Makeover page${source ? ` (${source})` : ''}.`),
      ...props,
    },
  });
}

// A booked discovery call: move the row to Discovery with the call time.
export async function crmBooked({email, name, phone, start}) {
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
      Trade: text('Electrical'),
      'Plan / value': text('2-Day AI Makeover'),
      ...props,
    },
  });
}

export async function safely(label, fn) {
  try { await fn(); } catch (err) { console.error(`${label} failed:`, err.message); }
}
