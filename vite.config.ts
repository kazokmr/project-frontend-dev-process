import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  build: {},
  test: {
    globals: true,
    environment: "jsdom",
    include: ["**/*.{test,spec}.[jt]s?(x)"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
      include: ["**/src/**/!(*.stories)*.[jt]s?(x)"],
    },
    setupFiles: ["./vitest.setup.ts"],
  },
});
