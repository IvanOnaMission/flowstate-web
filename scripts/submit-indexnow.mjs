// Run after a production deploy. This public ownership token is served by the site.
import { readFile } from 'node:fs/promises';
const host = 'flowstate.net.nz';
const base = `https://${host}`;
const key = (await readFile(new URL('../public/indexnow-key.txt', import.meta.url), 'utf8')).trim();
const liveKey = await fetch(`${base}/indexnow-key.txt`);
if (!liveKey.ok || (await liveKey.text()).trim() !== key) throw new Error('Deploy the ownership file before submitting URLs.');
const sitemap = await fetch(`${base}/sitemap.xml`);
if (!sitemap.ok) throw new Error('Cannot load production sitemap.');
const urlList = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
if (!urlList.length || urlList.some(url => new URL(url).origin !== base)) throw new Error('Invalid sitemap URLs.');
const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ host, key, keyLocation: `${base}/indexnow-key.txt`, urlList }),
});
console.log(`IndexNow: HTTP ${response.status}; ${urlList.length} public URLs submitted.`);
if (![200, 202].includes(response.status)) throw new Error(await response.text());
console.log(response.status === 202 ? 'Received; ownership validation pending. This does not confirm indexing.' : 'Received. This does not confirm indexing.');
