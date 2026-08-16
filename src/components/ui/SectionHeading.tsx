export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  /**
   * `split` pone el título a la izquierda y el cuerpo a la derecha, en dos
   * columnas (referencia Qipeline). Existe porque la página había quedado
   * con TODOS los encabezados centrados, y esa simetría repetida sección
   * tras sección se lee como plantilla. Sólo se aplica donde hay `body`:
   * sin cuerpo la columna derecha quedaría vacía.
   */
  align?: "left" | "center" | "split";
}) {
  if (align === "split" && body) {
    return (
      <div className="grid items-end gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:gap-12">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
            {eyebrow}
          </p>
          <h2 className="mt-4 text-balance font-display text-[clamp(1.9rem,2.6vw,3rem)] font-medium leading-[1.1] tracking-[-0.025em] text-[color:var(--text-primary)]">
            {title}
          </h2>
        </div>
        <p className="text-lg leading-relaxed text-[color:var(--text-secondary)] md:pb-1">
          {body}
        </p>
      </div>
    );
  }

  const alignClass = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {/* Every colour below reads a register-scoped CSS custom property
          (see globals.css) instead of a hardcoded token: this component sits
          directly on whatever `SectionRegister` its section chose — surface,
          canvas, signal-field or night — never nested inside its own opaque
          card, so it's exactly the kind of primitive that must repaint per
          register rather than assume light. */}
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-display text-[clamp(1.9rem,2.6vw,3rem)] font-medium leading-[1.1] tracking-[-0.025em] text-balance text-[color:var(--text-primary)]">
        {title}
      </h2>
      {body ? (
        <p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-[color:var(--text-secondary)]">
          {body}
        </p>
      ) : null}
    </div>
  );
}
