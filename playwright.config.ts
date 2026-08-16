import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;
/** PostgREST de mentira para la suite: ver `e2e/supabase-stub.mjs`. */
const STUB_PORT = 3101;

// Self-contained: `npx playwright test` builds the production bundle and
// boots `next start` on a dedicated port, so this suite never depends on a
// dev server already running. Production build is used (not `next dev`) so
// hydration timing and bundle behaviour match what actually ships.
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  // Tope de concurrencia deliberado. Con el valor por defecto (mitad de los
  // núcleos, 7 en la máquina de desarrollo) varias specs se volvían
  // intermitentes: un solo `next start` atendiendo siete navegaciones
  // simultáneas hace que algunas superen el timeout sin que exista un defecto
  // en la página. Una suite intermitente entrena a ignorar los fallos, que es
  // peor que no tenerla. Tres workers la dejan estable sin alargarla de más.
  workers: 3,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  outputDir: "./test-results",
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Dos servidores: el PostgREST de mentira y, apuntando a él, la landing.
  // Así el envío del formulario recorre el camino real —Server Action,
  // supabase-js, POST— sin escribir en la instancia de verdad y sin necesidad
  // de un "modo test" dentro del código que se publica.
  webServer: [
    {
      command: `node e2e/supabase-stub.mjs`,
      url: `http://localhost:${STUB_PORT}/`,
      reuseExistingServer: !process.env.CI,
      timeout: 20_000,
    },
    {
      command: `npm run build && npm run start -- -p ${PORT}`,
      url: BASE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
      env: {
        SUPABASE_URL: `http://localhost:${STUB_PORT}`,
        SUPABASE_SECRET_KEY: "clave-de-mentira-para-la-suite",
      },
    },
  ],
});
