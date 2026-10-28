import {enqueueAuditEvents, drainAuditEvents, verifyMessengerSignature} from '../lib/meta-audit-chat.mjs';
import {importMetaLead, liveIntegrations, pollMetaAuditLeads} from '../lib/meta-audit-leads.mjs';
import {getStore} from '@netlify/blobs';

export default async request => {
  if (request.method==='GET') {
    const params=new URL(request.url).searchParams;
    if (process.env.META_MESSENGER_VERIFY_TOKEN && params.get('hub.mode')==='subscribe' && params.get('hub.verify_token')===process.env.META_MESSENGER_VERIFY_TOKEN) {
      return new Response(params.get('hub.challenge')||'',{headers:{'content-type':'text/plain'}});
    }
    return new Response('Forbidden',{status:403});
  }
  if (request.method!=='POST') return new Response('Method not allowed',{status:405});
  if (!process.env.META_APP_SECRET || !process.env.META_PAGE_ID) return new Response('Not configured',{status:503});
  const raw=await request.text();
  if (raw.length>1000000) return new Response('Payload too large',{status:413});
  if (!verifyMessengerSignature(raw,request.headers.get('x-hub-signature-256'),process.env.META_APP_SECRET)) return new Response('Forbidden',{status:403});
  let body; try { body=JSON.parse(raw); } catch { return new Response('Invalid JSON',{status:400}); }
  try {
    // Native form capture runs independently of whether the lead opens Messenger.
    for (const entry of body.entry||[]) {
      if (String(entry.id)!==process.env.META_PAGE_ID) continue;
      for (const change of entry.changes||[]) {
        const value=change.value||{};
        if (change.field!=='leadgen' || String(value.form_id)!==process.env.META_AUDIT_FORM_ID || !/^\d{8,30}$/.test(value.leadgen_id||'')) continue;
        const response=await fetch(`https://graph.facebook.com/v26.0/${value.leadgen_id}?fields=id,created_time,field_data,ad_id`,{headers:{authorization:`Bearer ${process.env.META_LEADS_TOKEN}`},signal:AbortSignal.timeout(10000),redirect:'error'});
        if (!response.ok) throw new Error('Native contact retrieval is pending.');
        const lead=await response.json();
        await importMetaLead(lead,getStore({name:'meta-audit-leads',consistency:'strong'}),liveIntegrations());
      }
    }
    await enqueueAuditEvents(body);
    const result=await drainAuditEvents({refresh:()=>pollMetaAuditLeads()});
    return new Response(result.failed?'Delivery pending':'EVENT_RECEIVED',{status:result.failed?503:200});
  } catch {
    console.error('Contact-first audit webhook delivery is pending.');
    return new Response('Delivery pending',{status:503});
  }
};
