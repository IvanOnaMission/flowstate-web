import {test} from 'node:test';
import assert from 'node:assert/strict';
import {contactCard, dialable} from './telegram.mjs';
import {dueLeads, holdLead, leadKey, releaseLead} from './pending.mjs';
import {bookedMessage, formLeadMessage, quietCalendlyEvent} from './messages.mjs';
import {aboutLead, pageSummary, workDomain} from './about.mjs';

function fakeStore() {
  const map = new Map();
  return {
    map,
    async setJSON(k, v) { map.set(k, JSON.stringify(v)); },
    async get(k) { return map.has(k) ? JSON.parse(map.get(k)) : null; },
    async delete(k) { map.delete(k); },
    async list() { return {blobs: [...map.keys()].map(key => ({key}))}; },
  };
}

test('dialable turns NZ local numbers into international ones', () => {
  assert.equal(dialable('021 123 4567'), '+64211234567');
  assert.equal(dialable('+61 400 000 000'), '+61400000000');
  assert.equal(dialable('0064 21 123 4567'), '+64211234567');
  assert.equal(dialable('not given'), '');
});

test('contact card carries the name, the lead label and the number', () => {
  const card = contactCard({name: 'Jane Smith', phone: '021 123 4567', email: 'jane@example.com'});
  assert.equal(card.first_name, 'Jane');
  assert.equal(card.last_name, 'Smith (AI Makeover lead)');
  assert.equal(card.phone_number, '+64211234567');
  assert.match(card.vcard, /FN:Jane Smith/);
  assert.match(card.vcard, /TEL;TYPE=CELL:\+64211234567/);
  assert.match(card.vcard, /EMAIL:jane@example.com/);
  assert.equal(contactCard({name: 'Jane', phone: ''}), null);
});

test('leadKey prefers email, falls back to phone', () => {
  assert.equal(leadKey({email: ' Jane@Example.com '}), 'jane@example.com');
  assert.equal(leadKey({email: '', phone: '021 123 4567'}), 'phone:0211234567');
  assert.equal(leadKey({}), '');
});

test('a booking within the window cancels the waiting form alert', async () => {
  const s = fakeStore();
  await holdLead({name: 'Jane', email: 'jane@example.com', phone: '021'}, s);
  assert.equal(await releaseLead({email: 'JANE@example.com'}, s), true);
  assert.equal(await releaseLead({email: 'jane@example.com'}, s), false);
  assert.equal(s.map.size, 0);
});

test('only leads older than the delay are due, oldest first', async () => {
  const s = fakeStore();
  const now = 1_000_000;
  await s.setJSON('old@x.nz', {email: 'old@x.nz', heldAt: now - 200_000});
  await s.setJSON('older@x.nz', {email: 'older@x.nz', heldAt: now - 300_000});
  await s.setJSON('fresh@x.nz', {email: 'fresh@x.nz', heldAt: now - 30_000});
  const due = await dueLeads(120_000, s, now);
  assert.deepEqual(due.map(d => d.key), ['older@x.nz', 'old@x.nz']);
});

test('form message names the lead, with no script', () => {
  const text = formLeadMessage({name: 'Jane Smith', phone: '021', email: 'jane@example.com'}, ['Website: sparky.co.nz']);
  assert.match(text, /^New AI Makeover lead \(form, not booked yet\)\nJane Smith\nPhone: 021\njane@example.com/);
  assert.match(text, /Extra details: none yet/);
  assert.match(text, /ABOUT THEM\nWebsite: sparky.co.nz/);
  assert.doesNotMatch(text, /SCRIPT|Call them now/);
});

test('booked message says whether the extra details were filled in', () => {
  const base = {name: 'Jane Smith', phone: '021', email: 'jane@example.com', when: 'Wed 1 Oct, 10:00 am'};
  const filled = bookedMessage({...base, answers: [{question: 'What will help prepare?', answer: 'Quotes take me 3 hours'}]});
  assert.match(filled, /Extra details: FILLED IN\nWhat will help prepare\?\n"Quotes take me 3 hours"/);
  const blank = bookedMessage({...base, answers: [{question: 'What will help prepare?', answer: '  '}]});
  assert.match(blank, /Extra details: left blank/);
  assert.doesNotMatch(blank, /SCRIPT|REMINDER|Call them now/);
});

test('only work email domains get a website lookup', () => {
  assert.equal(workDomain('jane@sparky.co.nz'), 'sparky.co.nz');
  assert.equal(workDomain('jane@gmail.com'), '');
  assert.equal(workDomain('jane@xtra.co.nz'), '');
  assert.equal(workDomain('jane@127.0.0.1'), '');
  assert.equal(workDomain('nonsense'), '');
});

test('page summary pulls the title and description', () => {
  const html = '<title>Sparky &amp; Co | Electricians</title><meta name="description" content="Residential electrical in Tauranga.">';
  assert.deepEqual(pageSummary(html), {title: 'Sparky & Co | Electricians', description: 'Residential electrical in Tauranga.'});
});

