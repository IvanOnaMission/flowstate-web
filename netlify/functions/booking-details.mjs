// The /quote-machine/booked/ page asks this for the call time and the reschedule link.
//   GET /.netlify/functions/booking-details?event=<uuid>&invitee=<uuid>
// Both ids come from Calendly's own "event scheduled" message to the page and are
// unguessable. Only the time, first name and Calendly's links go back: no email or phone.
// Env: CALENDLY_TOKEN
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const json = (status, body) => new Response(JSON.stringify(body), {
  status, headers: {'content-type': 'application/json', 'cache-control': 'no-store'},
});

export default async (req) => {
  const url = new URL(req.url);
  const event = url.searchParams.get('event') || '';
  const invitee = url.searchParams.get('invitee') || '';
  if (!uuid.test(event) || !uuid.test(invitee)) return json(400, {error: 'bad booking reference'});
  const token = process.env.CALENDLY_TOKEN || process.env.Calendly_Token;
  if (!token) return json(503, {error: 'calendly not configured'});

  const get = async path => {
    const res = await fetch(`https://api.calendly.com/scheduled_events/${path}`, {headers: {authorization: `Bearer ${token}`}, redirect: 'error'});
    if (!res.ok) throw new Error(String(res.status));
    return (await res.json()).resource || {};
  };
  try {
    const [call, person] = await Promise.all([get(event), get(`${event}/invitees/${invitee}`)]);
    if (person.status !== 'active' || call.status !== 'active') return json(404, {error: 'booking not active'});
    return json(200, {
      start: call.start_time,
      end: call.end_time,
      first_name: String(person.first_name || person.name || '').trim().split(/\s+/)[0] || '',
      join_url: call.location?.join_url || '',
      reschedule_url: person.reschedule_url || '',
      cancel_url: person.cancel_url || '',
    });
  } catch (err) {
    console.error('booking-details lookup failed:', err.message);
    return json(502, {error: 'lookup failed'});
  }
};
