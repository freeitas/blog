import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { allTags, formatDate, getPostsByTag, getTagBySlug } from "@/lib/posts";

type Props = { params: Promise<{ tag: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return allTags.map((tag) => ({ tag: tag.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const found = getTagBySlug(tag);
  if (!found) return {};

  return {
    title: `#${found.name}`,
    description: `Posts tagged ${found.name}`,
    alternates: {
      canonical: `/tags/${found.slug}`,
      types: { "application/rss+xml": "/feed.xml" },
    },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const found = getTagBySlug(tag);
  if (!found) notFound();

  const posts = getPostsByTag(tag);

  return (
    <div className="py-6">
      <header>
        <h1 className="text-2xl font-medium">#{found.name}</h1>
        <p className="mt-1 text-sm text-black/50 dark:text-white/50">
          {found.count} {found.count === 1 ? "post" : "posts"}
        </p>
      </header>

      <hr className="my-6 border-black/10 dark:border-white/15" />

      <ul className="space-y-8">
        {posts.map((post) => (
          <li key={post.slug}>
            <article>
              <Link href={post.permalink} className="group">
                <h2 className="text-lg font-medium group-hover:underline">
                  {post.title}
                </h2>
              </Link>
              {post.description && (
                <p className="mt-1 text-black/70 dark:text-white/70">
                  {post.description}
                </p>
              )}
              <p className="mt-1 text-sm text-black/50 dark:text-white/50">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
