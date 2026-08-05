import { LANDING } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SignalFlow } from "@/components/sections/SignalFlow";
import { SectionRegister } from "@/components/ui/SectionRegister";

export function HowItWorks() {
  const { eyebrow, title } = LANDING.flow;
  return (
    <SectionRegister
      register="signal-field"
      id="como-funciona"
      className="scroll-mt-28 px-4 py-[clamp(5rem,10vw,9rem)]"
    >
      <div className="mx-auto max-w-content rounded-[2.5rem] border border-whisper bg-surface/60 px-6 py-14 md:px-14">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} align="center" />
        </Reveal>
        <Reveal delay={0.15}>
          <SignalFlow />
        </Reveal>
      </div>
    </SectionRegister>
  );
}
