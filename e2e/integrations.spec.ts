import { test, expect } from "@playwright/test";
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

        const cards = desktopRow.locator("div.w-40.shrink-0");
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
            `card #${i} (${LANDING.integrations.systems[i]}) width vs first card's ${first}`,
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
          const d = await beam.locator("path").first().getAttribute("d");
          expect(d, `beam #${i} path data`).toBeTruthy();
          expect(parseBeamPath(d ?? ""), `beam #${i} path parses`).not.toBeNull();
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

        const cards = desktopRow.locator("div.w-40.shrink-0");
        const hub = desktopRow.locator("div.shadow-float").first();
        const output = desktopRow.locator("div.shadow-card.text-center").first();
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
