import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { defineCollection, defineConfig, getImageMetadata, s } from "velite";

/**
 * Local slugifier. Avoids a github-slugger dependency and lets us bake tag
 * slugs into the generated JSON, so nothing has to be slugged at runtime.
 */
const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Stamp intrinsic width/height onto markdown images.
 *
 * Velite rewrites `![alt](./x.png)` to a hashed /static/ URL but emits no
 * dimensions, so the browser cannot reserve space and every in-content image
 * causes layout shift. This reads the real file at build time and adds the
 * attributes, which lets the browser derive an aspect ratio before load.
 *
 * Resolves both the pre-rewrite relative form and the post-rewrite /static/
 * form, so it does not depend on where velite orders its own copy plugin.
 * Failures are non-fatal: a missing or unreadable image just keeps the old
 * dimensionless behaviour rather than breaking the build.
 */
interface MdastNode {
  type: string;
  url?: string;
  data?: { hProperties?: Record<string, unknown> };
  children?: MdastNode[];
}

/** velite does not re-export unist-util-visit, and depending on a hoisted
 *  transitive copy is fragile, so walk the tree directly. */
const collectImages = (node: MdastNode, found: MdastNode[] = []): MdastNode[] => {
  if (node.type === "image") found.push(node);
  node.children?.forEach((child) => collectImages(child, found));
  return found;
};

/**
 * Candidate on-disk paths for an image URL, most likely first.
 *
 * Velite pushes its own remarkCopyLinkedFiles ahead of user plugins, so by the
 * time this runs the URL is already the hashed `/static/name-abc123.ext` form —
 * and the asset has not been written to public/ yet, so reading it there fails.
 * The original file is still beside the .mdx, so strip the hash that the
 * configured `output.name` pattern added and look there first.
 */
const imageCandidates = (url: string, mdxPath: string): string[] => {
  const fromSource = (name: string) => resolve(dirname(mdxPath), name);
  const base = url.split("/").pop() ?? url;
  const unhashed = base.replace(/-[0-9a-f]{6}(\.[^.]+)$/i, "$1");

  return url.startsWith("/")
    ? [fromSource(unhashed), join(process.cwd(), "public", url)]
    : [fromSource(url), fromSource(unhashed)];
};

const remarkImageDimensions =
  () =>
  async (tree: MdastNode, file: { path?: string }): Promise<void> => {
    if (!file.path) return;

    await Promise.all(
      collectImages(tree).map(async (node) => {
        const url = node.url;
        if (!url || /^(https?:)?\/\//.test(url) || url.startsWith("data:")) {
          return;
        }

        let buffer: Buffer | null = null;
        for (const candidate of imageCandidates(url, file.path!)) {
          buffer = await readFile(candidate).catch(() => null);
          if (buffer) break;
        }
        if (!buffer) return;

        const metadata = await getImageMetadata(buffer).catch(() => null);
        if (!metadata?.width || !metadata?.height) return;

        node.data ??= {};
        node.data.hProperties = {
          ...node.data.hProperties,
          width: metadata.width,
          height: metadata.height,
        };
      }),
    );
  };

/**
 * Object-form `theme` puts shiki in dual-theme mode, which forces
 * `defaultColor: false`. The emitted HTML then carries only `--shiki-light` /
 * `--shiki-dark` custom properties and no literal colors, so the rules in
 * src/styles/globals.css are mandatory rather than cosmetic.
 */
const prettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark-dimmed" },
  keepBackground: true,
  // A fence with no language would otherwise emit a bare <pre><code> with no
  // <figure>/data-theme and fall through to prose's dark <pre> styling.
  defaultLang: { block: "text", inline: "text" },
};

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/index.mdx",
  schema: s
    .object({
      title: s.string().max(99),
      description: s.string().max(999).optional(),
      // s.isodate() normalises "2025-03-09" to "2025-03-09T00:00:00.000Z" (UTC).
      date: s.isodate(),
      cover: s.image().optional(),
      draft: s.boolean().default(false),
      tags: s.array(s.string()).default([]),
      path: s.path(), // -> "posts/trivy" (root-relative, /index stripped)
      metadata: s.metadata(), // -> { readingTime, wordCount }
      excerpt: s.excerpt(),
      code: s.mdx(), // -> compiled function-body string
    })
    .transform(({ path, tags, ...data }) => {
      const slug = path.replace(/^posts\//, "");
      return {
        ...data,
        tags,
        tagSlugs: tags.map(slugify),
        slug,
        permalink: `/posts/${slug}`,
      };
    }),
});

const pages = defineCollection({
  name: "Page",
  pattern: "pages/*.mdx",
  schema: s
    .object({
      title: s.string().max(99),
      description: s.string().max(999).optional(),
      path: s.path(), // -> "pages/about"
      code: s.mdx(),
    })
    .transform(({ path, ...data }) => {
      const slug = path.replace(/^pages\//, "");
      return { ...data, slug, permalink: `/${slug}` };
    }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts, pages },
  // Must be `mdx:`, not `markdown:` — s.mdx() reads a different config branch,
  // and the wrong key applies zero plugins without erroring.
  // gfm defaults to true here, so remark-gfm is already applied; adding the
  // package would double-register it.
  mdx: {
    remarkPlugins: [remarkImageDimensions],
    rehypePlugins: [
      rehypeSlug,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [rehypePrettyCode as any, prettyCodeOptions],
    ],
  },
});
