import type { ReactNode } from "react";
import { StatusChip } from "@/components/ui/StatusChip";

export type DataCardRow = { label: string; value: string };

export function DataCard({
  title,
  status,
  rows,
  footer,
  density = "comfortable",
  className = "",
}: {
  title: string;
  status?: { label: string; tone: "ok" | "alert" | "neutral" };
  rows: readonly DataCardRow[];
  footer?: ReactNode;
  /**
   * `"comfortable"` (default) is today's full `p-6` chrome — used everywhere
   * this card stands as a primary artifact (hero, pillars, use-cases).
   * `"compact"` trims the chrome for a miniature card (the flow route's
   * consulta step), without shrinking type size below what §4 treats as the
   * floor for legible data rows.
   */
  density?: "comfortable" | "compact";
  className?: string;
}) {
  const isCompact = density === "compact";
  return (
    // DESIGN.md §5, "Artefactos sobre Sala Oscura": the card's fill stays
    // `bg-surface` (white) no matter the register — that's the whole point,
    // it reads as a lit screen — so only the OUTER chrome reacts: border and
    // shadow read `--card-border`/`--card-shadow`, which `night` resolves to
    // "transparent" + a wide soft glow instead of whisper + shadow-card.
    // Every row/label/value below stays hardcoded ink/steel on purpose: they
    // sit against this card's own always-white fill, never against the
    // section's register directly, so they must NOT follow the same
    // variables SectionHeading uses (that would go white-on-white).
    <div
      className={`rounded-3xl border border-[color:var(--card-border)] bg-surface shadow-[var(--card-shadow)] ${isCompact ? "p-4" : "p-6"} ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-ink">{title}</p>
        {status ? <StatusChip label={status.label} tone={status.tone} /> : null}
      </div>

      <dl className={isCompact ? "mt-3" : "mt-4"}>
        {rows.map((row) => (
          <div
            key={row.label}
            className={`flex items-center justify-between gap-4 border-t border-whisper first:pt-0 last:pb-0 ${isCompact ? "py-2" : "py-2.5"}`}
          >
            <dt className="text-xs text-steel">{row.label}</dt>
            <dd className="text-sm text-ink [font-variant-numeric:tabular-nums]">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {footer ? (
        <div
          className={`border-t border-whisper ${isCompact ? "mt-3 pt-3" : "mt-4 pt-4"}`}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}
