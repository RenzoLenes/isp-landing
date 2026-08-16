# Nexo Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir la landing one-page de Nexo (SaaS B2B de IA + WhatsApp para pequeños ISPs de Perú/LatAm) según `docs/superpowers/specs/2026-08-03-nexo-landing-design.md` y `DESIGN.md`.

**Architecture:** One-page narrativa de 8 secciones en Next.js App Router. Server Components estáticos por defecto; islas cliente aisladas (`"use client"`) solo donde hay estado o animación: Navbar (menú móvil), HeroComposition, Reveal, ChatScene, SignalFlow, PilotForm. Todo el copy vive en `src/content/landing.ts`. Tokens visuales en `src/app/globals.css` vía `@theme` de Tailwind 4.

**Tech Stack:** Next.js 16.3 (App Router, `src/app`), React 19, TypeScript, Tailwind CSS 4, `motion` (animaciones, import desde `"motion/react"`), `next/font/google` (Instrument Serif + Geist), Vitest (solo para la validación del formulario).

## Global Constraints

- Todo el contenido visible en **español**. Sin emojis en la UI.
- Paleta exacta del spec: fondo `#F5F7F4`, superficies `#FFFFFF`, texto `#17201B`, secundario `#647168`, azul acción `#5AABFF`, lavanda decorativa `#A7A9EB`, verde solo confirmaciones `#7AD8AD`, coral solo alertas `#E78668`. **Nunca** negro puro ni verde WhatsApp.
- Tipografía: Instrument Serif solo en titulares/citas; Geist en todo lo demás. **Inter está prohibida.**
- Max-width de contenido: **1220px**. Colapso a 1 columna bajo 768px. Cero scroll horizontal.
- Animaciones: solo `transform` y `opacity`; springs suaves (stiffness ~100, damping ~20); todo respeta `prefers-reduced-motion` (vía `useReducedMotion` de motion + media query CSS).
- Prohibido: métricas inventadas, logos de clientes falsos, marcas de terceros (salvo "WhatsApp Business API" como plataforma), 3 tarjetas idénticas en fila, hero centrado, clichés de IA ("revoluciona", "potencia", "next-gen").
- El bloque de AGENTS.md que reescribe `next dev` (`generate-agent-files`) se commitea junto con el trabajo si aparece modificado.
- Ejecutar comandos desde la raíz del repo: `/Users/renzolenes/Desktop/Proyectos/isp-landing-page`.

---

### Task 1: Fundaciones — dependencias, tokens visuales, fuentes y layout raíz

**Files:**
- Modify: `package.json` (vía `npm install`)
- Modify: `src/app/globals.css` (reemplazo completo)
- Modify: `src/app/layout.tsx` (reemplazo completo)

**Interfaces:**
- Consumes: scaffold de create-next-app.
- Produces: utilidades Tailwind `bg-fog`, `bg-fog-deep`, `bg-surface`, `text-ink`, `text-moss`, `bg-blue`, `bg-lavender`, `bg-fiber`, `bg-coral`, `border-whisper`, `shadow-float`, `font-serif`, `font-sans`, `max-w-content`; paquete `motion` instalado; layout con `lang="es"` y fuentes cargadas.

- [ ] **Step 1: Instalar dependencias**

```bash
npm install motion
npm install -D vitest
```

- [ ] **Step 2: Reemplazar `src/app/globals.css` completo**

```css
@import "tailwindcss";

@theme {
  --color-fog: #f5f7f4;
  --color-fog-deep: #eaeeea;
  --color-surface: #ffffff;
  --color-ink: #17201b;
  --color-moss: #647168;
  --color-blue: #5aabff;
  --color-blue-deep: #4a9ef5; /* único hover del azul de acción */
  --color-lavender: #a7a9eb;
  --color-fiber: #7ad8ad;
  --color-coral: #e78668;
  --color-whisper: rgb(23 32 27 / 0.08);

  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--font-instrument-serif), ui-serif, serif;

  --shadow-float: 0 24px 60px -24px rgb(100 113 104 / 0.28);
  --shadow-card: 0 12px 32px -16px rgb(100 113 104 / 0.22);

  --container-content: 76.25rem; /* 1220px */
}

@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

::selection {
  background: rgb(90 171 255 / 0.25);
}

body {
  font-variant-ligatures: common-ligatures;
}
```

> Nota: en Tailwind 4 las utilidades `max-w-<nombre>` derivan del namespace `--container-*` (verificado en `node_modules/tailwindcss/theme.css`, v4.3.3), **no** de `--spacing-*`. Por eso el token es `--container-content`, y habilita `max-w-content` = 1220px.
>
> **Verificación obligatoria de este paso:** tras el build, confirmar que la utilidad existe realmente — por ejemplo agregando temporalmente `max-w-content` a un elemento y comprobando en el CSS generado (`.next/static/css/*.css`) que aparece `max-width:76.25rem`. Si no aparece, el token está en el namespace equivocado y todas las secciones perderían el ancho máximo de 1220px sin error visible.

- [ ] **Step 3: Reemplazar `src/app/layout.tsx` completo**

```tsx
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
```

> `LayoutProps<"/">` es un tipo global de este Next.js — no importarlo, ya existe. No cambiar esa firma.

- [ ] **Step 4: Verificar build**

Run: `npm run build`
Expected: build exitoso, sin errores de tipos ni de CSS.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/app/globals.css src/app/layout.tsx AGENTS.md
git commit -m "feat: fundaciones visuales — tokens, fuentes y layout raíz de Nexo"
```

---

### Task 2: Contenido centralizado (`landing.ts`)

**Files:**
- Create: `src/content/landing.ts`

**Interfaces:**
- Consumes: nada.
- Produces: export nombrado `LANDING` (objeto tipado) y tipos `ChatMessage { from: "cliente" | "bot"; text: string }`, `UseCase`, `Pillar`, `FlowStep`. Todas las secciones leen de aquí; ningún componente hardcodea copy.

- [ ] **Step 1: Crear `src/content/landing.ts`**

```ts
export type ChatMessage = {
  from: "cliente" | "bot";
  text: string;
};

export type UseCase = {
  id: string;
  tag: string;
  title: string;
  description: string;
  chatLabel: string;
  chat: ChatMessage[];
  result: { title: string; meta: string };
};

export type Pillar = {
  number: string;
  title: string;
  body: string;
  visualLabel: string;
};

export type FlowStep = {
  title: string;
  body: string;
};

