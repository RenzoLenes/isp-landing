"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { LANDING } from "@/content/landing";
import { GlassCard } from "@/components/ui/GlassCard";
import { ChatBubble } from "@/components/ui/ChatBubble";

function FloatingPiece({
  children,
  className,
  delay,
  floatDuration,
}: {
  children: ReactNode;
  className: string;
  delay: number;
  floatDuration: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay }}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.6,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function HeroComposition() {
  const c = LANDING.hero.composition;
  return (
    <div
      className="relative mx-auto aspect-[3/5] w-full max-w-[420px] sm:aspect-[4/5] lg:mx-0"
      role="img"
      aria-label="Composición ilustrativa: un mensaje de WhatsApp se convierte en una consulta al sistema y en un ticket listo para asignar"
    >
      {/* Halos de luz */}
      <div
        aria-hidden
        className="absolute -left-16 top-8 -z-10 size-64 rounded-full bg-lavender/35 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-10 bottom-16 -z-10 size-56 rounded-full bg-blue/25 blur-3xl"
      />

      {/* Hilos de conexión */}
      <svg
        aria-hidden
        viewBox="0 0 400 500"
        fill="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M150 100 C 230 130, 300 170, 310 225"
          className="stroke-lavender"
          strokeWidth="1.5"
          strokeDasharray="3 6"
          opacity="0.7"
        />
        <path
          d="M300 300 C 250 360, 180 390, 150 420"
          className="stroke-lavender"
          strokeWidth="1.5"
          strokeDasharray="3 6"
          opacity="0.7"
        />
        <circle cx="150" cy="100" r="4" className="fill-lavender" />
        <circle cx="310" cy="225" r="4" className="fill-blue" />
        <circle cx="150" cy="420" r="4" className="fill-fiber" />
      </svg>

      {/* 1. Conversación */}
      <FloatingPiece className="absolute left-0 top-2 w-[78%]" delay={0.15} floatDuration={6}>
        <GlassCard>
          <p className="mb-3 text-xs font-medium text-moss">{c.chatHeader}</p>
          <ChatBubble from="cliente">{c.chatMessage}</ChatBubble>
        </GlassCard>
      </FloatingPiece>

      {/* 2. Estado del sistema */}
      <FloatingPiece
        className="absolute right-0 top-[38%] w-[72%]"
        delay={0.45}
        floatDuration={7}
      >
        <GlassCard>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-moss">
            {c.statusLabel}
          </p>
          <div className="mt-2 flex items-center gap-2.5">
            <span aria-hidden className="size-2 rounded-full bg-blue" />
            <p className="text-sm font-medium text-ink">{c.statusTitle}</p>
          </div>
          <p className="mt-1 pl-[18px] text-xs text-moss">{c.statusMeta}</p>
        </GlassCard>
      </FloatingPiece>

      {/* 3. Ticket */}
      <FloatingPiece
        className="absolute bottom-2 left-[4%] w-[76%]"
        delay={0.75}
        floatDuration={8}
      >
        <GlassCard>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-moss">
            {c.ticketLabel}
          </p>
          <div className="mt-2 flex items-center gap-2.5">
            <span aria-hidden className="size-2 rounded-full bg-fiber" />
            <p className="text-sm font-medium text-ink [font-variant-numeric:tabular-nums]">
              {c.ticketTitle}
            </p>
          </div>
          <p className="mt-1 pl-[18px] text-xs text-moss">{c.ticketMeta}</p>
        </GlassCard>
      </FloatingPiece>
    </div>
  );
}
