import { LANDING } from "@/content/landing";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { HeroComposition } from "@/components/sections/HeroComposition";

export function Hero() {
  const { eyebrow, title, subtitle, ctaPrimary, ctaSecondary } = LANDING.hero;
  return (
    <section className="relative overflow-hidden px-4">
      {/* The section's own local fog gradient is gone — `GradientField`
          (mounted once in `layout.tsx`, behind the whole page shell) is now
          the single atmospheric background. Keeping both would stack their
          tints right where the hero copy sits and blow the contrast budget
          (verified empirically — see chunk-a-report.md). */}
      <div className="mx-auto grid max-w-content gap-14 pb-24 pt-36 md:pt-44 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-10">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-moss">
            {eyebrow}
          </p>
          <h1 className="mt-5 font-display text-5xl leading-[1.05] text-balance md:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-moss md:text-xl">
            {subtitle}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={ctaPrimary.href}>{ctaPrimary.label}</ButtonLink>
            <ButtonLink href={ctaSecondary.href} variant="ghost">
              {ctaSecondary.label}
            </ButtonLink>
          </div>
        </div>
        <HeroComposition />
      </div>
    </section>
  );
}
