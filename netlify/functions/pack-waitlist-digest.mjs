// Once a day at 9am NZ summer time (20:00 UTC; 8am in winter): how many people joined the /pack/
// waitlist in the last 24 hours and how many are on it, as one Telegram message.
// Env: KIT_API_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (KIT_TAG_PACK_WAITLIST optional).
import {countWaitlist, digestMessage, waitlistSubscribers} from '../lib/pack-digest.mjs';
import {sendAlert} from '../lib/telegram.mjs';

export const config = {schedule: '0 20 * * *'};

async function kitGet(path) {
  const res = await fetch(`https://api.kit.com/v4${path}`, {headers: {'x-kit-api-key': process.env.KIT_API_KEY}});
  if (!res.ok) throw new Error(`Kit ${path} ${res.status} ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

export default async () => {
  try {
    const counts = countWaitlist(await waitlistSubscribers(kitGet));
    await sendAlert(digestMessage(counts));
    return new Response(JSON.stringify(counts), {status: 200, headers: {'content-type': 'application/json'}});
  } catch (err) {
    console.error('pack-waitlist-digest failed:', err.message);
    return new Response('pack digest failed', {status: 502});
  }
};
