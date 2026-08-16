import type { Page } from "@playwright/test";

export type OverflowOffender = {
  selector: string;
  right: number;
  clientWidth: number;
  overflowPx: number;
};

/** Finds elements whose box extends past the viewport's right edge. */
export async function findOverflowingElements(page: Page): Promise<OverflowOffender[]> {
  return page.evaluate(() => {
    function describe(el: Element): string {
      const id = el.id ? `#${el.id}` : "";
      const cls =
        typeof el.className === "string" && el.className.trim()
          ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".")
          : "";
      return `${el.tagName.toLowerCase()}${id}${cls}`;
    }

    const clientWidth = document.documentElement.clientWidth;
    const all = Array.from(document.body.querySelectorAll("*"));
    const offenders: OverflowOffender[] = [];
    for (const el of all) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      if (rect.right > clientWidth + 1) {
        offenders.push({
          selector: describe(el),
          right: Math.round(rect.right * 100) / 100,
          clientWidth,
          overflowPx: Math.round((rect.right - clientWidth) * 100) / 100,
        });
      }
    }
    offenders.sort((a, b) => b.overflowPx - a.overflowPx);
    return offenders.slice(0, 15);
  });
}

export type TapTargetViolation = {
  selector: string;
  text: string;
  height: number;
  width: number;
};

/** Every visible `a, button, input, select` shorter than the 44px tap-target floor. */
export async function auditTapTargets(page: Page): Promise<TapTargetViolation[]> {
  return page.evaluate(() => {
    function describe(el: Element): string {
      const id = el.id ? `#${el.id}` : "";
      const cls =
        typeof el.className === "string" && el.className.trim()
          ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
          : "";
      return `${el.tagName.toLowerCase()}${id}${cls}`;
    }

    const MIN = 44;
    const TOLERANCE = 0.5;
    const els = Array.from(document.querySelectorAll("a, button, input, select"));
    const violations: TapTargetViolation[] = [];
    for (const el of els) {
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      if (rect.height < MIN - TOLERANCE) {
        const text =
          (el.textContent || "").trim() ||
          el.getAttribute("aria-label") ||
          el.getAttribute("placeholder") ||
          el.getAttribute("name") ||
          "";
        violations.push({
          selector: describe(el),
          text: text.slice(0, 60),
          height: Math.round(rect.height * 100) / 100,
          width: Math.round(rect.width * 100) / 100,
        });
      }
    }
    return violations;
  });
}

export type Box = { x: number; y: number; width: number; height: number };

/** Strict rectangle overlap — touching edges (area 0) do not count as overlap. */
export function boxesOverlap(a: Box, b: Box): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export type FocusStyleInfo = {
  tag: string;
  selector: string;
  outlineWidth: string;
  outlineStyle: string;
  boxShadow: string;
  hasVisibleIndicator: boolean;
};

/** Reads the currently-focused element's computed focus-indicator styles. */
export async function getActiveElementFocusStyle(page: Page): Promise<FocusStyleInfo | null> {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    function describe(node: Element): string {
      const id = node.id ? `#${node.id}` : "";
      const cls =
        typeof node.className === "string" && node.className.trim()
          ? "." + node.className.trim().split(/\s+/).slice(0, 2).join(".")
          : "";
      const text = (node.textContent || "").trim().slice(0, 40);
      return `${node.tagName.toLowerCase()}${id}${cls}${text ? ` "${text}"` : ""}`;
    }
    const style = getComputedStyle(el);
    const outlineWidth = style.outlineWidth;
    const outlineStyle = style.outlineStyle;
    const boxShadow = style.boxShadow;
    const hasOutline =
      outlineStyle !== "none" && parseFloat(outlineWidth) > 0;
    const hasBoxShadow = boxShadow !== "none" && boxShadow.trim() !== "";
    return {
      tag: el.tagName.toLowerCase(),
      selector: describe(el),
      outlineWidth,
      outlineStyle,
      boxShadow,
      hasVisibleIndicator: hasOutline || hasBoxShadow,
    };
  });
}
