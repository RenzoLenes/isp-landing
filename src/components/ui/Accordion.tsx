// Vendored from 21st.dev — ddoemonn, "Accordion" (demo id 23530), approved by
// the client. Original source: .superpowers/21st/accordion-source.tsx.
// Adaptations from that source (see .superpowers/21st/NOTAS-accordion.md):
//   - stone-* colours -> project tokens (surface, whisper, ink, moss, sunk)
//   - focus #4568FF -> our `signal` token, expressed as an outline (matching
//     ButtonLink/PilotForm's `focus-visible:outline-*-signal` elsewhere on the
//     page) rather than the source's inset box-shadow — inset because the
//     container needs `overflow-hidden` to clip its rounded corners, and an
//     outward offset would get clipped for the first/last row.
//   - all `dark:` classes removed — this project has no dark mode.
//   - the source's arbitrary compact-UI sizes (`text-[13px]`, `text-[11.5px]`,
//     `text-[12.5px]`, `rounded-[11px]`) were tuned for a 440px product-UI
//     demo box. This accordion holds real prose FAQ answers at ~65ch on a
//     marketing page, so sizes were re-picked for that context rather than
//     mapped to the nearest token: `text-base` questions, `text-base` answers
//     (comfortable reading copy, not compact UI text), `rounded-3xl` to match
//     this project's card radius (DataCard, SystemCard).
//   - `maxPanelHeight` is now optional and, when omitted, renders panel
//     content with no internal scroll — the source's fixed 220px scrolling
//     panel suited a small demo box, not a full FAQ answer that should just
//     read as part of the page.
//
// Behaviour kept exactly as vendored: full keyboard nav (ArrowUp/Down/Home/
// End), complete ARIA (aria-expanded, aria-controls, role=region,
// aria-labelledby, aria-hidden on closed panels), `inert` on closed panels,
// height measured via ResizeObserver, zero external dependencies.
//
// Hydration safety (verified): `useReducedMotion()` is used only to pick
// `transition` (duration 0 under reduced motion). Every `initial` prop below
// is a static, unconditional value (`false`), never derived from the reduced-
// motion hook — so server and client render the same markup on first paint,
// which is exactly the pattern that avoided React hydration error #418
// elsewhere on this page (see globals.css's `data-motion-settle` comment).
// This component doesn't need `data-motion-settle` itself: nothing here
// depends on `initial` differing by reduced-motion state.

"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "motion/react";

const EASE = [0.23, 1, 0.32, 1] as const;
const EXIT_EASE = [0.4, 0, 1, 1] as const;

const DISCLOSE = {
  type: "spring",
  stiffness: 480,
  damping: 40,
  mass: 0.6,
} as const;

const CHEVRON = {
  type: "spring",
  stiffness: 700,
  damping: 46,
  mass: 0.5,
} as const;

const NONE: readonly string[] = [];

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

type Inertable = HTMLElement & { inert?: boolean };

export type UseAutoHeightResult = {
  ref: React.RefObject<HTMLDivElement | null>;
  height: number;
  ready: boolean;
};

export function useAutoHeight(): UseAutoHeightResult {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [ready, setReady] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const read = () => {
      const next = el.getBoundingClientRect().height;
      setHeight((prev) => (Math.abs(prev - next) < 0.5 ? prev : next));
    };

    read();
    setReady(true);

    const observer = new ResizeObserver(read);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return { ref, height, ready };
}

export type AccordionEntry = {
  id: string;
};

export type AccordionHeaderProps = {
  id: string;
  ref: (node: HTMLButtonElement | null) => void;
  type: "button";
  onClick: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  "aria-expanded": boolean;
  "aria-controls": string;
};

export type AccordionPanelProps = {
  id: string;
  role: "region";
  "aria-labelledby": string;
  "aria-hidden": true | undefined;
};

export type UseAccordionOptions = {
  items: readonly AccordionEntry[];
  type?: "single" | "multiple";
  defaultOpen?: readonly string[];
  open?: readonly string[];
  onOpenChange?: (open: string[]) => void;
  collapsible?: boolean;
};

