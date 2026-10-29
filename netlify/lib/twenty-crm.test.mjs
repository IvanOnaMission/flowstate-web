import {test,afterEach,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {twentyLead,twentyBooked,twentyQuiz,twentyMetaLead,twentyMetaAnswers,twentyMetaProgress} from './twenty-crm.mjs';
import {crmLead} from './crm.mjs';
import submissionCreated from '../functions/submission-created.mjs';

const originalFetch=globalThis.fetch,originalEnv={...process.env};
let rows,calls,failure;
const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json'}});
beforeEach(()=>{
 rows=Object.fromEntries(['opportunities','people','tasks','taskTargets','notes','noteTargets'].map(k=>[k,new Map()]));calls=[];failure=null;
 process.env.TWENTY_API_URL='https://crm.example';process.env.TWENTY_API_KEY='test-only';
 globalThis.fetch=async(url,options={})=>{
  const u=new URL(url),[plural,id]=u.pathname.replace('/rest/','').split('/'),method=options.method||'GET';
  calls.push({url:String(url),plural,id,method,body:options.body&&JSON.parse(options.body)});
  if(failure?.({plural,id,method}))return reply({message:'unavailable'},503);
  const table=rows[plural];assert.ok(table,'Unexpected resource: '+plural);
  if(method==='GET'){
   if(id)return table.has(id)?reply({data:{record:table.get(id)}}):reply({message:'not found'},404);
   let found=[...table.values()],filter=u.searchParams.get('filter');
   if(filter){const match=filter.match(/^(.+)\[eq\]:(.+)$/);assert.ok(match,'Unexpected filter');const value=JSON.parse(match[2]);found=found.filter(row=>match[1].split('.').reduce((v,k)=>v?.[k],row)===value);}
   return reply({data:{[plural]:found}});
  }
  const body=JSON.parse(options.body);
  if(method==='POST'){if(table.has(body.id))return reply({message:'duplicate'},409);table.set(body.id,body);return reply({data:{record:body}});}
  if(method==='PATCH'){assert.ok(table.has(id));table.set(id,{...table.get(id),...body});return reply({data:{record:table.get(id)}});}
  throw Error('Unexpected method');
 };
});
afterEach(()=>{globalThis.fetch=originalFetch;for(const key of Object.keys(process.env))if(!(key in originalEnv))delete process.env[key];Object.assign(process.env,originalEnv);});
const contact=extra=>({id:'contact-1',name:'Shannon Christie',emailLookup:'shannon@example.com',sourceRecordKind:'CONTACT',stage:'SCREENING',pointOfContactId:'person-1',...extra});

test('a return enquiry updates the real contact instead of a preserved duplicate',async()=>{
 rows.opportunities.set('duplicate',contact({id:'duplicate',sourceRecordKind:'DUPLICATE'}));rows.opportunities.set('contact-1',contact());
 await twentyLead({email:'SHANNON@example.com',name:'Different form name',phone:'invalid number',adId:'120249982198220753'});
 assert.equal(rows.opportunities.get('contact-1').nextAction,'Call within 5 minutes');assert.equal(rows.opportunities.get('contact-1').name,'Shannon Christie');assert.equal(rows.opportunities.get('duplicate').nextAction,undefined);
 assert.equal(calls.filter(c=>c.plural==='people'&&c.method==='POST').length,0);assert.equal(rows.tasks.size,1);
});
test('repeated form submissions reuse the person, CRM record and follow-up',async()=>{
 await twentyLead({email:'New@Example.com',name:'New customer',phone:'bad source phone',customerType:'electrical_owner'});
 await twentyLead({email:'new@example.com',name:'Do not replace saved identity'});
 assert.equal(rows.people.size,1);assert.equal(rows.opportunities.size,1);assert.equal(rows.tasks.size,1);assert.equal(rows.taskTargets.size,2);
 const op=[...rows.opportunities.values()][0];assert.equal(op.name,'New customer');assert.equal(op.sourcePhone,'bad source phone');assert.equal(op.emailLookup,'new@example.com');
});
test('a booking keeps an active client stage and preserves the exact booked instant',async()=>{
 rows.opportunities.set('contact-1',contact({stage:'CUSTOMER'}));const start='2026-10-28T00:30:00.000Z';
 await twentyBooked({email:'shannon@example.com',start});
 assert.equal(rows.opportunities.get('contact-1').stage,'CUSTOMER');assert.equal(rows.opportunities.get('contact-1').nextActionDate,start);assert.equal([...rows.tasks.values()][0].dueAt,start);
});
test('quiz retries append one linked note without overwriting the deal or follow-up',async()=>{
 rows.opportunities.set('contact-1',contact({nextAction:'Existing action'}));const quiz={email:'shannon@example.com',uri:'https://calendly.com/invitee/123',submissionId:'submission-123',answers:[{question:'Main problem',answer:'Unsent invoices'}]};
 assert.equal(await twentyQuiz(quiz),true);assert.equal(await twentyQuiz(quiz),true);
 assert.equal(rows.notes.size,1);assert.equal(rows.noteTargets.size,2);assert.equal(rows.opportunities.get('contact-1').nextAction,'Existing action');assert.equal(rows.opportunities.get('contact-1').stage,'SCREENING');assert.match([...rows.notes.values()][0].bodyV2.markdown,/Unsent invoices/);
});
test('a quiz completed before booking saves to the contact without a Calendly call',async()=>{
 process.env.CRM_BACKEND='twenty';rows.opportunities.set('contact-1',contact({nextAction:'Existing action'}));
 const data={name:'Shannon Christie',email:'shannon@example.com',phone:'021 123 4567',office_staff:'2–3',challenge:'Too much admin',goal:'Free up time',ai_experience:'Basic',timing:'Just exploring',investment:'Other',investment_other:'Need guidance'};
 const response=await submissionCreated(new Request('https://site.example/.netlify/functions/submission-created',{method:'POST',body:JSON.stringify({payload:{id:'pre-booking-quiz',form_name:'business-quiz',data}})}));
 assert.equal(response.status,200);assert.equal(await response.text(),'quiz linked');assert.equal(rows.notes.size,1);assert.match([...rows.notes.values()][0].bodyV2.markdown,/Booking: Not booked yet/);assert.equal(rows.opportunities.get('contact-1').nextAction,'Existing action');assert.ok(calls.every(c=>c.url.startsWith('https://crm.example/')));
});
test('an unknown quiz contact does not invent a deal',async()=>{assert.equal(await twentyQuiz({email:'unknown@example.com'}),false);assert.equal(rows.notes.size,0);assert.equal(rows.opportunities.size,0);});
test('native audit submissions link all answers once and preserve booked calls and follow-up',async()=>{
 rows.opportunities.set('contact-1',contact({stage:'SCREENING',nextAction:'Keep this call',nextActionDate:'2026-10-30T00:30:00Z'}));
 const lead={email:'shannon@example.com',id:'12345678901234',at:'2026-10-29T00:00:00Z',ad_id:'22345678901234',answers:[{id:'industry',question:'Business',answer:'Electrical'},{id:'pain',question:'Pain',answer:'Not answered'}]};
 await twentyMetaLead({...lead,adId:lead.ad_id});
 assert.equal(await twentyMetaAnswers(lead),true);assert.equal(await twentyMetaAnswers(lead),true);
 assert.equal(rows.notes.size,1);assert.equal(rows.noteTargets.size,2);assert.match([...rows.notes.values()][0].bodyV2.markdown,/Pain: Not answered/);
 assert.equal(rows.opportunities.get('contact-1').stage,'SCREENING');assert.equal(rows.opportunities.get('contact-1').nextAction,'Keep this call');assert.equal(rows.opportunities.get('contact-1').nextActionDate,'2026-10-30T00:30:00Z');assert.equal(rows.tasks.size,0);
 assert.equal(await twentyMetaAnswers({...lead,email:'unknown@example.com'}),false);
});
test('new native form contacts are called once and a failed task delivery can retry',async()=>{
 const lead={email:'new@example.test',name:'Native enquiry',source:'Facebook Instant Form — free audit',answers:[]};
 failure=({plural,method})=>plural==='tasks'&&method==='POST';
 await assert.rejects(twentyMetaLead(lead),/503/);
 const first=[...rows.opportunities.values()][0];assert.equal(first.nextAction,undefined);
 failure=null;await twentyMetaLead(lead);await twentyMetaLead(lead);
 assert.equal(rows.opportunities.size,1);assert.equal(rows.people.size,1);assert.equal(rows.tasks.size,1);assert.match([...rows.opportunities.values()][0].wikiNotes,/Facebook Instant Form/);
 assert.equal(calls.filter(c=>c.plural==='tasks'&&c.method==='PATCH').length,0);
});
test('each Messenger answer replaces the same linked note without changing the call or another person',async()=>{
 rows.opportunities.set('contact-1',contact({nextAction:'Keep booked call'}));
 rows.opportunities.set('contact-2',contact({id:'contact-2',emailLookup:'another@example.com',pointOfContactId:'person-2'}));
 const lead={email:'shannon@example.com',id:'12345678901234',answers:[{id:'industry',question:'Business',answer:'Electrical'},{id:'pain',question:'Pain',answer:'Not answered'}]};
 await twentyMetaAnswers(lead);
 const noteId=[...rows.notes.keys()][0];
 await twentyMetaProgress({...lead,answers:[lead.answers[0],{id:'pain',question:'Pain',answer:'General admin'}]});
 assert.equal(rows.notes.size,1);assert.equal(rows.noteTargets.size,2);assert.match(rows.notes.get(noteId).bodyV2.markdown,/Pain: General admin/);
 assert.equal(rows.opportunities.get('contact-1').nextAction,'Keep booked call');assert.equal(rows.opportunities.get('contact-2').nextAction,undefined);assert.equal(rows.tasks.size,0);
});
test('website audit saves contacts before answers and keeps one referenced note after a test classification',async()=>{
 const lead={channel:'website',id:'web-enquiry-1',email:'web@example.test',name:'Website enquiry',phone:'021 123 4567',answers:[{id:'industry',question:'Business',answer:'Not answered'},{id:'pain',question:'Pain',answer:'Not answered'}]};
 assert.equal(await twentyMetaProgress(lead),true);
 assert.equal(rows.people.size,1);assert.equal(rows.opportunities.size,1);assert.equal(rows.notes.size,1);
 const op=[...rows.opportunities.values()][0],noteId=[...rows.notes.keys()][0];assert.equal(op.sourceEmail,lead.email);assert.equal(op.sourcePhone,lead.phone);assert.equal(lead.crm_ref.id,op.id);assert.match(rows.notes.get(noteId).bodyV2.markdown,/Answered 0 of 10/);assert.ok(rows.notes.get(noteId).bodyV2.markdown.includes('Phone: '+lead.phone));
 rows.opportunities.set(op.id,{...op,sourceRecordKind:'TEST',nextAction:'Keep existing action'});
 lead.answers[0].answer='Electrical';await twentyMetaProgress(lead);
 assert.equal(rows.opportunities.size,1);assert.equal(rows.notes.size,1);assert.equal(rows.noteTargets.size,2);assert.match(rows.notes.get(noteId).title,/^Audit enquiry/);assert.match(rows.notes.get(noteId).bodyV2.markdown,/Business: Electrical/);assert.equal(rows.opportunities.get(op.id).nextAction,'Keep existing action');
});
test('intake errors remain visible and never fall through to the retired Notion backend',async()=>{
 process.env.CRM_BACKEND='twenty';process.env.NOTION_TOKEN='test-only';process.env.NOTION_CRM_DATABASE_ID='test-only';failure=()=>true;
 await assert.rejects(()=>crmLead({email:'new@example.com'}),/failed \(503\)/);assert.ok(calls.every(c=>c.url.startsWith('https://crm.example/')));
});
test('a failed task lookup is not treated as a missing task',async()=>{
 rows.opportunities.set('contact-1',contact());failure=({plural,method})=>plural==='tasks'&&method==='GET';
 await assert.rejects(()=>twentyBooked({email:'shannon@example.com',start:'2026-10-28T00:30:00Z'}),/503/);assert.equal(rows.tasks.size,0);
});
test('selecting Twenty without credentials fails clearly',async()=>{delete process.env.TWENTY_API_KEY;await assert.rejects(()=>twentyLead({email:'new@example.com'}),/not configured/);assert.equal(calls.length,0);});
