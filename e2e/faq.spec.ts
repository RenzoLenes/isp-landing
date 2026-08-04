import { test, expect } from "@playwright/test";
import { LANDING } from "../src/content/landing";

// The FAQ section wraps a vendored 21st.dev Accordion (see
// .superpowers/gantry/faq-report.md). These checks target the behaviour the
// spec called out explicitly: tap-target floor on the triggers, aria-expanded
// tracking open state, keyboard arrow navigation between triggers, and no
// horizontal overflow introduced by the new section.
function faqSection(page: import("@playwright/test").Page) {
  return page.locator("section", {
    has: page.getByText(LANDING.faq.title, { exact: true }),
  });
}

test.describe("FAQ accordion", () => {
  test.use({ viewport: { width: 1280, height: 1000 } });

  test("renders one trigger per question, each >=44px tall", async ({ page }) => {
    await page.goto("/");
    const section = faqSection(page);
    const triggers = section.getByRole("button");
    await expect(triggers).toHaveCount(LANDING.faq.items.length);

    for (let i = 0; i < LANDING.faq.items.length; i++) {
      const box = await triggers.nth(i).boundingBox();
      expect(box, `trigger #${i} should have a bounding box`).not.toBeNull();
      expect(
        box!.height,
        `trigger #${i} ("${LANDING.faq.items[i].question}") height`,
      ).toBeGreaterThanOrEqual(44 - 0.5);
    }
  });

  test("aria-expanded tracks open state, and the answer becomes visible", async ({
    page,
  }) => {
    await page.goto("/");
    const section = faqSection(page);
    const triggers = section.getByRole("button");
    const first = triggers.first();

    await expect(first).toHaveAttribute("aria-expanded", "false");

    const panelId = await first.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();
    const panel = page.locator(`#${panelId}`);
    await expect(panel).toHaveAttribute("aria-hidden", "true");

    await first.click();
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(panel).not.toHaveAttribute("aria-hidden", "true");
    await expect(panel).toContainText(LANDING.faq.items[0].answer);

    await first.click();
    await expect(first).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  test("ArrowDown/ArrowUp/Home/End move focus between triggers", async ({ page }) => {
    await page.goto("/");
    const section = faqSection(page);
    const triggers = section.getByRole("button");
    const count = await triggers.count();
    expect(count).toBeGreaterThan(2);

    await triggers.first().focus();
    await expect(triggers.first()).toBeFocused();

    await page.keyboard.press("ArrowDown");
    await expect(triggers.nth(1)).toBeFocused();

    await page.keyboard.press("ArrowUp");
    await expect(triggers.first()).toBeFocused();

    await page.keyboard.press("End");
    await expect(triggers.nth(count - 1)).toBeFocused();

    await page.keyboard.press("Home");
    await expect(triggers.first()).toBeFocused();
  });

  test("adds no horizontal overflow at 390px or 1440px", async ({ page }) => {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const section = faqSection(page);
      await section.scrollIntoViewIfNeeded();

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(
        scrollWidth,
        `horizontal overflow at ${width}px after scrolling to FAQ`,
      ).toBeLessThanOrEqual(clientWidth + 1);
    }
  });
});
