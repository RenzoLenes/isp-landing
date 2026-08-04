import type { Page } from "@playwright/test";

/**
 * Real-pixel contrast sampling, for surfaces `contrast.spec.ts`'s
 * DOM-based `getContrastInfo` helper is explicitly blind to: it only reads
 * `background-color`, so it cannot see `background-image` (gradients,
 * `GradientField`'s blurred radial patches) or `backdrop-filter`. This
 * helper instead takes a real screenshot and reads the actual composited
 * pixels — the only reliable way to measure text sitting on top of a CSS
 * gradient (see chunk-a-report.md and chunk-c-report.md for why chunk A and
 * C both had to fall back to this for the hero).
 *
 * Deliberately implemented with zero Node-side image-decoding dependencies
 * (no `sharp`, which is only present here as an incidental transitive/
 * optional dependency of `next` and isn't guaranteed to install on every
 * platform/CI runner): the screenshot buffer is handed back into the page
 * itself as a data URL and decoded by Chromium's own `<canvas>`, which
 * Playwright already requires to exist.
 */

type RGB = { r: number; g: number; b: number };

function channelLuminance(c: number): number {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function relativeLuminance(c: RGB): number {
  return (
    0.2126 * channelLuminance(c.r) +
    0.7152 * channelLuminance(c.g) +
    0.0722 * channelLuminance(c.b)
  );
}

export function contrastRatio(a: RGB, b: RGB): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Screenshots the current page and returns a handle (`imgId`) to a decoded
 * `<canvas>` already mounted in the page, ready for pixel sampling via
 * `readPixel`/`darkestInRect`. Caller is responsible for viewport/
 * `emulateMedia` setup before calling.
 */
export async function loadScreenshotCanvas(page: Page): Promise<string> {
  const buf = await page.screenshot({ type: "png" });
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
  const canvasId = `__contrast_canvas_${Math.random().toString(36).slice(2)}`;
  await page.evaluate(
    ({ dataUrl, canvasId }) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.id = canvasId;
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          canvas.style.display = "none";
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);
          document.body.appendChild(canvas);
          resolve();
        };
        img.onerror = () => reject(new Error("screenshot image failed to decode"));
        img.src = dataUrl;
      });
    },
    { dataUrl, canvasId },
  );
  return canvasId;
}

export async function readPixel(page: Page, canvasId: string, x: number, y: number): Promise<RGB> {
  return page.evaluate(
    ({ canvasId, x, y }) => {
      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      const ctx = canvas.getContext("2d")!;
      const px = Math.min(canvas.width - 1, Math.max(0, Math.round(x)));
      const py = Math.min(canvas.height - 1, Math.max(0, Math.round(y)));
      const [r, g, b] = ctx.getImageData(px, py, 1, 1).data;
      return { r, g, b };
    },
    { canvasId, x, y },
  );
}

/**
 * The darkest (lowest-luminance) pixel inside a rect — for dark-on-light
 * text this is the closest we can get to "the actual rendered ink colour"
 * without reconstructing alpha-compositing by hand: opacity-modified text
 * (e.g. `text-ink/75`) blends uniformly with whatever is behind every glyph
 * pixel, so the darkest pixel in the box already *is* that blend, read
 * straight off the render.
 */
export async function darkestInRect(
  page: Page,
  canvasId: string,
  rect: { x: number; y: number; width: number; height: number },
): Promise<RGB> {
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
      let best = { r: 255, g: 255, b: 255 };
      let bestLum = Infinity;
      for (let i = 0; i < data.length; i += 4) {
        const l = lum(data[i], data[i + 1], data[i + 2]);
        if (l < bestLum) {
          bestLum = l;
          best = { r: data[i], g: data[i + 1], b: data[i + 2] };
        }
      }
      return best;
    },
    { canvasId, rect },
  );
}
