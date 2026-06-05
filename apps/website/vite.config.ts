import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  root: resolve(__dirname),
  base: "/ether-theme/",
  publicDir: resolve(__dirname, "public"),
  build: {
    outDir: resolve(__dirname, "../../site"),
    emptyOutDir: true,
    target: "es2022",
    cssCodeSplit: true,
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/react-router") ||
            id.includes("/scheduler/")
          ) {
            return "vendor-react";
          }

          if (
            id.includes("/react-redux/") ||
            id.includes("/@reduxjs/toolkit/")
          ) {
            return "vendor-redux";
          }

          if (id.includes("/shiki/") || id.includes("/@shikijs/")) {
            return "vendor-shiki";
          }
        },
      },
    },
  },
  server: {
    port: 4173,
    strictPort: false,
  },
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  optimizeDeps: {
    include: [
      "shiki/core",
      "shiki/engine/javascript",
      "@shikijs/langs/javascript",
      "@shikijs/langs/typescript",
      "@shikijs/langs/jsx",
      "@shikijs/langs/tsx",
      "@shikijs/langs/html",
      "@shikijs/langs/css",
    ],
  },
});
