# Spec — Realineamiento con las referencias + renombrado a Gantry

**Fecha:** 2026-08-04
**Origen:** el cliente compartió por primera vez las **capturas** de las cuatro
referencias. Hasta ahora se trabajó desde su descripción en texto, y ambas cosas
se contradicen en puntos estructurales. Las imágenes mandan.

## El diagnóstico

Las cuatro referencias comparten cinco rasgos que la landing actual **no tiene**:

| Rasgo | Referencias | Nuestra landing |
|---|---|---|
| Hero centrado | Qipeline, TwelveMei, Voice Agents | Split asimétrico a la izquierda |
| Fondo atmosférico a sangre | Las cuatro | Gradiente radial casi invisible |
| Captura de producto grande recortada por el fold | Qipeline, TwelveMei, Nexchat | Tres tarjetas pequeñas flotando |
| Badge píldora sobre el titular | Qipeline, TwelveMei, Voice Agents | No existe |
| Contenedor exterior redondeado | Qipeline, TwelveMei | Página a sangre |

**Conflicto explícito que este spec resuelve:** el `DESIGN.md` vigente prohíbe el
hero centrado y las «capturas literales de dashboard». Esas reglas se derivaron del
texto del brief original. Las imágenes del brief hacen exactamente lo contrario.
Este spec las revoca y `DESIGN.md` debe actualizarse en consecuencia.

## Decisiones confirmadas por el cliente

1. **Atmósfera:** campo de gradiente construido en CSS/SVG (referencia 4), no
   fotografía. Sin archivos de imagen.
2. **Referencia líder:** **Qipeline**. Es el esqueleto del hero. Las otras aportan
   detalles: la calma editorial de TwelveMei, el campo de gradiente de Voice Agents.
3. **Tipografía:** el titular pasa de serif a **sans grande y apretado**.

## 1. Renombrado: Nexo → Gantry

Completo y sin residuos: contenido, metadata, `DESIGN.md`, specs, README, tests
unitarios, specs e2e, comentarios. Verificar con `grep -ri nexo` que no queda nada
salvo referencias históricas en documentos de proceso ya archivados.

**La metáfora cambia y el copy puede aprovecharla.** Un *gantry* es la estructura
que sostiene y desplaza cargas — grúas pórtico, torres de lanzamiento. Para un ISP:
la estructura que sostiene la operación. No forzarlo, pero el nombre ya no es
«nexo/conexión», así que cualquier copy que jugara con «conectar» como identidad de
marca debe revisarse.

## 2. Tipografía

- **Display:** `Instrument Sans` (`next/font/google`). Titulares en tamaños grandes
  con `tracking-tight`. Es el grotesco apretado de Qipeline, con más carácter que un
  sans neutro, y mantiene un hilo con la Instrument Serif que se retira.
- **Cuerpo y UI:** `Geist`, sin cambios.
- **Instrument Serif se elimina del proyecto.** Ya no tiene rol: si los titulares
  son sans, el serif no aparece en ninguna parte. Quitar la fuente del layout para
  no descargar un archivo que nadie usa.
- Números tabulares se mantienen en toda fila de datos.

## 3. Atmósfera — el campo de gradiente

Componente nuevo, `src/components/ui/GradientField.tsx`. Server Component,
`aria-hidden`, `-z-10`.

Bloques suaves y difuminados de azul y lavanda sobre el fondo niebla, concentrados
tras el hero y disolviéndose hacia abajo. La referencia 4 lo resuelve con manchas
de gradiente de bordes blandos que se solapan; se aproxima con varios
`radial-gradient` superpuestos más `blur`, o con un `<svg>` de rectángulos difusos.

Reglas: nada de neón, nada saturado. Debe leerse como luz, no como color plano. No
puede reducir el contraste del texto que va encima — verificar los ratios del
titular y el subtítulo sobre las zonas más intensas.

## 4. Hero — esqueleto Qipeline

