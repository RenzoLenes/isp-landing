import { test, expect } from "@playwright/test";
import { getActiveElementFocusStyle } from "./helpers/dom";

test.describe("Mobile menu", () => {
  test.use({ viewport: { width: 390, height: 900 } });

  test("hamburger opens the menu, aria-expanded tracks state, Escape closes it", async ({
    page,
  }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: "Abrir menú" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    const closeToggle = page.getByRole("button", { name: "Cerrar menú" });
    await expect(closeToggle).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator('nav[aria-label="Principal móvil"]')).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Abrir menú" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await expect(page.locator('nav[aria-label="Principal móvil"]')).toHaveCount(0);
  });
});

test.describe("Keyboard focus indicator", () => {
  test.use({ viewport: { width: 1280, height: 1000 } });

  test("every element reached by Tab has a visible focus indicator", async ({ page }) => {
    await page.goto("/");
    await page.locator("body").click({ position: { x: 5, y: 5 } });

    const violations: { index: number; info: NonNullable<Awaited<ReturnType<typeof getActiveElementFocusStyle>>> }[] =
      [];
    const seen = new Set<string>();
    const MAX_TABS = 40;

    for (let i = 0; i < MAX_TABS; i++) {
      await page.keyboard.press("Tab");
      const info = await getActiveElementFocusStyle(page);
      if (!info) break;

      const key = `${info.selector}`;
      if (seen.has(key)) {
        // Tab order has wrapped back to an element we already visited —
        // we've covered every focusable element on the page.
        break;
      }
      seen.add(key);

      if (!info.hasVisibleIndicator) {
        violations.push({ index: i, info });
      }
    }

    expect(
      violations,
      `elements focused via Tab with no visible focus indicator (no outline, no box-shadow):\n${violations
        .map(
          (v) =>
            `  [tab ${v.index}] ${v.info.selector} — outline: ${v.info.outlineStyle} ${v.info.outlineWidth}, box-shadow: ${v.info.boxShadow}`,
        )
        .join("\n")}`,
    ).toEqual([]);
    expect(seen.size, "expected to reach more than a couple of focusable elements").toBeGreaterThan(5);
  });
});
