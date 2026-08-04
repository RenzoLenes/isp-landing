import { test, expect } from "@playwright/test";
import { boxesOverlap } from "./helpers/dom";

// The hero moved from absolute positioning to a normal-flow column, which
// should make overlap structurally impossible — but nobody had looked at the
// new hero at these widths. Checked at the two narrowest phones still sold,
// the iPhone 12/13/14 width, and a desktop width where the hero sits beside
// the headline column instead of below it.
const WIDTHS = [320, 360, 390, 1280];

for (const width of WIDTHS) {
  test(`hero composition pieces do not overlap at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const heroRoot = page.locator('[role="img"][aria-label*="Composición ilustrativa"]');
    await expect(heroRoot).toBeVisible();

    // The 3 non-decorative direct children of the composition root are, in
    // DOM order, the chat/conversation piece, the context DataCard, and the
    // action ResultCard (the halos and Spine connectors are `aria-hidden`).
    const pieces = heroRoot.locator(":scope > div:not([aria-hidden])");
    await expect(pieces).toHaveCount(3);

    const boxes = [];
    for (let i = 0; i < 3; i++) {
      const box = await pieces.nth(i).boundingBox();
      if (!box) throw new Error(`piece ${i} has no box`);
      boxes.push(box);
    }
    const [chat, context, action] = boxes;
    const names: [string, typeof chat][] = [
      ["chat", chat],
      ["context", context],
      ["action", action],
    ];

    for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
        const [nameA, boxA] = names[i];
        const [nameB, boxB] = names[j];
        expect(
          boxesOverlap(boxA, boxB),
          `${nameA} ${JSON.stringify(boxA)} overlaps ${nameB} ${JSON.stringify(boxB)}`,
        ).toBe(false);
      }
    }
  });
}
