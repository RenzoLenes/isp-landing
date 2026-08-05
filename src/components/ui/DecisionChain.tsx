"use client";

import { motion, useReducedMotion } from "motion/react";
import { StatusChip } from "@/components/ui/StatusChip";

// `initial` below is a plain, unconditional object — deliberately NOT gated
// on `useReducedMotion()`. See Hero.tsx's `Beat` for the full rationale:
// gating it made server/client disagree (hydration error #418) whenever the
// device actually prefers reduced motion. "Already settled" under reduced
// motion is enforced by the `data-motion-settle` CSS rule in globals.css
// instead. `reduceMotion` is still used below for `transition.delay` only —
// that's safe: a transition's delay isn't reflected in any SSR-rendered DOM
// attribute, so gating *it* on the hook can't cause a markup mismatch, and
// dropping the stagger for reduced-motion users avoids pointless queued
// animation work even though the CSS backstop already keeps them settled.
export function DecisionChain({
  checks,
  outcome,
  density = "comfortable",
  className = "",
}: {
  checks: readonly { question: string; answer: string }[];
  outcome: string;
  /**
   * `"comfortable"` (default) is the full `p-6` chrome used by the pillars
   * section. `"compact"` trims it for the product console's narrow context
   * column, same rationale as `DataCard`'s density prop.
   */
  density?: "comfortable" | "compact";
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const isCompact = density === "compact";

  return (
    <div
      className={`rounded-3xl border border-whisper bg-surface shadow-card ${isCompact ? "p-4" : "p-6"} ${className}`}
    >
      <ul className="flex flex-col">
        {checks.map((check, index) => (
          <motion.li
            key={check.question}
            data-motion-settle
            className={`flex items-center justify-between gap-4 border-t border-whisper first:pt-0 ${isCompact ? "py-2" : "py-2.5"}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: reduceMotion ? 0 : index * 0.12,
            }}
          >
            <span className="text-sm text-ink">{check.question}</span>
            <StatusChip label={check.answer} tone="neutral" />
          </motion.li>
        ))}
      </ul>

      <div
        className={`flex items-center gap-2.5 border-t border-whisper ${isCompact ? "mt-1 pt-3" : "mt-2 pt-4"}`}
      >
        <span aria-hidden className="size-2 shrink-0 rounded-full bg-signal" />
        <span aria-hidden className="text-moss">
          →
        </span>
        <p className="text-sm font-medium text-ink">{outcome}</p>
      </div>
    </div>
  );
}
