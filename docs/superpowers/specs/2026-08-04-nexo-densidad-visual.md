# Spec — Rediseño de densidad visual e identidad (Nexo)

**Fecha:** 2026-08-04
**Origen:** crítica de diseño del cliente sobre la v1 ya construida.
**Diagnóstico central:** la página está en la dirección Qipeline (limpia, serif,
premium) pero no alcanza el carácter de TwelveMei / AI Voice Agents. El hero
establece un lenguaje visual —tarjetas flotantes, halo, hilo punteado— y el resto
de la página lo abandona. Falta densidad de evidencia y una identidad que se repita.

**Principio rector:** no más adornos, más narrativa visual. Cada sección muestra la
tríada de señal definida en `DESIGN.md` §2 con artefactos reales, no etiquetas
dentro de cajas.

---

## Decisiones de negocio confirmadas por el cliente

1. **Integraciones:** ninguna construida todavía. El copy debe encuadrarse como
   diseño e intención, nombrando los sistemas como objetivo del piloto. Verbo
   permitido: "diseñado para conectarse", "durante el piloto integramos el que uses".
   Prohibido: "integrado con", "compatible con" en presente.
2. **Contacto:** se elimina el correo del footer. Todo el contacto pasa por el
   formulario del piloto. No se inventa dominio.
3. **Cantidad de clientes:** campo `select` con rangos, no número libre.

---

## 1. Primitivas nuevas (`src/components/ui/`)

Estas son la gramática reutilizable. Todo lo demás las compone.

### `SignalThread`
Hilo punteado con pulso viajero. Client Component.
- Props: `orientation: "vertical" | "horizontal"`, `className?`.
- Render: SVG de 1px, `stroke-lavender`, `strokeDasharray="3 6"`, con un nodo
  pequeño que recorre la longitud en la dirección del flujo.
- Solo anima `opacity`/`transform`. Con `useReducedMotion` el pulso no se renderiza
  y queda el trazo estático.
- `aria-hidden` siempre — es decoración estructural.

### `DataCard`
Tarjeta de contexto: la corrección directa a "rectángulos que parecen placeholder".
Server Component.
- Props: `title`, `status?: { label: string; tone: "ok" | "alert" | "neutral" }`,
  `rows: readonly { label: string; value: string }[]`, `footer?: ReactNode`.
- Cabecera: `title` en `text-sm font-medium text-ink` + `StatusChip` a la derecha.
- Cuerpo: filas `label` (izq, `text-xs text-moss`) / `value` (der, `text-sm text-ink`,
  números tabulares), separadas por `border-t border-whisper`.
- Fondo `bg-surface`, radio `rounded-3xl`, borde susurro, `shadow-card`.

### `StatusChip`
Píldora de estado. Server Component.
- Props: `label`, `tone: "ok" | "alert" | "neutral"`.
- `ok` → `bg-fiber/20 text-ink`; `alert` → `bg-coral/20 text-ink`;
  `neutral` → `bg-fog-deep text-moss`. Siempre con texto — nunca color solo.

### `DecisionChain`
Cadena de decisión: las comprobaciones que Nexo hace antes de responder.
Client Component (las filas se resuelven escalonadas al entrar en viewport).
- Props: `checks: readonly { question: string; answer: string }[]`,
  `outcome: string`.
- Cada fila: `question` a la izquierda, `answer` a la derecha en un `StatusChip`
  neutro, con el hilo vertical conectando las filas.
- Cierre: separador y `outcome` precedido de una flecha, en `text-ink font-medium`,
  con nodo azul.
- Con motion reducido, todas las filas aparecen resueltas de inmediato.

---

## 2. Hero — jerarquía en lugar de dispersión

Problema: las tres tarjetas están dispersas; parece infografía correcta, no pieza
heroica.

**Composición nueva, en columna clara y con un elemento dominante:**

