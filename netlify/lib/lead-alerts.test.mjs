import {test} from 'node:test';
import assert from 'node:assert/strict';
import {contactCard, dialable} from './telegram.mjs';
import {dueLeads, holdLead, leadKey, releaseLead} from './pending.mjs';
import {bookedMessage, formLeadMessage, quietCalendlyEvent} from './messages.mjs';
import {pageSummary, workDomain} from './about.mjs';

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

test('Quote Machine answers ride along with the waiting alert and the booking', async () => {
  const {addToHeldLead, takeLead} = await import('./pending.mjs');
  const {quoteAnswers} = await import('./quote-machine.mjs');
  const s = fakeStore();
  await holdLead({name: 'Jane', email: 'jane@example.com', phone: '021', offer: 'Quote Machine', source: 'Came from: ad 1234567890'}, s);
  const answers = quoteAnswers({trade: 'other', work_type: 'tender_commercial', quoters: 'just_me', prices: 'made_up'});
  assert.deepEqual(answers, {trade: 'Other', work_type: 'Tender-heavy commercial', quoters: 'Just me'});
  assert.equal(await addToHeldLead({email: 'jane@example.com'}, {answers}, s), true);
  assert.equal(await addToHeldLead({email: 'nobody@example.com'}, {answers}, s), false);
  const held = (await dueLeads(0, s))[0].lead;
  const text = formLeadMessage(held);
  assert.match(text, /^New Quote Machine lead \(form, not booked yet\)/);
  assert.match(text, /QUOTE MACHINE ANSWERS\nTrade: Other\nMostly quotes: Tender-heavy commercial\nPeople quoting: Just me\nPOSSIBLE NON-FIT: trade is not electrical or plumbing; mostly tender-heavy commercial work\nCame from: ad 1234567890/);
  const booked = bookedMessage({name: 'Jane', phone: '021', email: 'jane@example.com', when: 'Wed', held: await takeLead({email: 'jane@example.com'}, s)});
  assert.match(booked, /^New Quote Machine call booked/);
  assert.match(booked, /QUOTE MACHINE ANSWERS/);
  assert.equal(s.map.size, 0);
});
