/* /quote-machine/: video, then two booking steps in one card.
   1. Contact details post to the "quote-machine" Netlify form (lead saved, alert held, Meta Lead).
   2. Calendly opens prefilled with their name and email; a booking goes to /quote-machine/booked/.
   Contact details never enter browser storage or analytics. They go to Calendly only to prefill it. */
(() => {
  const params = new URLSearchParams(location.search);
  const production = ['flowstate.net.nz', 'www.flowstate.net.nz'].includes(location.hostname);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  // Campaign fields only, kept for the visit so a reload still credits the ad.
  const captured = {};
  keys.concat('ad_id').forEach(key => { if (params.has(key)) captured[key] = params.get(key).slice(0, 200); });
  let previous = {};
  try { previous = JSON.parse(sessionStorage.getItem('flowstate-ad-source') || '{}'); } catch {}
  const tracking = Object.keys(captured).length ? captured : previous;
  if (!tracking.ad_id && /^\d{8,30}$/.test(tracking.utm_content || '')) tracking.ad_id = tracking.utm_content;
  if (Object.keys(captured).length) { try { sessionStorage.setItem('flowstate-ad-source', JSON.stringify(captured)); } catch {} }
  if (/^\d{8,30}$/.test(tracking.ad_id || '')) tracking.utm_content = tracking.ad_id;
  const calendly = document.querySelector('.booking a[href^="https://calendly.com/"]');
  if (calendly) {
    const url = new URL(calendly.href);
    keys.forEach(key => { if (tracking[key]) url.searchParams.set(key, tracking[key]); });
    calendly.href = url.toString();
  }

  /* The video plays muted as a preview (captions are burned in). The first tap anywhere on it
     restarts from the top with sound. If the browser blocks the muted preview, the same tap starts it. */
  const vsl = document.querySelector('video.vsl');
  const play = document.querySelector('.vsl-play');
  if (vsl && play) {
    const quiet = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!quiet) vsl.play().catch(() => {});
    play.addEventListener('click', () => {
      vsl.muted = false;
      vsl.currentTime = 0;
      vsl.controls = true;
      vsl.play().catch(() => {});
      play.hidden = true;
    });
    vsl.addEventListener('volumechange', () => { if (!vsl.muted) { play.hidden = true; vsl.controls = true; } });
  }

  const form = document.querySelector('form[name="quote-machine"]');
  const booking = document.querySelector('.booking[data-after-lead]');
  if (!form || !booking) return;
  keys.concat('ad_id').forEach(key => { const field = form.elements.namedItem(key); if (field) field.value = tracking[key] || ''; });
  form.elements.namedItem('landing_path').value = location.pathname;
  const feedback = form.querySelector('.feedback');
  const submit = form.querySelector('button[type=submit]');
  const name = form.elements.namedItem('name');
  const email = form.elements.namedItem('email');
  const phone = form.elements.namedItem('phone');
  const smooth = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

  function validate() {
    name.setCustomValidity(name.value.trim() ? '' : 'Please enter your name.');
    email.setCustomValidity(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? '' : 'Please enter a complete email address.');
    const number = phone.value.trim();
    const digits = number.replace(/\D/g, '');
    const plausible = /^\+?[\d\s().-]+$/.test(number) && digits.length >= 7 && digits.length <= 15;
    phone.setCustomValidity(plausible ? '' : 'Enter a phone number with 7 to 15 digits, including the area or mobile prefix.');
  }
  form.addEventListener('input', validate);

  const post = target => fetch(target.getAttribute('action') || location.pathname, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams(new FormData(target)).toString(),
  });

  // Step 2: Calendly, prefilled. booking.js builds the widget when it hears flowstate:lead.
  let opened = false;
  function toCalendar() {
    if (opened) return;
    opened = true;
    form.hidden = true;
    const url = new URL(calendly.href);
    // The event asks first and last name separately, then the phone as its first question (a1).
    const [first, ...rest] = name.value.trim().split(/\s+/);
    url.searchParams.set('name', name.value.trim());
    url.searchParams.set('first_name', first);
    if (rest.length) url.searchParams.set('last_name', rest.join(' '));
    url.searchParams.set('email', email.value.trim());
    // Calendly's phone field wants an international number: 021 123 4567 becomes +64211234567.
    let digits = phone.value.trim().replace(/[^\d+]/g, '');
    if (digits.startsWith('00')) digits = `+${digits.slice(2)}`;
    if (/^0\d{7,}$/.test(digits)) digits = `+64${digits.slice(1)}`;
    if (/^\d{8,15}$/.test(digits)) digits = `+${digits}`;
    url.searchParams.set('a1', digits);
    calendly.href = url.toString();
    booking.hidden = false;
    document.getElementById('book-call')?.setAttribute('aria-labelledby', 'calendar-title');
    document.dispatchEvent(new CustomEvent('flowstate:lead'));
    booking.scrollIntoView({behavior: smooth(), block: 'start'});
    document.getElementById('calendar-title')?.focus({preventScroll: true});
  }

  // A confirmed booking (booking.js has already sent Meta Schedule) goes to the thank-you page.
  document.addEventListener('flowstate:booked', event => {
    const id = uri => String(uri || '').split('/').pop();
    const next = new URLSearchParams({event: id(event.detail?.event?.uri), invitee: id(event.detail?.invitee?.uri)});
    setTimeout(() => { location.href = `/quote-machine/booked/?${next}`; }, 600);
  });

  let sent = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sent) return;
    validate();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (!production) {
      sent = true;
      feedback.textContent = 'Preview only: your details have not been sent.';
      setTimeout(toCalendar, 700);
      return;
    }
    submit.disabled = true;
    feedback.textContent = 'Sending…';
    try {
      const res = await post(form);
      if (!res.ok) throw new Error(String(res.status));
      sent = true;
      if (typeof window.fbq === 'function') {
        const id = window.crypto?.randomUUID ? crypto.randomUUID() : String(Date.now());
        window.fbq('track', 'Lead', {content_name: 'Quote Machine'}, {eventID: `lead-${id}`});
      }
      toCalendar();
    } catch {
      // Don't lose the booking over a failed save: carry on, and give them Ivan's number.
      sent = true;
      const notice = booking.querySelector('.booking-notice');
      if (notice) {
        notice.textContent = "Your details didn’t save, but you can still book below. Or call Ivan on 027 200 6121.";
        notice.hidden = false;
      }
      toCalendar();
    }
  });
})();
