import { LANDING } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const CHAOS_STYLES = [
  "-rotate-3 self-start",
  "rotate-2 self-end",
  "-rotate-1 self-center",
  "rotate-3 self-start",
  "-rotate-2 self-end",
  "rotate-1 self-center",
];

export function Problem() {
  const { eyebrow, title, body, chaos, order } = LANDING.problem;
  return (
    <section className="px-4 py-[clamp(5rem,10vw,9rem)]">
      <div className="mx-auto max-w-content">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} body={body} />
        </Reveal>
        <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-8">
          {/* Caos */}
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-3">
              {chaos.map((text, i) => (
                <p
                  key={text}
                  className={`w-fit max-w-[80%] rounded-2xl border border-whisper bg-surface px-4 py-2.5 text-sm text-moss shadow-card ${CHAOS_STYLES[i % CHAOS_STYLES.length]}`}
                >
                  {text}
                </p>
              ))}
            </div>
          </Reveal>
          {/* Orden */}
          <Reveal delay={0.25}>
            <div className="flex h-full flex-col justify-center gap-4">
              {order.map((item) => (
                <div
                  key={item.text}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-whisper bg-surface px-5 py-4 shadow-card"
                >
                  <p className="text-sm text-ink">{item.text}</p>
                  <span className="shrink-0 rounded-full bg-fiber/20 px-3 py-1 text-xs font-medium text-ink [font-variant-numeric:tabular-nums]">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
