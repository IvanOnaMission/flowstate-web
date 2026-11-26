// Checks every post in src/content/posts/ against the house rules before a PR.
// Run: node scripts/check-posts.mts   (Node 22.6+ strips the types; no install needed)
// The build runs the same rules (src/lib/posts.ts), so this is the fast local copy of that gate.
import { readdirSync } from "node:fs";
import { postProblems, visibleText, type Post } from "../src/lib/post-rules.ts";

function wordsOf(p: Post): string[] {
  return visibleText(p).join(" ").toLowerCase().replace(/[^a-z0-9' ]+/g, " ").split(/\s+/).filter(Boolean);
}
// Trade, place and product names are removed before comparing (playbook 12.5): a page that
// differs from another only by "plumber" for "electrician" is a near-copy.
const names = /^(electricians?|electrical|plumbers?|plumbing|builders?|building|hvac|gasfitters?|roofers?|painters?|tradies|trades?|auckland|wellington|christchurch|hamilton|tauranga|nz|zealand|new|fergus|simpro|servicem8|tradify|xero|myob|aroflo)$/;
function shingles(p: Post): Set<string> {
  const w = wordsOf(p).filter((x) => !names.test(x)), out = new Set<string>();
  for (let i = 0; i + 5 <= w.length; i++) out.add(w.slice(i, i + 5).join(" "));
  return out;
}

const dir = new URL("../src/content/posts/", import.meta.url);
const files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
let failed = 0;
let pairs = 0;
const slugs = new Set<string>();
const loaded: Post[] = [];
for (const f of files) {
  const mod = await import(new URL(f, dir).href);
  const post: Post | undefined = mod.default;
  if (!post) { console.log(`✗ ${f}: no default export`); failed++; continue; }
  const problems = postProblems(post);
  if (`${post.slug}.ts` !== f) problems.push(`file name must be ${post.slug}.ts`);
  if (slugs.has(post.slug)) problems.push("duplicate slug");
  slugs.add(post.slug);
  const n = wordsOf(post).length;
  if (n < 300) problems.push(`${n} words; a post needs at least 300 of its own (playbook 12.5)`);
  loaded.push(post);
  if (problems.length) { failed++; console.log(`✗ ${f}\n  - ${problems.join("\n  - ")}`); }
  else console.log(`✓ ${f}`);
}
// Similarity (playbook 12.5): the share of one post's five-word runs found in another.
// Half or more means the two are near-copies: rewrite one.
for (let i = 0; i < loaded.length; i++)
  for (let j = i + 1; j < loaded.length; j++) {
    const a = shingles(loaded[i]), b = shingles(loaded[j]);
    let shared = 0;
    for (const s of a) if (b.has(s)) shared++;
    const share = shared / Math.max(1, Math.min(a.size, b.size));
    if (share >= 0.5) { pairs++; console.log(`✗ ${loaded[i].slug} and ${loaded[j].slug} share ${Math.round(share * 100)} in 100 of their wording; rewrite one`); }
  }
console.log(files.length ? `${files.length - failed} of ${files.length} posts pass the rules; ${pairs} near-copy pairs.` : "No posts yet.");
process.exitCode = failed || pairs ? 1 : 0;
