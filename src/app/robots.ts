import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/** Publicly accessible parked pages must be crawlable for noindex to be read. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