test("reschedules and Ivan's own cancellations send no alert", () => {
  const uri = 'https://api.calendly.com/scheduled_events/x/invitees/y';
  assert.equal(quietCalendlyEvent({event: 'invitee.created', payload: {old_invitee: null}}), '');
  assert.equal(quietCalendlyEvent({event: 'invitee.created', payload: {old_invitee: uri}}), 'rescheduled');
  assert.equal(quietCalendlyEvent({event: 'invitee.canceled', payload: {rescheduled: true, new_invitee: uri}}), 'rescheduled');
  assert.equal(quietCalendlyEvent({event: 'invitee.canceled', payload: {rescheduled: false, cancellation: {canceler_type: 'host'}}}), 'cancelled by Ivan');
  assert.equal(quietCalendlyEvent({event: 'invitee.canceled', payload: {rescheduled: false, cancellation: {canceler_type: 'invitee'}}}), '');
});

test('Quote Machine leads name the offer and source ad in both alerts', async () => {
  const {takeLead} = await import('./pending.mjs');
  const {sourceLine} = await import('./quote-machine.mjs');
  const s = fakeStore();
  const source = sourceLine({ad_id: '1234567890', utm_source: 'facebook', utm_campaign: 'quote-machine'});
  await holdLead({name: 'Jane', email: 'jane@example.com', phone: '021', offer: 'Quote Machine', source}, s);
  const text = formLeadMessage((await dueLeads(0, s))[0].lead);
  assert.match(text, /^New Quote Machine lead \(form, not booked yet\)/);
  assert.match(text, /Came from: ad 1234567890 · facebook \/ quote-machine/);
  const booked = bookedMessage({name: 'Jane', phone: '021', email: 'jane@example.com', when: 'Wed', held: await takeLead({email: 'jane@example.com'}, s)});
  assert.match(booked, /^New Quote Machine call booked/);
  assert.match(booked, /Came from: ad 1234567890/);
  assert.equal(s.map.size, 0);
});

test('Kit keeps the existing lead tag while adding the separate booking-reminder tag once', async () => {
  const {addToKit} = await import('./crm.mjs');
  const oldFetch = globalThis.fetch, oldKey = process.env.KIT_API_KEY;
  const calls = [];
  process.env.KIT_API_KEY = 'test-only';
  globalThis.fetch = async (url, options) => {
    calls.push({url, body: JSON.parse(options.body)});
    return Response.json({});
  };
  try {
    await addToKit({email: 'jane@example.test', name: 'Jane Smith', phone: '021 123 4567', tagId: 'existing-lead', tagIds: ['reminder', 'existing-lead', undefined]});
    assert.deepEqual(calls.map(call => call.url), [
      'https://api.kit.com/v4/subscribers',
      'https://api.kit.com/v4/tags/existing-lead/subscribers',
      'https://api.kit.com/v4/tags/reminder/subscribers',
    ]);
    assert.equal(calls[0].body.first_name, 'Jane');
    assert.equal(calls[1].body.email_address, 'jane@example.test');
  } finally {
    globalThis.fetch = oldFetch;
    if (oldKey === undefined) delete process.env.KIT_API_KEY; else process.env.KIT_API_KEY = oldKey;
  }
});

test('a second form with the same email does not replace the lead already waiting', async () => {
  const s = fakeStore();
  await holdLead({name: 'Jane', email: 'jane@example.com', phone: '021'}, s);
  await holdLead({name: 'Someone else', email: 'JANE@example.com', phone: '029', offer: 'Quote Machine'}, s);
  const [{lead}] = await dueLeads(0, s);
  assert.equal(lead.name, 'Jane'); assert.equal(lead.phone, '021'); assert.equal(lead.offer, 'Quote Machine');
});

test('the website check refuses redirects to internal or plain-http addresses and caps what it reads', async () => {
  const original = globalThis.fetch, seen = [];
  const page = (status, headers, body = '') => new Response(body, {status, headers});
  try {
    for (const location of ['http://acme.co.nz/', 'https://169.254.169.254/latest', 'https://localhost/', 'https://acme.co.nz:8443/']) {
      globalThis.fetch = async (u, opts) => { seen.push(String(u)); assert.equal(opts.redirect, 'manual'); return page(301, {location}); };
      const lines = await aboutLead({email: 'a@acme.co.nz'});
      assert.match(lines[0], /couldn't read the website/);
    }
    assert.ok(seen.every(u => u === 'https://acme.co.nz/'));
    globalThis.fetch = async () => page(200, {'content-type': 'text/html'}, '<title>Acme</title>' + 'x'.repeat(500_000));
    assert.deepEqual((await aboutLead({email: 'a@acme.co.nz'})).slice(0, 2), ['Website: acme.co.nz', 'Acme']);
  } finally { globalThis.fetch = original; }
});
