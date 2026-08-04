# Design System: Gantry — Landing

> **Nota de reversión (2026-08-04, spec `docs/superpowers/specs/2026-08-04-gantry-realineamiento.md`):**
> este documento prohibió durante un tiempo el hero centrado y las «capturas
> literales de dashboard», y llamaba a los titulares serif. Esas tres reglas
> venían del **texto** del brief original. Cuando el cliente compartió por fin
> las **capturas** de sus cuatro referencias (Qipeline, TwelveMei, Voice Agents,
> Nexchat), las imágenes contradecían el texto en esos tres puntos exactos —
> las cuatro tienen hero centrado, tres tienen una captura de producto grande y
> recortada por el fold, y ninguna usa serif. El cliente confirmó: las imágenes
> mandan. Este documento se reescribió para reflejar eso, no para esconder el
> giro — un sistema de diseño que contradice en silencio el producto que
> describe es peor que no tener sistema. Las secciones §1, §4, §6 y §9 abajo lo
> dicen explícitamente donde aplica.

## 1. Visual Theme & Atmosphere

Una marca de IA calmada, editorial y premium para pequeños ISPs de Latinoamérica.
La sensación es la de un estudio bien iluminado, no la de una sala de servidores:
fondos claros con un **campo de gradiente atmosférico real** (no una niebla casi
invisible — ver §5), mucho espacio negativo, titulares **sans grandes y apretados**
con presencia dominante, y piezas de interfaz flotando como objetos de galería.

**Lo que cambió respecto de la primera versión:** el espacio negativo se ganó, pero
la página se volvió plana después del hero. La corrección no es añadir adornos — es
subir la **densidad de evidencia**. Cada sección debe mostrar producto, no una
etiqueta centrada dentro de una caja. Si un bloque no enseña un dato, una decisión o
un resultado concreto, no se ha ganado su lugar.

**Lo que cambió en el realineamiento con las referencias (Qipeline como esqueleto
líder):** el hero pasó de un split asimétrico a un layout centrado con una consola
de producto grande y recortada por el fold, el titular pasó de serif a sans, y el
campo de gradiente de fondo pasó de una insinuación casi imperceptible a una
presencia real que se mide y se protege con contraste — ver §6 y §5.

- **Densidad:** 5/10 — aireada en el eje vertical, densa dentro de cada artefacto.
  El vacío vive *entre* las piezas, nunca *dentro* de ellas.
- **Varianza:** 6/10 — splits desiguales, zig-zag, jamás retículas de tarjetas idénticas.
- **Motion:** 4/10 — solo señal. Pulsos que viajan en la dirección del flujo. Nada decorativo.

## 2. La firma: la tríada de señal

Este es el elemento por el que la página se recuerda, y **debe reaparecer en cada
sección**. Es una gramática de tres tiempos que corresponde exactamente a lo que
hace el producto:

```
   SEÑAL              CONTEXTO              ACCIÓN
(lo que llega)   (lo que el sistema sabe)  (lo que pasó)
     ●───────────────────●───────────────────●
   lavanda              azul                verde fibra
```

Tres arquetipos de tarjeta, visualmente distintos y siempre los mismos:

- **Tarjeta de señal** — una burbuja de conversación dentro de vidrio esmerilado.
  Nodo lavanda. Es lo que el cliente escribió.
- **Tarjeta de contexto** — filas de datos: etiqueta a la izquierda, valor a la
  derecha en números tabulares, separadas por líneas susurro. Nodo azul. Es lo que
  Gantry consultó en el sistema del ISP. **Nunca una etiqueta suelta centrada.**
- **Tarjeta de acción** — resultado con punto verde fibra y metadatos. Nodo fibra.
  Es lo que quedó hecho.

Entre ellas corre el **hilo de señal**: trazo punteado de 1px en lavanda con un
pulso que viaja en la dirección del flujo. Vertical u horizontal según la
composición. Con `prefers-reduced-motion` el hilo queda estático, sin pulso.

**Regla de aplicación:** ninguna sección puede presentar una afirmación sobre el
producto sin acompañarla de al menos un artefacto de esta tríada. Los pilares, los
casos de uso, el flujo y las integraciones son todos variaciones de la misma
gramática — por eso la página se siente como un producto y no como secciones sueltas.

