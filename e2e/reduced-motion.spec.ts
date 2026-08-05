import { test, expect } from "@playwright/test";

// prefers-reduced-motion: reduce is implemented in 5 animated components
// (SignalThread, Reveal, ChatScene, DecisionChain, Hero's Beat) but had
// never been exercised in an actual browser.
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

  test("SignalThread pulses are fully off (invisible, not just paused) under reduced motion", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // Each SignalThread renders a static dashed line (`absolute inset-0
    // border-signal ...`) plus a `motion.div` pulse holding the travelling
    // dot — also `absolute inset-0` but without the `border-signal` class.
    //
    // That pulse node is now always mounted (conditionally *removing* it
    // based on `useReducedMotion()` — which resolves synchronously on the
    // client but returns `null` during SSR — made the server's and client's
    // first-render child lists disagree, a structural hydration mismatch
    // React surfaces as error #418 and recovers from by discarding the
    // whole tree for a full client remount; see beam-hydration-report.md).
    // What actually matters per DESIGN.md §7 ("apagan los loops por
    // completo, no los ralentizan") is that it is fully inert, not that the
    // DOM node itself is absent: opacity pinned at 0 (never visible) and no
    // infinite-repeat animation ever created for it.
    const pulses = page.locator(
      'div[aria-hidden="true"] > div.absolute.inset-0:not(.border-signal)',
    );
    const count = await pulses.count();
    expect(count, "expected every SignalThread's pulse wrapper to exist").toBeGreaterThan(0);

    for (const pulse of await pulses.all()) {
      await expect(pulse).toHaveCSS("opacity", "0");
    }

    const infiniteOnPulses = await page.evaluate(() => {
      const nodes = document.querySelectorAll(
        'div[aria-hidden="true"] > div.absolute.inset-0:not(.border-signal)',
      );
      let count = 0;
      for (const node of nodes) {
        for (const anim of node.getAnimations()) {
          const timing = (anim.effect as KeyframeEffect | null)?.getTiming();
          if (timing?.iterations === Infinity) count++;
        }
      }
      return count;
    });
    expect(infiniteOnPulses, "infinite animations on SignalThread pulses under reduced motion").toBe(0);
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

  test("hero headline and console are visible immediately (no cascade to wait out)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const heading = page.getByRole("heading", { level: 1 });
    const headingOpacity = await heading.evaluate(
      (el) => getComputedStyle(el.parentElement ?? el).opacity,
    );
    expect(headingOpacity, "hero headline opacity immediately after load").toBe("1");

    const productConsole = page.locator('[role="img"][aria-label*="Captura ilustrativa"]');
    const consoleOpacity = await productConsole.evaluate(
      (el) => getComputedStyle(el.parentElement ?? el).opacity,
    );
    expect(consoleOpacity, "product console opacity immediately after load").toBe("1");
  });
});
