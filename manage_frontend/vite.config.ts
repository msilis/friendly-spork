import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import type { UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { netlifyPlugin } from "@netlify/remix-adapter/plugin";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}
export default defineConfig({
  plugins: [
    !process.env.VITEST
      ? remix({
          future: {
            v3_fetcherPersist: true,
            v3_relativeSplatPath: true,
            v3_throwAbortReason: true,
            v3_singleFetch: true,
            v3_lazyRouteDiscovery: true,
          },
        })
      : react(),

    tsconfigPaths(),
    netlifyPlugin(),
  ],
  build: {
    sourcemap: false,
  },
  resolve: {
    alias: {
      html2canvas: "html2canvas-pro",
    },
  },
}) satisfies UserConfig;
