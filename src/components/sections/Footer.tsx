import type { ReactNode } from "react";
import { LANDING, type FooterColumn, type FooterLinkIcon } from "@/content/landing";
import { SectionRegister } from "@/components/ui/SectionRegister";
import { GantryMark } from "@/components/ui/GantryMark";

/*
 * Glifos de contacto. Viven aquí y no en `console-icons.tsx` porque ese set es
 * del chrome de la consola; estos se usan sólo en el footer. Son versiones
 * simples de las marcas de X y LinkedIn: enlazar a los perfiles propios con su
 * icono reconocible es uso nominativo corriente, a diferencia de reproducir el
 * logotipo de un producto ajeno (ver §6, los sistemas integrados).
 */
const SOCIAL_ICONS: Record<FooterLinkIcon, ReactNode> = {
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d="M4.98 3.5A2.5 2.5 0 1 1 2.5 6a2.5 2.5 0 0 1 2.48-2.5ZM3 8.98h4V21H3V8.98ZM9.5 8.98h3.83v1.64h.05a4.2 4.2 0 0 1 3.78-2.08c4.04 0 4.79 2.66 4.79 6.12V21h-4v-5.5c0-1.31-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21h-4V8.98Z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d="M17.7 3h3.3l-7.2 8.24L22.3 21h-6.63l-5.2-6.79L4.53 21H1.22l7.7-8.8L1.7 3h6.8l4.7 6.22L17.7 3Zm-1.16 16h1.83L7.55 4.9H5.58L16.54 19Z" />
    </svg>
  ),
  mail: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden
    >
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  ),
};

/**
 * Una entrada de columna. Si el `href` sigue siendo el marcador `#`, se pinta
 * como texto y no como enlace: un enlace que no lleva a ninguna parte engaña
 * al visitante y molesta a quien navega con teclado o lector de pantalla. En
 * cuanto `landing.ts` reciba el destino real, se convierte en enlace solo.
 */
function FooterEntry({ link }: { link: FooterColumn["links"][number] }) {
  const pending = link.href === "#";
  const content = (
    <>
      {link.icon ? SOCIAL_ICONS[link.icon] : null}
      {link.label}
    </>
  );
  const shared =
    "inline-flex min-h-11 items-center gap-2 text-sm text-[color:var(--text-secondary)]";

  return pending ? (
    <span className={shared}>{content}</span>
  ) : (
    <a
      href={link.href}
      className={`${shared} transition-colors hover:text-[color:var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal`}
    >
      {content}
    </a>
  );
}

export function Footer() {
  const { brand, tagline, rights, columns } = LANDING.footer;

  return (
    // Sala Oscura, el registro de cierre (DESIGN.md §2). `SectionRegister`
    // renderiza un `<footer>` aquí en vez de `<section>` vía `as`: es su
    // propio landmark. Todo el color lee las variables del registro — este
    // texto se apoya directo sobre `night`, no dentro de un artefacto blanco.
    <SectionRegister
      as="footer"
      register="night"
      className="border-t border-[color:var(--border-subtle)] px-6 py-14 sm:px-10"
    >
      <div className="mx-auto flex w-full max-w-content flex-col gap-10 md:flex-row md:justify-between md:gap-16">
        <div className="max-w-sm">
          {/* Wordmark en versalitas con tracking amplio: tratamiento propio
              del footer, más quieto que el de la barra de navegación. */}
          <p className="flex items-center gap-2.5 font-display text-[color:var(--text-primary)]">
            <GantryMark size={24} />
            <span className="text-lg font-medium uppercase tracking-[0.22em]">{brand}</span>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[color:var(--text-secondary)]">
            {tagline}
          </p>
          <p className="mt-2 text-sm text-[color:var(--text-secondary)]">
            © {new Date().getFullYear()} {brand}. {rights}
          </p>
        </div>

        <nav
          aria-label="Enlaces del pie"
          className="grid grid-cols-2 gap-x-10 gap-y-8 sm:gap-x-16"
        >
          {columns.map((column) => (
            <div key={column.label}>
              <h2 className="text-xs font-medium text-[color:var(--text-primary)]">
                {column.label}
              </h2>
              <ul className="mt-1 flex flex-col">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterEntry link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </SectionRegister>
  );
}
