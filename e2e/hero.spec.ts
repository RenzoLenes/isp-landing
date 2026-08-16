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
    // La pildora del badge parte el copy en el «·» (chip + resto, estilo
    // Qipeline), asi que el texto ya no existe como un solo nodo exacto: se
    // localizan las dos mitades por separado y se comprueba el conjunto.
    const [badgeChip, ...badgeRest] = LANDING.hero.badge.split("\u00b7");
    const badge = heroSection
      .locator("span", { hasText: badgeChip.trim() })
      .filter({ hasText: badgeRest.join("\u00b7").trim() })
      .first();
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

      const console_ = page.locator("#gantry-console");
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

  test("la ventana de la consola contiene su vista sin recortarla", async ({ page }) => {
    // La ventana recorta desbordes (`overflow: hidden`, para que un nodo del
    // lienzo mal colocado no escape del marco) pero en su estado natural no
    // corta nada, en ninguna de las vistas.
    // Sin recorrido automatico: esta prueba mide el marco, no el movimiento, y
    // una vista que cambia sola durante la medicion la volveria intermitente.
    await page.emulateMedia({ reducedMotion: "reduce" });

    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");

      const win = page.locator("#gantry-console > div > div").last();
      const m = await win.evaluate((el) => ({
        overflow: getComputedStyle(el).overflow,
        clientHeight: el.clientHeight,
        scrollHeight: el.scrollHeight,
      }));
      expect(m.overflow, `overflow at ${width}px`).toBe("hidden");
      expect(
        m.scrollHeight,
        `content ${m.scrollHeight} vs frame ${m.clientHeight} at ${width}px`,
      ).toBeLessThanOrEqual(m.clientHeight + 1);
    }
  });

  test("la consola mantiene la misma altura en las seis vistas", async ({ page }) => {
    // Cada vista tiene una altura natural distinta (medido antes del arreglo:
    // 574px el lienzo de flujo, 420px las tablas) y al cambiar de pestana la
    // consola saltaba, arrastrando todo lo que hay debajo. La ventana lleva
    // altura fija en escritorio justamente para eso.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.goto("/");

    const consola = page.locator("#gantry-console");
    const tabs = page.locator('#gantry-console [role="tab"]');
    const labels = await tabs.allTextContents();

    const heights: number[] = [];
    for (const label of labels) {
      await tabs.filter({ hasText: label.trim() }).first().click();
      heights.push(await consola.evaluate((el) => el.clientHeight));
    }

    const unicas = new Set(heights);
    expect(
      unicas.size,
      `la consola cambia de alto entre vistas: ${labels
        .map((l, i) => `${l.trim()}=${heights[i]}px`)
        .join(", ")}`,
    ).toBe(1);
  });

  test("la consola es un tablist navegable: click, flechas y Inicio/Fin", async ({ page }) => {
    // La consola dejo de ser una captura (`role="img"`) para ser una demo
    // navegable, asi que se verifica el patron ARIA completo: una sola pestana
    // seleccionada, roving tabindex, y flechas moviendo la seleccion.
    // Sin recorrido automatico: aqui se verifica el patron ARIA y el estado
    // por defecto, y ambos son los mismos con o sin movimiento. Con el
    // recorrido corriendo, "Conversaciones abre por defecto" caduca a los 3s.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    // Un solo tablist en el DOM: dos (barra lateral + tira movil) duplicaban
    // el `id` de cada pestana y rompian `aria-controls`.
    await expect(page.locator('#gantry-console [role="tablist"]')).toHaveCount(1);
    const tabs = page.locator('#gantry-console [role="tab"]');
    await expect(tabs).toHaveCount(6);

    const ids = await tabs.evaluateAll((els) => els.map((el) => el.id));
    expect(new Set(ids).size, `ids de pestana duplicados: ${ids.join(", ")}`).toBe(ids.length);

    // Conversaciones abre por defecto: es la vista que cuenta la promesa.
    const conversaciones = tabs.filter({ hasText: "Conversaciones" });
    await expect(conversaciones).toHaveAttribute("aria-selected", "true");
    await expect(conversaciones).toHaveAttribute("tabindex", "0");
    // Roving tabindex: solo la activa esta en el orden de tabulacion.
    await expect(
      page.locator('#gantry-console [role="tab"][tabindex="0"]'),
    ).toHaveCount(1);

    // El panel esta etiquetado por su pestana.
    const panel = page.locator('#gantry-console [role="tabpanel"]');
    const [panelLabelledBy, tabIdAttr] = await Promise.all([
      panel.getAttribute("aria-labelledby"),
      conversaciones.getAttribute("id"),
    ]);
    expect(panelLabelledBy).toBe(tabIdAttr);

    // Click cambia de vista.
    const tickets = tabs.filter({ hasText: "Tickets" });
    await tickets.click();
    await expect(tickets).toHaveAttribute("aria-selected", "true");
    await expect(conversaciones).toHaveAttribute("aria-selected", "false");
    await expect(page.locator("#gantry-console").getByText("#184").first()).toBeVisible();

    // Flechas mueven la seleccion; Inicio vuelve a la primera.
    await page.keyboard.press("ArrowDown");
    await expect(tabs.filter({ hasText: "Cobranza" })).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Home");
    await expect(conversaciones).toHaveAttribute("aria-selected", "true");
  });

  /*
   * El recorrido guiado de la consola.
   *
   * Existe porque la consola parece una captura y nadie hace clic en una
   * captura: Automatizaciones, Tickets y Cobranza solo las veia quien
   * adivinaba que la barra lateral era pulsable. Lo que se fija aqui es que
   * se mueva sola, que se calle en cuanto la persona toma el mando, y que no
   * se mueva NUNCA con el movimiento reducido.
   */
  test.describe("recorrido guiado de la consola", () => {
    const titulo = (page: import("@playwright/test").Page) =>
      page.locator("#gantry-console h3");

    test("avanza sola y termina la vuelta donde empezo, sin seguir moviendose", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto("/");

      // Avanza sin que nadie toque nada.
      await expect(titulo(page)).toHaveText("Automatizaciones", { timeout: 8_000 });

      // Seis vistas a 3s: la vuelta vuelve a casa. Si parara en "Equipo", el
      // hero se quedaria enseñando la vista menos interesante a todo el que
      // llegue despues.
      await expect(titulo(page)).toHaveText("Conversaciones", { timeout: 25_000 });

      // Y una vuelta es UNA vuelta: no es un bucle perpetuo (DESIGN.md §9).
      await page.waitForTimeout(5_000);
      await expect(titulo(page)).toHaveText("Conversaciones");
      await expect(page.locator("[data-console-rail]")).toHaveCount(0);
    });

    test("un clic toma el mando y la consola ya no vuelve a moverse", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto("/");

      await page.locator("#gantry-console-tab-tickets").click();
      await expect(titulo(page)).toHaveText("Tickets");

      // Mas de dos turnos del recorrido: si siguiera vivo, ya habria saltado.
      await page.waitForTimeout(7_000);
      await expect(titulo(page)).toHaveText("Tickets");
      await expect(page.locator("[data-console-rail]")).toHaveCount(0);
    });

    test("con movimiento reducido no arranca, y el rotulo sigue diciendo que es navegable", async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto("/");

      await page.waitForTimeout(7_000);
      await expect(titulo(page)).toHaveText("Conversaciones");
      await expect(page.locator("[data-console-rail]")).toHaveCount(0);

      // El rotulo es la UNICA señal que queda aqui: sin el, la consola vuelve
      // a parecer una captura para quien pidio menos movimiento.
      await expect(
        page.locator("#gantry-console").getByText(LANDING.hero.console.hint),
      ).toBeVisible();
    });
  });
});
