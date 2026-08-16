import { test, expect } from "@playwright/test";
import { PILOT_CLIENT_RANGES } from "../src/content/landing";

// The vitest suite (src/lib/pilot.test.ts) already covers `validatePilotForm`
// in isolation. This spec covers what only a real browser can settle: DOM
// wiring (aria-invalid, error clearing on input) and focus management on
// success.
//
// Note on "the four required fields" (verification checklist item 8 /
// task item 8): `src/lib/pilot.ts` currently validates FIVE fields as
// required — nombre, isp, sistema, clientes, whatsapp. Only `reto` ("¿Qué te
// quita más tiempo?") is optional, per the density-redesign spec §8. The
// assertions below check all 5 actually-required fields rather than 4; the
// "four" in the checklist appears to be stale against the current field set.

const REQUIRED_FIELDS = ["nombre", "isp", "sistema", "clientes", "whatsapp"] as const;

test.describe("Pilot form flow", () => {
  test.use({ viewport: { width: 1280, height: 1200 } });

  test("submitting empty shows errors + aria-invalid on all required fields, not on the optional one", async ({
    page,
  }) => {
    await page.goto("/#piloto");
    await page.locator('button[type="submit"]').click();

    for (const field of REQUIRED_FIELDS) {
      const control = page.locator(`#pilot-${field}`);
      await expect(control, `#pilot-${field} aria-invalid`).toHaveAttribute(
        "aria-invalid",
        "true",
      );
      await expect(page.locator(`#pilot-${field}-error`), `#pilot-${field}-error visible`).toBeVisible();
    }

    // `reto` is optional and must not error.
    const reto = page.locator("#pilot-reto");
    await expect(reto).toHaveAttribute("aria-invalid", "false");
    await expect(page.locator("#pilot-reto-error")).toHaveCount(0);
  });

  test("correcting a field clears its own error and aria-invalid", async ({ page }) => {
    await page.goto("/#piloto");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator("#pilot-nombre")).toHaveAttribute("aria-invalid", "true");

    await page.locator("#pilot-nombre").fill("Carla Mendoza");

    await expect(page.locator("#pilot-nombre")).toHaveAttribute("aria-invalid", "false");
    await expect(page.locator("#pilot-nombre-error")).toHaveCount(0);

    // Other untouched fields must still show their errors.
    await expect(page.locator("#pilot-isp")).toHaveAttribute("aria-invalid", "true");
  });

  test("a fully valid submission shows the success panel, which receives focus", async ({
    page,
  }) => {
    await page.goto("/#piloto");

    await page.locator("#pilot-nombre").fill("Carla Mendoza");
    await page.locator("#pilot-isp").fill("Red Andina");
    await page.locator("#pilot-sistema").fill("MikroWisp");
    // `clientes` pasó de `<select>` a un grupo de fichas (radios). Se elige
    // por su rol, que es lo que ve quien navega con teclado o lector.
    await page
      .locator("#pilot-clientes")
      .getByRole("radio", { name: PILOT_CLIENT_RANGES[1], exact: true })
      .check();
    await page.locator("#pilot-whatsapp").fill("+51 999 888 777");
    // `reto` deliberately left blank — it is optional.

    await page.locator('button[type="submit"]').click();

    const success = page.locator('[role="status"]');
    await expect(success).toBeVisible();

    const isFocused = await success.evaluate((el) => el === document.activeElement);
    expect(isFocused, "success panel should receive focus").toBe(true);
  });

  // El test que protege la promesa de la sección. El panel de éxito dice «te
  // escribimos en menos de 48 horas»: enseñarlo cuando la solicitud no se
  // guardó deja a alguien esperando un mensaje que nadie va a mandar. Si
  // alguna vez se «simplifica» el manejo de errores y el éxito vuelve a ser
  // incondicional, esto se pone rojo.
  test("cuando el guardado falla NO aparece el panel de éxito, sino un error con los datos intactos", async ({
    page,
  }) => {
    await page.goto("/#piloto");

    // El stub devuelve 500 para este ISP; ver `e2e/supabase-stub.mjs`.
    await page.locator("#pilot-nombre").fill("Carla Mendoza");
    await page.locator("#pilot-isp").fill("FALLA-EL-INSERT");
    await page.locator("#pilot-sistema").fill("MikroWisp");
    await page
      .locator("#pilot-clientes")
      .getByRole("radio", { name: PILOT_CLIENT_RANGES[1], exact: true })
      .check();
    await page.locator("#pilot-whatsapp").fill("+51 999 888 777");

    await page.locator('button[type="submit"]').click();

    // Acotado al formulario: Next inyecta su propio anunciador de rutas con
    // `role="alert"` en el `body`, y sin acotar el locator resuelve a dos.
    const alerta = page.locator('form [role="alert"]');
    await expect(alerta).toBeVisible();
    await expect(alerta).toContainText("No pudimos enviar tu solicitud.");
    await expect(page.locator('[role="status"]')).toHaveCount(0);

    // El formulario sigue en pie y con lo escrito: reintentar no puede
    // significar teclearlo todo otra vez.
    await expect(page.locator("#pilot-nombre")).toHaveValue("Carla Mendoza");
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });
});
