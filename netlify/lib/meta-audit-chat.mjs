import {createHash, createHmac, timingSafeEqual} from 'node:crypto';
import {getStore} from '@netlify/blobs';
import {META_AUDIT_QUESTIONS} from './meta-audit-questions.mjs';
import {twentyMetaProgress} from './twenty-crm.mjs';
import {sendAlert, editAlert} from './telegram.mjs';

export const AUDIT_CHAT_REF = 'fs_audit_v1';
export const AUDIT_BOOKING_URL = 'https://calendly.com/ivan-flowstate/30min?utm_source=facebook&utm_medium=messenger&utm_campaign=quote-machine';
export const QUIET_MS = 120000;
export const MAX_WAIT_MS = 600000;
const hash = value => createHash('sha256').update(String(value)).digest('hex');
const emailKey = email => 'email:'+hash(String(email).trim().toLowerCase());
const leadKey = id => 'lead:'+id;
const senderKey = psid => 'sender:'+psid;
const json = (store, key) => store.get(key, {type:'json'});
export const auditChatStore = () => getStore({name:'meta-audit-chat',consistency:'strong'});
export const auditEventStore = () => getStore({name:'meta-audit-chat-events',consistency:'strong'});

export function verifyMessengerSignature(raw, signature, secret) {
  if (!secret || !/^sha256=[a-f0-9]{64}$/.test(signature||'')) return false;
  const expected = createHmac('sha256',secret).update(raw).digest();
  return timingSafeEqual(expected,Buffer.from(signature.slice(7),'hex'));
}

// Shared leases prevent a webhook retry and the scheduled recovery worker from
// advancing the same person's conversation or sending a digest concurrently.
async function leased(store, key, now, action) {
  const k='lock:'+key, old=await store.getWithMetadata(k,{type:'json'});
  if (old?.data?.until>now) return false;
  const claim=await store.setJSON(k,{until:now+90000},old?{onlyIfMatch:old.etag}:{onlyIfNew:true});
  if (!claim.modified) return false;
  try { await action(); return true; }
  finally { await store.setJSON(k,{until:0},{onlyIfMatch:claim.etag}); }
}
export {leased as withAuditLeadLease};

export async function initialiseAuditChat(lead, store=auditChatStore(), now=Date.now()) {
  const state={lead, index:0, startedAt:now, lastActivity:now, revision:0, crmDirty:false, notifiedRevision:-1};
  await store.setJSON(leadKey(lead.id),state,{onlyIfNew:true});
  const previous=await json(store,emailKey(lead.email));
  if (!previous || Date.parse(lead.at)>=Date.parse(previous.at)) {
    await store.setJSON(emailKey(lead.email),{id:lead.id,at:lead.at});
  }
  return lead.id;
}

const isStart = event => [event.referral?.ref,event.postback?.referral?.ref,event.message?.referral?.ref].includes(AUDIT_CHAT_REF)
  || event.postback?.payload==='FS_AUDIT_START';
const textOf = event => String(event.message?.text||'').trim();
const payloadOf = event => String(event.message?.quick_reply?.payload||event.postback?.payload||'');
const validEmail = text => text.length<=200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);

export async function enqueueAuditEvents(body,{store=auditChatStore(),queue=auditEventStore(),pageId=process.env.META_PAGE_ID,now=Date.now()}={}) {
  if (body.object!=='page' || !pageId) return 0;
  let count=0;
  for (const entry of body.entry||[]) {
    if (String(entry.id)!==String(pageId)) continue;
    for (const event of entry.messaging||[]) {
      const psid=String(event.sender?.id||'');
      if (!/^\d{5,30}$/.test(psid) || event.message?.is_echo || (!event.message && !event.postback && !event.referral)) continue;
      // Ignore unrelated Page conversations, delivery/read events and all echoes.
      if (!isStart(event) && !await json(store,senderKey(psid))) continue;
      const id=event.message?.mid||event.postback?.mid||`${psid}:${event.timestamp}:${JSON.stringify(event.referral||event.postback||{})}`;
      const key=hash(id), existing=await json(queue,key);
      if (!existing) {
        await queue.setJSON(key,{event,receivedAt:now,status:'pending'},{onlyIfNew:true});
        count++;
      }
    }
  }
  return count;
}

