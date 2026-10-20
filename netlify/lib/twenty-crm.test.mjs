import {test,afterEach,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {twentyLead,twentyBooked,twentyQuiz} from './twenty-crm.mjs';
import {crmLead} from './crm.mjs';

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
test('an unknown quiz contact does not invent a deal',async()=>{assert.equal(await twentyQuiz({email:'unknown@example.com'}),false);assert.equal(rows.notes.size,0);assert.equal(rows.opportunities.size,0);});
test('intake errors remain visible and never fall through to the retired Notion backend',async()=>{
 process.env.CRM_BACKEND='twenty';process.env.NOTION_TOKEN='test-only';process.env.NOTION_CRM_DATABASE_ID='test-only';failure=()=>true;
 await assert.rejects(()=>crmLead({email:'new@example.com'}),/failed \(503\)/);assert.ok(calls.every(c=>c.url.startsWith('https://crm.example/')));
});
test('a failed task lookup is not treated as a missing task',async()=>{
 rows.opportunities.set('contact-1',contact());failure=({plural,method})=>plural==='tasks'&&method==='GET';
 await assert.rejects(()=>twentyBooked({email:'shannon@example.com',start:'2026-10-28T00:30:00Z'}),/503/);assert.equal(rows.tasks.size,0);
});
test('selecting Twenty without credentials fails clearly',async()=>{delete process.env.TWENTY_API_KEY;await assert.rejects(()=>twentyLead({email:'new@example.com'}),/not configured/);assert.equal(calls.length,0);});
