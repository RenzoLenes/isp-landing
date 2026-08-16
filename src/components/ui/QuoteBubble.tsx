import type { ReactNode } from "react";

/*
 * Una frase que dijo un cliente, dentro de un titular, presentada como la
 * burbuja de mensaje que fue — no entre comillas angulares.
 *
 * Las comillas « » son la convención correcta en español y a cuerpo de texto
 * leen bien, pero a 2rem son dos marcas angulares grandes que meten ruido en
 * mitad del titular. Y en una landing sobre WhatsApp hay una manera más
 * literal de decir «esto lo escribió un cliente»: enseñarlo como mensaje.
 *
 * Todo va en `em`, no en px: la burbuja se dimensiona sola con el titular que
 * la contiene, así que sirve igual en un h3 de sección que en un cuerpo.
 *
 * Sólo para frases dichas por alguien. Una palabra entrecomillada que no es
 * una cita —«depende», «tal vez» en el FAQ— sigue con comillas: convertirla en
 * burbuja afirmaría que alguien la dijo por WhatsApp, y no es verdad.
 */
function QuoteBubble({ children }: { children: ReactNode }) {
  return (
    /*
     * Sin cola. Se probó con una —un cuadrado rotado bajo el borde inferior,
     * para que leyera como burbuja de chat— y dejaba una muesca visible donde
     * su diagonal cruzaba el contorno. El contorno limpio se sostiene solo, y
     * el hilo de WhatsApp que va al lado ya dice que son mensajes.
     */
    <span className="inline-block whitespace-nowrap rounded-[0.45em] border border-signal/35 bg-signal/[0.08] px-[0.34em] py-[0.04em]">
      {children}
    </span>
  );
}

/**
 * Parte un texto por sus comillas angulares y devuelve las citas como
 * burbujas. El contenido sigue guardando `«…»` en `landing.ts` —es la forma
 * correcta de escribirlo— y la decisión de cómo pintarlo vive aquí.
 */
export function withQuoteBubbles(text: string): ReactNode[] {
  return text.split(/(«[^»]*»)/g).map((part, i) =>
    part.startsWith("«") && part.endsWith("»") ? (
      <QuoteBubble key={i}>{part.slice(1, -1)}</QuoteBubble>
    ) : (
      part
    ),
  );
}
