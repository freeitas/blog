import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { site } from "@/lib/site";
import "@/styles/globals.css";

export const metadata: Metadata = {
  // Required before any relative URL is used in a metadata field.
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.title}` },
  description: site.description,
  authors: [{ name: site.author }],
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/feed.xml" },
  },
  openGraph: {
    type: "website",
    siteName: site.title,
    locale: site.locale,
    url: "/",
    title: site.title,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning is required: next-themes sets the <html> class
    // before React hydrates, and React 19 is stricter about the mismatch.
    <html lang="en" suppressHydrationWarning>
      <body
        className={`min-h-screen bg-white text-black antialiased dark:bg-ink dark:text-white ${GeistSans.className}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-10">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
