import { LANDING } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Integrations() {
  const { eyebrow, title, body, chips } = LANDING.integrations;
  return (
    <section className="px-4 py-[clamp(5rem,10vw,9rem)]">
      <div className="mx-auto grid max-w-content items-center gap-10 md:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} body={body} />
        </Reveal>
        <Reveal delay={0.15}>
          <div className="flex flex-wrap gap-3 md:justify-end">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-whisper bg-surface px-5 py-2.5 text-sm text-ink shadow-card"
              >
                {chip}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