export const LANDING = {
  nav: {
    brand: "Nexo",
    links: [
      { label: "Producto", href: "#producto" },
      { label: "Casos", href: "#casos" },
      { label: "Cómo funciona", href: "#como-funciona" },
    ],
    cta: { label: "Acceso al piloto", href: "#piloto" },
  },

  hero: {
    eyebrow: "Para pequeños ISPs de Perú y Latinoamérica",
    title: "Una operación más tranquila empieza con una conversación mejor atendida.",
    subtitle:
      "Conecta WhatsApp a tu sistema ISP para responder pagos, soporte e instalaciones con el contexto real de cada cliente.",
    ctaPrimary: { label: "Solicitar acceso al piloto", href: "#piloto" },
    ctaSecondary: { label: "Ver cómo funciona", href: "#como-funciona" },
    composition: {
      chatHeader: "WhatsApp · Marisol Q.",
      chatMessage: "Hola, no tengo internet desde el mediodía.",
      statusLabel: "Consulta al sistema",
      statusTitle: "Servicio activo",
      statusMeta: "Sin deuda · Sin falla masiva en la zona",
      ticketLabel: "Acción automática",
      ticketTitle: "Ticket #184 listo para asignar",
      ticketMeta: "Diagnóstico incluido · Router reiniciado",
    },
  },

  problem: {
    eyebrow: "El día a día",
    title: "Cincuenta chats abiertos, y todos preguntan lo mismo.",
    body: "Cobranzas que se persiguen mensaje por mensaje, el mismo «no tengo internet» a toda hora, y técnicos que salen a campo sin saber qué van a encontrar. No es falta de esfuerzo: es falta de contexto.",
    chaos: [
      "Señor, no tengo internet",
      "¿Hasta cuándo puedo pagar?",
      "Sigo esperando al técnico…",
      "¿Llegan al sector La Planicie?",
      "Ya pagué, le mando el voucher",
      "Se volvió a caer la señal",
    ],
    order: [
      { text: "Señor, no tengo internet", status: "Ticket #184 creado" },
      { text: "Ya pagué, le mando el voucher", status: "Pago validado" },
      { text: "¿Llegan al sector La Planicie?", status: "Instalación agendada" },
    ],
  },

  pillars: {
    eyebrow: "Qué hace Nexo",
    title: "Tres cosas, bien hechas.",
    items: [
      {
        number: "01",
        title: "Responde con el contexto real",
        body: "Nexo saluda a cada cliente sabiendo quién es: su plan, su deuda, su zona y sus tickets anteriores. Nada de respuestas genéricas.",
        visualLabel: "Plan 100 Mbps · Al día · Zona sur",
      },
      {
        number: "02",
        title: "Decide con datos de tu sistema",
        body: "Antes de responder, consulta tu sistema de gestión: ¿hay deuda?, ¿hay corte programado?, ¿hay falla masiva en la zona? La respuesta cambia según lo que encuentra.",
        visualLabel: "Deuda · Cortes · Fallas · Cobertura",
      },
      {
        number: "03",
        title: "Escala a tu equipo con el trabajo hecho",
        body: "Cuando hace falta una persona, el ticket ya llega armado: cliente, diagnóstico y pasos probados. Tu técnico empieza por donde la conversación se quedó.",
        visualLabel: "Ticket con contexto completo",
      },
    ] satisfies Pillar[],
  },

  useCases: {
    eyebrow: "Casos de uso",
    title: "Así se ve en una conversación real.",
    items: [
      {
        id: "soporte",
        tag: "Soporte técnico",
        title: "«No tengo internet», resuelto con contexto",
        description:
          "Nexo verifica el estado del servicio antes de responder, guía una solución básica y, si no alcanza, deja el ticket listo para el técnico.",
        chatLabel: "WhatsApp · Marisol Q.",
        chat: [
          { from: "cliente", text: "Hola, no tengo internet desde el mediodía." },
          {
            from: "bot",
            text: "Hola, Marisol. Veo tu servicio activo y sin deuda pendiente, y no hay falla masiva en tu zona. ¿Probamos reiniciar tu router? Te guío en dos pasos.",
          },
          { from: "cliente", text: "Ya lo reinicié y sigue igual." },
          {
            from: "bot",
            text: "Gracias por intentarlo. Creé el ticket #184 con todo lo que probamos. Un técnico te contacta hoy antes de las 6 p. m.",
          },
        ],
        result: {
          title: "Ticket #184 listo para asignar",
          meta: "Diagnóstico incluido · Router reiniciado · Sin falla masiva",
        },
      },
      {
        id: "cobranza",
        tag: "Cobranza",
        title: "La deuda se consulta sola, el pago se valida solo",
        description:
          "El cliente pregunta, Nexo responde con el monto y la fecha reales de tu sistema, y valida el pago sin que nadie persiga capturas.",
        chatLabel: "WhatsApp · Jorge R.",
        chat: [
          { from: "cliente", text: "¿Cuánto debo y hasta cuándo puedo pagar?" },
          {
            from: "bot",
            text: "Hola, Jorge. Tu recibo de julio es S/ 65 y vence el viernes 8. Puedes pagarlo por transferencia o billetera digital con tu código 4521.",
          },
          { from: "cliente", text: "Listo, ya pagué. Te mando la captura." },
          {
            from: "bot",
            text: "Pago validado. Tu servicio sigue activo y tu próximo recibo llega el 1 de septiembre.",
          },
        ],
        result: {
          title: "Pago validado",
          meta: "Recibo de julio · S/ 65 · Servicio activo",
        },
      },
      {
        id: "instalacion",
        tag: "Ventas e instalaciones",
        title: "De «¿llegan a mi zona?» a instalación agendada",
        description:
          "Nexo consulta cobertura real, cotiza el plan y agenda la instalación en la agenda de tus cuadrillas. Sin idas y vueltas.",
        chatLabel: "WhatsApp · Nuevo contacto",
        chat: [
          { from: "cliente", text: "¿Tienen cobertura en el sector La Planicie?" },
          {
            from: "bot",
            text: "Sí, tenemos fibra en tu zona. El plan de 100 Mbps cuesta S/ 60 al mes, sin costo de instalación. ¿Quieres agendar una visita?",
          },
          { from: "cliente", text: "Sí, ¿puede ser el sábado?" },
          {
            from: "bot",
            text: "Agendado: sábado 10, entre 9 y 11 a. m. Te llega la confirmación por aquí.",
          },
        ],
        result: {
          title: "Instalación agendada",
          meta: "Sábado 10 · 9–11 a. m. · Cuadrilla norte",
        },
      },
    ] satisfies UseCase[],
  },

  flow: {
    eyebrow: "Cómo funciona",
    title: "Del mensaje a la acción, sin fricción manual.",
    steps: [
      {
        title: "Mensaje de WhatsApp",
        body: "El cliente escribe como siempre escribe. No aprende nada nuevo.",
      },
      {
        title: "Consulta a tu sistema",
        body: "Nexo revisa deuda, cortes, fallas y cobertura en tu sistema de gestión.",
      },
      {
        title: "Acción automática",
        body: "Responde, valida un pago, agenda una visita o crea un ticket con contexto.",
      },
      {
        title: "Tu equipo, cuando hace falta",
        body: "Una persona entra con el caso ya armado, no desde cero.",
      },
    ] satisfies FlowStep[],
  },

  integrations: {
    eyebrow: "Integraciones",
    title: "Se conecta a lo que ya usas.",
    body: "Nexo trabaja sobre la API de WhatsApp Business y se integra con tu sistema de gestión ISP vía API. Sin migraciones ni cambios de sistema: tu operación sigue igual, pero mejor atendida.",
    chips: ["WhatsApp Business API", "Tu sistema de gestión", "API abierta"],
  },

  pilot: {
    eyebrow: "Piloto",
    title: "Estamos abriendo un piloto con pocos ISPs.",
    body: "Buscamos operadores de Perú y Latinoamérica para implementar Nexo acompañados por nuestro equipo. Sin permanencia: si no te ordena la operación, no sigues.",
    bullets: [
      "Implementación guiada junto a tu sistema de gestión",
      "Cupos limitados por región",
      "Condiciones preferentes para los primeros pilotos",
    ],
    form: {
      title: "Solicitar acceso al piloto",
      fields: {
        nombre: { label: "Tu nombre", placeholder: "Ej. Carla Mendoza" },
        isp: { label: "Nombre de tu ISP", placeholder: "Ej. Red Andina" },
        ciudad: { label: "Ciudad", placeholder: "Ej. Arequipa" },
        whatsapp: { label: "WhatsApp de contacto", placeholder: "Ej. +51 999 888 777" },
      },
      submit: "Enviar solicitud",
      sending: "Enviando…",
      success: {
        title: "Recibimos tu solicitud.",
        body: "Te escribimos por WhatsApp en menos de 48 horas para coordinar los siguientes pasos.",
      },
    },
  },

  footer: {
    brand: "Nexo",
    tagline: "WhatsApp con contexto real para ISPs de Latinoamérica.",
    contact: "equipoventia@gmail.com",
  },
} as const;
```

- [ ] **Step 2: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/content/landing.ts
git commit -m "feat: contenido centralizado de la landing en español"
```

