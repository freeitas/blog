import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MDXContent } from "@/components/mdx/mdx-content";
import { allPages, getPageBySlug } from "@/lib/posts";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return allPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: page.permalink,
      types: { "application/rss+xml": "/feed.xml" },
    },
  };
}

export default async function StaticPage({ params }: Props) {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) notFound();

  return (
    <article className="py-6">
      <header>
        <h1 className="text-2xl font-medium">{page.title}</h1>
        {page.description && (
          <p className="mt-1 text-lg text-black/70 dark:text-white/70">
            {page.description}
          </p>
        )}
      </header>

      <hr className="my-6 border-black/10 dark:border-white/15" />

      <div className="prose dark:prose-invert">
        <MDXContent code={page.code} />
      </div>
    </article>
  );
}
