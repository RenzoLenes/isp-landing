import type { ReactNode } from "react";
import { LANDING, type ConsoleIntegrationIcon } from "@/content/landing";
import { StatusChip } from "@/components/ui/StatusChip";
import { Avatar, WhatsAppThread } from "@/components/ui/WhatsAppThread";
import {
  AlertIcon,
  ArrowRightIcon,
  BranchIcon,
  ChatIcon,
  CheckIcon,
  ChevronDownIcon,
  CodeIcon,
  DatabaseIcon,
  DotsVerticalIcon,
  GlobeIcon,
  HubIcon,
  LinkIcon,
  MapPinIcon,
  MinusIcon,
  PlusIcon,
  RedoIcon,
  RouterIcon,
  RowsIcon,
  SearchIcon,
  TicketIcon,
  UndoIcon,
  UserIcon,
  WavesIcon,
  XIcon,
} from "@/components/ui/console-icons";

/*
 * Los cuerpos de cada vista de la consola (DESIGN.md §6). Viven aparte de
 * `ProductConsole.tsx` —que es el shell: marco, barra lateral, cabecera y el
 * estado de la pestaña activa— porque juntos superaban con holgura lo que se
 * puede leer de un vistazo.
 *
 * Todos son Server Components puros: no tienen estado propio, sólo pintan el
 * contenido de `LANDING.hero.console.views`. Lo único interactivo de la
 * consola es qué vista se muestra, y eso lo decide el shell.
 */

const V = LANDING.hero.console.views;

/* ------------------------------- primitivas ------------------------------- */

