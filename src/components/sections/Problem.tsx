import { LANDING } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { StatusChip } from "@/components/ui/StatusChip";
import { SectionRegister } from "@/components/ui/SectionRegister";

const CHAOS_STYLES = [
  "-rotate-3 self-start",
  "rotate-2 self-end",
  "-rotate-1 self-center",
  "rotate-3 self-start",
  "-rotate-2 self-end",
  "rotate-1 self-center",
];

export function Problem() {
  const {
    eyebrow,
    title,
    body,
    chaos,
    chaosLabel,
    chaosNote,
    order,
    orderLabel,
    orderNote,
  } = LANDING.problem;

  return (
    <SectionRegister register="surface" className="px-4 py-[clamp(5rem,10vw,9rem)]">
      <div className="mx-auto max-w-content">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} body={body} align="split" />
        </Reveal>

        {/*
          Dos PANELES enfrentados, no dos listas sueltas. Antes las píldoras
          flotaban sobre el blanco de la sección sin nada que las contuviera y
          sin decir cuál era cuál: el contraste antes/después estaba sólo en la
          maquetación y nadie lo leía. Ahora cada lado tiene su superficie, su
          rótulo y su nota, y el de la derecha va teñido de Señal porque es el
          estado al que lleva el producto.
        */}
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col rounded-[20px] border border-whisper bg-canvas p-6 md:p-8">
              <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-steel">
                {chaosLabel}
              </p>
              <div className="mt-6 flex flex-1 flex-col gap-3">
                {chaos.map((text, i) => (
                  <p
                    key={text}
                    className={`w-fit max-w-[85%] rounded-2xl border border-whisper bg-surface px-4 py-2.5 text-sm text-steel shadow-[0_4px_12px_-6px_rgba(19,29,42,0.18)] ${CHAOS_STYLES[i % CHAOS_STYLES.length]}`}
                  >
                    {text}
                  </p>
                ))}
              </div>
              <p className="mt-7 border-t border-whisper pt-4 text-[13px] leading-relaxed text-steel">
                {chaosNote}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="flex h-full flex-col rounded-[20px] border border-signal/25 bg-signal/[0.06] p-6 md:p-8">
              <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-signal-deep">
                {orderLabel}
              </p>
              <div className="mt-6 flex flex-1 flex-col justify-center gap-3">
                {order.map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-whisper bg-surface px-5 py-4 shadow-[0_4px_12px_-6px_rgba(19,29,42,0.18)]"
                  >
                    <p className="text-sm text-ink">{item.text}</p>
                    <span className="shrink-0 [font-variant-numeric:tabular-nums]">
                      <StatusChip label={item.status} tone="ok" />
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-7 border-t border-signal/20 pt-4 text-[13px] leading-relaxed text-steel">
                {orderNote}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </SectionRegister>
  );
}
