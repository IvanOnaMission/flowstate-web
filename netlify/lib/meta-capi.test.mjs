import {test, afterEach} from 'node:test';
import assert from 'node:assert/strict';
import {dialable} from './telegram.mjs';
import {
  hashEmail, hashPhone, normalizePhone, acceptedMatch, isInternalLead, crmEventId,
  buildCrmEvent, stringifyCrmPayload, sendCrmEvent, funnelEventNames, syncCrmStageEvents,
} from './meta-capi.mjs';

const originalFetch = globalThis.fetch;
const originalLog = console.log;
afterEach(() => { globalThis.fetch = originalFetch; console.log = originalLog; });

const EMAIL_HASH = '8c87b489ce35cf2e2f39f80e282cb2e804932a56a213983eeeb428407d43b52d';
const PHONE_HASH = '2a426081f65232c5bca80d66ab440dc2e37a0e6b9d3a7781175ead23e0711c8c';
const FBCLID = 'AbCdEfGhIjKlMnOpQrStUvWxYz1234567890';
const FBC = `fb.1.1554763741205.${FBCLID}`;

function memoryStore() {
  const rows = new Map();
  return {
    rows,
    async get(key) { return rows.has(key) ? structuredClone(rows.get(key)) : null; },
    async setJSON(key, value) { rows.set(key, structuredClone(value)); },
  };
}

test('email and phone are normalised before SHA-256, including NZ local numbers', () => {
  assert.equal(hashEmail('  JANE@Example.com '), EMAIL_HASH);
  assert.equal(hashEmail('not-an-email'), '');
  for (const raw of ['021 123 4567', '+64 21 123 4567', '0064 21 123 4567']) {
    assert.equal(normalizePhone(raw), dialable(raw).replace(/^\+/, ''));
  }
  assert.equal(normalizePhone('+61 400 000 000'), dialable('+61 400 000 000').replace(/^\+/, ''));
  assert.equal(normalizePhone('not given'), '');
  assert.equal(hashPhone('021 123 4567'), PHONE_HASH);
  assert.equal(hashPhone('+64 21 123 4567'), PHONE_HASH);
});

test('click ids and lead ids are kept only when they match Meta’s format', () => {
  const when = Date.parse('2026-11-02T00:00:00.000Z');
  assert.deepEqual(acceptedMatch({fbclid: FBCLID, fbp: 'fb.1.1596403881668.1116446470'}, when), {
    fbclid: FBCLID, fbc: `fb.1.${when}.${FBCLID}`, fbp: 'fb.1.1596403881668.1116446470',
  });
  assert.equal(acceptedMatch({fbc: FBC, fbclid: FBCLID}, when).fbc, FBC);
  assert.deepEqual(acceptedMatch({fbclid: 'nope', meta_lead_id: '1234', fbc: 'click'}), {});
  assert.equal(acceptedMatch({metaLeadId: '12345678901234567'}).meta_lead_id, '12345678901234567');
});

test('internal and synthetic leads are recognised and real addresses are not', () => {
  assert.equal(isInternalLead({name: '[TEST] Audit', email: 'audit@example.invalid'}), true);
  assert.equal(isInternalLead({email: 'ivan@flowstate.net.nz'}), true);
  assert.equal(isInternalLead({email: 'person@example.invalid'}), true);
  assert.equal(isInternalLead({sourceRecordKind: 'TEST', email: 'person@example.test'}), true);
  assert.equal(isInternalLead({name: '[TEST] Someone', email: 'person@example.test'}), true);
  assert.equal(isInternalLead({email: 'jane@example.test', name: 'Jane'}), false);
});

