"use client";

import { motion, useReducedMotion } from "motion/react";
import { LANDING } from "@/content/landing";

const DOT_POSITIONS = [0.25, 0.5, 0.75];

function SignalDot({
  className,
  style,
  delay,
}: {
  className: string;
  style: React.CSSProperties;
  delay: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      className={`absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lavender ${className}`}
      style={style}
      animate={reduceMotion ? undefined : { opacity: [0.2, 1, 0.2] }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

function Connector({ index }: { index: number }) {
  return (
    <div
      aria-hidden
      className="relative mx-auto h-10 w-px bg-gradient-to-b from-lavender/60 to-lavender/20 md:mx-0 md:mt-5 md:h-px md:w-auto md:flex-1 md:bg-gradient-to-r"
    >
      {/* Móvil: conector vertical, puntos distribuidos por `top`. */}
      {DOT_POSITIONS.map((position, dot) => (
        <SignalDot
          key={`v-${position}`}
          className="left-1/2 md:hidden"
          style={{ top: `${position * 100}%` }}
          delay={index * 0.4 + dot * 0.3}
        />
      ))}
      {/* Desktop: conector horizontal, puntos distribuidos por `left`. */}
      {DOT_POSITIONS.map((position, dot) => (
        <SignalDot
          key={`h-${position}`}
          className="top-1/2 hidden md:block"
          style={{ left: `${position * 100}%` }}
          delay={index * 0.4 + dot * 0.3}
        />
      ))}
    </div>
  );
}

export function SignalFlow() {
  const { steps } = LANDING.flow;
  return (
    <ol className="mt-16 flex flex-col md:flex-row md:items-start">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className={`flex flex-col items-center md:flex-row md:items-start ${
            i < steps.length - 1 ? "md:flex-1" : ""
          }`}
        >
          <div className="flex flex-col items-center text-center md:w-56 md:shrink-0">
            <span className="flex size-11 items-center justify-center rounded-full border border-blue/40 bg-blue/10 text-sm font-medium text-ink [font-variant-numeric:tabular-nums]">
              {i + 1}
            </span>
            <h3 className="mt-4 font-medium text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-moss">{step.body}</p>
          </div>
          {i < steps.length - 1 ? <Connector index={i} /> : null}
        </li>
      ))}
    </ol>
  );
}
