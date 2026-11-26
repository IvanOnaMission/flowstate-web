// Privacy Act: lead details are kept here only while they are being delivered. The CRM is the
// record. After RETAIN_MS a Meta lead keeps only its id and which steps ran (so a Meta retry
// can't alert twice); finished Messenger conversations and handled queue items are deleted.
// Run hourly from audit-lead-sync.mjs.
import {createHash} from 'node:crypto';

export const RETAIN_MS = 30 * 86400000;
const QUEUE_MS = 86400000;
const age = (iso, now) => now - (typeof iso === 'number' ? iso : Date.parse(iso || ''));

async function* keys(store, prefix) {
  for await (const {blobs} of store.list({...(prefix ? {prefix} : {}), paginate: true})) for (const {key} of blobs) yield key;
}

export async function purgeOldLeads({leads, chat, queue, now = Date.now()}) {
  let stripped = 0, deleted = 0;
  if (leads) for await (const key of keys(leads)) {
    const state = await leads.get(key, {type: 'json'});
    if (!state?.lead || !(age(state.lead.at, now) > RETAIN_MS)) continue;
    await leads.setJSON(key, {done: state.done || {}, purgedAt: new Date(now).toISOString()});
    stripped++;
  }
  if (chat) {
    for await (const key of keys(chat, 'lead:')) {
      if (key.startsWith('lead:web:')) continue; // web-audit.mjs handles its own.
      const state = await chat.get(key, {type: 'json'});
      if (!state || state.crmDirty || state.notifiedRevision !== state.revision || !(age(state.lastActivity ?? state.startedAt, now) > RETAIN_MS)) continue;
      const pointerKey = createHash('sha256').update(String(state.lead?.email || '').trim().toLowerCase()).digest('hex');
      const pointer = await chat.get('email:' + pointerKey, {type: 'json'});
      if (pointer?.id === state.lead?.id) await chat.delete('email:' + pointerKey);
      await chat.delete(key); await chat.delete('lock:' + key);
      deleted++;
    }
    for await (const key of keys(chat, 'sender:')) {
      const sender = await chat.get(key, {type: 'json'});
      if (sender && age(sender.startedAt, now) > RETAIN_MS) { await chat.delete(key); deleted++; }
    }
  }
  if (queue) for await (const key of keys(queue)) {
    const item = await queue.get(key, {type: 'json'});
    if (item?.status === 'done' && age(item.receivedAt, now) > QUEUE_MS) { await queue.delete(key); deleted++; }
  }
  return {stripped, deleted};
}
