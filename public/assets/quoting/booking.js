/* Inline Calendly booking. Meta Schedule fires only when Calendly confirms a booking,
   never on a button click or calendar view. No contact details are passed to the pixel. */
(() => {
  const box = document.querySelector('.booking');
  const link = box?.querySelector('a[href^="https://calendly.com/"]');
  if (!link) return;
  const path = location.pathname;
  const route = path.startsWith('/quote-machine') ? 'Quote Machine'
    : path.startsWith('/workflow-diagnostic') ? 'Workflow diagnostic'
    : path.startsWith('/essentials') ? 'Business Essentials'
    : path.startsWith('/quoting-workbook') ? 'Quoting workbook' : 'Quoting call';

  // The calendar opens after contact details; the quiz waits for a confirmed booking.
  if (box.hasAttribute('data-after-lead')) {
    document.addEventListener('flowstate:lead', build, {once: true});
    return;
  }
  build();

  function build() {
    // lead.js / makeover.js run first and have already copied any ad UTMs onto the link.
    const url = new URL(link.href);
    url.searchParams.set('hide_gdpr_banner', '1');
    url.searchParams.set('hide_event_type_details', '1');
    url.searchParams.set('hide_landing_page_details', '1');
    url.searchParams.set('background_color', '121722');
    url.searchParams.set('text_color', 'f4f4f2');
    url.searchParams.set('primary_color', '0079cc');

    box.id = 'book';
    const widget = document.createElement('div');
    widget.className = 'calendly-inline-widget';
    widget.dataset.url = url.toString();
    link.replaceWith(widget);
    const fallback = document.createElement('p');
    fallback.className = 'small';
    fallback.innerHTML = `Calendar not loading? <a href="${link.href}" target="_blank" rel="noopener">Open it in a new tab</a>.`;
    widget.after(fallback);
    document.querySelectorAll('a[href^="https://calendly.com/"]').forEach(other => {
      if (!box.contains(other)) other.href = '#book';
    });

    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);

    // Anonymous funnel steps help distinguish opening the calendar from completing a booking.
    // Accept Calendly messages only from this widget; never forward its contact payload to Meta.
    const stages = new Set();
    const stage = name => {
      if (route !== 'Quote Machine' || stages.has(name) || typeof window.fbq !== 'function') return;
      stages.add(name);
      window.fbq('trackCustom', name, {content_name: route});
    };
    stage('QuoteMachineCalendarOpened');
    let counted = false;
    window.addEventListener('message', event => {
      if (event.origin !== 'https://calendly.com' || event.source !== widget.querySelector('iframe')?.contentWindow) return;
      if (event.data?.event === 'calendly.event_type_viewed') stage('QuoteMachineCalendarLoaded');
      if (event.data?.event === 'calendly.date_and_time_selected') stage('QuoteMachineTimeSelected');
      if (event.data?.event !== 'calendly.event_scheduled' || counted) return;
      counted = true;
      document.dispatchEvent(new CustomEvent('flowstate:booked', {detail: event.data.payload}));
      const invitee = String(event.data.payload?.invitee?.uri || '').split('/').pop();
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Schedule', {content_name: route}, invitee ? {eventID: `booking-${invitee}`} : undefined);
      }
    });
  }
})();
