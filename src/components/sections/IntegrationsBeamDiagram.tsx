"use client";

import { createRef, useRef, useState, type RefObject } from "react";
import { AnimatedBeam } from "@/components/ui/AnimatedBeam";
import type { IntegrationSystem } from "@/content/landing";

/*
 * Ancho de la tarjeta de sistema, en px. Es UNA constante porque la usan dos
 * cosas que deben cuadrar: la clase de ancho de la tarjeta y el
 * desplazamiento del haz, que ancla en el CENTRO del nodo y necesita media
 * tarjeta para salir por su borde derecho. Estaban escritos por separado (una
 * clase `w-40` y un `80` suelto), así que al ensanchar la tarjeta los haces se
 * quedaron 24px cortos — lo detectó la prueba de integraciones, no la vista.
 */
const CARD_WIDTH = 208; // debe coincidir con la clase `w-52` de abajo
const HUB_SIZE = 112; // `lg:size-28`
import {
  SystemCard,
  HubNode,
  OutputNode,
  OUTPUT_WIDTH,
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
 * System cards keep a fixed width (`CARD_WIDTH`) — Animated
 * Beam still needs every beam to *start* at the same x, or the fan reads as
 * arbitrary rather than a deliberate convergence.
 */
export function IntegrationsBeamDiagram({
  systems,
  hub,
  hubRole,
  output,
  outputRole,
}: {
  systems: readonly IntegrationSystem[];
  hub: string;
  hubRole: string;
  output: string;
  outputRole: string;
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
      className="relative mx-auto mt-16 hidden max-w-4xl items-center justify-center gap-10 lg:flex xl:gap-14"
    >
      <div className="flex w-52 shrink-0 flex-col gap-3">
        {systems.map((system, index) => (
          <SystemCard
            key={system.name}
            system={system}
            className="w-52 shrink-0"
            ref={cardRefs[index]}
          />
        ))}
      </div>

      <HubNode label={hub} role={hubRole} ref={hubRef} />

      <OutputNode label={output} role={outputRole} ref={outputRef} />

      {systems.map((system, index) => (
        <AnimatedBeam
          key={system.name}
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
          // are a fixed `w-52` (208px, measured), so +104 moves the start to
          // the card's right edge; the hub is `lg:size-28` (112px,
          // measured), so -56 moves the end to its left edge.
          startXOffset={CARD_WIDTH / 2}
          endXOffset={-56}
        />
      ))}

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={hubRef}
        toRef={outputRef}
        duration={5.6}
        // Mismo anclaje al borde: del derecho del hub (+56, media de sus
        // 112px) al izquierdo del nodo de salida. Ambos desplazamientos se
        // derivan de una constante, no de una medición a mano.
        startXOffset={HUB_SIZE / 2}
        endXOffset={-OUTPUT_WIDTH / 2}
      />
    </div>
  );
}
