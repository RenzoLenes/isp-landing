import { test, expect } from "@playwright/test";
import { auditTapTargets } from "./helpers/dom";

test.describe("Tap targets (>=44px)", () => {
  test("at 390px, with the mobile menu open", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto("/");

    await page.getByRole("button", { name: "Abrir menú" }).click();
    await expect(page.getByRole("button", { name: "Cerrar menú" })).toBeVisible();

    const violations = await auditTapTargets(page);
    expect(
      violations,
      `tap-target violations at 390px (menu open):\n${violations
        .map((v) => `  ${v.selector} "${v.text}" — ${v.width}x${v.height}px`)
        .join("\n")}`,
    ).toEqual([]);
  });

  test("at 768px", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1200 });
    await page.goto("/");

    const violations = await auditTapTargets(page);
    expect(
      violations,
      `tap-target violations at 768px:\n${violations
        .map((v) => `  ${v.selector} "${v.text}" — ${v.width}x${v.height}px`)
        .join("\n")}`,
    ).toEqual([]);
  });
});
