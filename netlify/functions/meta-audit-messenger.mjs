// Facebook Page webhook.
// Messenger audit chat and META_AUDIT_FORM_ID keep their existing import.
// Admin instant forms (META_LEAD_FORM_IDS, or the two default form ids) text
// Ivan once with the form answers and the ad name. They do not send a Lead event.
import {enqueueAuditEvents, drainAuditEvents, verifyMessengerSignature, withAuditLeadLease} from '../lib/meta-audit-chat.mjs';
import {importMetaLead, liveIntegrations, pollMetaAuditLeads} from '../lib/meta-audit-leads.mjs';
import {importInstantLead, instantIntegrations, instantLeadFormIds} from '../lib/instant-leads.mjs';
import {getStore} from '@netlify/blobs';

const AUDIT_LEAD_FIELDS = 'id,created_time,field_data,ad_id';
const INSTANT_LEAD_FIELDS = 'id,created_time,field_data,ad_id,ad_name,form_id';

function graphLead(leadId, fields, fetchImpl) {
  const url = new URL(`https://graph.facebook.com/v26.0/${leadId}`);
  url.searchParams.set('fields', fields);
  return fetchImpl(url, {
    headers: {authorization: `Bearer ${process.env.META_LEADS_TOKEN}`},
    signal: AbortSignal.timeout(10000),
    redirect: 'error',
  });
}

async function retrieveMetaLead(leadId, fields, fetchImpl) {
  if (!process.env.META_LEADS_TOKEN) {
    console.error('META_LEADS_TOKEN is not set.');
    throw new Error('Native contact retrieval is pending.');
  }
  let response = await graphLead(leadId, fields, fetchImpl);
  if (!response.ok && response.status === 400 && fields !== AUDIT_LEAD_FIELDS) response = await graphLead(leadId, AUDIT_LEAD_FIELDS, fetchImpl);
  if (!response.ok) {
    console.error(`Meta lead retrieval failed (${response.status}).`);
    throw new Error('Native contact retrieval is pending.');
  }
  const lead = await response.json().catch(() => null);
  if (!lead || lead.error) {
    console.error('Meta lead retrieval was rejected.');
    throw new Error('Native contact retrieval is pending.');
  }
  return lead;
}

export async function handleMetaWebhook(body, {
  pageId = process.env.META_PAGE_ID,
  auditFormId = process.env.META_AUDIT_FORM_ID,
  fetchImpl = fetch,
  storeFor = () => getStore({name: 'meta-audit-leads', consistency: 'strong'}),
  auditImport = (lead, store) => importMetaLead(lead, store, liveIntegrations()),
  instantImport = (lead, store) => importInstantLead(lead, store, instantIntegrations()),
  enqueue = enqueueAuditEvents,
  drain = () => drainAuditEvents({refresh: () => pollMetaAuditLeads()}),
  now = Date.now(),
  formIds = instantLeadFormIds,
} = {}) {
  let instantIds;
  let instantListInvalid = false;
  const instantForm = formId => {
    if (instantListInvalid) return false;
    if (!instantIds) {
      try { instantIds = formIds(); }
      catch {
        instantListInvalid = true;
        console.error('META_LEAD_FORM_IDS is invalid.');
        return false;
      }
    }
    return instantIds.includes(String(formId || ''));
  };
  for (const entry of body.entry || []) {
    if (String(entry.id) !== String(pageId || '')) continue;
    for (const change of entry.changes || []) {
      const value = change.value || {};
      if (change.field !== 'leadgen' || !/^\d{8,30}$/.test(value.leadgen_id || '')) continue;
      const formId = String(value.form_id || '');
      const audit = Boolean(auditFormId) && formId === String(auditFormId);
      if (!audit && !instantForm(formId)) continue;
      const store = storeFor();
      if (audit) {
        await auditImport(await retrieveMetaLead(value.leadgen_id, AUDIT_LEAD_FIELDS, fetchImpl), store);
        continue;
      }
      const ran = await withAuditLeadLease(store, `instant-${value.leadgen_id}`, now, async () => {
        const lead = await retrieveMetaLead(value.leadgen_id, INSTANT_LEAD_FIELDS, fetchImpl);
        await instantImport({...lead, form_id: lead.form_id || formId, ad_id: lead.ad_id || value.ad_id || ''}, store);
      });
      if (!ran) throw new Error('Instant lead delivery is already in progress.');
    }
  }
  await enqueue(body);
  const result = await drain();
  // A bad form list must not drop an audit lead or a Messenger event in the same
  // payload. Meta retries the instant form once the list is fixed.
  if (instantListInvalid) throw new Error('Instant lead forms are not configured.');
  return result;
}

export default async request => {
  if (request.method === 'GET') {
    const params = new URL(request.url).searchParams;
    if (process.env.META_MESSENGER_VERIFY_TOKEN && params.get('hub.mode') === 'subscribe' && params.get('hub.verify_token') === process.env.META_MESSENGER_VERIFY_TOKEN) {
      return new Response(params.get('hub.challenge') || '', {headers: {'content-type': 'text/plain'}});
    }
    return new Response('Forbidden', {status: 403});
  }
  if (request.method !== 'POST') return new Response('Method not allowed', {status: 405});
  if (!process.env.META_APP_SECRET || !process.env.META_PAGE_ID) return new Response('Not configured', {status: 503});
  const raw = await request.text();
  if (raw.length > 1000000) return new Response('Payload too large', {status: 413});
  if (!verifyMessengerSignature(raw, request.headers.get('x-hub-signature-256'), process.env.META_APP_SECRET)) return new Response('Forbidden', {status: 403});
  let body; try { body = JSON.parse(raw); } catch { return new Response('Invalid JSON', {status: 400}); }
  try {
    const result = await handleMetaWebhook(body);
    return new Response(result.failed ? 'Delivery pending' : 'EVENT_RECEIVED', {status: result.failed ? 503 : 200});
  } catch {
    console.error('Contact-first audit webhook delivery is pending.');
    return new Response('Delivery pending', {status: 503});
  }
};
