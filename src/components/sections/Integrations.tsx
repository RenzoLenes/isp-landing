import type { Ref } from "react";
import { LANDING } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SignalThread } from "@/components/ui/SignalThread";
import { SectionRegister } from "@/components/ui/SectionRegister";
import { IntegrationsBeamDiagram } from "@/components/sections/IntegrationsBeamDiagram";

// Nunca `w-full` aquí: en la fila de escritorio esta tarjeta es hermana flex del
// stub del hilo (`flex-1`, basis 0). `w-full` resolvería su flex-basis al 100% de
// la fila (vía basis:auto → width) y dejaría al stub sin espacio que reclamar —
// los cuatro hilos de convergencia colapsaban a 0px. Un ancho fijo sí es seguro:
// da una basis concreta y deja el resto al stub. `className` permite que la fila
// de escritorio imponga ese ancho uniforme sin afectar a la lista apilada de
// móvil, donde la tarjeta llena su `<li>` por flujo normal.
//
// Exported: the desktop diagram (`IntegrationsBeamDiagram`) needs the exact
// same card so the four beams start at a uniform x — see that file for why
// the uniform width still matters with Animated Beam.
export function SystemCard({
  name,
  className = "",
  ref,
}: {
  name: string;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      className={`min-w-0 rounded-2xl border border-whisper bg-surface px-4 py-3 text-sm font-medium text-ink shadow-card ${className}`}
    >
      {name}
    </div>
  );
}

/**
 * The convergence node — the section's visual climax, with a signal halo.
 *
 * Shape ruling (chunk C, spec Part 3): this was a circle under the old name.
 * "Nexo" means nexus/convergence point, so a circle — everything collapsing
 * to a single dot — was the literal shape of the word. Two earlier chunks flagged
 * that the shape stopped agreeing with the brand once it became "Gantry": a
 * gantry is a structural frame that things pass *through* and are carried
 * *by* (a crane's portal, a launch tower), not a point things collapse into.
 * A frame shape reads truer to that: squaring off the corners (a generous
 * `rounded-[1.75rem]`, not a hard right angle — this is still a calm,
 * editorial mark, not a technical diagram) turns the node into a portal the
 * four systems' threads run through on their way to the output, rather than
 * a point they converge into and vanish. Same size, same halo, same
 * position in the diagram — only the geometry changed.
 *
 * Exported (and `ref`-forwardable, React 19 style — no `forwardRef` needed):
 * `IntegrationsBeamDiagram` needs a measurable node to aim the four incoming
 * beams and the one outgoing beam at. The halo div is `absolute inset-0` and
 * out of flow, so the ref'd wrapper's rendered box is exactly the visible
 * bordered square — the halo doesn't inflate it.
 */
export function HubNode({
  label,
  ref,
}: {
  label: string;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div ref={ref} className="relative flex shrink-0 flex-col items-center">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 rounded-[1.75rem] bg-signal/40 blur-2xl"
      />
      <div className="flex size-24 items-center justify-center rounded-[1.75rem] border border-signal/50 bg-surface shadow-float lg:size-28">
        <span className="text-lg font-semibold text-ink">{label}</span>
      </div>
    </div>
  );
}

export function OutputNode({
  label,
  ref,
}: {
  label: string;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      className="flex w-full max-w-[12rem] items-center justify-center rounded-2xl border border-fiber/40 bg-fiber/15 px-4 py-3 text-center text-sm font-medium text-ink shadow-card lg:w-auto"
    >
      {label}
    </div>
  );
}

function VerticalConnector({ color }: { color: string }) {
  return (
    <div aria-hidden className="flex flex-col items-center gap-1.5">
      <span className={`size-1.5 shrink-0 rounded-full ${color}`} />
      <div className="h-8 w-px">
        <SignalThread orientation="vertical" />
      </div>
    </div>
  );
}

export function Integrations() {
  const { eyebrow, title, body, systems, hub, output, trust } =
    LANDING.integrations;

  return (
    <SectionRegister register="surface" className="px-4 py-[clamp(5rem,10vw,9rem)]">
      <div className="mx-auto max-w-content">
        <Reveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            body={body}
            align="center"
          />
        </Reveal>

        {/* Bajo `lg`: apilado vertical, misma dirección de flujo. */}
        <Reveal delay={0.15}>
          <ol className="mt-16 flex flex-col items-center gap-3 lg:hidden">
            {systems.map((system) => (
              <li key={system} className="w-full max-w-xs">
                <SystemCard name={system} />
              </li>
            ))}
            <li aria-hidden>
              <VerticalConnector color="bg-signal" />
            </li>
            <li>
              <HubNode label={hub} />
            </li>
            <li aria-hidden>
              <VerticalConnector color="bg-fiber" />
            </li>
            <li className="w-full max-w-xs">
              <OutputNode label={output} />
            </li>
          </ol>
        </Reveal>

        {/* `lg` y más: convergencia horizontal — sistemas → Gantry → salida,
            ahora con Animated Beam (curvas animadas) en vez de los hilos
            punteados rectos. Ver IntegrationsBeamDiagram.tsx. */}
        <Reveal delay={0.15}>
          <IntegrationsBeamDiagram systems={systems} hub={hub} output={output} />
        </Reveal>

        <Reveal delay={0.3}>
          {/* Objection-handler: a tinted fiber accent gives the claim more
              weight than ordinary body copy, without borrowing the vocabulary
              of a live status indicator (no dot, no chip, no "activo"). */}
          <div className="mx-auto mt-14 max-w-xl rounded-2xl border border-fiber/30 bg-fiber/10 px-6 py-5 text-center shadow-card">
            <p className="text-lg font-medium leading-relaxed text-ink md:text-xl">
              {trust}
            </p>
          </div>
        </Reveal>
      </div>
    </SectionRegister>
  );
}
