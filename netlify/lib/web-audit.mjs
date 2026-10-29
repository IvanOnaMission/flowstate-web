import {createHash, randomUUID} from 'node:crypto';
import {auditChatStore, withAuditLeadLease} from './meta-audit-chat.mjs';
import {META_AUDIT_QUESTIONS, metaAuditAnswers} from './meta-audit-questions.mjs';
import {twentyMetaProgress} from './twenty-crm.mjs';
import {addToKit} from './crm.mjs';
import {recordFormLead} from './ads-tracking.mjs';
import {trackingDatabase} from './tracking-server.mjs';

const COOKIE='__Host-fs-audit',LIFETIME=7*86400000;
const noncePattern=/^[a-f0-9]{64}$/;
export const webLeadKey=nonce=>'lead:web:'+createHash('sha256').update(nonce).digest('hex');
const clean=value=>String(value??'').replace(/\s+/g,' ').trim();
const json=(status,body,headers={})=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json','cache-control':'no-store','X-Robots-Tag':'noindex, nofollow',...headers}});
const tokenOf=request=>request.headers.get('cookie')?.match(/(?:^|;\s*)__Host-fs-audit=([a-f0-9]{64})(?:;|$)/)?.[1];
const view=state=>({saved:true,eventId:state.lead.id,index:state.index,answered:state.lead.answers.filter(a=>a.answer!=='Not answered').length,finished:state.index===10,question:state.index<10?META_AUDIT_QUESTIONS[state.index]:null,test:state.test===true});

function contactInput(data,now){
  const name=clean(data.name),email=clean(data.email).toLowerCase(),phone=clean(data.phone);
  if(data.company_website||!noncePattern.test(data.nonce||'')||!name||name.length>120||email.length>200||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||phone.length>40||!/^\+?[\d\s().-]+$/.test(phone)||!/^\d{7,15}$/.test(phone.replace(/\D/g,'')))return null;
  const attribution=Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].map(k=>[k,clean(data.attribution?.[k]).slice(0,200)]));
  return {id:randomUUID(),channel:'website',name,email,phone,at:new Date(now).toISOString(),ad_id:/^\d{8,30}$/.test(data.ad_id||'')?data.ad_id:'',attribution,answers:metaAuditAnswers([])};
}

async function syncContact(state,store,key,save){
  if(!state.crmDirty)return;
  try {if(!await save(state.lead))throw Error('CRM pending');state.crmDirty=false;}
  catch {state.crmDirty=true;}
  // Persist the CRM reference as well as the dirty flag. Accepted answers remain
  // durable even when CRM delivery needs the scheduled worker to retry.
  await store.setJSON(key,state);
}

