import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

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
  const pages = [
    { path: "", priority: 1 },
    { path: "/business-essentials/", priority: 0.9 },
    { path: "/ai-for-trades-businesses/", priority: 0.9 },
    { path: "/services/", priority: 0.8 },
    { path: "/about/", priority: 0.8 },
    { path: "/contact/", priority: 0.8 },
    { path: "/ai-for-electricians/", priority: 0.8 },
    { path: "/workflow-diagnostic/", priority: 0.8 },
    { path: "/ai-quoting-for-electricians/", priority: 0.8 },
    { path: "/guides/", priority: 0.8 },
    { path: "/guides/ai-quoting-for-electricians/", priority: 0.8 },
    { path: "/guides/where-to-start-with-ai/", priority: 0.8 },
    { path: "/guides/job-software-or-custom-ai/", priority: 0.8 },
    { path: "/guides/ai-industrial-electrical-business/", priority: 0.8 },
  ];
  return pages.map(({ path, priority }) => ({
    url: `${site.url}${path || "/"}`,
    changeFrequency: "monthly" as const,
    priority,
  }));
}
