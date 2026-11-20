// Daily Telegram count of the /pack/ waitlist, instead of an alert per signup (Ivan, 21 Nov 2026).
// Reads everyone with the Kit pack-waitlist tag and counts who was tagged in the last 24 hours.
import {waitlistTag} from './pack-waitlist.mjs';

const DAY_MS = 24 * 60 * 60 * 1000;

/** All subscribers on the tag, following Kit's cursor pages. `get` fetches one Kit API path. */
export async function waitlistSubscribers(get, tagId = waitlistTag()) {
  const all = [];
  let after = '';
  for (let page = 0; page < 200; page++) {
    const q = new URLSearchParams({per_page: '1000', ...(after ? {after} : {})});
    const data = await get(`/tags/${tagId}/subscribers?${q}`);
    all.push(...(data.subscribers || []));
    if (!data.pagination?.has_next_page || !data.pagination.end_cursor) return all;
    after = data.pagination.end_cursor;
  }
  throw new Error('pack digest: too many pages');
}

export function countWaitlist(subscribers, now = Date.now()) {
  const recent = subscribers.filter(s => {
    const t = Date.parse(s.tagged_at || s.created_at || '');
    return Number.isFinite(t) && now - t < DAY_MS;
  }).length;
  return {recent, total: subscribers.length};
}

export const digestMessage = ({recent, total}) =>
  `Pack waitlist: ${recent} new sign-up${recent === 1 ? '' : 's'} in the last 24 hours. ${total} on the list.`;
