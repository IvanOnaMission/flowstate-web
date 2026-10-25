/* /quote-machine/booked/: shows the call time with calendar and reschedule links.
   The page only has Calendly's booking ids; booking-details looks the rest up server-side.
   Without them (or if the lookup fails) the page still reads fine and points to the email. */
(() => {
  const params = new URLSearchParams(location.search);
  const event = params.get('event') || '';
  const invitee = params.get('invitee') || '';
  if (!event || !invitee) return;
  const $ = selector => document.querySelector(selector);

  const stamp = date => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const title = 'Quote Machine call with Ivan (Flowstate)';

  fetch(`/.netlify/functions/booking-details?${new URLSearchParams({event, invitee})}`)
    .then(res => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
    .then(call => {
      const start = new Date(call.start);
      const end = new Date(call.end || start.getTime() + 30 * 60000);
      if (isNaN(start)) return;
      if (call.first_name) $('[data-first-name]').textContent = `, ${call.first_name}`;
      $('[data-when]').textContent = start.toLocaleString('en-NZ', {
        weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit',
      });
      const where = $('[data-where]');
      where.textContent = call.join_url ? 'The call link is in your confirmation email and calendar invite.' : 'Ivan will call you on the number you gave.';
      where.hidden = false;

      const details = `How you quote now, where your prices live, and whether the Quote Machine fits your business.${call.join_url ? `\n\nJoin: ${call.join_url}` : ''}${call.reschedule_url ? `\n\nReschedule: ${call.reschedule_url}` : ''}`;
      const google = new URL('https://calendar.google.com/calendar/render');
      google.search = new URLSearchParams({action: 'TEMPLATE', text: title, dates: `${stamp(start)}/${stamp(end)}`, details, ...(call.join_url ? {location: call.join_url} : {})}).toString();
      const calendar = $('[data-calendar]');
      calendar.href = google.toString();
      calendar.target = '_blank';
      calendar.rel = 'noopener';
      calendar.hidden = false;

      const ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Flowstate//Quote Machine//EN', 'BEGIN:VEVENT',
        `UID:${invitee}@flowstate.net.nz`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
        `SUMMARY:${title}`, `DESCRIPTION:${details.replace(/\n/g, '\\n').replace(/[,;]/g, m => `\\${m}`)}`,
        ...(call.join_url ? [`LOCATION:${call.join_url}`] : []), 'END:VEVENT', 'END:VCALENDAR',
      ].join('\r\n');
      const file = $('[data-ics]');
      file.href = URL.createObjectURL(new Blob([ics], {type: 'text/calendar'}));
      file.download = 'quote-machine-call.ics';
      file.hidden = false;

      if (call.reschedule_url && call.reschedule_url.startsWith('https://calendly.com/')) {
        const move = $('[data-reschedule]');
        move.href = call.reschedule_url;
        move.target = '_blank';
        move.rel = 'noopener';
        move.hidden = false;
        $('[data-fallback]').textContent = 'Can’t make it? Use Reschedule above, or call Ivan on 027 200 6121.';
      }
    })
    .catch(() => {});
})();
