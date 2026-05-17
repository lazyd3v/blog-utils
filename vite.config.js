import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  publicDir: "static",
  build: {
    outDir: "dist",
    lib: {
      entry: resolve(rootDir, "globe.js"),
      name: "Globe",
      formats: ["iife"],
      fileName: () => "globe.js",
    },
    rollupOptions: {
      output: {
        assetFileNames: "globe.[ext]",
        chunkFileNames: "globe.js",
        entryFileNames: "globe.js",
      },
    },
    cssCodeSplit: false,
  },
});
