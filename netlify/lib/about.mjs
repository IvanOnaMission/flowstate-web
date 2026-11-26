// "About them" lines for a lead alert: their business website (from a work email
// address) and where the booking came from. Best effort: any failure just leaves a
// line out, and the website check gives up after a few seconds so the alert isn't held up.
import {clean} from './messages.mjs';

// Free and ISP mailboxes say nothing about the business, so there's no site to look up.
const PERSONAL = new Set([
  'gmail.com', 'googlemail.com', 'outlook.com', 'outlook.co.nz', 'hotmail.com', 'hotmail.co.nz', 'live.com',
  'live.co.nz', 'msn.com', 'icloud.com', 'me.com', 'mac.com', 'yahoo.com', 'yahoo.co.nz', 'aol.com',
  'protonmail.com', 'proton.me', 'xtra.co.nz', 'spark.co.nz', 'slingshot.co.nz', 'orcon.net.nz',
  'vodafone.co.nz', 'vodafone.net.nz', 'clear.net.nz', 'paradise.net.nz', 'actrix.co.nz', 'ihug.co.nz',
  'inspire.net.nz', 'kinect.co.nz', 'farmside.co.nz', 'snap.net.nz', 'woosh.co.nz', 'bigpond.com',
]);

export function workDomain(email) {
  const domain = String(email ?? '').trim().toLowerCase().split('@')[1] || '';
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(domain) || /^[\d.]+$/.test(domain)) return '';
  return PERSONAL.has(domain) ? '' : domain;
}

const decode = s => s.replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');

export function pageSummary(html) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '';
  const meta = html.match(/<meta[^>]+(?:name|property)=["'](?:og:)?description["'][^>]*>/i)?.[0] || '';
  const description = meta.match(/content=["']([^"']*)["']/i)?.[1] || '';
  return {title: clean(decode(title), 120), description: clean(decode(description), 300)};
}

async function website(domain, timeoutMs) {
  const res = await fetch(`https://${domain}/`, {
    signal: AbortSignal.timeout(timeoutMs),
    headers: {'user-agent': 'Mozilla/5.0 (Flow State lead alert)'},
  });
  if (!res.ok || !/html/i.test(res.headers.get('content-type') || '')) return null;
  return pageSummary((await res.text()).slice(0, 200_000));
}

function source(tracking) {
  const t = tracking || {};
  const from = [t.utm_source, t.utm_medium].map(v => clean(v, 40)).filter(Boolean).join(' / ');
  if (!from) return '';
  const campaign = clean(t.utm_campaign, 80), ad = clean(t.utm_content, 80);
  return `Came from: ${from}${campaign ? `, ${campaign}` : ''}${ad ? ` (${ad})` : ''}`;
}

export async function aboutLead({email, tracking}, {timeoutMs = 4000} = {}) {
  const lines = [];
  const domain = workDomain(email);
  if (domain) {
    const site = await website(domain, timeoutMs).catch(() => null);
    if (site && (site.title || site.description)) {
      lines.push(`Website: ${domain}`, ...[site.title, site.description].filter(Boolean));
    } else {
      lines.push(`Work email at ${domain} (couldn't read the website)`);
    }
  } else if (email) {
    lines.push('Personal email, no business website to look up');
  }
  const from = source(tracking);
  if (from) lines.push(from);
  return lines;
}
