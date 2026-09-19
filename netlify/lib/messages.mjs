// The Telegram text for a form lead who hasn't booked. The script mirrors
// sales/lead-follow-up.md in the Flow State Lab workspace.
export const clean = (value, max = 200) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

export function formLeadMessage(lead) {
  const first = clean(lead.name).split(' ')[0] || 'there';
  return [
    'New AI Makeover lead (form, not booked yet)',
    clean(lead.name) || 'Unknown',
    `Phone: ${clean(lead.phone) || 'not given'}`,
    clean(lead.email),
    'Call them now.',
    '',
    'CALL SCRIPT',
    `"Hey ${first}, Ivan from Flowstate. You just put your details in on the AI Makeover page, so I thought I'd give you a quick ring.`,
    'What caught your eye? [listen]',
    `Easiest thing is a 30-minute chat where we look at how you quote and whether this fits. I've got [option 1] or [option 2]. Which suits?"`,
    '',
    'NO ANSWER: ring straight back, then text:',
    `"Hey ${first}, Ivan from Flowstate. Tried calling about the AI Makeover. Here's the link to grab a time that suits: flowstate.net.nz/ai-makeover. Or just reply with a good time to call."`,
    '',
    'Until you reach them: call twice a day days 1-3, then once a day until day 7.',
  ].join('\n');
}
