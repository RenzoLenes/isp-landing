import { LANDING } from "@/content/landing";
import { SectionRegister } from "@/components/ui/SectionRegister";

export function Footer() {
  const { brand, tagline, ctaLabel, ctaHref } = LANDING.footer;
  return (
    // Same Sala Oscura register as Pilot (DESIGN.md §2 groups "Piloto +
    // footer" as one row) — `SectionRegister` renders a `<footer>` here
    // instead of a `<section>` via `as`, since this is its own landmark, not
    // a second section sharing the wrapper's default tag. Every colour below
    // reads the register vars: this text sits directly on `night`, not
    // nested in a white artifact, so it must repaint the same way
    // SectionHeading does.
    <SectionRegister
      as="footer"
      register="night"
      className="border-t border-[color:var(--border-subtle)] px-4 py-10"
    >
      <div className="mx-auto flex max-w-content flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="font-display text-2xl text-[color:var(--text-primary)]">{brand}</p>
          <p className="mt-1 text-sm text-[color:var(--text-secondary)]">{tagline}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[color:var(--text-secondary)]">
          {/* py-3 + text-sm's 20px line-height = 44px: the AA tap-target
              floor, reached with padding rather than a larger font. */}
          <a href={ctaHref} className="py-3 hover:text-[color:var(--text-primary)]">
            {ctaLabel}
          </a>
          <span className="mx-1" aria-hidden>·</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </div>
    </SectionRegister>
  );
}
