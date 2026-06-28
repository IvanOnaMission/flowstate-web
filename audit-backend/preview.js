// Renders the proposal email with sample data so you can eyeball the design.
// Run: node preview.js   → writes email-preview.html → open it.
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/Code.gs', 'utf8');
const BOOK_CALL_URL = 'https://calendly.com/barnettdigital';
// Pull the proposalHtml function out of Code.gs and make it callable here.
eval(src.match(/function proposalHtml[\s\S]*?\n}/)[0]);
const sample = {
  name: 'Jordan',
  business: 'Jordan Electrical',
  dollars_leaking: '$164,000/yr',
  time_leaking: '$92,000/yr',
  revenue_leaking: '$72,000/yr',
  hrs_leaking: '35 hrs/wk',
  ai_opportunities: [
    'AI email triage + draft replies in your voice',
    'Website AI chatbot (FAQs + lead capture 24/7)',
    'AI phone answering / voice receptionist for missed calls',
    'AI quote drafting from a photo / voice note',
    'AI dead-lead / dead-quote revival'
  ].join(' | ')
};
fs.writeFileSync(__dirname + '/email-preview.html', proposalHtml(sample));
console.log('wrote email-preview.html');
