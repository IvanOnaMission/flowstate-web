// Holding list for "form, not booked yet" alerts. A form lead sits here for a couple of
// minutes so they can pick a Calendly time; if the booking lands first, only the
// "New call booked" alert goes out. pending-lead-alerts.mjs drains the list every minute.
// Storage: Netlify Blobs store "pending-leads", one JSON blob per lead keyed by email.
import {getStore} from '@netlify/blobs';

export const DELAY_MS = Math.max(0, Number(process.env.LEAD_ALERT_DELAY_SECONDS || 120)) * 1000;
const store = () => getStore('pending-leads');

export function leadKey({email, phone}) {
  const mail = String(email ?? '').trim().toLowerCase();
  if (mail) return mail;
  const digits = String(phone ?? '').replace(/\D/g, '');
  return digits ? `phone:${digits}` : '';
}

export async function holdLead(lead, s = store()) {
  const key = leadKey(lead);
  if (!key) throw new Error('lead has no email or phone to key on');
  // A second form with the same email only fills gaps: it can't replace who Ivan is told to call.
  const waiting = await s.get(key, {type: 'json'});
  await s.setJSON(key, waiting ? {...lead, ...waiting} : {...lead, heldAt: Date.now()});
  return key;
}

// Removes a waiting form alert and returns it (or null), so a booking can reuse what it held.
export async function takeLead(lead, s = store()) {
  const key = leadKey(lead);
  if (!key) return null;
  const waiting = await s.get(key, {type: 'json'});
  if (!waiting) return null;
  await s.delete(key);
  return waiting;
}

// Returns true when a waiting form alert was cancelled by this booking.
export const releaseLead = async (lead, s = store()) => Boolean(await takeLead(lead, s));

// Leads that have waited at least minAgeMs, oldest first.
export async function dueLeads(minAgeMs = DELAY_MS, s = store(), now = Date.now()) {
  const {blobs = []} = await s.list();
  const due = [];
  for (const {key} of blobs) {
    const lead = await s.get(key, {type: 'json'});
    if (!lead) continue;
    if (now - Number(lead.heldAt || 0) >= minAgeMs) due.push({key, lead});
  }
  return due.sort((a, b) => Number(a.lead.heldAt) - Number(b.lead.heldAt));
}

export const forgetLead = (key, s = store()) => s.delete(key);

// Adds fields to a lead still waiting on the holding list, keeping its place in the queue.
// Returns false when the alert has already gone (or was never held).
export async function updateHeldLead(lead, patch, s = store()) {
  const key = leadKey(lead);
  if (!key) return false;
  const waiting = await s.get(key, {type: 'json'});
  if (!waiting) return false;
  await s.setJSON(key, {...waiting, ...patch});
  return true;
}
