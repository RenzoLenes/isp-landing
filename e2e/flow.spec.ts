import { test, expect } from "@playwright/test";

// SignalFlow (the "Cómo funciona" route) switches from a stacked column to a
// row at Tailwind's `lg` breakpoint (1024px). The container-arithmetic
// comment in SignalFlow.tsx claims only 112px of margin at exactly 1024px
// for 3 connectors, so this is the tightest point in the layout.

test.describe("Flow row breakpoint", () => {
  test("at 1024px the four steps share the same row (approximately equal y)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 900 });
    await page.goto("/");

    const items = page.locator("#como-funciona ol > li");
    await expect(items).toHaveCount(4);

    const tops: number[] = [];
    for (let i = 0; i < 4; i++) {
      const artifact = items.nth(i).locator(":scope > div").first();
      const box = await artifact.boundingBox();
      if (!box) throw new Error(`step ${i} has no box`);
      tops.push(box.y);
    }

    const min = Math.min(...tops);
    const max = Math.max(...tops);
    expect(
      max - min,
      `step tops at 1024px: ${JSON.stringify(tops)}`,
    ).toBeLessThanOrEqual(4);
  });

  test("below 1024px the four steps stack (distinct y)", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1400 });
    await page.goto("/");

    const items = page.locator("#como-funciona ol > li");
    await expect(items).toHaveCount(4);

    const tops: number[] = [];
    for (let i = 0; i < 4; i++) {
      const artifact = items.nth(i).locator(":scope > div").first();
      const box = await artifact.boundingBox();
      if (!box) throw new Error(`step ${i} has no box`);
      tops.push(box.y);
    }

    for (let i = 1; i < tops.length; i++) {
      expect(
        tops[i] - tops[i - 1],
        `step ${i - 1} -> ${i} vertical gap at 768px: ${JSON.stringify(tops)}`,
      ).toBeGreaterThan(20);
    }
  });

  test("connectors between steps have non-zero width at 1024px", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 900 });
    await page.goto("/");

    const connectors = page.locator('#como-funciona ol > li > div[aria-hidden="true"]');
    await expect(connectors).toHaveCount(3);

    for (let i = 0; i < 3; i++) {
      const thread = connectors.nth(i).locator("div.hidden.h-px.w-full");
      const box = await thread.boundingBox();
      expect(box?.width ?? 0, `connector #${i} thread width at 1024px`).toBeGreaterThan(0);
    }
  });
});
