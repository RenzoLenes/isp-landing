"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { LANDING } from "@/content/landing";
import type { FlowIcon } from "@/content/landing";
import { CLOUD_WISPS } from "@/lib/cloudTile";
import { useMotionAllowed } from "@/lib/useMotionAllowed";
import { FlowArtifactView } from "@/components/sections/FlowArtifacts";
import {
  ArrowRightIcon,
  BranchIcon,
  DatabaseIcon,
  UserIcon,
  WhatsAppIcon,
} from "@/components/ui/console-icons";

/*
 * «Cómo funciona», como carrusel de dos columnas — la anatomía de la
 * referencia: a la izquierda el titular y un índice de filas separadas por
 * hilos; a la derecha un panel de cielo del que emerge la ilustración.
 *
 * Antes eran cuatro tarjetas en fila. Cuatro tarjetas obligan a leerlas todas
 * a la vez y a repartir el mismo espacio entre las cuatro, así que ninguna
 * podía explicarse: el cuerpo de cada paso cabía en una línea y la
 * ilustración quedaba del tamaño de un sello. Aquí sólo hay un paso a la vez,
 * y por eso puede contarse entero — texto largo a la izquierda, artefacto
 * grande a la derecha.
 *
 * Avanza solo cada `DWELL_MS`, que es lo que hace que la secuencia se lea sin
 * tocar nada. El raíl de la izquierda pinta ese tiempo mientras corre: sin él,
 * un cambio automático parece un fallo. Y se detiene EN CUANTO alguien toca —
 * clic, teclado o foco — porque a partir de ahí quien manda es la persona, no
 * el reloj. Con `prefers-reduced-motion` no arranca nunca: la sección funciona
 * igual como índice manual.
 */

/* Empezó en 7000 y se hacía largo: quien ya leyó el paso se queda esperando
   delante de una pantalla quieta, y esperar es exactamente lo que un carrusel
   automático no debe provocar. 4000 da para leer el cuerpo del paso sin que
   sobre. Sigue siendo más lento que los 3000 de la consola del hero a
   propósito: allí sólo hay que mirar, aquí hay que leer un párrafo — y ese
   párrafo además tarda medio segundo en terminar de desplegarse. */
const DWELL_MS = 4000;

const ICONS: Record<FlowIcon, (props: { size: number; className?: string }) => ReactNode> = {
  mensaje: WhatsAppIcon,
  sistema: DatabaseIcon,
  accion: BranchIcon,
  equipo: UserIcon,
};

const tabId = (i: number) => `flow-step-tab-${i}`;
const panelId = (i: number) => `flow-step-panel-${i}`;

