import {pollMetaAuditLeads} from '../lib/meta-audit-leads.mjs';
export const config = {schedule: '* * * * *'};
export default async () => {
  let meta, metaError = false;
  try { meta = await pollMetaAuditLeads(); }
  catch (error) { metaError = true; console.error('Meta audit lead delivery:', error.message); }
  return new Response(JSON.stringify({meta: meta || {error: true}}), {status: metaError ? 503 : 200, headers: {'content-type': 'application/json'}});
};
