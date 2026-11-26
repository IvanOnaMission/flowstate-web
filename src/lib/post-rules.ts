/**
 * The shape of a blog post (a guide under /guides/<slug>/) and the house rules it must pass.
 *
 * Rules come from docs/sops/blog-posts.md (playbook section 6.1, D06, D34, D43). They are
 * checked twice: locally with `npm run check:posts` before a PR, and again by the
 * build, where a broken post throws, so the Netlify preview fails instead of shipping it.
 *
 * Keep this file free of imports: the local check runs it with plain Node (type stripping),
 * which can't resolve the "@/..." path alias.
 */

export type Block = string | { list: readonly string[] };

export type Post = {
  /** URL slug: 3 to 7 words, lowercase, hyphenated, no year, no "best". */
  slug: string;
  /** H1: the main searched question in its own words, 60 characters or fewer. */
  h1: string;
  /** Meta title: 50 to 60 characters, the H1's words. Rendered as the whole <title>, with no " | Flow State" suffix added. */
  metaTitle: string;
  /** Meta description: 150 to 160 characters. */
  description: string;
  /** One line for the /guides/ index card. */
  card: string;
  /** A key of `authors`: the real person whose answers the post is built from. */
  author: AuthorKey;
  /** yyyy-mm-dd, the day it goes live. */
  published: string;
  /** yyyy-mm-dd, only when the content materially changed after publishing. */
  updated?: string;
  /** 40 to 55 words, at most 320 characters, names Flow State. */
  directAnswer: string;
  /** H2 = the exact searched question; its first block answers it outright. */
  sections: readonly { q: string; a: readonly Block[] }[];
  /** 3 to 5 sentences; restates, adds nothing new; names Flow State once. */
  inShort: string;
  /** 0, or 3 to 10 follow-up questions in the searched words. Rendered and put in FAQPage schema word for word. */
  faq: readonly { q: string; a: string }[];
  /** Official or vendor pages named in the text. */
  sources?: readonly { label: string; href: string }[];
  /** A real photo or screenshot (never stock or AI-made), under public/. */
  image?: { src: string; alt: string; width: number; height: number };
  /** Where every claim came from: "<claim>: <docs path, Q-number or D-number>". Not rendered; checked by review. */
  claims: readonly string[];
};

/**
 * Real people only (playbook 5.4: no invented author or persona byline). Add a person only with their yes.
 * Names and roles match /about/ (src/app/about/page.tsx): Jordan's role is "Strategy", never "Partner".
 */
export const authors = {
  ivan: { name: "Ivan Barnett", role: "Founder, Flow State", url: "/about/" },
  jordan: { name: "Jordan", role: "Strategy, Flow State", url: "/about/" },
} as const;
export type AuthorKey = keyof typeof authors;

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const date = /^\d{4}-\d{2}-\d{2}$/;

/** All visible text of a post, for the copy-wide checks. */
export function visibleText(p: Post): string[] {
  const out = [p.h1, p.metaTitle, p.description, p.card, p.directAnswer, p.inShort];
  for (const s of p.sections) {
    out.push(s.q);
    for (const b of s.a) out.push(...(typeof b === "string" ? [b] : b.list));
  }
  for (const f of p.faq) out.push(f.q, f.a);
  for (const s of p.sources ?? []) out.push(s.label);
  if (p.image) out.push(p.image.alt);
  return out;
}

/** Returns every rule a post breaks; an empty list means it passes. */
export function postProblems(p: Post): string[] {
  const e: string[] = [];
  const len = (name: string, s: string, min: number, max: number) => {
    if (s.length < min || s.length > max) e.push(`${name} is ${s.length} characters; needs ${min} to ${max}`);
  };
  const slugWords = p.slug.split("-").length;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) e.push(`slug "${p.slug}" must be lowercase words joined by hyphens`);
  if (slugWords < 3 || slugWords > 7) e.push(`slug has ${slugWords} words; needs 3 to 7`);
  if (/\b(19|20)\d\d\b/.test(p.slug) || /\bbest\b/.test(p.slug)) e.push("slug must not contain a year or \"best\"");
  len("H1", p.h1, 10, 60);
  len("meta title", p.metaTitle, 50, 60);
  len("meta description", p.description, 150, 160);
  const da = words(p.directAnswer);
  if (da < 40 || da > 55) e.push(`direct answer is ${da} words; needs 40 to 55`);
  if (p.directAnswer.length > 320) e.push(`direct answer is ${p.directAnswer.length} characters; needs 320 or fewer`);
  if (!p.directAnswer.includes("Flow State")) e.push("direct answer must name Flow State");
  if (!p.inShort.includes("Flow State")) e.push("\"In short\" must name Flow State");
  if (p.sections.length < 1) e.push("needs at least one section");
  for (const s of p.sections) if (s.a.length === 0 || typeof s.a[0] !== "string") e.push(`section "${s.q}" must open with a sentence that answers it`);
  if (p.faq.length !== 0 && (p.faq.length < 3 || p.faq.length > 10)) e.push(`FAQ has ${p.faq.length} items; needs 0, or 3 to 10`);
  if (!date.test(p.published)) e.push("published must be yyyy-mm-dd");
  if (p.updated !== undefined && (!date.test(p.updated) || p.updated < p.published)) e.push("updated must be yyyy-mm-dd and not before published");
  if (p.claims.length === 0) e.push("claims list is empty: every claim needs its source");
  if (p.image && !p.image.src.startsWith("/")) e.push("image src must be a path under public/");
  for (const t of visibleText(p)) {
    if (/[–—]/.test(t)) e.push(`em or en dash (D34): "${t.slice(0, 60)}"`);
    if (/\d\s*%|\bper ?cent\b/i.test(t)) e.push(`percentage (D06): "${t.slice(0, 60)}"`);
    if (/(\$|NZD|NZ\$)\s*\d/i.test(t)) e.push(`price (D06): "${t.slice(0, 60)}"`);
    if (/Flowstate|FlowState|FLOWSTATE/.test(t)) e.push(`name must be "Flow State", two words (D43): "${t.slice(0, 60)}"`);
  }
  return e;
}

/** Throws if any post breaks a rule, so a bad post fails the build. */
export function assertPosts(list: readonly Post[]): void {
  const seen = new Set<string>();
  const all: string[] = [];
  for (const p of list) {
    if (seen.has(p.slug)) all.push(`${p.slug}: duplicate slug`);
    seen.add(p.slug);
    for (const m of postProblems(p)) all.push(`${p.slug}: ${m}`);
  }
  if (all.length) throw new Error(`Blog post rules failed (docs/sops/blog-posts.md):\n- ${all.join("\n- ")}`);
}
