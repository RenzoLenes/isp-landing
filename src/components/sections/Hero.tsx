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
            <span className="inline-flex items-center rounded-full border border-whisper bg-surface/70 px-4 py-1.5 text-xs font-medium text-moss shadow-card backdrop-blur-md">
              {badge}
            </span>
          </Beat>

          <Beat delay={0.12} className="mt-6 max-w-[900px]">
            <h1 className="text-balance font-display text-[clamp(2.75rem,2rem+3.2vw,4.75rem)] leading-[1.03] tracking-tight text-ink">
              {title}
            </h1>
          </Beat>

          <Beat delay={0.24} className="mt-6 max-w-[640px]">
            <p className="text-balance text-lg leading-relaxed text-moss md:text-xl">
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

        <Beat delay={0.5} className="w-full">
          <ProductConsole />
        </Beat>
      </div>
    </section>
  );
}
