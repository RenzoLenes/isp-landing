import { test, expect } from "@playwright/test";
import { LANDING } from "../src/content/landing";

/*
 * «Cómo funciona» pasó de una rejilla de cuatro tarjetas a un carrusel de dos
 * columnas: índice de pasos a la izquierda, panel de cielo a la derecha
 * (DESIGN.md §6). Estas pruebas se reescribieron con ese cambio — las
 * anteriores medían alturas de maquetas y columnas de rejilla, y ya no hay
 * rejilla.
 *
 * Lo que se fija ahora es lo que puede romperse sin que se vea:
 *   · sólo hay UN paso en pantalla, y es el que dice la pestaña activa;
 *   · el carrusel avanza solo — es la razón de ser del componente;
 *   · y se para en cuanto alguien toca, que es lo que impide que la página
 *     te quite de las manos el paso que estabas leyendo.
 */

const { steps, stepLabel } = LANDING.flow;

/**
 * Un texto que SÓLO aparece en el artefacto de ese paso. Se deriva del
 * contenido en vez de escribirse a mano para que las pruebas no se queden
 * mirando frases que ya no existen.
 */
function muestra(step: (typeof steps)[number]): string {
  const a = step.artifact;
  switch (a.kind) {
    case "chat":
      return a.messages[0].text;
    case "consulta":
      return a.rows[0].label;
    case "decision":
      return a.question;
    case "ticket":
      return a.assignee.name;
  }
}

const tabs = (page: import("@playwright/test").Page) =>
  page.locator("#como-funciona [role='tab']");
const panel = (page: import("@playwright/test").Page) =>
  page.locator("#como-funciona [role='tabpanel']");

test.describe("Cómo funciona — carrusel", () => {
  test("abre en el primer paso y sólo enseña ese", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");

    await expect(tabs(page)).toHaveCount(steps.length);
    for (let i = 0; i < steps.length; i++) {
      await expect(tabs(page).nth(i)).toContainText(steps[i].title);
    }

    await expect(tabs(page).nth(0)).toHaveAttribute("aria-selected", "true");
    await expect(panel(page)).toContainText(`${stepLabel} 1`);
    await expect(panel(page)).toContainText(muestra(steps[0]));
    // El artefacto del paso 2 no puede estar en pantalla a la vez.
    await expect(panel(page)).not.toContainText(muestra(steps[1]));
  });

  test("cada paso enseña su propio artefacto, no la misma ficha cuatro veces", async ({
    page,
  }) => {
    // El defecto que arregló este componente: los cuatro pasos pintaban la
    // misma pieza de dos renglones, así que el mensaje no parecía un mensaje
    // ni la decisión una decisión. Si alguien vuelve a unificarlos, aquí se
    // ve — cada paso trae un texto que sólo existe en su artefacto.
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");

    for (let i = 0; i < steps.length; i++) {
      await tabs(page).nth(i).click();
      await expect(panel(page)).toContainText(muestra(steps[i]));
      for (let j = 0; j < steps.length; j++) {
        if (j !== i) await expect(panel(page)).not.toContainText(muestra(steps[j]));
      }
    }
  });

  test("avanza solo al paso siguiente", async ({ page }) => {
    // La sección tiene que entrar en pantalla: es su único trabajo sin que
    // nadie toque nada, y si el temporizador se rompe la página se queda
    // congelada en el paso 1 sin dar ningún síntoma.
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");
    await page.locator("#como-funciona").scrollIntoViewIfNeeded();

    await expect(tabs(page).nth(1)).toHaveAttribute("aria-selected", "true", {
      timeout: 15_000,
    });
    await expect(panel(page)).toContainText(muestra(steps[1]));
  });

  test("un clic elige el paso y apaga el automático", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");

    await tabs(page).nth(3).click();
    await expect(tabs(page).nth(3)).toHaveAttribute("aria-selected", "true");
    await expect(panel(page)).toContainText(steps[3].handoff);

    // Pasado el tiempo de un paso completo sigue donde lo dejaron.
    await page.waitForTimeout(9_000);
    await expect(tabs(page).nth(3)).toHaveAttribute("aria-selected", "true");
  });

  test("las flechas recorren los pasos", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");

    await tabs(page).nth(0).click();
    await tabs(page).nth(0).focus();
    await page.keyboard.press("ArrowDown");
    await expect(tabs(page).nth(1)).toBeFocused();
    await expect(tabs(page).nth(1)).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("End");
    await expect(tabs(page).nth(steps.length - 1)).toHaveAttribute("aria-selected", "true");
  });

  test("el panel no cambia de tamaño entre pasos", async ({ page }) => {
    // Los cuatro pasos traen textos de largos distintos. Sin altura fija el
    // panel encoge y crece en cada salto automático, y el bloque entero baila.
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");

    const alturas: number[] = [];
    for (let i = 0; i < steps.length; i++) {
      await tabs(page).nth(i).click();
      const box = await panel(page).boundingBox();
      if (!box) throw new Error(`el panel del paso ${i} no tiene caja`);
      alturas.push(Math.round(box.height));
    }
    expect(new Set(alturas).size, `alturas: ${JSON.stringify(alturas)}`).toBe(1);
  });

  test("en móvil el índice y el panel se apilan", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto("/");

    const primeraPestaña = await tabs(page).nth(0).boundingBox();
    const caja = await panel(page).boundingBox();
    if (!primeraPestaña || !caja) throw new Error("falta una caja");
    expect(caja.y).toBeGreaterThan(primeraPestaña.y);
    expect(caja.width).toBeLessThanOrEqual(390);
  });
});
