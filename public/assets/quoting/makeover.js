/* Enquiry forms send to Netlify Forms without leaving the page, then reveal the calendar.
   No contact details enter browser storage, analytics or booking URLs. */
(() => {
  const params = new URLSearchParams(location.search);
  const production = params.get('quiz-preview') !== '1' && ['flowstate.net.nz', 'www.flowstate.net.nz'].includes(location.hostname);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  // Store campaign fields only; never store form contact details in the browser.
  const captured={};keys.concat('ad_id').forEach(key=>{if(params.has(key))captured[key]=params.get(key).slice(0,200);});
  let previous={};try{previous=JSON.parse(sessionStorage.getItem('flowstate-ad-source')||'{}');}catch{}
  const tracking=Object.keys(captured).length?captured:previous;
  if(!tracking.ad_id&&/^\d{8,30}$/.test(tracking.utm_content||''))tracking.ad_id=tracking.utm_content;
  if(Object.keys(captured).length){try{sessionStorage.setItem('flowstate-ad-source',JSON.stringify(captured));}catch{}}
  if(/^\d{8,30}$/.test(tracking.ad_id||''))tracking.utm_content=tracking.ad_id;
  // Ad UTMs override the page defaults on the booking link (booking.js reads it later).
  document.querySelectorAll('a[href^="https://calendly.com/"]').forEach(link => {
    const url = new URL(link.href);
    keys.forEach(key => { if (tracking[key]) url.searchParams.set(key, tracking[key]); });
    link.href = url.toString();
  });

  /* The VSL autoplays muted (browsers block sound until someone taps), captions are burned in.
     The button unmutes and restarts from the top so nothing is missed. */
  const vsl = document.querySelector('video.vsl');
  const sound = document.querySelector('.vsl-sound');
  if (vsl && sound) {
    // Show the tap target either way: if autoplay is refused, the same tap starts it with sound.
    sound.hidden = false;
    vsl.play().catch(() => {});
    sound.addEventListener('click', () => {
      vsl.muted = false;
      vsl.currentTime = 0;
      vsl.play();
      sound.hidden = true;
    });
    // Only the sound going on retires the tap target. A pause with the sound
    // still off means they stopped a silent video — the prompt still applies.
    vsl.addEventListener('volumechange', () => { if (!vsl.muted) sound.hidden = true; });
  }

  const form = document.querySelector('form[name="ai-makeover"]');
  if (!form) return;
  keys.concat('ad_id').forEach(key=>{const field=form.elements.namedItem(key);if(field)field.value=tracking[key]||'';});
  form.elements.namedItem('landing_path').value=location.pathname;
  const feedback = form.querySelector('#feedback');
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
    feedback.textContent = message;
    const box = document.querySelector('.booking[data-after-lead]');
    if (!box) return;
    box.hidden = false;
    box.classList.remove('locked');
    box.querySelector('.lock-note')?.remove();
    if (!revealed) document.dispatchEvent(new CustomEvent('flowstate:lead'));
    revealed = true;
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    box.scrollIntoView({behavior: smooth ? 'smooth' : 'auto', block: 'start'});
  }

  let sent = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sent) return;
    validate();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    if (!production) {
      reveal('Preview only — your details have not been sent.');
      return;
    }

    submit.disabled = true;
    feedback.textContent = 'Sending…';
    try {
      const res = await fetch(form.getAttribute('action') || location.pathname, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      sent = true;
      form.querySelectorAll('input, select, button').forEach(el => { el.disabled = true; });
      if (typeof window.fbq === 'function') {
        const id = window.crypto?.randomUUID ? crypto.randomUUID() : String(Date.now());
        window.fbq('track', 'Lead', {content_name: form.dataset.offer || (location.pathname.startsWith('/ai-makeover') ? 'AI Makeover' : 'Workflow diagnostic')}, {eventID: `lead-${id}`});
      }
      reveal('Thanks. Pick a time below.');
    } catch {
      submit.disabled = false;
      reveal("That didn't send. Pick a time below, or call Ivan on 027 200 6121.");
    }
  });
})();
