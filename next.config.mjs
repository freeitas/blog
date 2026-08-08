// Dev-only Velite hook. `next build` runs Velite from the npm script instead
// ("velite build --clean && next build"), which is deterministic: no race, no
// double run, no VELITE_STARTED guard needed on the build path.
//
// Detection must be NODE_ENV, not process.argv. On Next 16 the config is
// evaluated in a child process whose argv is [node, .../start-server.js], so
// `process.argv.includes('dev')` never matches and Velite would silently never
// run in dev.
//
// The top-level await is why this file is .mjs: next.config.ts is transpiled to
// CJS and require()d, which throws ERR_REQUIRE_ASYNC_MODULE.
if (process.env.NODE_ENV === "development" && !process.env.VELITE_STARTED) {
  process.env.VELITE_STARTED = "1";
  const { build } = await import("velite");
  await build({ watch: true, clean: false });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next 16.3 rewrites AGENTS.md / CLAUDE.md at the project root on `next dev`.
  // This repo has its own CLAUDE.md workflow, so opt out.
  agentRules: false,
};

export default nextConfig;
