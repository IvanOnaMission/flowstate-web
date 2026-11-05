// CRM events for Meta's Conversions API (Events Manager "Send a CRM event").
// Website forms, the audit instant form, and audit enquiries still send the standard Lead event,
// and a Calendly booking still sends Booked, with the same event ids as before.
// Admin instant forms (META_LEAD_FORM_IDS) do not send Lead from the webhook.
// The minute stage poll must not use Lead or Schedule: Meta counts those exact
// names as standard conversions, so a later stage change is sent as FS_Booked,
// FS_Attended, or FS_Won. Each of those is recorded once per opportunity.
// This module always sends action_source system_generated with custom_data.event_source crm.
// Missing META_CAPI_TOKEN or META_CAPI_DATASET_ID logs once and does nothing.
// Raw email, phone, click ids and the access token are never written to logs.
import {createHash} from 'node:crypto';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const CLICK = /^fb\.\d\.\d{10,17}\.[A-Za-z0-9_-]{5,200}$/;
const FBCLID = /^[A-Za-z0-9_-]{8,200}$/;
const LEAD_ID = /^\d{15,17}$/;
// Lead and Booked remain valid for a new submission or Calendly booking.
// Attended and Won remain accepted by the sender; the stage poll uses FS_* only.
const EVENTS = ['Lead', 'Booked', 'Attended', 'Won', 'FS_Booked', 'FS_Attended', 'FS_Won'];
const STAGE_META_EVENT = {Booked: 'FS_Booked', Attended: 'FS_Attended', Won: 'FS_Won'};
const BLOCKED_STAGE_EVENTS = new Set(['Lead', 'Schedule']);
const SENT = 'sent:';
const SNAP = 'snap:';
const STARTED = 'meta:crm-sync-started';
let loggedUnconfigured = false;

const sha256 = value => createHash('sha256').update(value).digest('hex');

export function hashEmail(email) {
  const normalised = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalised)) return '';
  return sha256(normalised);
}

// Same NZ rules as the Telegram contact card: 021… and +64… become 6421…, then SHA-256.
export function normalizePhone(phone) {
  let digits = String(phone ?? '').replace(/[^\d+]/g, '');
  if (digits.startsWith('00')) digits = `+${digits.slice(2)}`;
  if (/^0\d{7,}$/.test(digits)) digits = `+64${digits.slice(1)}`;
  if (!/^\+?\d{7,15}$/.test(digits)) return '';
  return digits.replace(/^\+/, '').replace(/^0+/, '');
}
export const hashPhone = phone => {
  const normalised = normalizePhone(phone);
  return normalised ? sha256(normalised) : '';
};

// Valid click ids only. An fbclid without an fbc becomes fb.1.<event time ms>.<fbclid>
// so a retry of the same lead stores the same value.
export function acceptedMatch(input = {}, eventTimeMs = Date.now()) {
  const lead = String(input.meta_lead_id || input.leadId || input.metaLeadId || '');
  const meta_lead_id = LEAD_ID.test(lead) ? lead : '';
  const fbclid = FBCLID.test(input.fbclid || '') ? input.fbclid : '';
  let fbc = CLICK.test(input.fbc || '') ? input.fbc : '';
  if (!fbc && fbclid) {
    const ms = Number.isFinite(Number(eventTimeMs)) ? Math.floor(Number(eventTimeMs)) : Date.now();
    fbc = `fb.1.${ms}.${fbclid}`;
  }
  const fbp = CLICK.test(input.fbp || '') ? input.fbp : '';
  const out = {};
  if (meta_lead_id) out.meta_lead_id = meta_lead_id;
  if (fbclid) out.fbclid = fbclid;
  if (fbc) out.fbc = fbc;
  if (fbp) out.fbp = fbp;
  return out;
}

export function isInternalLead({email, name, sourceRecordKind, test} = {}) {
  if (test === true) return true;
  if (String(sourceRecordKind || '').toUpperCase() === 'TEST') return true;
  const normalised = String(email || '').trim().toLowerCase();
  if (normalised.endsWith('@example.invalid') || normalised.endsWith('@flowstate.net.nz')) return true;
  if (/^\[test\]/i.test(String(name || '').trim())) return true;
  return false;
}

export function crmEventId(eventName, {email, leadId} = {}) {
  const identity = String(email || '').trim().toLowerCase() || (LEAD_ID.test(String(leadId || '')) ? String(leadId) : '');
  if (!identity || !EVENTS.includes(eventName)) return '';
  return sha256(`flowstate-crm-v1:${eventName}:${identity}`);
}

function eventTimeSeconds(value, now) {
  const parsed = Date.parse(value || '');
  const ms = Number.isFinite(parsed) ? parsed : now;
  return Math.min(Math.floor(ms / 1000), Math.floor(now / 1000));
}

