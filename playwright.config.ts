import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

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
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
