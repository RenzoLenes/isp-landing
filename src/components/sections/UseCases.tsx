import { LANDING } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ResultCard } from "@/components/ui/ResultCard";
import { ChatScene } from "@/components/sections/ChatScene";

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
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="mx-auto w-full max-w-md">
                  <ChatScene label={useCase.chatLabel} chat={useCase.chat} />
                </div>
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
                  <div className="mt-6 max-w-sm">
                    <ResultCard
                      title={useCase.result.title}
                      meta={useCase.result.meta}
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