export function createWebAuditHandler({store=auditChatStore,save=twentyMetaProgress,now=Date.now}={}){
  return async request=>{
    if(!['GET','POST'].includes(request.method))return json(405,{error:'Method not allowed'});
    if(request.method==='POST'&&request.headers.get('origin')!==new URL(request.url).origin)return json(403,{error:'Please use the enquiry form on this site.'});
    const db=typeof store==='function'?store():store,time=now();
    try {
      if(request.method==='GET'){
        const token=tokenOf(request),state=token&&await db.get(webLeadKey(token),{type:'json'});
        return json(200,state&&state.expiresAt>time?view(state):{saved:false});
      }
      if(!request.headers.get('content-type')?.startsWith('application/json'))return json(415,{error:'JSON required'});
      const raw=await request.text();if(raw.length>8192)return json(413,{error:'Request too large'});
      let data;try{data=JSON.parse(raw);}catch{return json(400,{error:'Invalid request'});}
      if(data.action==='restart')return json(200,{saved:false},{'set-cookie':`${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`});
      if(data.action==='contact'){
        const lead=contactInput(data,time);if(!lead)return json(400,{error:'Please enter your name, a valid email and phone number.'});
        const key=webLeadKey(data.nonce);let response;
        const handled=await withAuditLeadLease(db,key,time,async()=>{
          let state=await db.get(key,{type:'json'});
          if(state&&(state.lead.email!==lead.email||state.lead.name!==lead.name||state.lead.phone!==lead.phone)){response=json(409,{error:'Please reload and start a new enquiry.'});return;}
          const fresh=!state;
          if(!state){
            state={lead,index:0,startedAt:time,lastActivity:time,expiresAt:time+LIFETIME,revision:0,notifiedRevision:-1,crmDirty:true,test:lead.name.startsWith('[TEST]')&&lead.email.endsWith('@example.invalid'),webEffectsDone:{}};
            await db.setJSON(key,state,{onlyIfNew:true});
          }else{
            state.expiresAt=time+LIFETIME;
            await db.setJSON(key,state);
          }
          await syncContact(state,db,key,save);
          response=json(fresh?201:200,view(state),{'set-cookie':`${COOKIE}=${data.nonce}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${LIFETIME/1000}`});
        });
        return handled?response:json(409,{error:'Still saving. Please try again.',retryable:true});
      }
      const token=tokenOf(request);if(!token)return json(401,{error:'Save your contact details first.'});
      const key=webLeadKey(token);let response;
      const handled=await withAuditLeadLease(db,key,time,async()=>{
        const state=await db.get(key,{type:'json'});
        if(!state||state.expiresAt<=time){response=json(401,{error:'Please save your contact details again.'});return;}
        if(data.action==='answer'){
          const question=META_AUDIT_QUESTIONS[data.index];
          const answer=data.choice==='skip'?'Not answered':Number.isInteger(data.choice)&&question?.options[data.choice];
          if(!Number.isInteger(data.index)||!question||!answer){response=json(400,{error:'Please choose an answer or skip.'});return;}
          if(data.index<state.index&&state.lead.answers[data.index].answer===answer){await syncContact(state,db,key,save);response=json(200,view(state));return;}
          if(data.index!==state.index){response=json(409,{error:'Your saved question has changed. Reload to continue.'});return;}
          state.lead.answers[data.index]={id:question.id,question:question.label,answer};state.index++;
        }else if(data.action==='finish'){
          if(state.index===10){response=json(200,view(state));return;}
          state.index=10;
        }else{response=json(400,{error:'Invalid action'});return;}
        state.revision++;state.lastActivity=time;state.crmDirty=true;
        await db.setJSON(key,state); // Save the answer before attempting any provider call.
        await syncContact(state,db,key,save);
        response=json(200,view(state));
      });
      return handled?response:json(409,{error:'Still saving. Please try again.',retryable:true});
    }catch{
      return json(503,{error:'We could not confirm that save. Your earlier saved answers are safe. Please try again.'});
    }
  };
}

const liveEffects={
  tracking:async lead=>{
    const db=trackingDatabase();if(!db)throw Error('Reporting not configured');
    await recordFormLead(db,{...lead,...lead.attribution,ad_id:lead.ad_id,landing_path:'/audit-enquiry/'},lead.at);
  },
  kit:lead=>{
    if(!process.env.KIT_API_KEY)throw Error('Reminders not configured');
    return addToKit({...lead,tagId:process.env.KIT_TAG_MAKEOVER_LEAD,tagIds:[process.env.KIT_TAG_QUOTE_MACHINE_LEAD]});
  },
};
export async function flushWebAuditEffects({store=auditChatStore(),effects=liveEffects,now=Date.now()}={}){
  let failed=0;
  for await(const {blobs} of store.list({prefix:'lead:web:',paginate:true}))for(const {key} of blobs){
    await withAuditLeadLease(store,key,now,async()=>{
      const state=await store.get(key,{type:'json'});if(!state)return;
      state.webEffectsDone||={};
      for(const stage of ['tracking','kit']){
        if(state.webEffectsDone[stage])continue;
        try{if(!state.test)await effects[stage](state.lead);state.webEffectsDone[stage]=true;await store.setJSON(key,state);}
        catch{failed++;}
      }
    });
  }
  return {failed};
}