```
        ( badge píldora: «Piloto abierto · ISPs de Perú» )

              TITULAR SANS ENORME, CENTRADO
                 EN DOS O TRES LÍNEAS

           subtítulo centrado, máximo dos líneas

        [ CTA oscuro sólido ]   [ CTA claro fantasma ]

   ┌──────────────────────────────────────────────────┐
   │            CONSOLA DE PRODUCTO                    │
   │  barra lateral │ conversaciones │ contexto+acción │   ← recortada por el fold
   └──────────────────────────────────────────────────┘
```

- Todo centrado. `max-w` del bloque de texto alrededor de 900px para que el titular
  rompa en las líneas correctas.
- El badge es una píldora blanca con borde susurro, texto pequeño, sin emoji.
- CTA primario oscuro (tinta), secundario claro con borde — como Qipeline. Ambos
  mantienen el piso táctil de 44px.
- La consola se recorta por abajo: sobresale del hero y el siguiente bloque la
  tapa parcialmente. Es el gesto que hace que se lea como producto real.

## 5. La consola de producto — la pieza nueva más importante

Reemplaza a las tres tarjetas flotantes. Debe verse **densa y creíble**, como una
captura real, compuesta de los artefactos que ya existen.

```
┌────────────┬───────────────────────────┬────────────────────┐
│ Gantry     │ Conversaciones            │ Contexto            │
│            │                           │                     │
│ Conversac. │ ● Marisol Q.    Sin señal │ [DataCard cliente]  │
│ Tickets    │   Jorge R.      Pago      │  Plan   100 Mbps    │
│ Cobranza   │   Nuevo         Cobertura │  Zona   Sur·Nodo 4  │
│ Integrac.  │ ─────────────────────────  │  Deuda  S/ 0.00     │
│            │ [burbujas de la            │                     │
│            │  conversación abierta]     │ [decisión resuelta] │
│            │                            │ [ticket #184]       │
└────────────┴───────────────────────────┴────────────────────┘
```

- Tres columnas en escritorio. En móvil se recorta mostrando solo la columna
  central, o se reduce a la conversación con la tarjeta de contexto debajo.
- Barra lateral: wordmark + cuatro ítems de navegación, uno activo.
- Columna central: lista de conversaciones (3 filas, una activa con punto) y debajo
  la conversación abierta con burbujas reales.
- Columna derecha: `DataCard` de cliente, resultado de la decisión, y la acción
  (ticket listo).
- Marco: radio grande, borde susurro, sombra difusa, fondo superficie. Debe leerse
  como una ventana de aplicación, no como una tarjeta más.
- **Es ilustrativo, no una promesa.** Datos claramente de ejemplo, sin métricas
  agregadas inventadas.

## 6. Contenedor exterior redondeado

Como Qipeline y TwelveMei: toda la página vive dentro de un contenedor con radio
generoso y un margen exterior en un gris ligeramente distinto al fondo interno. Da
la sensación de objeto, no de documento.

Cuidado: el contenedor no puede crear scroll horizontal ni romper el `position:
fixed` de la navbar. Verificar ambos.

## 7. Qué se conserva

La tríada de señal y todos sus artefactos siguen vigentes de la sección del problema
hacia abajo — resuelven la crítica anterior sobre densidad y no se tocan salvo por
el cambio tipográfico de sus titulares a sans.

## 8. Restricciones que no cambian

Paleta por tokens; `fiber` solo confirmaciones y nodo terminal; `coral` solo
alertas; copy visible solo desde `landing.ts`; únicamente `transform`/`opacity`
animados con `prefers-reduced-motion` respetado; cero scroll horizontal; controles
≥44px; sin métricas inventadas, logos de clientes ni testimonios; integraciones
siguen redactadas como intención de diseño.

## 9. Verificación

`npm test`, `npx tsc --noEmit`, `npm run build`, `npm run lint` limpios, y
`npm run test:e2e` en verde tras actualizar las specs que mencionan «Nexo» o
asumen el hero anterior. Añadir checks e2e para: el badge existe, la consola es
visible en el hero, el contenedor redondeado no genera overflow, y el contraste del
titular sobre la zona más intensa del gradiente.
