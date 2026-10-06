import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"
import { getGalleries } from "@/lib/data"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/exhibitions`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...getGalleries().map((g) => ({
      url: `${SITE_URL}/gallerie/${g.id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ]
}
