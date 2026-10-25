// The four tap-to-answer questions on /quote-machine/. The page posts the tapped answer
// keys as a second Netlify form ("quote-machine-answers") straight after the contact
// details. Only the keys below are accepted, so nothing typed reaches the alert.
// Non-fits can still book: they are only flagged in Ivan's lead alert.
const clean = (value, max = 200) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

export const OFFER = 'Quote Machine';

export const QUESTIONS = [
  {field: 'trade', label: 'Trade', options: {electrical: 'Electrical', plumbing: 'Plumbing', both: 'Both', other: 'Other'}},
  {field: 'work_type', label: 'Mostly quotes', options: {residential: 'Residential', light_commercial: 'Light commercial', tender_commercial: 'Tender-heavy commercial'}},
  {field: 'quoters', label: 'People quoting', options: {just_me: 'Just me', two_three: '2 to 3', four_plus: '4 or more'}},
  {field: 'prices', label: 'Prices live in', options: {job_software: 'Price book in job software', spreadsheet: 'Spreadsheet', supplier_lists: 'Supplier price lists', in_head: 'Mostly in their head'}},
];

// {trade: 'Electrical', ...} with only recognised answers.
export function quoteAnswers(data = {}) {
  const out = {};
  for (const {field, options} of QUESTIONS) {
    const label = options[clean(data[field], 40)];
    if (label) out[field] = label;
  }
  return out;
}

export function fitFlags(answers = {}) {
  const flags = [];
  if (answers.trade === 'Other') flags.push('trade is not electrical or plumbing');
  if (answers.work_type === 'Tender-heavy commercial') flags.push('mostly tender-heavy commercial work');
  return flags;
}

// Lines for the Telegram alert. Empty when they never answered.
export function answerLines(answers) {
  const filled = QUESTIONS.filter(q => answers?.[q.field]);
  if (!filled.length) return [];
  const flags = fitFlags(answers);
  return [
    'QUOTE MACHINE ANSWERS',
    ...filled.map(q => `${q.label}: ${answers[q.field]}`),
    ...(flags.length ? [`POSSIBLE NON-FIT: ${flags.join('; ')}`] : []),
  ];
}

export function sourceLine(data = {}) {
  const ad = clean(data.ad_id, 40);
  const utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].map(k => clean(data[k], 80)).filter(Boolean).join(' / ');
  if (!ad && !utm) return '';
  return `Came from: ${[ad && `ad ${ad}`, utm].filter(Boolean).join(' · ')}`;
}