function stageList(raw, fallback) {
  if (!raw) return fallback;
  const list = String(raw).split(',').map(item => item.trim().toUpperCase()).filter(Boolean);
  return list.length ? list : fallback;
}

// Wire names for the stage poll. Lead is omitted on purpose: it is a standard
// Meta event, and this poll also never emits Schedule.
function metaEventsFor(stages) {
  const names = [];
  for (const stage of stages) {
    const name = STAGE_META_EVENT[stage] || '';
    if (!name || BLOCKED_STAGE_EVENTS.has(name) || names.includes(name)) continue;
    names.push(name);
  }
  return names;
}

function stageSentKey(id, eventName) {
  return id && eventName ? `stage:${id}:${eventName}` : '';
}

async function alreadySent(store, id, eventName, eventId) {
  if (eventId && await store.get(SENT + eventId, {type: 'json'})) return true;
  const key = stageSentKey(id, eventName);
  return !!(key && await store.get(key, {type: 'json'}));
}

async function rememberSent(store, id, eventName, eventId, reason, now) {
  const record = {eventName, reason, at: new Date(now).toISOString()};
  if (eventId) await store.setJSON(SENT + eventId, record);
  const key = stageSentKey(id, eventName);
  if (key) await store.setJSON(key, record);
}

// Current funnel implied by a Twenty opportunity. Lead is every live record and
// stays internal: the stage poll does not send it to Meta. Booked is Calendly's
// SCREENING stage (and anything past it). Attended is an explicit meeting stage
// or callOutcome, never inferred from a later sale. Won follows the existing
// client rule: CUSTOMER / MAINTENANCE, or saleOutcome WON.
export function funnelEventNames(snapshot = {}, env = process.env) {
  const stage = String(snapshot.stage || '').toUpperCase();
  const call = String(snapshot.call || snapshot.callOutcome || snapshot.call_outcome || '').toUpperCase();
  const sale = String(snapshot.sale || snapshot.saleOutcome || snapshot.sale_outcome || '').toUpperCase();
  const attendedStages = stageList(env.META_CAPI_ATTENDED_STAGES, ['MEETING', 'ATTENDED']);
  const wonStages = stageList(env.META_CAPI_WON_STAGES, ['CUSTOMER', 'MAINTENANCE', 'WON']);
  const won = wonStages.includes(stage) || sale === 'WON';
  const attended = attendedStages.includes(stage) || call === 'ATTENDED';
  const lost = ['LOST', 'UNQUALIFIED'].includes(stage) || sale === 'LOST';
  if (lost && !attended && !won) return [];
  const booked = attended || won || ['SCREENING', 'PROPOSAL', ...attendedStages, ...wonStages].includes(stage);
  const names = ['Lead'];
  if (booked) names.push('Booked');
  if (attended) names.push('Attended');
  if (won) names.push('Won');
  return names;
}

export function buildCrmEvent(input, {now = Date.now(), leadEventSource = 'Twenty'} = {}) {
  if (!EVENTS.includes(input.eventName)) return {ok: false, reason: 'name'};
  if (isInternalLead(input)) return {ok: false, reason: 'test'};
  const email = String(input.email || '').trim().toLowerCase();
  const whenMs = Number.isFinite(Date.parse(input.eventTime || '')) ? Date.parse(input.eventTime) : now;
  const match = acceptedMatch({...input, meta_lead_id: input.leadId || input.meta_lead_id, fbclid: input.fbclid, fbc: input.fbc, fbp: input.fbp}, whenMs);
  const em = hashEmail(email);
  const ph = hashPhone(input.phone);
  const userData = {};
  if (match.meta_lead_id) userData.lead_id = match.meta_lead_id;
  if (em) userData.em = [em];
  if (ph) userData.ph = [ph];
  if (match.fbc) userData.fbc = match.fbc;
  if (match.fbp) userData.fbp = match.fbp;
  const eventId = input.eventId || crmEventId(input.eventName, {email, leadId: match.meta_lead_id});
  if (!eventId || !Object.keys(userData).length) return {ok: false, reason: 'unmatchable'};
  const eventTime = eventTimeSeconds(input.eventTime, now);
  if (Math.floor(now / 1000) - eventTime > WEEK_MS / 1000) return {ok: false, reason: 'stale', eventId};
  return {
    ok: true,
    eventId,
    event: {
      event_name: input.eventName,
      event_time: eventTime,
      event_id: eventId,
      action_source: 'system_generated',
      user_data: userData,
      custom_data: {event_source: 'crm', lead_event_source: leadEventSource || 'Twenty'},
    },
  };
}

