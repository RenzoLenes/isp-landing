"use client";

import type { ReactNode } from "react";
import type { FlowArtifact } from "@/content/landing";
import { StatusChip } from "@/components/ui/StatusChip";
import {
  Avatar,
  ChatMessageBubble,
  WhatsAppThread,
} from "@/components/ui/WhatsAppThread";
import {
  BranchIcon,
  CheckIcon,
  DatabaseIcon,
  TicketIcon,
  XIcon,
} from "@/components/ui/console-icons";

/*
 * Lo que se ve dentro del panel de «Cómo funciona», un artefacto por paso.
 *
 * Los cuatro pasos pintaban antes la misma pieza: dos filas blancas con
 * titular y renglón. Con eso, el paso del mensaje no parecía un mensaje y el
 * de la decisión no parecía una decisión — se leían como cuatro fichas
 * iguales, y había que fiarse del texto de al lado para saber qué era cada
 * cosa. Aquí cada paso se enseña con la forma que ya sabemos leer: un hilo de
 * WhatsApp, el resultado de una consulta, una bifurcación con su rama
 * descartada, un ticket con destinatario.
 *
 * Lo que sostiene la secuencia es el MARCO, que no cambia (mismo panel de
 * cielo, mismo rótulo de paso, mismo chip, misma píldora de traspaso). En un
 * carrusel sólo hay un artefacto en pantalla a la vez, así que la variedad
 * puede vivir dentro sin que la sección se desordene.
 *
 * Todo entra escalonado con `data-flow-pop`: son animaciones CSS disparadas
 * por el remontaje del panel al cambiar de paso, así que no hay estado que
 * sincronizar. `globals.css` las apaga bajo `prefers-reduced-motion`.
 */

/** Retardo de entrada de la fila `i`. Suficiente para leerse como cascada. */
const pop = (i: number) => ({ animationDelay: `${0.12 + i * 0.11}s` });

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-[16px] border border-white/70 bg-surface shadow-[0_18px_36px_-18px_rgba(19,29,42,0.5)] ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({
  icon,
  title,
  right,
}: {
  icon: ReactNode;
  title: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-whisper px-3.5 py-2.5">
      <span className="flex min-w-0 items-center gap-2 text-[13px] font-medium text-ink">
        <span className="text-steel">{icon}</span>
        <span className="truncate">{title}</span>
      </span>
      {right}
    </div>
  );
}

/** Paso 1 — el mensaje, como el hilo de WhatsApp que es. */
function ChatArtifact({ artifact }: { artifact: Extract<FlowArtifact, { kind: "chat" }> }) {
  return (
    <Card>
      <WhatsAppThread
        contact={artifact.contact}
        daySeparator={artifact.day}
        messages={artifact.messages}
        typing={artifact.typing}
        composerPlaceholder={artifact.composer}
        popIn
        // Suelo de altura: con un mensaje y los tres puntos, el hilo medía la
        // mitad que los artefactos de los otros pasos y el panel se veía
        // vacío justo en el paso que abre la secuencia.
        className="min-h-[236px]"
      />
    </Card>
  );
}

