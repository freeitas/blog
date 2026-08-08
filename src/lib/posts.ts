import { pages, posts } from "#velite";

export type Post = (typeof posts)[number];
export type Page = (typeof pages)[number];

const isDev = process.env.NODE_ENV === "development";

/**
 * Newest first. Copied before sorting, because sorting the imported array in place
 * would mutate module state shared by every route that imports it.
 * Drafts are visible in dev only.
 *
 * The slug tie-breaker is load-bearing: velite globs the filesystem, so posts
 * sharing a date arrive in non-deterministic order and would otherwise swap
 * places between builds, silently reordering the index, the feed and the
 * prev/next links with no content change.
 */
export const allPosts: Post[] = [...posts]
  .filter((post) => isDev || !post.draft)
  .sort(
    (a, b) =>
      +new Date(b.date) - +new Date(a.date) || a.slug.localeCompare(b.slug),
  );

export function getPostBySlug(slug: string): Post | undefined {
  return allPosts.find((post) => post.slug === slug);
}

/** Older/newer neighbours in the sorted list, for post footer navigation. */
export function getAdjacentPosts(slug: string): {
  older?: Post;
  newer?: Post;
} {
  const index = allPosts.findIndex((post) => post.slug === slug);
  if (index === -1) return {};
  return { older: allPosts[index + 1], newer: allPosts[index - 1] };
}

export const allPages: Page[] = [...pages];

export function getPageBySlug(slug: string): Page | undefined {
  return allPages.find((page) => page.slug === slug);
}

export type Tag = { name: string; slug: string; count: number };

/** Tag index derived from posts. tagSlugs are precomputed in velite.config.ts. */
export const allTags: Tag[] = Object.values(
  allPosts.reduce<Record<string, Tag>>((acc, post) => {
    post.tags.forEach((name, i) => {
      const slug = post.tagSlugs[i];
      acc[slug] ??= { name, slug, count: 0 };
      acc[slug].count += 1;
    });
    return acc;
  }, {}),
).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

export function getTagBySlug(slug: string): Tag | undefined {
  return allTags.find((tag) => tag.slug === slug);
}

export function getPostsByTag(tagSlug: string): Post[] {
  return allPosts.filter((post) => post.tagSlugs.includes(tagSlug));
}

/** Post dates are UTC midnight (s.isodate), so format in UTC or they render a day early. */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
