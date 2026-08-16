import { Reveal } from "@/components/ui/Reveal";
import { SignalFlow } from "@/components/sections/SignalFlow";
import { SectionRegister } from "@/components/ui/SectionRegister";

/*
 * El encabezado ya no vive aquí: en el carrusel de dos columnas es la cabeza
 * de la columna de texto, sobre el índice de pasos, no un bloque centrado
 * encima de todo. Un `SectionHeading` centrado más una rejilla asimétrica
 * debajo dejaban dos ejes distintos en la misma sección.
 */
export function HowItWorks() {
  return (
    <SectionRegister
      register="canvas"
      id="como-funciona"
      className="scroll-mt-28 px-4 py-[clamp(5rem,10vw,9rem)]"
    >
      <div className="mx-auto max-w-content">
        <Reveal>
          <SignalFlow />
        </Reveal>
      </div>
    </SectionRegister>
  );
}
