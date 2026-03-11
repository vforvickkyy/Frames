import type { MetadataRoute } from "next";
import {
  getAllFrameSlugs,
  getAllCreatorUsernames,
  getCategories,
} from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://frames.so";

  const [frameSlugs, creatorUsernames, categories] = await Promise.all([
    getAllFrameSlugs(),
    getAllCreatorUsernames(),
    getCategories(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const frameRoutes: MetadataRoute.Sitemap = frameSlugs.map((slug) => ({
    url: `${siteUrl}/frame/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${siteUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const creatorRoutes: MetadataRoute.Sitemap = creatorUsernames.map(
    (username) => ({
      url: `${siteUrl}/creator/${username}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...frameRoutes,
    ...creatorRoutes,
  ];
}
