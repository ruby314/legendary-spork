import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "fs";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
  plugins: [
    react(),
    {
      name: "copy-extension-files",
      closeBundle() {
        const clientId = env.GOOGLE_CLIENT_ID;
        if (!clientId) throw new Error("GOOGLE_CLIENT_ID env var is required");
        const manifest = readFileSync("manifest.template.json", "utf-8").replace(
          "{{GOOGLE_CLIENT_ID}}",
          clientId
        );
        writeFileSync("dist/manifest.json", manifest);
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
  };
});
