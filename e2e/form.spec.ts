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
    await page.locator("#pilot-clientes").selectOption(PILOT_CLIENT_RANGES[1]);
    await page.locator("#pilot-whatsapp").fill("+51 999 888 777");
    // `reto` deliberately left blank — it is optional.

    await page.locator('button[type="submit"]').click();

    const success = page.locator('[role="status"]');
    await expect(success).toBeVisible();

    const isFocused = await success.evaluate((el) => el === document.activeElement);
    expect(isFocused, "success panel should receive focus").toBe(true);
  });
});
