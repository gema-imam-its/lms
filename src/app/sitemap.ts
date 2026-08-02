import type { MetadataRoute } from "next";
import { modules } from "@/data/modules";
import { SITE_URL } from "@/lib/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/modul`, changeFrequency: "weekly", priority: 0.8 },
    ...modules
      .filter((m) => !m.locked)
      .map((m) => ({
        url: `${SITE_URL}/modul/${m.id}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    { url: `${SITE_URL}/tentang`, changeFrequency: "yearly", priority: 0.5 },
  ];
}
