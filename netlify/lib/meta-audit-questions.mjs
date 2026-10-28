// These keys are explicitly configured in the native form's Field names settings.
export const META_AUDIT_QUESTIONS = [
  {id: 'industry', label: 'What business are you in?', options: ['Electrical', 'Plumbing', 'Building', 'Another trade', 'Another industry']},
  {id: 'software', label: 'What is your main job management or office software?', options: ['Fergus', 'Tradify', 'Simpro', 'ServiceM8', 'Xero', 'Excel or Word', 'Other', 'None']},
  {id: 'pain', label: 'What is the biggest pain in your business right now?', options: ['General admin', 'Keeping up with enquiries', 'Getting quotes out', 'Chasing customers', 'Something else']},
  {id: 'team_size', label: 'How many people are in the business, including you?', options: ['Just me', '2–5', '6–10', '11+']},
  {id: 'ai_experience', label: 'How are you using AI at the moment?', options: ['Not yet', 'Tried a few things', 'Use it regularly', 'Already have some automations']},
  {id: 'timing', label: 'When would you like to sort this out?', options: ['As soon as possible', 'Over the next few months', 'Just exploring']},
  {id: 'response_speed', label: 'How quickly do you personally respond to a new enquiry?', options: ['Within minutes', 'Within an hour', 'The same day', 'The next day or later', 'It varies']},
  {id: 'pre_sale_work', label: 'How often do you need a site visit before you can quote?', options: ['Rarely', 'Some jobs', 'Most jobs', 'Every job', 'Not applicable']},
  {id: 'prep_time', label: 'Once you have the information, how long does a quote take to prepare?', options: ['Under 15 minutes', '15–30 minutes', '30–60 minutes', '1–2 hours', 'Longer', 'Not applicable']},
  {id: 'follow_up', label: 'What normally happens after you send a quote?', options: ['We follow up manually', 'We have automatic follow-up', 'We follow up when we remember', 'We wait for the customer', 'Not applicable']},
];
const normalise = value => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
export function metaAuditAnswers(fields = []) {
  return META_AUDIT_QUESTIONS.map(q => {
    const field = fields.find(f => f.name === q.id || normalise(f.name) === normalise(q.label));
    const values = Array.isArray(field?.values) ? field.values : [];
    const answer = values.map(value => {
      const text = String(value).slice(0, 500);
      return q.options.find(option => normalise(option) === normalise(text)) || text;
    }).filter(Boolean).join(', ');
    return {id: q.id, question: q.label, answer: answer || 'Not answered'};
  });
}
