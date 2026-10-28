import {getStore} from '@netlify/blobs';
import {addToKit} from './crm.mjs';
import {twentyMetaLead, twentyMetaAnswers} from './twenty-crm.mjs';
import {holdLead} from './pending.mjs';
import {recordFormLead} from './ads-tracking.mjs';
import {trackingDatabase} from './tracking-server.mjs';
import {metaAuditAnswers} from './meta-audit-questions.mjs';
const emailKey = email => String(email || '').trim().toLowerCase();
const validEmail = email => email.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export function normaliseMetaLead(input) {
  const fields = Array.isArray(input.field_data) ? input.field_data : [];
  const one = key => String(fields.find(f => f.name === key)?.values?.[0] || '').trim();
  const email = emailKey(one('email'));
  const id = String(input.id || '');
  if (!/^\d{8,30}$/.test(id) || !validEmail(email)) throw new Error('Meta lead is missing a valid ID or email.');
  const role = String(fields.find(f => /owner|decision|role/i.test(f.name))?.values?.[0] || '').trim();
  return {id, email, name: one('full_name'), phone: one('phone_number'), role, answers: metaAuditAnswers(fields),
    ad_id: /^\d{8,30}$/.test(input.ad_id || '') ? input.ad_id : '',
    at: Number.isFinite(Date.parse(input.created_time)) ? new Date(input.created_time).toISOString() : new Date().toISOString(),
    customer_type: /^(no|employee)/i.test(role) ? 'employee_apprentice' : 'unknown'};
}
// Persist each completed integration separately. A later CRM failure cannot re-enrol
// a lead in email or requeue a phone alert that has already been accepted.
export async function importMetaLead(input, store, integrations) {
  const lead = normaliseMetaLead(input);
  const state = await store.get(lead.id, {type: 'json'}) || {lead, done: {}};
  const failed = [];
  for (const key of ['crm', 'answers', 'tracking', 'kit', 'alert']) {
    if (state.done[key]) continue;
    try {
      await integrations[key](lead);
      state.done[key] = true;
      await store.setJSON(lead.id, state);
    } catch { failed.push(key); }
  }
  if (failed.length) throw new Error(`Meta lead delivery pending: ${failed.join(', ')}`);
  return lead.id;
}
export function liveIntegrations() {
  return {
    crm: lead => {
      if (process.env.CRM_BACKEND !== 'twenty' || !process.env.TWENTY_API_KEY || !process.env.TWENTY_API_URL) throw new Error('Twenty CRM is not configured.');
      return twentyMetaLead({...lead, adId: lead.ad_id, source: 'Facebook Instant Form — free audit'});
    },
    answers: async lead => { if (!await twentyMetaAnswers(lead)) throw new Error('CRM contact is not available yet.'); },
    tracking: async lead => {
      const db = trackingDatabase();
      if (!db) throw new Error('Marketing reporting is not configured.');
      await recordFormLead(db, {...lead, utm_source: 'facebook', utm_medium: 'instant_form', utm_campaign: 'quote-machine', utm_content: lead.ad_id, landing_path: '/facebook-instant-form/'}, lead.at);
    },
    kit: lead => {
      if (!process.env.KIT_API_KEY) throw new Error('Kit is not configured.');
      return addToKit({...lead, tagId: process.env.KIT_TAG_MAKEOVER_LEAD, tagIds: [process.env.KIT_TAG_QUOTE_MACHINE_LEAD]});
    },
    alert: lead => holdLead({...lead, offer: 'Quote Machine', source: `Facebook Instant Form${lead.ad_id ? ` · ad ${lead.ad_id}` : ''}${lead.role ? `\nRole: ${lead.role}` : ''}`}),
  };
}
export async function pollMetaAuditLeads({token = process.env.META_LEADS_TOKEN, formId = process.env.META_AUDIT_FORM_ID, fetcher = fetch, store, integrations} = {}) {
  if (!token || !formId) return {configured: false, imported: 0};
  if (!/^\d{8,30}$/.test(formId)) throw new Error('Invalid Meta audit form ID.');
  store ||= getStore({name: 'meta-audit-leads', consistency: 'strong'});
  integrations ||= liveIntegrations();
  let cursor, imported = 0;
  for (let page = 0; page < 10; page++) {
    const url = new URL(`https://graph.facebook.com/v26.0/${formId}/leads`);
    url.searchParams.set('fields', 'id,created_time,field_data,ad_id');
    url.searchParams.set('limit', '100');
    if (cursor) url.searchParams.set('after', cursor);
    const response = await fetcher(url, {headers: {authorization: `Bearer ${token}`}, signal: AbortSignal.timeout(15000), redirect: 'error'});
    if (!response.ok) throw new Error(`Meta lead retrieval failed (${response.status}). Check Page lead access.`);
    const data = await response.json();
    if (data.error) throw new Error('Meta lead retrieval was rejected. Check Page lead access.');
    for (const lead of data.data || []) { await importMetaLead(lead, store, integrations); imported++; }
    if (!data.paging?.next || !data.paging?.cursors?.after) break;
    cursor = data.paging.cursors.after;
  }
  return {configured: true, imported};
}
