import test from 'node:test';
import assert from 'node:assert/strict';
import {verifiedCalendlyBody, verifiedKitSubscriber} from './webhook-verify.mjs';

const EV = 'https://api.calendly.com/scheduled_events/11111111-1111-1111-1111-111111111111';
const INV = `${EV}/invitees/22222222-2222-2222-2222-222222222222`;
const fake = routes => async (u, opts) => {
  assert.equal(opts.redirect, 'error');
  const r = routes[u];
  return r ? {ok: true, json: async () => r} : {ok: false, json: async () => ({})};
};

test('calendly: uses the API record, not the posted payload', async () => {
  const out = await verifiedCalendlyBody(INV, 't', fake({
    [INV]: {resource: {uri: INV, email: 'real@x.nz', name: 'Real', status: 'active', event: EV}},
    [EV]: {resource: {start_time: '2026-12-01T01:00:00Z'}},
  }));
  assert.equal(out.event, 'invitee.created');
  assert.equal(out.payload.email, 'real@x.nz');
  assert.equal(out.payload.scheduled_event.start_time, '2026-12-01T01:00:00Z');
});

test('calendly: canceled status maps to invitee.canceled', async () => {
  const out = await verifiedCalendlyBody(INV, 't', fake({[INV]: {resource: {uri: INV, email: 'a@b.nz', status: 'canceled'}}}));
  assert.equal(out.event, 'invitee.canceled');
});

test('calendly: rejects foreign or malformed URIs without fetching', async () => {
  const never = async () => { throw new Error('fetched'); };
  for (const uri of ['https://evil.com/x', 'https://api.calendly.com/users/me', `${INV}?x=1`, undefined, `https://api.calendly.com.evil.com/scheduled_events/a`]) {
    assert.equal(await verifiedCalendlyBody(uri, 't', never), null);
  }
});

test('calendly: rejects unknown invitee or mismatched uri', async () => {
  assert.equal(await verifiedCalendlyBody(INV, 't', fake({})), null);
  assert.equal(await verifiedCalendlyBody(INV, 't', fake({[INV]: {resource: {uri: EV, email: 'a@b.nz'}}})), null);
});

test('kit: returns Kit record when id and email match', async () => {
  const s = await verifiedKitSubscriber({id: 42, email_address: 'A@b.nz'}, 'k', fake({
    'https://api.kit.com/v4/subscribers/42': {subscriber: {id: 42, email_address: 'a@b.nz', first_name: 'Real'}},
  }));
  assert.equal(s.first_name, 'Real');
});

test('kit: rejects non-numeric id, unknown id and email mismatch', async () => {
  const k = fake({'https://api.kit.com/v4/subscribers/42': {subscriber: {id: 42, email_address: 'a@b.nz'}}});
  assert.equal(await verifiedKitSubscriber({id: '42/../x', email_address: 'a@b.nz'}, 'k', k), null);
  assert.equal(await verifiedKitSubscriber({id: 7, email_address: 'a@b.nz'}, 'k', k), null);
  assert.equal(await verifiedKitSubscriber({id: 42, email_address: 'other@b.nz'}, 'k', k), null);
});
