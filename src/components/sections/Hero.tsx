import { LANDING } from "@/content/landing";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { HeroComposition } from "@/components/sections/HeroComposition";

export function Hero() {
  const { eyebrow, title, subtitle, ctaPrimary, ctaSecondary } = LANDING.hero;
  return (
    <section className="relative overflow-hidden px-4">
      {/* Gradiente de niebla del fondo */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_70%_10%,rgb(167_169_235/0.18),transparent_60%),radial-gradient(60%_50%_at_15%_80%,rgb(90_171_255/0.10),transparent_60%)]"
      />
      <div className="mx-auto grid max-w-content gap-14 pb-24 pt-36 md:pt-44 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-10">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-moss">
            {eyebrow}
          </p>
          <h1 className="mt-5 font-serif text-5xl leading-[1.05] text-balance md:text-6xl lg:text-7xl">
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
