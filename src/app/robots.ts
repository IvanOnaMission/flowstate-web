import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * The private offer pages are unlisted, not secret. Keeping them out of the
 * index means a prospect who was emailed a link still gets it, but the page
 * doesn't turn up in search for anyone else. netlify.toml sends the same
 * signal as an X-Robots-Tag header — both, because a stray link can get a page
 * indexed even when it isn't crawled.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/private/", "/audit/", "/audit-full/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
