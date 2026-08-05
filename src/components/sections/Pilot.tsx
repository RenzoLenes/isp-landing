import { LANDING } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PilotForm } from "@/components/sections/PilotForm";
import { SectionRegister } from "@/components/ui/SectionRegister";

export function Pilot() {
  const { eyebrow, title, body, bullets } = LANDING.pilot;
  return (
    // Sala Oscura (DESIGN.md §2, row 8 — shared with the footer): "the
    // request lands in the strong register."
    <SectionRegister
      register="night"
      id="piloto"
      className="scroll-mt-28 px-4 py-[clamp(5rem,10vw,9rem)]"
    >
      <div className="mx-auto grid max-w-content items-start gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <Reveal>
          <div>
            <SectionHeading eyebrow={eyebrow} title={title} body={body} />
            <ul className="mt-8 flex flex-col gap-3">
              {bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-3 text-[color:var(--text-secondary)]"
                >
                  <span
                    aria-hidden
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-signal"
                  />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <PilotForm />
        </Reveal>
      </div>
    </SectionRegister>
  );
}
