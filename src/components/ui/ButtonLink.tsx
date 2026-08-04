import type { ReactNode } from "react";

const VARIANTS = {
  primary:
    "bg-blue text-surface hover:bg-blue-deep active:translate-y-px shadow-card",
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
      className={`inline-flex min-h-11 items-center justify-center rounded-full py-3 text-sm font-medium transition-[background-color,border-color,transform] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
