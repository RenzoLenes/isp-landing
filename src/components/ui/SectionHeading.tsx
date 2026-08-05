export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  align?: "left" | "center";
}) {
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
      <h2 className="mt-4 font-display text-4xl leading-[1.08] text-balance text-[color:var(--text-primary)] md:text-5xl">
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
