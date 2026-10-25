// The Telegram text for AI Makeover leads: who they are, whether they filled in the
// optional booking question, and a bit about them. The contact card follows separately.
import {answerLines} from './quote-machine.mjs';

export const clean = (value, max = 200) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

const about = lines => (lines?.length ? ['', 'ABOUT THEM', ...lines] : []);
// Quote Machine leads carry their four tap answers and the ad they came from.
const quoteMachine = lead => {
  const lines = [...answerLines(lead?.answers), ...(lead?.source ? [clean(lead.source, 300)] : [])];
  return lines.length ? ['', ...lines] : [];
};

export function formLeadMessage(lead, aboutLines = []) {
  return [
    `New ${clean(lead.offer) || 'AI Makeover'} lead (form, not booked yet)`,
    clean(lead.name) || 'Unknown',
    `Phone: ${clean(lead.phone) || 'not given'}`,
    clean(lead.email),
    '',
    'Extra details: none yet (they only fill those in when they book)',
    ...quoteMachine(lead),
    ...about(aboutLines),
  ].join('\n');
}

// Sent when the four answers arrive after the form alert already went out.
export function answersMessage(lead) {
  return [`${clean(lead.offer) || 'Quote Machine'} answers`, clean(lead.name) || 'Unknown', clean(lead.email), ...quoteMachine(lead)].join('\n');
}

// Calendly sends a cancel plus a fresh booking for every reschedule, so moving a call used to
// re-send the whole lead alert. Ivan doesn't need texting about calls he moved or cancelled himself.
// Returns why the event stays quiet, or '' when it should alert.
export function quietCalendlyEvent(body) {
  const p = body?.payload || {};
  if (body?.event === 'invitee.created' && p.old_invitee) return 'rescheduled';
  if (body?.event === 'invitee.canceled' && p.rescheduled) return 'rescheduled';
  if (body?.event === 'invitee.canceled' && p.cancellation?.canceler_type === 'host') return 'cancelled by Ivan';
  return '';
}

// answers: Calendly's questions_and_answers minus the phone question.
// held: the form lead still waiting when they booked, which may carry Quote Machine answers.
export function bookedMessage({name, phone, email, when, answers = [], held = null}, aboutLines = []) {
  const filled = answers.filter(a => clean(a.answer));
  const extra = filled.length
    ? ['Extra details: FILLED IN', ...filled.map(a => `${clean(a.question)}\n"${clean(a.answer, 1000)}"`)]
    : ['Extra details: left blank'];
  return [
    held?.offer ? `New ${clean(held.offer)} call booked` : 'New call booked',
    clean(name) || 'Unknown',
    `Phone: ${clean(phone) || 'not given'}`,
    clean(email),
    when,
    '',
    ...extra,
    ...quoteMachine(held),
    ...about(aboutLines),
  ].join('\n');
}
