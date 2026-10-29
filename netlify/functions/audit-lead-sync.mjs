import {pollMetaAuditLeads} from '../lib/meta-audit-leads.mjs';
import {drainAuditEvents, flushAuditDigests} from '../lib/meta-audit-chat.mjs';
import {flushWebAuditEffects} from '../lib/web-audit.mjs';
export const config = {schedule: '* * * * *'};
export default async () => {
  let meta, metaError = false;
  try { meta = await pollMetaAuditLeads(); }
  catch (error) { metaError = true; console.error('Meta audit lead delivery:', error.message); }
  let chat, digests, website;
  if(process.env.META_AUDIT_CONTACT_FIRST==='true') {
    try {
      chat=await drainAuditEvents({refresh:()=>pollMetaAuditLeads()});
      if(chat.failed)metaError=true;
    } catch {metaError=true;console.error('Contact-first audit recovery is pending.');}
  }
  try {
    website=await flushWebAuditEffects();
    digests=await flushAuditDigests();
    if(website.failed||digests.failed)metaError=true;
  }catch{metaError=true;console.error('Audit enquiry recovery is pending.');}
  return new Response(JSON.stringify({meta: meta || {error: true},chat,digests,website}), {status: metaError ? 503 : 200, headers: {'content-type': 'application/json'}});
};
