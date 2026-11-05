import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {fieldLabel, instantLeadFormIds, instantLeadMessage, normaliseInstantLead, importInstantLead, instantIntegrations} from './instant-leads.mjs';
import {handleMetaWebhook} from '../functions/meta-audit-messenger.mjs';
import webhook from '../functions/meta-audit-messenger.mjs';

const PAGE = '1095779013619484';
const FORM = '1174559812181344';
const OLDER = '1480350577329067';
const LEAD = '4445556667778889';
const AD = '223456789012345';
const TOKEN = 'test-leads-token';
const EMAIL = 'jane.instant@example.com';
const PHONE = '021 555 0199';
const AD_NAME = 'FS | Admin breaking | Instant form v2';

function memory() {
  const map = new Map();
  let version = 0;
  return {
    async get(key) {
      const row = map.get(key);
      return row ? structuredClone(row.data) : null;
    },
    async getWithMetadata(key) {
      const row = map.get(key);
      return row ? structuredClone(row) : null;
    },
    async setJSON(key, data, options = {}) {
      const old = map.get(key);
      if ((options.onlyIfNew && old) || (options.onlyIfMatch && old?.etag !== options.onlyIfMatch)) return {modified: false};
      const etag = String(++version);
      map.set(key, {data: structuredClone(data), etag});
      return {modified: true, etag};
    },
  };
}

