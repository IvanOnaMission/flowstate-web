// The /essentials/ page is a one-question-at-a-time quiz. Its answers arrive in the
// same Netlify submission as the contact details (form "essentials-quiz"), so the
// lead, the Telegram alert and the CRM note all carry them from the start.
// Field names match src/app/essentials/questions.ts.
import {clean} from './messages.mjs';

export const OFFER = 'Business Essentials';
export const FORM = 'essentials-quiz';

export const QUIZ_FIELDS = [
  ['role', 'Role'],
  ['trade', 'Trade'],
  ['team_size', 'Team size'],
  ['job_software', 'Job software'],
  ['time_sink', 'Biggest time-sink'],
  ['investment', 'Investment'],
  ['timing', 'Timing'],
];

// Business name first, then the answers in the order they were asked. Blank answers are left out.
export function essentialsAnswers(data = {}) {
  const answers = [];
  const business = clean(data.business);
  if (business) answers.push({question: 'Business', answer: business});
  for (const [key, question] of QUIZ_FIELDS) {
    const answer = clean(data[key]);
    if (answer) answers.push({question, answer});
  }
  return answers;
}

// Maps the self-reported role and trade onto the CRM's customer types.
export function essentialsCustomerType(data = {}) {
  const role = clean(data.role);
  if (role === 'Employee or apprentice') return 'employee_apprentice';
  if (role !== 'Owner') return 'other';
  return clean(data.trade) === 'Electrical' ? 'electrical_owner' : 'other_trade_owner';
}

// The trade as the CRM should show it, or '' when they didn't name one.
export function essentialsTrade(data = {}) {
  const trade = clean(data.trade);
  return trade && trade !== 'Another trade' ? trade : '';
}
