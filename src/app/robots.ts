import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Publicly accessible parked pages must be crawlable for noindex to be read.
 * /private/, /audit/, /audit-full/ and /ads/ stay noindex in their own HTML.
 * Do not Disallow them here, or crawlers never see that tag.
 *
 * The named AI crawlers get an explicit allow so a later wildcard change
 * cannot quietly shut them out of the public pages.
 */
export const dynamic = "force-static";

const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "PerplexityBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...aiCrawlers.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
