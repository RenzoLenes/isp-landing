import { LANDING } from "@/content/landing";
import type { ArtifactRow, FlowStep } from "@/content/landing";
import { ChatBubble } from "@/components/ui/ChatBubble";
import { DataCard } from "@/components/ui/DataCard";
import { SignalThread } from "@/components/ui/SignalThread";

/**
 * Ancho de columna por tipo de artefacto en el breakpoint de fila (`lg`).
 *
 * Aritmética de contenedor (ver informe de la ola final de fixes): el ancho
 * útil es `min(viewport − 32, 1220) − 112`. A `lg` (1024px) eso da 880px.
 * El contenido mínimo de la fila es la suma de estos cuatro anchos más
 * 3 × 32px de piso de conector (`min-w-8` en `StepConnector`):
 *   160 (mensaje) + 192 (consulta) + 160 (decision) + 160 (resultado)
 *   = 672px, + 96px de conectores = 768px.
 * Margen a `lg`: 880 − 768 = 112px. Margen a `xl` (1108px útiles): 340px.
 *
 * `consulta` reutiliza `DataCard` en `density="compact"` (`p-4`, 32px de
 * chroma horizontal en vez de los 48px de `p-6`) — por eso su columna baja de
 * 208px a 192px sin perder área de contenido: 208 − 48 = 160px de contenido
 * con el chroma viejo, y 192 − 32 = 160px de contenido con el nuevo. El resto
 * de columnas se angostó en la misma proporción para liberar el margen que
 * antes forzaba el corte a `xl`.
 */
const COLUMN_WIDTH: Record<FlowStep["kind"], string> = {
  mensaje: "lg:w-40",
  consulta: "lg:w-48",
  decision: "lg:w-40",
  resultado: "lg:w-40",
};

/** Color del nodo en cada conector, según la categoría de la tríada a la que se entra. */
const JUNCTION_COLOR = ["bg-blue", "bg-blue", "bg-fiber"] as const;

function StepMessage({ line }: { line: string }) {
  return (
    <div className="w-full rounded-2xl border border-whisper bg-surface/80 p-3 shadow-float backdrop-blur-md">
      <ChatBubble from="cliente">{line}</ChatBubble>
    </div>
  );
}

function StepQuery({
  system,
  rows,
}: {
  system: string;
  rows: readonly ArtifactRow[];
}) {
  return (
    <DataCard title={system} rows={rows} density="compact" className="w-full" />
  );
}

function StepDecision({
  condition,
  outcome,
}: {
  condition: string;
  outcome: string;
}) {
  return (
    <div className="w-full rounded-3xl border border-whisper bg-surface p-4 shadow-card">
      <p className="text-xs text-moss">{condition}</p>
      <div className="mt-2.5 flex items-center gap-2 border-t border-whisper pt-2.5">
        <span aria-hidden className="size-2 shrink-0 rounded-full bg-blue" />
        <span aria-hidden className="text-moss">
          →
        </span>
        <p className="text-sm font-medium text-ink">{outcome}</p>
      </div>
    </div>
  );
}

function StepResult({ result }: { result: string }) {
  return (
    <div className="w-full rounded-2xl border border-fiber/40 bg-fiber/15 px-4 py-3">
      <div className="flex items-center gap-2.5">
        <span aria-hidden className="size-2 shrink-0 rounded-full bg-fiber" />
        <p className="text-sm font-medium text-ink [font-variant-numeric:tabular-nums]">
          {result}
        </p>
      </div>
    </div>
  );
}

/** Narrows `FlowStep` on `kind` and renders the matching artifact. */
function FlowStepArtifact({ step }: { step: FlowStep }) {
  switch (step.kind) {
    case "mensaje":
      return <StepMessage line={step.line} />;
    case "consulta":
      return <StepQuery system={step.system} rows={step.rows} />;
    case "decision":
      return <StepDecision condition={step.condition} outcome={step.outcome} />;
    case "resultado":
      return <StepResult result={step.result} />;
    default: {
      const exhaustive: never = step;
      return exhaustive;
    }
  }
}

/** Segmento del hilo de señal entre dos pasos: vertical al apilar, horizontal en fila. */
function StepConnector({ color }: { color: string }) {
  return (
    <div
      aria-hidden
      className="flex shrink-0 flex-col items-center gap-1.5 py-1 lg:min-w-8 lg:flex-1 lg:flex-row lg:justify-center lg:gap-2 lg:py-0"
    >
      <span className={`size-1.5 shrink-0 rounded-full ${color}`} />
      <div className="h-8 w-px lg:hidden">
        <SignalThread orientation="vertical" />
      </div>
      <div className="hidden h-px w-full lg:block">
        <SignalThread orientation="horizontal" />
      </div>
    </div>
  );
}

export function SignalFlow() {
  const { steps } = LANDING.flow;
  return (
    <ol className="mt-16 flex flex-col items-center gap-2 lg:flex-row lg:items-start lg:gap-0">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className={`flex w-full flex-col items-center text-center lg:flex-row lg:items-start lg:text-left ${
            i < steps.length - 1 ? "lg:flex-1" : "lg:flex-none"
          }`}
        >
          <div
            className={`flex w-full max-w-xs flex-col items-center text-center lg:max-w-none lg:items-start lg:text-left ${COLUMN_WIDTH[step.kind]}`}
          >
            <FlowStepArtifact step={step} />
            <h3 className="mt-4 font-medium text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-moss">{step.body}</p>
          </div>
          {i < steps.length - 1 ? <StepConnector color={JUNCTION_COLOR[i]} /> : null}
        </li>
      ))}
    </ol>
  );
}