```
┌───────────────────────────────────┐
│  CONVERSACIÓN  (dominante)        │  ← más ancha, más padding, 2 mensajes
│  Marisol Q. · WhatsApp            │
│  «No tengo internet desde…»       │
└───────────────────────────────────┘
              ╎ pulso
        ┌─────────────────────┐
        │  CONTEXTO (DataCard)│         ← desplazada a la derecha, más chica
        │  Servicio · al día  │
        └─────────────────────┘
              ╎ pulso
   ┌──────────────────────┐
   │  ACCIÓN — Ticket #184│              ← desplazada a la izquierda
   └──────────────────────┘
```

- La tarjeta de conversación ocupa el 100% del ancho de la composición; las otras
  dos ~72% y ~76%, desplazadas en sentidos opuestos para mantener asimetría.
- El hilo vertical conecta las tres de forma **evidente** (no curvas dispersas):
  un `SignalThread` vertical entre pieza y pieza, con nodo en cada extremo.
- La tarjeta de contexto pasa a ser un `DataCard` real con filas
  (Plan / Estado / Zona), no una etiqueta con punto.
- Se conserva: `role="img"` + `aria-label` descriptivo, halos detrás con
  `aria-hidden`, entrada en cascada, respeto de motion reducido.
- Se elimina el flotado infinito de las tarjetas (era decorativo). El único
  movimiento perpetuo es el pulso del hilo.

## 3. Navbar — que ceda protagonismo

- Reducir altura ~20%: padding vertical de la píldora de `py-2.5` a `py-1.5`.
- Sombra: de `shadow-card` a una sombra propia mucho más tenue.
- Fondo más translúcido y borde más sutil.
- Enlaces: bajar tamaño a `text-[13px]` y contraste (Musgo al 80%, hover a Tinta).
- CTA: **mantener `min-h-11`** (piso táctil no negociable) pero reducir padding
  horizontal y desaturar levemente el azul mediante opacidad del fondo.
- **Al hacer scroll (> 24px):** la píldora se compacta aún más y se pega más arriba
  (`top-4` → `top-2`), con transición de `transform`/`opacity` únicamente.
  Client Component; listener de scroll pasivo con limpieza.

## 4. Pilares — evidencia distinta en cada bloque

Se elimina `visualLabel` y la caja con gradiente y círculos concéntricos.
Cada pilar recibe un artefacto propio:

**01 · Responde con el contexto real → `DataCard` (ficha de cliente)**
```
Marisol Quispe                    [Al día]
─────────────────────────────────────────
Plan            100 Mbps
Zona            Sur · Nodo 4
Deuda           S/ 0.00
Último ticket   #171 · cerrado
```

**02 · Decide con datos de tu sistema → `DecisionChain`**
```
¿Tiene deuda?           No
¿Corte programado?      No
¿Falla masiva en zona?  No
─────────────────────────────────────────
→ Sugerir reinicio de router
```

**03 · Escala a tu equipo con el trabajo hecho → `DataCard` + footer de asignación**
```
Ticket #184                    [Prioridad media]
─────────────────────────────────────────
Motivo          Sin señal tras reinicio
Ya probado      Reinicio de router, cables
Zona            Sur · Nodo 4
─────────────────────────────────────────
Técnico: Luis A.        Hoy, 18:00
```

Se conserva el zig-zag alternado y el número serif grande del pilar.

## 5. Casos de uso — mostrar el paso intermedio

Hoy se ve conversación + resultado; falta la consulta que ocurre en medio, que es
justamente lo que diferencia al producto de un chatbot.

Cada caso pasa a: **conversación → `DataCard` de consulta → tarjeta de resultado**,
con el hilo de señal conectando la consulta y el resultado dentro de la columna de
texto. Ejemplo (soporte):

```
Consulta al sistema
─────────────────────────────
Servicio        Activo
Deuda           S/ 0.00
Falla masiva    No
```

