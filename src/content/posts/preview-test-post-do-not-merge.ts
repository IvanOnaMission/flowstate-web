import type { Post } from "@/lib/post-rules";

// PREVIEW ONLY: exercises GuidePost on the Netlify preview. Reverted before merge.
const post: Post = {
  slug: "preview-test-post-do-not-merge",
  h1: "Preview test: can AI draft an electrician's quote?",
  metaTitle: "Preview test: can AI draft an electrician's quote for you?",
  description: "Preview only. This page checks that the guide template renders the byline, the direct answer, headings, a list, the FAQ, sources and both schema blocks well.",
  card: "Preview only: checks the guide template renders.",
  author: "jordan",
  published: "2026-11-27",
  updated: "2026-11-28",
  directAnswer: "Preview only. This sentence stands in for a real direct answer, so the template can be checked on the deploy preview before any real post is written. Flow State will replace it with a post built from real answers, and this file is reverted before the branch is merged.",
  sections: [
    { q: "Does the heading render as an H2?", a: ["Yes, if this paragraph sits under a heading.", { list: ["First list item", "Second list item"] }, "A closing paragraph."] },
    { q: "Does a second section render?", a: ["Yes, if this shows."] },
  ],
  inShort: "Preview only. Flow State uses this page to check the template.",
  faq: [
    { q: "Is this a real post?", a: "No, it is a preview check." },
    { q: "Will it be merged?", a: "No, it is reverted first." },
    { q: "Where are the rules?", a: "In the blog posts SOP." },
  ],
  sources: [{ label: "Google: creating helpful content", href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content" }],
  image: { src: "/assets/hero/workshop-hook.jpg", alt: "Preview image", width: 1376, height: 768 },
  claims: ["preview only, no claims"],
};
export default post;
