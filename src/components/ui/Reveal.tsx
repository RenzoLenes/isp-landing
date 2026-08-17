"use client";

import type { CSSProperties, ReactNode } from "react";
import { useRevealOnce } from "@/lib/useRevealOnce";

/**
 * La entrada al asomar en pantalla, sin librería de animación.
 *
 * Antes era `motion` con `whileInView`. La librería entera pesaba 63 KB
 * comprimidos —un tercio del JavaScript de la página— para hacer esto y unas
 * pocas cosas más igual de simples, y se notaba al cargar en un móvil.
 *
 * El movimiento es EL MISMO, no una aproximación: el muelle que usaba
 * (`stiffness: 100, damping: 20`) sale críticamente amortiguado, y su curva
 * está muestreada punto por punto en `--ease-spring` (globals.css). Lo único
 * que queda en JavaScript es decidir cuándo entra.
 *
 * Con `prefers-reduced-motion` manda `[data-motion-settle]`, que fuerza el
 * estado final desde el primer pintado, incluso antes de hidratar.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRevealOnce<HTMLDivElement>("-80px");

  return (
    <div
      ref={ref}
      data-motion-settle
      data-reveal="out"
      className={className}
      style={delay ? ({ transitionDelay: `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
