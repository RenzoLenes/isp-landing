# Verificación de la landing de Nexo

**Actualizado el 2026-08-04.** Lo que antes era una lista manual ahora está
automatizado con Playwright. Este documento explica qué cubre la suite y qué sigue
necesitando ojos humanos.

## Automatizado

```bash
npm run test:e2e     # 43 checks en Chromium, levanta la app sola
npm test             # 11 tests unitarios de validación del formulario
```

La suite vive en `e2e/` y cubre:

| Área | Qué verifica |
|---|---|
| Scroll horizontal | Ningún desbordamiento en 320, 390, 768, 1024, 1280 y 1440 px |
| Integraciones | Los cuatro hilos de convergencia con ancho > 0, diagrama centrado, tronco que alcanza las tarjetas externas |
| Hero | Las tres piezas no se solapan en 320, 360, 390 y 1280 px |
| Flujo | Fila a partir de 1024 px, apilado por debajo, conectores con ancho real |
| Movimiento reducido | Ninguna animación infinita corriendo; contenido visible de inmediato |
| Objetivos táctiles | Todo control visible ≥ 44 px en 390 (con menú abierto) y 768 |
| Contraste | Ratios WCAG calculados en página sobre errores del formulario, enlaces de navbar, números de pilar y texto secundario |
| Formulario | Envío vacío marca errores y `aria-invalid`; escribir limpia el error; envío válido muestra el panel de éxito y le da el foco |
| Teclado | Hamburguesa abre, `Escape` cierra, `aria-expanded` sigue el estado, todo elemento enfocado tiene indicador visible |
| Anclas | Cada enlace resuelve a un id existente y el destino no queda bajo la navbar fija |

También genera capturas de página completa en `e2e/screenshots/` (ignoradas por
git) para revisión visual.

## Defectos que encontró la automatización

Ambos ya corregidos, anotados aquí porque muestran qué clase de cosa se escapa a
la revisión de código:

1. **El wordmark de la navbar medía 24 px de alto**, bajo el piso de 44 px. Ningún
   linter ni revisión lo había visto.
2. **Las tarjetas de sistema en Integraciones tenían anchos distintos**, así que
   los cuatro hilos arrancaban en x distintos y la convergencia se leía
   desordenada. Efecto secundario de haber quitado `w-full` para arreglar un bug
   anterior en el que los hilos colapsaban a cero.

## Lo que sigue siendo humano

La suite verifica hechos, no juicio. Queda por mirar:

- **Si la página se siente como un producto con universo propio** y no como
  secciones sueltas. La revisión de código confirma que la tríada de señal
  reaparece en todas las secciones que afirman algo del producto; que eso además
  *se sienta* solo lo confirma alguien mirando.
- **Densidad.** El rediseño corrigió el exceso de vacío; el riesgo opuesto es el
  amontonamiento. La sección de casos de uso es la más cargada.
- **Safari.** La suite corre solo en Chromium. El `backdrop-blur` de las tarjetas
  de vidrio sobre los halos del hero es lo más probable que se vea distinto.
- **Rendimiento percibido** de las animaciones de entrada en un teléfono de gama
  baja.

## Seguimiento conocido, no bloqueante

- `Escape` cierra el menú móvil pero no devuelve el foco al botón hamburguesa.
- Los enlaces de la navbar pasan AA por poco (5.02:1 sobre 4.5:1 requerido). Si
  el token `moss` o la opacidad de la píldora cambian, revisar de nuevo.
- Los componentes de UI no tienen tests de regresión visual; la suite verifica
  geometría y accesibilidad, no apariencia.
- El copy de cobranza dice que el próximo recibo llega el 1 de septiembre justo
  después de pagar el de julio; agosto desaparece. Son datos simulados.
