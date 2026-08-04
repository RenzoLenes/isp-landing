"use client";

import { motion, useReducedMotion } from "motion/react";

export function SignalThread({
  orientation,
  className = "",
}: {
  orientation: "vertical" | "horizontal";
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const isVertical = orientation === "vertical";
  const travelAxis = isVertical ? "y" : "x";

  return (
    <div
      aria-hidden
      className={`relative ${isVertical ? "h-full w-px" : "h-px w-full"} ${className}`}
    >
      <div
        className={`absolute inset-0 border-lavender ${
          isVertical ? "border-l border-dashed" : "border-t border-dashed"
        }`}
      />
      {!reduceMotion ? (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            [travelAxis]: ["0%", "100%"],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute -left-[3px] -top-[3px] block size-1.5 rounded-full bg-lavender" />
        </motion.div>
      ) : null}
    </div>
  );
}
