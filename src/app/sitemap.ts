import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { answerPages } from "@/lib/answers";
import { posts } from "@/lib/posts";

/**
 * Public pages and guides.
 *
 * /workflow-diagnostic/ is a hand-written page under public/ but it explains the current offer, so
 * it is listed. The other parked pages under public/ are deliberately absent: /private/p/* are
 * unlisted offer links that exist to be emailed, and /audit* is parked
 * pending a rewrite. Listing either would advertise pages we don't want found.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/services/", "/about/", "/contact/", "/ai-for-electricians/", "/workflow-diagnostic/", "/ai-quoting-for-electricians/", "/guides/", "/guides/ai-quoting-for-electricians/", "/guides/where-to-start-with-ai/", "/guides/job-software-or-custom-ai/", "/guides/ai-industrial-electrical-business/", "/questions/", ...answerPages.map((p) => p.href), ...posts.map((p) => `/guides/${p.slug}/`)];
  return pages.map((path) => ({
    url: `${site.url}${path || "/"}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
