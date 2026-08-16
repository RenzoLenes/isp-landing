import { test, expect } from "@playwright/test";

// Los nodos se localizan por `data-integration-*`, no por forma de clases
// (`div.w-40.shrink-0`, `div.shadow-float`). Ese planteamiento ataba la prueba
// al ancho y a la sombra de cada nodo: rediseñar la tarjeta —darle su glifo y
// su linea de rol— la rompia sin que nada estuviera mal.
import { LANDING } from "../src/content/landing";

// The Integrations convergence diagram was rebuilt twice for defects before
// Animated Beam replaced the straight dashed threads: threads collapsed to
// 0px width (a flex bug), and a trunk too short to reach the outer system
// cards. Verified at every breakpoint where the desktop (`lg:flex`) row
// renders: 1024, 1280, 1440.
//
// With Animated Beam, the four straight "system -> trunk" connectors and
// the vertical trunk itself are gone — replaced by four curved beams
// (system card -> hub) plus one (hub -> output), drawn as absolutely
// positioned SVGs measured off the row's DOM at runtime. The assertions
// below were rewritten for that: "connector width" and "trunk span" no
// longer apply to anything in the DOM, so they're replaced with checks on
// the same underlying property — the beams actually reach from each card to
// the hub, and from the hub to the output, not just that *some* line exists.
const WIDTHS = [1024, 1280, 1440];

// Parses the `d="M x,y Q cx,cy ex,ey"` path Animated Beam generates.
function parseBeamPath(d: string) {
  const match = d.match(
    /M\s*([\d.-]+),([\d.-]+)\s*Q\s*([\d.-]+),([\d.-]+)\s*([\d.-]+),([\d.-]+)/,
  );
  if (!match) return null;
  const [, mx, my, , , ex, ey] = match;
  return {
    startX: parseFloat(mx),
    startY: parseFloat(my),
    endX: parseFloat(ex),
    endY: parseFloat(ey),
  };
}

