"use client";

// Vendored from 21st.dev — magicui / dillionverma, "Animated Beam" (demo id
// 919). Source verbatim at `.superpowers/21st/animated-beam-source.tsx`;
// paid download, do not re-fetch. Adaptations from that source, all
// mandatory (see `.superpowers/21st/NOTAS.md`):
//
// 1. `import { motion } from "framer-motion"` -> `"motion/react"` — this
//    project doesn't have `framer-motion` installed as a direct dependency.
// 2. Dropped the `cn` helper from `@/lib/utils` (doesn't exist here) in
//    favour of a template literal, matching the rest of `src/components/ui/`.
// 3. `RefObject<HTMLElement>` -> `RefObject<HTMLElement | null>` for React
//    19's stricter ref types (`useRef<T>(null)` now types as
//    `RefObject<T | null>`).
// 4. Added `prefers-reduced-motion` support, which the original has none of:
//    its gradient animation was `repeat: Infinity` unconditionally. The
//    gradient overlay path is always mounted (conditionally mounting it
//    based on `useReducedMotion()` — which resolves synchronously on the
//    client but returns `null` during SSR — reproduced the exact structural
//    hydration mismatch fixed in SignalThread.tsx: React hydration error
//    #418, confirmed by rendering under `prefers-reduced-motion: reduce`
//    and checking the console). Instead, when motion is reduced, the
//    gradient's `animate` is pinned to the same values as `initial` — so it
//    never tweens and no `repeat: Infinity` animation is ever created,
//    satisfying DESIGN.md §7's "apagan los loops por completo, no los
//    ralentizan" without touching DOM structure.
// 5. Replaced the default demo colours (`gradientStartColor="#ffaa40"`
//    orange, `gradientStopColor="#9c40ff"` purple, `pathColor="gray"`) with
//    this project's tokens — see the named constants below.

import { RefObject, useEffect, useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

// Hex literals (SVG `stroke`/`stopColor` attributes can't take Tailwind
// classes, same reasoning as `GradientField`'s inline gradients) — each one
// names the design token it mirrors, from `globals.css`'s `@theme` block.
const LAVENDER = "#a7a9eb"; // --color-lavender (Lavanda de Señal)
const BLUE = "#5aabff"; // --color-blue (Azul Inteligente)

export interface AnimatedBeamProps {
  className?: string;
  containerRef: RefObject<HTMLElement | null>; // Container ref
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  curvature?: number;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false, // Include the reverse prop
  // The original defaulted this to `Math.random() * 3 + 4` — an impure call
  // during render (flagged by `react-hooks/purity`/eslint). Fixed default;
  // callers that want per-beam variety pass an explicit `duration`.
  duration = 5.5,
  delay = 0,
  // The original demo's base path (`pathColor="gray"`, `pathOpacity={0.2}`)
  // all but disappeared against our light fog background (`#F5F7F4`) —
  // confirmed by rendering and looking at the screenshot, not guessed. Base
  // colour moved from a near-invisible dark "whisper" tone to the same
  // lavender as the rest of the signal-thread vocabulary (`SignalThread`'s
  // static dashed line), at a visible-but-still-quiet opacity, with a
  // slightly heavier stroke than the 21st.dev default so the curve reads at
  // a glance instead of needing to be looked for.
  pathColor = LAVENDER,
  pathWidth = 2.5,
  pathOpacity = 0.55,
  gradientStartColor = LAVENDER,
  gradientStopColor = BLUE,
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}) => {
  const id = useId();
  const reduceMotion = useReducedMotion();
  const [pathD, setPathD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

  // Calculate the gradient coordinates based on the reverse prop
  const gradientCoordinates = reverse
    ? {
        x1: ["90%", "-10%"],
        x2: ["100%", "0%"],
        y1: ["0%", "0%"],
        y2: ["0%", "0%"],
      }
    : {
        x1: ["10%", "110%"],
        x2: ["0%", "100%"],
        y1: ["0%", "0%"],
        y2: ["0%", "0%"],
      };

  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const rectA = fromRef.current.getBoundingClientRect();
        const rectB = toRef.current.getBoundingClientRect();

        const svgWidth = containerRect.width;
        const svgHeight = containerRect.height;
        setSvgDimensions({ width: svgWidth, height: svgHeight });

        const startX =
          rectA.left - containerRect.left + rectA.width / 2 + startXOffset;
        const startY =
          rectA.top - containerRect.top + rectA.height / 2 + startYOffset;
        const endX =
          rectB.left - containerRect.left + rectB.width / 2 + endXOffset;
        const endY =
          rectB.top - containerRect.top + rectB.height / 2 + endYOffset;

        const controlY = startY - curvature;
        const d = `M ${startX},${startY} Q ${
          (startX + endX) / 2
        },${controlY} ${endX},${endY}`;
        setPathD(d);
      }
    };

    // Initialize ResizeObserver — recalculate the path on any resize.
    const resizeObserver = new ResizeObserver(() => {
      updatePath();
    });

    // Observe the container element
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Call the updatePath initially to set the initial path
    updatePath();

    // Clean up the observer on component unmount
    return () => {
      resizeObserver.disconnect();
    };
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ]);

  return (
    <svg
      aria-hidden
      data-animated-beam
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none absolute left-0 top-0 transform-gpu stroke-2 ${className ?? ""}`}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
    >
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      {/* Always mounted (see adaptation 4 above) — under reduced motion its
          `animate` below is pinned to `initial`, so it's inert: visible
          (the gradient still tints the stroke) but static, no travelling
          highlight, no Infinity-repeat animation ever created. */}
      <path
        d={pathD}
        strokeWidth={pathWidth}
        stroke={`url(#${id})`}
        strokeOpacity="1"
        strokeLinecap="round"
      />
      <defs>
        <motion.linearGradient
          className="transform-gpu"
          id={id}
          gradientUnits={"userSpaceOnUse"}
          initial={{
            x1: "0%",
            x2: "0%",
            y1: "0%",
            y2: "0%",
          }}
          animate={
            reduceMotion
              ? {
                  x1: "0%",
                  x2: "0%",
                  y1: "0%",
                  y2: "0%",
                }
              : {
                  x1: gradientCoordinates.x1,
                  x2: gradientCoordinates.x2,
                  y1: gradientCoordinates.y1,
                  y2: gradientCoordinates.y2,
                }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  delay,
                  duration,
                  ease: [0.16, 1, 0.3, 1], // https://easings.net/#easeOutExpo
                  repeat: Infinity,
                  repeatDelay: 0,
                }
          }
        >
          <stop stopColor={gradientStartColor} stopOpacity="0"></stop>
          <stop stopColor={gradientStartColor}></stop>
          <stop offset="32.5%" stopColor={gradientStopColor}></stop>
          <stop
            offset="100%"
            stopColor={gradientStopColor}
            stopOpacity="0"
          ></stop>
        </motion.linearGradient>
      </defs>
    </svg>
  );
};
