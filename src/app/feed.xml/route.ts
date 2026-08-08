import { allPosts } from "@/lib/posts";
import { site } from "@/lib/site";

// Required. Plain GET route handlers are dynamic by default since v15, so
// without this the feed ships as a serverless function instead of a build-time
// file.
export const dynamic = "force-static";

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      default:
        return "&quot;";
    }
  });
}

export function GET() {
  const items = allPosts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${site.url}${post.permalink}</link>
      <guid isPermaLink="true">${site.url}${post.permalink}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
${post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join("\n")}
      <description>${escapeXml(post.description ?? post.excerpt)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.title)}</title>
    <link>${site.url}</link>
    <description>${escapeXml(site.description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date(allPosts[0]?.date ?? Date.now()).toUTCString()}</lastBuildDate>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