export type UseAccordionResult = {
  open: string[];
  isOpen: (id: string) => boolean;
  toggle: (id: string) => void;
  headerProps: (id: string) => AccordionHeaderProps;
  panelProps: (id: string) => AccordionPanelProps;
};

export function useAccordion({
  items,
  type = "single",
  defaultOpen = NONE,
  open: controlled,
  onOpenChange,
  collapsible = true,
}: UseAccordionOptions): UseAccordionResult {
  const base = useId();

  const [uncontrolled, setUncontrolled] = useState<string[]>(() =>
    type === "single" ? defaultOpen.slice(0, 1) : defaultOpen.slice(),
  );

  const open = useMemo(
    () => (controlled ? controlled.slice() : uncontrolled),
    [controlled, uncontrolled],
  );

  const headers = useRef(new Map<string, HTMLButtonElement>());
  const binders = useRef(new Map<string, AccordionHeaderProps["ref"]>());

  const headerRef = useCallback((id: string): AccordionHeaderProps["ref"] => {
    const cached = binders.current.get(id);
    if (cached) return cached;
    const bind = (node: HTMLButtonElement | null) => {
      if (node) headers.current.set(id, node);
      else headers.current.delete(id);
    };
    binders.current.set(id, bind);
    return bind;
  }, []);

  // Fixed from the vendored source: it assigned `changed.current` directly in
  // the render body (the "latest ref" pattern), which this project's
  // `react-hooks/refs` lint rule rejects (refs must not be written during
  // render). Moved into an effect — `changed.current` is only ever read
  // inside `commit`, itself only called from later event handlers, so this
  // is a behavior-preserving fix, not a functional change.
  const changed = useRef(onOpenChange);
  useEffect(() => {
    changed.current = onOpenChange;
  }, [onOpenChange]);

  const commit = useCallback((next: string[]) => {
    setUncontrolled(next);
    changed.current?.(next);
  }, []);

  const isOpen = useCallback((id: string) => open.includes(id), [open]);

  const toggle = useCallback(
    (id: string) => {
      const active = open.includes(id);
      if (active && !collapsible && type === "single") return;
      if (type === "single") {
        commit(active ? [] : [id]);
        return;
      }
      commit(active ? open.filter((x) => x !== id) : [...open, id]);
    },
    [open, type, collapsible, commit],
  );

  const order = useMemo(() => items.map((item) => item.id), [items]);

  const move = useCallback(
    (id: string, delta: number, edge: "first" | "last" | null) => {
      if (order.length === 0) return;
      const at = order.indexOf(id);
      if (at < 0) return;
      const next =
        edge === "first"
          ? 0
          : edge === "last"
            ? order.length - 1
            : (at + delta + order.length) % order.length;
      headers.current.get(order[next])?.focus();
    },
    [order],
  );

  const headerProps = useCallback(
    (id: string): AccordionHeaderProps => ({
      id: `${base}-header-${id}`,
      ref: headerRef(id),
      type: "button",
      onClick: () => toggle(id),
      onKeyDown: (event: React.KeyboardEvent) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          move(id, 1, null);
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          move(id, -1, null);
        } else if (event.key === "Home") {
          event.preventDefault();
          move(id, 0, "first");
        } else if (event.key === "End") {
          event.preventDefault();
          move(id, 0, "last");
        }
      },
      "aria-expanded": open.includes(id),
      "aria-controls": `${base}-panel-${id}`,
    }),
    [base, open, toggle, move, headerRef],
  );

  const panelProps = useCallback(
    (id: string): AccordionPanelProps => ({
      id: `${base}-panel-${id}`,
      role: "region",
      "aria-labelledby": `${base}-header-${id}`,
      "aria-hidden": open.includes(id) ? undefined : true,
    }),
    [base, open],
  );

  return { open, isOpen, toggle, headerProps, panelProps };
}

export type AccordionItem = {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  meta?: React.ReactNode;
};

export type AccordionProps = {
  items: readonly AccordionItem[];
  type?: "single" | "multiple";
  defaultOpen?: readonly string[];
  open?: readonly string[];
  onOpenChange?: (open: string[]) => void;
  collapsible?: boolean;
  /** When omitted, panel content is unconstrained — no internal scroll. */
  maxPanelHeight?: number;
  headingLevel?: number;
  className?: string;
};

