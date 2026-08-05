import type { Metadata } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Replaces Instrument Sans (DESIGN.md §4): Space Grotesk's technical,
// slightly mechanical character matches the subject — signal, network,
// structure — where Instrument Sans read as correct but anonymous. Weights
// requested match every weight actually used with `font-display` in
// `src/`: 400 (the default, unweighted usage) and 700 (Hero.tsx's `h1`,
// the only spot that adds `font-bold`). Asking for a weight that isn't
// loaded here falls back silently, so if a future call site adds
// `font-semibold`/`font-medium` to a `font-display` element, its weight
// must be added to this list too.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "700"],
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
      className={`${geistSans.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-sunk p-2 text-ink font-sans antialiased sm:p-3 md:p-4">
        {/*
          The rounded outer shell (§6): the whole page lives inside this
          container so it reads as an object sitting on `sunk`, not a
          document that bleeds to the viewport edge.

          Each section now paints its own full-bleed register background
          (`SectionRegister`, §2) edge to edge, so this shell's own `bg-canvas`
          is mostly a fallback — visible only where border-radius clips a
          section's corners into the rounded shape, never as a gap between
          sections (they abut with no margin). `GradientField` used to mount
          here as a sibling of `{children}` purely so it had a solid surface
          under it before any section supplied its own background; it now
          lives inside `Hero.tsx`, the one section it was ever scoped to (§2:
          Hero is the Campo Señal register), so this shell no longer needs to
          host it.

          Deliberately NOT using `transform`/`filter`/`will-change:transform`
          here — any of those would create a new containing block for
          descendants with `position: fixed`, and the navbar is fixed. Plain
          `border-radius` + `overflow-hidden` clips the rounded corners
          without touching the containing-block chain, so the fixed navbar
          still pins to the viewport, not to this box. Verified in
          chunk-a-report.md.

          `overflow-hidden` here does not create a second scroll container:
          this box has no explicit height, so it sizes to its content (which
          is taller than the viewport) and the page still scrolls natively.
        */}
        <div className="relative isolate flex flex-1 flex-col overflow-hidden rounded-[1.5rem] bg-canvas shadow-float sm:rounded-[2rem] lg:rounded-[2.5rem]">
          {children}
        </div>
        {/* Grain (§5): fixed at the body level, not inside the rounded
            shell above — the shell's `overflow-hidden` would clip it to the
            shell's own (content-sized, not viewport-sized) box. Sits after
            the shell in DOM order and above it via z-index so it layers
            over every register, including the rounded corners' shadow. */}
        <GrainOverlay />
      </body>
    </html>
  );
}
