import {getStore} from '@netlify/blobs';
import {addToKit} from './crm.mjs';
import {twentyMetaLead, twentyMetaAnswers} from './twenty-crm.mjs';
import {holdLead} from './pending.mjs';
import {recordFormLead} from './ads-tracking.mjs';
import {trackingDatabase} from './tracking-server.mjs';
import {metaAuditAnswers, META_BUSINESS_QUESTIONS} from './meta-audit-questions.mjs';
import {initialiseAuditChat} from './meta-audit-chat.mjs';
const emailKey = email => String(email || '').trim().toLowerCase();
const validEmail = email => email.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export function normaliseMetaLead(input) {
  const fields = Array.isArray(input.field_data) ? input.field_data : [];
  const one = key => String(fields.find(f => f.name === key)?.values?.[0] || '').trim();
  const email = emailKey(one('email'));
  const id = String(input.id || '');
  if (!/^\d{8,30}$/.test(id) || !validEmail(email)) throw new Error('Meta lead is missing a valid ID or email.');
  const business = input.questionnaire === 'business';
  const role = String(fields.find(f => /owner|decision|role/i.test(f.name))?.values?.[0] || '').trim();
  const answers = metaAuditAnswers(fields, business ? META_BUSINESS_QUESTIONS : undefined);
  const industry = answers.find(a => a.id === 'business_industry')?.answer;
  const owner = business && /^(owner|director)/i.test(role);
  const name = one('full_name');
  return {id, email, name, phone: one('phone_number'), role, answers,
    questionnaire: business ? 'business' : 'audit',
    test: /^\[TEST\]/i.test(name) && email.endsWith('@example.invalid'),
    ad_id: /^\d{8,30}$/.test(input.ad_id || '') ? input.ad_id : '',
    at: Number.isFinite(Date.parse(input.created_time)) ? new Date(input.created_time).toISOString() : new Date().toISOString(),
    customer_type: owner ? (industry === 'Electrical' ? 'electrical_owner' : /trade|plumbing|building/i.test(industry||'') ? 'other_trade_owner' : 'other') : /^(no|employee)/i.test(role) ? 'employee_apprentice' : 'unknown'};
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
      return twentyMetaLead({...lead, adId: lead.ad_id, source: lead.questionnaire==='business' ? 'Facebook Instant Form — business AI discovery' : 'Facebook Instant Form — free audit'});
    },
    answers: async lead => { if (!await twentyMetaAnswers(lead)) throw new Error('CRM contact is not available yet.'); },
    tracking: async lead => {
      if(lead.test)return;
      const db = trackingDatabase();
      if (!db) throw new Error('Marketing reporting is not configured.');
      await recordFormLead(db, {...lead, utm_source: 'facebook', utm_medium: 'instant_form', utm_campaign: lead.questionnaire==='business'?'business-ai':'quote-machine', utm_content: lead.ad_id, landing_path: '/facebook-instant-form/'}, lead.at);
    },
    kit: lead => {
      if(lead.test)return;
      if (!process.env.KIT_API_KEY) throw new Error('Kit is not configured.');
      return addToKit({...lead, tagId: process.env.KIT_TAG_MAKEOVER_LEAD, tagIds: lead.questionnaire==='business'?[]:[process.env.KIT_TAG_QUOTE_MACHINE_LEAD]});
    },
    alert: lead => lead.questionnaire==='business'||process.env.META_AUDIT_CONTACT_FIRST==='true' ? initialiseAuditChat(lead) : holdLead({...lead, offer: 'Quote Machine', source: `Facebook Instant Form${lead.ad_id ? ` · ad ${lead.ad_id}` : ''}${lead.role ? `\nRole: ${lead.role}` : ''}`}),
  };
}
export async function pollMetaAuditLeads({token = process.env.META_LEADS_TOKEN, formId = process.env.META_AUDIT_FORM_ID, businessFormId = process.env.META_BUSINESS_FORM_ID, fetcher = fetch, store, integrations} = {}) {
  const forms=[...new Set([formId,businessFormId].filter(Boolean))];
  if (!token || !forms.length) return {configured: false, imported: 0};
  if (forms.some(id=>!/^\d{8,30}$/.test(id))) throw new Error('Invalid Meta audit form ID.');
  store ||= getStore({name: 'meta-audit-leads', consistency: 'strong'});
  integrations ||= liveIntegrations();
  let imported = 0;
  const failed=[];
  for(const activeForm of forms){
    let cursor;
    try {
      for (let page = 0; page < 10; page++) {
        const url = new URL(`https://graph.facebook.com/v26.0/${activeForm}/leads`);
        url.searchParams.set('fields', 'id,created_time,field_data,ad_id');
        url.searchParams.set('limit', '100');
        if (cursor) url.searchParams.set('after', cursor);
        const response = await fetcher(url, {headers: {authorization: `Bearer ${token}`}, signal: AbortSignal.timeout(15000), redirect: 'error'});
        if (!response.ok) throw new Error(`Meta lead retrieval failed (${response.status}). Check Page lead access.`);
        const data = await response.json();
        if (data.error) throw new Error('Meta lead retrieval was rejected. Check Page lead access.');
        for (const lead of data.data || []) { await importMetaLead({...lead,questionnaire:activeForm===businessFormId?'business':'audit'}, store, integrations); imported++; }
        if (!data.paging?.next || !data.paging?.cursors?.after) break;
        cursor = data.paging.cursors.after;
      }
    }catch(error){failed.push(error.message);}
  }
  if(failed.length)throw new Error(failed.join('; '));
  return {configured: true, imported};
}
