import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Only the four public pages.
 *
 * The parked pages under public/ are deliberately absent: /private/p/* are
 * unlisted offer links that exist to be emailed, and /audit* is parked
 * pending a rewrite. Listing either would advertise pages we don't want found.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/services/", "/about/", "/contact/"];
  return pages.map((path) => ({
    url: `${site.url}${path || "/"}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
