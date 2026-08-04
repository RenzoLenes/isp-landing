# Design System: Nexo — Landing

## 1. Visual Theme & Atmosphere

Una marca de IA calmada, editorial y premium para pequeños ISPs de Latinoamérica.
La sensación es la de un estudio bien iluminado, no la de una sala de servidores:
fondos claros con niebla suave, mucho espacio negativo, titulares serif con gran
presencia y piezas de interfaz flotando como objetos de galería. La página cuenta
una historia — del caos de WhatsApp a una operación tranquila — con movimiento
apenas perceptible: señales que viajan, mensajes que llegan, nodos que respiran.

- **Densidad:** Art Gallery Airy (3/10) — cada sección respira; nada compite.
- **Varianza:** Offset Asymmetric (6/10) — splits desiguales, zig-zag, nunca retículas de tarjetas idénticas.
- **Motion:** Fluid (5/10) — springs suaves, loops sutiles, todo degradable a estático.

## 2. Color Palette & Roles

- **Niebla Verde** (`#F5F7F4`) — fondo principal de la página.
- **Superficie Pura** (`#FFFFFF`) — relleno de tarjetas y contenedores.
- **Tinta Bosque** (`#17201B`) — texto principal y titulares. Nunca negro puro.
- **Gris Musgo** (`#647168`) — texto secundario, descripciones, metadata.
- **Borde Susurro** (`rgba(23,32,27,0.08)`) — bordes de 1px, líneas estructurales.
- **Azul Inteligente** (`#5AABFF`) — único acento de acción: CTAs, enlaces, focus rings, nodos activos. Saturación contenida; jamás como fondo dominante.
- **Lavanda de Señal** (`#A7A9EB`) — decorativo: gradientes, halos, hilos de conexión, pulsos de señal. No se usa en elementos interactivos.
- **Verde Fibra** (`#7AD8AD`) — exclusivamente estados de confirmación (pago validado, ticket creado, envío exitoso).
- **Coral Suave** (`#E78668`) — exclusivamente alertas y errores de formulario.

Gradientes permitidos: transiciones muy suaves entre Niebla Verde, Lavanda de Señal
al ~20% y blanco. Nunca gradientes saturados ni neón.

## 3. Typography Rules

- **Display:** Instrument Serif — titulares editoriales grandes, tracking natural,
  jerarquía por tamaño y color, no por peso (solo tiene regular). Escala con `clamp()`.
- **Body/UI:** Geist — párrafos con leading relajado (máx. 65ch), botones, navegación,
  labels y todo el contenido de las tarjetas de interfaz.
- **Números:** tabulares (`font-variant-numeric: tabular-nums`) en tarjetas de estado
  y tickets; Geist Mono opcional para IDs de ticket.
- **Banned:** Inter, serifas genéricas (Georgia, Garamond, Times), system-ui como
  identidad. Serif solo en titulares y citas — nunca dentro de la UI simulada.

## 4. Component Stylings

- **Botones:** primario con relleno Azul Inteligente y texto blanco, radio completo
  (píldora), feedback táctil `-1px` translate en activo, sin glow externo. Secundario
  fantasma: borde susurro + texto Tinta Bosque. Target táctil ≥ 44px.
- **Tarjetas flotantes (chat, estado, ticket):** vidrio esmerilado
  (`backdrop-blur` + blanco al 70–85%), radio generoso (1.5–2rem), borde susurro,
  sombra difusa teñida al tono del fondo (nunca gris neutro duro). Flotan sobre halos
  y hilos SVG, sin superponerse al texto.
- **Burbujas de chat:** las del cliente en blanco con borde; las del bot en un tono
  niebla ligeramente más profundo. Verde WhatsApp jamás como color de burbuja.
- **Inputs:** label arriba, error abajo en Coral Suave, focus ring Azul Inteligente.
  Sin floating labels.
- **Estados de éxito:** chip o tarjeta con Verde Fibra tenue, texto Tinta Bosque.
- **Diagrama de flujo:** nodos circulares suaves conectados por trazos de 1px con
  pulsos de Lavanda de Señal desplazándose; versión estática con puntos fijos cuando
  hay motion reducido.

## 5. Layout Principles

- Contenido contenido a **1220px** máx., centrado, con padding lateral `clamp()`.
- Hero split asimétrico ~55/45 — nunca centrado.
- Secciones de pilares y casos en zig-zag de 2 columnas; prohibida la fila de
  3 tarjetas idénticas.
- Espaciado vertical entre secciones: `clamp(5rem, 10vw, 9rem)`.
- Colapso estricto a una columna bajo 768px; cero scroll horizontal.
- CSS Grid antes que matemática de flexbox; sin `calc()` de porcentajes.
- Ningún elemento superpuesto a texto; cada pieza tiene su zona espacial limpia
  (los halos y hilos decorativos viven detrás, con `z-index` negativo y `aria-hidden`).

## 6. Motion & Interaction

- **Motor:** paquete `motion` en islas cliente aisladas; el resto de la página es
  estática (Server Components).
- **Física:** springs suaves (stiffness ~100, damping ~20). Sin easing lineal.
- **Coreografía:** las tarjetas del hero entran en cascada escalonada; los mensajes
  de las escenas de caso "llegan" al entrar en viewport; los pulsos del diagrama
  corren en loop lento y silencioso.
- **Performance:** solo `transform` y `opacity`. Nunca animar layout.
- **Accesibilidad:** `useReducedMotion` + `@media (prefers-reduced-motion: reduce)`
  apagan loops y muestran todo asentado desde el inicio.

## 7. Anti-Patterns (Banned)

- Verde WhatsApp como color dominante o de marca.
- Robots, fotos de call center, íconos tecnológicos genéricos, neón.
- Negro puro (`#000000`), sombras con glow, gradientes saturados.
- Métricas inventadas, porcentajes de uptime falsos, logos de clientes ficticios,
  testimonios fabricados. Si no hay dato real, no se muestra dato.
- 3 tarjetas idénticas en fila; secciones repletas de cards iguales.
- Hero centrado; bloques largos de texto; listas de 12 funcionalidades.
- Clichés de copy de IA ("revoluciona", "potencia", "sin fricciones", "next-gen").
- Emojis en la interfaz; "Scroll para explorar" y chevrons rebotando.
- Nombres placeholder genéricos ("Juan Pérez", "Acme") en las conversaciones
  simuladas — usar nombres verosímiles de clientes y barrios peruanos.
- Capturas literales de dashboard como decoración.
