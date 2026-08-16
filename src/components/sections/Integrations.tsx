import type { ReactNode, Ref } from "react";
import { LANDING, type ConsoleIntegrationIcon, type IntegrationSystem } from "@/content/landing";
import { GantryMark } from "@/components/ui/GantryMark";
import {
  CodeIcon,
  HubIcon,
  RouterIcon,
  WavesIcon,
  WhatsAppIcon,
} from "@/components/ui/console-icons";

/*
 * El mismo vocabulario de glifos que usa la consola (vista Integraciones), a
 * propósito: son las dos caras de la misma promesa y deben hablar igual. NO
 * son los logotipos reales de MikroWisp, WiMovil ni WispHub — marcas de
 * terceros — sino un glifo que dice qué ES cada sistema.
 */
/*
 * Ancho del nodo de salida en escritorio, en px. Igual que `CARD_WIDTH` en el
 * diagrama: el haz ancla en el CENTRO del nodo, así que necesita la mitad para
 * salir por su borde. Antes el nodo era `lg:w-auto` y el desplazamiento un
 * `-82` medido a mano sobre ESA cadena de texto — cambiar el copy lo
 * desalineaba en silencio.
 */
export const OUTPUT_WIDTH = 224; // debe coincidir con la clase `lg:w-56`

const SYSTEM_ICONS: Record<ConsoleIntegrationIcon, ReactNode> = {
  router: <RouterIcon size={18} />,
  waves: <WavesIcon size={18} />,
  hub: <HubIcon size={18} />,
  chat: <WhatsAppIcon size={18} />,
  code: <CodeIcon size={18} />,
};
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
  system,
  className = "",
  ref,
}: {
  system: IntegrationSystem;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      data-integration-node
      className={`flex min-w-0 items-center gap-3 rounded-2xl border border-whisper bg-surface px-3.5 py-3 shadow-card ${className}`}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-sunk text-steel">
        {SYSTEM_ICONS[system.icon]}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-ink">{system.name}</span>
        <span className="block truncate text-[11.5px] text-steel">{system.role}</span>
      </span>
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
  role,
  ref,
}: {
  label: string;
  role: string;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div className="relative flex shrink-0 flex-col items-center">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-24 rounded-[1.75rem] bg-signal/40 blur-2xl lg:h-28"
      />
      {/* La marca de Gantry ES el nodo: antes era su nombre en texto, que en
          un diagrama de logotipos leía como el eslabón sin identidad. */}
      <div
        ref={ref}
        data-integration-hub
        className="flex size-24 flex-col items-center justify-center gap-1.5 rounded-[1.75rem] border border-signal/50 bg-surface text-ink shadow-float lg:size-28"
      >
        <GantryMark size={30} />
        <span className="text-sm font-semibold tracking-tight">{label}</span>
      </div>
      <span className="mt-2 max-w-[8rem] text-center text-[11.5px] leading-snug text-steel">
        {role}
      </span>
    </div>
  );
}

export function OutputNode({
  label,
  role,
  ref,
}: {
  label: string;
  role: string;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      data-integration-output
      className="flex w-full max-w-xs items-center gap-3 rounded-2xl border border-signal/35 bg-signal/10 px-3.5 py-3 shadow-card lg:w-56 lg:max-w-none"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-surface text-signal-deep">
        <WhatsAppIcon size={19} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-ink">{label}</span>
        <span className="block truncate text-[11.5px] text-steel">{role}</span>
      </span>
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
  const { hubRole, outputRole } = LANDING.integrations;

  return (
    <SectionRegister register="surface" className="px-4 py-[clamp(5rem,10vw,9rem)]">
      <div className="mx-auto max-w-content">
        <Reveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            body={body}
            align="split"
          />
        </Reveal>

        {/* Bajo `lg`: apilado vertical, misma dirección de flujo. */}
        <Reveal delay={0.15}>
          <ol className="mt-16 flex flex-col items-center gap-3 lg:hidden">
            {systems.map((system) => (
              <li key={system.name} className="w-full max-w-xs">
                <SystemCard system={system} />
              </li>
            ))}
            <li aria-hidden>
              <VerticalConnector color="bg-signal" />
            </li>
            <li>
              <HubNode label={hub} role={hubRole} />
            </li>
            <li aria-hidden>
              <VerticalConnector color="bg-signal" />
            </li>
            <li className="w-full max-w-xs">
              <OutputNode label={output} role={outputRole} />
            </li>
          </ol>
        </Reveal>

        {/* `lg` y más: convergencia horizontal — sistemas → Gantry → salida,
            ahora con Animated Beam (curvas animadas) en vez de los hilos
            punteados rectos. Ver IntegrationsBeamDiagram.tsx. */}
        <Reveal delay={0.15}>
          <IntegrationsBeamDiagram
            systems={systems}
            hub={hub}
            hubRole={hubRole}
            output={output}
            outputRole={outputRole}
          />
        </Reveal>

        <Reveal delay={0.3}>
          {/* Objection-handler: a tinted Señal accent gives the claim more
              weight than ordinary body copy, without borrowing the vocabulary
              of a live status indicator (no dot, no chip, no "activo"). */}
          <div className="mx-auto mt-14 max-w-xl rounded-2xl border border-signal/25 bg-signal/[0.07] px-6 py-5 text-center shadow-card">
            <p className="text-lg font-medium leading-relaxed text-ink md:text-xl">
              {trust}
            </p>
          </div>
        </Reveal>
      </div>
    </SectionRegister>
  );
}
