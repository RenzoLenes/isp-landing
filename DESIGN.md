# Design System: Gantry — Landing

> **Reescritura completa (2026-08-04).** El cliente revisó la página terminada y su
> veredicto fue: «no tiene nada de identidad visual». Tenía razón. El diagnóstico:
> nueve secciones con un único valor de fondo, ocho colores usados todos al 10–20%
> de opacidad sobre elementos diminutos, y absolutamente todo resuelto como tarjeta
> blanca con borde de 1px. La página tenía **disciplina** —consistencia,
> accesibilidad, cero datos inventados— pero disciplina sin punto de vista se lee
> como plantilla. Este documento reemplaza al anterior. Lo que sobrevive: los
> artefactos de producto, las reglas de honestidad, el piso de accesibilidad y la
> suite de verificación. Lo que cambia: todo lo demás.

## 1. Visual Theme & Atmosphere

Una operación de red vista con calma. La página avanza como un turno completo: se
abre con luz de cielo abierto, baja a la sala oscura donde el sistema piensa, y
vuelve a salir a la luz para pedir el piloto. No es un SaaS claro y aireado más —
es una página con **registros**, y el cambio entre ellos es la identidad.

- **Densidad:** 5/10 — aire generoso entre bloques, densidad real dentro de cada
  artefacto. El vacío vive *entre* las piezas, nunca *dentro* de ellas.
- **Varianza:** 7/10 — el ritmo de secciones es la fuente principal de varianza.
  Splits desiguales, zig-zag, jamás retículas de tarjetas idénticas.
- **Motion:** 4/10 — solo señal. Nada decorativo.

**Regla rectora nueva: ninguna sección puede tener el mismo tratamiento de fondo
que la sección anterior.** Si dos secciones consecutivas se ven iguales, una de las
dos está mal resuelta.

## 2. El ritmo de registros — la firma de la página

Tres registros, alternados deliberadamente. Este es el elemento por el que la
página se recuerda.

| # | Sección | Registro | Por qué |
|---|---|---|---|
| 1 | Hero | **Campo Señal** (azul pleno) | Luz de apertura. El producto flota sobre ella. |
| 2 | El día a día | **Superficie** (blanco) | Corte limpio: el caos se cuenta sin adorno. |
| 3 | Pilares | **Sala Oscura** (tinta) | El sistema pensando. Los artefactos brillan como pantallas encendidas. |
| 4 | Casos de uso | **Lienzo** (niebla) | Descanso. Conversaciones reales, tono neutro. |
| 5 | Cómo funciona | **Campo Señal** (azul) | La ruta de datos vuelve a la luz. |
| 6 | Integraciones | **Superficie** (blanco) | El diagrama necesita fondo limpio. |
| 7 | Preguntas | **Lienzo** (niebla) | Lectura larga, sin ruido. |
| 8 | Piloto + footer | **Sala Oscura** (tinta) | La petición aterriza en el registro fuerte. |

Los cortes entre registros son **a sangre completa**, sin bordes ni sombras que los
suavicen. El cambio debe ser franco.

## 3. Color Palette & Roles

**Un solo acento.** La versión anterior tenía dos azules y una lavanda compitiendo,
todos pálidos; el resultado fue que ninguno se veía. La lavanda queda **eliminada
del proyecto**.

**Neutros**
- **Lienzo Niebla** (`#F4F6F4`) — fondo base de las secciones neutras.
- **Superficie** (`#FFFFFF`) — fondo de las secciones limpias y relleno de artefactos.
- **Sala Oscura** (`#141C19`) — fondo a sangre de las secciones oscuras. Verde-negro,
  misma familia de matiz que la tinta de texto. **Nunca negro puro.**
- **Tinta** (`#17201B`) — texto principal sobre fondos claros.
- **Musgo** (`#647168`) — texto secundario sobre fondos claros.
- **Niebla Clara** (`#E4EAE6`) — texto secundario **sobre Sala Oscura**.
- **Borde Susurro** (`rgb(23 32 27 / 0.08)`) — bordes de 1px sobre claro.
- **Borde Nocturno** (`rgb(244 246 244 / 0.12)`) — bordes de 1px sobre oscuro.

**El acento — escala Señal** (un solo matiz, tres pesos)
- **Señal Campo** (`#CBE0F5`) — fondo a sangre del registro azul. Sostiene Tinta a
  más de 10:1, así que el texto encima va oscuro, como en las referencias.
- **Señal** (`#3E86D9`) — acento medio: nodos de contexto, enlaces, focus rings.
  Saturación 69%, por debajo del techo de 80%.
- **Señal Profunda** (`#1B4F92`) — el peso máximo: CTA primario sobre fondos claros,
  texto de acento donde hace falta contraste.

