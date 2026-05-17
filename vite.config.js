import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  publicDir: "static",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(rootDir, "index.html"),
        globe: resolve(rootDir, "globe.js"),
      },
    },
  },
});
