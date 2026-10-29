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
export const META_BUSINESS_QUESTIONS = [
  {id:'business_industry',label:'What type of business do you run?',options:['Electrical','Plumbing or drainage','Building or construction','Another trade','Professional or office services','Another industry']},
  {id:'business_role',label:'What is your role in the business?',options:['Owner or director','Manager or team leader','Office or administration','Employee or apprentice','Other']},
  {id:'business_team_size',label:'How many people are in the business, including you?',options:['Just me','2–5','6–10','11–25','26+']},
  {id:'business_time_sink',label:'What area of the business is your biggest time sink?',options:['General admin and data entry','Enquiries and customer communication','Quoting or proposals','Scheduling and job coordination','Invoicing and chasing payments','Finding information and preparing documents','Marketing and follow-up','Something else / not sure']},
  {id:'business_weekly_hours',label:'Roughly how much team time does that take each week?',options:['Under 2 hours','2–5 hours','6–10 hours','11–20 hours','More than 20 hours','Not sure']},
  {id:'business_software',label:'What main software does your team use for that work?',options:['Fergus','Tradify','Simpro','ServiceM8','Xero','Microsoft 365 or Google Workspace','Other software','Mostly manual / no main system']},
  {id:'business_ai_experience',label:'How is your team using AI at the moment?',options:['Not yet','Tried a few things','Use it regularly','Already have some automations']},
  {id:'business_help',label:'What would be most useful to you?',options:['Find out where AI could help','Hands-on training for me or my team','Improve one time-consuming process','Help setting up an automation','Not sure — I would like your advice']},
];
export function metaAuditAnswers(fields = [], questions = META_AUDIT_QUESTIONS) {
  return questions.map(q => {
    const field = fields.find(f => f.name === q.id || normalise(f.name) === normalise(q.label));
    const values = Array.isArray(field?.values) ? field.values : [];
    const answer = values.map(value => {
      const text = String(value).slice(0, 500);
      return q.options.find(option => normalise(option) === normalise(text)) || text;
    }).filter(Boolean).join(', ');
    return {id: q.id, question: q.label, answer: answer || 'Not answered'};
  });
}
