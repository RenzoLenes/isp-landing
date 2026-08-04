# Design System: Gantry — Landing

## 1. Visual Theme & Atmosphere

Una marca de IA calmada, editorial y premium para pequeños ISPs de Latinoamérica.
La sensación es la de un estudio bien iluminado, no la de una sala de servidores:
fondos claros con niebla suave, mucho espacio negativo, titulares serif con gran
presencia y piezas de interfaz flotando como objetos de galería.

**Lo que cambió respecto de la primera versión:** el espacio negativo se ganó, pero
la página se volvió plana después del hero. La corrección no es añadir adornos — es
subir la **densidad de evidencia**. Cada sección debe mostrar producto, no una
etiqueta centrada dentro de una caja. Si un bloque no enseña un dato, una decisión o
un resultado concreto, no se ha ganado su lugar.

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
  Nexo consultó en el sistema del ISP. **Nunca una etiqueta suelta centrada.**
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
- **Gris Musgo** (`#647168`) — texto secundario, etiquetas de campo, metadatos.
- **Borde Susurro** (`rgb(23 32 27 / 0.08)`) — bordes de 1px, separadores de filas de datos.
- **Azul Inteligente** (`#5AABFF`) — único acento de acción: CTAs, enlaces, focus
  rings, y el **nodo de contexto** de la tríada.
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

Gradientes permitidos: transiciones muy suaves entre Niebla Verde, Lavanda al ~20%
y blanco. Nunca gradientes saturados ni neón.

## 4. Typography Rules

- **Display:** Instrument Serif — titulares editoriales, jerarquía por tamaño y
  color (solo tiene regular). Escala con `clamp()`.
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

- **Botones:** primario relleno Azul Inteligente, texto Superficie Pura, radio de
  píldora, hover a Azul Profundo, feedback `-1px` en activo, sin glow externo.
  Secundario fantasma: borde susurro + texto Tinta. Target táctil ≥ 44px siempre.
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

- Contenido a **1220px** máx., centrado, padding lateral `clamp()`.
- Hero split asimétrico — nunca centrado.
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
- 3 tarjetas idénticas en fila; hero centrado; listas de 12 funcionalidades.
- Clichés de copy de IA ("revoluciona", "potencia", "sin fricciones", "next-gen").
- Emojis en la interfaz; "Scroll para explorar"; chevrons rebotando.
- Nombres placeholder genéricos ("Juan Pérez", "Acme") — nombres y barrios
  peruanos verosímiles.
- Capturas literales de dashboard como decoración.
