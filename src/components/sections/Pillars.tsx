import { LANDING } from "@/content/landing";
import type { PillarArtifact } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { DataCard } from "@/components/ui/DataCard";
import { DecisionChain } from "@/components/ui/DecisionChain";

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
      return (
        <DataCard
          title={artifact.title}
          status={{ label: artifact.status, tone: "neutral" }}
          rows={artifact.rows}
          footer={
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-moss">{artifact.footerLabel}</span>
              <span className="text-sm font-medium text-ink [font-variant-numeric:tabular-nums]">
                {artifact.footerValue}
              </span>
            </div>
          }
        />
      );
    default: {
      const exhaustive: never = artifact;
      return exhaustive;
    }
  }
}

export function Pillars() {
  const { eyebrow, title, items } = LANDING.pillars;
  return (
    <section id="producto" className="scroll-mt-28 px-4 py-[clamp(5rem,10vw,9rem)]">
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
                  <p className="font-serif text-6xl text-lavender">{pillar.number}</p>
                  <h3 className="mt-3 font-serif text-3xl leading-tight text-balance md:text-4xl">
                    {pillar.title}
                  </h3>
                  <p className="mt-4 max-w-[58ch] leading-relaxed text-moss">
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
    </section>
  );
}
