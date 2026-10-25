// Quote Machine leads from /quote-machine/: the offer name and the ad they came from,
// for Ivan's lead alert.
const clean = (value, max = 200) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

export const OFFER = 'Quote Machine';

export function sourceLine(data = {}) {
  const ad = clean(data.ad_id, 40);
  const utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].map(k => clean(data[k], 80)).filter(Boolean).join(' / ');
  if (!ad && !utm) return '';
  return `Came from: ${[ad && `ad ${ad}`, utm].filter(Boolean).join(' · ')}`;
}
