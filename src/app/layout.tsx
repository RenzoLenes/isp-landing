import type { Metadata } from "next";
import { Geist, Instrument_Sans } from "next/font/google";
import { GradientField } from "@/components/ui/GradientField";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gantry — WhatsApp con contexto real para tu ISP",
  description:
    "Conecta WhatsApp a tu sistema ISP para responder pagos, soporte e instalaciones con el contexto real de cada cliente. Piloto abierto para ISPs de Perú y Latinoamérica.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-fog-deep p-2 text-ink font-sans antialiased sm:p-3 md:p-4">
        {/*
          The rounded outer shell (§6): the whole page lives inside this
          container so it reads as an object sitting on `fog-deep`, not a
          document that bleeds to the viewport edge. `relative` makes it the
          positioning context for `GradientField`; `isolate` gives it its own
          stacking context so that field and the hero's own local gradient
          resolve their z-order against each other predictably.

          Deliberately NOT using `transform`/`filter`/`will-change:transform`
          here — any of those would create a new containing block for
          descendants with `position: fixed`, and the navbar is fixed. Plain
          `border-radius` + `overflow-hidden` clips the rounded corners (and
          contains GradientField's blur) without touching the containing-block
          chain, so the fixed navbar still pins to the viewport, not to this
          box. Verified in chunk-a-report.md.

          `overflow-hidden` here does not create a second scroll container:
          this box has no explicit height, so it sizes to its content (which
          is taller than the viewport) and the page still scrolls natively.
        */}
        <div className="relative isolate flex flex-1 flex-col overflow-hidden rounded-[1.5rem] bg-fog shadow-float sm:rounded-[2rem] lg:rounded-[2.5rem]">
          <GradientField />
          {children}
        </div>
      </body>
    </html>
  );
}
