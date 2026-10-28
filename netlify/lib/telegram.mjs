// Telegram delivery for lead alerts: the text alert and a tappable contact card.
// Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
async function call(method, body) {
  const {TELEGRAM_BOT_TOKEN: bot, TELEGRAM_CHAT_ID: chat} = process.env;
  if (!bot || !chat) throw new Error('Telegram not configured');
  const res = await fetch(`https://api.telegram.org/bot${bot}/${method}`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({chat_id: chat, ...body}),
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok || !out.ok) throw new Error(`Telegram ${method} ${res.status} ${out.description || ''}`);
  return out.result;
}

export const sendAlert = text => call('sendMessage', {text: String(text).slice(0, 4000), disable_web_page_preview: true});
export const editAlert = (messageId, text) => call('editMessageText', {message_id: messageId, text: String(text).slice(0, 4000), disable_web_page_preview: true});

// NZ numbers typed as 021 123 4567 become +64211234567 so the card dials from anywhere.
export function dialable(phone) {
  let digits = String(phone ?? '').replace(/[^\d+]/g, '');
  if (digits.startsWith('00')) digits = `+${digits.slice(2)}`;
  if (/^0\d{7,}$/.test(digits)) digits = `+64${digits.slice(1)}`;
  return /^\+?\d{7,15}$/.test(digits) ? digits : '';
}

const vcardSafe = s => String(s ?? '').replace(/[\n\r;,\\]/g, ' ').trim();

// The card Ivan sees in the chat: "Jane Smith (AI Makeover lead)" with a number to tap.
export function contactCard({name, phone, email, label = 'AI Makeover lead'}) {
  const number = dialable(phone);
  if (!number) return null;
  const parts = String(name ?? '').trim().split(/\s+/).filter(Boolean);
  const first = parts[0] || 'Lead';
  const rest = parts.slice(1).join(' ');
  const last = rest ? `${rest} (${label})` : `(${label})`;
  const vcard = [
    'BEGIN:VCARD', 'VERSION:3.0',
    `N:${vcardSafe(rest)};${vcardSafe(first)};;;`,
    `FN:${vcardSafe(`${first} ${rest}`.trim())}`,
    `ORG:${vcardSafe(label)}`,
    `TEL;TYPE=CELL:${number}`,
    email ? `EMAIL:${vcardSafe(email)}` : null,
    `NOTE:Flowstate ${vcardSafe(label)} from flowstate.net.nz`,
    'END:VCARD',
  ].filter(Boolean).join('\n');
  return {phone_number: number, first_name: first.slice(0, 64), last_name: last.slice(0, 64), vcard};
}

// Never lets a missing or odd phone number block the text alert.
export async function sendContact(lead) {
  const card = contactCard(lead);
  if (!card) return false;
  try {
    await call('sendContact', card);
    return true;
  } catch (err) {
    console.error('telegram contact card failed:', err.message);
    return false;
  }
}
