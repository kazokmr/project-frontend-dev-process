import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "esnext",
    outDir: "dist",
    assetsDir: "static",
    minify: true,
    sourcemap: false,
  },
  optimizeDeps: {
    exclude: [
      "**/__tests__/",
      "**/mocks",
      "**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)",
    ],
  },
});
