import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { BlogPosting, WithContext } from "schema-dts";

import { MDXContent } from "@/components/mdx/mdx-content";
import {
  allPosts,
  formatDate,
  getAdjacentPosts,
  getPostBySlug,
} from "@/lib/posts";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    // Metadata merging is shallow, so `types` has to be restated here or the
    // root layout's feed autodiscovery link is dropped from post pages.
    alternates: {
      canonical: post.permalink,
      types: { "application/rss+xml": "/feed.xml" },
    },
    // Same shallow merge applies to openGraph: siteName and locale must be
    // restated or they are lost.
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: post.permalink,
      siteName: site.title,
      locale: site.locale,
      publishedTime: new Date(post.date).toISOString(),
      authors: [site.author],
      tags: post.tags,
      // No `images` — the colocated opengraph-image.tsx is file-based metadata
      // and always takes precedence over anything set here.
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { older, newer } = getAdjacentPosts(slug);

  const url = `${site.url}${post.permalink}`;
  const jsonLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Person", name: site.author, url: site.url },
    publisher: { "@type": "Person", name: site.author },
    keywords: post.tags.join(", "),
  };

  return (
    <article className="py-6">
      {/* Native <script>, not next/script. The escape blocks XSS via
          frontmatter, since JSON.stringify does not sanitise. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header>
        <h1 className="text-2xl font-medium">{post.title}</h1>
        {post.description && (
          <p className="mt-1 text-lg text-black/70 dark:text-white/70">
            {post.description}
          </p>
        )}
        <p className="mt-2 text-sm text-black/50 dark:text-white/50">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {" · "}
          {Math.ceil(post.metadata.readingTime)} min read
        </p>
        {post.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag, i) => (
              <li key={tag}>
                <Link
                  href={`/tags/${post.tagSlugs[i]}`}
                  className="rounded-md border border-black/15 px-2 py-0.5 text-xs hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </header>

      <hr className="my-6 border-black/10 dark:border-white/15" />

      <div className="prose dark:prose-invert">
        <MDXContent code={post.code} />
      </div>

      {(older || newer) && (
        <nav className="mt-12 flex justify-between gap-6 border-t border-black/10 pt-6 text-sm dark:border-white/15">
          {older ? (
            <Link href={older.permalink} className="max-w-[45%] hover:underline">
              ← {older.title}
            </Link>
          ) : (
            <span />
          )}
          {newer ? (
            <Link
              href={newer.permalink}
              className="max-w-[45%] text-right hover:underline"
            >
              {newer.title} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </article>
  );
}
