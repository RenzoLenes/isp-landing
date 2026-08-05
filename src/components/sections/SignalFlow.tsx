import { LANDING } from "@/content/landing";
import type { ArtifactRow, FlowStep } from "@/content/landing";
import { ChatBubble } from "@/components/ui/ChatBubble";
import { DataCard } from "@/components/ui/DataCard";
import { SignalThread } from "@/components/ui/SignalThread";

/**
 * Ancho de columna por tipo de artefacto, por breakpoint de fila.
 *
 * Aritmética de contenedor (ver informe de la ola final de fixes): el ancho
 * útil es `min(viewport − 32, 1220) − 112`. A `lg` (1024px) eso da 880px; a
 * `xl` (1280px) y por encima, el clamp de 1220 ya está activo, así que el
 * ancho útil es constante en 1108px.
 *
 * El contenido mínimo de la fila es la suma de los cuatro anchos de columna
 * más 3 × 32px de piso de conector (`min-w-8` en `StepConnector`):
 *
 *   breakpoint │ mensaje │ consulta │ decisión │ resultado │ contenido │ conectores │ útil │ margen
 *   lg         │ 160     │ 192      │ 160      │ 160       │ 672       │ 96         │ 880  │ 112
 *   xl         │ 224     │ 256      │ 224      │ 224       │ 928       │ 96         │ 1108 │ 84
 *
 * `consulta` reutiliza `DataCard` en `density="compact"` (`p-4`, 32px de
 * chroma horizontal en vez de los 48px de `p-6`) — por eso su columna es
 * siempre 32px más ancha que las otras tres (que llevan su propio chroma
 * interno): 160/192 a `lg`, 224/256 a `xl`. Esa relación (consulta = resto +
 * 32) se mantiene al escalar, así que el área de contenido real es
 * equivalente entre las cuatro columnas en ambos breakpoints.
 *
 * A `xl` sobraban 340px (1108 − 672) con los anchos de `lg` sin cambios —
 * eso partía la copia en líneas de tres palabras. Se escalaron los cuatro
 * anchos hasta dejar 84px de margen a `xl`, suficiente para nunca cortar y
 * para que el texto respire.
 */
const COLUMN_WIDTH: Record<FlowStep["kind"], string> = {
  mensaje: "lg:w-40 xl:w-56",
  consulta: "lg:w-48 xl:w-64",
  decision: "lg:w-40 xl:w-56",
  resultado: "lg:w-40 xl:w-56",
};

/** Color del nodo en cada conector, según la categoría de la tríada a la que se entra. */
const JUNCTION_COLOR = ["bg-signal", "bg-signal", "bg-fiber"] as const;

/**
 * Banda vertical uniforme para los cuatro artefactos, sólo en el breakpoint
 * de fila (`lg` y por encima). Los artefactos tienen alturas intrínsecas muy
 * distintas (burbuja de chat de 4 líneas, `DataCard` de 2 filas, regla de
 * decisión de 3 líneas, chip de resultado de 2 líneas); sin una banda común,
 * cada `<h3>` arranca a una altura distinta (escalera) y el conector —
 * anclado al tope de la fila por `lg:items-start` — queda flotando por
 * encima del centro real de los artefactos en vez de atravesarlos.
 *
 * Altura medida (build de producción, Chromium, `reducedMotion: reduce`):
 * el artefacto más alto es la burbuja de "mensaje" a `lg` (columna de
 * 160px, texto envuelve a 4 líneas) con 161.8px. A `xl` las columnas son
 * más anchas y el más alto pasa a ser el `DataCard` de "consulta" con
 * 124px — siempre por debajo del máximo de `lg`. `lg:h-44` (176px) cubre
 * el caso más alto medido con ~14px de aire (161.8 → 176).
 *
 * Se usa en dos lugares: como altura del contenedor que centra cada
 * artefacto (`items-center` centra verticalmente dentro de la banda) y como
 * altura del `StepConnector`, para que su centro vertical —ya centrado por
 * `items-center`— coincida exactamente con el centro de la banda sin
 * necesidad de un offset manual. Si la copia crece, este es el único valor
 * a ajustar.
 */
const ARTIFACT_BAND = "lg:h-44";

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
        <span aria-hidden className="size-2 shrink-0 rounded-full bg-signal" />
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
      className={`flex shrink-0 flex-col items-center gap-1.5 py-1 lg:min-w-8 lg:flex-1 lg:flex-row lg:justify-center lg:gap-2 lg:py-0 ${ARTIFACT_BAND}`}
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
            <div className={`flex w-full items-center ${ARTIFACT_BAND}`}>
              <FlowStepArtifact step={step} />
            </div>
            <h3 className="mt-4 font-medium text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-moss">{step.body}</p>
          </div>
          {i < steps.length - 1 ? <StepConnector color={JUNCTION_COLOR[i]} /> : null}
        </li>
      ))}
    </ol>
  );
}
