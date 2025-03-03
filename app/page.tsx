import { allPosts } from "@/.contentlayer/generated";
import Link from "next/link";

export default function Home() {
  // Sort posts by date in descending order (newest first)
  const sortedPosts = allPosts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="prose dark:prose-invert">
      {sortedPosts.map((post) => (
        <article key={post._id}>
          <Link href={post.slug}>
            <h2 className="mb-1">{post.title}</h2>
          </Link>
          {post.description && <p className="mt-1">{post.description}</p>}
        </article>
      ))}
    </div>
  );
}
