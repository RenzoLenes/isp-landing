"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The travelling pulse is now always mounted — never conditionally added or
 * removed based on `useReducedMotion()`. That hook returns `null` during
 * SSR and resolves the real answer synchronously on the client's first
 * render, so conditionally *mounting* the node (the earlier approach) made
 * the server's child list and the client's first-render child list disagree
 * whenever the device actually prefers reduced motion — a structural
 * hydration mismatch, which is worse than the plain attribute mismatches in
 * Hero.tsx/Reveal.tsx/ChatScene.tsx/DecisionChain.tsx (see their comments):
 * React throws hydration error #418 for it and discards the whole tree for
 * a full client remount. A deferred/mounted-flag fix (matching SSR on the
 * first client render, then correcting after mount) avoids that error, but
 * under real parallel load it isn't reliably faster than this test's
 * assertion, which runs immediately after `page.goto` — confirmed
 * empirically, see beam-hydration-report.md.
 *
 * `initial` stays a constant `{ opacity: 0 }` regardless of `reduceMotion`,
 * so server and client always agree on the node's starting (invisible)
 * style — no mismatch is possible there. `reduceMotion`'s raw, possibly-
 * server-differing value is only used to pick `animate`/`transition`,
 * neither of which is reflected in any SSR-rendered attribute (they're pure
 * JS configuration for a *future* tick), so using it there can't cause a
 * hydration mismatch either. When motion is reduced, `animate` matches
 * `initial` exactly, so nothing ever tweens and no `repeat: Infinity`
 * animation is ever created — the loop is fully off, not just hidden,
 * satisfying DESIGN.md §7's "apagan los loops por completo (no los
 * ralentizan)".
 */
export function SignalThread({
  orientation,
  className = "",
}: {
  orientation: "vertical" | "horizontal";
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const isVertical = orientation === "vertical";
  const travelAxis = isVertical ? "y" : "x";

  return (
    <div
      aria-hidden
      className={`relative ${isVertical ? "h-full w-px" : "h-px w-full"} ${className}`}
    >
      <div
        className={`absolute inset-0 border-signal ${
          isVertical ? "border-l border-dashed" : "border-t border-dashed"
        }`}
      />
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={
          reduceMotion
            ? { opacity: 0 }
            : { opacity: [0, 1, 1, 0], [travelAxis]: ["0%", "100%"] }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 2.4, repeat: Infinity, ease: "linear" }
        }
      >
        <span className="absolute -left-[3px] -top-[3px] block size-1.5 rounded-full bg-signal" />
      </motion.div>
    </div>
  );
}
