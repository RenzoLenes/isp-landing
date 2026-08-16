import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import "./globals.css";

/*
 * Inter para todo (DESIGN.md §5): la landing adoptó el lenguaje visual de la
 * referencia Qipeline por decisión del cliente, y esa voz es una neo-grotesca
 * clase Helvetica — jerarquía por peso (Medium en titulares, Regular en
 * texto) y tracking apretado, no por cambio de familia. Sustituye al par
 * Geist + Space Grotesk: `--font-sans` y `--font-display` (globals.css)
 * apuntan ambas a esta variable, así que `font-display` sigue funcionando en
 * cada call site sin tocarlos.
 *
 * Inter es variable: todos los pesos vienen en un solo archivo, así que no
 * hay lista de weights que mantener (la trampa de Space Grotesk — pedir un
 * peso no cargado caía en silencio a la sustituta — desaparece).
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gantry — Agente de IA para el WhatsApp de tu ISP o WISP",
  description:
    "Un agente de IA que responde soporte, cobranza e instalaciones por WhatsApp con el plan, la deuda y el historial de cada cliente, leídos de tu sistema de gestión. Piloto abierto para ISPs y WISPs de Perú y Latinoamérica.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-canvas text-ink font-sans antialiased">
        {/*
          A sangre completa (DESIGN.md §8). Antes la página vivía dentro de un
          shell redondeado con padding, sombra y un `bg-sunk` alrededor, para
          que se leyera como un objeto apoyado sobre una mesa. Eso funciona en
          una lámina de presentación; en una página web real deja un marco gris
          permanente en los cuatro bordes del viewport y contradice la premisa
          del Campo Señal, que es un cielo que llega hasta el borde.

          Se conserva el contenedor por dos motivos concretos, no por inercia:
          `relative` es el bloque contenedor de la barra de navegación
          (`absolute inset-x-0 top-0`), y `flex flex-1 flex-col` es lo que
          empuja el footer al fondo cuando el contenido no llena la pantalla.

          Ya no hace falta `overflow-hidden` (existía sólo para recortar las
          esquinas redondeadas): la contención horizontal la hace `main` con
          `overflow-x-clip`, verificada a 320–1440px en scroll-overflow.spec.ts.
          Tampoco `isolate`: el único z-index negativo de la página es el del
          cielo, y la sección del hero abre su propio contexto de apilamiento.

          `bg-canvas` se queda como respaldo — cada sección pinta su propio
          registro a sangre (`SectionRegister`, §2), así que sólo se vería si
          alguna dejara de hacerlo.
        */}
        <div className="relative flex flex-1 flex-col bg-canvas">{children}</div>
        {/* Grain (§6): fixed at the body level, not inside the rounded
            shell above — the shell's `overflow-hidden` would clip it to the
            shell's own (content-sized, not viewport-sized) box. Sits after
            the shell in DOM order and above it via z-index so it layers
            over every register, including the rounded corners' shadow. */}
        <GrainOverlay />
      </body>
    </html>
  );
}
