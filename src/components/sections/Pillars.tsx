import type { ReactNode } from "react";
import { LANDING } from "@/content/landing";
import type { PillarArtifact } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { StatusChip } from "@/components/ui/StatusChip";
import { SectionRegister } from "@/components/ui/SectionRegister";
import { BranchIcon, CheckIcon, TicketIcon, UserIcon } from "@/components/ui/console-icons";

/*
 * Rejilla de tres tarjetas, adaptada de la referencia Qipeline: cada una es
 * texto arriba y, abajo, una **miniatura de UI real** sobre un lavado de
 * color, no un icono decorativo. Sustituye al zigzag de artefactos grandes,
 * que ocupaba tres pantallas para decir tres cosas.
 *
 * Nota de sistema: la guía general desaconseja «tres tarjetas iguales en
 * fila», y con razón — suele ser el relleno por defecto de cualquier landing.
 * Aquí se acepta como excepción deliberada porque las tarjetas NO son iguales:
 * cada una lleva dentro un artefacto distinto (ficha, cadena de decisión,
 * ticket) que es la prueba de lo que el texto afirma. Lo que la guía prohíbe
 * es la fila de tres cajas con un icono y un párrafo; esto no lo es.
 *
 * El lavado de color sale SIEMPRE de Señal (§3, un solo acento). La referencia
 * usa azul, morado y verde; aquí varía la intensidad, no el matiz — tres
 * matices distintos habrían roto la regla de un acento por tres sitios a la vez.
 */

const WASH = [
  "from-signal/[0.14] to-signal/[0.02]",
  "from-signal/[0.20] to-signal/[0.03]",
  "from-signal/[0.11] to-signal/[0.02]",
] as const;

/** Fila de dato en miniatura: la unidad de todos los artefactos de abajo. */
function MiniRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-t border-whisper px-3 py-1.5 text-[11.5px] first:border-t-0">
      <span className="truncate text-steel">{label}</span>
      <span className={`shrink-0 ${strong ? "font-medium text-ink" : "text-ink"}`}>{value}</span>
    </div>
  );
}

function MiniCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[12px] border border-whisper bg-surface shadow-[0_6px_16px_-8px_rgba(19,29,42,0.25)]">
      {children}
    </div>
  );
}

/** La miniatura que corresponde a cada pilar; es la prueba de lo que afirma. */
function PillarArtifactMini({ artifact }: { artifact: PillarArtifact }) {
  switch (artifact.kind) {
    case "ficha":
      return (
        <MiniCard>
          <div className="flex items-center justify-between gap-2 px-3 py-2">
            <span className="flex items-center gap-1.5 text-[12px] font-medium text-ink">
              <UserIcon size={13} className="text-steel" />
              {artifact.title}
            </span>
            <StatusChip label={artifact.status} tone="ok" />
          </div>
          <div className="border-t border-whisper">
            {artifact.rows.slice(0, 3).map((row) => (
              <MiniRow key={row.label} label={row.label} value={row.value} strong />
            ))}
          </div>
        </MiniCard>
      );

    case "decision":
      return (
        <MiniCard>
          {artifact.checks.slice(0, 3).map((check) => (
            <MiniRow key={check.question} label={check.question} value={check.answer} strong />
          ))}
          <p className="flex items-center gap-1.5 border-t border-whisper px-3 py-2 text-[11.5px] font-medium text-signal-deep">
            <BranchIcon size={13} />
            {artifact.outcome}
          </p>
        </MiniCard>
      );

    case "ticket":
      return (
        <MiniCard>
          <div className="flex items-center justify-between gap-2 bg-sunk/60 px-3 py-2">
            <span className="flex items-center gap-1.5 text-[12px] font-medium tabular-nums text-ink">
              <TicketIcon size={13} className="text-steel" />
              {artifact.title}
            </span>
            <StatusChip label={artifact.status} tone="neutral" />
          </div>
          <div className="border-t border-whisper">
            {artifact.rows.slice(0, 2).map((row) => (
              <MiniRow key={row.label} label={row.label} value={row.value} />
            ))}
          </div>
          <p className="flex items-center gap-1.5 border-t border-whisper px-3 py-2 text-[11.5px] text-ink">
            <CheckIcon size={13} className="text-signal" />
            <span className="text-steel">{artifact.footerLabel}:</span>
            <span className="font-medium">{artifact.footerValue}</span>
          </p>
        </MiniCard>
      );

    default: {
      const exhaustive: never = artifact;
      return exhaustive;
    }
  }
}

export function Pillars() {
  const { eyebrow, title, items } = LANDING.pillars;
  return (
    <SectionRegister
      register="canvas"
      id="producto"
      className="scroll-mt-28 px-4 py-[clamp(5rem,10vw,9rem)]"
    >
      <div className="mx-auto max-w-content">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} align="center" />
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map((pillar, i) => (
            <Reveal key={pillar.number} delay={i * 0.08}>
              <article className="flex h-full flex-col overflow-hidden rounded-[20px] border border-whisper bg-surface shadow-card">
                <div className="px-6 pb-5 pt-7 text-center">
                  {/* El número se conserva porque los pilares SON una
                      secuencia — el propio título lo dice: «Responde, decide y
                      escala. En ese orden». Numerar contenido que no lleva
                      orden sería decoración; aquí informa. */}
                  <p
                    data-pillar-number
                    className="text-[12px] font-medium tabular-nums tracking-[0.18em] text-[color:var(--accent-text)]"
                  >
                    {pillar.number}
                  </p>
                  <h3 className="mt-2 text-balance font-display text-[1.35rem] font-medium leading-tight tracking-[-0.02em] text-ink">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-steel">{pillar.body}</p>
                </div>

                {/* Altura FIJA y anclado abajo (`mt-auto`). Los tres textos
                    miden distinto, así que con un lavado de altura automática
                    las miniaturas arrancaban a tres alturas diferentes y la
                    rejilla se veía desalineada. Fijándola, los tres lavados
                    empiezan y acaban en la misma línea sin importar el copy.
                    Y entra la miniatura entera: recortarla a media fila leía
                    como un fallo de maquetación, no como una captura que
                    sigue más allá del borde. */}
                <div
                  className={`mt-auto h-[188px] bg-gradient-to-b px-5 pt-6 ${WASH[i % WASH.length]}`}
                >
                  <PillarArtifactMini artifact={pillar.artifact} />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionRegister>
  );
}
