# Verificación manual pendiente — landing de Nexo

Todo lo verificable por comando está en verde: `npm test` (7/7), `npx tsc --noEmit`,
`npm run build` y `npm run lint` (salida 0, sin warnings).

Lo que sigue **no se pudo verificar automáticamente** porque el proyecto no tiene
herramienta de automatización de navegador (y no se instaló ninguna para no añadir
una dependencia fuera del plan). Requiere un navegador y una persona.

Levantar con `npm run dev` y revisar:

## 1. Composición del hero en pantallas muy angostas — lo más importante

En 320, 360 y 390 px de ancho, confirmar que las tres tarjetas flotantes
(conversación, estado del servicio, ticket) **no se superponen**.

La corrección aplicada (`aspect-[3/5] sm:aspect-[4/5]` en `HeroComposition.tsx`)
se derivó de aritmética del contenedor, no de una página renderizada. A 320 px la
caja medía ~288×360 px mientras la primera tarjeta llegaba a ~156 px y la segunda
empezaba en ~137 px. El arreglo da más alto vertical por debajo de `sm`, pero la
altura real de las tarjetas depende del largo del copy y eso solo se ve en pantalla.

Revisar también que los hilos SVG sigan apuntando cerca de las tarjetas a 420 px.

## 2. Movimiento reducido

Activar `prefers-reduced-motion: reduce` (DevTools → Rendering → Emulate CSS media
feature, o Ajustes del sistema → Accesibilidad → Reducir movimiento) y confirmar que
**todo el movimiento se detiene**: el flotado de las tarjetas del hero, el pulso de
los puntos del diagrama de flujo, y las entradas de las secciones al hacer scroll.

Está implementado con `useReducedMotion()` en los cuatro componentes animados y
revisado en código, pero nunca se ejerció en un navegador real.

## 3. Barrido de scroll horizontal

En 390, 768, 1024, 1280 y 1440 px: confirmar que **ninguna** sección produce scroll
horizontal. Un desborde real ya se encontró y corrigió en el diagrama de flujo
(cuatro bloques indeformables de 896 px dentro de 624 px útiles a 768 px), así que
vale la pena confirmar que no quedó ningún caso parecido.

## 4. Diagrama de flujo exactamente en 1024 px

Es el punto más ajustado del layout: los conectores miden ~37 px ahí. Confirmar que
tres puntos pulsando en 37 px no se ve amontonado, y que la línea horizontal queda
alineada con el centro de los badges numerados.

## 5. Detalles de acabado

- Visibilidad del anillo de foco al navegar con teclado, sobre el fondo `#F5F7F4`
  y sobre el navbar de vidrio esmerilado.
- Render del `backdrop-blur` de las tarjetas de vidrio sobre los halos del hero,
  **en Safari** en particular.
- Menú móvil: abrir, cerrar con `Escape`, y que los enlaces cierren al tocarlos.
- Formulario del piloto: enviar vacío (errores en coral), corregir un campo (el
  error debe desaparecer al escribir), y enviar válido (panel verde de éxito, que
  además debe recibir el foco).

## Seguimiento conocido, no bloqueante

- `Escape` cierra el menú móvil pero no devuelve el foco al botón hamburguesa.
- Los componentes de UI no tienen tests automatizados; solo la validación del
  formulario (`src/lib/pilot.ts`) está cubierta, en sus límites. Se aceptó como
  deuda: los defectos que puede tener esta página son visuales, y esos los cubre
  la revisión en navegador de arriba.
