import test from 'node:test';
import assert from 'node:assert/strict';
import {createWebAuditHandler, webLeadKey, flushWebAuditEffects} from './web-audit.mjs';
import {flushAuditDigests, QUIET_MS} from './meta-audit-chat.mjs';

function memory() {
  const map=new Map();let version=0;
  return {map,async get(k){return structuredClone(map.get(k)?.data||null);},
    async getWithMetadata(k){return structuredClone(map.get(k)||null);},
    async setJSON(k,data,options={}){const old=map.get(k);if(options.onlyIfNew&&old||options.onlyIfMatch&&old?.etag!==options.onlyIfMatch)return {modified:false};const etag=String(++version);map.set(k,{data:structuredClone(data),etag});return {modified:true,etag};},
    list({prefix=''}={}){const blobs=[...map.keys()].filter(k=>k.startsWith(prefix)).map(key=>({key}));return {[Symbol.asyncIterator]:async function*(){yield {blobs};}};}};
}
const nonce='a'.repeat(64),key=webLeadKey(nonce),origin='https://flowstate.net.nz';
const details={action:'contact',nonce,name:'Alex Example',email:'alex@example.test',phone:'021 123 4567'};
const request=(data,cookie='',extra={})=>new Request(origin+'/.netlify/functions/audit-web',{method:data?'POST':'GET',headers:{origin,'content-type':'application/json',...(cookie?{cookie}:{}),...extra},...(data?{body:JSON.stringify(data)}:{})});
async function setup(save=async()=>true){const store=memory();let clock=1000;const handler=createWebAuditHandler({store,save,now:()=>clock});const response=await handler(request(details));const cookie=response.headers.get('set-cookie').split(';')[0];return {store,handler,response,cookie,time:t=>{clock=t;}};}

test('a website enquiry stores a valid click id and ignores a client-supplied Meta lead id',async()=>{
  const store=memory();const fbc='fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890';
  const nonce='c'.repeat(64);
  const handler=createWebAuditHandler({store,now:()=>1000,save:async()=>true});
  const response=await handler(request({...details,nonce,fbclid:'nope',fbc,meta_lead_id:'123456789012345'}));
  assert.equal(response.status,201);
  const lead=(await store.get(webLeadKey(nonce))).lead;
  assert.equal(lead.fbc,fbc);assert.equal(lead.fbclid,undefined);assert.equal(lead.meta_lead_id,undefined);
});
test('contacts are durable and synced before optional questions are returned; retries keep one lead',async()=>{
  const store=memory();let calls=0;
  const handler=createWebAuditHandler({store,now:()=>1000,save:async lead=>{calls++;assert.equal((await store.get(key)).lead.email,details.email);assert.equal(lead.answers.length,10);return true;}});
  const first=await handler(request(details));assert.equal(first.status,201);const view=await first.json();assert.equal(view.index,0);assert.ok(view.question);assert.equal(view.answered,0);
  assert.match(first.headers.get('set-cookie'),/HttpOnly/);assert.match(first.headers.get('set-cookie'),/Secure/);assert.match(first.headers.get('set-cookie'),/SameSite=Lax/);assert.ok(!JSON.stringify(view).includes(details.email));
  await handler(request(details));assert.equal([...store.map.keys()].filter(k=>k.startsWith('lead:')).length,1);assert.equal(calls,1);
});

test('each answer saves immediately; abandoning after three answers survives a reload and sends one partial summary',async()=>{
  const snapshots=[];const {store,handler,cookie,time}=await setup(async lead=>{snapshots.push(structuredClone(lead));return true;});
  for(let index=0;index<3;index++){time(2000+index);const response=await handler(request({action:'answer',index,choice:0},cookie));assert.equal(response.status,200);assert.equal((await response.json()).index,index+1);assert.equal((await store.get(key)).lead.answers.filter(a=>a.answer!=='Not answered').length,index+1);}
  assert.equal(snapshots.length,4);const resumed=await (await handler(request(null,cookie))).json();assert.equal(resumed.index,3);assert.equal(resumed.answered,3);
  const sent=[];await flushAuditDigests({store,now:2002+QUIET_MS,send:async text=>{sent.push(text);return {message_id:81};}});assert.equal(sent.length,1);assert.match(sent[0],/Answers: 3\/10/);assert.match(sent[0],/Electrical/);
  await flushAuditDigests({store,now:3000+QUIET_MS,send:async()=>{throw Error('Duplicate notification');}});
  time(140000);await handler(request({action:'answer',index:3,choice:1},cookie));const edits=[];await flushAuditDigests({store,now:140000+QUIET_MS,edit:async(id,text)=>edits.push({id,text})});assert.equal(edits[0].id,81);assert.match(edits[0].text,/Answers: 4\/10/);
});

