import {test} from 'node:test';
import assert from 'node:assert/strict';
import {META_AUDIT_QUESTIONS, META_BUSINESS_QUESTIONS, metaAuditAnswers} from './meta-audit-questions.mjs';
import {importMetaLead, pollMetaAuditLeads, normaliseMetaLead, liveIntegrations} from './meta-audit-leads.mjs';
import {auditDigest, initialiseAuditChat} from './meta-audit-chat.mjs';
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

test('business form maps eight general questions without relabelling legacy quoting answers',()=>{
 const fields=[...metaLead.field_data,{name:'business_industry',values:['electrical']},{name:'business_role',values:['owner_or_director']},{name:'business_time_sink',values:['invoicing_and_chasing_payments']},{name:'business_weekly_hours',values:['6_10_hours']}].filter(f=>f.name!=='are_you_the_owner');
 const lead=normaliseMetaLead({...metaLead,questionnaire:'business',field_data:fields});
 assert.equal(lead.answers.length,8);assert.equal(lead.answers.find(a=>a.id==='business_time_sink').answer,'Invoicing and chasing payments');assert.equal(lead.answers.find(a=>a.id==='business_weekly_hours').answer,'6–10 hours');assert.equal(lead.customer_type,'electrical_owner');
 assert.ok(!lead.answers.some(a=>['prep_time','pre_sale_work','follow_up'].includes(a.id)));
 assert.equal(normaliseMetaLead({...metaLead,field_data:fields}).answers.length,10);
 assert.ok(META_BUSINESS_QUESTIONS.every(q=>q.options.length>=4));
});

test('business and legacy forms are polled independently even when a retired form is denied',async()=>{
 const calls=[],accepted=[],store=fakeStore();
 const fetcher=async url=>{calls.push(url.pathname);return url.pathname.includes('11111111111111')?new Response('{}',{status:403}):Response.json({data:[{...metaLead,field_data:[...metaLead.field_data,{name:'business_time_sink',values:['General admin and data entry']}]}]});};
 const integrations=Object.fromEntries(['crm','answers','tracking','kit','alert'].map(key=>[key,async lead=>{if(key==='answers')accepted.push(lead);} ]));
 await assert.rejects(pollMetaAuditLeads({token:'test-only',formId:'11111111111111',businessFormId:'22222222222222',fetcher,store,integrations}),/403/);
 assert.equal(calls.length,2);assert.equal(accepted[0].questionnaire,'business');assert.equal(accepted[0].answers.length,8);
});

test('business digest reports the actual completed question count and synthetic leads skip marketing effects',async()=>{
 const lead=normaliseMetaLead({...metaLead,questionnaire:'business',field_data:[{name:'full_name',values:['[TEST] Business form']},{name:'email',values:['business@example.invalid']},...META_BUSINESS_QUESTIONS.map(q=>({name:q.id,values:[q.options[0]]}))]});
 const store=fakeStore();await initialiseAuditChat(lead,store,1000);
 const state=await store.get('lead:'+lead.id);assert.equal(state.index,8);assert.equal(state.test,true);assert.match(auditDigest(state),/Answers: 8\/8 · Questions finished/);assert.match(auditDigest(state),/biggest time sink/);
 const integrations=liveIntegrations();await integrations.tracking(lead);await integrations.kit(lead);
 assert.equal(normaliseMetaLead({...metaLead,field_data:[{name:'email',values:['real@example.invalid']},{name:'full_name',values:['Real person']}]}).test,false);
});
