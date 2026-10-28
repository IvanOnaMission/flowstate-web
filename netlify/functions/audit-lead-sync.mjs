import {pollMetaAuditLeads} from '../lib/meta-audit-leads.mjs';
import {drainAuditEvents, flushAuditDigests} from '../lib/meta-audit-chat.mjs';
export const config = {schedule: '* * * * *'};
export default async () => {
  let meta, metaError = false;
  try { meta = await pollMetaAuditLeads(); }
  catch (error) { metaError = true; console.error('Meta audit lead delivery:', error.message); }
  let chat, digests;
  if(process.env.META_AUDIT_CONTACT_FIRST==='true') {
    try {
      chat=await drainAuditEvents({refresh:()=>pollMetaAuditLeads()});
      digests=await flushAuditDigests();
      if(chat.failed||digests.failed)metaError=true;
    } catch {metaError=true;console.error('Contact-first audit recovery is pending.');}
  }
  return new Response(JSON.stringify({meta: meta || {error: true},chat,digests}), {status: metaError ? 503 : 200, headers: {'content-type': 'application/json'}});
};