const bookingMessage = (text='You can book your free 30-minute audit at any point.',quickReplies) => ({attachment:{type:'template',payload:{template_type:'button',text,buttons:[{type:'web_url',title:'Book my 30-min audit',url:AUDIT_BOOKING_URL}]}},...(quickReplies?{quick_replies:quickReplies}:{})});
const shortTitle = option => ({'Already have some automations':'Have automations','Keeping up with enquiries':'Keeping up with leads','We follow up when we remember':'When we remember','Over the next few months':'Next few months','We have automatic follow-up':'Automatic follow-up','We wait for the customer':'Wait for customer','Once a quote is sent':'After sending'}[option]||option).slice(0,20);
export function auditQuestionMessages(state) {
  const q=META_AUDIT_QUESTIONS[state.index];
  if (!q) return [{text:'Thanks, that gives me a useful picture of your business. Your answers are saved with your enquiry. — Ivan'},bookingMessage()];
  return [bookingMessage(`${state.index+1} of 10 · Optional\n${q.label}`,[...q.options.map((option,index)=>({content_type:'text',title:shortTitle(option),payload:`FSA:${state.lead.id}:${state.index}:${index}`})),{content_type:'text',title:'Skip this question',payload:`FSA:${state.lead.id}:${state.index}:skip`}])];
}

export async function sendMessenger(psid,message,{token=process.env.META_MESSENGER_TOKEN,pageId=process.env.META_PAGE_ID,fetcher=fetch}={}) {
  if (!token || !pageId) throw new Error('Messenger connection is not configured.');
  const response=await fetcher(`https://graph.facebook.com/v26.0/${pageId}/messages`,{method:'POST',headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},body:JSON.stringify({recipient:{id:psid},messaging_type:'RESPONSE',message}),signal:AbortSignal.timeout(10000),redirect:'error'});
  if (!response.ok) throw new Error(`Messenger delivery failed (${response.status}).`);
  const result=await response.json();
  if (result.error || !result.message_id) throw new Error('Messenger did not confirm delivery.');
  return result.message_id;
}

export async function processAuditEvent(event,{store=auditChatStore(),send=sendMessenger,save=twentyMetaProgress,refresh=async()=>{},now=Date.now()}={}) {
  const psid=String(event.sender.id), previous=await json(store,senderKey(psid));
  if (!previous && !isStart(event)) return;
  if (!previous?.leadId) {
    await store.setJSON(senderKey(psid),{startedAt:previous?.startedAt||now});
    const email=textOf(event).toLowerCase();
    if (validEmail(email) && !isStart(event)) {
      let pointer=await json(store,emailKey(email));
      if (!pointer) { await refresh(); pointer=await json(store,emailKey(email)); }
      if (!pointer) {
        await send(psid,{text:'Please use the same email you submitted on the lead form so I can save your answers with your enquiry.'});
        return;
      }
      await store.setJSON(senderKey(psid),{leadId:pointer.id,startedAt:previous?.startedAt||now});
      const state=await json(store,leadKey(pointer.id));
      for (const message of auditQuestionMessages(state)) await send(psid,message);
      return;
    }
    await send(psid,bookingMessage('Your enquiry is in. Tap your email below so I can add these optional answers to the same record. If it differs from the form, type the email you used there.',[{content_type:'user_email'}]));
    return;
  }
  const handled=await leased(store,leadKey(previous.leadId),now,async()=>{
    const state=await json(store,leadKey(previous.leadId));
    if (!state) throw new Error('Audit contact record is not available.');
    const match=/^FSA:(\d+):(\d+):(\d+|skip)$/.exec(payloadOf(event));
    if (match && match[1]===state.lead.id && Number(match[2])===state.index && state.index<10) {
      const q=META_AUDIT_QUESTIONS[state.index], choice=match[3]==='skip'?'Not answered':q.options[Number(match[3])];
      if (!choice) throw new Error('Invalid audit answer.');
      state.lead.answers[state.index]={id:q.id,question:q.label,answer:choice};
      state.index++; state.lastActivity=now; state.revision++; state.crmDirty=true;
      await store.setJSON(leadKey(state.lead.id),state);
    } else if (!isStart(event) && !state.crmDirty) {
      await send(psid,{text:'Use one of the answer buttons below, or skip the question. You can stop whenever you like.'});
    }
    if (state.crmDirty) {
      if (!await save(state.lead)) throw new Error('CRM answer delivery is pending.');
      state.crmDirty=false;
      await store.setJSON(leadKey(state.lead.id),state);
    }
    for (const message of auditQuestionMessages(state)) await send(psid,message);
  });
  if (!handled) throw new Error('Audit answer is waiting for the active worker.');
}

