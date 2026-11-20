import {test} from 'node:test';
import assert from 'node:assert/strict';
import {EXTRA, HEADLINE, OFFER, packAnswers, packCustomerType, waitlistTag, welcomeSequence} from './pack-waitlist.mjs';
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

test('pack answers use the essentials questions without a business line', () => {
  assert.deepEqual(packAnswers({business: 'Ignored', role: 'Owner', timing: 'Now'}), [
    {question: 'Role', answer: 'Owner'},
    {question: 'Timing', answer: 'Now'},
  ]);
  assert.deepEqual(packAnswers({}), []);
});

test('customer type only once a role is given', () => {
  assert.equal(packCustomerType({}), undefined);
  assert.equal(packCustomerType({role: 'Owner', trade: 'Electrical'}), 'electrical_owner');
});

test('the waitlist tag and welcome sequence default to the Kit ids', () => {
  assert.equal(waitlistTag(), process.env.KIT_TAG_PACK_WAITLIST || '26237252');
  assert.equal(welcomeSequence(), process.env.KIT_SEQUENCE_PACK_WAITLIST || '2980406');
});

test('the held alert shows the waitlist line and picks up the answers', async () => {
  const s = memory();
  const lead = {email: 'Jane@Example.com', name: 'Jane', phone: '', offer: OFFER, extra: EXTRA, headline: HEADLINE};
  await holdLead(lead, s);
  assert.equal(await updateHeldLead({email: 'jane@example.com'}, {quiz: [{question: 'Role', answer: 'Owner'}]}, s), true);
  const text = formLeadMessage(s.m.get('jane@example.com'));
  assert.match(text, /^New pack waitlist signup/);
  assert.match(text, /Joined the waitlist for the free AI systems pack/);
  assert.doesNotMatch(text, /Extra details/);
  assert.match(text, /QUIZ\nRole: Owner/);
});
