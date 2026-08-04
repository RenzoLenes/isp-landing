import { LANDING } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

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
                <div className="relative flex min-h-48 items-center justify-center overflow-hidden rounded-3xl border border-whisper bg-[linear-gradient(135deg,rgb(167_169_235/0.16),rgb(90_171_255/0.10))] p-8">
                  <div
                    aria-hidden
                    className="absolute size-40 rounded-full border border-lavender/40"
                  />
                  <div
                    aria-hidden
                    className="absolute size-24 rounded-full border border-lavender/60"
                  />
                  <span className="relative rounded-full border border-whisper bg-surface/85 px-4 py-2 text-xs font-medium text-moss shadow-card backdrop-blur-sm [font-variant-numeric:tabular-nums]">
                    {pillar.visualLabel}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
