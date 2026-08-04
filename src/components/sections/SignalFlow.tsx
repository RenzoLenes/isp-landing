import { LANDING } from "@/content/landing";
import type { ArtifactRow, FlowStep } from "@/content/landing";
import { ChatBubble } from "@/components/ui/ChatBubble";
import { DataCard } from "@/components/ui/DataCard";
import { SignalThread } from "@/components/ui/SignalThread";

/**
 * Ancho de columna por tipo de artefacto en el breakpoint de fila (`xl`).
 * Ver la aritmética de contenedor en el informe del chunk — la fila solo
 * arranca en `xl` porque a `lg` el margen sobrante para los conectores es
 * de apenas ~48px.
 */
const COLUMN_WIDTH: Record<FlowStep["kind"], string> = {
  mensaje: "xl:w-44",
  consulta: "xl:w-52",
  decision: "xl:w-44",
  resultado: "xl:w-44",
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
  return <DataCard title={system} rows={rows} className="w-full" />;
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
      className="flex shrink-0 flex-col items-center gap-1.5 py-1 xl:min-w-8 xl:flex-1 xl:flex-row xl:justify-center xl:gap-2 xl:py-0"
    >
      <span className={`size-1.5 shrink-0 rounded-full ${color}`} />
      <div className="h-8 w-px xl:hidden">
        <SignalThread orientation="vertical" />
      </div>
      <div className="hidden h-px w-full xl:block">
        <SignalThread orientation="horizontal" />
      </div>
    </div>
  );
}

export function SignalFlow() {
  const { steps } = LANDING.flow;
  return (
    <ol className="mt-16 flex flex-col items-center gap-2 xl:flex-row xl:items-start xl:gap-0">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className={`flex w-full flex-col items-center text-center xl:flex-row xl:items-start xl:text-left ${
            i < steps.length - 1 ? "xl:flex-1" : "xl:flex-none"
          }`}
        >
          <div
            className={`flex w-full max-w-xs flex-col items-center text-center xl:max-w-none xl:items-start xl:text-left ${COLUMN_WIDTH[step.kind]}`}
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
