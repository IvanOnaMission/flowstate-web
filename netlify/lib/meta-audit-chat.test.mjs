import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {initialiseAuditChat,processAuditEvent,enqueueAuditEvents,drainAuditEvents,flushAuditDigests,verifyMessengerSignature,auditQuestionMessages,AUDIT_CHAT_REF,QUIET_MS,MAX_WAIT_MS} from './meta-audit-chat.mjs';
import {META_AUDIT_QUESTIONS} from './meta-audit-questions.mjs';
import webhook from '../functions/meta-audit-messenger.mjs';

function memory() {
  const map=new Map();let version=0;
  return {
    map,
    async get(k) {return structuredClone(map.get(k)?.data||null);},
    async getWithMetadata(k) {const row=map.get(k);return row?structuredClone(row):null;},
    async setJSON(k,data,options={}) {
      const old=map.get(k);
      if(options.onlyIfNew&&old || options.onlyIfMatch&&old?.etag!==options.onlyIfMatch)return {modified:false};
      const etag=String(++version);map.set(k,{data:structuredClone(data),etag});return {modified:true,etag};
    },
    list({prefix=''}={}) {
      const blobs=[...map.keys()].filter(k=>k.startsWith(prefix)).map(key=>({key}));
      return {[Symbol.asyncIterator]:async function*(){yield {blobs};}};
    },
  };
}
const lead=(id='1234567890123456',email='audit-test@example.invalid')=>({id,email,name:'[TEST] Audit lead',phone:'0000000000',at:'2026-10-29T00:00:00Z',answers:META_AUDIT_QUESTIONS.map(q=>({id:q.id,question:q.label,answer:'Not answered'}))});
const start=psid=>({sender:{id:psid},timestamp:1,referral:{ref:AUDIT_CHAT_REF}});
const email=(psid,address)=>({sender:{id:psid},timestamp:2,message:{mid:'email-'+psid,text:address}});
const answer=(psid,id,index,value=0)=>({sender:{id:psid},message:{mid:`answer-${psid}-${index}`,quick_reply:{payload:`FSA:${id}:${index}:${value}`}}});
async function connected(store,id='1234567890123456',psid='5555555555',now=1000) {
  const contact=lead(id);await initialiseAuditChat(contact,store,now);
  await processAuditEvent(start(psid),{store,send:async()=>{},now});
  await processAuditEvent(email(psid,contact.email),{store,send:async()=>{},now});
  return contact;
}

test('contact is durable before questions; retries cannot erase collected answers',async()=>{
  const store=memory(),contact=await connected(store);let saved=0;
  await processAuditEvent(answer('5555555555',contact.id,0),{store,now:1100,send:async()=>{},save:async input=>{
    saved++;assert.equal((await store.get('lead:'+contact.id)).lead.answers[0].answer,'Electrical');return true;
  }});
  await initialiseAuditChat(contact,store,2000);
  const state=await store.get('lead:'+contact.id);
  assert.equal(saved,1);assert.equal(state.index,1);assert.equal(state.lead.email,contact.email);assert.equal(state.lead.answers[0].answer,'Electrical');
});

test('each of ten replies is saved separately to the matched contact with booking on every step',async()=>{
  const store=memory(),contact=await connected(store);const snapshots=[],messages=[];
  await initialiseAuditChat(lead('9999999999999999','other@example.invalid'),store,1000);
  for(let i=0;i<10;i++) {
    await processAuditEvent(answer('5555555555',contact.id,i),{store,now:2000+i,send:async(p,m)=>messages.push(m),save:async input=>{snapshots.push(structuredClone(input));return true;}});
    assert.equal(snapshots[i].answers.filter(a=>a.answer!=='Not answered').length,i+1);
    assert.equal(snapshots[i].email,contact.email);
  }
  assert.equal(snapshots.length,10);assert.equal(messages.filter(m=>m.attachment?.payload?.buttons?.[0]?.url.includes('calendly.com')).length,10);
  assert.equal((await store.get('lead:9999999999999999')).index,0);
});

