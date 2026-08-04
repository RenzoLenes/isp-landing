# Verificación manual pendiente — landing de Nexo

**Actualizado el 2026-08-04, tras el rediseño de densidad visual.** La versión
anterior de este documento describía el hero viejo (tarjetas flotando en una caja
con `aspect`, hilos SVG curvos) que ya no existe.

Todo lo verificable por comando está en verde: `npm test` (11/11), `npx tsc --noEmit`,
`npm run build` y `npm run lint` (salida 0, sin warnings).

Lo que sigue **no se pudo verificar automáticamente** porque el proyecto no tiene
herramienta de automatización de navegador, y no se instaló ninguna para no añadir
una dependencia fuera de alcance. Requiere un navegador y una persona.

Levantar con `npm run dev`.

## 1. Integraciones en 1024, 1280 y 1440 px — lo más importante

Es la sección que el cliente llamó la más débil y la que más se rehízo, así que es
donde más conviene mirar.

- El diagrama de convergencia debe verse **centrado** bajo el titular (también
  centrado). Se corrigió una alineación a la izquierda que dejaba 350–600px de
  vacío a la derecha.
- Los cuatro hilos que van de cada sistema al tronco vertical deben **verse**.
  Hubo un bug de flexbox que los dejaba en cero píxeles de ancho, y luego un
  tronco demasiado corto para alcanzar las tarjetas de los extremos.
- El tronco debe llegar de punta a punta: el hilo de MikroWisp (arriba) y el de
  «Tu propia API» (abajo) no deben terminar en el aire.

## 2. Composición del hero en 320, 360 y 390 px

El hero pasó de posicionamiento absoluto a una columna en flujo normal, así que el
solapamiento de tarjetas debería ser estructuralmente imposible. Pero nadie ha
mirado el hero **nuevo** a estos anchos.

Confirmar que el chat se lee como pieza dominante y que las tarjetas de contexto y
ticket se leen como resultados derivados, no como tres piezas del mismo peso.

## 3. Movimiento reducido

Activar `prefers-reduced-motion: reduce` (DevTools → Rendering → Emulate CSS media
feature, o Ajustes del sistema → Accesibilidad → Reducir movimiento) y confirmar que
**todo el movimiento se detiene**:

- los pulsos que recorren los hilos de señal,
- las filas de la cadena de decisión (pilar 2), que deben aparecer ya resueltas,
- los mensajes de las conversaciones, que deben aparecer ya asentados,
- las entradas de sección al hacer scroll.

Está implementado en los cinco componentes animados y verificado en código, pero
nunca se ejerció en un navegador.

## 4. Barrido de scroll horizontal

En 320, 390, 768, 1024, 1280 y 1440 px: ninguna sección debe producir scroll
horizontal. Esta página ya tuvo un desbordamiento real, así que vale la pena el
barrido completo.

Punto más ajustado: **el flujo exactamente en 1024 px**. La aritmética dice que
sobran 112px repartidos entre tres conectores; confirmar que a esa anchura los
conectores siguen leyéndose como hilos y no como guiones sueltos.

## 5. Contraste y foco

- Los enlaces de la navbar (`text-[13px]`, musgo al 80%) sobre la píldora de vidrio
  con el fondo real detrás. Es el punto más probable de quedar bajo AA.
- Los mensajes de error del formulario tras el cambio a coral oscuro.
- Visibilidad del anillo de foco al navegar con teclado, sobre el fondo `#F5F7F4`
  y sobre las superficies de vidrio.

## 6. Recorrido de teclado y formulario

- Menú móvil: abrir, cerrar con `Escape`, y que los enlaces cierren al tocarlos.
  (El foco no vuelve al botón hamburguesa — conocido, ver seguimiento.)
- Formulario del piloto: enviar vacío (errores en coral oscuro), corregir un campo
  (el error debe desaparecer al escribir), elegir en los dos `select`, y enviar
  válido — el panel verde de éxito debe **recibir el foco**.

## 7. Lo que solo se juzga con los ojos

Si la página se siente como **un producto con universo propio** y no como secciones
sueltas. La revisión de código dice que la tríada de señal reaparece en todas las
secciones que afirman algo del producto; solo mirándola se confirma que eso se
siente, además de cumplirse.

Mirar también la densidad: el rediseño corrigió «demasiado vacío», y el riesgo
opuesto es el amontonamiento. La sección de casos de uso es la más cargada
(conversación + consulta + resultado, tres veces).

## Seguimiento conocido, no bloqueante

- `Escape` cierra el menú móvil pero no devuelve el foco al botón hamburguesa.
- Los componentes de UI no tienen tests automatizados; solo la validación del
  formulario está cubierta, en sus límites. Los defectos que puede tener esta
  página son visuales, y esos los cubre la revisión de arriba.
- El copy de cobranza dice que el próximo recibo llega el 1 de septiembre justo
  después de pagar el de julio; agosto desaparece. Son datos simulados, pero un
  operador atento podría notarlo.
