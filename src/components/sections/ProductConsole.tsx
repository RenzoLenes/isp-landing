"use client";

import { useRef, useState, type ReactNode } from "react";
import { LANDING, type ConsoleNavGroup, type ConsoleViewId } from "@/content/landing";
import { GantryMark } from "@/components/ui/GantryMark";
import {
  BranchIcon,
  ChatIcon,
  CollapseIcon,
  CubeIcon,
  GearIcon,
  SearchIcon,
  ShareIcon,
  SparkleIcon,
  TicketIcon,
  UserIcon,
  WalletIcon,
} from "@/components/ui/console-icons";
import {
  AutomatizacionesView,
  CobranzaView,
  ConversacionesView,
  EquipoView,
  IconButton,
  IntegracionesView,
  TicketsView,
} from "@/components/sections/ConsoleViews";

/*
 * La consola del hero: una demo navegable de la app, con la anatomía de la
 * vista "Automatizaciones" de la referencia Qipeline (DESIGN.md §6) — marco
 * teñido de cielo, barra lateral sentada sobre el chrome, ventana blanca con
 * cabecera — pero con las seis vistas de Gantry accesibles desde la barra.
 *
 * Es lo ÚNICO interactivo de la landing además del formulario y el menú, así
 * que su semántica importa: la barra lateral es un `tablist` real (no una lista
 * de enlaces decorativos), cada entrada es un `tab` con `aria-selected`, y el
 * cuerpo es un `tabpanel` etiquetado por su pestaña. Eso incluye el patrón
 * completo de teclado del APG: `tabindex` móvil (sólo la pestaña activa entra
 * en el orden de tabulación) y flechas para moverse entre pestañas, con
 * Inicio/Fin a los extremos.
 *
 * Antes esto era un `role="img"` con un `aria-label` que describía la captura.
 * Eso dejó de ser correcto al volverse interactivo: un lector de pantalla
 * anunciaría "imagen" y luego encontraría botones dentro.
 *
 * Bajo `lg` la barra lateral desaparece (seis etiquetas en una columna de
 * ~70px serían ilegibles) y las mismas pestañas se presentan como una tira
 * horizontal desplazable sobre la ventana, para que la demo siga siendo
 * navegable en un teléfono.
 */

const c = LANDING.hero.console;

/*
 * `LANDING` es `as const`, así que cada grupo lleva su propia tupla literal de
 * items y `flatMap` sobre ellos no unifica los tipos. Esta vista tipada —el
 * mismo dato, ensanchado a `ConsoleNavGroup[]`— es lo que permite recorrerlos
 * como una sola lista sin castear en cada uso.
 */
const GROUPS: readonly ConsoleNavGroup[] = c.groups;

const VIEW_ICONS: Record<ConsoleViewId, ReactNode> = {
  conversaciones: <ChatIcon size={16} />,
  automatizaciones: <BranchIcon size={16} />,
  tickets: <TicketIcon size={16} />,
  cobranza: <WalletIcon size={16} />,
  integraciones: <CubeIcon size={16} />,
  equipo: <UserIcon size={16} />,
};

const VIEW_BODIES: Record<ConsoleViewId, ReactNode> = {
  conversaciones: <ConversacionesView />,
  automatizaciones: <AutomatizacionesView />,
  tickets: <TicketsView />,
  cobranza: <CobranzaView />,
  integraciones: <IntegracionesView />,
  equipo: <EquipoView />,
};

/** Orden plano de las pestañas, para las flechas del teclado. */
const TAB_ORDER: ConsoleViewId[] = GROUPS.flatMap((group) =>
  group.items.map((item) => item.id),
);

const tabId = (id: ConsoleViewId) => `gantry-console-tab-${id}`;
const panelId = (id: ConsoleViewId) => `gantry-console-panel-${id}`;