Se conserva la alternancia `lg:` y el orden DOM (texto antes que conversación).

## 6. Cómo funciona — ruta de datos, no cuatro columnas

Se elimina la fila de círculos numerados. El flujo se representa como recorrido
real, cada paso con su artefacto en miniatura:

```
[burbuja WhatsApp] → [consulta al sistema] → [regla de decisión] → [ticket o agente]
```

- Paso 1: mini burbuja de chat.
- Paso 2: mini `DataCard` de dos filas, con los sistemas nombrados como destino.
- Paso 3: regla de decisión compacta (una condición y su salida).
- Paso 4: chip de ticket asignado / agente humano.
- Los cuatro conectados por `SignalThread` horizontal (vertical al apilar) con
  pulsos viajando en la dirección del flujo.
- Los pasos siguen siendo un `<ol>` con `<li>` reales (nunca `display: contents`).
- **Aritmética obligatoria antes de fijar anchos:** el ancho útil es
  `min(viewport − 32, 1220) − 112`. El contenido indeformable debe caber con
  holgura para los conectores en el breakpoint donde se pasa a fila.

## 7. Integraciones — convergencia, no tres pills sueltas

Sección reconstruida por completo. Diagrama de convergencia:

```
MikroWisp  ─┐
WiMovil    ─┤
WispHub    ─┼──▶   Nexo   ──▶   WhatsApp Business
Tu API     ─┘
```

- Columna izquierda: los sistemas de gestión como tarjetas pequeñas apiladas.
- Centro: el nodo Nexo, con halo lavanda — el único punto de convergencia.
- Derecha: WhatsApp Business como salida.
- Hilos de señal desde cada sistema al nodo central y del nodo a la salida.
- En móvil el diagrama se apila en vertical manteniendo la dirección del flujo.
- **Copy honesto** (ninguna integración construida): título "Diseñado para
  conectarse con lo que ya usas."; cuerpo explicando que Nexo lee y escribe vía
  API y que durante el piloto se integra el sistema que el ISP tenga.
- Frase de confianza destacada: **"Sin migrar clientes, facturación ni operación de red."**

## 8. Piloto — más credibilidad

**Campos del formulario** (reemplazan a `ciudad`):
| Campo | Tipo | Obligatorio |
|---|---|---|
| Nombre | texto | sí |
| Nombre del ISP | texto | sí |
| Sistema actual | texto | sí |
| Cantidad de clientes | select de rangos | sí |
| ¿Qué te quita más tiempo? | select (Soporte / Cobranza / Instalaciones / Ventas) | **no** |
| WhatsApp de contacto | tel | sí |

Rangos de clientes: `Menos de 300`, `300–1000`, `1000–3000`, `Más de 3000`.

**Copy:** "Condiciones preferentes" → **"Precio piloto preferencial para los
primeros operadores seleccionados."**

**Validación** (`src/lib/pilot.ts`): `ciudad` sale; entran `sistema` (requerido) y
`clientes` (requerido, debe ser uno de los rangos). `reto` es opcional y no valida.
Mensajes nuevos en español, afirmados por tests.

## 9. Footer

Se elimina el correo. Quedan wordmark, tagline y año, más un enlace al formulario
del piloto como única vía de contacto.

---

## Restricciones que no cambian

Todas las de `DESIGN.md`: paleta por tokens, Instrument Serif solo en titulares,
copy en `landing.ts`, solo `transform`/`opacity`, `prefers-reduced-motion` apaga
los loops, targets ≥44px, máximo 1220px, cero scroll horizontal, sin métricas
inventadas ni logos falsos.

## Verificación

- `npm test`, `npx tsc --noEmit`, `npm run build`, `npm run lint` limpios.
- Aritmética de contenedor documentada para toda fila con anchos fijos.
- Checklist manual de navegador actualizado en
  `docs/superpowers/2026-08-03-nexo-verificacion-manual.md`.
