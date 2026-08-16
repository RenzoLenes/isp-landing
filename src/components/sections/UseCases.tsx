import { LANDING } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { DataCard } from "@/components/ui/DataCard";
import { ResultCard } from "@/components/ui/ResultCard";
import { SignalThread } from "@/components/ui/SignalThread";
import { SectionRegister } from "@/components/ui/SectionRegister";
import { WhatsAppThread } from "@/components/ui/WhatsAppThread";
import { withQuoteBubbles } from "@/components/ui/QuoteBubble";

/**
 * Connector between the lookup (context) and the result (action). Only the
 * top node is drawn here — the thread terminates into `ResultCard`'s own
 * leading accent dot, which reads as the action node. A second dot here
 * would stack a few pixels above it as a redundant double dot.
 */
function Connector() {
  return (
    <div aria-hidden className="flex flex-col items-center gap-1 self-center py-1.5">
      <span className="size-1.5 shrink-0 rounded-full bg-signal" />
      <div className="h-6 w-px">
        <SignalThread orientation="vertical" />
      </div>
    </div>
  );
}

export function UseCases() {
  const { eyebrow, title, items, daySeparator, composerPlaceholder } = LANDING.useCases;
  return (
    <SectionRegister
      register="surface"
      id="casos"
      className="scroll-mt-28 px-4 py-[clamp(5rem,10vw,9rem)]"
    >
      <div className="mx-auto max-w-content">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} />
        </Reveal>
        <div className="mt-16 flex flex-col gap-20 md:gap-24">
          {items.map((useCase, i) => (
            <Reveal key={useCase.id}>
              <div
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                  i % 2 === 0 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <span className="rounded-full border border-whisper bg-surface px-3 py-1 text-xs font-medium text-steel">
                    {useCase.tag}
                  </span>
                  {/* Las frases del cliente van como burbuja, no entre
                      comillas angulares: a este cuerpo las « » son dos marcas
                      grandes que meten ruido, y aquí hay una forma más
                      literal de decir que lo escribió un cliente. */}
                  <h3 className="mt-4 font-display text-3xl leading-[1.25] text-balance md:text-4xl">
                    {withQuoteBubbles(useCase.title)}
                  </h3>
                  <p className="mt-4 max-w-[58ch] leading-relaxed text-steel">
                    {useCase.description}
                  </p>
                  <div className="mt-6 flex max-w-sm flex-col">
                    <DataCard title={useCase.lookup.title} rows={useCase.lookup.rows} />
                    <Connector />
                    <ResultCard
                      title={useCase.result.title}
                      meta={useCase.result.meta}
                    />
                  </div>
                </div>
                {/* El mismo hilo que la consola del hero, no una tarjeta con
                    burbujas genéricas: es el mismo producto enseñado dos
                    veces y tiene que verse igual. `stagger` escalona las
                    burbujas al entrar en pantalla, que es lo único que esta
                    escena añade sobre la del hero. */}
                <div className="mx-auto w-full max-w-xl">
                  <WhatsAppThread
                    contact={useCase.contact}
                    daySeparator={daySeparator}
                    messages={useCase.chat}
                    composerPlaceholder={composerPlaceholder}
                    scale="comfortable"
                    stagger
                    className="rounded-[20px] border border-whisper shadow-float"
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionRegister>
  );
}
