// Admin Facebook instant forms: text Ivan once, then copy the lead into Twenty.
// This path does not send a Meta Lead event. Booked, attended and won stay on
// the CRM stage poll as FS_Booked, FS_Attended and FS_Won.
//
// META_LEAD_FORM_IDS: comma-separated form ids. Blank uses the two forms below.
// Alert: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.
// Lead read: META_LEADS_TOKEN (Authorization header only).
// CRM copy, when configured: CRM_BACKEND=twenty, TWENTY_API_URL, TWENTY_API_KEY.
// Marketing row, when configured: MKT_SUPABASE_URL, MKT_SUPABASE_SERVICE_KEY.
import {clean} from './messages.mjs';
import {sendAlert, sendContact} from './telegram.mjs';
import {twentyMetaAnswers, twentyMetaLead} from './twenty-crm.mjs';
import {recordFormLead} from './ads-tracking.mjs';
import {trackingDatabase} from './tracking-server.mjs';

export const DEFAULT_INSTANT_FORM_IDS = ['1174559812181344', '1480350577329067'];
const STEPS = ['alert', 'crm', 'answers', 'tracking'];
const emailKey = email => String(email || '').trim().toLowerCase();
const validEmail = email => email.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const digitId = value => /^\d{8,30}$/.test(String(value || '')) ? String(value) : '';

export function instantLeadFormIds(raw = process.env.META_LEAD_FORM_IDS) {
  const text = raw == null ? '' : String(raw);
  const source = text.trim() ? text : DEFAULT_INSTANT_FORM_IDS.join(',');
  const ids = [...new Set(source.split(',').map(part => part.trim()).filter(Boolean))];
  if (!ids.length || ids.some(id => !/^\d{8,30}$/.test(id))) throw new Error('Invalid Meta lead form ID.');
  return ids;
}

export function fieldLabel(name) {
  const raw = clean(name, 200);
  if (!raw) return 'Answer';
  if (/[?\s]/.test(raw) && !raw.includes('_')) return raw;
  const words = raw.replace(/_+/g, ' ').replace(/\s+/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function answerValues(field) {
  const values = Array.isArray(field?.values) ? field.values : field?.values == null ? [] : [field.values];
  return values.map(value => clean(value, 500)).filter(Boolean);
}

function readableFields(input) {
  const fields = Array.isArray(input?.field_data) ? input.field_data : [];
  return fields.map(field => {
    const name = clean(field?.name, 200);
    if (!name) return null;
    const values = answerValues(field);
    return {name, values, question: fieldLabel(name), answer: values.join(', ') || 'Not answered'};
  }).filter(Boolean).slice(0, 40);
}

function firstValue(fields, ...keys) {
  for (const key of keys) {
    const found = fields.find(field => field.name === key);
    if (found?.values[0]) return found.values[0];
  }
  return '';
}

export function normaliseInstantLead(input) {
  const id = digitId(input?.id);
  if (!id) throw new Error('Meta lead is missing a valid ID.');
  const fields = readableFields(input);
  const email = emailKey(firstValue(fields, 'email'));
  const name = firstValue(fields, 'full_name', 'name') || [firstValue(fields, 'first_name'), firstValue(fields, 'last_name')].filter(Boolean).join(' ');
  const phone = firstValue(fields, 'phone_number', 'phone');
  return {
    id,
    email: validEmail(email) ? email : '',
    name,
    phone,
    ad_id: digitId(input.ad_id),
    ad_name: clean(input.ad_name, 200),
    form_id: digitId(input.form_id),
    fields,
    answers: fields.map(field => ({id: field.name, question: field.question, answer: field.answer})),
    questionnaire: 'instant',
    test: /^\[TEST\]/i.test(name) && email.endsWith('@example.invalid'),
    at: Number.isFinite(Date.parse(input.created_time)) ? new Date(input.created_time).toISOString() : new Date().toISOString(),
  };
}

function adLine(lead) {
  if (lead.ad_name && lead.ad_id) return `Ad: ${lead.ad_name} (${lead.ad_id})`;
  if (lead.ad_name) return `Ad: ${lead.ad_name}`;
  if (lead.ad_id) return `Ad: ${lead.ad_id}`;
  return '';
}

export function instantLeadMessage(lead) {
  const lines = [
    'New Facebook instant form lead',
    clean(lead.name, 200) || 'Unknown',
    `Phone: ${clean(lead.phone, 80) || 'not given'}`,
    clean(lead.email, 200) || 'Email: not given',
    '',
  ];
  const answers = Array.isArray(lead.answers) ? lead.answers : [];
  if (!answers.length) lines.push('Form answers: none', '');
  for (const answer of answers) {
    lines.push(clean(answer.question, 200) || 'Answer', `"${clean(answer.answer, 500) || 'Not answered'}"`, '');
  }
  const ad = adLine(lead);
  if (ad) lines.push(ad);
  lines.push('Call them now.');
  return lines.join('\n').trim();
}

function crmReady() {
  return process.env.CRM_BACKEND === 'twenty' && process.env.TWENTY_API_KEY && process.env.TWENTY_API_URL;
}

export function instantIntegrations({send = sendAlert, contact = sendContact} = {}) {
  return {
    alert: async lead => {
      await send(instantLeadMessage(lead));
      await contact({name: lead.name, phone: lead.phone, email: lead.email, label: 'Facebook lead'});
    },
    // Kit tags on the audit form start the quote-machine and makeover sequences.
    // This admin form does not enrol anyone in those.
    crm: lead => {
      if (!crmReady() || !lead.email) return {reason: 'unconfigured'};
      const source = lead.ad_name ? `Facebook Instant Form — ${lead.ad_name}` : 'Facebook Instant Form';
      return twentyMetaLead({...lead, adId: lead.ad_id, metaLeadId: lead.id, source});
    },
    answers: async lead => {
      if (!crmReady() || !lead.email) return {reason: 'unconfigured'};
      const ad = [lead.ad_name, lead.ad_id].filter(Boolean).join(' · ');
      if (!await twentyMetaAnswers({...lead, questionnaire: 'instant', ad_id: ad})) throw new Error('CRM contact is not available yet.');
    },
    tracking: async lead => {
      if (lead.test || !lead.email) return {reason: 'unconfigured'};
      const db = trackingDatabase();
      if (!db) return {reason: 'unconfigured'};
      await recordFormLead(db, {
        ...lead,
        meta_lead_id: lead.id,
        utm_source: 'facebook',
        utm_medium: 'instant_form',
        utm_campaign: 'admin',
        utm_content: lead.ad_id,
        landing_path: '/facebook-instant-form/',
      }, lead.at);
    },
  };
}

// Each step is stored as soon as it succeeds. A Meta retry runs the remaining
// steps and does not send the Telegram alert again. `capi` is not a step.
export async function importInstantLead(input, store, integrations = instantIntegrations()) {
  const lead = normaliseInstantLead(input);
  const state = await store.get(lead.id, {type: 'json'}) || {lead, done: {}};
  const failed = [];
  for (const key of STEPS) {
    if (state.done[key] || typeof integrations[key] !== 'function') continue;
    try {
      const result = await integrations[key](lead);
      if (result?.reason === 'unconfigured') continue;
      state.done[key] = true;
      await store.setJSON(lead.id, state);
    } catch { failed.push(key); }
  }
  if (failed.length) {
    console.error(`Instant lead delivery pending: ${failed.join(', ')}`);
    throw new Error(`Meta lead delivery pending: ${failed.join(', ')}`);
  }
  return lead.id;
}