test('contact-only abandonment still gets a summary and finishing early preserves supplied answers',async()=>{
  const {store,handler,cookie}=await setup();const sent=[];await flushAuditDigests({store,now:1000+QUIET_MS,send:async text=>{sent.push(text);return {message_id:82};}});assert.match(sent[0],/No optional answers yet/);
  await handler(request({action:'answer',index:0,choice:1},cookie));const finished=await (await handler(request({action:'finish'},cookie))).json();assert.equal(finished.finished,true);assert.equal(finished.answered,1);assert.equal((await store.get(key)).lead.answers[0].answer,'Plumbing');
});

test('failed CRM writes keep accepted answers durable and the scheduled worker retries the same revision',async()=>{
  let failing=true;const {store,handler,cookie}=await setup(async()=>{if(failing)throw Error('CRM down');return true;});
  const saved=await handler(request({action:'answer',index:0,choice:0},cookie));assert.equal(saved.status,200);assert.equal((await saved.json()).index,1);assert.equal((await store.get(key)).crmDirty,true);
  failing=false;let retries=0;await flushAuditDigests({store,now:1000+QUIET_MS,save:async lead=>{retries++;assert.equal(lead.answers[0].answer,'Electrical');return true;},send:async()=>({message_id:83})});assert.equal(retries,1);assert.equal((await store.get(key)).crmDirty,false);
});

test('duplicate answer retries do not advance twice and stale choices cannot overwrite saved answers',async()=>{
  const {store,handler,cookie}=await setup();const answer={action:'answer',index:0,choice:1};await handler(request(answer,cookie));const duplicate=await handler(request(answer,cookie));assert.equal(duplicate.status,200);assert.equal((await duplicate.json()).index,1);
  assert.equal((await handler(request({...answer,choice:0},cookie))).status,409);assert.equal((await store.get(key)).lead.answers[0].answer,'Plumbing');assert.equal((await store.get(key)).revision,1);
});

test('a busy worker leaves the browser on its current question; failed durable writes never acknowledge saving',async()=>{
  const {store,handler,cookie}=await setup();await store.setJSON('lock:'+key,{until:999999});assert.equal((await handler(request({action:'answer',index:0,choice:0},cookie))).status,409);assert.equal((await store.get(key)).index,0);
  await store.setJSON('lock:'+key,{until:0});const original=store.setJSON;store.setJSON=async(k,...rest)=>{if(k===key)throw Error('Storage unavailable');return original(k,...rest);};assert.equal((await handler(request({action:'answer',index:0,choice:0},cookie))).status,503);assert.equal((await store.get(key)).index,0);
});

test('session cookies, origin checks, validation and optional skips protect previously saved enquiries',async()=>{
  const {store,handler,cookie}=await setup();assert.equal((await handler(request({action:'answer',index:0,choice:0}))).status,401);assert.equal((await handler(request({action:'answer',index:0,choice:0},cookie,{origin:'https://unrelated.example'}))).status,403);
  assert.equal((await handler(request({action:'answer',index:0,choice:999},cookie))).status,400);assert.equal((await handler(request({...details,nonce:'b'.repeat(64),phone:'x'}))).status,400);assert.equal((await handler(request({...details,nonce:'b'.repeat(64),company_website:'spam'}))).status,400);
  await handler(request({action:'answer',index:0,choice:'skip'},cookie));assert.equal((await store.get(key)).index,1);assert.equal((await store.get(key)).lead.answers[0].answer,'Not answered');
  assert.equal((await handler(request({...details,email:'different@example.test'}))).status,409);
});

test('reporting and reminder retries run independently and never send synthetic test conversions or emails',async()=>{
  const {store}=await setup();let tracking=0,kit=0;
  const effects={tracking:async()=>{tracking++;if(tracking===1)throw Error('down');},kit:async()=>{kit++;}};
  await flushWebAuditEffects({store,effects,now:2000});await flushWebAuditEffects({store,effects,now:3000});assert.equal(tracking,2);assert.equal(kit,1);
  const testNonce='b'.repeat(64);await createWebAuditHandler({store,save:async()=>true})(request({...details,nonce:testNonce,name:'[TEST] Audit',email:'audit@example.invalid'}));await flushWebAuditEffects({store,effects,now:4000});assert.equal(tracking,2);assert.equal(kit,1);
});
test('starting a different enquiry clears only the browser session and preserves the saved contact and answers',async()=>{
  const {store,handler,cookie}=await setup();await handler(request({action:'answer',index:0,choice:0},cookie));
  const reset=await handler(request({action:'restart'},cookie));assert.equal(reset.status,200);assert.equal((await reset.json()).saved,false);assert.match(reset.headers.get('set-cookie'),/Max-Age=0/);
  assert.equal((await store.get(key)).lead.email,details.email);assert.equal((await store.get(key)).lead.answers[0].answer,'Electrical');assert.equal((await (await handler(request())).json()).saved,false);
});
