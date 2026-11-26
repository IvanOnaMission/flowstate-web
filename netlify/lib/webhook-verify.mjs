// Confirms a webhook with the sender's own API when there is no shared secret, and returns
// only what that API says. Used by functions/lead-alert.mjs.
const UUID = '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}';
const INVITEE_URI = new RegExp(`^https://api\\.calendly\\.com/scheduled_events/${UUID}/invitees/${UUID}$`, 'i');
const EVENT_URI = new RegExp(`^https://api\\.calendly\\.com/scheduled_events/${UUID}$`, 'i');

// No signing key: rebuild the webhook body from Calendly's own records, so nothing the sender wrote is used.
// Returns null when the invitee isn't a real booking in this Calendly account.
export async function verifiedCalendlyBody(uri, apiToken, fetcher = fetch) {
  if (!INVITEE_URI.test(String(uri))) return null;
  const get = async u => {
    const res = await fetcher(u, {headers: {authorization: `Bearer ${apiToken}`}, redirect: 'error'});
    return res.ok ? (await res.json()).resource : null;
  };
  const invitee = await get(uri);
  if (!invitee || invitee.uri !== uri || !invitee.email) return null;
  const event = EVENT_URI.test(String(invitee.event)) ? await get(invitee.event) : null;
  return {
    event: invitee.status === 'canceled' ? 'invitee.canceled' : 'invitee.created',
    payload: {...invitee, scheduled_event: event ? {start_time: event.start_time, end_time: event.end_time} : undefined},
  };
}

// No webhook token: confirm the subscriber with Kit and use Kit's record, not the posted one.
export async function verifiedKitSubscriber(posted, apiKey, fetcher = fetch) {
  if (!/^\d+$/.test(String(posted?.id || ''))) return null;
  const res = await fetcher(`https://api.kit.com/v4/subscribers/${posted.id}`, {headers: {'x-kit-api-key': apiKey}, redirect: 'error'});
  if (!res.ok) return null;
  const s = (await res.json()).subscriber;
  if (!s || String(s.id) !== String(posted.id) || String(s.email_address || '').toLowerCase() !== String(posted.email_address || '').toLowerCase()) return null;
  return s;
}
