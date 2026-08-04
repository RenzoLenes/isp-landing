# Spec de diseño — Landing page de Nexo

**Fecha:** 2026-08-03
**Estado:** Aprobado en brainstorming (enfoque A: one-page narrativa con motion selectivo)

## 1. Qué se construye

Una landing page responsive de una sola página para **Nexo**, SaaS B2B de IA + WhatsApp
para pequeños ISPs de Perú y Latinoamérica. La página vende **acceso a un piloto**, no
una suscripción. Todo el contenido está en español.

Idea emocional: *"Transformamos el caos de los mensajes de WhatsApp en una operación
clara y tranquila."* La marca debe sentirse calmada, editorial y premium — nunca una
telco tradicional, un dashboard oscuro ni una landing genérica de chatbot.

## 2. Arquitectura técnica

- **Stack:** Next.js 16 (App Router, `src/app`), Tailwind CSS 4 (tokens vía `@theme`),
  TypeScript, React 19.
- **Fuentes:** `next/font/google` — Instrument Serif (titulares) y Geist (UI/cuerpo).
- **Animación:** paquete `motion` (framer-motion), usado solo en islas cliente aisladas.
  Todo lo demás son Server Components estáticos.
- **Contenido:** un archivo centralizado `src/content/landing.ts` con todos los textos,
  para editar copy sin tocar componentes.
- **Componentes:** un archivo por sección en `src/components/sections/`, piezas
  compartidas (tarjetas de chat, tarjetas de estado, botones) en `src/components/ui/`.
- **Sin backend:** el formulario valida en cliente y muestra estado de éxito local;
  el punto de envío queda aislado en una función única lista para conectar después.

## 3. Estructura de la página (8 secciones)

1. **Nav** — barra compacta flotante con vidrio esmerilado: wordmark "Nexo", anclas
   (Producto, Casos, Cómo funciona), CTA pequeño "Acceso al piloto". En móvil colapsa
   a un menú limpio de pantalla completa.
2. **Hero** — split asimétrico ~55/45.
   - Izquierda: titular serif grande: *"Una operación más tranquila empieza con una
     conversación mejor atendida."* Subtítulo: *"Conecta WhatsApp a tu sistema ISP para
     responder pagos, soporte e instalaciones con el contexto real de cada cliente."*
     CTA primario "Solicitar acceso al piloto" (ancla al formulario), CTA secundario
     "Ver cómo funciona" (ancla a la sección 6).
   - Derecha: composición flotante artística — burbuja de chat "No tengo internet",
     tarjeta de estado "Servicio activo · Sin falla masiva", tarjeta de acción
     "Ticket #184 listo para asignar" — conectadas por hilos SVG con nodos suaves y
     halos de luz. Las piezas entran en cascada al cargar.
   - Fondo: gradiente muy suave niebla/lavanda sobre `#F5F7F4`, con puntos de luz
     sutiles. Nada de capturas literales de dashboard.
3. **El problema** — sección editorial corta sobre el caos diario de un ISP pequeño:
   mensajes a toda hora, el mismo "no tengo internet" repetido, cobranza perseguida
   por chat. Visual: mosaico de burbujas desordenadas que se alinean.
4. **Qué hace Nexo** — 3 pilares en layout zig-zag (nunca 3 tarjetas idénticas):
   responde con el contexto real del cliente; decide consultando el sistema ISP
   (deuda, corte, falla masiva); escala al humano con el ticket ya armado.
5. **Casos de uso** — 3 mini-escenas alternadas, cada una con conversación simulada +
   tarjeta de resultado:
   - a. Soporte: "No tengo internet" → consulta deuda/corte/falla masiva → guía una
     solución básica → crea ticket con contexto para el técnico.
   - b. Cobranza: consulta de deuda y validación de pago.
   - c. Ventas: consulta de cobertura y agendamiento de instalación.
6. **Cómo funciona** — diagrama horizontal de flujo de señal: Mensaje de WhatsApp →
   consulta al sistema ISP → acción automática → técnico o agente humano. Nodos
   conectados con pulsos de señal animados; versión estática si hay
   `prefers-reduced-motion`. En móvil el flujo se apila en vertical.
7. **Integraciones** — honesta y genérica: "Nexo se conecta a tu sistema de gestión
   vía API" + WhatsApp Business. Sin logos de terceros ni marcas inventadas.
8. **Piloto + footer** — qué incluye el piloto (implementación acompañada, cupos
   limitados, sin permanencia) y formulario corto: nombre, nombre del ISP, ciudad,
   WhatsApp. Validación inline en español; al enviar, estado de éxito local. Footer
   mínimo: wordmark, contacto, año.

## 4. Sistema visual

Fuente de verdad completa en `DESIGN.md` (raíz del repo). Resumen:

- **Paleta:** fondo `#F5F7F4`, superficies `#FFFFFF`, texto `#17201B` / `#647168`,
  azul inteligente `#5AABFF` (único acento de acción), lavanda de señal `#A7A9EB`
  (decorativo), verde fibra `#7AD8AD` solo confirmaciones, coral `#E78668` solo alertas.
- **Tipografía:** Instrument Serif para titulares (grande, editorial), Geist para
  cuerpo, UI y botones. Números tabulares en tarjetas de estado.
- **Forma:** max-width de contenido 1220px, bordes muy redondeados (~1.5–2rem en
  tarjetas), sombras tenues teñidas al tono del fondo, vidrio esmerilado en piezas
  flotantes, mucho espacio vertical entre secciones (`clamp(5rem, 10vw, 9rem)`).
- **Prohibido:** negro puro, neón, verde WhatsApp dominante, robots/call centers,
  métricas inventadas, logos de clientes falsos, 3 tarjetas idénticas en fila,
  bloques largos de texto.

## 5. Motion

- Discreto y respetuoso: entradas en cascada (`opacity` + `translate`), pulsos de
  señal en el diagrama, mensajes de chat que "llegan" con retardo escalonado.
- Solo `transform` y `opacity`. Springs suaves (stiffness ~100, damping ~20).
- `useReducedMotion` de `motion` + media query CSS: con motion reducido todo aparece
  ya asentado, sin loops.

## 6. Responsive

- Desktop primero, colapso a una columna bajo 768px sin excepciones.
- Hero móvil: titular arriba, composición flotante debajo (simplificada, sin hilos SVG
  complejos si estorban).
- Sin scroll horizontal en ningún viewport. Targets táctiles ≥ 44px.
- Titulares escalan con `clamp()`; cuerpo mínimo 1rem.

## 7. Manejo de errores y estados

- Formulario: validación inline en cliente (campos requeridos, formato de teléfono
  laxo), mensajes de error en coral `#E78668`, éxito en verde `#7AD8AD`.
- Sin estados de carga de datos (página estática); las imágenes/SVG son locales.

## 8. Verificación

- `npm run build` sin errores; lint limpio.
- Revisión visual en viewports 390px, 768px, 1280px y 1440px (vía navegador).
- Chequeo de `prefers-reduced-motion` activado.
- Sin overflow horizontal en móvil.

## 9. Fuera de alcance

- Backend del formulario, analytics, SEO avanzado más allá de metadata básica,
  i18n, CMS, páginas adicionales, dark mode.
