import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import { allPosts, formatDate, getPostBySlug } from "@/lib/posts";
import { site } from "@/lib/site";

export const alt = "Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}

// Module scope: the font does not depend on request data. The path is relative
// to the project root, not this file. ImageResponse accepts ttf/otf/woff only.
const geistSemiBold = await readFile(
  join(process.cwd(), "assets/Geist-SemiBold.ttf"),
);

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  // Metadata image routes ignore `export const dynamicParams = false` — Next's
  // metadata-route loader strips it from the re-exports — so without this guard
  // the route generates and caches a real PNG for any invented slug, while the
  // post page itself correctly 404s.
  if (!post) notFound();

  return new ImageResponse(
    (
      // next/og renders a CSS subset: flexbox only (grid is a silent no-op),
      // and every element with more than one child needs an explicit display.
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#111010",
          color: "#fafafa",
          padding: 72,
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, opacity: 0.6 }}>
          {site.title}
        </div>
        <div style={{ display: "flex", fontSize: 64, lineHeight: 1.15 }}>
          {post.title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            opacity: 0.6,
          }}
        >
          <span>{formatDate(post.date)}</span>
          <span>{post.tags.map((tag) => `#${tag}`).join("  ")}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: Uint8Array.from(geistSemiBold).buffer as ArrayBuffer,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
