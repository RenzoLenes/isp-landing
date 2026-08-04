"use client";

import { motion, useReducedMotion } from "motion/react";
import { StatusChip } from "@/components/ui/StatusChip";

export function DecisionChain({
  checks,
  outcome,
  className = "",
}: {
  checks: readonly { question: string; answer: string }[];
  outcome: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`rounded-3xl border border-whisper bg-surface p-6 shadow-card ${className}`}
    >
      <ul className="flex flex-col">
        {checks.map((check, index) => (
          <motion.li
            key={check.question}
            className="flex items-center justify-between gap-4 border-t border-whisper py-2.5 first:pt-0"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: reduceMotion ? 0 : index * 0.12,
            }}
          >
            <span className="text-sm text-ink">{check.question}</span>
            <StatusChip label={check.answer} tone="neutral" />
          </motion.li>
        ))}
      </ul>

      <div className="mt-2 flex items-center gap-2.5 border-t border-whisper pt-4">
        <span aria-hidden className="size-2 rounded-full bg-blue" />
        <span aria-hidden className="text-moss">
          →
        </span>
        <p className="text-sm font-medium text-ink">{outcome}</p>
      </div>
    </div>
  );
}
