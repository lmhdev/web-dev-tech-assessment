import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    coverage: {
      provider: "v8",
      exclude: [
        "src/main.tsx",
        "src/App.tsx",
        "src/vite-env.d.ts",
        "postcss.config.js",
        "eslint.config.js",
        "tailwind.config.cjs",
        "vite.config.ts",
        "vitest.config.ts",
        "src/pages/Home.tsx",
        "src/types/**/*",
        "**/*.test.{js,ts,jsx,tsx}",
        "dist",
      ],
    },
  },
});
