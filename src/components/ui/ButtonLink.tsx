import type { ReactNode } from "react";

/*
 * Geometría Qipeline (DESIGN.md §6): rectángulo redondeado de 14–16px, no
 * cápsula; sombra ancha teñida al fondo; feedback táctil de tres estados
 * (elevación al hover, hundimiento + scale al presionar). El radio vive en
 * SIZES porque en la referencia escala con el botón: 14px en la barra, 16px
 * en los CTAs del hero.
 */
const VARIANTS = {
  // Relleno Señal — sin call sites como CTA (el tratamiento oscuro es único
  // en toda la página); se conserva por si una acción secundaria futura lo
  // pide. Señal sigue siendo el acento en enlaces, foco y nodo de contexto.
  primary:
    "bg-signal text-surface shadow-[0_16px_36px_-14px_rgba(27,79,146,0.55)] hover:-translate-y-0.5 hover:bg-signal-deep active:translate-y-px active:scale-[0.98]",
  // CTA primaria. Register-aware (DESIGN.md §6: "invierte a Superficie sobre
  // Sala Oscura"): lee `--btn-primary-bg`/`-fg` en vez de fijar `bg-ink`,
  // así el mismo botón no desaparece sobre el registro nocturno.
  ink: "bg-[color:var(--btn-primary-bg)] text-[color:var(--btn-primary-fg)] shadow-[0_16px_36px_-14px_rgba(15,24,36,0.55)] hover:-translate-y-0.5 active:translate-y-px active:scale-[0.98]",
  // Secundaria: blanco sólido con sombra, como el "Watch Demo" de la
  // referencia — no un fantasma translúcido con borde, que sobre el cielo
  // perdía presencia.
  ghost:
    "bg-surface text-ink shadow-[0_16px_36px_-18px_rgba(30,64,120,0.4)] hover:-translate-y-0.5 active:translate-y-px active:scale-[0.98]",
} as const;

// min-h-11 lives in the base string, not here — the 44px touch floor applies
// to every size and must never become size-dependent.
const SIZES = {
  md: "rounded-[16px] px-7 text-[clamp(0.9375rem,1vw,1.0625rem)]",
  sm: "rounded-[14px] px-5 text-[clamp(0.875rem,0.95vw,1rem)]",
} as const;

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  children,
  className = "",
}: {
  href: string;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex min-h-11 items-center justify-center py-3 font-medium transition-[background-color,transform] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
