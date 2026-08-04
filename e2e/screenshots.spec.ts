import { test } from "@playwright/test";
import { LANDING } from "../src/content/landing";

// Not an assertion suite — these are for a human to eyeball the gestalt
// (DESIGN.md's "densidad" and "un producto con universo propio" concerns,
// which no automated check can judge). Written to e2e/screenshots/, which is
// gitignored.
const WIDTHS = [390, 768, 1024, 1440];

test.describe("Screenshots for human review", () => {
  for (const width of WIDTHS) {
    test(`full page at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      // Sections reveal via `whileInView` (IntersectionObserver), which
      // races with Playwright's own scroll-and-capture for `fullPage`
      // screenshots — content below the fold can get caught mid-fade or
      // still at opacity: 0. Reduced motion makes `Reveal` skip straight to
      // its resting state (`initial={false}`), so the screenshot shows the
      // page as it settles, which is what a human reviewer actually wants.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.screenshot({
        path: `e2e/screenshots/full-page-${width}.png`,
        fullPage: true,
      });
    });
  }

  test("Integrations section alone at 1280px", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const section = page.locator("section", {
      has: page.getByText(LANDING.integrations.title, { exact: true }),
    });
    await section.scrollIntoViewIfNeeded();
    await section.screenshot({ path: "e2e/screenshots/integrations-1280.png" });
  });
});
