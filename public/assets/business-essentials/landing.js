/* /essentials/ booking. Same two-step path as the other funnels: details post to the
   shared ai-makeover Netlify form, then Calendly opens. utm_campaign stays
   business-essentials even when the ad URL carries a different campaign.
   Contact details never enter browser storage or the pixel. */
(() => {
  const campaign = 'business-essentials';
  const params = new URLSearchParams(location.search);
  const production = ['flowstate.net.nz', 'www.flowstate.net.nz'].includes(location.hostname);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const form = document.querySelector('#essentials-booking');
  const booking = document.querySelector('.booking[data-after-lead]');
  if (!form || !booking) return;

  const tracked = {};
  keys.concat('ad_id').forEach(key => {
    if (params.has(key)) tracked[key] = params.get(key).slice(0, 200);
  });
  if (!tracked.ad_id && /^\d{8,30}$/.test(tracked.utm_content || '')) tracked.ad_id = tracked.utm_content;
  tracked.utm_campaign = campaign;

  keys.concat('ad_id').forEach(key => {
    const field = form.elements.namedItem(key);
    if (field && tracked[key]) field.value = tracked[key];
  });
  const campaignField = form.elements.namedItem('utm_campaign');
  if (campaignField) campaignField.value = campaign;

  document.querySelectorAll('a[href^="https://calendly.com/"]').forEach(link => {
    const url = new URL(link.href);
    keys.forEach(key => {
      if (key === 'utm_campaign') url.searchParams.set(key, campaign);
      else if (tracked[key]) url.searchParams.set(key, tracked[key]);
    });
    link.href = url.toString();
  });

  const landing = form.elements.namedItem('landing_path');
  if (landing) landing.value = location.pathname;

  function applyMetaClick() {
    if (typeof window.flowstateMetaClick !== 'function') return;
    let click = {};
    try { click = window.flowstateMetaClick() || {}; } catch { return; }
    for (const key of ['fbclid', 'fbc', 'fbp']) {
      const field = form.elements.namedItem(key);
      if (field) field.value = click[key] || '';
    }
  }
  applyMetaClick();

  const feedback = form.querySelector('[data-feedback]');
  const submit = form.querySelector('button[type=submit]');
  const name = form.elements.namedItem('name');
  const email = form.elements.namedItem('email');
  const phone = form.elements.namedItem('phone');

  function validate() {
    name.setCustomValidity(name.value.trim() ? '' : 'Please enter your name.');
    email.setCustomValidity(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? '' : 'Please enter a complete email address.');
    const number = phone.value.trim();
    const digits = number.replace(/\D/g, '');
    const plausible = /^\+?[\d\s().-]+$/.test(number) && digits.length >= 7 && digits.length <= 15;
    phone.setCustomValidity(plausible ? '' : 'Enter a phone number with 7–15 digits, including the area or mobile prefix.');
  }
  form.addEventListener('input', validate);

  let revealed = false;
  function reveal(message) {
    if (feedback) feedback.textContent = message;
    booking.hidden = false;
    if (!revealed) document.dispatchEvent(new CustomEvent('flowstate:lead'));
    revealed = true;
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    booking.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  }

  let sent = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sent) return;
    validate();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (campaignField) campaignField.value = campaign;

    if (!production) {
      sent = true;
      reveal('Preview only — your details have not been sent.');
      return;
    }

    submit.disabled = true;
    if (feedback) feedback.textContent = 'Sending…';
    try {
      applyMetaClick();
      if (campaignField) campaignField.value = campaign;
      const res = await fetch(form.getAttribute('action') || location.pathname, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      sent = true;
      form.querySelectorAll('input, select, button').forEach(el => { el.disabled = true; });
      if (typeof window.fbq === 'function') {
        const id = window.crypto?.randomUUID ? crypto.randomUUID() : String(Date.now());
        window.fbq('track', 'Lead', { content_name: 'Business Essentials' }, { eventID: `lead-${id}` });
      }
      reveal('Thanks. Pick a time below.');
    } catch {
      submit.disabled = false;
      reveal("That didn't send. Pick a time below, or call Ivan on 027 200 6121.");
    }
  });
})();