export function Accordion({
  items,
  type = "single",
  defaultOpen = NONE,
  open: controlled,
  onOpenChange,
  collapsible = true,
  maxPanelHeight,
  headingLevel = 3,
  className = "",
}: AccordionProps) {
  const reduced = useReducedMotion();

  const entries = useMemo(() => items.map(({ id }) => ({ id })), [items]);

  const { isOpen, headerProps, panelProps } = useAccordion({
    items: entries,
    type,
    defaultOpen,
    open: controlled,
    onOpenChange,
    collapsible,
  });

  return (
    // Same chrome-only register adaptation as DataCard/DecisionChain: the
    // accordion's fill stays `bg-surface` regardless of register (it's an
    // artifact, per DESIGN.md §5), only its outer border + shadow read the
    // register-scoped custom properties. `divide-whisper` between rows stays
    // hardcoded — those dividers sit against the card's own always-white
    // fill, not the section background.
    <div
      className={`divide-y divide-whisper overflow-hidden rounded-3xl border border-[color:var(--card-border)] bg-surface shadow-[var(--card-shadow)] ${className}`}
    >
      {items.map((item) => (
        <AccordionRow
          key={item.id}
          item={item}
          open={isOpen(item.id)}
          reduced={Boolean(reduced)}
          maxPanelHeight={maxPanelHeight}
          headingLevel={headingLevel}
          header={headerProps(item.id)}
          panel={panelProps(item.id)}
        />
      ))}
    </div>
  );
}

function AccordionRow({
  item,
  open,
  reduced,
  maxPanelHeight,
  headingLevel,
  header,
  panel,
}: {
  item: AccordionItem;
  open: boolean;
  reduced: boolean;
  maxPanelHeight: number | undefined;
  headingLevel: number;
  header: AccordionHeaderProps;
  panel: AccordionPanelProps;
}) {
  const { ref, height, ready } = useAutoHeight();

  useEffect(() => {
    const el = ref.current as Inertable | null;
    if (!el) return;
    el.inert = !open;
    return () => {
      el.inert = false;
    };
  }, [ref, open]);

  return (
    <div>
      <div role="heading" aria-level={headingLevel}>
        <button
          {...header}
          className="flex min-h-11 w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-sunk/60 focus-visible:bg-signal/[0.06] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-signal"
        >
          <span
            className={`min-w-0 flex-1 text-base font-medium transition-colors duration-150 ${
              open ? "text-ink" : "text-ink/85"
            }`}
          >
            {item.title}
          </span>

          {item.meta ? (
            <span className="shrink-0 text-sm tabular-nums text-moss">
              {item.meta}
            </span>
          ) : null}

          <motion.svg
            width="16"
            height="16"
            viewBox="0 0 256 256"
            fill="none"
            aria-hidden="true"
            className="shrink-0 text-moss"
            initial={false}
            animate={{ rotate: open ? 180 : 0 }}
            transition={reduced ? { duration: 0 } : CHEVRON}
          >
            <path
              d="M208 96l-80 80-80-80"
              stroke="currentColor"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </button>
      </div>
      <motion.div
        initial={false}
        animate={ready ? { height: open ? height : 0 } : {}}
        transition={reduced ? { duration: 0 } : DISCLOSE}
        style={{
          overflow: "hidden",
          height: ready ? undefined : open ? "auto" : 0,
        }}
      >
        <div
          {...panel}
          ref={ref}
          className="border-t border-whisper bg-sunk"
          style={
            maxPanelHeight
              ? {
                  maxHeight: maxPanelHeight,
                  overflowY: "auto",
                  overscrollBehavior: "contain",
                  scrollbarGutter: "stable",
                }
              : undefined
          }
        >
          <motion.div
            initial={false}
            animate={{ opacity: open ? 1 : 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : open
                  ? { duration: 0.18, ease: EASE }
                  : { duration: 0.14, ease: EXIT_EASE }
            }
            className="px-5 pb-5 pt-4 text-base leading-relaxed text-moss"
          >
            {item.content}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Accordion;
