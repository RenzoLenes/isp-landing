import { test, expect } from "@playwright/test";
import { findOverflowingElements } from "./helpers/dom";

// This page shipped a real horizontal-overflow bug once (see
// docs/superpowers/2026-08-03-nexo-verificacion-manual.md, item 4), so this
// is the highest-value sweep in the suite: every shipped breakpoint plus the
// two narrowest devices still sold new.
const WIDTHS = [320, 390, 768, 1024, 1280, 1440];

for (const width of WIDTHS) {
  test(`no horizontal scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    if (scrollWidth > clientWidth + 1) {
      const offenders = await findOverflowingElements(page);
      const report = offenders
        .map(
          (o) =>
            `  ${o.selector} — right edge ${o.right}px vs viewport ${o.clientWidth}px (overflow ${o.overflowPx}px)`,
        )
        .join("\n");
      throw new Error(
        `Horizontal overflow at ${width}px: scrollWidth=${scrollWidth} > clientWidth=${clientWidth}.\nLikely offenders (widest first):\n${report}`,
      );
    }

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
}
