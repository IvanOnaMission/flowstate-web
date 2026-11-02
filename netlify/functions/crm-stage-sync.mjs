// Minute poll of Twenty opportunity stages. Sends Attended and Won (and a
// Booked backstop) through the CRM Conversions API. With META_CAPI_TOKEN unset
// this returns immediately and does not call Twenty.
// See docs/meta-crm-events.md for the stage names and why this is a poll.
import {getStore} from '@netlify/blobs';
import {syncCrmStageEvents} from '../lib/meta-capi.mjs';

export const config = {schedule: '* * * * *'};

const json = (status, body) => new Response(JSON.stringify(body), {status, headers: {'content-type': 'application/json'}});

export default async () => {
  if (!process.env.META_CAPI_TOKEN || !process.env.META_CAPI_DATASET_ID) return json(200, {configured: false, sent: 0, failed: 0});
  try {
    const result = await syncCrmStageEvents({store: getStore({name: 'meta-crm-events', consistency: 'strong'})});
    return json(result.failed ? 503 : 200, result);
  } catch (error) {
    console.error('CRM stage sync:', error.message);
    return json(503, {error: true});
  }
};
