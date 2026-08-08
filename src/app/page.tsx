import Link from "next/link";

import { allPosts, formatDate } from "@/lib/posts";

export default function HomePage() {
  return (
    <div className="py-6">
      <ul className="space-y-8">
        {allPosts.map((post) => (
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
                {" · "}
                {Math.ceil(post.metadata.readingTime)} min read
              </p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
