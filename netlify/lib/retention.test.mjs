import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {purgeOldLeads, RETAIN_MS} from './retention.mjs';
import {importMetaLead} from './meta-audit-leads.mjs';

function memory() {
  const map = new Map();
  return {map, async get(k) { return structuredClone(map.get(k) ?? null); }, async setJSON(k, v) { map.set(k, structuredClone(v)); return {modified: true}; },
    async delete(k) { map.delete(k); },
    list({prefix = ''} = {}) { const blobs = [...map.keys()].filter(k => k.startsWith(prefix)).map(key => ({key})); return {async *[Symbol.asyncIterator]() { yield {blobs}; }}; }};
}
const day = 86400000, now = Date.parse('2026-12-31T00:00:00Z');

test('old Meta leads keep only their delivery flags, so a retry does not alert again', async () => {
  const leads = memory();
  leads.map.set('11111111', {lead: {id: '11111111', email: 'old@x.nz', at: new Date(now - RETAIN_MS - day).toISOString()}, done: {alert: true, crm: true}});
  leads.map.set('22222222', {lead: {id: '22222222', email: 'new@x.nz', at: new Date(now - day).toISOString()}, done: {alert: true}});
  assert.deepEqual(await purgeOldLeads({leads, now}), {stripped: 1, deleted: 0});
  assert.equal(JSON.stringify(leads.map.get('11111111')).includes('old@x.nz'), false);
  assert.equal(leads.map.get('22222222').lead.email, 'new@x.nz');
  let alerts = 0;
  await importMetaLead({id: '11111111', created_time: '2026-11-01T00:00:00+0000', field_data: [{name: 'email', values: ['old@x.nz']}]}, leads, {alert: async () => { alerts++; }});
  assert.equal(alerts, 0);
});

test('finished Messenger conversations, their pointers and handled queue items are deleted; open ones stay', async () => {
  const chat = memory(), queue = memory(), old = now - RETAIN_MS - day;
  const ptr = 'email:' + createHash('sha256').update('a@x.nz').digest('hex');
  chat.map.set('lead:1', {lead: {id: '1', email: 'a@x.nz'}, startedAt: old, lastActivity: old, revision: 2, notifiedRevision: 2, crmDirty: false});
  chat.map.set(ptr, {id: '1'});
  chat.map.set('lead:2', {lead: {id: '2', email: 'b@x.nz'}, startedAt: old, lastActivity: old, revision: 2, notifiedRevision: 1, crmDirty: false});
  chat.map.set('lead:web:abc', {lead: {email: 'c@x.nz'}, lastActivity: old});
  chat.map.set('sender:9', {leadId: '1', startedAt: old});
  queue.map.set('q1', {status: 'done', receivedAt: now - 2 * day});
  queue.map.set('q2', {status: 'pending', receivedAt: now - 2 * day});
  await purgeOldLeads({chat, queue, now});
  assert.deepEqual([...chat.map.keys()].sort(), ['lead:2', 'lead:web:abc']);
  assert.deepEqual([...queue.map.keys()], ['q2']);
});