export async function drainAuditEvents({store=auditChatStore(),queue=auditEventStore(),now=Date.now(),...dependencies}={}) {
  let processed=0,failed=0;
  for await (const {blobs} of queue.list({paginate:true})) {
    for (const {key} of blobs) {
      const item=await json(queue,key);
      if (!item || item.status==='done') continue;
      const psid=String(item.event.sender.id);
      try {
        await leased(store,senderKey(psid),now,async()=>{
          await processAuditEvent(item.event,{store,now,...dependencies});
          await queue.setJSON(key,{...item,status:'done'});
          processed++;
        });
      } catch { failed++; }
      if (processed+failed>=12) return {processed,failed};
    }
  }
  return {processed,failed};
}

export function auditDigest(state) {
  const lead=state.lead, answered=lead.answers.filter(a=>a.answer!=='Not answered');
  return [`${state.test?'[TEST] ':''}New lead form`,lead.name||'Name not supplied',`Email: ${lead.email}`,`Phone: ${lead.phone||'Not supplied'}`,`Answers: ${answered.length}/10${state.index===10?' · Questions finished':''}`,'',...(answered.length?answered.map(a=>`${a.question}\n${a.answer}`):['No optional answers yet. Contact details are saved in the CRM.'])].join('\n\n').slice(0,3900);
}

export async function flushAuditDigests({store=auditChatStore(),send=sendAlert,edit=editAlert,save=twentyMetaProgress,now=Date.now()}={}) {
  let sent=0,updated=0,failed=0;
  for await (const {blobs} of store.list({prefix:'lead:',paginate:true})) {
    for (const {key} of blobs) {
      try {
        await leased(store,key,now,async()=>{
          const state=await json(store,key);
          if (state.crmDirty) {
            if (!await save(state.lead)) throw new Error('CRM answer delivery is pending.');
            state.crmDirty=false; await store.setJSON(key,state);
          }
          if (state.notifiedRevision===state.revision) return;
          const quiet=now-state.lastActivity>=QUIET_MS;
          const deadline=!state.telegramMessageId && now-state.startedAt>=MAX_WAIT_MS;
          if (!quiet && !deadline) return;
          const text=auditDigest(state);
          if(state.telegramMessageId && state.lastDigestText===text) {
            state.notifiedRevision=state.revision;await store.setJSON(key,state);return;
          }
          if (state.telegramMessageId) { await edit(state.telegramMessageId,text); updated++; }
          else { const result=await send(text); if (!result?.message_id) throw new Error('Telegram did not confirm delivery.'); state.telegramMessageId=result.message_id; sent++; }
          state.lastDigestText=text;state.notifiedRevision=state.revision; await store.setJSON(key,state);
        });
      } catch { failed++; }
    }
  }
  return {sent,updated,failed};
}
