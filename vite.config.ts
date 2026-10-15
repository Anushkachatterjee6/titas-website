// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    routeRules: {
      // Homepage has zero per-visitor content (no server-rendered auth/cart
      // state — see TiTAS mobile-performance investigation), so a shared
      // edge cache can safely reuse a recent response instead of invoking
      // the SSR function on every hit. This does not make the route
      // static: a cache miss still renders dynamically as before.
      "/": {
        headers: { "cache-control": "public, s-maxage=300, stale-while-revalidate=3600" },
      },
    },
    // The wrapper's `nitro` type intentionally only exposes a narrow
    // subset of options (see its own doc comment above `nitro?:` in
    // node_modules/@lovable.dev/vite-tanstack-config: "File an issue if
    // you need more"). `routeRules` is a standard, stable Nitro option
    // that passes through to the real nitro() plugin unchanged at
    // runtime — verified via a production build and inspecting both
    // .vercel/output/config.json and the deployed function's actual
    // response headers. This cast only widens the type at this one call
    // site; it doesn't change what gets built.
  } as unknown as { preset?: string },
});
