import { test, expect } from "@playwright/test";
import { loadScreenshotCanvas, readPixel } from "./helpers/pixel-contrast";

/*
 * El hero: cielo, escala del titular y ancho de la consola.
 *
 * Estas pruebas se reescribieron con el rediseño (Campo Señal convertido en un
 * cielo real, DESIGN.md §7). Antes fijaban **píxeles absolutos**: "el titular
 * mide más de 78px a 1440px", "la consola ocupa más del 0.90 del viewport".
 * Ese planteamiento resultó ser justo el defecto que el rediseño corrigió — un
 * tamaño fijo sólo acierta a un ancho concreto y descuadra en el resto.
 *
 * Ahora fijan la **proporción**, que es la regla real del sistema (§5 y §8):
 * el titular mide el mismo porcentaje del viewport a cualquier ancho, y la
 * consola también. Así una futura regresión a tamaños fijos falla aquí en vez
 * de pasar desapercibida.
 */

const HEADLINE_VW = 4.4; // DESIGN.md §5
const CONSOLE_VW = 78; // DESIGN.md §8

test.describe("Hero atmosphere (cielo, escala del titular, ancho de consola)", () => {
  test("el cielo existe, se pinta detrás del contenido y es inerte", async ({ page }) => {
    await page.goto("/");
    const sky = page.locator("#sky-field");
    await expect(sky).toHaveCount(1);
    await expect(sky).toHaveAttribute("aria-hidden", "true");

    const style = await sky.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { zIndex: cs.zIndex, pointerEvents: cs.pointerEvents, position: cs.position };
    });
    // `-z-10` no es decorativo (DESIGN.md §7, trampa 2): un `absolute` con
    // z-index automático se pinta por encima del texto de los elementos no
    // posicionados y taparía el titular.
    expect(Number(style.zIndex), `z-index ${style.zIndex} debe ser negativo`).toBeLessThan(0);
    expect(style.pointerEvents, "pointer-events debe ser none").toBe("none");
    expect(style.position).toBe("absolute");

    const box = await sky.boundingBox();
    if (!box) throw new Error("el cielo no tiene caja");
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(400);
  });

  test("el titular no queda tapado por el cielo", async ({ page }) => {
    // Regresión concreta ya vivida: el cielo se montó sin `-z-10` y el titular
    // desapareció de la página aun estando en el DOM con opacidad 1. Medir el
    // píxel es lo único que lo detecta; el DOM decía que todo estaba bien.
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const heading = page.locator("main > section").first().getByRole("heading", { level: 1 });
    const box = await heading.boundingBox();
    if (!box) throw new Error("el titular no tiene caja");

    const canvasId = await loadScreenshotCanvas(page);
    // Barrido horizontal por la mitad de la primera línea: alguno de estos
    // puntos tiene que caer sobre un trazo de letra en Tinta.
    let darkest = 255;
    for (let i = 1; i < 40; i++) {
      const p = await readPixel(page, canvasId, box.x + (box.width * i) / 40, box.y + box.height * 0.22);
      darkest = Math.min(darkest, (p.r + p.g + p.b) / 3);
    }
    expect(darkest, `el píxel más oscuro del titular es ${darkest.toFixed(0)} (Tinta ≈ 26)`).toBeLessThan(90);
  });

  test("el cielo es un tinte real, no un lavado casi invisible", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const canvasId = await loadScreenshotCanvas(page);
    const box = await page.locator("#sky-field").boundingBox();
    if (!box) throw new Error("el cielo no tiene caja");
    // Punto alto y a la derecha: dentro del cielo, lejos del nav y de texto.
    const pixel = await readPixel(page, canvasId, box.x + box.width * 0.86, box.y + box.height * 0.18);

    const canvas = { r: 244, g: 246, b: 244 };
    const distance = Math.sqrt(
      (pixel.r - canvas.r) ** 2 + (pixel.g - canvas.g) ** 2 + (pixel.b - canvas.b) ** 2,
    );
    expect(
      distance,
      `píxel del cielo rgb(${pixel.r},${pixel.g},${pixel.b}) vs Lienzo rgb(244,246,244), distancia ${distance.toFixed(1)}`,
    ).toBeGreaterThan(10);
    // Y además tiene que ser azul, no un gris cualquiera.
    expect(pixel.b, `el azul (${pixel.b}) debe superar al rojo (${pixel.r})`).toBeGreaterThan(pixel.r);
  });

  test("el titular mantiene su proporción del viewport en todo el rango", async ({ page }) => {
    // La regla es proporcional (§5). La fórmula anterior sumaba un `rem` fijo
    // y tocaba techo a ~1400px, así que en un portátil el titular quedaba
    // clavado mientras el resto de la página seguía escalando.
    for (const width of [1280, 1440, 1512]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const heading = page.locator("main > section").first().getByRole("heading", { level: 1 });
      const fontSize = await heading.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      const expected = (width * HEADLINE_VW) / 100;
      expect(
        Math.abs(fontSize - expected),
        `a ${width}px el titular mide ${fontSize}px; ${HEADLINE_VW}vw serían ${expected.toFixed(1)}px`,
      ).toBeLessThan(1.5);
    }
  });

  test("la consola mantiene su proporción del viewport en todo el rango", async ({ page }) => {
    // §8: tope proporcional `min(1320px, 78vw)`. Por debajo de ~1692px manda
    // el 78vw, así que la fracción es constante.
    for (const width of [1280, 1440, 1512]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const console_ = page.locator("#gantry-console");
      const box = await console_.boundingBox();
      if (!box) throw new Error("la consola no tiene caja");
      const fraction = (box.width / width) * 100;
      expect(
        Math.abs(fraction - CONSOLE_VW),
        `a ${width}px la consola ocupa ${fraction.toFixed(1)}% del viewport; se esperaba ~${CONSOLE_VW}%`,
      ).toBeLessThan(3);
    }
  });
});
