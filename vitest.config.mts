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
});
