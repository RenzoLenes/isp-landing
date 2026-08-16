"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * `initial` is a plain, unconditional object — deliberately NOT gated on
 * `useReducedMotion()`. See Hero.tsx's `Beat` for the full rationale:
 * gating `initial` on that hook made the server's HTML and the client's
 * first render disagree whenever the device actually prefers reduced
 * motion (confirmed as React hydration error #418, not intermittent, in a
 * production build), and — separately, verified empirically — deferring
 * the hook's result with a mounted flag let the entrance animation
 * actually play once for reduced-motion users, since `initial` is only
 * ever consulted at real mount time. "Already settled, no animating in"
 * under reduced motion is instead enforced by the `data-motion-settle` CSS
 * rule in globals.css, which the browser applies from first paint
 * (including the pre-hydration paint) and which overrides whatever inline
 * style the animation writes.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      data-motion-settle
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay }}
    >
      {children}
    </motion.div>
  );
}
