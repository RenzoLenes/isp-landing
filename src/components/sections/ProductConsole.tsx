import { LANDING } from "@/content/landing";
import { DataCard } from "@/components/ui/DataCard";
import { DecisionChain } from "@/components/ui/DecisionChain";
import { ResultCard } from "@/components/ui/ResultCard";
import { StatusChip } from "@/components/ui/StatusChip";
import { ChatBubble } from "@/components/ui/ChatBubble";

/**
 * The hero's product console (spec §5) — replaces the old three floating
 * cards with a single dense mock that reads like a real application window.
 * Server Component: nothing here animates on its own — `Hero.tsx` wraps the
 * whole thing in one staggered entrance step, same grammar as the badge,
 * headline, subtitle and CTAs above it.
 *
 * Three columns at desktop (sidebar / conversations / context). Below `lg`
 * the sidebar is dropped entirely (`hidden lg:flex`) rather than shrunk —
 * four nav labels in a ~70px-wide sliver would be unreadable — and the
 * context column drops out of the 3-col grid to stack *underneath* the
 * conversation column instead (grid falls back to a single column, and the
 * sidebar's `hidden` removes it from flow, so DOM order — conversations,
 * then context — becomes the visual order for free).
 *
 * Cropped by the fold: the frame has `overflow-hidden` and a `max-h` shorter
 * than its natural content height at every breakpoint, so the bottom of the
 * console is visibly cut rather than shrunk to fit — see chunk-b-report.md
 * for the container arithmetic.
 */
export function ProductConsole() {
  const c = LANDING.hero.console;

  return (
    <div
      role="img"
      aria-label="Captura ilustrativa de la consola de Gantry: lista de conversaciones de WhatsApp, la conversación abierta con Marisol Quispe, y su ficha de cliente con la decisión y el ticket resueltos."
      className="mx-auto w-full max-w-content overflow-hidden rounded-[1.75rem] border border-whisper bg-surface shadow-float max-h-[560px] sm:max-h-[600px] lg:max-h-[460px]"
    >
      <div className="grid grid-cols-1 font-sans lg:grid-cols-[200px_minmax(0,1fr)_260px]">
        {/* Sidebar — wordmark + nav, desktop only */}
        <div className="hidden flex-col gap-6 border-whisper bg-fog-deep/40 p-5 lg:flex lg:border-r">
          <p className="font-display text-lg leading-none text-ink">
            {LANDING.nav.brand}
          </p>
          <nav className="flex flex-col gap-1">
            {c.sidebarNav.map((item) => (
              <span
                key={item.label}
                className={`rounded-full px-3 py-2 text-sm ${
                  item.active
                    ? "bg-surface text-ink shadow-card"
                    : "text-moss"
                }`}
              >
                {item.label}
              </span>
            ))}
          </nav>
        </div>

        {/* Conversations — list + the open thread */}
        <div className="flex flex-col border-b border-whisper lg:border-b-0 lg:border-r">
          <div className="border-b border-whisper px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-moss">
              {c.conversationsHeading}
            </p>
          </div>

          <ul className="flex flex-col border-b border-whisper">
            {c.conversations.map((row) => (
              <li
                key={row.name}
                className={`flex items-center justify-between gap-3 border-t border-whisper px-5 py-3 first:border-t-0 ${
                  row.active ? "bg-fog-deep/50" : ""
                }`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  {row.active ? (
                    <span
                      aria-hidden
                      className="size-1.5 shrink-0 rounded-full bg-blue"
                    />
                  ) : null}
                  <span className="truncate text-sm text-ink">{row.name}</span>
                </span>
                <StatusChip label={row.status} tone={row.tone} />
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2 p-5">
            <p className="text-xs text-moss">{c.openConversation.header}</p>
            {c.openConversation.messages.map((message, index) => (
              <ChatBubble key={index} from={message.from}>
                {message.text}
              </ChatBubble>
            ))}
          </div>
        </div>

        {/* Context — client card, resolved decision, ticket action */}
        <div className="flex flex-col gap-4 bg-fog-deep/20 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-moss">
            {c.contextHeading}
          </p>
          <DataCard
            title={c.client.title}
            status={{ label: c.client.status, tone: "ok" }}
            rows={c.client.rows}
            density="compact"
          />
          <DecisionChain
            checks={c.decision.checks}
            outcome={c.decision.outcome}
            density="compact"
          />
          <ResultCard title={c.ticket.title} meta={c.ticket.meta} />
        </div>
      </div>
    </div>
  );
}