## 3. Color Palette & Roles

- **Niebla Verde** (`#F5F7F4`) — fondo principal de la página.
- **Niebla Profunda** (`#EAEEEA`) — burbujas del bot, superficies hundidas.
- **Superficie Pura** (`#FFFFFF`) — relleno de tarjetas y contenedores.
- **Tinta Bosque** (`#17201B`) — texto principal y titulares. Nunca negro puro.
  Desde el realineamiento con las referencias también es el **relleno del CTA
  primario del hero** (píldora oscura sólida, texto Superficie Pura — como
  Qipeline) y, a menor opacidad, el color del eyebrow y el subtítulo del hero
  — ver la nota de contraste en la entrada de Azul Inteligente, abajo.
  **Ronda de fixes del hero (2026-08-04, hero-fixes-report.md):** el CTA de
  la navegación pasa de Azul a Tinta Bosque también — las dos CTAs primarias
  de la página (hero y nav) ya no podían discrepar, y las referencias usan el
  mismo tratamiento oscuro en ambas. El eyebrow y el subtítulo del hero
  suben de `ink/70`–`ink/75` a `ink/85`, porque el campo de gradiente se
  reforzó otra vez (ver §5) y esa opacidad ya no despegaba con margen real de
  4.5:1 en el punto más intenso — ratios medidos en hero-fixes-report.md.
- **Gris Musgo** (`#647168`) — texto secundario, etiquetas de campo, metadatos,
  en cualquier zona **fuera** del campo de gradiente del hero (navegación,
  cuerpo de las secciones bajo el hero). Dentro del hero, ver arriba: el
  eyebrow y el subtítulo usan `ink/85` en vez de Gris Musgo — el campo de
  gradiente ahí es lo bastante fuerte como para que Musgo (4.75:1 sobre
  Niebla Verde lisa, ya al límite) no tenga margen suficiente.
- **Borde Susurro** (`rgb(23 32 27 / 0.08)`) — bordes de 1px, separadores de filas de datos.
- **Azul Inteligente** (`#5AABFF`) — acento de acción: enlaces, focus rings, y
  el **nodo de contexto** de la tríada. **Ya no es el CTA primario del hero**
  — ese rol pasó a Tinta Bosque (arriba) en el realineamiento con las
  referencias — **ni el de la navegación** desde la ronda de fixes del hero
  de 2026-08-04 (arriba): las dos CTAs primarias de la página comparten
  ahora el mismo tratamiento oscuro, y Azul quedó exclusivamente como acento
  de acción (links, focus, tríada) — ya no rellena ningún botón CTA en la
  página. Sigue siendo el **único** azul de la paleta — no se introduce un
  segundo tono de acción.
- **Azul Profundo** (`#4A9EF5`) — exclusivamente el hover del azul de acción.
- **Lavanda de Señal** (`#A7A9EB`) — decorativo y estructural: hilos, halos, pulsos,
  y el **nodo de señal**. Nunca en elementos interactivos. Da 2.05:1 sobre Niebla
  Verde, así que **no se usa para texto** — solo para trazos y formas.
- **Lavanda Legible** (`#8285D2`) — la variante del lavanda para texto: 3.13:1 sobre
  Niebla Verde, el mínimo AA para texto grande. Se usa en los números de pilar, que
  son marcadores estructurales pero siguen siendo texto que alguien debe poder leer.
- **Verde Fibra** (`#7AD8AD`) — sanciona exactamente tres usos: confirmaciones, el
  **nodo de acción** (el nodo terminal de la tríada, el tercer tiempo del recorrido),
  y enunciados de tranquilidad sobre una afirmación del producto (p. ej. la frase de
  confianza de Integraciones). Sigue **prohibido** cualquier uso que implique estado
  vivo de un sistema — ningún punto, chip o check junto a un nombre de sistema, ni
  la palabra "activo": Verde Fibra no reporta salud de infraestructura, marca el
  final de un recorrido de señal ya mostrado en la página.
- **Coral Suave** (`#E78668`) — exclusivamente alertas y errores de formulario.

