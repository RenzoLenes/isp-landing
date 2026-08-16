import { useSyncExternalStore } from "react";

const REDUCE_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * ¿Puede la página moverse sola?
 *
 * Lo usan las dos piezas que avanzan sin que nadie las toque: el carrusel de
 * «Cómo funciona» y el recorrido de la consola del hero. Vive aquí y no
 * duplicado en cada una para que no puedan divergir — si el criterio de
 * «moverse solo» cambia, cambia en un sitio.
 *
 * Se lee con `useSyncExternalStore` y no con un `useState` encendido desde un
 * efecto: en el servidor no hay `matchMedia`, y la instantánea de servidor
 * —«no, quieto»— es exactamente el arranque que queremos, así que servidor y
 * primer render del cliente nunca discrepan. Es el mismo cuidado con la
 * hidratación que documenta `Reveal`.
 */
export function useMotionAllowed() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCE_MOTION);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => !window.matchMedia(REDUCE_MOTION).matches,
    () => false,
  );
}
