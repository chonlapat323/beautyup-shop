import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Everything public is open to search engines and AI crawlers; member and search pages are not indexed. */
export default function robots(): MetadataRoute.Robots {
  const privatePaths = ["account", "login", "register", "search", "forum/new"].flatMap((p) => [`/th/${p}`, `/en/${p}`]);
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", ...privatePaths] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
