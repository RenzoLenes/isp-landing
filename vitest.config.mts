import path from "node:path";
import { defineConfig } from "vitest/config";

// Espeja el alias "@/*" -> "./src/*" de tsconfig.json: pilot.ts ahora importa
// PILOT_CLIENT_RANGES desde src/content/landing.ts con ese alias, y vitest no
// resuelve los paths de tsconfig por su cuenta.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    // The Playwright suite lives in e2e/ and runs against a real browser via
    // `npx playwright test`; vitest must never try to collect those specs
    // (they use `@playwright/test`'s `test`/`expect`, not vitest's). Setting
    // `exclude` replaces vitest's default list rather than extending it, so
    // vitest's own defaults are repeated here alongside `e2e/**`.
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
      "**/e2e/**",
    ],
  },
});
