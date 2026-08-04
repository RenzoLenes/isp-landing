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
            {/* Darkened from `text-moss` toward `ink` (chunk C, spec Part
                1a): the gradient field got substantially stronger, and
                `moss` on `fog` only starts at 4.75:1 — too little headroom
                once the field intensified. `ink/75` keeps this visually
                secondary to the full-`ink` headline while giving real
                margin. Measured ratios are in chunk-c-report.md. */}
            <span className="inline-flex items-center rounded-full border border-whisper bg-surface/80 px-4 py-1.5 text-xs font-medium text-ink/75 shadow-card backdrop-blur-md">
              {badge}
            </span>
          </Beat>

          {/* No explicit `max-w` here — the headline fills the parent's
              1220px content column (see below) rather than a narrower
              sub-cap, which matters for where it naturally breaks: at the
              chosen font-size ceiling (5.25rem/84px), "empieza con una
              conversación" (the longest of the title's natural word-groups)
              needs the full 1220px to land on one line — see
              chunk-c-report.md for the word-measurement arithmetic.

              Deliberately NOT `text-balance` here (unlike the subtitle
              below): balance re-flows to equalise visual line width and, on
              this exact title, that pulled "tranquila" onto line two and
              split the adjectival phrase "más tranquila" across the break —
              a mid-thought break the spec explicitly asks to avoid. Plain
              greedy wrapping keeps "Una operación más tranquila" together
              on line one (verified against the title's actual measured word
              widths — see the report) and reads as three clean phrases. */}
          <Beat delay={0.12} className="mt-6">
            <h1 className="font-display text-[clamp(2.75rem,1.9rem+4.4vw,5.25rem)] leading-[1.02] tracking-tight text-ink">
              {title}
            </h1>
          </Beat>

          <Beat delay={0.24} className="mt-6 max-w-[640px]">
            {/* Same `moss` → `ink/70` move as the badge above, one notch
                lighter since body-size text has a lower AA floor to clear
                but sits in the same field. */}
            <p className="text-balance text-lg leading-relaxed text-ink/70 md:text-xl">
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
