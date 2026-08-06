import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteConfig";

// /rapor and everything under it show real students' names and individual
// prayer-practice evaluation data (see src/app/(guru)/rapor/page.tsx) — now
// gated behind guru login (src/lib/auth-guru.ts), but keeping it out of the
// index stays a privacy requirement in its own right, not just SEO hygiene.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/rapor"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