test('unrelated Page chats and other Pages never enter the audit queue',async()=>{
  const store=memory(),queue=memory();
  assert.equal(await enqueueAuditEvents({object:'page',entry:[{id:'12345',messaging:[email('5555555555','x@example.invalid')]}]},{store,queue,pageId:'12345'}),0);
  assert.equal(await enqueueAuditEvents({object:'page',entry:[{id:'98765',messaging:[start('5555555555')]}]},{store,queue,pageId:'12345'}),0);
  assert.equal(queue.map.size,0);
});

test('only a submitted contact can attach a chat; a different email cannot create a CRM lead',async()=>{
  const store=memory();let saves=0;const messages=[];
  await processAuditEvent(start('5555555555'),{store,send:async(p,m)=>messages.push(m)});
  await processAuditEvent(email('5555555555','unknown@example.invalid'),{store,send:async(p,m)=>messages.push(m),save:async()=>{saves++;return true;}});
  assert.equal(saves,0);assert.equal((await store.get('sender:5555555555')).leadId,undefined);
  assert.match(messages.at(-1).text,/same email/);
});

test('a failed CRM save keeps the reply for retry without skipping a question',async()=>{
  const store=memory(),contact=await connected(store);const event=answer('5555555555',contact.id,0);
  await assert.rejects(processAuditEvent(event,{store,send:async()=>{},save:async()=>{throw Error('CRM down');},now:2000}));
  assert.equal((await store.get('lead:'+contact.id)).crmDirty,true);
  let saves=0;await processAuditEvent(event,{store,send:async()=>{},save:async()=>{saves++;return true;},now:3000});
  const state=await store.get('lead:'+contact.id);assert.equal(state.index,1);assert.equal(saves,1);assert.equal(state.crmDirty,false);
});

test('duplicate Meta events do not repeat a CRM answer or advance the next question',async()=>{
  const store=memory(),queue=memory(),contact=await connected(store);const event=answer('5555555555',contact.id,0);let saves=0;
  const body={object:'page',entry:[{id:'12345',messaging:[event]}]};
  await enqueueAuditEvents(body,{store,queue,pageId:'12345'});await enqueueAuditEvents(body,{store,queue,pageId:'12345'});
  assert.equal(queue.map.size,1);
  const dependencies={store,queue,send:async()=>{},save:async()=>{saves++;return true;},now:4000};
  await drainAuditEvents(dependencies);await drainAuditEvents(dependencies);
  assert.equal(saves,1);assert.equal((await store.get('lead:'+contact.id)).index,1);
});

test('a busy lead lock leaves the event queued instead of silently dropping its answer',async()=>{
  const store=memory(),queue=memory(),contact=await connected(store);
  await store.setJSON('lock:lead:'+contact.id,{until:999999});
  await enqueueAuditEvents({object:'page',entry:[{id:'12345',messaging:[answer('5555555555',contact.id,0)]}]},{store,queue,pageId:'12345'});
  const result=await drainAuditEvents({store,queue,now:2000,send:async()=>{},save:async()=>true});
  assert.equal(result.failed,1);assert.equal([...queue.map.values()][0].data.status,'pending');
});

test('no-answer leads still notify after two minutes and repeat ticks send no duplicate',async()=>{
  const store=memory();await initialiseAuditChat(lead(),store,1000);const texts=[];
  const deps={store,send:async text=>{texts.push(text);return {message_id:42};},edit:async()=>{throw Error('unexpected edit');}};
  assert.equal((await flushAuditDigests({...deps,now:1000+QUIET_MS-1})).sent,0);
  assert.equal((await flushAuditDigests({...deps,now:1000+QUIET_MS})).sent,1);
  assert.equal((await flushAuditDigests({...deps,now:1000+QUIET_MS+60000})).sent,0);
  assert.equal(texts.length,1);assert.match(texts[0],/^New lead form/);assert.match(texts[0],/audit-test@example.invalid/);assert.match(texts[0],/No optional answers yet/);
});