Gradientes permitidos: transiciones muy suaves entre Niebla Verde, Lavanda y Azul,
sobre blanco. Nunca gradientes saturados ni neón. **El campo de gradiente del hero
(`GradientField`, §5) debe leerse como una presencia real** — no una insinuación:
las cuatro referencias del cliente tienen un cielo atmosférico con peso visible en
el tercio superior de la página, y la primera versión de este campo (~4% de opacidad
de pico) era casi imperceptible a distancia normal de lectura. El límite no es "qué
tan sutil", es "qué tan fuerte sin romper AA" — cualquier cambio de opacidad debe
volver a medirse muestreando la captura renderizada (no aritmética CSS) contra el
texto que quede encima, y documentarse igual que en `chunk-c-report.md`.

## 4. Typography Rules

- **Display:** Instrument Sans (`next/font/google`) — titulares grandes y
  apretados, con más carácter que un grotesco neutro. Reemplazó a Instrument
  Serif en el realineamiento con las referencias: las cuatro comparten
  titulares sans, y el brief original (que sí pedía serif) fue el que se
  revocó — ver la nota de reversión al inicio del documento. El titular del
  hero es deliberadamente **enorme** (hasta `5.25rem`/84px en escritorio, con
  `clamp()`) y domina el viewport como en Qipeline; el resto de los titulares
  de sección escalan más moderado, siempre con `clamp()` y nunca
  `text-balance` si eso reordena las palabras de forma que rompa una frase a
  mitad — preferir el ajuste de línea normal (greedy) cuando el balanceado
  del navegador produce un corte peor (ver el titular del hero, cuyo ancho de
  contenedor se calculó a partir del ancho medido de cada palabra para que el
  corte caiga en límites de frase, no a mitad).
  **Ronda de fixes del hero (2026-08-04, hero-fixes-report.md):** el titular
  del hero sube de `font-normal`/`tracking-tight` a **`font-bold`
  (700)/`tracking-tighter`** — a escala de héroe, Instrument Sans en regular
  se leía delgado y suelto frente al peso de Qipeline. Instrument Sans es una
  fuente variable vía `next/font/google` (sin `weight` explícito en la
  llamada), así que el eje de peso completo ya estaba cargado — 700 no es un
  peso sintetizado, se confirmó en `hero-fixes-report.md` con
  `--font-weight-bold:700` presente en el CSS generado y `font-weight:700`
  computado en el navegador.
- **Instrument Serif no existe en el proyecto.** Ningún import, ninguna clase
  `font-serif`, ningún archivo se descarga. Si vuelve a aparecer en cualquier
  `git grep`, es una regresión.
- **Body/UI:** Geist — párrafos con leading relajado (máx. 65ch), botones,
  navegación, y **todo el contenido de los artefactos**.
- **Números:** tabulares (`[font-variant-numeric:tabular-nums]`) en toda fila de
  datos, ticket, monto y fecha. Un artefacto con números que bailan se lee como
  maqueta; con números alineados se lee como software.
- **Etiquetas de campo:** Geist, tamaño `text-xs`, Gris Musgo, sin mayúsculas
  forzadas salvo en los eyebrows de sección.
- **Banned:** Inter, serifas genéricas (Georgia, Garamond, Times), system-ui como
  identidad. Serif **jamás** dentro de la UI simulada — los artefactos son producto,
  no editorial.

## 5. Component Stylings

- **Botones:** tres variantes, no dos. **`ink`** — relleno Tinta Bosque, texto
  Superficie Pura, radio de píldora, hover `ink/90`, feedback `-1px` en activo:
  el CTA primario del hero **y, desde la ronda de fixes del hero (2026-08-04,
  hero-fixes-report.md), también el CTA de la navegación** — las dos CTAs
  primarias de la página ya no pueden discrepar (Fix 4), y las referencias
  del cliente usan el mismo tratamiento oscuro en ambas. **`primary`** —
  relleno Azul Inteligente, mismo tratamiento, hover Azul Profundo: sin uso
  actual como CTA en la página (ver arriba); se conserva como variante
  disponible. **`ghost`** — fantasma: borde susurro + texto Tinta, fondo
  `surface/60`: el secundario del hero y cualquier acción de segundo orden. Sin
  glow externo en ninguna. Target táctil ≥ 44px siempre, en las tres.
