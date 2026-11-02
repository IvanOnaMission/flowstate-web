// Reads stored Meta match keys for a later stage event. Failures stay empty
// so a booking alert still goes out. Nothing returned here is written to logs.
import {trackingDatabase} from './tracking-server.mjs';
import {readMetaMatch} from './twenty-crm.mjs';
import {acceptedMatch} from './meta-capi.mjs';

export async function loadStoredMatch(email) {
  const out = {};
  const normalised = String(email || '').trim().toLowerCase();
  const db = trackingDatabase();
  if (db && normalised) {
    try {
      const rows = await db.request(`mkt_leads?email=eq.${encodeURIComponent(normalised)}&select=tracking,phone,name&limit=1`);
      const row = rows?.[0] || {};
      Object.assign(out, acceptedMatch(row.tracking || {}));
      if (row.phone) out.phone = row.phone;
      if (row.name) out.name = row.name;
    } catch (error) {
      console.error('meta match lookup failed:', error.status || 'database');
    }
  }
  const crm = await readMetaMatch(normalised);
  const fromCrm = acceptedMatch({meta_lead_id: crm.metaLeadId, fbclid: crm.fbclid, fbc: crm.fbc, fbp: crm.fbp});
  Object.assign(out, fromCrm);
  if (crm.sourceRecordKind) out.sourceRecordKind = crm.sourceRecordKind;
  if (crm.phone && !out.phone) out.phone = crm.phone;
  if (crm.name && !out.name) out.name = crm.name;
  return out;
}
