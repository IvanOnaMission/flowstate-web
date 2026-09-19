// Runs every minute: sends the "form, not booked yet" Telegram alert for any lead
// who has been on the holding list longer than the delay and still hasn't booked.
// See submission-created.mjs for why the alert waits. Each lead is removed from the
// list only after Telegram accepts the message, so a failed send is retried next minute.
import {formLeadMessage} from '../lib/messages.mjs';
import {DELAY_MS, dueLeads, forgetLead} from '../lib/pending.mjs';
import {sendAlert, sendContact} from '../lib/telegram.mjs';

export const config = {schedule: '* * * * *'};

export default async () => {
  const due = await dueLeads(DELAY_MS);
  let sent = 0;
  for (const {key, lead} of due) {
    try {
      await sendAlert(formLeadMessage(lead));
      await sendContact(lead);
      await forgetLead(key);
      sent += 1;
    } catch (err) {
      console.error(`pending-lead-alerts: ${key} failed, will retry:`, err.message);
    }
  }
  if (due.length) console.log(`pending-lead-alerts: ${sent}/${due.length} sent`);
  return new Response(JSON.stringify({due: due.length, sent}), {status: 200, headers: {'content-type': 'application/json'}});
};
