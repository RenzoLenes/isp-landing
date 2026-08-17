import type { CSSProperties, ReactNode } from "react";
import { LANDING } from "@/content/landing";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ProductConsole } from "@/components/sections/ProductConsole";
import { SkyField } from "@/components/ui/SkyField";
import { SectionRegister } from "@/components/ui/SectionRegister";

/*
 * Un paso de la entrada escalonada del hero: píldora → titular → subtítulo →
 * botones → consola.
 *
 * Era `motion`. Ahora son dos líneas de CSS (`[data-beat]` en globals.css) con
 * la MISMA curva: el muelle que había (`stiffness: 100, damping: 20`) sale
 * críticamente amortiguado y está muestreado punto por punto en
 * `--ease-spring`. No es una aproximación con `cubic-bezier`.
 *
 * El cambio se lleva por delante todo el problema de hidratación que este
 * archivo documentaba: no hay `initial` que calcular, ni hook que devuelva una
 * cosa en el servidor y otra en el cliente, así que no hay nada que pueda
 * discrepar. El CSS se aplica desde el primer pintado, incluso antes de
 * hidratar. Con `prefers-reduced-motion` manda `[data-motion-settle]`, igual
 * que antes.
 *
 * Y al quedarse sin `motion`, el hero deja de ser un componente de cliente:
 * ya no lleva estado, ni efectos, ni manejadores. Es HTML servido. Eso saca
 * del navegador no sólo la librería, sino este archivo entero.
 */
function Beat({
  children,
  delay,
  className = "",
}: {
  children: ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <div
      data-motion-settle
      data-beat
      className={className}
      style={{ "--beat": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}

export function Hero() {
  const { badge, title, subtitle, ctaPrimary, ctaSecondary } = LANDING.hero;
  return (
    <SectionRegister
      register="signal-field"
      className="relative isolate overflow-hidden px-4 pb-8 pt-36 md:pt-44"
    >
      {/* El Campo Señal ya no es un degradado: `SkyField` pinta un cielo con
          nubes de ruido fractal (DESIGN.md §2). Sustituye a `GradientField`,
          cuyos parches azules desenfocados leían como degradado y no como
          atmósfera — una elipse con `blur` tiene una sola caída gaussiana y un
          borde liso; una nube tiene estructura en varias escalas y un borde
          deshilachado. */}
      <SkyField />
      <div className="mx-auto flex max-w-content flex-col items-center gap-14">
        <div className="flex flex-col items-center text-center">
          <Beat delay={0}>
            {/* Píldora al estilo Qipeline: blanca casi opaca con un chip
                hundido delante. El copy ("Piloto abierto · ISPs de Perú y
                Latinoamérica") ya trae la separación con «·», así que el chip
                sale de partir ahí — si el copy cambiara a un texto sin
                separador, cae a la píldora simple sin chip. */}
            {badge.includes("·") ? (
              <span className="flex items-center rounded-full bg-surface/95 p-1.5 pr-5 text-[clamp(0.8125rem,0.9vw,0.9375rem)] shadow-[0_8px_24px_-12px_rgba(30,64,120,0.35)]">
                <span className="rounded-full bg-sunk px-3.5 py-1 font-medium text-ink/85">
                  {badge.split("·")[0].trim()}
                </span>
                <span className="pl-2.5 text-ink/85">
                  {badge.split("·").slice(1).join("·").trim()}
                </span>
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-surface/95 px-4 py-1.5 text-[clamp(0.8125rem,0.9vw,0.9375rem)] font-medium text-ink/85 shadow-[0_8px_24px_-12px_rgba(30,64,120,0.35)]">
                {badge}
              </span>
            )}
          </Beat>

          {/* `text-balance` en vez de coaccionar el quiebre con un `max-w`.
              El titular son DOS frases de largo casi idéntico (26 y 28
              caracteres), así que equilibrar las líneas parte exactamente en
              el punto — que es donde debe partir, porque el corte es un hecho
              del contenido, no del ancho disponible.

              El planteamiento anterior (tope en `vw` calibrado a mano sobre la
              anchura de la frase) resistía hasta ~1700px y a 1920 se
              descolocaba: el cuerpo de letra topa en 5rem mientras el `max-w`
              seguía creciendo, así que "Tú" se subía a la primera línea. Un
              `max-w` amplio sigue puesto sólo como tope de medida de lectura.
          */}
          <Beat delay={0.12} className="mt-6 w-full max-w-[min(1160px,74vw)]">
            {/* Peso Medium y tracking -0.03em, no bold: la voz Qipeline lleva
                la jerarquía por escala y color; el bold aquí gritaba. */}
            <h1 className="text-balance font-display text-[clamp(2.25rem,4.4vw,5rem)] font-medium leading-[1.06] tracking-[-0.03em] text-ink">
              {title}
            </h1>
          </Beat>

          {/* `max-w` en `em`, no en px: el límite escala junto con el cuerpo
              de letra, así que el número de palabras por línea es el mismo a
              cualquier ancho y el quiebre no baila. */}
          <Beat delay={0.24} className="mt-6 max-w-[38em]">
            {/* Same `ink/85` move as the badge above (was `ink/70`): the
                strengthened field (Fix 3) left this short by itself under
                the darkest overlap band. */}
            <p className="text-balance text-[clamp(1.0625rem,1.2vw,1.375rem)] leading-[1.55] text-ink/85">
              {subtitle}
            </p>
          </Beat>

          <Beat delay={0.36} className="mt-9">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href={ctaPrimary.href} variant="ink">
                {ctaPrimary.label}
              </ButtonLink>
              <ButtonLink href={ctaSecondary.href} variant="ghost">
                {ctaSecondary.label}
              </ButtonLink>
            </div>
          </Beat>

        </div>
      </div>

      {/* La consola sale del contenedor de lectura a propósito: es la pieza de
          producto, no una ilustración dentro de la columna de texto. Pero su
          tope es proporcional (`min(1320px, 78vw)`), no un `max-w-[1600px]`
          que en la práctica nunca se alcanzaba y dejaba que el ancho real lo
          fijara el padding de la sección: así ocupa la misma fracción del
          viewport en un portátil que en un monitor grande. */}
      <Beat delay={0.5} className="mx-auto mt-14 w-full max-w-[min(1320px,78vw)]">
        <ProductConsole />
      </Beat>
    </SectionRegister>
  );
}
