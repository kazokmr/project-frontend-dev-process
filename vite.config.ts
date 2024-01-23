import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import path from "node:path";

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
  // TODO msw-storybook-addon 2.0.0-beta.0 の Bugのworkaround 解消したら消す
  resolve: {
    alias: {
      "msw/native": path.resolve(__dirname, "./node_modules/msw/lib/native/index.mjs"),
    },
  },
});
