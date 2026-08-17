"use client";

import { useEffect, useRef } from "react";

/**
 * Marca un elemento como «ya entró» la primera vez que asoma en pantalla, y
 * deja de mirarlo. El movimiento lo pinta el CSS (`[data-reveal]` en
 * globals.css); esto sólo decide CUÁNDO, que es lo único de una entrada por
 * scroll que no puede resolverse todavía con una hoja de estilos portable.
 *
 * Sustituye al `whileInView` de `motion`. `rootMargin` reproduce el
 * `viewport.margin` de cada sitio —la sección usa -80px y los mensajes del
 * hilo -60px—, y desconectar tras el primer cruce reproduce `once: true`.
 *
 * El estado de reposo vive en CSS y no en un estilo en línea, así que el
 * servidor y el primer render del cliente pintan lo mismo: no hay nada que
 * pueda discrepar al hidratar.
 */
export function useRevealOnce<T extends HTMLElement>(rootMargin: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          node.dataset.reveal = "in";
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return ref;
}
