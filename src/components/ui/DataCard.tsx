import type { ReactNode } from "react";
import { StatusChip } from "@/components/ui/StatusChip";

export type DataCardRow = { label: string; value: string };

export function DataCard({
  title,
  status,
  rows,
  footer,
  className = "",
}: {
  title: string;
  status?: { label: string; tone: "ok" | "alert" | "neutral" };
  rows: readonly DataCardRow[];
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-whisper bg-surface p-6 shadow-card ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-ink">{title}</p>
        {status ? <StatusChip label={status.label} tone={status.tone} /> : null}
      </div>

      <dl className="mt-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 border-t border-whisper py-2.5 first:pt-0 last:pb-0"
          >
            <dt className="text-xs text-moss">{row.label}</dt>
            <dd className="text-sm text-ink [font-variant-numeric:tabular-nums]">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {footer ? (
        <div className="mt-4 border-t border-whisper pt-4">{footer}</div>
      ) : null}
    </div>
  );
}