**Semánticos, de uso estrictamente reservado**
- **Fibra** (`#7AD8AD`) — confirmaciones y el nodo terminal de un recorrido. Sobre
  Sala Oscura es donde por fin se ve. **Prohibido** cualquier uso que implique
  estado vivo de un sistema: ni punto, ni chip, ni «activo» junto a un nombre de
  sistema. No reporta salud de infraestructura.
- **Coral Profundo** (`#C2451F`) — exclusivamente errores de formulario. 5.04:1
  sobre blanco, cumple AA para texto.

**Prohibido:** neón, glows exteriores, gradientes saturados, negro puro, verde
WhatsApp como color de marca, y cualquier segundo acento. Si un elemento necesita
destacar y no es acción ni confirmación ni error, se resuelve con **tamaño,
peso o posición**, no con un color nuevo.

### Contraste medido — usar esta tabla, no la intuición

Ratios calculados con la fórmula WCAG. El piso es **4.5:1** para texto normal y
**3:1** para texto grande (≥24px, o ≥18.7px en negrita).

| Texto | Sobre Campo `#CBE0F5` | Sobre Lienzo `#F4F6F4` | Sobre Superficie `#FFF` | Sobre Sala Oscura `#141C19` |
|---|---|---|---|---|
| Tinta `#17201B` | 12.33 ✅ | 15.36 ✅ | 16.10 ✅ | — |
| Musgo `#647168` | **3.78 ❌** | 4.71 ✅ | 5.12 ✅ | — |
| Niebla Clara `#E4EAE6` | — | — | — | 14.22 ✅ |
| Superficie `#FFFFFF` | — | — | — | 17.36 ✅ |
| Señal `#3E86D9` | — | — | **3.74 ⚠️** | 4.64 ✅ |
| Señal Profunda `#1B4F92` | 6.02 ✅ | — | 8.14 ✅ | — |
| Fibra `#7AD8AD` | — | — | — | 10.13 ✅ |

**Dos reglas que salen de esta tabla y son vinculantes:**

1. **Musgo no se usa sobre el Campo Señal.** Da 3.78:1 y falla. El texto secundario
   sobre azul es **Tinta al 75%** (6.17:1) o más opaca. Musgo sigue siendo el
   secundario correcto sobre Lienzo y Superficie.
2. **Señal `#3E86D9` no se usa como texto sobre blanco** (3.74:1). Sirve para nodos,
   bordes, focus rings y texto grande. Para texto normal de acento, Señal Profunda.

Verificar siempre **muestreando la captura renderizada**, no calculando a mano
sobre el token: un gradiente detrás del texto cambia el fondo real, y ese error ya
se cometió antes en este proyecto.

## 4. Typography Rules

- **Display: Space Grotesk.** Reemplaza a Instrument Sans, que era correcta y
  anónima. Space Grotesk tiene carácter técnico —terminaciones cortadas, formas
  ligeramente mecánicas— que corresponde al tema: señal, red, estructura. Se usa
  con `tracking-tight` en tamaños grandes y `clamp()` para escalar.
- **Cuerpo y UI: Geist.** Leading relajado, máximo 65 caracteres por línea.
- **Números:** tabulares (`[font-variant-numeric:tabular-nums]`) en toda fila de
  datos, ticket, monto y fecha. Un artefacto con números que bailan se lee como
  maqueta; alineados se lee como software.
- **Jerarquía por peso y color antes que por tamaño.** El titular del hero es la
  única pieza que puede gritar.
- **Prohibido:** Inter, serifas genéricas (Times, Georgia, Garamond), system-ui como
  identidad, y serif de cualquier tipo dentro de la UI simulada — los artefactos son
  producto, no editorial.

## 5. Component Stylings

- **Botones.** Primario: relleno Señal Profunda sobre claro, o Superficie sobre
  Sala Oscura. Radio de píldora, feedback táctil `-1px` en activo, **sin glow**.
  Secundario: fantasma con borde. Target táctil ≥ 44px **siempre**.
- **Artefactos sobre claro.** Superficie sólida, radio 1.5rem, borde susurro,
  sombra difusa teñida al fondo.
- **Artefactos sobre Sala Oscura.** Este es el momento que justifica el registro
  oscuro: la tarjeta se mantiene clara y **brilla**. Fondo Superficie, sin borde,
  sombra amplia y suave por debajo. Se lee como una pantalla encendida en una sala
  a media luz.
- **Tarjetas de contexto (filas de datos).** Cabecera con nombre y chip de estado;
  luego filas `etiqueta · valor` separadas por líneas de 1px. Densas por dentro.
  **Nunca una etiqueta suelta centrada dentro de una caja.**
- **Chips de estado.** Píldora pequeña, siempre con texto, nunca solo color.
- **Burbujas de chat.** Cliente en Superficie con borde; sistema en un tono hundido.
  Cada burbuja lleva un prefijo `sr-only` con el hablante. Verde WhatsApp jamás.
- **Inputs.** Label arriba, error abajo en Coral Profunda, focus ring Señal. Sin
  floating labels.
