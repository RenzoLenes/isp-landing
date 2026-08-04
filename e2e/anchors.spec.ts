import { test, expect } from "@playwright/test";

test.describe("Anchor navigation", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("every nav link's href resolves to an existing element id, and the target clears the fixed navbar", async ({
    page,
  }) => {
    // `test.use({ reducedMotion })` isn't in this Playwright version's
    // PlaywrightTestOptions type; emulate it directly so the CSS
    // `scroll-behavior: smooth` rule (disabled under reduced motion, see
    // globals.css) doesn't leave the click's scroll mid-animation.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const header = page.locator("header");
    const links = page.locator('nav[aria-label="Principal"] a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    const hrefs: string[] = [];
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute("href");
      if (href) hrefs.push(href);
    }
    // Include the CTA link too — it is part of the same nav pill.
    const ctaHref = await page.locator('header a', { hasText: "Acceso al piloto" }).getAttribute("href");
    if (ctaHref) hrefs.push(ctaHref);

    for (const href of hrefs) {
      expect(href.startsWith("#"), `nav href "${href}" should be a same-page anchor`).toBe(true);
      const id = href.slice(1);

      const targetExists = await page.evaluate((elId) => !!document.getElementById(elId), id);
      expect(targetExists, `#${id} should exist in the DOM`).toBe(true);

      // Reset scroll, then click the link.
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.locator(`nav[aria-label="Principal"] a[href="${href}"], header a[href="${href}"]`).first().click();
      await page.waitForTimeout(200);

      const navbarBottom = await header.evaluate((el) => el.getBoundingClientRect().bottom);
      const targetTop = await page.evaluate(
        (elId) => document.getElementById(elId)!.getBoundingClientRect().top,
        id,
      );

      expect(
        targetTop,
        `#${id} top (${targetTop}) should not be hidden behind the navbar (bottom ${navbarBottom})`,
      ).toBeGreaterThanOrEqual(navbarBottom - 4);
    }
  });
});
