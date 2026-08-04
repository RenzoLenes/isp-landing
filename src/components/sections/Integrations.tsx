import { LANDING } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SignalThread } from "@/components/ui/SignalThread";

function SystemCard({ name }: { name: string }) {
  return (
    // No `w-full`: in the desktop row this is a flex sibling of the thread
    // stub (`flex-1`, basis 0). `w-full` would resolve this item's flex-basis
    // to 100% of the row (via flex-basis:auto → width), leaving zero leftover
    // space for the stub to grow into. Letting flex own the sizing here gives
    // this card a content-based basis, so the thread claims the remainder.
    // `min-w-0` guards against a future long system name forcing overflow
    // instead of shrinking. In the `<lg` stacked list the parent `<li>` is a
    // plain block box, so this div still fills it via normal block sizing.
    <div className="min-w-0 rounded-2xl border border-whisper bg-surface px-4 py-3 text-sm font-medium text-ink shadow-card">
      {name}
    </div>
  );
}

/** El nodo de convergencia — el clímax visual de la sección, con halo lavanda. */
function HubNode({ label }: { label: string }) {
  return (
    <div className="relative flex shrink-0 flex-col items-center">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 rounded-full bg-lavender/40 blur-2xl"
      />
      <div className="flex size-24 items-center justify-center rounded-full border border-lavender/50 bg-surface shadow-float lg:size-28">
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

        {/* `lg` y más: convergencia horizontal — sistemas → Nexo → salida. */}
        <Reveal delay={0.15}>
          <div className="mt-16 hidden items-center lg:flex">
            <div className="flex w-64 shrink-0 flex-col gap-3">
              {systems.map((system) => (
                <div key={system} className="flex items-center gap-3">
                  <SystemCard name={system} />
                  <div className="h-px w-6 flex-1">
                    <SignalThread orientation="horizontal" />
                  </div>
                </div>
              ))}
            </div>

            <div aria-hidden className="h-40 w-px shrink-0">
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
