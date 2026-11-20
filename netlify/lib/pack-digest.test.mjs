import {test} from 'node:test';
import assert from 'node:assert/strict';
import {countWaitlist, digestMessage, waitlistSubscribers} from './pack-digest.mjs';

const now = Date.parse('2026-11-22T20:00:00Z');

test('counts the last 24 hours and the total', () => {
  const subs = [
    {tagged_at: '2026-11-22T19:00:00Z'},
    {tagged_at: '2026-11-21T20:30:00Z'},
    {tagged_at: '2026-11-21T19:59:00Z'},
    {created_at: '2026-11-22T10:00:00Z'},
    {},
  ];
  assert.deepEqual(countWaitlist(subs, now), {recent: 3, total: 5});
});

test('message wording', () => {
  assert.equal(digestMessage({recent: 1, total: 4}), 'Pack waitlist: 1 new sign-up in the last 24 hours. 4 on the list.');
  assert.equal(digestMessage({recent: 0, total: 0}), 'Pack waitlist: 0 new sign-ups in the last 24 hours. 0 on the list.');
});

test('follows Kit pages', async () => {
  const pages = {
    '': {subscribers: [{id: 1}, {id: 2}], pagination: {has_next_page: true, end_cursor: 'c1'}},
    c1: {subscribers: [{id: 3}], pagination: {has_next_page: false, end_cursor: 'c2'}},
  };
  const paths = [];
  const get = async path => { paths.push(path); return pages[new URL(path, 'http://x').searchParams.get('after') || '']; };
  assert.equal((await waitlistSubscribers(get, '99')).length, 3);
  assert.match(paths[0], /^\/tags\/99\/subscribers\?per_page=1000$/);
  assert.match(paths[1], /after=c1/);
});
