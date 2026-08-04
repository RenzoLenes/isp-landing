import { test, expect } from "@playwright/test";

// prefers-reduced-motion: reduce is implemented in 5 animated components
// (SignalThread, Reveal, ChatScene, DecisionChain, HeroComposition's Piece)
// but had never been exercised in an actual browser.
// `test.use({ reducedMotion: ... })` is not available in this Playwright
// version's `PlaywrightTestOptions` type (only `page.emulateMedia()` exposes
// it), so each test emulates the media feature directly before navigating.
test.describe("Reduced motion", () => {
  test("no element has a running infinite animation", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    // Give in-viewport whileInView animations a moment to settle so we are
    // not catching a still-running *finite* entrance animation.
    await page.waitForTimeout(300);

    const infiniteAnimations = await page.evaluate(() => {
      return document
        .getAnimations()
        .filter((a) => {
          const effect = a.effect as KeyframeEffect | null;
          const timing = effect?.getTiming();
          return timing?.iterations === Infinity;
        })
        .map((a) => {
          const effect = a.effect as KeyframeEffect | null;
          const target = effect?.target as Element | null;
          return target
            ? `${target.tagName.toLowerCase()}.${Array.from(target.classList).slice(0, 3).join(".")}`
            : "unknown target";
        });
    });

    expect(
      infiniteAnimations,
      `infinite animations still running under reduced motion: ${JSON.stringify(infiniteAnimations)}`,
    ).toEqual([]);
  });

  test("SignalThread pulses are not rendered at all under reduced motion", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // Each SignalThread renders a static dashed line (`absolute inset-0
    // border-lavender ...`) plus, only when motion is allowed, a
    // `motion.div` pulse holding the travelling dot — also `absolute
    // inset-0` but without the `border-lavender` class. Under reduced
    // motion that pulse node should not exist at all (not just be paused).
    const pulses = page.locator(
      'div[aria-hidden="true"] > div.absolute.inset-0:not(.border-lavender)',
    );
    expect(await pulses.count()).toBe(0);
  });

  test("decision chain rows are already resolved without scrolling into view", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // Pillar 2's DecisionChain is well below the fold at load. Read its
    // computed opacity WITHOUT scrolling it into view first — if reduced
    // motion is respected, `initial={false}` means it never depended on
    // `whileInView` firing to reach opacity: 1.
    const row = page.locator("li", { hasText: "¿Tiene deuda?" });
    await expect(row).toHaveCount(1);
    const opacity = await row.evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity, "DecisionChain row opacity before any scroll").toBe("1");
  });

  test("hero chat messages are visible immediately (no cascade to wait out)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const heroRoot = page.locator('[role="img"][aria-label*="Composición ilustrativa"]');
    const pieces = heroRoot.locator(":scope > div:not([aria-hidden])");
    const chatPiece = pieces.first();
    const opacity = await chatPiece.evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity, "hero chat piece opacity immediately after load").toBe("1");
  });
});
