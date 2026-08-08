/**
 * Single source of truth for site identity.
 *
 * `url` drives metadataBase, the sitemap, the RSS feed and JSON-LD, so it must
 * be the real production origin. Set NEXT_PUBLIC_SITE_URL in the Vercel project
 * settings; the localhost fallback only exists so local builds work.
 */
export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  title: "freitas",
  description: "software engineer — notes on security, containers and networks",
  author: "Guilherme Freitas",
  locale: "en_US",
  links: {
    github: "https://github.com/freeitas",
    linkedin: "https://www.linkedin.com/in/guilhermehfds/",
  },
} as const;
