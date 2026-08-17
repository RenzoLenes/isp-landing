// Vendored from 21st.dev — ddoemonn, "Accordion" (demo id 23530), approved by
// the client. Original source: .superpowers/21st/accordion-source.tsx.
// Adaptations from that source (see .superpowers/21st/NOTAS-accordion.md):
//   - stone-* colours -> project tokens (surface, whisper, ink, steel, sunk)
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
// Sin librería de animación (2026-08): el despliegue pasó de una altura medida
// con ResizeObserver a `grid-template-rows: 0fr -> 1fr` en CSS, que es el mismo
// truco que esta página ya usaba en el carrusel de «Cómo funciona». Con eso se
// fueron el observador, el estado `ready` para no animar en el primer pintado,
// el hook de movimiento reducido y `motion` entera.
//
// La preocupación por la hidratación que documentaba este bloque desapareció
// con la causa: no queda ningún hook cuyo valor difiera entre servidor y
// cliente, así que no hay nada que pueda discrepar. El apagado bajo
// `prefers-reduced-motion` lo hace el CSS.

"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

/*
 * Las curvas de los dos muelles que había aquí (despliegue 480/40/0.6 y giro
 * del «+» 700/46/0.5) viven ahora muestreadas en `--ease-disclose` y
 * `--ease-chevron` (globals.css). Los dos salían SOBREamortiguados, así que no
 * había rebote que reproducir: son curvas de frenado, y `linear()` las clava.
 */

const NONE: readonly string[] = [];

type Inertable = HTMLElement & { inert?: boolean };

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
    // Cada pregunta es su PROPIA tarjeta, separadas por aire, en vez de una
    // lista continua con divisores (adaptado de la referencia Qipeline). Con
    // divisores la sección leía como una tabla de contenidos; separadas, cada
    // objeción se lee como una pieza que se puede abrir. El cromo por tarjeta
    // sigue la adaptación por registro de DataCard/DecisionChain: el relleno
    // es siempre `bg-surface` (es un artefacto, §5) y sólo borde y sombra leen
    // las variables del registro.
    <div className={`flex flex-col gap-3 ${className}`}>
      {items.map((item) => (
        <AccordionRow
          key={item.id}
          item={item}
          open={isOpen(item.id)}
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
  maxPanelHeight,
  headingLevel,
  header,
  panel,
}: {
  item: AccordionItem;
  open: boolean;
  maxPanelHeight: number | undefined;
  headingLevel: number;
  header: AccordionHeaderProps;
  panel: AccordionPanelProps;
}) {
  // Sólo para marcar `inert` el panel cerrado. Antes venía de `useAutoHeight`,
  // que además lo medía; ya no hay nada que medir.
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current as Inertable | null;
    if (!el) return;
    el.inert = !open;
    return () => {
      el.inert = false;
    };
  }, [ref, open]);

  return (
    <div
      className={`overflow-hidden rounded-[18px] border bg-surface transition-colors duration-150 ${
        open
          ? "border-signal/30 shadow-[var(--card-shadow)]"
          : "border-[color:var(--card-border)] shadow-[0_1px_2px_rgba(19,29,42,0.05)]"
      }`}
    >
      <div role="heading" aria-level={headingLevel}>
        <button
          {...header}
          className="flex min-h-11 w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-sunk/40 focus-visible:bg-signal/[0.06] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-signal"
        >
          <span
            className={`min-w-0 flex-1 text-base font-medium transition-colors duration-150 ${
              open ? "text-ink" : "text-ink/85"
            }`}
          >
            {item.title}
          </span>

          {item.meta ? (
            <span className="shrink-0 text-sm tabular-nums text-steel">
              {item.meta}
            </span>
          ) : null}

          {/* Botón circular con «+» que gira 45° hasta ser una «×» (referencia
              Qipeline). Es UN solo par de trazos rotando, no dos iconos que se
              intercambian: así el cambio es continuo y no da un salto. */}
          <span
            aria-hidden="true"
            data-disclose-icon={open ? "open" : "closed"}
            className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
              open ? "bg-signal/12 text-signal-deep" : "bg-sunk text-steel"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>
      </div>
      {/* Sin altura medida: el despliegue va de `0fr` a `1fr` en CSS
          (`[data-disclose]` en globals.css). Eso se lleva por delante el
          `ResizeObserver`, el estado `ready` para no animar en el primer
          pintado, y la librería de animación. */}
      <div data-disclose={open ? "open" : "closed"}>
        <div
          {...panel}
          className="bg-sunk"
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
          <div
            data-disclose-body
            /* El borde va AQUI y no en el panel de fuera: en el panel, su 1px
               sobrevivia al `0fr` del despliegue y cada pregunta cerrada dejaba
               una linea suelta (7 preguntas = 7px de mas, medido). Aqui queda
               dentro de lo que se recorta, y abierto se ve en el mismo sitio. */
            className="border-t border-whisper px-5 pb-5 pt-4 text-base leading-relaxed text-steel"
          >
            {item.content}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accordion;
