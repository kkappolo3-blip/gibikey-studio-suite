// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Disable the Cloudflare Workers adapter so the build produces a portable
// Node/static output that platforms like Vercel can serve.
export default defineConfig({
  cloudflare: false,
  tanstackStart: {
    // Prerender all routes to static HTML — this app has no server functions,
    // so SSG works perfectly and deploys anywhere (Vercel, Netlify, etc.).
    prerender: {
      enabled: true,
      crawlLinks: true,
    },
    pages: [
      { path: "/" },
      { path: "/about" },
      { path: "/cerdika" },
      { path: "/downloader" },
      { path: "/file-convert" },
      { path: "/medical-certificate" },
      { path: "/pdf-tools" },
      { path: "/soft-murmur" },
      { path: "/tentang-kami" },
    ],
  },
});