---

### Task 3: Primitivas de UI compartidas

**Files:**
- Create: `src/components/ui/ButtonLink.tsx`
- Create: `src/components/ui/SectionHeading.tsx`
- Create: `src/components/ui/ChatBubble.tsx`
- Create: `src/components/ui/GlassCard.tsx`
- Create: `src/components/ui/ResultCard.tsx`
- Create: `src/components/ui/Reveal.tsx`

**Interfaces:**
- Consumes: tokens de Task 1, tipo `ChatMessage` de Task 2.
- Produces:
  - `ButtonLink({ href, variant?: "primary" | "ghost", children, className? })` — Server Component, ancla estilizada.
  - `SectionHeading({ eyebrow, title, body?, align?: "left" | "center" })` — Server Component.
  - `ChatBubble({ from, children })` — Server Component; `from: "cliente" | "bot"`.
  - `GlassCard({ children, className? })` — Server Component, tarjeta vidrio esmerilado.
  - `ResultCard({ title, meta })` — Server Component, tarjeta de confirmación (verde fibra).
  - `Reveal({ children, delay?, className? })` — Client Component, entrada al viewport con spring.

- [ ] **Step 1: Crear `src/components/ui/ButtonLink.tsx`**

```tsx
import type { ReactNode } from "react";

const VARIANTS = {
  primary:
    "bg-blue text-surface hover:bg-blue-deep active:translate-y-px shadow-card",
  ghost:
    "border border-whisper bg-surface/60 text-ink hover:border-ink/20 active:translate-y-px",
} as const;

export function ButtonLink({
  href,
  variant = "primary",
  children,
  className = "",
}: {
  href: string;
  variant?: keyof typeof VARIANTS;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-[background-color,border-color,transform] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
```

- [ ] **Step 2: Crear `src/components/ui/SectionHeading.tsx`**

