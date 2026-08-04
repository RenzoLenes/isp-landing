import { LANDING } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { DataCard } from "@/components/ui/DataCard";
import { ResultCard } from "@/components/ui/ResultCard";
import { SignalThread } from "@/components/ui/SignalThread";
import { ChatScene } from "@/components/sections/ChatScene";

/**
 * Connector between the lookup (context) and the result (action). Only the
 * top node is drawn here — the thread terminates into `ResultCard`'s own
 * leading fiber dot, which reads as the action node. A second fiber dot here
 * would stack a few pixels above it as a redundant double dot.
 */
function Connector() {
  return (
    <div aria-hidden className="flex flex-col items-center gap-1 self-center py-1.5">
      <span className="size-1.5 shrink-0 rounded-full bg-blue" />
      <div className="h-6 w-px">
        <SignalThread orientation="vertical" />
      </div>
    </div>
  );
}

export function UseCases() {
  const { eyebrow, title, items } = LANDING.useCases;
  return (
    <section id="casos" className="scroll-mt-28 px-4 py-[clamp(5rem,10vw,9rem)]">
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
                  <span className="rounded-full border border-whisper bg-surface px-3 py-1 text-xs font-medium text-moss">
                    {useCase.tag}
                  </span>
                  <h3 className="mt-4 font-serif text-3xl leading-tight text-balance md:text-4xl">
                    {useCase.title}
                  </h3>
                  <p className="mt-4 max-w-[58ch] leading-relaxed text-moss">
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
                <div className="mx-auto w-full max-w-md">
                  <ChatScene label={useCase.chatLabel} chat={useCase.chat} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
