/*
 * La marca de Gantry, inline en vez de <img src="/gantry-icon-*.svg">.
 *
 * Dos razones: se pinta con `currentColor`, así que hereda el registro en el
 * que está (Tinta sobre el Campo Señal, Superficie sobre Sala Oscura) sin
 * necesidad de dos archivos ni de detectar el tema; y no es una petición de
 * red extra en el camino crítico del primer pintado.
 *
 * Los archivos de `public/` se conservan como los assets de marca entregables
 * (redes, presentaciones). El icono de pestaña NO sale de ahí: vive en
 * `app/icon.svg`, con la misma geometría de abajo sobre un azulejo Nocturno.
 *
 * El wordmark NO va aquí: se compone como texto vivo en Space Grotesk junto a
 * la marca. Los SVG de `public/` traen el wordmark en Montserrat, una fuente
 * que la página no carga, así que se habría renderizado con una sustituta
 * distinta en cada equipo.
 */
export function GantryMark({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="260 168 200 200"
      fill="currentColor"
      aria-hidden
    >
      <polygon points="330,200 346,190 346,346 330,346" />
      <polygon points="418,229 434,219 434,346 418,346" />
      <polygon points="286,313 434,219 434,239 286,332" />
    </svg>
  );
}
