import type { Locator } from "@playwright/test";

export type ContrastInfo = {
  ratio: number;
  color: string;
  background: string;
  fontSize: number;
  fontWeight: string;
  /** WCAG "large text": >=24px, or >=18.66px (14pt) and bold. */
  isLarge: boolean;
  requiredRatio: number;
  passes: boolean;
};

/**
 * Reads the element's computed text colour and approximates its effective
 * background by walking up the ancestor chain, alpha-compositing every
 * background-color it finds onto an assumed-white canvas.
 *
 * This is an approximation, not a pixel-perfect renderer: `background-image`
 * (gradients, the hero's radial-gradient fog) is invisible to this method
 * because it only reads `background-color`, and `backdrop-filter: blur` is
 * ignored entirely. Where a surface relies on either of those (the navbar's
 * glass pill, the hero's gradient wash) the composite falls back to the
 * nearest solid ancestor background — practically `bg-fog` (#F5F7F4) — which
 * is a fair stand-in since the accents layered on top are low-opacity tints
 * of it, but it is not the literal pixel colour a human eye would sample.
 */
export async function getContrastInfo(locator: Locator): Promise<ContrastInfo> {
  return locator.evaluate((el) => {
    // Tailwind v4's opacity modifiers (`text-moss/80`, `bg-surface/60`, ...)
    // compute to `color-mix()`/`oklab()` strings in Chrome's getComputedStyle
    // output, not `rgb()`/`rgba()` — a plain regex parser silently fails on
    // those and would fall back to black, inflating every ratio. Instead,
    // let the canvas 2D API (which parses the full CSS Color 4 grammar,
    // including color-mix and oklab) do the normalisation: fill a 1x1
    // transparent canvas with the colour and read the pixel back. Because
    // the destination starts fully transparent, source-over compositing
    // yields the source's own (unpremultiplied) r/g/b and alpha exactly.
    const probeCanvas = document.createElement("canvas");
    probeCanvas.width = 1;
    probeCanvas.height = 1;
    const probeCtx = probeCanvas.getContext("2d", { willReadFrequently: true })!;

    function parseColor(str: string): { r: number; g: number; b: number; a: number } | null {
      if (!str || str === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
      probeCtx.clearRect(0, 0, 1, 1);
      probeCtx.fillStyle = str;
      probeCtx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = probeCtx.getImageData(0, 0, 1, 1).data;
      return { r, g, b, a: a / 255 };
    }

    function channelLuminance(c: number) {
      const v = c / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    }

    function relativeLuminance(c: { r: number; g: number; b: number }) {
      return (
        0.2126 * channelLuminance(c.r) +
        0.7152 * channelLuminance(c.g) +
        0.0722 * channelLuminance(c.b)
      );
    }

    function contrastRatio(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) {
      const la = relativeLuminance(a);
      const lb = relativeLuminance(b);
      const lighter = Math.max(la, lb);
      const darker = Math.min(la, lb);
      return (lighter + 0.05) / (darker + 0.05);
    }

    function effectiveBackground(start: Element | null) {
      const layers: { r: number; g: number; b: number; a: number }[] = [];
      let node: Element | null = start;
      while (node) {
        const bg = getComputedStyle(node).backgroundColor;
        const parsed = parseColor(bg);
        if (parsed && parsed.a > 0) layers.push(parsed);
        node = node.parentElement;
      }
      let result = { r: 255, g: 255, b: 255 };
      for (let i = layers.length - 1; i >= 0; i--) {
        const c = layers[i];
        result = {
          r: c.r * c.a + result.r * (1 - c.a),
          g: c.g * c.a + result.g * (1 - c.a),
          b: c.b * c.a + result.b * (1 - c.a),
        };
      }
      return result;
    }

    const style = getComputedStyle(el);
    const fg = parseColor(style.color) ?? { r: 0, g: 0, b: 0, a: 1 };
    const bg = effectiveBackground(el.parentElement ?? el);
    const ratio = contrastRatio(fg, bg);
    const fontSize = parseFloat(style.fontSize);
    const fontWeight = style.fontWeight;
    const isBold = parseInt(fontWeight, 10) >= 700 || fontWeight === "bold";
    const isLarge = fontSize >= 24 || (isBold && fontSize >= 18.66);
    const requiredRatio = isLarge ? 3 : 4.5;

    return {
      ratio,
      color: style.color,
      background: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
      fontSize,
      fontWeight,
      isLarge,
      requiredRatio,
      passes: ratio >= requiredRatio,
    };
  });
}
