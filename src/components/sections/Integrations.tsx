import { LANDING } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SignalThread } from "@/components/ui/SignalThread";

// Nunca `w-full` aquí: en la fila de escritorio esta tarjeta es hermana flex del
// stub del hilo (`flex-1`, basis 0). `w-full` resolvería su flex-basis al 100% de
// la fila (vía basis:auto → width) y dejaría al stub sin espacio que reclamar —
// los cuatro hilos de convergencia colapsaban a 0px. Un ancho fijo sí es seguro:
// da una basis concreta y deja el resto al stub. `className` permite que la fila
// de escritorio imponga ese ancho uniforme sin afectar a la lista apilada de
// móvil, donde la tarjeta llena su `<li>` por flujo normal.
function SystemCard({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <div
      className={`min-w-0 rounded-2xl border border-whisper bg-surface px-4 py-3 text-sm font-medium text-ink shadow-card ${className}`}
    >
      {name}
    </div>
  );
}

/**
 * The convergence node — the section's visual climax, with a lavender halo.
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
 */
function HubNode({ label }: { label: string }) {
  return (
    <div className="relative flex shrink-0 flex-col items-center">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 rounded-[1.75rem] bg-lavender/40 blur-2xl"
      />
      <div className="flex size-24 items-center justify-center rounded-[1.75rem] border border-lavender/50 bg-surface shadow-float lg:size-28">
        <span className="text-lg font-semibold text-ink">{label}</span>
      </div>
    </div>
  );
}

function OutputNode({ label }: { label: string }) {
  return (
    <div className="flex w-full max-w-[12rem] items-center justify-center rounded-2xl border border-fiber/40 bg-fiber/15 px-4 py-3 text-center text-sm font-medium text-ink shadow-card lg:w-auto">
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
    <section className="px-4 py-[clamp(5rem,10vw,9rem)]">
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
              <VerticalConnector color="bg-lavender" />
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

        {/* `lg` y más: convergencia horizontal — sistemas → Gantry → salida. */}
        <Reveal delay={0.15}>
          <div className="mt-16 hidden items-center justify-center lg:flex">
            <div className="flex w-64 shrink-0 flex-col gap-3">
              {systems.map((system) => (
                <div key={system} className="flex items-center gap-3">
                  {/* Ancho uniforme: sin él las tarjetas se dimensionan por
                      contenido y los cuatro hilos arrancan en x distintos, con
                      lo que la convergencia se lee desordenada. */}
                  <SystemCard name={system} className="w-40 shrink-0" />
                  <div className="h-px w-6 flex-1">
                    <SignalThread orientation="horizontal" />
                  </div>
                </div>
              ))}
            </div>

            {/*
              Trunk height, derived (not guessed) from the systems column's
              actual box model, so the top/bottom stubs land exactly on the
              outer cards' centres instead of overshooting past the visible
              line:
                - SystemCard: text-sm → 20px line-height, py-3 → 12px+12px
                  padding, border → 1px+1px. Height = 20+24+2 = 46px.
                - 4 cards, gap-3 (12px) between them, 3 gaps.
                - Column height = 4×46 + 3×12 = 220px.
                - First card centre = 46/2 = 23px from column top.
                - Last card centre  = 220 - 23 = 197px from column top.
                - Outer-centre-to-outer-centre span = 197 - 23 = 174px.
              The trunk is centred (via `items-center`) inside a 220px-tall
              row, so a 174px trunk sits at 23px..197px — exactly matching
              the two stub y-positions above. h-44 (176px) is the nearest
              step in the default scale but leaves a 1px gap each side, so
              this uses the exact value instead.
            */}
            <div aria-hidden className="h-[174px] w-px shrink-0">
              <SignalThread orientation="vertical" />
            </div>

            <div className="h-px w-12 shrink-0 xl:w-16">
              <SignalThread orientation="horizontal" />
            </div>

            <HubNode label={hub} />

            <div className="h-px w-12 shrink-0 xl:w-16">
              <SignalThread orientation="horizontal" />
            </div>

            <OutputNode label={output} />
          </div>
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
    </section>
  );
}
