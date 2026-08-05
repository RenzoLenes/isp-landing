import { LANDING } from "@/content/landing";
import type { PillarArtifact } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { DataCard } from "@/components/ui/DataCard";
import { DecisionChain } from "@/components/ui/DecisionChain";
import { StatusChip } from "@/components/ui/StatusChip";
import { SectionRegister } from "@/components/ui/SectionRegister";

/**
 * The ticket artifact reuses `DataCard`'s row/footer rhythm but replaces its
 * header: the ticket id sits alone on a raised top bar, visually separated
 * from the data rows below by its own `bg-sunk` fill and `border-b`.
 * Pillars 1 and 3 both render "ficha"-shaped data, so this header treatment —
 * not typeface — is what keeps them from reading as the same card with a
 * different chip. The id is set in Geist (this project loads no mono face)
 * with tabular numerals and loosened tracking to read as a distinct record.
 */
function TicketCard({
  artifact,
}: {
  artifact: Extract<PillarArtifact, { kind: "ticket" }>;
}) {
  return (
    // Same chrome-only register adaptation as DataCard/DecisionChain: the
    // card's own fill (and its `bg-sunk` header, and every row inside)
    // stays exactly as-is, since it's always white regardless of the
    // section's register. Only the outer border/shadow read the vars.
    <div className="overflow-hidden rounded-3xl border border-[color:var(--card-border)] bg-surface shadow-[var(--card-shadow)]">
      <div className="flex items-center justify-between gap-3 border-b border-whisper bg-sunk px-6 py-4">
        <p className="text-sm font-medium tracking-wide text-ink [font-variant-numeric:tabular-nums]">
          {artifact.title}
        </p>
        <StatusChip label={artifact.status} tone="neutral" />
      </div>
      <dl className="px-6 pb-2 pt-2">
        {artifact.rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 border-t border-whisper py-2.5 first:border-t-0"
          >
            <dt className="text-xs text-moss">{row.label}</dt>
            <dd className="text-sm text-ink [font-variant-numeric:tabular-nums]">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="flex items-center justify-between gap-4 border-t border-whisper px-6 py-4">
        <span className="text-xs text-moss">{artifact.footerLabel}</span>
        <span className="text-sm font-medium text-ink [font-variant-numeric:tabular-nums]">
          {artifact.footerValue}
        </span>
      </div>
    </div>
  );
}

/** Narrows `PillarArtifact` on `kind` and renders the matching primitive. */
function PillarArtifactView({ artifact }: { artifact: PillarArtifact }) {
  switch (artifact.kind) {
    case "ficha":
      return (
        <DataCard
          title={artifact.title}
          status={{ label: artifact.status, tone: "ok" }}
          rows={artifact.rows}
        />
      );
    case "decision":
      return <DecisionChain checks={artifact.checks} outcome={artifact.outcome} />;
    case "ticket":
      return <TicketCard artifact={artifact} />;
    default: {
      const exhaustive: never = artifact;
      return exhaustive;
    }
  }
}

export function Pillars() {
  const { eyebrow, title, items } = LANDING.pillars;
  return (
    // Sala Oscura (DESIGN.md §2, row 3): "the system thinking," the
    // artifacts glow like lit screens in a dimmed room.
    <SectionRegister
      register="night"
      id="producto"
      className="scroll-mt-28 px-4 py-[clamp(5rem,10vw,9rem)]"
    >
      <div className="mx-auto max-w-content">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} />
        </Reveal>
        <div className="mt-16 flex flex-col gap-16 md:gap-20">
          {items.map((pillar, i) => (
            <Reveal key={pillar.number}>
              <div
                className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${
                  i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  {/* `--accent-text`: signal-deep on light registers,
                      signal itself on night — signal-deep (#1B4F92) is
                      nearly as dark as `night` (#141C19) and would all but
                      disappear; plain signal measures 4.64:1 against night
                      (table, §3), comfortably clearing the 3:1 large-text
                      floor this numeral needs. */}
                  <p className="font-display text-6xl text-[color:var(--accent-text)]">
                    {pillar.number}
                  </p>
                  <h3 className="mt-3 font-display text-3xl leading-tight text-balance text-[color:var(--text-primary)] md:text-4xl">
                    {pillar.title}
                  </h3>
                  <p className="mt-4 max-w-[58ch] leading-relaxed text-[color:var(--text-secondary)]">
                    {pillar.body}
                  </p>
                </div>
                <div className="mx-auto w-full max-w-sm md:mx-0">
                  <PillarArtifactView artifact={pillar.artifact} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionRegister>
  );
}
