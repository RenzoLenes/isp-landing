"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { LANDING } from "@/content/landing";
import { GlassCard } from "@/components/ui/GlassCard";
import { ChatBubble } from "@/components/ui/ChatBubble";
import { DataCard } from "@/components/ui/DataCard";
import { ResultCard } from "@/components/ui/ResultCard";
import { SignalThread } from "@/components/ui/SignalThread";

function Piece({
  children,
  className = "",
  delay,
}: {
  children: ReactNode;
  className?: string;
  delay: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay }}
    >
      {children}
    </motion.div>
  );
}

const SPINE_DOT = {
  lavender: "bg-lavender",
  blue: "bg-blue",
  fiber: "bg-fiber",
} as const;

/** Segmento del hilo de señal entre dos piezas, con nodos de color en la tríada. */
function Spine({
  top,
  bottom,
}: {
  top: keyof typeof SPINE_DOT;
  bottom?: keyof typeof SPINE_DOT;
}) {
  return (
    <div aria-hidden className="flex flex-col items-center gap-1 py-1.5">
      <span className={`size-1.5 shrink-0 rounded-full ${SPINE_DOT[top]}`} />
      <div className="h-9 w-px">
        <SignalThread orientation="vertical" />
      </div>
      {bottom ? (
        <span className={`size-1.5 shrink-0 rounded-full ${SPINE_DOT[bottom]}`} />
      ) : null}
    </div>
  );
}

export function HeroComposition() {
  const c = LANDING.hero.composition;
  return (
    <div
      className="relative mx-auto flex w-full max-w-[440px] flex-col lg:mx-0"
      role="img"
      aria-label="Composición ilustrativa: dos mensajes de un cliente por WhatsApp, seguidos de la ficha de su servicio que Nexo consulta, y del ticket ya listo para asignar a un técnico."
    >
      {/* Halos de luz */}
      <div
        aria-hidden
        className="absolute -left-12 top-4 -z-10 size-64 rounded-full bg-lavender/35 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-10 bottom-8 -z-10 size-56 rounded-full bg-blue/25 blur-3xl"
      />

      {/* 1. Conversación — pieza dominante, ancho completo */}
      <Piece delay={0.15} className="w-full">
        <GlassCard>
          <p className="mb-3 text-xs font-medium text-moss">{c.chatHeader}</p>
          <div className="flex flex-col gap-2">
            {c.chatMessages.map((message) => (
              <ChatBubble key={message} from="cliente">
                {message}
              </ChatBubble>
            ))}
          </div>
        </GlassCard>
      </Piece>

      <Spine top="lavender" />

      {/* 2. Contexto — resultado derivado, desplazado a la derecha */}
      <Piece delay={0.4} className="w-[72%] self-end">
        <DataCard
          title={c.contextTitle}
          status={{ label: c.contextStatus, tone: "ok" }}
          rows={c.contextRows}
        />
      </Piece>

      {/* No `bottom` dot here: `ResultCard` renders its own leading fiber
          dot, so a second one would double up a few pixels above it — same
          grammar as `UseCases`' `Connector`. */}
      <Spine top="blue" />

      {/* 3. Acción — resultado derivado, desplazado a la izquierda */}
      <Piece delay={0.65} className="w-[76%] self-start">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-moss">
          {c.actionLabel}
        </p>
        <ResultCard title={c.actionTitle} meta={c.actionMeta} />
      </Piece>
    </div>
  );
}