test('timer waits after the last answer, includes partial answers and edits the original Telegram message for late replies',async()=>{
  const store=memory(),contact=await connected(store);const sent=[],edits=[];
  const deps={store,send:async text=>{sent.push(text);return {message_id:42};},edit:async(id,text)=>edits.push({id,text})};
  await processAuditEvent(answer('5555555555',contact.id,0),{store,now:30000,send:async()=>{},save:async()=>true});
  assert.equal((await flushAuditDigests({...deps,now:149999})).sent,0);
  await flushAuditDigests({...deps,now:150000});assert.equal(sent.length,1);assert.match(sent[0],/Answers: 1\/10/);assert.match(sent[0],/Electrical/);
  await processAuditEvent(answer('5555555555',contact.id,1),{store,now:160000,send:async()=>{},save:async()=>true});
  await flushAuditDigests({...deps,now:280000});assert.equal(sent.length,1);assert.equal(edits.length,1);assert.equal(edits[0].id,42);assert.match(edits[0].text,/Fergus/);
});

test('ten-minute deadline sends a summary even if the person is still answering',async()=>{
  const store=memory(),contact=await connected(store);await processAuditEvent(answer('5555555555',contact.id,0),{store,now:MAX_WAIT_MS,send:async()=>{},save:async()=>true});
  const result=await flushAuditDigests({store,now:1000+MAX_WAIT_MS,send:async()=>({message_id:1})});assert.equal(result.sent,1);
});

test('failed Telegram delivery stays pending for retry',async()=>{
  const store=memory();await initialiseAuditChat(lead(),store,1000);
  assert.equal((await flushAuditDigests({store,now:200000,send:async()=>{throw Error('down');}})).failed,1);
  assert.equal((await store.get('lead:1234567890123456')).notifiedRevision,-1);
  assert.equal((await flushAuditDigests({store,now:210000,send:async()=>({message_id:2})})).sent,1);
});

test('skipping a question does not retry an unchanged Telegram message forever',async()=>{
  const store=memory(),contact=await connected(store);
  const dependencies={store,send:async()=>({message_id:42}),edit:async()=>{throw Error('Telegram: message is not modified');}};
  await processAuditEvent(answer('5555555555',contact.id,0),{store,now:2000,send:async()=>{},save:async()=>true});
  await flushAuditDigests({...dependencies,now:2000+QUIET_MS});
  await processAuditEvent(answer('5555555555',contact.id,1,'skip'),{store,now:130000,send:async()=>{},save:async()=>true});
  const result=await flushAuditDigests({...dependencies,now:130000+QUIET_MS});
  assert.equal(result.failed,0);assert.equal(result.updated,0);
  const state=await store.get('lead:'+contact.id);assert.equal(state.notifiedRevision,state.revision);
});

test('a skipped question advances without inventing an answer; old buttons cannot overwrite a later answer',async()=>{
  const store=memory(),contact=await connected(store);let saves=0;
  const deps={store,send:async()=>{},save:async()=>{saves++;return true;},now:2000};
  await processAuditEvent(answer('5555555555',contact.id,0,'skip'),deps);
  await processAuditEvent(answer('5555555555',contact.id,0,0),deps);
  const state=await store.get('lead:'+contact.id);assert.equal(state.index,1);assert.equal(state.lead.answers[0].answer,'Not answered');assert.equal(saves,1);
});

test('webhook signatures reject tampering and the endpoint fails closed without its secret',async()=>{
  const raw='{"object":"page"}',secret='unit-test-secret';const sig='sha256='+createHmac('sha256',secret).update(raw).digest('hex');
  assert.equal(verifyMessengerSignature(raw,sig,secret),true);assert.equal(verifyMessengerSignature(raw+' ',sig,secret),false);assert.equal(verifyMessengerSignature(raw,sig,''),false);
  const before=process.env.META_APP_SECRET;delete process.env.META_APP_SECRET;
  try { assert.equal((await webhook(new Request('https://example.invalid/webhook',{method:'POST',body:raw}))).status,503); }
  finally {if(before===undefined)delete process.env.META_APP_SECRET;else process.env.META_APP_SECRET=before;}
});

test('every question offers valid choices, a skip and a real booking URL',()=>{
  for(let i=0;i<10;i++) {
    const messages=auditQuestionMessages({lead:lead(),index:i});assert.equal(messages[0].quick_replies.length,META_AUDIT_QUESTIONS[i].options.length+1);
    assert.ok(messages[0].quick_replies.every(q=>q.title.length<=20));assert.match(messages[1].attachment.payload.buttons[0].url,/^https:\/\/calendly.com\/ivan-flowstate\/30min/);
  }
});
