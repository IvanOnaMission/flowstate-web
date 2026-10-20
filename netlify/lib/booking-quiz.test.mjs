import {test} from 'node:test';
import assert from 'node:assert/strict';
import {quizAnswers, quizContact, verifiedQuizBooking} from './booking-quiz.mjs';
import {crmQuiz} from './crm.mjs';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const uri = 'https://api.calendly.com/scheduled_events/11111111-1111-1111-1111-111111111111/invitees/22222222-2222-2222-2222-222222222222';
const data = {office_staff: '1', challenge: 'Too much admin', goal: 'Free up time', ai_experience: 'Basic', timing: 'Just exploring', investment: 'Other', investment_other: '  Need to discuss with my partner  '};

test('only the actual Calendly frame can open the quiz, once per booking', () => {
  let receive;
  const opened = [], tracked = [], frame = {};
  const link = {href: 'https://calendly.com/ivan-flowstate/30min', replaceWith() {}};
  const box = {querySelector: () => link, hasAttribute: () => false, contains: () => true};
  const widget = {dataset: {}, querySelector: () => ({contentWindow: frame}), after() {}};
  vm.runInNewContext(readFileSync(new URL('../../public/assets/quoting/booking.js', import.meta.url), 'utf8'), {
    URL, location: {pathname: '/transformation-partner/'},
    CustomEvent: class {constructor(type, options) {this.type = type; this.detail = options.detail;}},
    document: {querySelector: () => box, querySelectorAll: () => [], createElement: tag => tag === 'div' ? widget : {}, head: {appendChild() {}}, dispatchEvent: event => opened.push(event)},
    window: {addEventListener: (type, handler) => {receive = handler;}, fbq: (...args) => tracked.push(args)},
  });
  const message = {origin: 'https://calendly.com', source: frame, data: {event: 'calendly.event_scheduled', payload: {invitee: {uri}}}};
  receive({...message, origin: 'https://evil.test'});
  receive({...message, source: {}});
  receive({...message, data: {event: 'calendly.profile_page_viewed'}});
  assert.equal(opened.length, 0);
  receive(message);
  receive(message);
  assert.equal(opened.length, 1);
  assert.equal(opened[0].type, 'flowstate:booked');
  assert.equal(opened[0].detail.invitee.uri, uri);
  assert.equal(tracked.length, 1);
});

test('Other uses the written answer and rejects blank or oversized text', () => {
  assert.equal(quizAnswers(data).at(-1).answer, 'Need to discuss with my partner');
  assert.throws(() => quizAnswers({...data, investment_other: '  '}), /investment/);
  assert.throws(() => quizAnswers({...data, investment_other: 'a'.repeat(501)}), /investment/);
  assert.throws(() => quizAnswers({...data, goal: ''}), /goal/);
});

test('pre-booking quiz requires valid contact details without a booking reference', () => {
  assert.deepEqual(quizContact({name: ' Jane Smith ', email: 'jane@example.test', phone: '021 123 4567'}), {name: 'Jane Smith', email: 'jane@example.test', phone: '021 123 4567', uri: ''});
  for (const bad of [{name: '', email: 'jane@example.test', phone: '0211234567'}, {name: 'Jane', email: 'invalid', phone: '0211234567'}, {name: 'Jane', email: 'jane@example.test', phone: 'abc1234567'}]) {
    assert.throws(() => quizContact(bad), /contact details/);
  }
});

test('contact details unlock the calendar without waiting for the quiz', () => {
  const listeners = new Map();
  let built = 0;
  const link = {href: 'https://calendly.com/ivan-flowstate/30min', replaceWith() {built++;}};
  const box = {hasAttribute: key => key === 'data-after-lead', querySelector: () => link, contains: () => true};
  vm.runInNewContext(readFileSync(new URL('../../public/assets/quoting/booking.js', import.meta.url), 'utf8'), {
    URL, location: {pathname: '/transformation-partner/'},
    document: {querySelector: () => box, querySelectorAll: () => [], addEventListener: (type, handler) => listeners.set(type, handler), createElement: () => ({dataset: {}, after() {}}), head: {appendChild() {}}},
    window: {addEventListener() {}},
  });
  assert.equal(built, 0);
  assert.equal(listeners.has('flowstate:lead'), true);
  assert.equal(listeners.has('flowstate:quiz-complete'), false);
  listeners.get('flowstate:lead')();
  assert.equal(built, 1);
});

