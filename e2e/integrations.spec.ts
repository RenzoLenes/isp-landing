import { test, expect } from "@playwright/test";
import { LANDING } from "../src/content/landing";

// The Integrations convergence diagram was rebuilt twice for defects: threads
// collapsed to 0px width (a flex bug), and a trunk too short to reach the
// outer system cards. Verified at every breakpoint where the desktop
// (`lg:flex`) row renders: 1024, 1280, 1440.
const WIDTHS = [1024, 1280, 1440];

test.describe("Integrations diagram", () => {
  for (const width of WIDTHS) {
    test.describe(`at ${width}px`, () => {
      test.use({ viewport: { width, height: 1000 } });

      test("the four system-to-trunk connector threads have non-zero width", async ({
        page,
      }) => {
        await page.goto("/");
        const section = page.locator("section", {
          has: page.getByText(LANDING.integrations.title, { exact: true }),
        });
        const desktopRow = section.locator("div.lg\\:flex").first();
        await expect(desktopRow).toBeVisible();

        // The 4 horizontal connectors from each system card into the trunk:
        // `<div className="h-px w-6 flex-1">`, unique among the diagram's
        // connectors (the trunk uses h-[174px], hub->output connectors use
        // w-12/xl:w-16).
        const connectors = desktopRow.locator("div.h-px.w-6.flex-1");
        await expect(connectors).toHaveCount(LANDING.integrations.systems.length);

        const widths: number[] = [];
        for (let i = 0; i < (await connectors.count()); i++) {
          const box = await connectors.nth(i).boundingBox();
          widths.push(box?.width ?? 0);
        }

        widths.forEach((w, i) => {
          expect(w, `connector #${i} (${LANDING.integrations.systems[i]} -> trunk) width`).toBeGreaterThan(0);
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

      test("the vertical trunk spans from the first to the last system card", async ({
        page,
      }) => {
        await page.goto("/");
        const section = page.locator("section", {
          has: page.getByText(LANDING.integrations.title, { exact: true }),
        });
        const desktopRow = section.locator("div.lg\\:flex").first();

        const cards = desktopRow.locator("div.flex.items-center.gap-3 > div.min-w-0");
        await expect(cards).toHaveCount(LANDING.integrations.systems.length);

        const trunk = desktopRow.locator("div.h-\\[174px\\].w-px");
        await expect(trunk).toHaveCount(1);

        const firstCardBox = await cards.first().boundingBox();
        const lastCardBox = await cards.last().boundingBox();
        const trunkBox = await trunk.boundingBox();
        if (!firstCardBox || !lastCardBox || !trunkBox) {
          throw new Error("could not measure trunk/cards");
        }

        const firstCenter = firstCardBox.y + firstCardBox.height / 2;
        const lastCenter = lastCardBox.y + lastCardBox.height / 2;
        const trunkTop = trunkBox.y;
        const trunkBottom = trunkBox.y + trunkBox.height;

        expect(
          Math.abs(trunkTop - firstCenter),
          `trunk top ${trunkTop} vs first card (MikroWisp) centre ${firstCenter}`,
        ).toBeLessThanOrEqual(6);
        expect(
          Math.abs(trunkBottom - lastCenter),
          `trunk bottom ${trunkBottom} vs last card (Tu propia API) centre ${lastCenter}`,
        ).toBeLessThanOrEqual(6);
      });
    });
  }
});
