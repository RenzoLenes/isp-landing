"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { LANDING } from "@/content/landing";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ProductConsole } from "@/components/sections/ProductConsole";

/** One step of the hero's staggered entrance: badge → headline → subtitle →
 * CTAs → console. `transform`/`opacity` only, springs at ~100/20 per
 * DESIGN.md §7, fully off under `prefers-reduced-motion` (content renders
 * settled — `initial={false}`, no fallback animation). */
function Beat({
  children,
  delay,
  className = "",
}: {
  children: ReactNode;
  delay: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const { badge, title, subtitle, ctaPrimary, ctaSecondary } = LANDING.hero;
  return (
    <section className="relative overflow-hidden px-4 pb-8 pt-36 md:pt-44">
      {/* The section's own local fog gradient is gone — `GradientField`
          (mounted once in `layout.tsx`, behind the whole page shell) is now
          the single atmospheric background. Keeping both would stack their
          tints right where the hero copy sits and blow the contrast budget
          (verified empirically — see chunk-a-report.md). */}
      <div className="mx-auto flex max-w-content flex-col items-center gap-14">
        <div className="flex flex-col items-center text-center">
          <Beat delay={0}>
            {/* Darkened from `text-moss` toward `ink` (chunk C), then again
                from `ink/75` to `ink/85` in this fix round: the field got
                substantially stronger again (hero-fixes-report.md, Fix 3),
                and `ink/75` no longer cleared 4.5:1 with margin at the
                field's most intense sampled point. `ink/85` keeps this
                visually secondary to the full-`ink` headline while holding
                real headroom. Measured ratios are in hero-fixes-report.md. */}
            <span className="inline-flex items-center rounded-full border border-whisper bg-surface/80 px-4 py-1.5 text-xs font-medium text-ink/85 shadow-card backdrop-blur-md">
              {badge}
            </span>
          </Beat>

          {/* Hero fix round (2026-08-04, gantry-realineamiento): new,
              shorter headline — "WhatsApp con el contexto real de cada
              cliente." — replaces the four-line prose sentence. A `max-w`
              is now needed (the old headline never fit on one line at any
              tested width, so it never needed one): at this font-size
              ceiling this exact string is short enough to sit on a single
              line from ~900px up unless constrained, which reads as a flat
              banner rather than the two-line "WhatsApp con el contexto
              real / de cada cliente." break the references show. The
              max-w below was tuned empirically (rendered and measured, not
              hand-calculated — see hero-fixes-report.md) so the break
              lands on that phrase boundary at every tested width down to
              320px, never mid-phrase.

              Deliberately NOT `text-balance` here (unlike the subtitle
              below): balance re-flows to equalise visual line width, which
              on a two-word second line ("de cada cliente.") can pull an
              extra word up to even out the lines — greedy wrapping is what
              keeps the break exactly on the phrase boundary. */}
          <Beat delay={0.12} className="mt-6 max-w-[1160px]">
            <h1 className="font-display text-[clamp(2.25rem,1.55rem+4.4vw,5.25rem)] font-bold leading-[1.02] tracking-tighter text-ink md:text-[3.25rem] lg:text-[clamp(2.25rem,1.55rem+4.4vw,5.25rem)]">
              {title}
            </h1>
          </Beat>

          <Beat delay={0.24} className="mt-6 max-w-[640px]">
            {/* Same `ink/85` move as the badge above (was `ink/70`): the
                strengthened field (Fix 3) left this short by itself under
                the darkest overlap band. */}
            <p className="text-balance text-lg leading-relaxed text-ink/85 md:text-xl">
              {subtitle}
            </p>
          </Beat>

          <Beat delay={0.36} className="mt-9">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href={ctaPrimary.href} variant="ink">
                {ctaPrimary.label}
              </ButtonLink>
              <ButtonLink href={ctaSecondary.href} variant="ghost">
                {ctaSecondary.label}
              </ButtonLink>
            </div>
          </Beat>
        </div>
      </div>

      {/* The console deliberately breaks out of the 1220px text container
          (spec Part 1c / DESIGN.md §6 note): it gets its own, much wider
          cap so it reads as a dominant product shot rather than an
          illustration sitting inside the reading column. `max-w-[1600px]`
          is a formality for ultra-wide viewports only — at every width this
          page actually tests (≤1440px) the section's own padding is the
          real limit, well under that cap. See chunk-c-report.md for the
          container arithmetic. */}
      <Beat delay={0.5} className="mx-auto mt-14 w-full max-w-[1600px]">
        <ProductConsole />
      </Beat>
    </section>
  );
}