test('the CRM payload has the required fields, hashed contact data, and a stable event id', () => {
  const now = Date.parse('2026-11-02T00:00:00.000Z');
  const built = buildCrmEvent({
    eventName: 'Lead', eventTime: '2026-11-01T00:00:00.000Z', email: 'Jane@Example.com',
    phone: '021 123 4567', leadId: '12345678901234567', fbc: FBC, fbp: 'fb.1.1596403881668.1116446470',
  }, {now, leadEventSource: 'Twenty'});
  assert.equal(built.ok, true);
  assert.equal(built.event.action_source, 'system_generated');
  assert.equal(built.event.event_name, 'Lead');
  assert.equal(built.event.event_time, Math.floor(Date.parse('2026-11-01T00:00:00.000Z') / 1000));
  assert.deepEqual(built.event.custom_data, {event_source: 'crm', lead_event_source: 'Twenty'});
  assert.deepEqual(built.event.user_data.em, [EMAIL_HASH]);
  assert.deepEqual(built.event.user_data.ph, [PHONE_HASH]);
  assert.equal(built.event.user_data.fbc, FBC);
  assert.equal(built.event.user_data.lead_id, '12345678901234567');
  const again = buildCrmEvent({eventName: 'Lead', email: 'jane@example.com', eventTime: '2026-11-01T00:00:00.000Z'}, {now});
  assert.equal(again.eventId, built.eventId);
  assert.equal(crmEventId('Booked', {email: 'jane@example.com'}), crmEventId('Booked', {email: ' JANE@example.com '}));
  assert.notEqual(crmEventId('Booked', {email: 'jane@example.com'}), built.eventId);
  const body = stringifyCrmPayload({data: [built.event]});
  assert.match(body, /"lead_id":12345678901234567\b/);
  assert.match(body, /"action_source":"system_generated"/);
  assert.doesNotMatch(body, /jane@example\.com/i);
  assert.doesNotMatch(body, /021/);
  assert.equal(buildCrmEvent({eventName: 'Lead', eventTime: '2026-10-01T00:00:00.000Z', email: 'jane@example.com'}, {now}).reason, 'stale');
  assert.equal(buildCrmEvent({eventName: 'Lead', email: 'ivan@flowstate.net.nz'}, {now}).reason, 'test');
  assert.equal(buildCrmEvent({eventName: 'Lead'}, {now}).reason, 'unmatchable');
  assert.equal(buildCrmEvent({eventName: 'Schedule', email: 'jane@example.com'}, {now}).reason, 'name');
  const custom = buildCrmEvent({eventName: 'FS_Attended', email: 'jane@example.com', eventTime: '2026-11-01T00:00:00.000Z'}, {now});
  assert.equal(custom.event.event_name, 'FS_Attended');
  assert.notEqual(crmEventId('FS_Booked', {email: 'jane@example.com'}), crmEventId('Booked', {email: 'jane@example.com'}));
});

test('a missing token does not call Meta, and a live post keeps the token out of the URL and the error', async () => {
  let called = false;
  const quiet = await sendCrmEvent(
    {eventName: 'Lead', email: 'jane@example.com', eventTime: '2026-11-01T00:00:00.000Z'},
    {env: {}, fetchImpl: () => { called = true; }, now: Date.parse('2026-11-02T00:00:00.000Z')},
  );
  assert.deepEqual(quiet, {sent: false, reason: 'unconfigured'});
  assert.equal(called, false);
  const logs = [];
  console.log = (...parts) => logs.push(parts.join(' '));
  let seen;
  const env = {META_CAPI_TOKEN: 'secret-token-xyz', META_CAPI_DATASET_ID: '3159317364459626', META_CAPI_TEST_EVENT_CODE: 'TEST12345'};
  const now = Date.parse('2026-11-02T00:00:00.000Z');
  const sent = await sendCrmEvent({
    eventName: 'Attended', eventTime: '2026-11-02T00:00:00.000Z', email: 'private.person@example.test', phone: '021 123 4567', fbc: FBC,
  }, {env, now, fetchImpl: async (url, options) => {
    seen = {url, options};
    return Response.json({events_received: 1});
  }});
  assert.equal(sent.sent, true);
  assert.equal(seen.url, 'https://graph.facebook.com/v26.0/3159317364459626/events');
  assert.equal(seen.options.headers.authorization, 'Bearer secret-token-xyz');
  assert.equal(seen.url.includes('access_token'), false);
  assert.match(seen.options.body, /"event_name":"Attended"/);
  assert.match(seen.options.body, /"test_event_code":"TEST12345"/);
  assert.match(seen.options.body, new RegExp(hashEmail('private.person@example.test')));
  assert.match(seen.options.body, new RegExp(PHONE_HASH));
  assert.doesNotMatch(seen.options.body, /private\.person@example\.test/);
  assert.doesNotMatch(seen.options.body, /secret-token-xyz/);
  assert.equal(logs.some(line => line.includes('secret-token-xyz') || line.includes('private.person')), false);
  await assert.rejects(sendCrmEvent({
    eventName: 'Won', eventTime: '2026-11-02T00:00:00.000Z', email: 'private.person@example.test',
  }, {env, now, fetchImpl: async () => Response.json({error: {code: 100, message: 'private.person@example.test secret-token-xyz'}}, {status: 400})}), /Meta CRM event failed \(100\)/);
});

test('funnel names follow the booked, attended and won stages without inferring attendance from a sale', () => {
  assert.deepEqual(funnelEventNames({stage: 'NEW'}), ['Lead']);
  assert.deepEqual(funnelEventNames({stage: 'SCREENING'}), ['Lead', 'Booked']);
  assert.deepEqual(funnelEventNames({stage: 'MEETING'}), ['Lead', 'Booked', 'Attended']);
  assert.deepEqual(funnelEventNames({stage: 'PROPOSAL'}), ['Lead', 'Booked']);
  assert.deepEqual(funnelEventNames({stage: 'CUSTOMER'}), ['Lead', 'Booked', 'Won']);
  assert.deepEqual(funnelEventNames({stage: 'MAINTENANCE'}), ['Lead', 'Booked', 'Won']);
  assert.deepEqual(funnelEventNames({stage: 'SCREENING', callOutcome: 'ATTENDED'}), ['Lead', 'Booked', 'Attended']);
  assert.deepEqual(funnelEventNames({stage: 'SCREENING', saleOutcome: 'WON'}), ['Lead', 'Booked', 'Won']);
  assert.deepEqual(funnelEventNames({stage: 'LOST'}), []);
  assert.deepEqual(funnelEventNames({stage: 'PROPOSAL'}, {META_CAPI_ATTENDED_STAGES: 'PROPOSAL'}), ['Lead', 'Booked', 'Attended']);
});

