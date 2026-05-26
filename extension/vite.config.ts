import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, mkdirSync } from "fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-extension-files",
      closeBundle() {
        copyFileSync("manifest.json", "dist/manifest.json");
        // copy icons if they exist
        try {
          mkdirSync("dist/icons", { recursive: true });
          ["16", "48", "128"].forEach((size) => {
            try {
              copyFileSync(`icons/icon${size}.png`, `dist/icons/icon${size}.png`);
            } catch {}
          });
        } catch {}
      },
    },
  ],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup/index.html"),
        background: resolve(__dirname, "background/service-worker.ts"),
        content: resolve(__dirname, "content/capture.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
});
