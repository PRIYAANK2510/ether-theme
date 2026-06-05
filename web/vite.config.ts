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
    outDir: resolve(__dirname, "../site"),
    emptyOutDir: true,
  },
  server: {
    port: 4173,
    strictPort: true,
  },
});
