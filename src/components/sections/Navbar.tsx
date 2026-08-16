"use client";

import { useEffect, useState } from "react";
import { LANDING } from "@/content/landing";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { GantryMark } from "@/components/ui/GantryMark";

/*
 * Barra al estilo Qipeline (DESIGN.md §6): transparente sobre el cielo, marca
 * a la izquierda, enlaces centrados, una sola CTA oscura a la derecha. Nada de
 * píldora blanca flotante ni de estado `scrolled` — la barra vive en la parte
 * alta del cielo (que la máscara de nubes deja despejada justo para esto) y
 * scrollea con la página, como en la referencia.
 *
 * `absolute` y no `fixed`: al no seguir al scroll ya no atraviesa registros
 * oscuros, lo que elimina de raíz el problema de contraste que la píldora
 * opaca existía para resolver (ver historial en git). Tinta sobre el azul más
 * saturado del cielo (#A4D1F6) mide ~11:1.
 *
 * El menú móvil conserva su semántica: `aria-expanded`, cierre con Escape,
 * objetivos táctiles de 44px y panel blanco opaco (sobre el cielo un panel
 * translúcido dejaría el texto sin fondo estable).
 */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const { brand, links, cta } = LANDING.nav;

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <header className="absolute inset-x-0 top-0 z-50 px-6 pt-7 sm:px-10">
      <div className="relative mx-auto flex w-full items-center justify-between lg:max-w-[min(1440px,78vw)]">
        <a
          href="#"
          className="flex min-h-11 items-center gap-2 text-ink"
        >
          <GantryMark size={24} />
          <span className="font-display text-[clamp(1.0625rem,1.2vw,1.375rem)] font-semibold tracking-tight leading-none">
            {brand}
          </span>
        </a>

        <nav
          aria-label="Principal"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-12 text-[clamp(0.9375rem,0.95vw,1.0625rem)] text-ink md:flex"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center py-4 leading-none transition-opacity hover:opacity-60"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <ButtonLink href={cta.href} variant="ink" size="sm">
            {cta.label}
          </ButtonLink>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
          className="flex size-11 items-center justify-center rounded-full text-ink md:hidden"
        >
          <span aria-hidden className="relative block h-3 w-5">
            <span
              className={`absolute left-0 top-0 h-px w-full bg-ink transition-transform duration-200 ${open ? "translate-y-[5.5px] rotate-45" : ""}`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-full bg-ink transition-transform duration-200 ${open ? "-translate-y-[5.5px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      {open ? (
        <div className="mx-auto mt-3 rounded-[20px] bg-surface p-6 shadow-[0_24px_60px_-24px_rgba(23,58,102,0.4)] md:hidden">
          <nav aria-label="Principal móvil" className="flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center text-lg text-ink"
              >
                {link.label}
              </a>
            ))}
            <ButtonLink href={cta.href} variant="ink" className="mt-2 w-full">
              {cta.label}
            </ButtonLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