function withEnv(values, fn) {
  const previous = new Map(Object.keys(values).map(key => [key, process.env[key]]));
  for (const [key, value] of Object.entries(values)) {
    if (value == null) delete process.env[key];
    else process.env[key] = value;
  }
  return Promise.resolve().then(fn).finally(() => {
    for (const [key, value] of previous) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
}

function captureErrors(fn) {
  const errors = [];
  const original = console.error;
  console.error = (...args) => errors.push(args.map(String).join(' '));
  return Promise.resolve().then(fn).finally(() => { console.error = original; }).then(() => errors);
}

const fields = () => [
  {name: 'full_name', values: ['Jane Smith']},
  {name: 'phone_number', values: [PHONE]},
  {name: 'email', values: ['Jane.Instant@example.com']},
  {name: 'How big is your company?', values: ['6–10']},
  {name: 'how_much_ai_are_you_currently_using', values: ['Tried a few things']},
  {name: "What's your goal with AI?", values: ['Cut admin time']},
];

function graphLead(extra = {}) {
  return {id: LEAD, created_time: '2026-11-05T01:00:00Z', ad_id: AD, ad_name: AD_NAME, form_id: FORM, field_data: fields(), ...extra};
}

function payload(formId = FORM, leadgenId = LEAD, entryId = PAGE) {
  return {object: 'page', entry: [{id: entryId, changes: [{field: 'leadgen', value: {form_id: formId, leadgen_id: leadgenId, page_id: PAGE, ad_id: AD}}]}]};
}

function fetched(body, status = 200) {
  return new Response(JSON.stringify(body), {status, headers: {'content-type': 'application/json'}});
}

describe('facebook instant lead alerts', {concurrency: 1}, () => {
  test('form ids fall back to the two admin forms and a list replaces that fallback', () => {
    assert.deepEqual(instantLeadFormIds(''), ['1174559812181344', '1480350577329067']);
    assert.deepEqual(instantLeadFormIds('  '), ['1174559812181344', '1480350577329067']);
    assert.deepEqual(instantLeadFormIds('1480350577329067, 1174559812181344, 1480350577329067'), [OLDER, FORM]);
    assert.throws(() => instantLeadFormIds('not-a-form'), /Invalid Meta lead form ID/);
    assert.throws(() => instantLeadFormIds('1174559812181344,secret'), /Invalid Meta lead form ID/);
  });

  test('field labels stay readable and the alert lists every answer plus the ad', () => {
    assert.equal(fieldLabel('full_name'), 'Full name');
    assert.equal(fieldLabel('phone_number'), 'Phone number');
    assert.equal(fieldLabel('email'), 'Email');
    assert.equal(fieldLabel('How big is your company?'), 'How big is your company?');
    assert.equal(fieldLabel('how_much_ai_are_you_currently_using'), 'How much ai are you currently using');
    assert.equal(fieldLabel("What's your goal with AI?"), "What's your goal with AI?");
    const lead = normaliseInstantLead(graphLead());
    const text = instantLeadMessage(lead);
    assert.match(text, /^New Facebook instant form lead\nJane Smith\nPhone: 021 555 0199\njane\.instant@example\.com/);
    assert.match(text, /How big is your company\?\n"6–10"/);
    assert.match(text, /How much ai are you currently using\n"Tried a few things"/);
    assert.match(text, /What's your goal with AI\?\n"Cut admin time"/);
    assert.match(text, /Jane\.Instant@example\.com/);
    assert.match(text, /Ad: FS \| Admin breaking \| Instant form v2 \(223456789012345\)\nCall them now\.$/);
    assert.equal(lead.answers.length, 6);
    assert.equal(lead.email, EMAIL);
    assert.throws(() => normaliseInstantLead({field_data: [{name: 'email', values: [EMAIL]}]}), /valid ID/);
  });

  test('a lead is texted once, a failed send can retry, and a Lead event is never called', async () => {
    const store = memory();
    const calls = [];
    const integrations = {
      alert: async () => { calls.push('alert'); if (calls.filter(step => step === 'alert').length === 1) throw new Error(`down ${EMAIL} ${TOKEN}`); },
      crm: async () => { calls.push('crm'); },
      answers: async () => { calls.push('answers'); },
      capi: async () => { calls.push('capi'); },
    };
    const errors = await captureErrors(async () => {
      await assert.rejects(importInstantLead(graphLead(), store, integrations), error => {
        assert.equal(error.message, 'Meta lead delivery pending: alert');
        assert.doesNotMatch(error.message, /jane|token|test-leads/);
        return true;
      });
    });
    assert.deepEqual(errors, ['Instant lead delivery pending: alert']);
    await importInstantLead(graphLead(), store, integrations);
    await importInstantLead(graphLead(), store, integrations);
    assert.deepEqual(calls, ['alert', 'crm', 'answers', 'alert']);
    assert.equal(calls.filter(step => step === 'capi').length, 0);
  });

  test('a phone-only instant lead still alerts and does not invent a CRM write', async () => {
    const texts = [];
    let crm = 0;
    await importInstantLead({id: LEAD, field_data: [{name: 'full_name', values: ['Jane Smith']}, {name: 'phone_number', values: [PHONE]}]}, memory(), instantIntegrations({
      send: async text => { texts.push(text); },
      contact: async () => {},
    }));
    const configured = instantIntegrations({send: async () => { crm++; }, contact: async () => {}});
    assert.match(texts[0], /Jane Smith/);
    assert.match(texts[0], /Phone: 021 555 0199/);
    assert.match(texts[0], /Email: not given/);
    assert.deepEqual(await configured.crm(normaliseInstantLead({id: LEAD, field_data: [{name: 'phone_number', values: [PHONE]}]})), {reason: 'unconfigured'});
  });

  test('simulated leadgen webhook for form 1174559812181344 sends one alert with the answers and the ad', async () => {
    await withEnv({META_LEADS_TOKEN: TOKEN, META_CAPI_TOKEN: 'capi-should-not-be-used', META_CAPI_DATASET_ID: '3159317364459626'}, async () => {
      const store = memory();
      const texts = [];
      const contacts = [];
      const fetches = [];
      let capi = 0;
      const fetchImpl = async (url, options) => {
        fetches.push({fields: url.searchParams.get('fields'), href: String(url), authorization: options.headers.authorization, redirect: options.redirect});
        assert.equal(url.searchParams.has('access_token'), false);
        assert.equal(options.headers.authorization, `Bearer ${TOKEN}`);
        assert.doesNotMatch(String(url), /test-leads-token|capi-should-not-be-used/);
        return fetched(graphLead());
      };
      const deps = {
        pageId: PAGE,
        auditFormId: '99999999999999',
        fetchImpl,
        storeFor: () => store,
        enqueue: async () => 0,
        drain: async () => ({failed: 0}),
        instantImport: (lead, saved) => importInstantLead(lead, saved, {
          ...instantIntegrations({
            send: async text => { texts.push(text); },
            contact: async contact => { contacts.push(contact); },
          }),
          capi: async () => { capi++; },
        }),
        auditImport: async () => { throw new Error('audit import should not run'); },
      };
      const errors = await captureErrors(async () => {
        await handleMetaWebhook(payload(), deps);
        await handleMetaWebhook(payload(), deps);
      });
      assert.deepEqual(errors, []);
      assert.equal(texts.length, 1);
      assert.match(texts[0], /Jane Smith/);
      assert.match(texts[0], /Phone: 021 555 0199/);
      assert.match(texts[0], /jane\.instant@example\.com/);
      assert.match(texts[0], /How big is your company\?\n"6–10"/);
      assert.match(texts[0], /How much ai are you currently using\n"Tried a few things"/);
      assert.match(texts[0], /What's your goal with AI\?\n"Cut admin time"/);
      assert.match(texts[0], /Full name\n"Jane Smith"/);
      assert.match(texts[0], /Ad: FS \| Admin breaking \| Instant form v2 \(223456789012345\)/);
      assert.match(texts[0], /Call them now\.$/);
      assert.doesNotMatch(texts[0], /test-leads-token|capi-should-not-be-used/);
      assert.equal(contacts.length, 1);
      assert.deepEqual(contacts[0], {name: 'Jane Smith', phone: PHONE, email: EMAIL, label: 'Facebook lead'});
      assert.equal(capi, 0);
      assert.equal(fetches.length, 2);
      assert.equal(fetches[0].fields, 'id,created_time,field_data,ad_id,ad_name,form_id');
      assert.equal(fetches[0].redirect, 'error');
    });
  });

  test('a second in-flight delivery does not send a second alert', async () => {
    await withEnv({META_LEADS_TOKEN: TOKEN}, async () => {
      const store = memory();
      let sends = 0;
      let release;
      const gate = new Promise(resolve => { release = resolve; });
      const fetches = [];
      const deps = {
        pageId: PAGE,
        auditFormId: '99999999999999',
        fetchImpl: async () => { fetches.push(1); return fetched(graphLead()); },
        storeFor: () => store,
        enqueue: async () => 0,
        drain: async () => ({failed: 0}),
        instantImport: (lead, saved) => importInstantLead(lead, saved, {alert: async () => { sends++; await gate; }}),
      };
      const first = handleMetaWebhook(payload(), deps);
      for (let i = 0; i < 50 && sends === 0; i++) await new Promise(resolve => setTimeout(resolve, 10));
      assert.equal(sends, 1);
      await assert.rejects(handleMetaWebhook(payload(), deps), /already in progress/);
      assert.equal(fetches.length, 1);
      release();
      await first;
      await handleMetaWebhook(payload(), deps);
      assert.equal(sends, 1);
      assert.equal(fetches.length, 2);
    });
  });

  test('the older admin form is accepted by the default list and an override can exclude it', async () => {
    await withEnv({META_LEADS_TOKEN: TOKEN, META_LEAD_FORM_IDS: null}, async () => {
      const seen = [];
      const deps = {
        pageId: PAGE,
        auditFormId: '99999999999999',
        fetchImpl: async () => fetched(graphLead({form_id: OLDER})),
        storeFor: memory,
        enqueue: async () => 0,
        drain: async () => ({failed: 0}),
        instantImport: async lead => { seen.push(lead.form_id); },
      };
      await handleMetaWebhook(payload(OLDER, '5556667778889991'), deps);
      assert.deepEqual(seen, [OLDER]);
      seen.length = 0;
      await handleMetaWebhook(payload(FORM), {...deps, formIds: () => [OLDER], fetchImpl: async () => { throw new Error('should not fetch'); }});
      assert.deepEqual(seen, []);
    });
  });

  test('the existing audit form still uses its own import and its original lead fields', async () => {
    await withEnv({META_LEADS_TOKEN: TOKEN}, async () => {
      const audit = [];
      const fetches = [];
      let instant = 0;
      const body = payload('88888888888888', '5556667778889992');
      body.entry[0].messaging = [{sender: {id: '12345'}, message: {mid: 'm1', text: 'hi'}}];
      let enqueued = 0;
      await handleMetaWebhook(body, {
        pageId: PAGE,
        auditFormId: '88888888888888',
        formIds: () => { throw new Error('secret-form-list'); },
        fetchImpl: async url => { fetches.push(url.searchParams.get('fields')); return fetched(graphLead({id: '5556667778889992', form_id: '88888888888888'})); },
        storeFor: memory,
        auditImport: async lead => { audit.push(lead.id); },
        instantImport: async () => { instant++; },
        enqueue: async () => { enqueued++; },
        drain: async () => ({failed: 0}),
      });
      assert.deepEqual(fetches, ['id,created_time,field_data,ad_id']);
      assert.deepEqual(audit, ['5556667778889992']);
      assert.equal(instant, 0);
      assert.equal(enqueued, 1);
    });
  });

  test('other pages, unknown forms and a bad form list do not leak ids or tokens', async () => {
    await withEnv({META_LEADS_TOKEN: TOKEN}, async () => {
      let fetches = 0;
      const quiet = {pageId: PAGE, auditFormId: '99999999999999', fetchImpl: async () => { fetches++; return fetched(graphLead()); }, storeFor: memory, instantImport: async () => {}, enqueue: async () => 0, drain: async () => ({failed: 0})};
      await handleMetaWebhook(payload(FORM, LEAD, '000000000000000'), quiet);
      await handleMetaWebhook(payload('12345678901234'), {...quiet, formIds: () => [FORM]});
      await handleMetaWebhook({object: 'page', entry: [{id: PAGE, changes: [{field: 'leadgen', value: {form_id: FORM, leadgen_id: 'nope'}}]}]}, quiet);
      assert.equal(fetches, 0);
      const audit = [];
      const mixed = payload();
      mixed.entry[0].changes.unshift({field: 'leadgen', value: {form_id: '88888888888888', leadgen_id: '5556667778889993'}});
      const errors = await captureErrors(async () => {
        await assert.rejects(handleMetaWebhook(mixed, {
          ...quiet,
          auditFormId: '88888888888888',
          formIds: () => { throw new Error(`bad ${TOKEN} ${EMAIL}`); },
          fetchImpl: async url => {
            fetches++;
            assert.equal(url.searchParams.get('fields'), 'id,created_time,field_data,ad_id');
            return fetched(graphLead({id: '5556667778889993'}));
          },
          auditImport: async lead => { audit.push(lead.id); },
        }), /Instant lead forms are not configured/);
      });
      assert.deepEqual(audit, ['5556667778889993']);
      assert.equal(fetches, 1);
      assert.deepEqual(errors, ['META_LEAD_FORM_IDS is invalid.']);
    });
  });

  test('a rejected ad name field still delivers the alert from the base lead fields', async () => {
    await withEnv({META_LEADS_TOKEN: TOKEN}, async () => {
      const texts = [];
      const asked = [];
      await handleMetaWebhook(payload(), {
        pageId: PAGE,
        auditFormId: '99999999999999',
        fetchImpl: async url => {
          asked.push(url.searchParams.get('fields'));
          if (url.searchParams.get('fields').includes('ad_name')) return fetched({error: {message: EMAIL}}, 400);
          return fetched({id: LEAD, field_data: fields(), ad_id: AD});
        },
        storeFor: memory,
        instantImport: (lead, store) => importInstantLead(lead, store, {alert: async normalised => { texts.push(instantLeadMessage(normalised)); }}),
        enqueue: async () => 0,
        drain: async () => ({failed: 0}),
      });
      assert.deepEqual(asked, ['id,created_time,field_data,ad_id,ad_name,form_id', 'id,created_time,field_data,ad_id']);
      assert.equal(texts.length, 1);
      assert.match(texts[0], /How big is your company\?/);
      assert.match(texts[0], /Ad: 223456789012345/);
      assert.doesNotMatch(texts[0], /Ad: FS \|/);
    });
  });

  test('lead retrieval failures log the status only', async () => {
    await withEnv({META_LEADS_TOKEN: TOKEN}, async () => {
      const errors = await captureErrors(async () => {
        await assert.rejects(handleMetaWebhook(payload(), {
          pageId: PAGE,
          auditFormId: '99999999999999',
          fetchImpl: async () => fetched({error: {message: `${EMAIL} ${TOKEN}`}}, 403),
          storeFor: memory,
          enqueue: async () => 0,
          drain: async () => ({failed: 0}),
        }), /pending/);
      });
      assert.deepEqual(errors, ['Meta lead retrieval failed (403).']);
    });
  });

  test('Twenty receives the instant lead and Meta is not sent a Lead event', async () => {
    const urls = [];
    const original = globalThis.fetch;
    const tables = new Map();
    const table = name => tables.get(name) || tables.set(name, new Map()).get(name);
    globalThis.fetch = async (url, options = {}) => {
      const href = String(url);
      urls.push(href);
      assert.doesNotMatch(href, /graph\.facebook\.com|capi-token|event_name/);
      const u = new URL(href);
      const [plural, id] = u.pathname.replace('/rest/', '').split('/');
      const method = options.method || 'GET';
      const body = options.body && JSON.parse(options.body);
      assert.equal(JSON.stringify(body || {}).includes('"event_name"'), false);
      const rows = table(plural);
      if (method === 'GET') {
        if (id) return rows.has(id) ? fetched({data: {record: rows.get(id)}}) : new Response('{}', {status: 404});
        return fetched({data: {[plural]: [...rows.values()]}});
      }
      if (method === 'POST') { rows.set(body.id, body); return fetched({data: {record: body}}); }
      if (method === 'PATCH') { rows.set(id, {...rows.get(id), ...body}); return fetched({data: {record: rows.get(id)}}); }
      throw new Error(`unexpected ${method}`);
    };
    try {
      await withEnv({
        META_LEADS_TOKEN: TOKEN,
        CRM_BACKEND: 'twenty',
        TWENTY_API_URL: 'https://crm.example',
        TWENTY_API_KEY: 'twenty-test-only',
        MKT_SUPABASE_URL: null,
        MKT_SUPABASE_SERVICE_KEY: null,
        META_CAPI_TOKEN: 'capi-token',
        META_CAPI_DATASET_ID: '3159317364459626',
      }, async () => {
        const texts = [];
        const integrations = instantIntegrations({send: async text => { texts.push(text); }, contact: async () => {}});
        assert.equal(integrations.capi, undefined);
        const store = memory();
        await importInstantLead(graphLead(), store, integrations);
        await importInstantLead(graphLead(), store, integrations);
        assert.equal(texts.length, 1);
        assert.equal(table('opportunities').size, 1);
        const opportunity = [...table('opportunities').values()][0];
        assert.match(opportunity.wikiNotes, /Facebook Instant Form — FS \| Admin breaking \| Instant form v2/);
        assert.equal(opportunity.metaLeadId, LEAD);
        assert.equal(table('notes').size, 1);
        const note = [...table('notes').values()][0];
        assert.match(note.title, /Facebook instant form/);
        assert.match(note.bodyV2.markdown, /How big is your company\?: 6–10/);
        assert.match(note.bodyV2.markdown, /Answered 6 of 6 form questions/);
        assert.equal(urls.some(url => url.includes('graph.facebook.com')), false);
      });
    } finally {
      globalThis.fetch = original;
    }
  });

  test('the signed webhook fails closed without blob storage and does not log the submission', async () => {
    const email = 'planted.lead@example.com';
    const raw = JSON.stringify({object: 'page', entry: [{id: PAGE, changes: [{field: 'leadgen', value: {form_id: FORM, leadgen_id: LEAD, email}}]}]});
    const secret = 'unit-test-secret';
    const signature = `sha256=${createHmac('sha256', secret).update(raw).digest('hex')}`;
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => { throw new Error(`network ${email} ${TOKEN}`); };
    try {
      await withEnv({META_APP_SECRET: secret, META_PAGE_ID: PAGE, META_LEADS_TOKEN: TOKEN, META_LEAD_FORM_IDS: null, META_AUDIT_FORM_ID: '99999999999999'}, async () => {
        const errors = await captureErrors(async () => {
          const response = await webhook(new Request('https://example.invalid/.netlify/functions/meta-audit-messenger', {
            method: 'POST', body: raw, headers: {'x-hub-signature-256': signature},
          }));
          assert.equal(response.status, 503);
          const text = await response.text();
          assert.equal(text, 'Delivery pending');
          assert.doesNotMatch(text, /planted|test-leads|jane/);
        });
        assert.ok(errors.length >= 1);
        assert.ok(errors.every(line => !line.includes(email) && !line.includes(TOKEN) && !line.includes('network')));
      });
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