- **Campo de gradiente (`GradientField`):** el fondo atmosférico del hero —
  manchas grandes y difuminadas (`blur` 110–150px) de Lavanda y Azul sobre
  Niebla Verde, más intensas arriba y a la derecha, disolviéndose hacia abajo
  con una máscara antes de la sección Problema. Server Component, `aria-hidden`,
  `-z-10`, `pointer-events-none` — es atmósfera, no contenido. Debe leerse como
  luz real desde una distancia de lectura normal (§1), y su intensidad está
  acotada únicamente por el contraste del texto que queda encima (eyebrow,
  titular, subtítulo del hero) — nunca al revés. **Ronda de fixes del hero
  (2026-08-04):** el cliente comparó la captura de 1440px con Qipeline y el
  campo seguía leyéndose plano — chunk C ya lo había reforzado una vez pero
  no lo suficiente. Las opacidades de pico suben otra vez (~+60-70% sobre
  chunk C) y el eyebrow/subtítulo del hero pasan de `ink/70`–`ink/75` a
  `ink/85` para sostener el piso AA bajo el campo más fuerte — ver §3 y
  hero-fixes-report.md para los ratios muestreados antes/después.
- **Consola de producto (`ProductConsole`):** el artefacto más grande de la
  página — una maqueta densa de la aplicación real (barra lateral,
  conversaciones, contexto), recortada por el fold dentro del hero. Marco con
  radio grande, borde susurro, sombra difusa, fondo superficie; se lee como una
  ventana de aplicación, no como una tarjeta de la tríada. Es deliberadamente
  ancha — corre por fuera del contenedor de 1220px del texto (§6) para leerse
  como una captura de producto dominante, no como una ilustración flotando en
  el margen. Ver §9: esto es una excepción explícita, y la única, a "nunca
  captura literal de dashboard."
- **Tarjetas de vidrio (señal):** `backdrop-blur` + blanco 80%, radio 1.5–2rem,
  borde susurro, sombra difusa teñida al fondo.
- **Tarjetas de contexto (filas de datos):** blanco sólido, radio 1.5rem, cabecera
  con nombre y chip de estado, luego filas `etiqueta · valor` separadas por líneas
  susurro. Padding interno generoso, interlineado apretado — densas por dentro.
- **Chips de estado:** píldora pequeña; verde fibra tenue para estados sanos,
  coral tenue para alertas, niebla profunda para neutros. Siempre con texto, nunca
  solo color.
- **Hilo de señal:** trazo punteado 1px lavanda con nodos de 6px en los extremos y
  en cada punto de decisión.
- **Burbujas de chat:** cliente en blanco con borde; bot en Niebla Profunda. Cada
  burbuja lleva un prefijo `sr-only` con el hablante. Verde WhatsApp jamás.
- **Inputs:** label arriba, error abajo en Coral, focus ring Azul. Sin floating labels.
- **Navegación:** píldora de vidrio discreta. Debe ceder protagonismo a la página:
  sombra tenue, enlaces de bajo contraste, y compactarse al hacer scroll.

## 6. Layout Principles

- Contenido a **1220px** máx., centrado, padding lateral `clamp()`. **Excepción
  explícita:** la consola de producto del hero (§5) rompe este máximo a
  propósito — corre casi hasta el borde del viewport (≥85% de su ancho desde
  320px, ≥95% desde 1280px, medido, no estimado) porque leerse como una
  captura dominante es el punto. Sigue viviendo dentro del padding de la
  sección — cero scroll horizontal no es negociable ni para esta excepción.
- **Hero centrado — nunca split asimétrico.** Esto es lo inverso de lo que
  decía este documento antes del realineamiento con las referencias: el brief
  en texto pedía un split asimétrico, y las capturas del cliente (las cuatro)
  lo contradicen con un hero centrado. Badge → titular → subtítulo → CTAs,
  todo centrado, seguido de la consola de producto. Ver la nota de reversión
  al inicio del documento.