test.describe("Integrations diagram", () => {
  for (const width of WIDTHS) {
    test.describe(`at ${width}px`, () => {
      test.use({ viewport: { width, height: 1000 } });

      test("the four system cards keep a uniform width", async ({ page }) => {
        await page.goto("/");
        const section = page.locator("section", {
          has: page.getByText(LANDING.integrations.title, { exact: true }),
        });
        const desktopRow = section.locator("div.lg\\:flex").first();
        await expect(desktopRow).toBeVisible();

        const cards = desktopRow.locator("[data-integration-node]");
        await expect(cards).toHaveCount(LANDING.integrations.systems.length);

        const widths: number[] = [];
        for (let i = 0; i < (await cards.count()); i++) {
          const box = await cards.nth(i).boundingBox();
          widths.push(box?.width ?? 0);
        }

        const first = widths[0];
        widths.forEach((w, i) => {
          expect(
            w,
            `card #${i} (${LANDING.integrations.systems[i].name}) width vs first card's ${first}`,
          ).toBeCloseTo(first, 0);
        });
      });

      test("the desktop row is horizontally centred within its container", async ({
        page,
      }) => {
        await page.goto("/");
        const section = page.locator("section", {
          has: page.getByText(LANDING.integrations.title, { exact: true }),
        });
        const container = section.locator("div.max-w-content").first();
        const desktopRow = section.locator("div.lg\\:flex").first();

        const containerBox = await container.boundingBox();
        const rowBox = await desktopRow.boundingBox();
        if (!containerBox || !rowBox) throw new Error("could not measure container/row");

        const containerCenter = containerBox.x + containerBox.width / 2;
        const rowCenter = rowBox.x + rowBox.width / 2;
        const drift = Math.abs(containerCenter - rowCenter);

        expect(
          drift,
          `row centre ${rowCenter}px vs container centre ${containerCenter}px`,
        ).toBeLessThanOrEqual(4);
      });

      test("five Animated Beams render (one per system card into the hub, one hub into the output), each aria-hidden with a computed path", async ({
        page,
      }) => {
        await page.goto("/");
        const section = page.locator("section", {
          has: page.getByText(LANDING.integrations.title, { exact: true }),
        });
        const desktopRow = section.locator("div.lg\\:flex").first();

        const beams = desktopRow.locator("svg[data-animated-beam]");
        await expect(beams).toHaveCount(LANDING.integrations.systems.length + 1);

        for (let i = 0; i < (await beams.count()); i++) {
          const beam = beams.nth(i);
          await expect(beam).toHaveAttribute("aria-hidden", "true");

          // `expect(...).toHaveAttribute` reintenta; `getAttribute` no. El
          // `d` se calcula midiendo el layout, así que leerlo de una sola vez
          // era una carrera: unas veces llegaba tarde y el test se ponía rojo
          // sin que la página tuviera nada malo.
          const path = beam.locator("path").first();
          await expect(path, `beam #${i} path data`).toHaveAttribute("d", /.+/);
          const d = await path.getAttribute("d");
          expect(parseBeamPath(d ?? ""), `beam #${i} path parses`).not.toBeNull();
        }
      });

      test("el diagrama nunca se sale del viewport ni del contenedor", async ({ page }) => {
        // Regresion reportada: las tarjetas se veian cortadas por la izquierda.
        // No se reprodujo midiendo, pero la fila heredaba los 1220px del
        // contenedor de lectura y quedaba dispersa, asi que ahora lleva tope
        // propio. Esta prueba fija el limite duro por si vuelve a crecer.
        await page.goto("/");
        const section = page.locator("section", {
          has: page.getByText(LANDING.integrations.title, { exact: true }),
        });
        const desktopRow = section.locator("div.lg\\:flex").first();

        const rowBox = await desktopRow.boundingBox();
        if (!rowBox) throw new Error("no se pudo medir la fila");
        const vw = page.viewportSize()!.width;

        for (const sel of [
          "[data-integration-node]",
          "[data-integration-hub]",
          "[data-integration-output]",
        ]) {
          const nodes = desktopRow.locator(sel);
          for (let i = 0; i < (await nodes.count()); i++) {
            const b = await nodes.nth(i).boundingBox();
            if (!b) throw new Error(`no se pudo medir ${sel} #${i}`);
            expect(b.x, `${sel} #${i} borde izquierdo ${b.x}`).toBeGreaterThanOrEqual(-0.5);
            expect(
              b.x + b.width,
              `${sel} #${i} borde derecho ${b.x + b.width} vs viewport ${vw}`,
            ).toBeLessThanOrEqual(vw + 0.5);
          }
        }
      });

      test("each system-card beam reaches from that card's edge to the hub, and the last beam reaches from the hub to the output", async ({
        page,
      }) => {
        await page.goto("/");
        const section = page.locator("section", {
          has: page.getByText(LANDING.integrations.title, { exact: true }),
        });
        const desktopRow = section.locator("div.lg\\:flex").first();

        const cards = desktopRow.locator("[data-integration-node]");
        const hub = desktopRow.locator("[data-integration-hub]");
        const output = desktopRow.locator("[data-integration-output]");
        const beams = desktopRow.locator("svg[data-animated-beam]");

        const hubBox = await hub.boundingBox();
        const outputBox = await output.boundingBox();
        const rowBox = await desktopRow.boundingBox();
        if (!hubBox || !outputBox || !rowBox) {
          throw new Error("could not measure hub/output/row");
        }

        const systemCount = LANDING.integrations.systems.length;
        for (let i = 0; i < systemCount; i++) {
          const cardBox = await cards.nth(i).boundingBox();
          if (!cardBox) throw new Error(`could not measure card #${i}`);
          const d = await beams.nth(i).locator("path").first().getAttribute("d");
          const parsed = parseBeamPath(d ?? "");
          if (!parsed) throw new Error(`beam #${i} path did not parse`);

          // Coordinates in the path are relative to the row (the beam's
          // container); card/hub boxes are viewport-relative, so translate.
          const startXAbs = rowBox.x + parsed.startX;
          const endXAbs = rowBox.x + parsed.endX;
          const cardRightEdge = cardBox.x + cardBox.width;

          expect(
            Math.abs(startXAbs - cardRightEdge),
            `beam #${i} start x ${startXAbs} vs card #${i} right edge ${cardRightEdge}`,
          ).toBeLessThanOrEqual(6);
          expect(
            Math.abs(endXAbs - hubBox.x),
            `beam #${i} end x ${endXAbs} vs hub left edge ${hubBox.x}`,
          ).toBeLessThanOrEqual(6);
        }

        const outputBeamD = await beams
          .nth(systemCount)
          .locator("path")
          .first()
          .getAttribute("d");
        const outputBeamParsed = parseBeamPath(outputBeamD ?? "");
        if (!outputBeamParsed) throw new Error("hub->output beam path did not parse");

        const outputStartXAbs = rowBox.x + outputBeamParsed.startX;
        const outputEndXAbs = rowBox.x + outputBeamParsed.endX;
        const hubRightEdge = hubBox.x + hubBox.width;

        expect(
          Math.abs(outputStartXAbs - hubRightEdge),
          `hub->output beam start x ${outputStartXAbs} vs hub right edge ${hubRightEdge}`,
        ).toBeLessThanOrEqual(6);
        expect(
          Math.abs(outputEndXAbs - outputBox.x),
          `hub->output beam end x ${outputEndXAbs} vs output left edge ${outputBox.x}`,
        ).toBeLessThanOrEqual(6);
      });
    });
  }
});
