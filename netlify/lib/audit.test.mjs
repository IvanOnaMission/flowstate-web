import {test} from 'node:test';
import assert from 'node:assert/strict';
import {META_AUDIT_QUESTIONS, metaAuditAnswers} from './meta-audit-questions.mjs';
import {importMetaLead, pollMetaAuditLeads, normaliseMetaLead} from './meta-audit-leads.mjs';
function fakeStore() {
 const rows=new Map();return {rows,async get(key){return structuredClone(rows.get(key)||null);},async setJSON(key,data){rows.set(key,structuredClone(data));}};
}
test('all ten native questions map exported values and preserve skipped questions',()=>{
 assert.equal(META_AUDIT_QUESTIONS.length,10);
 const answers=metaAuditAnswers([{name:'industry',values:['electrical']},{name:'software',values:['servicem8']},{name:'team_size',values:['2–5']},{name:'What is the biggest pain in your business right now?',values:['general_admin']}]);
 assert.equal(answers[0].answer,'Electrical');assert.equal(answers[1].answer,'ServiceM8');assert.equal(answers[2].answer,'General admin');assert.equal(answers[3].answer,'2–5');assert.equal(answers[9].answer,'Not answered');
 assert.equal(metaAuditAnswers()[0].answer,'Not answered');
});
const metaLead = {id: '12345678901234', ad_id: '22345678901234', created_time: '2026-10-29T00:00:00Z', field_data: [{name: 'full_name', values: ['Jane Smith']}, {name: 'email', values: ['JANE@example.test']}, {name: 'phone_number', values: ['021 123 4567']}, {name: 'are_you_the_owner', values: ['Yes — I own or run the business']}]};
test('a failed Meta integration retries independently without repeating email enrolment or phone alerts', async () => {
  const store = fakeStore(), calls = {crm: 0, answers: 0, tracking: 0, kit: 0, alert: 0};
  const integrations = Object.fromEntries(Object.keys(calls).map(key => [key, async () => {calls[key]++; if (key === 'crm' && calls.crm === 1) throw Error('CRM unavailable');}]));
  await assert.rejects(importMetaLead(metaLead, store, integrations), /crm/);
  assert.deepEqual(calls, {crm: 1, answers: 1, tracking: 1, kit: 1, alert: 1});
  await importMetaLead(metaLead, store, integrations);
  await importMetaLead(metaLead, store, integrations);
  assert.deepEqual(calls, {crm: 2, answers: 1, tracking: 1, kit: 1, alert: 1});
  assert.equal(normaliseMetaLead(metaLead).email, 'jane@example.test');
});
test('Meta retrieval uses the configured form, sends credentials only in a header, and fails on denied lead access', async () => {
  assert.deepEqual(await pollMetaAuditLeads({token: '', formId: ''}), {configured: false, imported: 0});
  const fetcher = async (url, options) => {
    assert.equal(url.hostname, 'graph.facebook.com');
    assert.equal(url.pathname, '/v26.0/12345678901234/leads');
    assert.equal(url.searchParams.has('access_token'), false);
    assert.equal(options.headers.authorization, 'Bearer test-only');
    return new Response('{}', {status: 403});
  };
  await assert.rejects(pollMetaAuditLeads({token: 'test-only', formId: '12345678901234', fetcher, store: fakeStore()}), /lead retrieval failed \(403\)/);
});

test('contact-only native submissions retain ten explicitly unanswered questions without inferring an owner',()=>{
 const lead=normaliseMetaLead({...metaLead,field_data:metaLead.field_data.filter(f=>['email','full_name','phone_number'].includes(f.name))});
 assert.equal(lead.customer_type,'unknown');assert.equal(lead.answers.length,10);assert.ok(lead.answers.every(a=>a.answer==='Not answered'));
 assert.throws(()=>normaliseMetaLead({...metaLead,field_data:[]}));
});