export function IconButton({ children }: { children: ReactNode }) {
  return (
    <span className="flex size-8 items-center justify-center rounded-[10px] border border-whisper bg-surface text-steel shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
      {children}
    </span>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="pb-1.5 pt-3.5 text-xs font-medium text-ink/80">{children}</p>;
}

function FieldBox({ children, muted }: { children: ReactNode; muted?: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-[10px] border border-whisper bg-surface px-3 py-2 text-[13px] shadow-[0_1px_2px_rgba(16,24,40,0.04)] ${
        muted ? "text-steel" : "text-ink"
      }`}
    >
      {children}
    </div>
  );
}

/** Panel lateral derecho: mismo cromo en todas las vistas que lo usan. */
function SidePanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex w-full flex-col overflow-y-auto border-t border-whisper px-4 py-3 lg:w-[264px] lg:shrink-0 lg:border-l lg:border-t-0">
      <div className="flex items-center justify-between">
        <h4 className="text-[13.5px] font-semibold tracking-tight text-ink">{title}</h4>
        <XIcon size={13} className="text-steel" />
      </div>
      {children}
    </div>
  );
}

/* ---------------------------- Conversaciones ------------------------------ */

export function ConversacionesView() {
  const v = V.conversaciones;
  const t = v.thread;

  return (
    <div className="flex flex-col lg:h-full lg:flex-row">
      {/* Columna 1 — lista de chats */}
      <div className="flex shrink-0 flex-col border-b border-whisper lg:w-[236px] lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <div className="flex flex-1 items-center gap-2 rounded-full bg-sunk/70 px-2.5 py-1.5 text-[12px] text-steel">
            <SearchIcon size={13} />
            <span className="truncate">{v.searchPlaceholder}</span>
          </div>
        </div>

        <ul className="flex flex-col">
          {v.list.map((row, index) => (
            <li
              key={row.name}
              className={`flex items-center gap-2.5 px-3 py-2.5 ${
                index === 0 ? "bg-sunk/60" : ""
              }`}
            >
              <Avatar initials={row.initials} />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[13px] font-medium text-ink">{row.name}</span>
                  <span
                    className={`shrink-0 text-[10.5px] ${
                      "unread" in row && row.unread ? "font-medium text-signal-deep" : "text-steel"
                    }`}
                  >
                    {row.time}
                  </span>
                </span>
                <span className="mt-0.5 flex items-center justify-between gap-2">
                  <span className="truncate text-[11.5px] text-steel">{row.preview}</span>
                  {"unread" in row && row.unread ? (
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-signal text-[9.5px] font-medium text-surface">
                      {row.unread}
                    </span>
                  ) : null}
                </span>
                <span className="mt-1 flex">
                  <StatusChip label={row.status} tone={row.tone} />
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Columna 2 — el hilo, el mismo componente que usan las escenas de
          "Casos de uso": es el mismo producto enseñado dos veces. */}
      <WhatsAppThread
        contact={{ name: t.name, initials: t.initials, subtitle: t.subtitle }}
        daySeparator={t.daySeparator}
        messages={t.messages}
        composerPlaceholder={t.composerPlaceholder}
        className="min-w-0 flex-1"
      />

      {/* Columna 3 — lo que añade Gantry */}
      <SidePanel title={v.contextHeading}>
        <div className="mt-2.5 flex items-center justify-between gap-2 rounded-[10px] border border-whisper bg-surface px-3 py-2 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <span className="flex items-center gap-2 text-[13px] font-medium text-ink">
            <UserIcon size={14} className="text-steel" />
            {v.client.title}
          </span>
          <StatusChip label={v.client.status} tone="ok" />
        </div>
        <div className="mt-2 flex flex-col gap-1.5">
          {v.client.rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-2 rounded-[10px] border border-whisper bg-surface px-3 py-2 text-[13px] shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
            >
              <span className="text-steel">{row.label}</span>
              <span className="font-medium text-ink">{row.value}</span>
            </div>
          ))}
        </div>

        <FieldLabel>{v.decisionHeading}</FieldLabel>
        <div className="flex flex-col gap-1.5">
          {v.decision.checks.map((check) => (
            <div
              key={check.question}
              className="flex items-center justify-between gap-2 rounded-[10px] border border-whisper bg-surface px-3 py-2 text-[13px] shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
            >
              <span className="text-steel">{check.question}</span>
              <span className="font-medium text-ink">{check.answer}</span>
            </div>
          ))}
        </div>
        <p className="flex items-center gap-1.5 pt-2 text-[12.5px] font-medium text-signal-deep">
          <span aria-hidden className="size-1.5 rounded-full bg-signal" />
          {v.decision.outcome}
        </p>

        <div className="mt-3 flex items-start gap-2 rounded-[10px] bg-signal/10 px-3 py-2.5">
          <CheckIcon size={14} className="mt-0.5 shrink-0 text-ink" />
          <span className="text-xs leading-relaxed text-ink">
            <span className="font-medium">{v.ticket.title}.</span> {v.ticket.meta}
          </span>
        </div>
      </SidePanel>
    </div>
  );
}

/* ---------------------------- Automatizaciones ---------------------------- */

/*
 * Geometría del lienzo: coordenadas de la esquina superior izquierda de cada
 * nodo de 46px sobre un escenario fijo. Las comparten los nodos y el SVG de
 * conectores —una sola fuente de verdad— para que las líneas siempre lleguen a
 * las cajas.
 */
const NODE = 46;

/*
 * La tarjeta de disparador también es geometría: los conectores salen de su
 * borde inferior y de su borde derecho. Antes esos dos puntos eran números
 * escritos a mano en el `path` y se descolgaban en cuanto la tarjeta se movía.
 * `HEIGHT` está medido sobre el render (pregunta a dos líneas + dos opciones +
 * "añadir paso"); si cambia el copy de la tarjeta, hay que re-medirlo.
 */
const CARD = { left: 28, top: 62, width: 208, height: 166 };

const NODES = {
  message: { left: 100, top: 320 },
  addStep: { left: 300, top: 200 },
  // El nodo que ramifica es la Decisión, no la Consulta: es la decisión la que
  // abre en tres salidas. La Consulta cuelga a la derecha alimentando la
  // cadena, que es exactamente su papel — antes de decidir, Gantry pregunta al
  // sistema de gestión.
  decision: { left: 300, top: 320 },
  lookup: { left: 552, top: 128 },
  ticket: { left: 205, top: 452 },
  technician: { left: 300, top: 452 },
  reply: { left: 395, top: 452 },
};

const center = (n: { left: number; top: number }) => ({
  x: n.left + NODE / 2,
  y: n.top + NODE / 2,
});

function Connectors() {
  const message = center(NODES.message);
  const addStep = center(NODES.addStep);
  const decision = center(NODES.decision);
  const lookup = center(NODES.lookup);
  const ticket = center(NODES.ticket);
  const reply = center(NODES.reply);
  const branchY = decision.y + 60;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      fill="none"
      stroke="#c6cdd6"
      strokeWidth="1.5"
      aria-hidden
    >
      {/* tarjeta → nodo mensaje, y tarjeta → "añadir paso" */}
      <path d={`M${message.x} ${CARD.top + CARD.height} V${NODES.message.top - 6}`} />
      <path
        d={`M${CARD.left + CARD.width} ${CARD.top + 80} H${addStep.x - 8} q8 0 8 8 V${NODES.addStep.top - 6}`}
      />
      <path
        d={`M${NODES.lookup.left - 6} ${lookup.y} H${addStep.x + 150} q-8 0 -8 8 v${addStep.y - lookup.y - 16} q0 8 -8 8 H${NODES.addStep.left + 112}`}
      />
      <path d={`M${addStep.x} ${NODES.addStep.top + NODE + 6} V${NODES.decision.top - 6}`} />
      <path
        d={`M${decision.x} ${NODES.decision.top + NODE + 6} V${branchY - 8} q0 8 -8 8 H${ticket.x + 8} q-8 0 -8 8 V${NODES.ticket.top - 6}`}
      />
      <path d={`M${decision.x} ${branchY} V${NODES.technician.top - 6}`} />
      <path
        d={`M${decision.x} ${branchY - 8} q0 8 8 8 H${reply.x - 8} q8 0 8 8 V${NODES.reply.top - 6}`}
      />
    </svg>
  );
}

function FlowNode({
  icon,
  label,
  selected,
  labelBelow,
  style,
}: {
  icon: ReactNode;
  label?: string;
  selected?: boolean;
  labelBelow?: boolean;
  style: { left: number; top: number };
}) {
  return (
    <div className="absolute flex items-center gap-2.5" style={style}>
      <div className="relative">
        {selected ? (
          <span className="absolute -inset-[5px] rounded-[15px] border border-dashed border-signal/60" />
        ) : null}
        <span className="flex size-[46px] items-center justify-center rounded-[12px] border border-whisper bg-surface text-ink shadow-[0_4px_10px_-4px_rgba(16,24,40,0.15)]">
          {icon}
        </span>
        {label && labelBelow ? (
          <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[11.5px] text-steel">
            {label}
          </span>
        ) : null}
      </div>
      {label && !labelBelow ? (
        <span className="whitespace-nowrap text-[12px] text-steel">{label}</span>
      ) : null}
    </div>
  );
}

function TriggerCard() {
  const t = V.automatizaciones.canvas.trigger;
  return (
    <div
      className="absolute rounded-[14px] border border-whisper bg-surface p-3.5 shadow-[0_10px_24px_-12px_rgba(16,24,40,0.2)]"
      style={{ left: CARD.left, top: CARD.top, width: CARD.width }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-medium leading-snug text-ink">{t.question}</p>
        <DotsVerticalIcon size={15} className="mt-0.5 shrink-0 text-steel" />
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {t.options.map((option, index) => (
          <div
            key={option}
            className={`flex items-center justify-between rounded-[9px] border px-3 py-2 text-[12.5px] ${
              index === 0
                ? "border-signal/50 bg-signal/[0.06] font-medium text-ink"
                : "border-whisper text-steel"
            }`}
          >
            {option}
            <ArrowRightIcon size={13} className="text-steel" />
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-1.5 px-1 text-[12.5px] text-steel">
        <PlusIcon size={12} className="text-signal" />
        {t.addAction}
      </div>
    </div>
  );
}

function FlowCanvas() {
  const n = V.automatizaciones.canvas.nodes;
  return (
    <div className="relative hidden min-w-0 flex-1 lg:block">
      <div className="absolute inset-0 bg-[radial-gradient(circle,#d7dde4_1.2px,transparent_1.2px)] [background-size:24px_24px]" />

      <div className="relative h-full min-h-[560px]">
        <div className="absolute left-3.5 top-3.5 flex gap-1.5">
          <IconButton>
            <UndoIcon size={14} />
          </IconButton>
          <IconButton>
            <RedoIcon size={14} />
          </IconButton>
        </div>
        <div className="absolute right-3.5 top-3.5 flex items-center gap-2">
          <IconButton>
            <MinusIcon size={14} />
          </IconButton>
          <span className="text-[12.5px] font-medium text-ink/80">
            {LANDING.hero.console.zoom}
          </span>
          <IconButton>
            <PlusIcon size={14} />
          </IconButton>
        </div>

        <Connectors />
        <TriggerCard />

        <FlowNode icon={<ChatIcon size={19} />} selected style={NODES.message} label={n.message} />
        <FlowNode icon={<PlusIcon size={17} />} style={NODES.addStep} label={n.addStep} />
        <FlowNode
          icon={<BranchIcon size={19} />}
          selected
          style={NODES.decision}
          label={n.decision}
        />
        <FlowNode
          icon={<DatabaseIcon size={19} />}
          style={NODES.lookup}
          label={n.lookup}
          labelBelow
        />
        <FlowNode
          icon={<TicketIcon size={19} />}
          style={NODES.ticket}
          label={n.ticket}
          labelBelow
        />
        <FlowNode
          icon={<UserIcon size={19} />}
          style={NODES.technician}
          label={n.technician}
          labelBelow
        />
        <FlowNode icon={<ChatIcon size={19} />} style={NODES.reply} label={n.reply} labelBelow />
      </div>
    </div>
  );
}

/*
 * Bajo `lg` el lienzo no puede reflowear (coordenadas absolutas), así que los
 * mismos pasos se presentan como una lista vertical: legible en un teléfono y
 * con el mismo contenido, en vez de un diagrama recortado que leería como roto.
 */
function FlowList() {
  const v = V.automatizaciones;
  const n = v.canvas.nodes;
  const steps = [
    { icon: <ChatIcon size={16} />, label: n.message, detail: v.canvas.trigger.options[0] },
    { icon: <DatabaseIcon size={16} />, label: n.lookup, detail: v.panel.status },
    { icon: <BranchIcon size={16} />, label: n.decision, detail: v.canvas.decisionLine },
    { icon: <TicketIcon size={16} />, label: n.ticket, detail: n.technician },
  ];
  return (
    <ol className="flex min-w-0 flex-col gap-2 p-4 lg:hidden">
      {steps.map((step, index) => (
        <li key={step.label} className="flex items-start gap-3">
          <span className="relative flex flex-col items-center">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[11px] border border-whisper bg-surface text-ink shadow-[0_4px_10px_-4px_rgba(16,24,40,0.15)]">
              {step.icon}
            </span>
            {index < steps.length - 1 ? (
              <span aria-hidden className="mt-1 h-5 w-px bg-whisper" />
            ) : null}
          </span>
          <span className="min-w-0 pt-1.5">
            <span className="block text-[13px] font-medium text-ink">{step.label}</span>
            <span className="block truncate text-xs text-steel">{step.detail}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

function QueryField() {
  const p = V.automatizaciones.panel;
  return (
    <>
      <FieldLabel>{p.queryLabel}</FieldLabel>
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <FieldBox muted>
            <RowsIcon size={14} />
            <span className="truncate">{p.queryPlaceholder}</span>
          </FieldBox>
        </div>
        <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] border border-whisper bg-surface text-steel shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <PlusIcon size={14} />
        </span>
      </div>
      <div className="flex items-center gap-1.5 pt-2 text-xs font-medium text-signal-deep">
        <PlusIcon size={12} />
        {p.addValue}
      </div>
    </>
  );
}

export function AutomatizacionesView() {
  const p = V.automatizaciones.panel;
  return (
    <div className="flex flex-col lg:h-full lg:flex-row">
      <FlowCanvas />
      <FlowList />

      <SidePanel title={p.title}>
        <div className="mt-2.5 flex items-center gap-1 rounded-[10px] bg-sunk/70 p-1 text-[11.5px]">
          {p.tabs.map((tab, index) => (
            <span
              key={tab}
              className={
                index === 0
                  ? "flex flex-1 items-center justify-center gap-1 rounded-[7px] bg-surface px-1.5 py-1 font-medium text-ink shadow-[0_1px_3px_rgba(16,24,40,0.1)]"
                  : "flex flex-1 items-center justify-center gap-1 rounded-[7px] px-1.5 py-1 text-steel"
              }
            >
              {index === 0 ? <CheckIcon size={12} /> : null}
              {tab}
            </span>
          ))}
        </div>

        <FieldLabel>{p.methodLabel}</FieldLabel>
        <FieldBox>
          <LinkIcon size={14} className="text-steel" />
          <span className="flex-1">{p.method}</span>
          <ChevronDownIcon size={14} className="text-steel" />
        </FieldBox>

        <FieldLabel>{p.urlLabel}</FieldLabel>
        <FieldBox muted>
          <GlobeIcon size={14} />
          <span className="truncate">{p.url}</span>
        </FieldBox>

        <QueryField />

        {/* Donde la referencia enseña un error de autenticación en rojo, Gantry
            enseña la conexión verificada en el tono semántico de éxito. */}
        <div className="mt-3 flex items-start gap-2 rounded-[10px] bg-signal/10 px-3 py-2.5">
          <CheckIcon size={14} className="mt-0.5 shrink-0 text-ink" />
          <span className="text-xs leading-relaxed text-ink">{p.status}</span>
        </div>

        <FieldLabel>{p.descriptionLabel}</FieldLabel>
        <div className="rounded-[10px] border border-whisper bg-surface px-3 pb-7 pt-2 text-[13px] text-steel shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          {p.descriptionPlaceholder}
        </div>
      </SidePanel>
    </div>
  );
}

/* ------------------------- vistas de lista/registro ------------------------ */

/*
 * Tickets, Cobranza, Integraciones y Equipo eran cuatro tablas idénticas de
 * 4-5 columnas. Leían como una hoja de cálculo: nada indicaba cuál es el dato
 * importante de cada fila, y las cuatro vistas se confundían entre sí. Ahora
 * cada una tiene la forma que pide su contenido — el motivo manda en un
 * ticket, el monto en un cobro, el sistema en una integración — con una
 * cabecera de columna sólo donde aporta.
 */

/** Cabecera fina de sección dentro de una vista. */
function ListHeader({ children }: { children: ReactNode }) {
  return (
    <p className="border-b border-whisper px-4 py-2 text-[10.5px] font-medium uppercase tracking-[0.14em] text-steel">
      {children}
    </p>
  );
}

function ListNote({ children }: { children: ReactNode }) {
  return (
    <p className="border-b border-whisper px-4 py-2.5 text-xs leading-relaxed text-steel">
      {children}
    </p>
  );
}

/** Tejuelo cuadrado de icono, el mismo en todas las vistas de lista. */
function IconTile({
  children,
  active,
  size = 34,
}: {
  children: ReactNode;
  active?: boolean;
  size?: number;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-[10px] ${
        active ? "bg-signal/12 text-signal-deep" : "bg-sunk/70 text-steel"
      }`}
      style={{ width: size, height: size }}
    >
      {children}
    </span>
  );
}

