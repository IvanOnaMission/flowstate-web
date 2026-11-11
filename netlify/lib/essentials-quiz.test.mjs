import {test} from 'node:test';
import assert from 'node:assert/strict';
import {essentialsAnswers, essentialsCustomerType, essentialsTrade} from './essentials-quiz.mjs';
import {bookedMessage, formLeadMessage} from './messages.mjs';

const submission = {
  name: 'Jane Smith', email: 'jane@example.com', phone: '021 123 4567', business: '  Smith   Electrical ',
  role: 'Owner', trade: 'Electrical', team_size: '6–20', job_software: 'Simpro',
  time_sink: 'Getting paid', investment: 'All in on a new way to run my business', timing: 'Now',
};

test('essentials answers list the business first, then every answer in order', () => {
  assert.deepEqual(essentialsAnswers(submission), [
    {question: 'Business', answer: 'Smith Electrical'},
    {question: 'Role', answer: 'Owner'},
    {question: 'Trade', answer: 'Electrical'},
    {question: 'Team size', answer: '6–20'},
    {question: 'Job software', answer: 'Simpro'},
    {question: 'Biggest time-sink', answer: 'Getting paid'},
    {question: 'Investment', answer: 'All in on a new way to run my business'},
    {question: 'Timing', answer: 'Now'},
  ]);
  assert.deepEqual(essentialsAnswers({role: 'Owner', trade: ' '}), [{question: 'Role', answer: 'Owner'}]);
  assert.deepEqual(essentialsAnswers(), []);
});

test('role and trade map onto the CRM customer types', () => {
  assert.equal(essentialsCustomerType({role: 'Owner', trade: 'Electrical'}), 'electrical_owner');
  assert.equal(essentialsCustomerType({role: 'Owner', trade: 'Plumbing & gas'}), 'other_trade_owner');
  assert.equal(essentialsCustomerType({role: 'Office or ops manager', trade: 'Electrical'}), 'other');
  assert.equal(essentialsCustomerType({role: 'Employee or apprentice'}), 'employee_apprentice');
  assert.equal(essentialsCustomerType({}), 'other');
  assert.equal(essentialsTrade({trade: 'HVAC'}), 'HVAC');
  assert.equal(essentialsTrade({trade: 'Another trade'}), '');
});

test('the form alert and the booked alert both show the quiz', () => {
  const lead = {name: 'Jane Smith', phone: '021 123 4567', email: 'jane@example.com', offer: 'Business Essentials', quiz: essentialsAnswers(submission)};
  const form = formLeadMessage(lead);
  assert.match(form, /^New Business Essentials lead \(form, not booked yet\)/);
  assert.match(form, /\nQUIZ\nBusiness: Smith Electrical\nRole: Owner\nTrade: Electrical\n/);
  assert.match(form, /Investment: All in on a new way to run my business/);
  assert.doesNotMatch(form, /script|Call them/i);

  const booked = bookedMessage({name: 'Jane Smith', phone: '021 123 4567', email: 'jane@example.com', when: 'Thu 13 Nov, 10:30 am', held: lead});
  assert.match(booked, /^New Business Essentials call booked/);
  assert.match(booked, /\nQUIZ\nBusiness: Smith Electrical\n/);

  assert.doesNotMatch(formLeadMessage({name: 'Sam', email: 'sam@example.com'}), /QUIZ/);
});