```tsx
export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  align?: "left" | "center";
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-2xl ${alignClass}`}>
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-moss">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-serif text-4xl leading-[1.08] text-balance md:text-5xl">
        {title}
      </h2>
      {body ? (
        <p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-moss">
          {body}
        </p>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 3: Crear `src/components/ui/ChatBubble.tsx`**

```tsx
import type { ReactNode } from "react";

export function ChatBubble({
  from,
  children,
}: {
  from: "cliente" | "bot";
  children: ReactNode;
}) {
  const isCliente = from === "cliente";
  return (
    <div className={`flex ${isCliente ? "justify-start" : "justify-end"}`}>
      <p
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isCliente
            ? "rounded-bl-md border border-whisper bg-surface text-ink"
            : "rounded-br-md bg-fog-deep text-ink"
        }`}
      >
        {children}
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Crear `src/components/ui/GlassCard.tsx`**

```tsx
import type { ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-whisper bg-surface/80 p-5 shadow-float backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 5: Crear `src/components/ui/ResultCard.tsx`**

```tsx
export function ResultCard({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="rounded-2xl border border-fiber/40 bg-fiber/15 px-5 py-4">
      <div className="flex items-center gap-2.5">
        <span aria-hidden className="size-2 rounded-full bg-fiber" />
        <p className="text-sm font-medium text-ink [font-variant-numeric:tabular-nums]">
          {title}
        </p>
      </div>
      <p className="mt-1.5 pl-[18px] text-xs leading-relaxed text-moss [font-variant-numeric:tabular-nums]">
        {meta}
      </p>
    </div>
  );
}
```

- [ ] **Step 6: Crear `src/components/ui/Reveal.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 7: Verificar build**

Run: `npm run build`
Expected: build exitoso (componentes aún sin usar; no debe haber errores de tipos).

- [ ] **Step 8: Commit**

```bash
git add src/components/ui
git commit -m "feat: primitivas de UI — botones, tarjetas, burbujas y reveal"
```

---

### Task 4: Navbar flotante y esqueleto de la página

**Files:**
- Create: `src/components/sections/Navbar.tsx`
- Modify: `src/app/page.tsx` (reemplazo completo)

**Interfaces:**
- Consumes: `LANDING.nav` (Task 2), `ButtonLink` (Task 3).
- Produces: `Navbar()` — Client Component sin props. `page.tsx` renderiza `<Navbar />` + `<main>` donde las tasks siguientes agregan secciones en orden.

- [ ] **Step 1: Crear `src/components/sections/Navbar.tsx`**

```tsx
"use client";

import { useState } from "react";
import { LANDING } from "@/content/landing";
import { ButtonLink } from "@/components/ui/ButtonLink";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { brand, links, cta } = LANDING.nav;

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div className="mx-auto flex max-w-content items-center justify-between rounded-full border border-whisper bg-surface/75 py-2.5 pl-6 pr-2.5 shadow-card backdrop-blur-md md:max-w-3xl">
        <a href="#" className="font-serif text-2xl leading-none text-ink">
          {brand}
        </a>
        <nav aria-label="Principal" className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-moss transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">
          <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
          className="flex size-11 items-center justify-center rounded-full text-ink md:hidden"
        >
          <span aria-hidden className="relative block h-3 w-5">
            <span
              className={`absolute left-0 top-0 h-px w-full bg-ink transition-transform duration-200 ${open ? "translate-y-[5.5px] rotate-45" : ""}`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-full bg-ink transition-transform duration-200 ${open ? "-translate-y-[5.5px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      {open ? (
        <div className="mx-auto mt-2 max-w-content rounded-3xl border border-whisper bg-surface/95 p-6 shadow-float backdrop-blur-md md:hidden">
          <nav aria-label="Principal móvil" className="flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-lg text-ink"
              >
                {link.label}
              </a>
            ))}
            <ButtonLink
              href={cta.href}
              className="mt-2 w-full"
            >
              {cta.label}
            </ButtonLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
```

> Nota: al hacer clic en un enlace del menú móvil se cierra el overlay (`onClick={() => setOpen(false)}`). El CTA ancla al formulario, así que también funciona; no necesita cerrar el menú porque navega en la misma página — si en la revisión visual el menú tapa el destino, envolver `ButtonLink` en un `div onClick={() => setOpen(false)}`.

- [ ] **Step 2: Reemplazar `src/app/page.tsx` completo**

```tsx
import { Navbar } from "@/components/sections/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-x-clip">
        {/* Las secciones se agregan aquí en las tasks siguientes, en este orden:
            Hero, Problem, Pillars, UseCases, HowItWorks, Integrations, Pilot */}
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verificar en dev**

Run: `npm run build`
Expected: build exitoso. (La verificación visual del menú móvil queda para la Task 10.)

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Navbar.tsx src/app/page.tsx
git commit -m "feat: navbar flotante con menú móvil y esqueleto de página"
```

---

### Task 5: Hero con composición flotante

**Files:**
- Create: `src/components/sections/HeroComposition.tsx`
- Create: `src/components/sections/Hero.tsx`
- Modify: `src/app/page.tsx` (agregar `<Hero />` dentro de `<main>`)

**Interfaces:**
- Consumes: `LANDING.hero` (Task 2), `ButtonLink`, `GlassCard`, `ChatBubble` (Task 3).
- Produces: `Hero()` — Server Component. `HeroComposition()` — Client Component sin props (lee `LANDING.hero.composition` directamente).

- [ ] **Step 1: Crear `src/components/sections/HeroComposition.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { LANDING } from "@/content/landing";
import { GlassCard } from "@/components/ui/GlassCard";
import { ChatBubble } from "@/components/ui/ChatBubble";

function FloatingPiece({
  children,
  className,
  delay,
  floatDuration,
}: {
  children: ReactNode;
  className: string;
  delay: number;
  floatDuration: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay }}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.6,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function HeroComposition() {
  const c = LANDING.hero.composition;
  return (
    <div
      className="relative mx-auto aspect-[4/5] w-full max-w-[420px] lg:mx-0"
      role="img"
      aria-label="Composición ilustrativa: un mensaje de WhatsApp se convierte en una consulta al sistema y en un ticket listo para asignar"
    >
      {/* Halos de luz */}
      <div
        aria-hidden
        className="absolute -left-16 top-8 -z-10 size-64 rounded-full bg-lavender/35 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-10 bottom-16 -z-10 size-56 rounded-full bg-blue/25 blur-3xl"
      />

      {/* Hilos de conexión */}
      <svg
        aria-hidden
        viewBox="0 0 400 500"
        fill="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M150 100 C 230 130, 300 170, 310 225"
          stroke="#a7a9eb"
          strokeWidth="1.5"
          strokeDasharray="3 6"
          opacity="0.7"
        />
        <path
          d="M300 300 C 250 360, 180 390, 150 420"
          stroke="#a7a9eb"
          strokeWidth="1.5"
          strokeDasharray="3 6"
          opacity="0.7"
        />
        <circle cx="150" cy="100" r="4" fill="#a7a9eb" />
        <circle cx="310" cy="225" r="4" fill="#5aabff" />
        <circle cx="150" cy="420" r="4" fill="#7ad8ad" />
      </svg>

      {/* 1. Conversación */}
      <FloatingPiece className="absolute left-0 top-2 w-[78%]" delay={0.15} floatDuration={6}>
        <GlassCard>
          <p className="mb-3 text-xs font-medium text-moss">{c.chatHeader}</p>
          <ChatBubble from="cliente">{c.chatMessage}</ChatBubble>
        </GlassCard>
      </FloatingPiece>

      {/* 2. Estado del sistema */}
      <FloatingPiece
        className="absolute right-0 top-[38%] w-[72%]"
        delay={0.45}
        floatDuration={7}
      >
        <GlassCard>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-moss">
            {c.statusLabel}
          </p>
          <div className="mt-2 flex items-center gap-2.5">
            <span aria-hidden className="size-2 rounded-full bg-blue" />
            <p className="text-sm font-medium text-ink">{c.statusTitle}</p>
          </div>
          <p className="mt-1 pl-[18px] text-xs text-moss">{c.statusMeta}</p>
        </GlassCard>
      </FloatingPiece>

      {/* 3. Ticket */}
      <FloatingPiece
        className="absolute bottom-2 left-[4%] w-[76%]"
        delay={0.75}
        floatDuration={8}
      >
        <GlassCard>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-moss">
            {c.ticketLabel}
          </p>
          <div className="mt-2 flex items-center gap-2.5">
            <span aria-hidden className="size-2 rounded-full bg-fiber" />
            <p className="text-sm font-medium text-ink [font-variant-numeric:tabular-nums]">
              {c.ticketTitle}
            </p>
          </div>
          <p className="mt-1 pl-[18px] text-xs text-moss">{c.ticketMeta}</p>
        </GlassCard>
      </FloatingPiece>
    </div>
  );
}
```

- [ ] **Step 2: Crear `src/components/sections/Hero.tsx`**

```tsx
import { LANDING } from "@/content/landing";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { HeroComposition } from "@/components/sections/HeroComposition";

export function Hero() {
  const { eyebrow, title, subtitle, ctaPrimary, ctaSecondary } = LANDING.hero;
  return (
    <section className="relative overflow-hidden px-4">
      {/* Gradiente de niebla del fondo */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_70%_10%,rgb(167_169_235/0.18),transparent_60%),radial-gradient(60%_50%_at_15%_80%,rgb(90_171_255/0.10),transparent_60%)]"
      />
      <div className="mx-auto grid max-w-content gap-14 pb-24 pt-36 md:pt-44 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-10">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-moss">
            {eyebrow}
          </p>
          <h1 className="mt-5 font-serif text-5xl leading-[1.05] text-balance md:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-moss md:text-xl">
            {subtitle}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={ctaPrimary.href}>{ctaPrimary.label}</ButtonLink>
            <ButtonLink href={ctaSecondary.href} variant="ghost">
              {ctaSecondary.label}
            </ButtonLink>
          </div>
        </div>
        <HeroComposition />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Agregar `<Hero />` a `src/app/page.tsx`**

Importar y renderizar como primer hijo de `<main>`:

```tsx
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-x-clip">
        <Hero />
      </main>
    </>
  );
}
```

- [ ] **Step 4: Verificar build**

Run: `npm run build`
Expected: build exitoso.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Hero.tsx src/components/sections/HeroComposition.tsx src/app/page.tsx
git commit -m "feat: hero editorial con composición flotante animada"
```

---

### Task 6: Secciones "El problema" y "Qué hace Nexo" (pilares zig-zag)

