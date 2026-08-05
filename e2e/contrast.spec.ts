import { test, expect, type Page } from "@playwright/test";
import { getContrastInfo } from "./helpers/contrast";
import { contrastRatio, darkestInRect, loadScreenshotCanvas, readPixel } from "./helpers/pixel-contrast";
import { LANDING } from "../src/content/landing";

// WCAG AA: >=4.5:1 for normal text, >=3:1 for "large" text (>=24px, or
// >=18.66px + bold). `getContrastInfo` computes `requiredRatio` per element
// from its own computed font-size/weight, so each assertion below checks
// against the correct threshold for that surface rather than a hardcoded one.

async function report(name: string, page: Page, getLocator: () => ReturnType<Page["locator"]>) {
  const locator = getLocator();
  const info = await getContrastInfo(locator);
  console.log(
    `[contrast] ${name}: ${info.ratio.toFixed(2)}:1 (needs ${info.requiredRatio}:1, ${
      info.isLarge ? "large" : "normal"
    } text, ${info.fontSize}px/${info.fontWeight}) — fg ${info.color} on effective bg ${info.background} — ${
      info.passes ? "PASS" : "FAIL"
    }`,
  );
  return info;
}

test.describe("Contrast (computed, WCAG AA)", () => {
  test.use({ viewport: { width: 1280, height: 1000 } });

  test("navbar links (moss on the opaque pill)", async ({ page }) => {
    // The pill lost its translucency this chunk (Navbar.tsx): pixel-sampling
    // found the old `bg-surface/60` + `text-moss/80` combination measured
    // well under 4.5:1 in real screenshots — both here (top of page) and,
    // worse, once the pill started scrolling over the new `night` register
    // — even though this DOM-approximation helper reported a comfortable
    // PASS the whole time, because it reads `color`'s own un-blended
    // luminance and never sees what opacity does once actually composited.
    // Left in place as a regression guard for the *opaque* pill, not as the
    // rigorous check — see the pixel-sampled test below for that.
    await page.goto("/");
    const info = await report("navbar link 'Producto'", page, () =>
      page.locator('nav[aria-label="Principal"] a').first(),
    );
    expect(info.ratio, `navbar link contrast ${info.ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(
      info.requiredRatio,
    );
  });

  test("pixel-sampled: navbar link contrast at the top of the page and scrolled over night", async ({
    page,
  }) => {
    // This is the check that actually matters (see the comment above and
    // Navbar.tsx's own): real screenshot, real composited pixels, sampled
    // safely inside the pill's own fill (not at its edge, where anti-
    // aliasing/shadow bleed briefly reads darker and produces a false
    // failure) rather than trusting computed styles.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    async function measure(label: string) {
      const canvasId = await loadScreenshotCanvas(page);
      const pill = page.locator("header > div").first();
      const link = page.locator('nav[aria-label="Principal"] a').first();
      const pillRect = await pill.boundingBox();
      const rect = await link.boundingBox();
      if (!rect || !pillRect) throw new Error(`${label}: no box`);
      const fg = await darkestInRect(page, canvasId, rect);
      const bg = await readPixel(
        page,
        canvasId,
        rect.x + rect.width + 15,
        pillRect.y + pillRect.height / 2,
      );
      const ratio = contrastRatio(fg, bg);
      expect(
        ratio,
        `${label}: fg rgb(${fg.r},${fg.g},${fg.b}) vs bg rgb(${bg.r},${bg.g},${bg.b}) = ${ratio.toFixed(2)}:1`,
      ).toBeGreaterThanOrEqual(4.5);
    }

    await measure("top of page (signal-field behind the pill)");

    await page.locator("#producto").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await measure("scrolled over Pillars (night behind the pill)");

    await page.locator("#piloto").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await measure("scrolled over Pilot (night behind the pill)");
  });

  test("pillar numbers (--accent-text on night)", async ({ page }) => {
    // Pillars moved from the light canvas register to Sala Oscura this
    // chunk (DESIGN.md §2 row 3), so the pillar number's accent had to move
    // with it: `text-signal-deep` (a near-black blue that would nearly
    // vanish on `night`) is gone, replaced by `--accent-text`, which the
    // `night` register resolves to plain `signal` instead (4.64:1 per
    // DESIGN.md §3's table). Selector follows: the class is no longer
    // `text-signal-deep`, it's now an arbitrary-value class reading a CSS
    // custom property (see globals.css's `--accent-text`).
    await page.goto("/");
    const info = await report("pillar number '01'", page, () =>
      page.locator("#producto p.font-display.text-6xl").first(),
    );
    expect(info.ratio, `pillar number contrast ${info.ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(
      info.requiredRatio,
    );
  });

  test("secondary body text (moss on canvas) — hero subtitle", async ({ page }) => {
    await page.goto("/");
    // The rebuilt hero (spec §4) wraps the headline and subtitle in
    // separate staggered-entrance wrappers, so they're no longer DOM
    // siblings — target the subtitle by its exact copy instead, same
    // pattern `screenshots.spec.ts` already uses.
    const info = await report("hero subtitle (text-moss)", page, () =>
      page.getByText(LANDING.hero.subtitle, { exact: true }),
    );
    expect(info.ratio, `secondary text contrast ${info.ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(
      info.requiredRatio,
    );
  });

  test("form error text (coral-deep) after a failed submit", async ({ page }) => {
    await page.goto("/#piloto");
    await page.locator('button[type="submit"]', { hasText: "Enviar solicitud" }).click();

    const errorLocator = page.locator("#pilot-nombre-error");
    await expect(errorLocator).toBeVisible();
    const info = await report("form error text (coral-deep)", page, () => errorLocator);
    expect(info.ratio, `form error contrast ${info.ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(
      info.requiredRatio,
    );
  });
});

// Sala Oscura (DESIGN.md §2 rows 3 and 8: Pillars, Piloto, footer). These
// sections didn't exist on the dark register before this chunk — the
// register rhythm this chunk adds is exactly what makes text-on-`night`
// pairs possible for the first time, and DESIGN.md §3's binding rules
// (mist/surface on night, never moss) only bind something once a section
// actually renders on it. `getContrastInfo`'s ancestor walk is accurate here
// (unlike the hero's gradient field): `night`/`signal-field` are plain
// `background-color` utilities on the section itself, not a background-image
// or a blur the DOM-based helper is blind to, so no pixel-sampling fallback
// is needed for the DOM-level checks below. One pixel-sampled check is
// still included afterward, per the brief's instruction to sample the
// rendered screenshot rather than trust the token.
test.describe("Contrast (computed, WCAG AA) — Sala Oscura (night register)", () => {
  test.use({ viewport: { width: 1280, height: 1400 } });

  test("Pillars section heading (surface/mist on night)", async ({ page }) => {
    await page.goto("/#producto");
    const eyebrow = await report("Pillars eyebrow (--text-secondary on night)", page, () =>
      page.getByText(LANDING.pillars.eyebrow, { exact: true }),
    );
    expect(eyebrow.ratio).toBeGreaterThanOrEqual(eyebrow.requiredRatio);

    const title = await report("Pillars title (--text-primary on night)", page, () =>
      page.getByRole("heading", { level: 2, name: LANDING.pillars.title }),
    );
    expect(title.ratio).toBeGreaterThanOrEqual(title.requiredRatio);

    const body = await report("Pillars pillar body (--text-secondary on night)", page, () =>
      page.getByText(LANDING.pillars.items[0].body, { exact: true }),
    );
    expect(body.ratio).toBeGreaterThanOrEqual(body.requiredRatio);
  });

  test("Pilot section heading and bullets (surface/mist on night)", async ({ page }) => {
    await page.goto("/#piloto");
    const title = await report("Pilot title (--text-primary on night)", page, () =>
      page.getByRole("heading", { level: 2, name: LANDING.pilot.title }),
    );
    expect(title.ratio).toBeGreaterThanOrEqual(title.requiredRatio);

    const bullet = await report("Pilot bullet (--text-secondary on night)", page, () =>
      page.getByText(LANDING.pilot.bullets[0], { exact: true }),
    );
    expect(bullet.ratio).toBeGreaterThanOrEqual(bullet.requiredRatio);
  });

  test("footer text (surface/mist on night)", async ({ page }) => {
    await page.goto("/");
    const brand = await report("footer brand (--text-primary on night)", page, () =>
      page.locator("footer p.font-display").first(),
    );
    expect(brand.ratio).toBeGreaterThanOrEqual(brand.requiredRatio);

    const tagline = await report("footer tagline (--text-secondary on night)", page, () =>
      page.getByText(LANDING.footer.tagline, { exact: true }),
    );
    expect(tagline.ratio).toBeGreaterThanOrEqual(tagline.requiredRatio);
  });

  test("pixel-sampled: Pillars heading and Pilot bullet against the real rendered night background", async ({
    page,
  }) => {
    // Same method as hero-atmosphere.spec.ts's field check, applied to the
    // dark register: a real screenshot, decoded into a canvas, sampled at
    // the glyphs and just outside them for the background. Confirms the
    // actual composited pixels — including the grain overlay, which sits
    // above every register at z-40 — clear AA, not just the pre-paint
    // computed styles.
    //
    // `lightestInRect` (not the pixel-contrast helper's `darkestInRect`,
    // which assumes dark text on a light background) is the mirror image
    // needed here: on `night`, the text is the *lighter* pixel and the
    // surrounding fill is the darker one, so the glyph is found by scanning
    // for the highest-luminance pixel in the box instead of the lowest.
    async function lightestInRect(
      canvasId: string,
      rect: { x: number; y: number; width: number; height: number },
    ) {
      return page.evaluate(
        ({ canvasId, rect }) => {
          const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
          const ctx = canvas.getContext("2d")!;
          const x0 = Math.max(0, Math.floor(rect.x));
          const y0 = Math.max(0, Math.floor(rect.y));
          const w = Math.max(1, Math.min(canvas.width - x0, Math.ceil(rect.width)));
          const h = Math.max(1, Math.min(canvas.height - y0, Math.ceil(rect.height)));
          const data = ctx.getImageData(x0, y0, w, h).data;
          function lum(r: number, g: number, b: number) {
            const f = (c: number) => {
              const v = c / 255;
              return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            };
            return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
          }
          let best = { r: 0, g: 0, b: 0 };
          let bestLum = -Infinity;
          for (let i = 0; i < data.length; i += 4) {
            const l = lum(data[i], data[i + 1], data[i + 2]);
            if (l > bestLum) {
              bestLum = l;
              best = { r: data[i], g: data[i + 1], b: data[i + 2] };
            }
          }
          return best;
        },
        { canvasId, rect },
      );
    }

    async function measureLightOnDark(
      locator: ReturnType<Page["locator"]>,
      canvasId: string,
      requiredRatio: number,
      label: string,
    ) {
      const rect = await locator.boundingBox();
      if (!rect) throw new Error(`${label} has no box`);
      const bg = await readPixel(page, canvasId, Math.max(0, rect.x - 6), rect.y + rect.height / 2);
      const fg = await lightestInRect(canvasId, rect);
      const ratio = contrastRatio(fg, bg);
      expect(
        ratio,
        `${label}: fg rgb(${fg.r},${fg.g},${fg.b}) vs bg rgb(${bg.r},${bg.g},${bg.b}) = ${ratio.toFixed(2)}:1 (needs >=${requiredRatio}:1)`,
      ).toBeGreaterThanOrEqual(requiredRatio);
    }

    await page.emulateMedia({ reducedMotion: "reduce" });

    await page.goto("/#producto");
    await page.waitForLoadState("networkidle");
    const pillarsCanvas = await loadScreenshotCanvas(page);
    const heading = page.getByRole("heading", { level: 2, name: LANDING.pillars.title });
    await measureLightOnDark(heading, pillarsCanvas, 3, "Pillars title, pixel-sampled");

    await page.goto("/#piloto");
    await page.waitForLoadState("networkidle");
    const pilotCanvas = await loadScreenshotCanvas(page);
    const bullet = page.getByText(LANDING.pilot.bullets[0], { exact: true });
    await measureLightOnDark(bullet, pilotCanvas, 4.5, "Pilot bullet, pixel-sampled");
  });
});
