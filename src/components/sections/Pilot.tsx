import type { ReactNode } from "react";
import { LANDING, type PilotBullet } from "@/content/landing";
import { CubeIcon, MapPinIcon, WalletIcon } from "@/components/ui/console-icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PilotForm } from "@/components/sections/PilotForm";
import { SectionRegister } from "@/components/ui/SectionRegister";

const BULLET_ICONS: Record<PilotBullet["icon"], ReactNode> = {
  sistema: <CubeIcon size={17} />,
  region: <MapPinIcon size={17} />,
  precio: <WalletIcon size={17} />,
};

export function Pilot() {
  const { eyebrow, title, body, bullets } = LANDING.pilot;
  return (
    // Sala Oscura (DESIGN.md §2, fila 8 — compartida con el footer): "la
    // solicitud aterriza en el registro fuerte".
    <SectionRegister
      register="night"
      id="piloto"
      className="relative isolate scroll-mt-28 overflow-hidden px-4 py-[clamp(5rem,10vw,9rem)]"
    >
      {/* Retícula de fondo (globals.css). El cierre era un plano de color liso
          y es la sección que más importa: la del formulario. La máscara la
          desvanece hacia el centro para que no compita con el texto — la
          textura tiene que notarse en los bordes y desaparecer bajo la lectura. */}
      <div
        aria-hidden
        className="grid-pattern pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(120%_90%_at_50%_50%,transparent_25%,black_85%)]"
      />

      <div className="mx-auto grid max-w-content items-start gap-12 lg:grid-cols-2 lg:gap-16">
        {/*
          La columna izquierda se queda pegada al hacer scroll y los tres
          puntos pasaron a ser filas con glifo, titular y explicación. Antes
          eran tres líneas con un punto delante: la columna se acababa a media
          altura y dejaba un vacío enorme junto a un formulario que seguía
          bajando, así que la sección se leía descuadrada.
        */}
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <SectionHeading eyebrow={eyebrow} title={title} body={body} />

            <ul className="mt-10 flex flex-col">
              {bullets.map((bullet) => (
                <li
                  key={bullet.title}
                  className="flex items-start gap-4 border-t border-[color:var(--border-subtle)] py-5 first:border-t-0 first:pt-0"
                >
                  <span
                    aria-hidden
                    className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-surface/10 text-[color:var(--text-primary)]"
                  >
                    {BULLET_ICONS[bullet.icon]}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-medium text-[color:var(--text-primary)]">
                      {bullet.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-[color:var(--text-secondary)]">
                      {bullet.body}
                    </span>
                  </span>
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