export function ProductConsole() {
  // Conversaciones abre por defecto: es la vista que cuenta la promesa de la
  // página (WhatsApp con el contexto del cliente al lado).
  const [active, setActive] = useState<ConsoleViewId>("conversaciones");
  const tabRefs = useRef(new Map<ConsoleViewId, HTMLButtonElement>());

  const view = c.views[active];
  const activeLabel =
    GROUPS.flatMap((g) => g.items).find((item) => item.id === active)?.label ?? "";

  /**
   * Flechas entre pestañas (APG). Se aceptan los dos ejes a propósito: la
   * barra lateral es vertical y la tira móvil es horizontal, y el mismo
   * componente sirve a las dos.
   */
  function handleKeyDown(event: React.KeyboardEvent) {
    const KEYS = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
    if (!KEYS.includes(event.key)) return;
    event.preventDefault();

    const index = TAB_ORDER.indexOf(active);
    let next: ConsoleViewId;
    if (event.key === "Home") next = TAB_ORDER[0];
    else if (event.key === "End") next = TAB_ORDER[TAB_ORDER.length - 1];
    else {
      const delta = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
      next = TAB_ORDER[(index + delta + TAB_ORDER.length) % TAB_ORDER.length];
    }

    setActive(next);
    tabRefs.current.get(next)?.focus();
  }

  function tabProps(id: ConsoleViewId) {
    return {
      id: tabId(id),
      role: "tab" as const,
      type: "button" as const,
      "aria-selected": active === id,
      "aria-controls": panelId(id),
      // Roving tabindex: sólo la pestaña activa está en el orden de
      // tabulación; a las demás se llega con las flechas.
      tabIndex: active === id ? 0 : -1,
      onClick: () => setActive(id),
      onKeyDown: handleKeyDown,
      ref: (el: HTMLButtonElement | null) => {
        if (el) tabRefs.current.set(id, el);
        else tabRefs.current.delete(id);
      },
    };
  }

  return (
    <div
      id="gantry-console"
      className="w-full rounded-[24px] border border-white/70 bg-[#eaf2fb]/90 p-2 shadow-[0_60px_140px_-40px_rgba(23,58,102,0.45)] backdrop-blur-sm"
    >
      {/*
        UN SOLO `tablist` en el DOM, que cambia de disposición por CSS. La
        primera versión renderizaba dos —la barra lateral y una tira móvil—
        y eso duplicaba el `id` de cada pestaña: HTML inválido que rompe la
        resolución de `aria-controls`/`aria-labelledby`, y dos listas de
        pestañas equivalentes anunciadas al lector de pantalla. Se detectó al
        probar el móvil, no en revisión.

        En `lg` es la columna izquierda agrupada; por debajo se convierte en
        una tira horizontal desplazable sobre la ventana. Los contenedores de
        grupo usan `display: contents` en móvil para que los botones fluyan
        como hijos directos de la tira, y los títulos de grupo se ocultan.
      */}
      <div className="flex flex-col gap-2 font-sans lg:flex-row">
        <aside className="flex min-w-0 flex-col lg:w-[210px] lg:shrink-0 lg:px-1.5 lg:py-1.5">
          <div className="hidden items-center justify-between px-1 lg:flex">
            <p className="flex items-center gap-1.5 text-[15px] font-semibold leading-none tracking-tight text-ink">
              <GantryMark size={17} />
              {LANDING.nav.brand}
            </p>
            <CollapseIcon size={15} className="text-steel" />
          </div>

          <div className="mt-3.5 hidden items-center gap-2 rounded-[10px] border border-whisper bg-surface px-2.5 py-1.5 text-[12.5px] text-steel shadow-[0_1px_2px_rgba(16,24,40,0.04)] lg:flex">
            <SearchIcon size={13} />
            <span className="flex-1">{c.search}</span>
            <span className="flex items-center gap-1">
              <kbd className="rounded-[5px] border border-whisper bg-sunk/60 px-1 py-0.5 text-[10px] text-steel">
                ⌘
              </kbd>
              <kbd className="rounded-[5px] border border-whisper bg-sunk/60 px-1 py-0.5 text-[10px] text-steel">
                K
              </kbd>
            </span>
          </div>

          {/* Sin `aria-orientation`: la disposición cambia con el ancho y el
              atributo no puede seguirla sin JavaScript. El manejador de
              teclado acepta los dos ejes, así que las flechas funcionan en
              ambas formas. */}
          <div role="tablist" aria-label={c.label} className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0 lg:overflow-x-visible">
            {GROUPS.map((group) => (
              <div key={group.label} className="contents lg:block">
                <p className="hidden px-2.5 pb-1 pt-4 text-[10.5px] font-medium text-steel/80 lg:block">
                  {group.label}
                </p>
                <div className="contents lg:flex lg:flex-col lg:gap-0.5">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      {...tabProps(item.id)}
                      className={`flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-[10px] px-3 text-[12.5px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal lg:w-full lg:rounded-[9px] lg:px-2.5 lg:text-left ${
                        active === item.id
                          ? "bg-gradient-to-b from-ink/90 to-ink text-surface shadow-[0_6px_14px_-6px_rgba(23,32,27,0.6)]"
                          : "text-steel hover:bg-sunk/60 hover:text-ink"
                      }`}
                    >
                      {VIEW_ICONS[item.id]}
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/*
          Altura FIJA en `lg` (no `max-h`): cada vista tiene una altura natural
          distinta (medido: 574px el lienzo, 420px las tablas) y al cambiar de
          pestaña la consola saltaba, arrastrando todo lo que hay debajo. Con
          la ventana fija las seis vistas comparten marco — como una app real,
          donde la ventana no cambia de tamaño al navegar — y el lienzo gana
          además la proporción generosa de la referencia. Las vistas con menos
          contenido dejan aire en blanco abajo, que es exactamente lo que hace
          una app. En móvil (apilado, sin lienzo) la altura sigue natural: ahí
          un alto fijo recortaría el panel apilado.
        */}
        <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-[#e2e9f2] bg-surface lg:flex lg:h-[640px] lg:flex-col">
          {/* Cabecera de la ventana */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-whisper px-4 py-2.5">
            <div className="flex min-w-0 items-center gap-3">
              <h3 className="truncate text-[15px] font-semibold tracking-tight text-ink">
                {activeLabel}
              </h3>
              <div className="hidden items-center gap-2 sm:flex">
                <span className="text-xs text-steel">{c.toggleLabel}</span>
                {/* toggle estático en "on": Señal es el único acento (§3) */}
                <span className="flex h-[18px] w-[32px] items-center rounded-full bg-signal/60 px-[2px]">
                  <span className="ml-auto size-3.5 rounded-full bg-surface shadow-sm" />
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:flex sm:items-center sm:gap-2">
                <IconButton>
                  <ShareIcon size={14} />
                </IconButton>
                <IconButton>
                  <GearIcon size={14} />
                </IconButton>
              </span>
              <span className="flex items-center gap-1.5 rounded-[10px] border border-signal/40 bg-surface px-3 py-1.5 text-[12.5px] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                <SparkleIcon size={13} className="text-signal" />
                <span className="whitespace-nowrap">{view.action}</span>
              </span>
            </div>
          </div>

          <div
            id={panelId(active)}
            role="tabpanel"
            aria-labelledby={tabId(active)}
            tabIndex={0}
            className="lg:min-h-0 lg:flex-1"
          >
            {VIEW_BODIES[active]}
          </div>
        </div>
      </div>
    </div>
  );
}
