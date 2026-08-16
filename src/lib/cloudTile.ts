/*
 * Generador de mosaicos de nube por ruido fractal, compartido por los dos
 * cielos de la página: el de la cabecera (`ui/SkyField.tsx`) y el del panel de
 * «Cómo funciona» (`sections/SignalFlow.tsx`).
 *
 * Es una función pura que devuelve un `url("data:image/svg+xml,...")`: no
 * transporta ningún token de color ni tipografía, sólo la geometría del ruido.
 * Vive aparte porque la calibración de abajo es delicada y no debe divergir en
 * dos copias.
 *
 * Por qué desenfocar elipses no basta: una elipse con `blur` tiene una sola
 * caída gaussiana y un contorno liso, así que lee como mancha de degradado.
 * Una nube real tiene estructura en varias escalas a la vez y un borde
 * deshilachado. Eso lo da el ruido fractal.
 *
 * El navegador rasteriza el filtro UNA vez al decodificar el SVG y desde ahí
 * lo trata como cualquier imagen; no es un filtro que se recalcule por frame.
 * `stitchTiles='stitch'` hace que los bordes del mosaico casen sin costura.
 *
 * Del ruido a la nube, en tres pasos dentro del filtro:
 *   1. `feTurbulence type='fractalNoise'` con frecuencias distintas en X e Y
 *      (X más baja = rasgos más anchos): los bancos son más anchos que altos.
 *      Relación ~1.5:1 como techo — con más anisotropía el cielo sale a rayas.
 *   2. `feColorMatrix` fuerza el RGB a blanco puro y pasa el canal rojo del
 *      ruido al alfa: blanco con opacidad ruidosa.
 *   3. `feComponentTransfer` con tabla — el paso decisivo, y el fácil de
 *      errar. `fractalNoise` NO reparte sus valores de forma uniforme: se
 *      apiñan alrededor de 0.5 en una campana estrecha, así que la curva tiene
 *      que trabajar dentro de ~[0.3, 0.7]. Una tabla que recién suba pasado
 *      0.6 deja casi toda la nube en opacidad cero y el cielo sale liso (fue
 *      el primer intento). Las tablas que se pasen aquí deben llevar 0.3 →
 *      transparente y 0.7 → opaco.
 *
 * `color-interpolation-filters='sRGB'` es obligatorio: el valor por defecto
 * (linearRGB) desplaza el resultado tonal y las nubes salen lavadas.
 *
 * Coste: es (píxeles rasterizados x octavas), y el tamaño en pantalla del
 * mosaico ES su tamaño de rasterizado. Bajar octavas abarata poco y aplana el
 * detalle plumoso; lo que funciona es achicar el mosaico y bajar
 * `baseFrequency` en la misma proporción — la nube mide lo mismo en pantalla y
 * se rasteriza a la mitad de píxeles. Medido: ~200 ms una sola vez, y ni un
 * frame de coste después.
 */
export function cloudTile({
  width,
  height,
  baseFrequency,
  octaves,
  seed,
  tableValues,
}: {
  width: number;
  height: number;
  /** Dos valores "x y". X más baja = rasgos más anchos. */
  baseFrequency: string;
  octaves: number;
  seed: number;
  /** Curva de opacidad. Debe llevar 0.3 → transparente y 0.7 → opaco. */
  tableValues: string;
}): string {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>` +
    `<filter id='c' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='${baseFrequency}' numOctaves='${octaves}' seed='${seed}' stitchTiles='stitch'/>` +
    `<feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1 0 0 0 0'/>` +
    `<feComponentTransfer><feFuncA type='table' tableValues='${tableValues}'/></feComponentTransfer>` +
    `</filter>` +
    `<rect width='${width}' height='${height}' filter='url(#c)'/>` +
    `</svg>`;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/** Bancos: rasgos anchos, curva de contraste alto → masas con núcleo opaco. */
export const CLOUD_MASSES = cloudTile({
  width: 1400,
  height: 900,
  baseFrequency: "0.0024 0.0034",
  octaves: 4,
  seed: 7,
  tableValues: "0 0 0 0.45 0.95 1",
});

/** Jirones: rasgo alargado, curva plana → textura plumosa sobre los bancos. */
export const CLOUD_WISPS = cloudTile({
  width: 1000,
  height: 680,
  baseFrequency: "0.00304 0.01216",
  octaves: 4,
  seed: 23,
  tableValues: "0 0 0.05 0.3 0.55 0.7",
});
