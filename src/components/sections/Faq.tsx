import { LANDING } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { SectionRegister } from "@/components/ui/SectionRegister";

// No triad artifact here — see the ruling in faq-report.md's Part 3: this
// section answers objections rather than asserting a product capability
// (§2's rule binds claims, not questions), and manufacturing a DataCard next
// to a "we agree the terms with you" answer would visually overclaim
// something the copy is deliberately not claiming.
export function Faq() {
  const { eyebrow, title, body, items } = LANDING.faq;

  const accordionItems: AccordionItem[] = items.map((item, i) => ({
    id: `faq-${i}`,
    title: item.question,
    content: item.answer,
  }));

  return (
    <SectionRegister register="canvas" className="px-4 py-[clamp(5rem,10vw,9rem)]">
      <div className="mx-auto max-w-content">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} body={body} align="center" />
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mx-auto mt-14 max-w-2xl">
            <Accordion items={accordionItems} />
          </div>
        </Reveal>
      </div>
    </SectionRegister>
  );
}