export function TicketsView() {
  const v = V.tickets;
  return (
    <div className="flex flex-col">
      <ListHeader>Cola de tickets</ListHeader>
      <ul className="flex flex-col">
        {v.items.map((item) => {
          const abierto = item.tone === "alert";
          return (
            <li
              key={item.id}
              className="flex items-start gap-3 border-b border-whisper px-4 py-3 last:border-b-0"
            >
              <IconTile active={abierto}>
                {abierto ? <AlertIcon size={16} /> : <CheckIcon size={16} />}
              </IconTile>

              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  {/* El número en tabular: los ids se comparan en vertical. */}
                  <span className="shrink-0 text-[12px] font-medium tabular-nums text-steel">
                    {item.id}
                  </span>
                  <span className="truncate text-[13.5px] font-medium text-ink">
                    {item.motivo}
                  </span>
                </span>
                <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-steel">
                  <span className="flex items-center gap-1">
                    <UserIcon size={12} />
                    {item.cliente}
                  </span>
                  {"zona" in item && item.zona ? (
                    <span className="flex items-center gap-1">
                      <MapPinIcon size={12} />
                      {item.zona}
                    </span>
                  ) : null}
                  <span className="flex items-center gap-1">
                    <TicketIcon size={12} />
                    {item.tecnico}
                  </span>
                </span>
              </span>

              <StatusChip label={item.status} tone={item.tone} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function CobranzaView() {
  const v = V.cobranza;
  return (
    <div className="flex flex-col">
      <ListHeader>Recibos del período</ListHeader>
      <ul className="flex flex-col">
        {v.items.map((item) => (
          <li
            key={item.cliente}
            className="flex items-center gap-3 border-b border-whisper px-4 py-3 last:border-b-0"
          >
            <Avatar initials={item.initials} size={34} />

            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-medium text-ink">
                {item.cliente}
              </span>
              <span className="mt-0.5 block truncate text-[11.5px] text-steel">
                {item.concepto} · {item.vence}
              </span>
            </span>

            <span className="flex shrink-0 flex-col items-end gap-1">
              {/* El monto es el dato que se escanea: alineado a la derecha y
                  en cifras tabulares para que las columnas cuadren. */}
              <span className="text-[14px] font-medium tabular-nums text-ink">
                {item.monto}
              </span>
              <StatusChip label={item.status} tone={item.tone} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const INTEGRATION_ICONS: Record<ConsoleIntegrationIcon, ReactNode> = {
  router: <RouterIcon size={17} />,
  waves: <WavesIcon size={17} />,
  hub: <HubIcon size={17} />,
  chat: <ChatIcon size={17} />,
  code: <CodeIcon size={17} />,
};

export function IntegracionesView() {
  const v = V.integraciones;
  return (
    <div className="flex flex-col">
      <ListNote>{v.note}</ListNote>
      <ul className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2">
        {v.items.map((item) => (
          <li
            key={item.name}
            /* Las conectadas se ven conectadas: borde de Señal y tejuelo
               teñido. Las disponibles quedan en gris con su acción a la vista.
               Antes las cinco eran la misma tarjeta con el mismo cubo. */
            className={`flex items-center justify-between gap-3 rounded-[12px] border px-3 py-2.5 ${
              item.connected
                ? "border-signal/30 bg-signal/[0.05]"
                : "border-whisper bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
            }`}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <IconTile active={item.connected} size={32}>
                {INTEGRATION_ICONS[item.icon]}
              </IconTile>
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-medium text-ink">
                  {item.name}
                </span>
                <span className="block truncate text-[11.5px] text-steel">{item.role}</span>
              </span>
            </span>

            {item.connected ? (
              <StatusChip label={item.status} tone={item.tone} />
            ) : (
              <span className="flex shrink-0 items-center gap-1 rounded-[8px] border border-whisper px-2 py-1 text-[11.5px] font-medium text-steel">
                <PlusIcon size={11} />
                {v.connectAction}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EquipoView() {
  const v = V.equipo;
  return (
    <div className="flex flex-col">
      <ListNote>{v.note}</ListNote>
      <ul className="flex flex-col">
        {v.items.map((item) => {
          const asignado = "nombre" in item && item.nombre;
          return (
            <li
              key={item.rol}
              className="flex items-center gap-3 border-b border-whisper px-4 py-3 last:border-b-0"
            >
              {asignado ? (
                <Avatar initials={item.initials} size={34} />
              ) : (
                /* Plaza vacante: círculo punteado, no un avatar con un guion.
                   La forma ya dice que falta alguien. */
                <span
                  aria-hidden
                  className="flex size-[34px] shrink-0 items-center justify-center rounded-full border border-dashed border-whisper text-steel"
                >
                  <PlusIcon size={14} />
                </span>
              )}

              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-medium text-ink">
                  {asignado ? item.nombre : v.vacantLabel}
                </span>
                <span className="mt-0.5 block truncate text-[11.5px] text-steel">
                  {item.rol} · {item.alcance}
                </span>
              </span>

              <StatusChip label={item.status} tone={item.tone} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
