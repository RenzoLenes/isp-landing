import { test, expect } from "@playwright/test";
import { LANDING } from "../src/content/landing";

// The hero was rebuilt around the Qipeline reference (spec §4/§5): a
// centered column (badge → headline → subtitle → CTAs) followed by a dense,
// deliberately-cropped product console, replacing the old asymmetric split
// with three small floating cards. The old "hero composition pieces do not
// overlap" checks tested a layout that no longer exists (`HeroComposition`
// is gone, replaced by `ProductConsole`). The equivalent coverage for the
// new shape: the badge/headline/subtitle/CTAs are present and horizontally
// centered, the console is visible, and the console never overflows its
// container at any width (checked exhaustively for horizontal scroll in
// `scroll-overflow.spec.ts`; here we additionally assert the console's own
// box stays within the viewport at each width).
const WIDTHS = [320, 360, 390, 768, 1024, 1280, 1440];

test.describe("Hero (Qipeline skeleton)", () => {
  test("badge, headline, subtitle and CTAs are present and centered", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    // Scoped to the hero section: the primary CTA's label is intentionally
    // reused verbatim by the footer's own CTA (`LANDING.footer.ctaLabel`),
    // so an unscoped page-wide lookup is ambiguous.
    const heroSection = page.locator("main > section").first();
    const badge = heroSection.getByText(LANDING.hero.badge, { exact: true });
    const heading = heroSection.getByRole("heading", { level: 1 });
    const subtitle = heroSection.getByText(LANDING.hero.subtitle, { exact: true });
    const ctaPrimary = heroSection.getByRole("link", {
      name: LANDING.hero.ctaPrimary.label,
    });
    const ctaSecondary = heroSection.getByRole("link", {
      name: LANDING.hero.ctaSecondary.label,
    });

    await expect(badge).toBeVisible();
    await expect(heading).toHaveText(LANDING.hero.title);
    await expect(subtitle).toBeVisible();
    await expect(ctaPrimary).toBeVisible();
    await expect(ctaSecondary).toBeVisible();

    // Centered: each piece's horizontal midpoint sits within a couple of
    // pixels of the viewport's midpoint (allowing for sub-pixel rounding).
    const viewportMid = 1280 / 2;
    for (const [name, locator] of [
      ["badge", badge],
      ["heading", heading],
      ["subtitle", subtitle],
    ] as const) {
      const box = await locator.boundingBox();
      if (!box) throw new Error(`${name} has no box`);
      const mid = box.x + box.width / 2;
      expect(
        Math.abs(mid - viewportMid),
        `${name} horizontal midpoint ${mid} vs viewport midpoint ${viewportMid}`,
      ).toBeLessThan(3);
    }

    // The two CTAs sit side by side, centered as a pair, at desktop width.
    const primaryBox = await ctaPrimary.boundingBox();
    const secondaryBox = await ctaSecondary.boundingBox();
    if (!primaryBox || !secondaryBox) throw new Error("CTA has no box");
    const pairMid =
      (Math.min(primaryBox.x, secondaryBox.x) +
        Math.max(primaryBox.x + primaryBox.width, secondaryBox.x + secondaryBox.width)) /
      2;
    expect(
      Math.abs(pairMid - viewportMid),
      `CTA pair midpoint ${pairMid} vs viewport midpoint ${viewportMid}`,
    ).toBeLessThan(3);
  });

  for (const width of WIDTHS) {
    test(`product console is visible and stays inside the viewport at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");

      const console_ = page.locator('[role="img"][aria-label*="Captura ilustrativa"]');
      await expect(console_).toBeVisible();

      const box = await console_.boundingBox();
      if (!box) throw new Error("console has no box");
      expect(box.width, `console width ${box.width} at ${width}px`).toBeLessThanOrEqual(
        width + 1,
      );
      expect(box.x, `console left edge ${box.x} at ${width}px`).toBeGreaterThanOrEqual(-1);
      expect(
        box.x + box.width,
        `console right edge ${box.x + box.width} vs viewport ${width}`,
      ).toBeLessThanOrEqual(width + 1);
    });
  }

  test("the console is deliberately cropped — its content is taller than the visible frame", async ({
    page,
  }) => {
    // The "cropped by the fold" gesture (spec §4/§5) only reads as a real
    // product shot if the frame's `overflow-hidden` is actually clipping
    // something. Assert the underlying grid is taller than the frame that
    // contains it, at both the stacked (mobile) and 3-column (desktop)
    // layouts.
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");

      const console_ = page.locator('[role="img"][aria-label*="Captura ilustrativa"]');
      const { frameHeight, contentHeight } = await console_.evaluate((el) => ({
        frameHeight: el.clientHeight,
        contentHeight: (el.firstElementChild as HTMLElement).scrollHeight,
      }));
      expect(
        contentHeight,
        `content height ${contentHeight} vs frame height ${frameHeight} at ${width}px`,
      ).toBeGreaterThan(frameHeight);
    }
  });
});