// lead_id is a JSON number. 17-digit ids are larger than JS can round-trip,
// so the digits are written into the body without going through Number().
export function stringifyCrmPayload(payload) {
  const json = JSON.stringify(payload, (key, value) => (
    key === 'lead_id' && typeof value === 'string' && LEAD_ID.test(value) ? `__LEAD__${value}` : value
  ));
  return json.replace(/"__LEAD__(\d{15,17})"/g, '$1');
}

export async function sendCrmEvent(input, {fetchImpl = fetch, env = process.env, now = Date.now()} = {}) {
  const token = env.META_CAPI_TOKEN || '';
  const datasetId = env.META_CAPI_DATASET_ID || '';
  if (!token || !/^\d{8,30}$/.test(datasetId)) {
    if (!loggedUnconfigured) {
      loggedUnconfigured = true;
      console.log('meta-capi: META_CAPI_TOKEN or META_CAPI_DATASET_ID unset; CRM event not sent');
    }
    return {sent: false, reason: 'unconfigured'};
  }
  const built = buildCrmEvent(input, {now, leadEventSource: env.META_CAPI_LEAD_EVENT_SOURCE || 'Twenty'});
  if (!built.ok) return {sent: false, reason: built.reason, eventId: built.eventId};
  const payload = {data: [built.event]};
  const testCode = env.META_CAPI_TEST_EVENT_CODE || '';
  if (/^[A-Za-z0-9_-]{1,64}$/.test(testCode)) payload.test_event_code = testCode;
  const url = `https://graph.facebook.com/v26.0/${datasetId}/events`;
  let response;
  let parsed = {};
  try {
    response = await fetchImpl(url, {
      method: 'POST',
      headers: {authorization: `Bearer ${token}`, 'content-type': 'application/json'},
      body: stringifyCrmPayload(payload),
      signal: AbortSignal.timeout(15000),
      redirect: 'error',
    });
    parsed = await response.json().catch(() => ({}));
  } catch {
    throw new Error('Meta CRM event request failed');
  }
  if (!response.ok || parsed.error) throw new Error(`Meta CRM event failed (${parsed.error?.code || response.status})`);
  console.log(`meta-capi: sent ${built.event.event_name}${payload.test_event_code ? ' (test event)' : ''}`);
  return {sent: true, reason: 'sent', eventId: built.eventId, eventName: built.event.event_name};
}

function snapshotOf(op) {
  return {
    stage: String(op.stage || '').toUpperCase(),
    call: String(op.callOutcome || op.call_outcome || '').toUpperCase(),
    sale: String(op.saleOutcome || op.sale_outcome || '').toUpperCase(),
  };
}

async function markEvents(op, stages, store, reason, now) {
  const email = op.emailLookup || op.sourceEmail || '';
  for (const eventName of metaEventsFor(stages)) {
    const eventId = crmEventId(eventName, {email, leadId: op.metaLeadId});
    if (!eventId && !op.id) continue;
    if (await alreadySent(store, op.id, eventName, eventId)) continue;
    await rememberSent(store, op.id, eventName, eventId, reason, now);
  }
}

async function deliver(op, stages, {store, send, resolve, env, now, eventTime}) {
  let sent = 0;
  let failed = 0;
  const names = metaEventsFor(stages);
  if (!names.length) return {sent, failed};
  let match = {};
  try { match = await resolve(op); } catch { match = {}; }
  const local = acceptedMatch({meta_lead_id: op.metaLeadId, fbclid: op.fbclid, fbc: op.fbc, fbp: op.fbp}, Date.parse(eventTime || '') || now);
  match = {...match, ...local};
  const email = op.emailLookup || op.sourceEmail || match.email || '';
  if (isInternalLead({email, name: op.name || match.name, sourceRecordKind: op.sourceRecordKind || match.sourceRecordKind, test: op.test})) {
    await markEvents(op, stages, store, 'test', now);
    return {sent, failed};
  }
  const when = eventTime || op.updatedAt || op.createdAt || new Date(now).toISOString();
  for (let i = 0; i < names.length; i++) {
    const eventName = names[i];
    if (BLOCKED_STAGE_EVENTS.has(eventName)) continue;
    const eventId = crmEventId(eventName, {email, leadId: match.meta_lead_id});
    if (!eventId) continue;
    if (await alreadySent(store, op.id, eventName, eventId)) {
      await rememberSent(store, op.id, eventName, eventId, 'already', now);
      continue;
    }
    const ms = Date.parse(when);
    const offset = (names.length - 1 - i) * 1000;
    try {
      const result = await send({
        eventName,
        eventTime: Number.isFinite(ms) ? new Date(ms - offset).toISOString() : new Date(now).toISOString(),
        eventId,
        email,
        phone: op.sourcePhone || match.phone,
        name: op.name || match.name,
        leadId: match.meta_lead_id,
        fbc: match.fbc,
        fbp: match.fbp,
        fbclid: match.fbclid,
        sourceRecordKind: op.sourceRecordKind,
      }, {env, now});
      if (result.reason === 'unconfigured') return {sent, failed, unconfigured: true};
      await rememberSent(store, op.id, eventName, eventId, result.reason, now);
      if (result.sent) sent++;
    } catch {
      failed++;
      return {sent, failed};
    }
  }
  return {sent, failed};
}

