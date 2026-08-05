import type { ReactNode } from "react";

const VARIANTS = {
  // Signal filled pill. No call site uses this for a CTA anymore (hero-fixes-
  // report.md, Fix 4): the navbar CTA moved from `primary` to `ink` to match
  // the hero, since the references pair one dark CTA treatment across the
  // whole page rather than signal-for-nav/dark-for-hero. Kept as a variant —
  // signal remains the accent color elsewhere (links, focus rings, the
  // triad's context node) — in case a future secondary action wants it.
  primary:
    "bg-signal text-surface hover:bg-signal-deep active:translate-y-px shadow-card",
  // Dark filled pill — the hero's primary CTA and, since Fix 4, the navbar's
  // too. Signal stays the sole action accent everywhere else (links, focus
  // rings, the triad's context node).
  ink: "bg-ink text-surface hover:bg-ink/90 active:translate-y-px shadow-card",
  ghost:
    "border border-whisper bg-surface/60 text-ink hover:border-ink/20 active:translate-y-px",
} as const;

// min-h-11 lives in the base string, not here — the 44px touch floor applies
// to every size and must never become size-dependent.
const SIZES = {
  md: "px-6",
  sm: "px-4",
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
      className={`inline-flex min-h-11 items-center justify-center rounded-full py-3 text-sm font-medium transition-[background-color,border-color,transform] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
