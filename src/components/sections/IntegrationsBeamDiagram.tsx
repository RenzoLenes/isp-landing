"use client";

import { createRef, useRef, useState, type RefObject } from "react";
import { AnimatedBeam } from "@/components/ui/AnimatedBeam";
import {
  SystemCard,
  HubNode,
  OutputNode,
} from "@/components/sections/Integrations";

// One curvature per system card, top to bottom, tuned for a 4-card column
// converging on a single, vertically-centred hub: the top and bottom cards
// bow more (their straight-line path to the hub is already the steepest),
// the two middle cards bow less, so the four beams read as a fan closing
// into one point rather than four parallel diagonals. Sign convention is
// the source's: `controlY = startY - curvature`, so a positive curvature
// pulls the control point *up* (above the straight line's midpoint) — top
// cards (which need to bow downward, toward the hub below them) get a
// negative value, bottom cards (bowing upward) get a positive one.
const CARD_BEAM_CURVATURES = [-64, -22, 22, 64];

/**
 * The desktop (`lg:` and up) convergence diagram — four system cards feeding
 * into the hub, then the hub feeding the single output — rebuilt on
 * Animated Beam (see `@/components/ui/AnimatedBeam`) in place of the
 * straight dashed `SignalThread` connectors + a vertical trunk.
 *
 * The trunk is gone, not kept: with four curved beams already converging
 * visually on the hub, a straight vertical spine running behind them read
 * as redundant clutter rather than reinforcing the convergence — the beams
 * themselves now do that job.
 *
 * `containerRef` sits on this outer row so Animated Beam can measure every
 * card, the hub, and the output in one shared coordinate space (its SVG
 * overlay is `position: absolute` off `position: relative` on this row).
 * System cards keep the fixed `w-40` width from the old design — Animated
 * Beam still needs every beam to *start* at the same x, or the fan reads as
 * arbitrary rather than a deliberate convergence.
 */
export function IntegrationsBeamDiagram({
  systems,
  hub,
  output,
}: {
  systems: readonly string[];
  hub: string;
  output: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Stable per-card ref objects, created once (lazy `useState` initialiser,
  // not a ref mutated during render — `react-hooks/refs` forbids reading or
  // writing a ref's `.current` during render, even for one-time lazy init)
  // so AnimatedBeam's effect dependency array doesn't churn every render.
  const [cardRefs] = useState<RefObject<HTMLDivElement | null>[]>(() =>
    systems.map(() => createRef<HTMLDivElement>()),
  );

  return (
    <div
      ref={containerRef}
      className="relative mt-16 hidden items-center justify-center gap-14 lg:flex xl:gap-20"
    >
      <div className="flex w-64 shrink-0 flex-col gap-3">
        {systems.map((system, index) => (
          <SystemCard
            key={system}
            name={system}
            className="w-40 shrink-0"
            ref={cardRefs[index]}
          />
        ))}
      </div>

      <HubNode label={hub} ref={hubRef} />

      <OutputNode label={output} ref={outputRef} />

      {systems.map((system, index) => (
        <AnimatedBeam
          key={system}
          containerRef={containerRef}
          fromRef={cardRefs[index]}
          toRef={hubRef}
          curvature={CARD_BEAM_CURVATURES[index] ?? 0}
          duration={5 + index * 0.6}
          delay={index * 0.15}
          // AnimatedBeam anchors at the *centre* of `fromRef`/`toRef` by
          // default, which drew each line straight through the middle of
          // the card's label and the hub's "Gantry" text (confirmed by
          // rendering and looking — see beam-hydration-report.md). Cards
          // are a fixed `w-40` (160px, measured), so +80 moves the start to
          // the card's right edge; the hub is `lg:size-28` (112px,
          // measured), so -56 moves the end to its left edge.
          startXOffset={80}
          endXOffset={-56}
        />
      ))}

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={hubRef}
        toRef={outputRef}
        duration={5.6}
        // Same edge-anchoring as above: hub right edge (+56, half of its
        // measured 112px) to the output pill's left edge (-82, half of its
        // measured ~165px — it's `lg:w-auto`, sized by its copy, so this is
        // this specific string's measured width, not a fixed constant).
        startXOffset={56}
        endXOffset={-82}
      />
    </div>
  );
}