export function SignalFlow() {
  const { steps, stepLabel, eyebrow, title, body } = LANDING.flow;

  const [active, setActive] = useState(0);
  /* Apagado a mano: una vez apagado no vuelve a encenderse en toda la visita. */
  const [stopped, setStopped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const tabRefs = useRef(new Map<number, HTMLButtonElement>());

  const running = useMotionAllowed() && !stopped;

  useEffect(() => {
    if (!running || hovered) return;
    const id = window.setTimeout(
      () => setActive((i) => (i + 1) % steps.length),
      DWELL_MS,
    );
    return () => window.clearTimeout(id);
  }, [active, running, hovered, steps.length]);

  /** Cualquier gesto de la persona apaga el automático para siempre. */
  function select(index: number) {
    setActive(index);
    setStopped(true);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    const KEYS = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
    if (!KEYS.includes(event.key)) return;
    event.preventDefault();

    let next: number;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = steps.length - 1;
    else {
      const delta = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
      next = (active + delta + steps.length) % steps.length;
    }

    select(next);
    tabRefs.current.get(next)?.focus();
  }

  const step = steps[active];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] lg:gap-16">
      {/* Columna de texto: titular, entradilla e índice de pasos. */}
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
          {eyebrow}
        </p>
        <h2 className="mt-4 text-balance font-display text-[clamp(1.9rem,2.6vw,3rem)] font-medium leading-[1.1] tracking-[-0.025em] text-[color:var(--text-primary)]">
          {title}
        </h2>
        <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-[color:var(--text-secondary)]">
          {body}
        </p>

        {/* El hover pausa AQUÍ y sólo aquí.
            Estaba en el contenedor de toda la sección, y eso lo rompía: basta
            con que el cursor descanse en cualquier parte mientras alguien lee
            —que es justo lo que pasa al bajar con el ratón a media pantalla—
            para que el carrusel se congelara y pareciera roto. La intención
            era «no le cambies la vista a quien está a punto de hacer clic», y
            eso son las pestañas, no media página. */}
        <ul
          role="tablist"
          aria-orientation="vertical"
          aria-label={eyebrow}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="mt-9 border-t border-[color:var(--border-subtle)]"
        >
          {steps.map((item, i) => {
            const Icon = ICONS[item.icon];
            const selected = i === active;
            return (
              <li key={item.title} role="presentation" className="border-b border-[color:var(--border-subtle)]">
                <button
                  type="button"
                  role="tab"
                  id={tabId(i)}
                  aria-controls={panelId(i)}
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  ref={(node) => {
                    if (node) tabRefs.current.set(i, node);
                    else tabRefs.current.delete(i);
                  }}
                  onClick={() => select(i)}
                  onFocus={() => setStopped(true)}
                  onKeyDown={handleKeyDown}
                  className="group relative flex w-full min-h-11 items-start gap-3.5 py-4 pl-5 pr-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
                >
                  {/* El raíl: hueco cuando el paso está dormido, lleno cuando
                      está activo. Si el automático corre, se llena de arriba
                      abajo en el tiempo que dura el paso — es el reloj visible
                      del carrusel. */}
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-[2px] overflow-hidden bg-[color:var(--border-subtle)]"
                  >
                    {selected ? (
                      <span
                        key={`${active}-${running && !hovered}`}
                        data-flow-rail={running && !hovered ? "running" : "still"}
                        className="block size-full origin-top bg-signal"
                        style={{ animationDuration: `${DWELL_MS}ms` }}
                      />
                    ) : null}
                  </span>

                  <Icon
                    size={17}
                    className={`mt-0.5 shrink-0 transition-colors ${
                      selected ? "text-signal-deep" : "text-steel group-hover:text-ink"
                    }`}
                  />

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-[15px] font-medium transition-colors ${
                        selected ? "text-ink" : "text-steel group-hover:text-ink"
                      }`}
                    >
                      {item.title}
                    </span>

                    {/* Colapsa con `grid-template-rows` en vez de montarse y
                        desmontarse: así la altura de la lista viaja en vez de
                        saltar cada siete segundos. `aria-hidden` en el paso
                        dormido mantiene el nombre accesible de la pestaña en
                        su titular, sin arrastrar el párrafo. */}
                    <span
                      aria-hidden={!selected}
                      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                        selected ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <span className="overflow-hidden">
                        <span className="block pt-2 text-[13.5px] leading-relaxed text-steel">
                          {item.body}
                        </span>
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Panel de cielo. Altura fija: los cuatro pasos traen textos de largos
          distintos y sin tope el panel encogería y crecería en cada salto. */}
      <div
        role="tabpanel"
        id={panelId(active)}
        aria-labelledby={tabId(active)}
        tabIndex={0}
        className="relative h-[410px] overflow-hidden rounded-[28px] border border-white/60 bg-[linear-gradient(180deg,#7dbdf1_0%,#9ecdf5_32%,#bbdef9_66%,#d6ebfb_100%)] shadow-[0_36px_70px_-40px_rgba(19,29,42,0.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal sm:h-[440px] lg:h-[465px]"
      >
        {/* El cielo del panel es el mismo de la cabecera, en pequeño: la
            sección se apoya en la atmósfera de la página en vez de inventar
            un fondo propio. Los blancos van bajos a propósito — al 45% el
            azul se lavaba y el panel dejaba de leerse como cielo. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            className="sky-drift-slower absolute inset-y-0 -left-[10%] -right-[10%] opacity-30"
            style={{ backgroundImage: CLOUD_WISPS, backgroundSize: "780px 480px" }}
          />
          <div className="absolute -left-[18%] bottom-[-12%] h-[300px] w-[80%] rounded-full bg-white/30 blur-[90px]" />
          <div className="absolute -right-[16%] top-[6%] h-[240px] w-[60%] rounded-full bg-white/20 blur-[100px]" />
        </div>

        {/* Todo lo que cambia va bajo una `key`: al cambiar de paso el bloque
            se vuelve a montar y entra con la animación de `globals.css`. */}
        <div
          key={active}
          data-flow-slide
          className="absolute inset-0 flex flex-col justify-between px-5 py-7 sm:px-9 sm:py-9 lg:px-11"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-signal-deep">
              {stepLabel} {active + 1}
              <span className="text-signal-deep/60"> / {steps.length}</span>
            </span>
            <span className="rounded-[8px] bg-white/70 px-2.5 py-1 text-[11px] font-medium text-signal-deep shadow-[0_6px_14px_-8px_rgba(19,29,42,0.5)]">
              {step.chip}
            </span>
          </div>

          {/* La lámina helada detrás del artefacto: da el grosor de la
              referencia sin inventar contenido que no existe. Lo de dentro
              cambia de forma en cada paso; esto no, y es parte de lo que
              mantiene la secuencia leyéndose como una sola pieza. */}
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-x-4 -inset-y-4 rounded-[22px] border border-white/55 bg-white/25"
            />
            <div className="relative">
              <FlowArtifactView artifact={step.artifact} />
            </div>
          </div>

          {/* El traspaso, en la píldora oscura de la referencia: dice qué pasa
              al salir de este paso. Tres siguen solos; sólo uno llama a una
              persona. Es el dato que convierte cuatro pasos en una cadena. */}
          <p className="mx-auto flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-center text-[12.5px] font-medium text-surface shadow-[0_14px_30px_-14px_rgba(19,29,42,0.8)]">
            <ArrowRightIcon size={15} className="shrink-0 text-signal-field" />
            {step.handoff}
          </p>
        </div>
      </div>
    </div>
  );
}