test('the stage sync sends each custom stage once and never as Lead or Schedule', async () => {
  const now = Date.parse('2026-11-02T00:00:00.000Z');
  const env = {META_CAPI_TOKEN: 'secret-token-xyz', META_CAPI_DATASET_ID: '3159317364459626'};
  const store = memoryStore();
  const sent = [];
  const send = async input => {
    if (input.eventName === 'Lead' || input.eventName === 'Schedule') throw new Error(`stage sync sent ${input.eventName}`);
    const built = buildCrmEvent(input, {now});
    assert.equal(built.ok, true);
    assert.equal(built.event.event_name, input.eventName);
    sent.push(input.eventName + ':' + input.email);
    return {sent: true, reason: 'sent'};
  };
  const opportunities = [
    {id: 'old', emailLookup: 'old@example.test', name: 'Old', stage: 'SCREENING', sourcePhone: '021 123 4567', sourceRecordKind: 'CONTACT', createdAt: '2026-08-01T00:00:00.000Z', updatedAt: '2026-08-01T00:00:00.000Z'},
    {id: 'fresh', emailLookup: 'fresh@example.test', name: 'Fresh', stage: 'NEW', sourceRecordKind: 'CONTACT', createdAt: '2026-11-01T00:00:00.000Z', updatedAt: '2026-11-01T00:00:00.000Z'},
    {id: 'booked', emailLookup: 'booked@example.test', name: 'Booked', stage: 'SCREENING', sourceRecordKind: 'CONTACT', createdAt: '2026-11-01T00:00:00.000Z', updatedAt: '2026-11-01T00:00:00.000Z'},
    {id: 'staff', emailLookup: 'ivan@flowstate.net.nz', name: 'Ivan', stage: 'NEW', sourceRecordKind: 'CONTACT', createdAt: '2026-11-01T00:00:00.000Z', updatedAt: '2026-11-01T00:00:00.000Z'},
    {id: 'copy', emailLookup: 'old@example.test', name: 'Copy', stage: 'SCREENING', sourceRecordKind: 'DUPLICATE', createdAt: '2026-11-01T00:00:00.000Z', updatedAt: '2026-11-01T00:00:00.000Z'},
  ];
  const listOpportunities = async () => structuredClone(opportunities);
  const first = await syncCrmStageEvents({env, now, store, send, listOpportunities, resolveMatch: async () => ({})});
  assert.equal(first.baselined, 4);
  assert.deepEqual(sent, ['FS_Booked:booked@example.test']);
  sent.length = 0;
  opportunities[0].stage = 'MEETING';
  opportunities[0].updatedAt = '2026-11-02T00:00:00.000Z';
  opportunities.push({id: 'after', emailLookup: 'after@example.test', name: 'After', stage: 'SCREENING', sourceRecordKind: 'CONTACT', createdAt: '2026-11-02T00:00:00.000Z', updatedAt: '2026-11-02T00:00:00.000Z'});
  const second = await syncCrmStageEvents({env, now, store, send, listOpportunities, resolveMatch: async () => ({meta_lead_id: '123456789012345'})});
  assert.equal(second.sent, 2);
  assert.deepEqual(sent, ['FS_Attended:old@example.test', 'FS_Booked:after@example.test']);
  sent.length = 0;
  await syncCrmStageEvents({env, now, store, send, listOpportunities, resolveMatch: async () => ({})});
  assert.deepEqual(sent, []);
  opportunities.find(op => op.id === 'after').emailLookup = 'after-renamed@example.test';
  for (const key of [...store.rows.keys()]) if (key.startsWith('snap:')) store.rows.delete(key);
  await syncCrmStageEvents({env, now, store, send, listOpportunities, resolveMatch: async () => ({})});
  assert.deepEqual(sent, []);
  opportunities.find(op => op.id === 'after').stage = 'CUSTOMER';
  const won = await syncCrmStageEvents({env, now, store, send, listOpportunities, resolveMatch: async () => ({})});
  assert.equal(won.sent, 1);
  assert.deepEqual(sent, ['FS_Won:after-renamed@example.test']);
  const idle = await syncCrmStageEvents({env: {}, store, listOpportunities: async () => { throw new Error('should not list'); }});
  assert.deepEqual(idle, {configured: false, sent: 0, failed: 0, baselined: 0});
});
