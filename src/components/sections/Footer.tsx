import { LANDING } from "@/content/landing";

export function Footer() {
  const { brand, tagline, ctaLabel, ctaHref } = LANDING.footer;
  return (
    <footer className="border-t border-whisper px-4 py-10">
      <div className="mx-auto flex max-w-content flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="font-display text-2xl text-ink">{brand}</p>
          <p className="mt-1 text-sm text-moss">{tagline}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-moss">
          {/* py-3 + text-sm's 20px line-height = 44px: the AA tap-target
              floor, reached with padding rather than a larger font. */}
          <a href={ctaHref} className="py-3 hover:text-ink">
            {ctaLabel}
          </a>
          <span className="mx-1" aria-hidden>·</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
