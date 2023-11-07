import { defineConfig } from "vitest/config";
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
  test: {
    globals: true,
    environment: "jsdom",
    include: ["**/*.{test,spec}.[jt]s?(x)"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
    },
    setupFiles: ["./vitest.setup.ts"],
  },
});
