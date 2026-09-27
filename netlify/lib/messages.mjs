// The Telegram text for AI Makeover leads: who they are, whether they filled in the
// optional booking question, and a bit about them. The contact card follows separately.
export const clean = (value, max = 200) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

const about = lines => (lines?.length ? ['', 'ABOUT THEM', ...lines] : []);

export function formLeadMessage(lead, aboutLines = []) {
  return [
    'New AI Makeover lead (form, not booked yet)',
    clean(lead.name) || 'Unknown',
    `Phone: ${clean(lead.phone) || 'not given'}`,
    clean(lead.email),
    '',
    'Extra details: none yet (they only fill those in when they book)',
    ...about(aboutLines),
  ].join('\n');
}

// answers: Calendly's questions_and_answers minus the phone question.
export function bookedMessage({name, phone, email, when, answers = []}, aboutLines = []) {
  const filled = answers.filter(a => clean(a.answer));
  const extra = filled.length
    ? ['Extra details: FILLED IN', ...filled.map(a => `${clean(a.question)}\n"${clean(a.answer, 1000)}"`)]
    : ['Extra details: left blank'];
  return [
    'New call booked',
    clean(name) || 'Unknown',
    `Phone: ${clean(phone) || 'not given'}`,
    clean(email),
    when,
    '',
    ...extra,
    ...about(aboutLines),
  ].join('\n');
}