/** Paso 2 — lo que Gantry le pregunta a tu sistema, y lo que le responde. */
function ConsultaArtifact({
  artifact,
}: {
  artifact: Extract<FlowArtifact, { kind: "consulta" }>;
}) {
  return (
    <Card>
      <CardHeader
        icon={<DatabaseIcon size={14} />}
        title={artifact.system}
        right={
          <span className="shrink-0 rounded-full bg-sunk px-2 py-0.5 text-[10.5px] font-medium text-steel">
            {artifact.badge}
          </span>
        }
      />
      <ul>
        {artifact.rows.map((row, i) => (
          <li
            key={row.label}
            data-flow-pop
            style={pop(i)}
            className="flex items-center justify-between gap-3 border-t border-whisper px-3.5 py-2.5 text-[12.5px] first:border-t-0"
          >
            <span className="flex min-w-0 items-center gap-2 text-steel">
              {/* El check no es adorno: dice que esa comprobación ya volvió
                  con respuesta. Las cuatro juntas son el diagnóstico. */}
              <CheckIcon size={13} className="shrink-0 text-signal" />
              <span className="truncate">{row.label}</span>
            </span>
            <span className="shrink-0 font-medium text-ink">{row.value}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/** Paso 3 — la decisión y lo que sale de ella: una respuesta al cliente. */
function DecisionArtifact({
  artifact,
}: {
  artifact: Extract<FlowArtifact, { kind: "decision" }>;
}) {
  return (
    <div>
      <Card>
        <CardHeader icon={<BranchIcon size={14} />} title={artifact.question} />
        {/* Las dos ramas, en paralelo y no en lista: una decisión se ve
            cuando se ve lo que NO se hizo. La descartada va con borde
            discontinuo y su glifo de cierre; la tomada, en Señal. */}
        <div className="grid grid-cols-2 gap-2 p-2.5">
          {artifact.options.map((option, i) => (
            <div
              key={option.label}
              data-flow-pop
              style={pop(i)}
              className={`rounded-[12px] px-2.5 py-2 ${
                option.taken
                  ? "border border-signal/45 bg-signal/[0.10]"
                  : "border border-dashed border-whisper bg-canvas/60"
              }`}
            >
              <p
                className={`flex items-center gap-1.5 text-[12.5px] font-medium ${
                  option.taken ? "text-ink" : "text-steel"
                }`}
              >
                {option.taken ? (
                  <CheckIcon size={13} className="shrink-0 text-signal-deep" />
                ) : (
                  <XIcon size={13} className="shrink-0 text-steel/70" />
                )}
                {option.label}
              </p>
              <p
                className={`mt-1 text-[11.5px] leading-snug ${
                  option.taken ? "text-steel" : "text-steel/70 line-through decoration-steel/40"
                }`}
              >
                {option.note}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* El hilo que baja de la decisión a la respuesta: es lo que dice que
          la conversación es CONSECUENCIA de lo decidido, no otra cosa que
          pasa al lado. */}
      <span aria-hidden className="mx-auto flex flex-col items-center py-1.5">
        <span className="h-5 w-px bg-signal/40" />
        <span className="size-1.5 rounded-full bg-signal-deep" />
      </span>

      <div data-flow-pop style={pop(3)}>
        <ChatMessageBubble message={artifact.reply} />
      </div>
    </div>
  );
}

/** Paso 4 — el ticket, con lo ya probado y a quién le llega. */
function TicketArtifact({ artifact }: { artifact: Extract<FlowArtifact, { kind: "ticket" }> }) {
  return (
    <Card>
      <CardHeader
        icon={<TicketIcon size={14} />}
        title={artifact.id}
        right={<StatusChip label={artifact.status} tone="ok" />}
      />
      <ul>
        {artifact.rows.map((row, i) => (
          <li
            key={row.label}
            data-flow-pop
            style={pop(i)}
            className="flex items-baseline gap-3 border-t border-whisper px-3.5 py-2 text-[12.5px] first:border-t-0"
          >
            <span className="w-[86px] shrink-0 text-steel">{row.label}</span>
            <span className="min-w-0 flex-1 text-ink">{row.value}</span>
          </li>
        ))}
      </ul>
      {/* El destinatario cierra la tarjeta sobre fondo hundido: el ticket no
          queda en una bandeja, queda en manos de alguien con nombre. */}
      <div
        data-flow-pop
        style={pop(3)}
        className="flex items-center gap-2.5 border-t border-whisper bg-sunk/60 px-3.5 py-2.5"
      >
        <Avatar initials={artifact.assignee.initials} size={30} />
        <span className="min-w-0">
          <span className="block text-[13px] font-medium text-ink">{artifact.assignee.name}</span>
          <span className="block truncate text-[11.5px] text-steel">{artifact.assignee.meta}</span>
        </span>
      </div>
    </Card>
  );
}

export function FlowArtifactView({ artifact }: { artifact: FlowArtifact }) {
  switch (artifact.kind) {
    case "chat":
      return <ChatArtifact artifact={artifact} />;
    case "consulta":
      return <ConsultaArtifact artifact={artifact} />;
    case "decision":
      return <DecisionArtifact artifact={artifact} />;
    case "ticket":
      return <TicketArtifact artifact={artifact} />;
  }
}
