import type { ReactNode } from "react";

const VARIANTS = {
  primary:
    "bg-blue text-white hover:bg-[#4a9ef5] active:translate-y-px shadow-card",
  ghost:
    "border border-whisper bg-surface/60 text-ink hover:border-ink/20 active:translate-y-px",
} as const;

export function ButtonLink({
  href,
  variant = "primary",
  children,
  className = "",
}: {
  href: string;
  variant?: keyof typeof VARIANTS;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-[background-color,border-color,transform] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
