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

test('Quote Machine calendar stages are counted once, without contact details or false bookings', () => {
  let receive;
  const tracked = [], opened = [], frame = {};
  const link = {href: 'https://calendly.com/ivan-flowstate/30min?email=private%40example.test', replaceWith() {}};
  const box = {querySelector: () => link, hasAttribute: () => false, contains: () => true};
  const widget = {dataset: {}, querySelector: () => ({contentWindow: frame}), after() {}};
  vm.runInNewContext(readFileSync(new URL('../../public/assets/quoting/booking.js', import.meta.url), 'utf8'), {
    URL, location: {pathname: '/quote-machine/'},
    CustomEvent: class {constructor(type, options) {this.type = type; this.detail = options.detail;}},
    document: {querySelector: () => box, querySelectorAll: () => [], createElement: tag => tag === 'div' ? widget : {}, head: {appendChild() {}}, dispatchEvent: event => opened.push(event)},
    window: {addEventListener: (type, handler) => {receive = handler;}, fbq: (...args) => tracked.push(args)},
  });
  const message = name => ({origin: 'https://calendly.com', source: frame, data: {event: name, payload: {email: 'private@example.test', invitee: {uri}}}});
  receive({...message('calendly.date_and_time_selected'), origin: 'https://evil.test'});
  receive({...message('calendly.date_and_time_selected'), source: {}});
  receive(message('calendly.event_type_viewed'));
  receive(message('calendly.event_type_viewed'));
  receive(message('calendly.date_and_time_selected'));
  receive(message('calendly.date_and_time_selected'));
  assert.deepEqual(tracked.map(args => args.slice(0, 2)), [
    ['trackCustom', 'QuoteMachineCalendarOpened'],
    ['trackCustom', 'QuoteMachineCalendarLoaded'],
    ['trackCustom', 'QuoteMachineTimeSelected'],
  ]);
  assert.equal(opened.length, 0);
  assert.doesNotMatch(JSON.stringify(tracked), /private|invitee|email/);
  receive(message('calendly.event_scheduled'));
  receive(message('calendly.event_scheduled'));
  assert.equal(tracked.filter(args => args[1] === 'Schedule').length, 1);
  assert.equal(opened.length, 1);
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

test('audit buttons reveal the details without creating a lead, and keep the calendar after submission', async () => {
  const formListeners = new Map(), events = [], tracked = [];
  const element = () => ({hidden: false, attributes: {}, setAttribute(key, value) {this.attributes[key] = value;}, focus() {}, scrollIntoView() {}});
  const card = element(), title = element(), calendarTitle = element(), invitation = element(), booking = element();
  const buttons = Array.from({length: 3}, () => ({...element(), addEventListener(type, fn) {this.click = fn;}}));
  const fields = new Map(['name', 'email', 'phone', 'landing_path', 'ad_id', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].map(key => [key, {value: '', setCustomValidity() {}}]));
  const feedback = {}, submit = {};
  const form = {...element(), elements: {namedItem: key => fields.get(key)},
    querySelector: selector => selector === '.feedback' ? feedback : submit,
    addEventListener: (type, fn) => formListeners.set(type, fn), checkValidity: () => true};
  const link = {href: 'https://calendly.com/ivan-flowstate/30min'};
  const selectors = new Map([
    ['.booking a[href^="https://calendly.com/"]', link], ['form[name="quote-machine"]', form],
    ['.booking[data-after-lead]', booking], ['.audit-invite', invitation],
  ]);
  const ids = new Map([['book-call', card], ['book-title', title], ['calendar-title', calendarTitle]]);
  vm.runInNewContext(readFileSync(new URL('../../public/assets/quoting/quote-machine.js', import.meta.url), 'utf8'), {
    URL, URLSearchParams, location: {search: '', hash: '', pathname: '/quote-machine/', hostname: 'localhost'},
    sessionStorage: {getItem: () => null}, matchMedia: () => ({matches: true}),
    setTimeout: fn => fn(), CustomEvent: class {constructor(type) {this.type = type;}},
    document: {querySelector: key => selectors.get(key) || null, querySelectorAll: () => buttons,
      getElementById: key => ids.get(key), addEventListener() {}, dispatchEvent: event => events.push(event.type)},
    window: {fbq: (...args) => tracked.push(args)},
  });
  assert.equal(form.hidden, true);
  assert.equal(invitation.hidden, false);
  buttons[0].click({preventDefault() {}});
  assert.equal(form.hidden, false);
  assert.equal(invitation.hidden, true);
  assert.equal(card.attributes['aria-labelledby'], 'book-title');
  fields.get('name').value = 'Jane Smith';
  fields.get('email').value = 'jane@example.test';
  fields.get('phone').value = '021 123 4567';
  buttons[1].click({preventDefault() {}});
  assert.equal(fields.get('email').value, 'jane@example.test');
  assert.equal(tracked.filter(args => args[1] === 'QuoteMachineAuditStarted').length, 1);
  assert.equal(events.length, 0);
  assert.equal(tracked.filter(args => args[1] === 'Lead').length, 0);
  await formListeners.get('submit')({preventDefault() {}});
  assert.equal(form.hidden, true);
  assert.equal(booking.hidden, false);
  assert.deepEqual(events, ['flowstate:lead']);
  buttons[2].click({preventDefault() {}});
  assert.equal(form.hidden, true);
  assert.equal(card.attributes['aria-labelledby'], 'calendar-title');
  assert.equal(new URL(link.href).searchParams.get('a1'), '+64211234567');
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
