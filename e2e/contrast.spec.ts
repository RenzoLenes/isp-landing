import { test, expect, type Page } from "@playwright/test";
import { getContrastInfo } from "./helpers/contrast";

// WCAG AA: >=4.5:1 for normal text, >=3:1 for "large" text (>=24px, or
// >=18.66px + bold). `getContrastInfo` computes `requiredRatio` per element
// from its own computed font-size/weight, so each assertion below checks
// against the correct threshold for that surface rather than a hardcoded one.

async function report(name: string, page: Page, getLocator: () => ReturnType<Page["locator"]>) {
  const locator = getLocator();
  const info = await getContrastInfo(locator);
  console.log(
    `[contrast] ${name}: ${info.ratio.toFixed(2)}:1 (needs ${info.requiredRatio}:1, ${
      info.isLarge ? "large" : "normal"
    } text, ${info.fontSize}px/${info.fontWeight}) — fg ${info.color} on effective bg ${info.background} — ${
      info.passes ? "PASS" : "FAIL"
    }`,
  );
  return info;
}

test.describe("Contrast (computed, WCAG AA)", () => {
  test.use({ viewport: { width: 1280, height: 1000 } });

  test("navbar links (moss/80 on the glass pill)", async ({ page }) => {
    await page.goto("/");
    const info = await report("navbar link 'Producto'", page, () =>
      page.locator('nav[aria-label="Principal"] a').first(),
    );
    expect(info.ratio, `navbar link contrast ${info.ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(
      info.requiredRatio,
    );
  });

  test("pillar numbers (lavender-deep on fog)", async ({ page }) => {
    await page.goto("/");
    const info = await report("pillar number '01'", page, () =>
      page.locator("#producto p.text-lavender-deep").first(),
    );
    expect(info.ratio, `pillar number contrast ${info.ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(
      info.requiredRatio,
    );
  });

  test("secondary body text (moss on fog) — hero subtitle", async ({ page }) => {
    await page.goto("/");
    const info = await report("hero subtitle (text-moss)", page, () =>
      page.locator("h1").locator("xpath=following-sibling::p[1]"),
    );
    expect(info.ratio, `secondary text contrast ${info.ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(
      info.requiredRatio,
    );
  });

  test("form error text (coral-deep) after a failed submit", async ({ page }) => {
    await page.goto("/#piloto");
    await page.locator('button[type="submit"]', { hasText: "Enviar solicitud" }).click();

    const errorLocator = page.locator("#pilot-nombre-error");
    await expect(errorLocator).toBeVisible();
    const info = await report("form error text (coral-deep)", page, () => errorLocator);
    expect(info.ratio, `form error contrast ${info.ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(
      info.requiredRatio,
    );
  });
});
