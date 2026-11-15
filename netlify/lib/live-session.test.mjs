import {test} from 'node:test';
import assert from 'node:assert/strict';
import {EXTRA, OFFER, liveAnswers, liveCustomerType} from './live-session.mjs';
import {formLeadMessage} from './messages.mjs';
import {holdLead, updateHeldLead} from './pending.mjs';

const memory = () => {
  const m = new Map();
  return {
    setJSON: async (k, v) => void m.set(k, v),
    get: async k => m.get(k) ?? null,
    m,
  };
};

test('live answers use the essentials questions without a business line', () => {
  assert.deepEqual(liveAnswers({business: 'Ignored', role: 'Owner', timing: 'Now'}), [
    {question: 'Role', answer: 'Owner'},
    {question: 'Timing', answer: 'Now'},
  ]);
  assert.deepEqual(liveAnswers({}), []);
});

test('customer type only once a role is given', () => {
  assert.equal(liveCustomerType({}), undefined);
  assert.equal(liveCustomerType({role: 'Owner', trade: 'Electrical'}), 'electrical_owner');
});

test('the held alert picks up the answers and shows the session line', async () => {
  const s = memory();
  const lead = {email: 'Jane@Example.com', name: 'Jane', phone: '021 123 4567', offer: OFFER, extra: EXTRA};
  await holdLead(lead, s);
  const heldAt = s.m.get('jane@example.com').heldAt;
  assert.equal(await updateHeldLead({email: 'jane@example.com'}, {quiz: [{question: 'Role', answer: 'Owner'}]}, s), true);
  const held = s.m.get('jane@example.com');
  assert.equal(held.heldAt, heldAt);
  const text = formLeadMessage(held);
  assert.match(text, /^New Live session lead/);
  assert.match(text, /Signed up for the free live session/);
  assert.doesNotMatch(text, /Extra details/);
  assert.match(text, /QUIZ\nRole: Owner/);
  assert.equal(await updateHeldLead({email: 'nobody@example.com'}, {quiz: []}, s), false);
});
