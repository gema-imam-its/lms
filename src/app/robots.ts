import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteConfig";

// /rapor and everything under it show real students' names and individual
// prayer-practice evaluation data (see src/app/(siswa)/rapor/page.tsx) with
// no auth gate — keeping it out of the index is a privacy requirement, not
// just SEO hygiene.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/rapor"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