- **Navegación.** Píldora discreta que cede protagonismo a la página: sombra tenue,
  enlaces de bajo contraste, y se compacta al hacer scroll.
- **Grano.** Una capa de ruido muy sutil, fija, sobre toda la página
  (`pointer-events: none`, pseudo-elemento fijo). Da calidad material y quita la
  planitud antiséptica. Debe notarse solo si se busca.

## 6. Layout Principles

- Contenido a **1220px** máx., centrado, padding lateral con `clamp()`.
- **Hero centrado** — excepción deliberada al patrón asimétrico, decidida por el
  cliente a partir de sus cuatro referencias, que lo tienen centrado. La varianza
  la aporta el ritmo de registros, no la posición del hero.
- Los cortes de registro van **a sangre completa**, fuera del contenedor de 1220px.
- Pilares y casos en zig-zag de 2 columnas. **Prohibida la fila de 3 tarjetas idénticas.**
- Espaciado vertical entre secciones: `clamp(5rem, 10vw, 9rem)`.
- Colapso estricto a una columna bajo 768px; **cero scroll horizontal** en cualquier ancho.
- **Antes de fijar anchos en una fila, hacer la aritmética del contenedor.**
  Contenido indeformable que excede el ancho disponible produce scroll horizontal
  sin ningún error de build — esta página ya lo sufrió una vez.
- Elementos alineados entre sí comparten banda: si una fila tiene artefactos de
  altura variable, se les da una banda uniforme y los títulos comparten línea base.
- CSS Grid antes que matemática de flexbox. Sin `calc()` de porcentajes.

## 7. Motion & Interaction

- **Motor:** `motion` (import desde `motion/react`) en islas cliente aisladas.
- **Física:** springs suaves (stiffness ~100, damping ~20). Sin easing lineal.
- **Vocabulario, todo de señal:** pulsos que recorren los hilos en la dirección del
  flujo, mensajes que llegan escalonados, filas que se resuelven una tras otra.
- **Prohibido:** flotar por flotar, parallax, brillos, contadores animados.
- **Performance:** solo `transform` y `opacity`. Nunca animar layout.
- **Accesibilidad, regla dura:** `prefers-reduced-motion` apaga los loops **por
  completo** y muestra todo asentado. Nunca decidir el estado *inicial* de un
  render a partir de `useReducedMotion()` — devuelve `null` en servidor y provoca
  el error de hidratación #418 de React, que descarta el árbol entero. El estado
  inicial debe ser idéntico en servidor y cliente; la regla de «ya asentado» se
  aplica por CSS.

## 8. Copy & Honesty Rules

- Todo el copy visible vive en `src/content/landing.ts`. Excepciones: mensajes de
  validación en `src/lib/pilot.ts` y etiquetas ARIA.
- Los artefactos muestran datos **verosímiles y claramente simulados** dentro de
  conversaciones y fichas de ejemplo. Es una demostración, y se lee como tal.
- **Prohibido** presentar como propias métricas agregadas, uptime, tiempos de
  respuesta, número de clientes, precios, certificaciones, logos de clientes o
  testimonios. Si el dato real no existe, no se muestra dato.
- Al nombrar sistemas de terceros (MikroWisp, WiMovil, WispHub), el verbo refleja el
  estado real: mientras no exista integración construida, el encuadre es de
  intención — «diseñado para conectarse», «durante el piloto integramos el que
  uses». **Nunca** «integrado con» ni «compatible con».
- Donde la respuesta honesta es «depende» o «lo acordamos contigo», se escribe así.
- La landing vende un **piloto**, no una suscripción masiva.

## 9. Anti-Patterns (Banned)

- **Dos secciones consecutivas con el mismo fondo.** La falta de ritmo fue el
  defecto que originó esta reescritura.
- **Colores de paleta usados solo como tintes al 10%.** Si un color no aparece en
  ningún lugar a plena fuerza, sobra en la paleta.
- Cajas con una sola etiqueta centrada haciéndose pasar por interfaz.
- Secciones que afirman una capacidad sin mostrar evidencia de ella.
- Círculos numerados con texto debajo como única representación de un proceso.
- Un segundo color de acento «para variar».
- Negro puro (`#000000`), neón, glows, gradientes saturados, verde WhatsApp de marca.
- Métricas, precios, certificaciones, logos o testimonios inventados.
- Filas de 3 tarjetas idénticas; listas de 12 funcionalidades.
- Clichés de copy de IA («revoluciona», «potencia», «sin fricciones», «next-gen»).
- Emojis en la interfaz; «Scroll para explorar»; chevrons rebotando.
- Nombres placeholder genéricos: nombres y barrios peruanos verosímiles.
- `display: contents` sobre un `<li>` — puede eliminar el subárbol del árbol de
  accesibilidad en WebKit.
- Objetivos táctiles por debajo de 44px, en cualquier superficie.
