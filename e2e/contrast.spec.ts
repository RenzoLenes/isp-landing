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

  test("pixel-sampled: navbar link contrast over the sky at the top of the page", async ({
    page,
  }) => {
    // La barra ya no es una pildora fija que atraviesa registros (DESIGN.md
    // §6): es transparente, absoluta, y scrollea con la pagina, asi que el
    // unico fondo que puede tener detras es la franja alta del cielo — que la
    // mascara de nubes deja despejada precisamente para esto. Se mide el
    // pixel real: glifo mas oscuro del enlace contra el cielo a su lado.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // La premisa del diseno: si la barra volviera a ser fija, volveria a
    // atravesar el registro nocturno y esta prueba dejaria de cubrir ese
    // caso — fallar aqui obliga a reintroducir la medicion sobre `night`.
    const position = await page
      .locator("header")
      .first()
      .evaluate((el) => getComputedStyle(el).position);
    expect(position, "la barra debe scrollear con la pagina, no ser fija").toBe("absolute");

    const canvasId = await loadScreenshotCanvas(page);
    const link = page.locator('nav[aria-label="Principal"] a').first();
    const rect = await link.boundingBox();
    if (!rect) throw new Error("navbar link: no box");
    const fg = await darkestInRect(page, canvasId, rect);
    const bg = await readPixel(page, canvasId, rect.x + rect.width + 24, rect.y + rect.height / 2);
    const ratio = contrastRatio(fg, bg);
    expect(
      ratio,
      `navbar link sobre el cielo: fg rgb(${fg.r},${fg.g},${fg.b}) vs bg rgb(${bg.r},${bg.g},${bg.b}) = ${ratio.toFixed(2)}:1`,
    ).toBeGreaterThanOrEqual(4.5);
  });

  test("numeros de pilar (--accent-text sobre Superficie)", async ({ page }) => {
    // Pillars volvio a Superficie con el rediseño en tarjetas (DESIGN.md §2),
    // asi que `--accent-text` resuelve a Señal Profundo, no a Señal. El
    // numero se localiza por `data-pillar-number` y no por su clase de
    // tamaño: el rediseño lo bajo de `text-6xl` a un numeral pequeño sobre el
    // titulo, y un selector atado al tamaño se rompe con cada retoque.
    await page.goto("/");
    const info = await report("numero de pilar '01'", page, () =>
      page.locator("[data-pillar-number]").first(),
    );
    expect(info.ratio, `contraste del numero ${info.ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(
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
      page.getByText(LANDING.pilot.bullets[0].body, { exact: true }),
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

  test("pixel-sampled: Pillars heading on Superficie and Pilot bullet on the real rendered night background", async ({
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

    // Pillars ya no es Sala Oscura sino Superficie (DESIGN.md §2): la
    // oscuridad se reservó para el cierre. Aquí el glifo es el píxel MÁS
    // OSCURO sobre un fondo claro, así que la medición es la contraria a la
    // del Piloto — usar `lightestInRect` aquí encontraría el blanco del fondo
    // y daría un 1:1 engañoso.
    await page.goto("/#producto");
    await page.waitForLoadState("networkidle");
    const pillarsCanvas = await loadScreenshotCanvas(page);
    const heading = page.getByRole("heading", { level: 2, name: LANDING.pillars.title });
    const headingRect = await heading.boundingBox();
    if (!headingRect) throw new Error("Pillars title has no box");
    const pillarsBg = await readPixel(
      page,
      pillarsCanvas,
      Math.max(0, headingRect.x - 6),
      headingRect.y + headingRect.height / 2,
    );
    const pillarsFg = await darkestInRect(page, pillarsCanvas, headingRect);
    const pillarsRatio = contrastRatio(pillarsFg, pillarsBg);
    expect(
      pillarsRatio,
      `Pillars title, pixel-sampled: fg rgb(${pillarsFg.r},${pillarsFg.g},${pillarsFg.b}) vs bg rgb(${pillarsBg.r},${pillarsBg.g},${pillarsBg.b}) = ${pillarsRatio.toFixed(2)}:1 (needs >=3:1)`,
    ).toBeGreaterThanOrEqual(3);

    await page.goto("/#piloto");
    await page.waitForLoadState("networkidle");
    const pilotCanvas = await loadScreenshotCanvas(page);
    const bullet = page.getByText(LANDING.pilot.bullets[0].body, { exact: true });
    await measureLightOnDark(bullet, pilotCanvas, 4.5, "Pilot bullet, pixel-sampled");
  });
});