**Files:**
- Create: `src/components/sections/Problem.tsx`
- Create: `src/components/sections/Pillars.tsx`
- Modify: `src/app/page.tsx` (agregar `<Problem />` y `<Pillars />` después de `<Hero />`)

**Interfaces:**
- Consumes: `LANDING.problem`, `LANDING.pillars` (Task 2); `SectionHeading`, `Reveal`, `ChatBubble` (Task 3).
- Produces: `Problem()` y `Pillars()` — Server Components. `Pillars` lleva `id="producto"` (ancla de la navbar).

- [ ] **Step 1: Crear `src/components/sections/Problem.tsx`**

```tsx
import { LANDING } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const CHAOS_STYLES = [
  "-rotate-3 self-start",
  "rotate-2 self-end",
  "-rotate-1 self-center",
  "rotate-3 self-start",
  "-rotate-2 self-end",
  "rotate-1 self-center",
];

export function Problem() {
  const { eyebrow, title, body, chaos, order } = LANDING.problem;
  return (
    <section className="px-4 py-[clamp(5rem,10vw,9rem)]">
      <div className="mx-auto max-w-content">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} body={body} />
        </Reveal>
        <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-8">
          {/* Caos */}
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-3">
              {chaos.map((text, i) => (
                <p
                  key={text}
                  className={`w-fit max-w-[80%] rounded-2xl border border-whisper bg-surface px-4 py-2.5 text-sm text-moss shadow-card ${CHAOS_STYLES[i % CHAOS_STYLES.length]}`}
                >
                  {text}
                </p>
              ))}
            </div>
          </Reveal>
          {/* Orden */}
          <Reveal delay={0.25}>
            <div className="flex h-full flex-col justify-center gap-4">
              {order.map((item) => (
                <div
                  key={item.text}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-whisper bg-surface px-5 py-4 shadow-card"
                >
                  <p className="text-sm text-ink">{item.text}</p>
                  <span className="shrink-0 rounded-full bg-fiber/20 px-3 py-1 text-xs font-medium text-ink [font-variant-numeric:tabular-nums]">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Crear `src/components/sections/Pillars.tsx`**

```tsx
import { LANDING } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Pillars() {
  const { eyebrow, title, items } = LANDING.pillars;
  return (
    <section id="producto" className="scroll-mt-28 px-4 py-[clamp(5rem,10vw,9rem)]">
      <div className="mx-auto max-w-content">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} />
        </Reveal>
        <div className="mt-16 flex flex-col gap-16 md:gap-20">
          {items.map((pillar, i) => (
            <Reveal key={pillar.number}>
              <div
                className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${
                  i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <p className="font-serif text-6xl text-lavender">{pillar.number}</p>
                  <h3 className="mt-3 font-serif text-3xl leading-tight text-balance md:text-4xl">
                    {pillar.title}
                  </h3>
                  <p className="mt-4 max-w-[58ch] leading-relaxed text-moss">
                    {pillar.body}
                  </p>
                </div>
                <div className="relative flex min-h-48 items-center justify-center overflow-hidden rounded-3xl border border-whisper bg-[linear-gradient(135deg,rgb(167_169_235/0.16),rgb(90_171_255/0.10))] p-8">
                  <div
                    aria-hidden
                    className="absolute size-40 rounded-full border border-lavender/40"
                  />
                  <div
                    aria-hidden
                    className="absolute size-24 rounded-full border border-lavender/60"
                  />
                  <span className="relative rounded-full border border-whisper bg-surface/85 px-4 py-2 text-xs font-medium text-moss shadow-card backdrop-blur-sm [font-variant-numeric:tabular-nums]">
                    {pillar.visualLabel}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Agregar ambas secciones a `page.tsx`** (después de `<Hero />`, en orden `<Problem />`, `<Pillars />`).

- [ ] **Step 4: Verificar build**

Run: `npm run build`
Expected: build exitoso.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Problem.tsx src/components/sections/Pillars.tsx src/app/page.tsx
git commit -m "feat: secciones de problema y pilares en zig-zag"
```

---

### Task 7: Casos de uso con conversaciones simuladas

**Files:**
- Create: `src/components/sections/ChatScene.tsx`
- Create: `src/components/sections/UseCases.tsx`
- Modify: `src/app/page.tsx` (agregar `<UseCases />` después de `<Pillars />`)

**Interfaces:**
- Consumes: `LANDING.useCases`, tipos `ChatMessage`/`UseCase` (Task 2); `ChatBubble`, `GlassCard`, `ResultCard`, `SectionHeading`, `Reveal` (Task 3).
- Produces: `ChatScene({ label, chat }: { label: string; chat: readonly ChatMessage[] })` — Client Component: los mensajes "llegan" en cascada al entrar al viewport. `UseCases()` — Server Component con `id="casos"`.

- [ ] **Step 1: Crear `src/components/sections/ChatScene.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ChatMessage } from "@/content/landing";
import { ChatBubble } from "@/components/ui/ChatBubble";
import { GlassCard } from "@/components/ui/GlassCard";

export function ChatScene({
  label,
  chat,
}: {
  label: string;
  chat: readonly ChatMessage[];
}) {
  const reduceMotion = useReducedMotion();
  return (
    <GlassCard>
      <p className="mb-4 text-xs font-medium text-moss">{label}</p>
      <div className="flex flex-col gap-3">
        {chat.map((message, i) => (
          <motion.div
            key={i}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: i * 0.28,
            }}
          >
            <ChatBubble from={message.from}>{message.text}</ChatBubble>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
```

- [ ] **Step 2: Crear `src/components/sections/UseCases.tsx`**

```tsx
import { LANDING } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ResultCard } from "@/components/ui/ResultCard";
import { ChatScene } from "@/components/sections/ChatScene";

export function UseCases() {
  const { eyebrow, title, items } = LANDING.useCases;
  return (
    <section id="casos" className="scroll-mt-28 px-4 py-[clamp(5rem,10vw,9rem)]">
      <div className="mx-auto max-w-content">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} />
        </Reveal>
        <div className="mt-16 flex flex-col gap-20 md:gap-24">
          {items.map((useCase, i) => (
            <Reveal key={useCase.id}>
              <div
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="mx-auto w-full max-w-md">
                  <ChatScene label={useCase.chatLabel} chat={useCase.chat} />
                </div>
                <div>
                  <span className="rounded-full border border-whisper bg-surface px-3 py-1 text-xs font-medium text-moss">
                    {useCase.tag}
                  </span>
                  <h3 className="mt-4 font-serif text-3xl leading-tight text-balance md:text-4xl">
                    {useCase.title}
                  </h3>
                  <p className="mt-4 max-w-[58ch] leading-relaxed text-moss">
                    {useCase.description}
                  </p>
                  <div className="mt-6 max-w-sm">
                    <ResultCard
                      title={useCase.result.title}
                      meta={useCase.result.meta}
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Agregar `<UseCases />` a `page.tsx`** (después de `<Pillars />`).

- [ ] **Step 4: Verificar build**

Run: `npm run build`
Expected: build exitoso.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/ChatScene.tsx src/components/sections/UseCases.tsx src/app/page.tsx
git commit -m "feat: casos de uso con escenas de conversación animadas"
```

---

### Task 8: Flujo de señal ("Cómo funciona") e Integraciones

**Files:**
- Create: `src/components/sections/SignalFlow.tsx`
- Create: `src/components/sections/HowItWorks.tsx`
- Create: `src/components/sections/Integrations.tsx`
- Modify: `src/app/page.tsx` (agregar `<HowItWorks />` e `<Integrations />` después de `<UseCases />`)

**Interfaces:**
- Consumes: `LANDING.flow`, `LANDING.integrations` (Task 2); `SectionHeading`, `Reveal` (Task 3).
- Produces: `SignalFlow()` — Client Component sin props (lee `LANDING.flow.steps`); pulsos de señal en loop (solo `opacity`), estáticos con motion reducido. `HowItWorks()` — Server Component con `id="como-funciona"`. `Integrations()` — Server Component.

- [ ] **Step 1: Crear `src/components/sections/SignalFlow.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import { LANDING } from "@/content/landing";

const DOT_POSITIONS = [0.25, 0.5, 0.75];

function SignalDot({
  className,
  style,
  delay,
}: {
  className: string;
  style: React.CSSProperties;
  delay: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      className={`absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lavender ${className}`}
      style={style}
      animate={reduceMotion ? undefined : { opacity: [0.2, 1, 0.2] }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

function Connector({ index }: { index: number }) {
  return (
    <div
      aria-hidden
      className="relative mx-auto h-10 w-px bg-gradient-to-b from-lavender/60 to-lavender/20 lg:mx-0 lg:mt-5 lg:h-px lg:w-auto lg:flex-1 lg:bg-gradient-to-r"
    >
      {/* Apilado: conector vertical, puntos distribuidos por `top`. */}
      {DOT_POSITIONS.map((position, dot) => (
        <SignalDot
          key={`v-${position}`}
          className="left-1/2 lg:hidden"
          style={{ top: `${position * 100}%` }}
          delay={index * 0.4 + dot * 0.3}
        />
      ))}
      {/* En fila: conector horizontal, puntos distribuidos por `left`. */}
      {DOT_POSITIONS.map((position, dot) => (
        <SignalDot
          key={`h-${position}`}
          className="top-1/2 hidden lg:block"
          style={{ left: `${position * 100}%` }}
          delay={index * 0.4 + dot * 0.3}
        />
      ))}
    </div>
  );
}

export function SignalFlow() {
  const { steps } = LANDING.flow;
  return (
    <ol className="mt-16 flex flex-col lg:flex-row lg:items-start">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className={`flex flex-col items-center lg:flex-row lg:items-start ${
            i < steps.length - 1 ? "lg:flex-1" : ""
          }`}
        >
          <div className="flex flex-col items-center text-center lg:w-48">
            <span className="flex size-11 items-center justify-center rounded-full border border-blue/40 bg-blue/10 text-sm font-medium text-ink [font-variant-numeric:tabular-nums]">
              {i + 1}
            </span>
            <h3 className="mt-4 font-medium text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-moss">{step.body}</p>
          </div>
          {i < steps.length - 1 ? <Connector index={i} /> : null}
        </li>
      ))}
    </ol>
  );
}
```

> Nota sobre el `Connector` (ambigüedad resuelta): un solo set de puntos no puede servir a las dos orientaciones, porque el `style` inline gana siempre sobre las clases responsive de Tailwind — con `style={{top}}` los puntos quedarían apilados en desktop en vez de distribuirse a lo largo de la línea horizontal. Por eso se renderizan **dos sets**: uno vertical (`md:hidden`, posicionado por `top`) y uno horizontal (`hidden md:block`, posicionado por `left`), compartiendo el componente `SignalDot` para no duplicar la animación. Solo un set es visible a la vez.
>
> El conector también necesita `md:w-auto` junto a `md:flex-1`: sin eso el `w-px` base sigue aplicando en desktop y la línea horizontal no crece.
>
> **Nota sobre el `<li>`:** un borrador anterior usaba `className="contents"` para que el bloque del paso y el conector fueran hermanos flex directos del `<ol>`. Se descartó: `display: contents` tiene un historial documentado de eliminar el elemento — y en algunas versiones de WebKit su subárbol completo — del árbol de accesibilidad, lo que dejaría a usuarios de lector de pantalla sin el texto de los pasos. Ahora el `<li>` conserva su caja y es él mismo un contenedor flex (columna en móvil, fila en desktop), con `md:flex-1` en todos menos el último para que los conectores repartan el espacio sobrante.
>
> **Nota sobre el breakpoint del flujo (desborde horizontal real):** el flujo pasa a fila en `lg`, no en `md`. Aritmética del contenedor: `section px-4` + `max-w-content` + `px-14` interno dejan ~624px útiles a 768px y ~880px a 1024px. Cuatro bloques de `w-56` (224px) suman 896px, así que a 768px desbordaban por 272px — scroll horizontal, prohibido por el spec — y a 1024px seguían pasándose por 16px. Con `lg:` + `lg:w-48` (192px) el total baja a 768px, dejando ~37px por conector a 1024px y ~113px a 1440px. Además se quitó `shrink-0`: si algún caso queda justo, los pasos se comprimen en vez de desbordar.
>
> **Nota sobre el badge del último paso:** el borrador lo pintaba con `fiber`. Se descartó: la restricción global reserva el verde fibra exclusivamente para confirmaciones, y "Tu equipo, cuando hace falta" es una escalación, no una confirmación. Los cuatro badges usan `blue`.

- [ ] **Step 2: Crear `src/components/sections/HowItWorks.tsx`**

```tsx
import { LANDING } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SignalFlow } from "@/components/sections/SignalFlow";

export function HowItWorks() {
  const { eyebrow, title } = LANDING.flow;
  return (
    <section
      id="como-funciona"
      className="scroll-mt-28 px-4 py-[clamp(5rem,10vw,9rem)]"
    >
      <div className="mx-auto max-w-content rounded-[2.5rem] border border-whisper bg-surface/60 px-6 py-14 md:px-14">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} align="center" />
        </Reveal>
        <Reveal delay={0.15}>
          <SignalFlow />
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Crear `src/components/sections/Integrations.tsx`**

```tsx
import { LANDING } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Integrations() {
  const { eyebrow, title, body, chips } = LANDING.integrations;
  return (
    <section className="px-4 py-[clamp(5rem,10vw,9rem)]">
      <div className="mx-auto grid max-w-content items-center gap-10 md:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} body={body} />
        </Reveal>
        <Reveal delay={0.15}>
          <div className="flex flex-wrap gap-3 md:justify-end">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-whisper bg-surface px-5 py-2.5 text-sm text-ink shadow-card"
              >
                {chip}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Agregar `<HowItWorks />` e `<Integrations />` a `page.tsx`** (después de `<UseCases />`).

- [ ] **Step 5: Verificar build**

Run: `npm run build`
Expected: build exitoso.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/SignalFlow.tsx src/components/sections/HowItWorks.tsx src/components/sections/Integrations.tsx src/app/page.tsx
git commit -m "feat: flujo de señal animado e integraciones"
```

---

### Task 9: Formulario del piloto (TDD) y footer

**Files:**
- Create: `src/lib/pilot.ts`
- Create: `src/lib/pilot.test.ts`
- Create: `src/components/sections/PilotForm.tsx`
- Create: `src/components/sections/Pilot.tsx`
- Create: `src/components/sections/Footer.tsx`
- Modify: `package.json` (agregar script `"test": "vitest run"`)
- Modify: `src/app/page.tsx` (agregar `<Pilot />` al final de `<main>` y `<Footer />` después de `<main>`)

**Interfaces:**
- Consumes: `LANDING.pilot`, `LANDING.footer` (Task 2); `SectionHeading`, `Reveal`, `ButtonLink` (Task 3).
- Produces:
  - `type PilotFormData = { nombre: string; isp: string; ciudad: string; whatsapp: string }`
  - `type PilotFormErrors = Partial<Record<keyof PilotFormData, string>>`
  - `validatePilotForm(data: PilotFormData): PilotFormErrors` — objeto vacío si todo es válido.
  - `submitPilotRequest(data: PilotFormData): Promise<void>` — stub, único punto a conectar con backend futuro.
  - `PilotForm()` — Client Component. `Pilot()` (con `id="piloto"`) y `Footer()` — Server Components.

- [ ] **Step 1: Agregar script de test a `package.json`**

En `"scripts"`, agregar: `"test": "vitest run"`.

- [ ] **Step 2: Escribir el test que falla — `src/lib/pilot.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { validatePilotForm, type PilotFormData } from "./pilot";

const VALID: PilotFormData = {
  nombre: "Carla Mendoza",
  isp: "Red Andina",
  ciudad: "Arequipa",
  whatsapp: "+51 999 888 777",
};

describe("validatePilotForm", () => {
  it("devuelve objeto vacío cuando todos los campos son válidos", () => {
    expect(validatePilotForm(VALID)).toEqual({});
  });

  it("exige cada campo requerido con mensaje en español", () => {
    const errors = validatePilotForm({ nombre: "", isp: "  ", ciudad: "", whatsapp: "" });
    expect(errors.nombre).toBe("Ingresa tu nombre.");
    expect(errors.isp).toBe("Ingresa el nombre de tu ISP.");
    expect(errors.ciudad).toBe("Ingresa tu ciudad.");
    expect(errors.whatsapp).toBe("Ingresa un número de WhatsApp.");
  });

  it("rechaza un WhatsApp con letras", () => {
    expect(
      validatePilotForm({ ...VALID, whatsapp: "no tengo" }).whatsapp,
    ).toBe("Ingresa un número válido (solo dígitos, espacios, + y -).");
  });

  it("rechaza un WhatsApp con menos de 6 dígitos", () => {
    expect(validatePilotForm({ ...VALID, whatsapp: "+51 99" }).whatsapp).toBe(
      "Ingresa un número válido (solo dígitos, espacios, + y -).",
    );
  });

  it("acepta números con espacios, guiones y prefijo internacional", () => {
    expect(validatePilotForm({ ...VALID, whatsapp: "999-888-777" })).toEqual({});
  });

  it("acepta los límites de 6 y 15 dígitos", () => {
    expect(validatePilotForm({ ...VALID, whatsapp: "123456" })).toEqual({});
    expect(
      validatePilotForm({ ...VALID, whatsapp: "+123456789012345" }),
    ).toEqual({});
  });

  it("rechaza más de 15 dígitos", () => {
    expect(
      validatePilotForm({ ...VALID, whatsapp: "+1234567890123456" }).whatsapp,
    ).toBe("Ingresa un número válido (solo dígitos, espacios, + y -).");
  });
});
```

- [ ] **Step 3: Verificar que el test falla**

Run: `npm test`
Expected: FAIL — `Cannot find module './pilot'` (o equivalente).

- [ ] **Step 4: Implementar `src/lib/pilot.ts`**

```ts
export type PilotFormData = {
  nombre: string;
  isp: string;
  ciudad: string;
  whatsapp: string;
};

export type PilotFormErrors = Partial<Record<keyof PilotFormData, string>>;

const WHATSAPP_INVALID =
  "Ingresa un número válido (solo dígitos, espacios, + y -).";

export function validatePilotForm(data: PilotFormData): PilotFormErrors {
  const errors: PilotFormErrors = {};

  if (!data.nombre.trim()) errors.nombre = "Ingresa tu nombre.";
  if (!data.isp.trim()) errors.isp = "Ingresa el nombre de tu ISP.";
  if (!data.ciudad.trim()) errors.ciudad = "Ingresa tu ciudad.";

  const whatsapp = data.whatsapp.trim();
  if (!whatsapp) {
    errors.whatsapp = "Ingresa un número de WhatsApp.";
  } else {
    const digits = whatsapp.replace(/\D/g, "");
    const validChars = /^[+\d\s-]+$/.test(whatsapp);
    if (!validChars || digits.length < 6 || digits.length > 15) {
      errors.whatsapp = WHATSAPP_INVALID;
    }
  }

  return errors;
}

// Punto único de conexión con el backend futuro. Hoy solo resuelve.
export async function submitPilotRequest(_data: PilotFormData): Promise<void> {
  return Promise.resolve();
}
```

- [ ] **Step 5: Verificar que el test pasa**

Run: `npm test`
Expected: PASS (5 tests).

- [ ] **Step 6: Crear `src/components/sections/PilotForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { LANDING } from "@/content/landing";
import {
  submitPilotRequest,
  validatePilotForm,
  type PilotFormData,
  type PilotFormErrors,
} from "@/lib/pilot";

const EMPTY: PilotFormData = { nombre: "", isp: "", ciudad: "", whatsapp: "" };
const FIELD_ORDER = ["nombre", "isp", "ciudad", "whatsapp"] as const;

export function PilotForm() {
  const { form } = LANDING.pilot;
  const [data, setData] = useState<PilotFormData>(EMPTY);
  const [errors, setErrors] = useState<PilotFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validatePilotForm(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSending(true);
    await submitPilotRequest(data);
    setSending(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-3xl border border-fiber/40 bg-fiber/15 p-8"
      >
        <p className="font-serif text-2xl text-ink">{form.success.title}</p>
        <p className="mt-2 leading-relaxed text-moss">{form.success.body}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-whisper bg-surface p-6 shadow-float md:p-8"
    >
      <p className="font-serif text-2xl text-ink">{form.title}</p>
      <div className="mt-6 flex flex-col gap-5">
        {FIELD_ORDER.map((field) => (
          <div key={field}>
            <label
              htmlFor={`pilot-${field}`}
              className="mb-1.5 block text-sm font-medium text-ink"
            >
              {form.fields[field].label}
            </label>
            <input
              id={`pilot-${field}`}
              name={field}
              type={field === "whatsapp" ? "tel" : "text"}
              value={data[field]}
              placeholder={form.fields[field].placeholder}
              aria-invalid={Boolean(errors[field])}
              aria-describedby={errors[field] ? `pilot-${field}-error` : undefined}
              onChange={(e) => {
                const value = e.target.value;
                setData((prev) => ({ ...prev, [field]: value }));
                // Limpia el error en cuanto el usuario corrige: si no, el mensaje
                // y aria-invalid quedan obsoletos junto a un campo ya válido.
                setErrors((prev) =>
                  prev[field] ? { ...prev, [field]: undefined } : prev,
                );
              }}
              className="min-h-11 w-full rounded-xl border border-whisper bg-fog px-4 py-2.5 text-sm text-ink placeholder:text-moss/60 focus:outline-2 focus:outline-offset-1 focus:outline-blue"
            />
            {errors[field] ? (
              <p
                id={`pilot-${field}-error`}
                className="mt-1.5 text-xs text-coral"
              >
                {errors[field]}
              </p>
            ) : null}
          </div>
        ))}
      </div>
      <button
        type="submit"
        disabled={sending}
        className="mt-7 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-blue px-6 py-3 text-sm font-medium text-surface shadow-card transition-[background-color,transform] duration-200 hover:bg-blue-deep active:translate-y-px disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      >
        {sending ? form.sending : form.submit}
      </button>
    </form>
  );
}
```

- [ ] **Step 7: Crear `src/components/sections/Pilot.tsx`**

```tsx
import { LANDING } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PilotForm } from "@/components/sections/PilotForm";

export function Pilot() {
  const { eyebrow, title, body, bullets } = LANDING.pilot;
  return (
    <section id="piloto" className="scroll-mt-28 px-4 py-[clamp(5rem,10vw,9rem)]">
      <div className="mx-auto grid max-w-content items-start gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <Reveal>
          <div>
            <SectionHeading eyebrow={eyebrow} title={title} body={body} />
            <ul className="mt-8 flex flex-col gap-3">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 text-moss">
                  <span
                    aria-hidden
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-blue"
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
    </section>
  );
}
```

- [ ] **Step 8: Crear `src/components/sections/Footer.tsx`**

```tsx
import { LANDING } from "@/content/landing";

export function Footer() {
  const { brand, tagline, contact } = LANDING.footer;
  return (
    <footer className="border-t border-whisper px-4 py-10">
      <div className="mx-auto flex max-w-content flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="font-serif text-2xl text-ink">{brand}</p>
          <p className="mt-1 text-sm text-moss">{tagline}</p>
        </div>
        <div className="text-sm text-moss">
          <a href={`mailto:${contact}`} className="hover:text-ink">
            {contact}
          </a>
          <span className="mx-2" aria-hidden>·</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 9: Completar `src/app/page.tsx` — versión final**

```tsx
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Pillars } from "@/components/sections/Pillars";
import { UseCases } from "@/components/sections/UseCases";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Integrations } from "@/components/sections/Integrations";
import { Pilot } from "@/components/sections/Pilot";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-x-clip">
        <Hero />
        <Problem />
        <Pillars />
        <UseCases />
        <HowItWorks />
        <Integrations />
        <Pilot />
      </main>
      <Footer />
    </>
  );
}
```

> Si `new Date().getFullYear()` en el Footer genera error o warning de prerender en este Next.js (fecha en build estático es aceptable, pero esta versión puede exigir APIs dinámicas explícitas), reemplazar por el literal `2026`.

- [ ] **Step 10: Verificar tests y build**

Run: `npm test && npm run build`
Expected: 5 tests PASS; build exitoso.

- [ ] **Step 11: Commit**

```bash
git add src/lib src/components/sections/PilotForm.tsx src/components/sections/Pilot.tsx src/components/sections/Footer.tsx src/app/page.tsx package.json package-lock.json
git commit -m "feat: formulario del piloto con validación testeada y footer"
```

---

### Task 10: Verificación final — visual, responsive, reduced-motion y lint

**Files:**
- Modify: cualquier archivo que necesite ajustes tras la revisión visual (fixes puntuales, sin refactors).

**Interfaces:**
- Consumes: todo lo anterior.
- Produces: landing verificada en 390/768/1280/1440 px, sin overflow horizontal, lint y build limpios.

- [ ] **Step 1: Lint + tests + build**

Run: `npm run lint && npm test && npm run build`
Expected: todo limpio. Corregir cualquier error antes de seguir.

- [ ] **Step 2: Levantar dev server y verificación de humo**

```bash
npm run dev &   # (en background; anotar el puerto que reporte)
sleep 5
curl -s http://localhost:3000 | grep -o "Una operación más tranquila" | head -1
curl -s http://localhost:3000 | grep -o "Solicitar acceso al piloto" | head -1
curl -s http://localhost:3000 | grep -o "Ticket #184" | head -1
```

Expected: las tres cadenas aparecen en el HTML servido.

- [ ] **Step 3: Revisión visual en 4 viewports**

Con el navegador disponible (o pidiendo al usuario que abra `http://localhost:3000`), verificar en 390 px, 768 px, 1280 px y 1440 px:

- Sin scroll horizontal en ningún viewport (revisar especialmente HeroComposition y SignalFlow).
- Navbar: menú móvil abre/cierra; anclas navegan a `#producto`, `#casos`, `#como-funciona`, `#piloto`.
- Hero: composición flotante legible en móvil (apilada bajo el texto).
- SignalFlow: vertical en móvil, horizontal en desktop; dots pulsando.
- Formulario: enviar vacío muestra errores en coral; envío válido muestra panel de éxito verde.
- Con `prefers-reduced-motion: reduce` activado (Emulación en DevTools o ajuste del SO): sin loops de flotación ni pulsos; el contenido aparece asentado.

Corregir los desajustes encontrados (posiciones de la composición, tamaños tipográficos móviles, paddings) con ediciones puntuales.

- [ ] **Step 4: Detener dev server y commitear ajustes**

```bash
kill %1 2>/dev/null
git add -A
git commit -m "fix: ajustes visuales y responsive tras verificación"
```

(Si no hubo ajustes, omitir el commit.)

---

## Self-Review (ejecutado al escribir el plan)

- **Cobertura del spec:** 8 secciones ✓ (nav T4, hero T5, problema T6, pilares T6, casos T7, cómo funciona T8, integraciones T8, piloto+footer T9); tokens/paleta T1; copy centralizado T2; motion con reduced-motion T3/T5/T7/T8; formulario validado T9; verificación responsive T10.
- **Placeholders:** ninguno — todo el código está completo en el plan.
- **Consistencia de tipos:** `ChatMessage`/`UseCase`/`Pillar`/`FlowStep` definidos en T2 y consumidos con los mismos nombres en T7/T8; `PilotFormData`/`PilotFormErrors` definidos en T9 y usados solo ahí; `LANDING` es `as const`, por eso `ChatScene` acepta `readonly ChatMessage[]`.
