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

  // Regression coverage for the "staircase" bug: the four step artifacts have
  // different intrinsic heights (a 4-line chat bubble, a 2-row DataCard, a
  // 3-line decision rule, a 2-line ticket chip), so top-aligning them made
  // each <h3> start at a different y and left the connectors floating above
  // the artifacts' top edges instead of running through their centre. These
  // checks run at both `lg` (1024px, the narrowest row layout, where the
  // chat bubble wraps to its tallest) and `xl` (1280px, wider columns).
  for (const width of [1024, 1280]) {
    test(`step headings share the same y at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");

      const headings = page.locator("#como-funciona ol > li h3");
      await expect(headings).toHaveCount(4);

      const ys: number[] = [];
      for (let i = 0; i < 4; i++) {
        const box = await headings.nth(i).boundingBox();
        if (!box) throw new Error(`heading ${i} has no box`);
        ys.push(box.y);
      }

      const min = Math.min(...ys);
      const max = Math.max(...ys);
      expect(
        max - min,
        `heading y at ${width}px: ${JSON.stringify(ys)}`,
      ).toBeLessThanOrEqual(2);
    });

    test(`connectors' vertical centre falls inside the artifacts' vertical span at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");

      const items = page.locator("#como-funciona ol > li");
      await expect(items).toHaveCount(4);

      // Intersection of the four artifacts' vertical spans (not their
      // wrapping band, which is a fixed height by construction and would
      // pass trivially). Centring each artifact in a shared band makes this
      // intersection non-empty and roughly symmetric around the row centre;
      // it's the tightest bound the connector centre must land well within.
      let spanTop = -Infinity;
      let spanBottom = Infinity;
      for (let i = 0; i < 4; i++) {
        const band = items.nth(i).locator(":scope > div > div").first();
        const artifact = band.locator(":scope > *").first();
        const box = await artifact.boundingBox();
        if (!box) throw new Error(`artifact ${i} has no box`);
        spanTop = Math.max(spanTop, box.y);
        spanBottom = Math.min(spanBottom, box.y + box.height);
      }
      expect(spanTop, `artifact vertical spans did not overlap at ${width}px`).toBeLessThan(
        spanBottom,
      );

      // A pixel-exact ">= spanTop" bound is too weak: before the fix, the
      // connector sat at the artifacts' shared *top* edge (all top-aligned
      // by `lg:items-start`), which coincides with `spanTop` whenever the
      // shortest artifact happens to start the span — so it would pass a
      // boundary-inclusive check despite being the exact bug this test
      // exists to catch. Requiring the centre a real margin inside the span
      // (not just at its edge) makes that regression fail here.
      const margin = 10;
      const connectors = page.locator('#como-funciona ol > li > div[aria-hidden="true"]');
      await expect(connectors).toHaveCount(3);
      for (let i = 0; i < 3; i++) {
        const dot = connectors.nth(i).locator("span.rounded-full").first();
        const box = await dot.boundingBox();
        if (!box) throw new Error(`connector ${i} dot has no box`);
        const centerY = box.y + box.height / 2;
        expect(
          centerY,
          `connector #${i} dot centre (${centerY}) at ${width}px vs artifact span [${spanTop}, ${spanBottom}]`,
        ).toBeGreaterThanOrEqual(spanTop + margin);
        expect(
          centerY,
          `connector #${i} dot centre (${centerY}) at ${width}px vs artifact span [${spanTop}, ${spanBottom}]`,
        ).toBeLessThanOrEqual(spanBottom - margin);
      }
    });
  }
});
