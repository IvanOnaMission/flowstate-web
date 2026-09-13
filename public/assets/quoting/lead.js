/* No contact details enter browser storage, analytics or booking URLs. */
(() => {
  const params = new URLSearchParams(location.search);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const form = document.querySelector('#lead-form');
  keys.forEach(key => {
    const input = form?.elements.namedItem(`fields[${key}]`);
    if (input) input.value = (params.get(key) || '').slice(0, 200);
  });
  document.querySelectorAll('a[href^="https://calendly.com/"]').forEach(link => {
    const url = new URL(link.href);
    keys.forEach(key => { if (params.has(key)) url.searchParams.set(key, params.get(key).slice(0, 200)); });
    link.href = url.toString();
  });
  const pendingKey = 'flowstate:quoting-submission';
  // Kit owns the redirect. Count only a recent same-tab submission returning
  // from Kit, not direct visits, download clicks, refreshes or booking clicks.
  if (!form) {
    if (location.pathname.replace(/\/$/, '') === '/quoting-workbook/start') {
      try {
        const pending = JSON.parse(sessionStorage.getItem(pendingKey) || 'null');
        sessionStorage.removeItem(pendingKey);
        const referrer = document.referrer ? new URL(document.referrer) : null;
        const age = pending ? Date.now() - pending.at : -1;
        if (['flowstate.net.nz','www.flowstate.net.nz'].includes(location.hostname)
            && (referrer?.origin === 'https://app.kit.com'
                || (referrer?.origin === location.origin && referrer.pathname.replace(/\/$/, '') === '/quoting-workbook'))
            && pending?.id && age >= 0 && age < 15 * 60 * 1000
            && typeof window.fbq === 'function') {
          window.fbq('track', 'Lead', {content_name: 'Quoting workbook'}, {eventID: pending.id});
        }
      } catch { /* Storage restrictions must never block workbook access. */ }
    }
    return;
  }
  try { sessionStorage.removeItem(pendingKey); } catch {}

  const name = form.elements.namedItem('fields[full_name]');
  const email = form.elements.namedItem('email_address');
  const phone = form.elements.namedItem('fields[phone]');
  const submit = form.querySelector('button[type=submit]');
  function validate() {
    name.setCustomValidity(name.value.trim() ? '' : 'Please enter your name.');
    const address = email.value.trim();
    email.setCustomValidity(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address) ? '' : 'Please enter a complete email address.');
    const number = phone.value.trim();
    const digits = number.replace(/\D/g, '');
    const plausible = /^\+?[\d\s().-]+$/.test(number) && digits.length >= 7 && digits.length <= 15;
    phone.setCustomValidity(plausible ? '' : 'Enter a phone number with 7–15 digits, including the area or mobile prefix.');
    submit.disabled = ![name,email,phone].every(field => field.validity.valid);
  }
  form.addEventListener('input', validate);
  form.addEventListener('change', validate);
  window.addEventListener('pageshow', validate);
  [name,email,phone].forEach(field => field.addEventListener('blur', () => {
    validate();
    if (field.value && !field.validity.valid) field.reportValidity();
  }));
  validate();
  form.addEventListener('submit', event => {
    validate();
    if (submit.disabled) { event.preventDefault(); form.reportValidity(); return; }
    if (!['flowstate.net.nz','www.flowstate.net.nz'].includes(location.hostname)) {
      event.preventDefault();
      document.querySelector('#feedback').textContent = 'Preview only — your details have not been sent.';
      return;
    }
    try {
      sessionStorage.setItem(pendingKey, JSON.stringify({id: crypto.randomUUID(), at: Date.now()}));
    } catch { /* Submission still works without tracking storage. */ }
    // Production uses native submission. Kit validates and redirects; no opaque fetch.
  });
})();
