import { test, expect } from "@playwright/test";
import { LANDING } from "../src/content/landing";
import { contrastRatio, darkestInRect, loadScreenshotCanvas, readPixel } from "./helpers/pixel-contrast";

// Chunk C (spec Part 1a/1b/1c, docs/superpowers/specs/2026-08-04-gantry-realineamiento.md)
// strengthened three things that had shipped too weak to read as the
// Qipeline-style hero the client's references show: the gradient field, the
// headline scale, and the product console's width. These checks encode the
// "presence, not just structure" bar so a future edit that quietly dials any
// of them back down fails loudly instead of just looking flatter in a
// screenshot nobody re-checks.

test.describe("Hero atmosphere (gradient field, headline scale, console width)", () => {
  test("the gradient field exists, sits behind content, and is inert", async ({ page }) => {
    await page.goto("/");
    const field = page.locator("#gradient-field");
    await expect(field).toHaveCount(1);
    await expect(field).toHaveAttribute("aria-hidden", "true");

    const style = await field.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { zIndex: cs.zIndex, pointerEvents: cs.pointerEvents, position: cs.position };
    });
    expect(Number(style.zIndex), `z-index ${style.zIndex} should be negative`).toBeLessThan(0);
    expect(style.pointerEvents, "pointer-events should be none").toBe("none");

    // It should actually cover real area behind the hero, not a 0x0 stub.
    const box = await field.boundingBox();
    if (!box) throw new Error("gradient field has no box");
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(400);
  });

  test("the field is a real, visible tint — not a near-invisible wash", async ({ page }) => {
    // The pre-chunk-C field peaked at ~4% opacity and read as flat from a
    // normal viewing distance (spec Part 1a's diagnosis). Confirm the
    // strengthened field actually shifts pixel colour away from plain fog
    // (#F5F7F4) by a real margin, sampled from an actual screenshot — not
    // computed styles, which is exactly the measurement chunk A's own
    // contrast helper is blind to (see e2e/helpers/contrast.ts's doc
    // comment).
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const canvasId = await loadScreenshotCanvas(page);
    // A point inside the field's own bounding box, biased toward the
    // right/upper area where the patches are concentrated, clear of the
    // navbar and of any text/console content.
    const fieldBox = await page.locator("#gradient-field").boundingBox();
    if (!fieldBox) throw new Error("gradient field has no box");
    const sampleX = fieldBox.x + fieldBox.width * 0.82;
    const sampleY = fieldBox.y + fieldBox.height * 0.32;
    const pixel = await readPixel(page, canvasId, sampleX, sampleY);

    const fog = { r: 245, g: 247, b: 244 };
    const distance = Math.sqrt(
      (pixel.r - fog.r) ** 2 + (pixel.g - fog.g) ** 2 + (pixel.b - fog.b) ** 2,
    );
    expect(
      distance,
      `sampled field pixel rgb(${pixel.r},${pixel.g},${pixel.b}) vs fog rgb(245,247,244), distance ${distance.toFixed(1)}`,
    ).toBeGreaterThan(10);
  });

  test("the headline's computed font-size at 1440px clears the pre-chunk-C ceiling", async ({
    page,
  }) => {
    // Before chunk C the headline's `clamp()` topped out at 4.75rem (76px)
    // and stayed there from ~1375px up — the spec's "too small, breaks into
    // three ordinary lines" complaint. The new ceiling is 5.25rem (84px).
    // Floor set at 78px: comfortably above the *old* maximum, so this fails
    // if the scale ever regresses toward it, with a little slack for a
    // future retune that doesn't go all the way back down.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const heading = page.locator("main > section").first().getByRole("heading", { level: 1 });
    const fontSize = await heading.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(fontSize, `headline font-size ${fontSize}px at 1440px`).toBeGreaterThan(78);
  });

  test("the console's rendered width at 1440px is a dominant fraction of the viewport", async ({
    page,
  }) => {
    // Spec Part 1c: the console should read as a dominant product shot, not
    // an illustration with wide margins — it's allowed to exceed the 1220px
    // text container. Measured after the chunk C widen: ~0.956 at 1440px
    // (container arithmetic in chunk-c-report.md). Floor set at 0.90 —
    // comfortably below the measured value, but well above the old
    // max-w-content-capped console's ratio (1220/1440 ≈ 0.847), so this
    // fails if a future change re-narrows it back toward the old cap.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const console_ = page.locator('[role="img"][aria-label*="Captura ilustrativa"]');
    const box = await console_.boundingBox();
    if (!box) throw new Error("console has no box");
    const fraction = box.width / 1440;
    expect(fraction, `console width ${box.width}px is ${fraction.toFixed(3)} of 1440px viewport`).toBeGreaterThanOrEqual(
      0.9,
    );
  });

  test("hero eyebrow, headline and subtitle stay AA-compliant over the strongest part of the field", async ({
    page,
  }) => {
    // The direct test of spec Part 1a's central tension: a much stronger
    // field must not push any hero text below WCAG AA. Sampled from a real
    // screenshot (not the DOM-based helper in contrast.spec.ts, which
    // ignores background-image entirely) at the widest tested viewport,
    // where the field's patches sit furthest into the text column's
    // reading area.
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const heroSection = page.locator("main > section").first();
    const badge = heroSection.locator("span").first();
    const heading = heroSection.getByRole("heading", { level: 1 });
    const subtitle = heroSection.getByText(LANDING.hero.subtitle, { exact: true });

    const canvasId = await loadScreenshotCanvas(page);

    async function measure(locator: typeof badge, requiredRatio: number, label: string) {
      const rect = await locator.boundingBox();
      if (!rect) throw new Error(`${label} has no box`);
      const fg = await darkestInRect(page, canvasId, rect);
      // Background sampled just above the element's horizontal centre —
      // the same local backdrop (including the gradient field) the glyphs
      // render on, clear of the glyphs themselves.
      const bg = await readPixel(page, canvasId, rect.x + rect.width / 2, Math.max(0, rect.y - 8));
      const ratio = contrastRatio(fg, bg);
      expect(
        ratio,
        `${label}: fg rgb(${fg.r},${fg.g},${fg.b}) vs bg rgb(${bg.r},${bg.g},${bg.b}) = ${ratio.toFixed(2)}:1 (needs >=${requiredRatio}:1)`,
      ).toBeGreaterThanOrEqual(requiredRatio);
    }

    await measure(badge, 4.5, "badge (eyebrow)");
    // Headline is >=24px at every viewport this page ships (44px floor even
    // at 320px), so it's WCAG "large text" — 3:1 floor.
    await measure(heading, 3, "headline");
    await measure(subtitle, 4.5, "subtitle");
  });
});