// Poll, not a Twenty webhook. Stage changes are made by hand, so a one-minute
// schedule is soon enough for ads, and the next run retries a failed send.
// The first run records the current stage and only sends opportunities created
// in the last 7 days (Meta drops anything older), as FS_Booked, FS_Attended or
// FS_Won. It does not send Lead. Later runs send a custom event only when that
// stage is new: booked (SCREENING and anything past it), MEETING/ATTENDED or
// callOutcome ATTENDED, and CUSTOMER/MAINTENANCE or saleOutcome WON. A webhook
// would need a new public secret and would drop events whenever Twenty did not retry.
export async function syncCrmStageEvents(options = {}) {
  const env = options.env || process.env;
  const now = options.now || Date.now();
  const send = options.send || ((input, extras) => sendCrmEvent(input, {...extras, env, now}));
  if (!env.META_CAPI_TOKEN || !/^\d{8,30}$/.test(env.META_CAPI_DATASET_ID || '')) {
    return {configured: false, sent: 0, failed: 0, baselined: 0};
  }
  if (!options.listOpportunities && (!env.TWENTY_API_URL || !env.TWENTY_API_KEY)) {
    return {configured: false, reason: 'twenty', sent: 0, failed: 0, baselined: 0};
  }
  if (!options.store) throw new Error('CRM stage sync has no event store');
  const store = options.store;
  const list = options.listOpportunities || (async ({since} = {}) => {
    const {listOpportunities} = await import('./twenty-crm.mjs');
    return listOpportunities({since});
  });
  const resolve = options.resolveMatch || (async op => {
    const {loadStoredMatch} = await import('./meta-match.mjs');
    return loadStoredMatch(op.emailLookup || op.sourceEmail || '');
  });
  const started = await store.get(STARTED, {type: 'json'});
  const opportunities = await list(started ? {since: new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString()} : {});
  let sent = 0;
  let failed = 0;
  let baselined = 0;
  const context = {store, send, resolve, env, now};

  if (!started) {
    for (const op of opportunities) {
      if (!op?.id || op.sourceRecordKind === 'DUPLICATE') continue;
      const snap = snapshotOf(op);
      const names = funnelEventNames(snap, env);
      const created = Date.parse(op.createdAt || '');
      const recent = Number.isFinite(created) && now - created < WEEK_MS && now - created >= 0;
      if (recent) {
        const result = await deliver(op, names, {...context, eventTime: op.updatedAt || op.createdAt});
        sent += result.sent;
        failed += result.failed;
        if (result.failed) continue;
      } else {
        await markEvents(op, names, store, 'baseline', now);
      }
      await store.setJSON(SNAP + op.id, snap);
      baselined++;
    }
    if (!failed) await store.setJSON(STARTED, {at: new Date(now).toISOString()});
    console.log(`meta-capi: baselined ${baselined} opportunities`);
    return {configured: true, baselined, sent, failed};
  }

  for (const op of opportunities) {
    if (!op?.id || op.sourceRecordKind === 'DUPLICATE') continue;
    const snap = snapshotOf(op);
    const previous = await store.get(SNAP + op.id, {type: 'json'});
    if (!previous) {
      const created = Date.parse(op.createdAt || '');
      const bornAfter = Number.isFinite(created) && created >= Date.parse(started.at);
      if (bornAfter) {
        const result = await deliver(op, funnelEventNames(snap, env), {...context, eventTime: op.updatedAt || op.createdAt});
        sent += result.sent;
        failed += result.failed;
        if (result.failed) continue;
      } else {
        await markEvents(op, funnelEventNames(snap, env), store, 'baseline', now);
      }
      await store.setJSON(SNAP + op.id, snap);
      continue;
    }
    if (previous.stage === snap.stage && previous.call === snap.call && previous.sale === snap.sale) continue;
    const before = new Set(funnelEventNames(previous, env));
    const added = funnelEventNames(snap, env).filter(name => !before.has(name));
    const result = await deliver(op, added, {...context, eventTime: op.updatedAt || new Date(now).toISOString()});
    sent += result.sent;
    failed += result.failed;
    if (!result.failed) await store.setJSON(SNAP + op.id, snap);
  }
  if (sent) console.log(`meta-capi: sent ${sent} stage events`);
  return {configured: true, baselined: 0, sent, failed};
}