- Pilares y casos en zig-zag de 2 columnas. **Prohibida la fila de 3 tarjetas idénticas.**
- Espaciado vertical entre secciones: `clamp(5rem, 10vw, 9rem)`.
- Colapso estricto a una columna bajo 768px; cero scroll horizontal en cualquier ancho.
- Antes de fijar anchos en un layout en fila, hacer la aritmética del contenedor:
  contenido indeformable que excede el ancho disponible produce scroll horizontal sin
  ningún error de build.
- CSS Grid antes que matemática de flexbox; sin `calc()` de porcentajes.
- Los halos e hilos decorativos viven detrás, con `z-index` negativo y `aria-hidden`.

## 7. Motion & Interaction

- **Motor:** `motion` (import desde `motion/react`) en islas cliente aisladas.
- **Física:** springs suaves (stiffness ~100, damping ~20). Sin easing lineal.
- **Vocabulario de movimiento, todo de señal:**
  - pulsos que recorren los hilos en la dirección del flujo,
  - mensajes que llegan escalonados,
  - filas de datos que se resuelven una tras otra en la cadena de decisión.
- **Prohibido:** flotar por flotar, parallax, brillos, contadores animados.
- **Performance:** solo `transform` y `opacity`. Nunca animar layout.
- **Accesibilidad:** `useReducedMotion` + `@media (prefers-reduced-motion: reduce)`
  apagan los loops por completo (no los ralentizan) y muestran todo asentado.

## 8. Copy & Honesty Rules

- Todo el copy visible vive en `src/content/landing.ts`. Excepciones: mensajes de
  validación en `src/lib/pilot.ts` y etiquetas ARIA.
- Los artefactos muestran datos **verosímiles y claramente simulados** dentro de
  conversaciones y fichas de ejemplo. Eso es legítimo: es una demostración.
- **Prohibido** presentar como propias métricas agregadas, uptime, tiempos de
  respuesta, número de clientes, logos de clientes o testimonios.
- Al nombrar sistemas de terceros (MikroWisp, WiMovil, WispHub), el verbo debe
  reflejar el estado real. Mientras no exista integración construida, el encuadre
  es de diseño e intención — "diseñado para conectarse", "durante el piloto
  integramos el que uses" — nunca "integrado con".
- La landing vende un **piloto**, no una suscripción masiva.

## 9. Anti-Patterns (Banned)

- Cajas con una sola etiqueta centrada haciéndose pasar por interfaz. Si es un
  artefacto, tiene filas, estados y jerarquía.
- Secciones que afirman una capacidad sin mostrar evidencia de ella.
- Círculos numerados con texto debajo como única representación de un proceso.
- Verde WhatsApp como color dominante o de marca.
- Robots, fotos de call center, íconos tecnológicos genéricos, neón.
- Negro puro (`#000000`), sombras con glow, gradientes saturados.
- Métricas inventadas, logos de clientes ficticios, testimonios fabricados.
- 3 tarjetas idénticas en fila; listas de 12 funcionalidades.
- Clichés de copy de IA ("revoluciona", "potencia", "sin fricciones", "next-gen").
- Emojis en la interfaz; "Scroll para explorar"; chevrons rebotando.
- Nombres placeholder genéricos ("Juan Pérez", "Acme") — nombres y barrios
  peruanos verosímiles.
- **Capturas literales de dashboard *genéricas o decorativas*** — un
  screenshot de una app cualquiera metido para simular sofisticación. **Ya no
  incluye** la consola de producto del hero (§5): esa es una maqueta propia,
  construida con los artefactos reales de la tríada (DataCard, ChatBubble,
  DecisionChain, ResultCard), con datos de ejemplo declarados como tales — es
  evidencia del producto, no decoración. La distinción es intención y
  procedencia: ¿es una captura ajena puesta para parecer creíble, o es nuestra
  propia interfaz mostrada honestamente? Esto revierte la prohibición anterior
  de este documento, que las cuatro referencias del cliente contradicen — ver
  la nota de reversión al inicio.
- **Hero centrado** ya no está en esta lista — era la regla anterior de este
  documento (brief en texto) y las referencias del cliente la revocaron. Ver
  §6: ahora es obligatorio, no prohibido.
