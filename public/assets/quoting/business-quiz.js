/* Personal answers stay in this form's memory until submitted to Netlify Forms.
   No answers or contact details go into URLs, browser storage or analytics. */
(() => {
  const section = document.querySelector('#business-quiz');
  if (!section) return;
  const form = section.querySelector('form');
  const steps = [...form.querySelectorAll('.quiz-step')];
  const back = form.querySelector('#quiz-back');
  const next = form.querySelector('#quiz-next');
  const error = form.querySelector('#quiz-error');
  const status = form.querySelector('#quiz-status');
  const preview = new URLSearchParams(location.search).get('quiz-preview') === '1';
  const production = !preview && ['flowstate.net.nz', 'www.flowstate.net.nz'].includes(location.hostname);
  let position = 0, opened = false, sending = false;

  function showStep(focus = true) {
    steps.forEach((step, index) => { step.hidden = index !== position; });
    form.querySelector('#quiz-position').textContent = String(position + 1);
    form.querySelector('#quiz-progress').value = position + 1;
    back.hidden = position === 0;
    next.textContent = position === steps.length - 1 ? 'Save my answers' : 'Continue';
    error.textContent = '';
    if (focus) steps[position].querySelector('legend').focus();
  }

  function open(booking) {
    if (opened || !booking?.invitee?.uri) return;
    opened = true;
    form.elements.namedItem('booking_invitee').value = booking.invitee.uri;
    form.elements.namedItem('booking_event').value = booking.event?.uri || '';
    const lead = document.querySelector('form[name="ai-makeover"]');
    ['name', 'email', 'phone'].forEach(key => {
      form.elements.namedItem(key).value = lead?.elements.namedItem(key)?.value || '';
    });
    section.hidden = false;
    showStep(false);
    // Keep the booking confirmation visible above the quiz.
    section.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
    section.querySelector('#quiz-title').focus({preventScroll: true});
    document.querySelector('video.vsl')?.pause();
  }
  document.addEventListener('flowstate:booked', event => open(event.detail));

  form.addEventListener('change', event => {
    if (event.target.type !== 'radio') return;
    const step = event.target.closest('.quiz-step');
    const other = step.querySelector('.quiz-other');
    const field = other.querySelector('textarea');
    const selected = event.target.value === 'Other';
    other.hidden = !selected;
    field.disabled = !selected;
    error.textContent = '';
    if (selected) field.focus();
  });
  back.addEventListener('click', () => { if (position > 0 && !sending) { position--; showStep(); } });

  function valid(step) {
    const choice = step.querySelector('input[type="radio"]:checked');
    if (!choice) {
      error.textContent = 'Choose an option to continue.';
      step.querySelector('input[type="radio"]').focus();
      return false;
    }
    if (choice.value === 'Other' && !step.querySelector('textarea').value.trim()) {
      error.textContent = 'Please type your answer, or choose another option.';
      step.querySelector('textarea').focus();
      return false;
    }
    return true;
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !valid(steps[position])) return;
    if (position < steps.length - 1) { position++; showStep(); return; }
    const invalid = steps.findIndex(step => !valid(step));
    if (invalid !== -1) { position = invalid; showStep(); valid(steps[position]); return; }
    if (!production) {
      form.hidden = true;
      const complete = section.querySelector('#quiz-complete');
      complete.hidden = false;
      complete.querySelector('h3').textContent = 'Preview complete.';
      complete.querySelector('p').textContent = 'You’ve reached the end of the quiz. No call has been booked and no answers have been sent.';
      complete.querySelector('h3').focus();
      return;
    }
    sending = true;
    // Capture before disabling inputs, otherwise FormData omits them.
    const body = new URLSearchParams(new FormData(form)).toString();
    const enabled = [...form.querySelectorAll('input, textarea, button')].filter(el => !el.disabled);
    enabled.forEach(el => { el.disabled = true; });
    status.textContent = 'Saving your answers…';
    error.textContent = '';
    try {
      const response = await fetch(form.action, {method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body});
      if (!response.ok) throw new Error('Quiz submission failed');
      form.hidden = true;
      const complete = section.querySelector('#quiz-complete');
      complete.hidden = false;
      complete.querySelector('h3').focus();
    } catch {
      sending = false;
      enabled.forEach(el => { el.disabled = false; });
      status.textContent = '';
      error.textContent = 'Your answers haven’t saved yet. Please try again. Your call is still booked.';
    }
  });

  // The shareable preview uses the same questions, but never submits a form.
  if (preview) {
    section.querySelector('.step-label').textContent = 'Quiz preview';
    section.querySelector('#quiz-title + p').textContent = 'Try all six questions. This preview won’t book a call or save your answers.';
    form.querySelector('.small').textContent = 'Preview only — your answers won’t be sent.';
    open({invitee: {uri: 'preview'}});
  }
})();
