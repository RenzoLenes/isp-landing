import type { ElementType, ReactNode } from "react";

/**
 * The three registers of DESIGN.md §2/§3, plus the field register the hero
 * opens on — one name per row of the section table. This is the single list
 * a future section has to pick from; there is no fourth background value
 * anywhere else in the codebase (see the "no usages" diagnosis this chunk
 * started from).
 */
export type Register = "signal-field" | "surface" | "canvas" | "night";

const REGISTER_BG: Record<Register, string> = {
  "signal-field": "bg-signal-field",
  surface: "bg-surface",
  canvas: "bg-canvas",
  night: "bg-night",
};

/**
 * Full-bleed register wrapper (DESIGN.md §2 "El ritmo de registros" + §6
 * "los cortes de registro van a sangre completa"). Renders the section's
 * outer element with a solid, edge-to-edge background — no border, no
 * shadow, no fade — and stamps `data-register` so any nested primitive can
 * read the CSS custom properties `globals.css` defines per register
 * (`--text-primary`, `--text-secondary`, `--border-subtle`, `--card-border`,
 * `--card-shadow`, `--btn-primary-bg`/`-fg`) without a prop or a client
 * context.
 *
 * Deliberately minimal: this owns *only* the register's background colour
 * and its data attribute. It does not also centralise the `px-4 py-[...]`
 * rhythm or the `mx-auto max-w-content` container — every section already
 * had its own (occasionally special-cased: Hero's top padding clears the
 * fixed nav, HowItWorks nests a translucent card, Pilot uses a two-column
 * grid) and re-deriving that here risked a subtler regression than the one
 * line of duplication it would have removed. `className` is where each
 * section keeps supplying that.
 *
 * `as` picks the rendered tag — `"section"` for every content section,
 * `"footer"` for the page footer, which shares the Piloto row's register
 * per the table but is a distinct landmark.
 */
export function SectionRegister({
  as: Component = "section",
  register,
  id,
  className = "",
  children,
}: {
  as?: ElementType;
  register: Register;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Component id={id} data-register={register} className={`${REGISTER_BG[register]} ${className}`}>
      {children}
    </Component>
  );
}