test('the quiz stays locked until a confirmed booking and keeps its booking reference', () => {
  const listeners = new Map(), fields = new Map();
  const node = () => ({focus() {}, addEventListener() {}});
  const controls = new Map();
  const form = {
    elements: {namedItem: key => {if (!fields.has(key)) fields.set(key, {value: ''}); return fields.get(key);}},
    querySelectorAll: () => [{hidden: true, querySelector: () => null}],
    querySelector: key => {if (!controls.has(key)) controls.set(key, node()); return controls.get(key);},
    addEventListener() {},
  };
  const section = {hidden: true, scrollIntoView() {}, querySelector: key => key === 'form' ? form : node()};
  vm.runInNewContext(readFileSync(new URL('../../public/assets/quoting/business-quiz.js', import.meta.url), 'utf8'), {
    URLSearchParams, location: {search: '', hostname: 'flowstate.net.nz'},
    matchMedia: () => ({matches: true}),
    document: {querySelector: key => key === '#business-quiz' ? section : null, addEventListener: (type, handler) => listeners.set(type, handler)},
  });
  assert.equal(section.hidden, true);
  assert.equal(listeners.has('flowstate:lead'), false);
  const booked = listeners.get('flowstate:booked');
  booked({detail: {}});
  assert.equal(section.hidden, true);
  booked({detail: {invitee: {uri}}});
  assert.equal(section.hidden, false);
  assert.equal(fields.get('booking_invitee').value, uri);
});

test('booking lookup rejects arbitrary URLs before sending an API credential', async () => {
  let called = false;
  const fetcher = async () => { called = true; };
  for (const value of ['https://evil.test/', uri + '?redirect=1', uri.replace('api.calendly.com', 'api.calendly.com.evil.test'), uri + '/../../users/me']) {
    await assert.rejects(verifiedQuizBooking(value, 'secret', fetcher), /Invalid booking/);
  }
  assert.equal(called, false);
});

test('CRM identity comes from the active Calendly invitee', async () => {
  const booking = await verifiedQuizBooking(uri, 'test-token', async (url, options) => {
    assert.equal(url, uri);
    assert.equal(options.redirect, 'error');
    return Response.json({resource: {uri, email: 'booked@example.test', name: 'Booked person', status: 'active'}});
  });
  assert.equal(booking.email, 'booked@example.test');
  await assert.rejects(verifiedQuizBooking(uri, 'test-token', async () => Response.json({resource: {uri, email: 'x@test.nz', status: 'canceled'}})), /confirmed/);
  assert.equal(await verifiedQuizBooking(uri, ''), null);
});

test('CRM quiz notes preserve stage and existing notes, and deduplicate event retries', async () => {
  const oldFetch = globalThis.fetch;
  const oldToken = process.env.NOTION_TOKEN;
  const oldDb = process.env.NOTION_CRM_DATABASE_ID;
  process.env.NOTION_TOKEN = 'test';
  process.env.NOTION_CRM_DATABASE_ID = 'test-db';
  const calls = [];
  let saved = false;
  globalThis.fetch = async (url, options) => {
    calls.push({url, ...options});
    if (url.endsWith('/query')) return Response.json({results: [{id: 'crm-page'}]});
    if (options.method === 'GET') return Response.json({results: saved ? [{paragraph: {rich_text: [{plain_text: 'Business quiz submission: test-submission'}]}}] : [], has_more: false});
    saved = true;
    const body = JSON.parse(options.body);
    assert.equal(body.properties, undefined);
    assert.equal(body.children.length, 9);
    assert.match(body.children.at(-1).paragraph.rich_text[0].text.content, /Need to discuss/);
    return Response.json({results: []});
  };
  try {
    const quiz = {email: 'booked@example.test', uri, answers: quizAnswers(data), submissionId: 'test-submission'};
    assert.equal(await crmQuiz(quiz), true);
    assert.equal(await crmQuiz(quiz), true);
    assert.equal(calls.filter(call => call.method === 'PATCH').length, 1);
  } finally {
    globalThis.fetch = oldFetch;
    if (oldToken === undefined) delete process.env.NOTION_TOKEN; else process.env.NOTION_TOKEN = oldToken;
    if (oldDb === undefined) delete process.env.NOTION_CRM_DATABASE_ID; else process.env.NOTION_CRM_DATABASE_ID = oldDb;
  }
});
