import type { MetadataRoute } from "next";

import { allPages, allPosts, allTags } from "@/lib/posts";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...allPages.map((page) => ({
      url: `${site.url}${page.permalink}`,
      lastModified: new Date(),
      // `as const` is required inside .map() or the string widens and the
      // MetadataRoute.Sitemap type stops matching.
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    ...allPosts.map((post) => ({
      url: `${site.url}${post.permalink}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...allTags.map((tag) => ({
      url: `${site.url}/tags/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    })),
  ];
}
