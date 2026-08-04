import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Nexo — WhatsApp con contexto real para tu ISP",
  description:
    "Conecta WhatsApp a tu sistema ISP para responder pagos, soporte e instalaciones con el contexto real de cada cliente. Piloto abierto para ISPs de Perú y Latinoamérica.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-fog text-ink font-sans">
        {children}
      </body>
    </html>
  );
}
