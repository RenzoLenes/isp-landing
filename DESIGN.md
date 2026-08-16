# Sistema de diseño: Gantry

> Fuente única de verdad del lenguaje visual de la landing. Si el código y este
> documento discrepan, gana este documento — y el código se corrige.
>
> «Referencia Qipeline», donde aparece en este documento, es el material visual
> que trajo el cliente. Hubo una réplica navegable de esa referencia en
> `/qipeline` mientras se definía el lenguaje; ya cumplió su trabajo y se
> retiró, así que el repositorio contiene únicamente Gantry.

## 1. Atmósfera

Una mañana despejada sobre una operación que por fin respira. La página abre en
un cielo real —con nubes de estructura fractal que derivan casi
imperceptiblemente— sobre el que flota una única pieza de producto: la consola
donde se ve WhatsApp con contexto. De ahí hacia abajo el aire se aclara hasta
blanco, la evidencia se presenta en artefactos nítidos, y la página cierra en
tinta.

Ese es el arco y es deliberado: **cielo arriba, claro en medio, tinta al
final.** Nada de alternar oscuro y claro a media página.

Densidad 4 (equilibrada; los artefactos internos suben a 7 porque imitan
software real). Variancia 3: el hero es centrado y simétrico — es una promesa
única y directa, no un collage. Movimiento 3: dos loops perpetuos en todo el
sitio, ni uno más.

## 2. El ritmo de registros

Cuatro registros, uno por fila de la tabla. `SectionRegister` estampa
`data-register` y cada primitiva lee las variables CSS de `globals.css`
(`--text-primary`, `--text-secondary`, `--card-border`, `--card-shadow`,
`--btn-primary-bg/-fg`, `--accent-text`) sin props ni contexto de cliente.

| Registro | Fondo | Secciones |
|---|---|---|
| **Campo Señal** | cielo (`ui/SkyField.tsx`) | Hero |
| **Superficie** | Superficie `#FFFFFF` | El día a día, Casos de uso, Integraciones |
| **Lienzo** | Lienzo `#F0F4F9` | Qué hace Gantry, Cómo funciona, Preguntas frecuentes |
| **Sala Oscura** | Nocturno `#0F1824` | Piloto, Footer |

**La Sala Oscura sólo cierra.** Antes partía la página a la mitad (en «Qué hace
Gantry»), y con el Campo Señal convertido en cielo real eso pasó a leerse como
caer en una caja negra y volver a salir: el mismo artefacto blanco cambiaba de
significado según el fondo. Ahora la oscuridad es el remate y no un sobresalto.

**El cielo sólo abre.** «Cómo funciona» era también Campo Señal, y eso contradecía el arco de arriba además de romper la sección: su panel es de cielo, y un panel de cielo sobre fondo de cielo no tiene borde — en la referencia el panel recorta contra un fondo neutro. Al sacarla, los registros quedaron en alternancia estricta: cielo → Superficie → Lienzo → Superficie → Lienzo → Superficie → Lienzo → Sala Oscura. Antes «El día a día» y «Qué hace Gantry» eran ambas Superficie y adyacentes, sin corte entre ellas.

Los cortes de registro van a sangre completa, sin borde ni sombra.

## 3. Color

- **Cielo** — degradado `#B8DDF8 → #A4D1F6 → #ADDAF8 → #C9E6FA → #E4EEF6 → #F0F4F9`. No es un fondo plano: es atmósfera con nubes (§7). Muere en Lienzo al pie para que la sección siguiente no choque contra el azul.
- **Superficie** `#FFFFFF` — relleno de artefactos y registro claro.
- **Lienzo** `#F0F4F9` — registro neutro y base de la página.
- **Hundido** `#E6ECF4` — cabeceras hundidas, burbujas del sistema.
- **Nocturno** `#0F1824` — registro de cierre. Azul profundo, no carbón. Nunca negro puro.
- **Tinta** `#131D2A` — texto primario y relleno de CTA primaria sobre claro.
- **Acero** `#58697E` — texto secundario, **sólo** sobre Lienzo/Superficie.
- **Niebla Clara** `#DDE5EE` — texto secundario sobre Nocturno.
- **Susurro** `rgb(19 29 42 / 0.10)` — líneas estructurales de 1px.
- **Señal** `#3E86D9` — **el único acento**. Enlaces, foco, nodo de contexto.
- **Señal Profundo** `#1B4F92` — el acento cuando necesita contraste sobre claro.
- ~~**Fibra** `#7AD8AD`~~ — **retirado.** El verde no acompañaba al Campo Señal ni al resto de la landing, y sostener dos acentos contradecía la regla de uno solo. Los estados positivos («Al día», «Cerrado», «Conexión verificada», el resultado de un flujo) pasaron a un tinte de Señal. Coral se queda: un error tiene que distinguirse del acento.
- **Coral / Coral Profundo** `#E78668` / `#C2451F` — error. `#C2451F` mide 5.04:1 sobre blanco.

**Toda la familia se ancla al matiz de Señal (213°), con saturación real.**
Esto se decidió midiendo, no a ojo, y hubo dos correcciones antes de acertar:

1. Los neutros eran **verdes** —Nocturno `#141C19`, Tinta `#17201B`, y el
   secundario se llamaba literalmente *Musgo* (`#647168`, con el verde 13
   puntos por encima del rojo)—, herencia de una identidad anterior. Sobre el
   cielo azul la página se leía verdosa.
2. Se pasaron a un gris frío neutro y **seguía sin leerse como Gantry**. La
   auditoría de matiz/saturación explicó por qué: el matiz ya era correcto
   (205–216° en toda la página), pero los neutros caían a **11–22% de
   saturación** mientras el cielo y Señal viven en **67–82%**. Un neutro casi
   desaturado se lee como gris de plantilla — el de cualquier maqueta — no como
   una marca.

Por eso los oscuros son **azul profundo** y los claros **blanco azulado**: son
el mismo azul de la marca, subido o bajado de luz, no grises con una pizca de
azul. El token pasó a llamarse **Acero**: un nombre de color verde para un gris
frío habría confundido a quien lo lea después.

Regla para cualquier color nuevo: **se deriva de 213° o no entra.** Si hace
falta un neutro, se toma de esta rampa; no se inventa un gris.

**Un solo acento, de verdad.** Señal es el único color de marca. Los estados se
distinguen por familia, no por un segundo acento: tinte de Señal para positivo
y confirmado, tinte de Coral para lo que pide atención, gris hundido para lo
neutro.

## 4. La marca

`ui/GantryMark.tsx`, inline y pintada con `currentColor`: hereda el registro
(Tinta sobre el cielo, Superficie sobre Sala Oscura) sin dos archivos ni
detección de tema, y sin una petición de red en el camino crítico.

**El verde de marca `#00E599` no se usa en la landing.** Es un neón saturado al
100%: sobre el cielo celeste vibra, compite con el titular y abre un segundo
acento donde el sistema sostiene uno. La marca va en Tinta y el color vive en la
interfaz. Los SVG de `public/` se conservan como assets entregables;
`gantry-icon-ink.svg` es la variante que corresponde a esta landing.

**El icono de pestaña** vive en `app/icon.svg` (convención de archivo de Next:
el `<link>` lo pone el framework). Es un azulejo Nocturno con la marca en
Superficie, no la marca suelta sobre transparente como vienen los assets de
`public/`: a 16px, y con el cromo del navegador tan pronto claro como oscuro,
una marca en Tinta sobre transparente desaparece la mitad de las veces. Lo
acompañan `favicon.ico` (16/32/48, para navegadores que aún lo piden) y
`apple-icon.png` (180px, porque iOS ignora el SVG), los tres generados de ese
mismo archivo.

El wordmark **nunca** viene del SVG: se compone como texto vivo en Inter
Semibold junto a la marca. Los archivos de `public/` lo traen en Montserrat,
una fuente que la página no carga, así que se sustituiría por una distinta en
cada equipo.

## 5. Tipografía

- **Una sola familia: Inter, en todos los roles.** Decisión del cliente: la landing adopta el lenguaje visual de la referencia Qipeline, y esa voz es una neo-grotesca clase Helvetica. (Excepción explícita a la regla general de evitar Inter — el brief manda; queda anotada para que nadie la "corrija" de vuelta.) Sustituye al par Geist + Space Grotesk; `--font-display` se conserva como alias que resuelve a Inter, así los call sites de `font-display` no se tocaron.
- **La jerarquía se lleva por peso y tracking, no por cambio de familia:** titulares en Medium (500) con tracking `-0.03em` (el bold gritaba), encabezados de sección en Medium con `-0.025em`, texto en Regular con interlínea 1.55.
- Inter es variable: todos los pesos en un archivo. La trampa de Space Grotesk (pedir un peso no cargado caía en silencio a la sustituta) desaparece.
- Sin serifas. Sin gradiente sobre el texto.

### La escala es proporcional, no fija

`clamp(min, Nvw, max)` **sin sumar un `rem` fijo**. La fórmula anterior
(`1.55rem + 4.4vw`) tocaba su techo ya a ~1400px, así que en un portátil el
titular quedaba clavado mientras el resto de la página seguía escalando.

| Elemento | Escala |
|---|---|
| Titular hero | `clamp(2.25rem, 4.4vw, 5rem)` |
| Subtítulo | `clamp(1.0625rem, 1.2vw, 1.375rem)` |

Los `max-width` de los bloques de texto van en **`em`**, no en px: el límite
escala con el cuerpo de letra, así que el número de palabras por línea —y por
tanto el punto de quiebre— es el mismo a cualquier ancho.

## 6. Componentes

- **Barra de navegación** — transparente sobre el cielo, sin píldora: marca a la izquierda, enlaces centrados, una sola CTA oscura a la derecha. `absolute`, no `fixed`: scrollea con la página, así nunca atraviesa el registro nocturno (lo que elimina de raíz el problema de contraste que la píldora opaca existía para resolver). La franja alta del cielo queda despejada de nubes precisamente para ella.
- **Botones** — rectángulo redondeado de 14–16px (el radio escala con el tamaño: 14px en la barra, 16px en los CTAs del hero), **no cápsula**. CTA primaria en Tinta sobre claro, que **invierte a Superficie sobre Sala Oscura** (una Tinta sobre Nocturno desaparecería). Secundaria en blanco sólido con sombra — no un fantasma translúcido con borde, que sobre el cielo perdía presencia. Elevación de 2px al hover, hundimiento + scale 0.98 al presionar, `focus-visible` con outline desplazado. Sin glow.
- **Frases de cliente en titulares: burbuja, no comillas** (`ui/QuoteBubble.tsx`). Las comillas angulares son la convención correcta en español y a cuerpo de texto leen bien, pero a 2rem son dos marcas grandes que meten ruido en mitad del titular. La frase va en un contorno redondeado teñido de Señal, dimensionado **todo en `em`** para que escale solo con el titular que lo contiene. El contenido sigue guardando `«…»` en `landing.ts` —es la forma correcta de escribirlo— y la decisión de cómo pintarlo vive en el componente.

  **Sólo para frases que alguien dijo.** Una palabra entrecomillada que no es una cita —«depende», «tal vez» en el FAQ— sigue con comillas: convertirla en burbuja afirmaría que un cliente la escribió por WhatsApp, y no es verdad. Y **sin cola**: se probó con una y su diagonal dejaba una muesca donde cruzaba el contorno; el hilo real que va al lado ya dice que son mensajes.

- **Píldora del hero** — blanca casi opaca con chip hundido delante (el copy se parte en el «·»).
- **Footer** — cierre en Sala Oscura a sangre: a la izquierda la marca con el wordmark en versalitas y tracking amplio (tratamiento propio del pie, más quieto que el de la barra), la línea de posicionamiento y el aviso de copyright con el año calculado; a la derecha dos columnas, Legal y Contacto, ésta con el glifo de cada canal. **Un enlace cuyo `href` sigue siendo el marcador `#` se pinta como texto, no como enlace**: uno que no lleva a ninguna parte engaña al visitante y estorba a quien navega con teclado. El aviso no dice "Inc.": no sabemos qué figura legal tiene Gantry y un copyright no es sitio para suponerlo.
- **«Qué hace Gantry»: rejilla de tres tarjetas** con texto arriba y, abajo, una **miniatura de UI real** sobre un lavado de color — la ficha, la cadena de decisión y el ticket, que son la prueba de lo que el texto afirma. Sustituye al zigzag de artefactos grandes, que gastaba tres pantallas para decir tres cosas.

  La guía general desaconseja «tres tarjetas iguales en fila» y con razón: suele ser el relleno por defecto de cualquier landing. **Se acepta aquí como excepción deliberada** porque las tarjetas no son iguales — cada una lleva dentro un artefacto distinto. Lo prohibido es la fila de tres cajas con un icono y un párrafo; esto no lo es.

  El lavado sale **siempre de Señal**: la referencia usa azul, morado y verde, pero aquí varía la intensidad y no el matiz (§3, un solo acento). El lavado lleva **altura fija y anclado abajo**: los tres textos miden distinto, y con altura automática las miniaturas arrancaban a tres alturas y la rejilla se veía torcida. **El número se conserva** porque los pilares son una secuencia — el título lo dice, «en ese orden»; numerar contenido sin orden sería decoración.

- **Encabezados partidos** (`SectionHeading align="split"`) — título a la izquierda, cuerpo a la derecha. Existe porque la página había quedado con **todos** los encabezados centrados, y esa simetría repetida sección tras sección se lee como plantilla. Sólo se aplica donde hay cuerpo: sin él, la columna derecha queda vacía.

- **Retícula de fondo en el cierre** — mosaico SVG de cuadros redondeados detrás de la sección del formulario, que era un plano de color liso. La máscara radial la desvanece hacia el centro: la textura se nota en los bordes y desaparece bajo la lectura. Trazo en Superficie a baja opacidad, no en Tinta — sobre Nocturno una retícula oscura es invisible.

- **FAQ: cada pregunta es su propia tarjeta**, separadas por aire, con un botón circular donde el «+» **gira 45° hasta ser una «×»** (un solo par de trazos rotando, no dos iconos que se intercambian: así el cambio es continuo y no da un salto). Con divisores continuos la sección leía como tabla de contenidos; separadas, cada objeción se lee como una pieza que se puede abrir. El comportamiento —ARIA completa, teclado, `inert` en paneles cerrados— no se tocó: sólo cambió la piel.

- **«Cómo funciona»: carrusel de dos columnas que corre solo** (`SignalFlow.tsx`). Su anatomía:
  - a la izquierda, **titular, entradilla e índice de pasos** — filas separadas por hilos, con glifo y titular, y el cuerpo del paso desplegado sólo en el activo;
  - a la derecha, un **panel de cielo de altura fija** del que emerge la ilustración: rótulo `Paso N / 4` y el chip de **dónde ocurre** arriba (WhatsApp · MikroWisp · Gantry · Tickets), el artefacto en una lámina helada al centro, y abajo la **píldora oscura del traspaso**;
  - a la izquierda de cada fila del índice, un **raíl** que se llena de arriba abajo mientras corre el temporizador.

  **Cada paso trae su propio artefacto** (`FlowArtifacts.tsx`), y no los cuatro la misma pieza: un **hilo de WhatsApp** con cabecera, burbuja, «escribiendo…» y composer; el **resultado de una consulta** con sus comprobaciones marcadas una a una; una **bifurcación con la rama descartada a la vista** y, colgando de ella, la respuesta que salió; un **ticket con destinatario**. Cuando los cuatro pintaban el mismo par de filas, el mensaje no parecía un mensaje ni la decisión parecía una decisión — se leían como cuatro fichas de dos renglones y había que fiarse del texto de al lado para saber qué era cada cosa. **Lo que sostiene la secuencia es el marco, no el contenido**: en un carrusel sólo hay un artefacto en pantalla a la vez, así que la repetición vive en el panel y la variedad puede vivir dentro. En la rejilla anterior era al revés, y por eso allí sí hacía falta que las cuatro piezas fueran iguales.

  El hilo de WhatsApp es **el mismo componente** que usan la consola y los casos de uso, con dos añadidos suyos: `typing` (tres puntos) y `popIn` (cascada por CSS, porque `stagger` depende de entrar en pantalla una sola vez y aquí el hilo ya está en pantalla cuando le toca). El mismo mensaje no puede verse de dos maneras distintas en la misma página.

  **Por qué carrusel y no cuatro tarjetas en fila.** Cuatro tarjetas obligan a leerlas todas a la vez y a repartir entre ellas el mismo espacio, así que ninguna puede explicarse: el cuerpo de cada paso cabía en una línea y la ilustración quedaba del tamaño de un sello. Con un paso a la vez el texto se cuenta entero y el artefacto se ve de verdad. Las versiones anteriores fallaron por partes — primero una fila de artefactos diminutos unidos por hilos, donde los conectores obligaban a que las cuatro columnas midieran lo mismo; después tarjetas con la maqueta en una banda gris; y siempre **un artefacto distinto por paso**, así que las cuatro no se leían como una misma pieza repetida, que es justo lo que hace legible una secuencia.

  **El automático es la mitad del componente.** Avanza cada 7s, y el raíl pinta ese tiempo mientras corre: sin raíl, un cambio automático parece un fallo. Se detiene **en cuanto alguien toca** —clic, teclado o foco—, y se pausa mientras el puntero está encima; a partir de ahí manda la persona, no el reloj. Con `prefers-reduced-motion` no arranca nunca y la sección funciona igual como índice manual. La preferencia se lee con `useSyncExternalStore` y su instantánea de servidor es «quieto», así que servidor y cliente nunca discrepan al hidratar.

  **El traspaso vive en cada paso, no entre pasos.** Era un array aparte con un elemento menos que los pasos, porque describía el hueco entre tarjetas; en un carrusel no hay huecos. Ahora cada paso dice con qué termina —«sigue solo», «sólo si no se resuelve, pasa a una persona», «el caso queda cerrado»—, incluido el último, que antes no tenía nada que decir. Es el dato que convierte cuatro pasos en una cadena.

  **Altura fija en el panel y colapso con `grid-template-rows` en el índice**: los cuatro pasos traen textos de largos distintos, y sin las dos cosas el bloque entero baila en cada salto automático.

- **«El día a día»: dos paneles enfrentados** — el caos a la izquierda sobre Lienzo, el orden a la derecha teñido de Señal, cada uno con su rótulo («Hoy: tu bandeja» / «Con Gantry») y su nota al pie. Antes eran dos listas de píldoras flotando sobre el blanco de la sección, sin superficie que las contuviera y **sin decir cuál era cuál**: el contraste antes/después estaba sólo en la maquetación y nadie lo leía.

- **Sección de Piloto: columna izquierda pegajosa y puntos con cuerpo.** Los tres puntos eran líneas con un topo delante; ahora son filas con glifo, titular y explicación, y la columna se queda fija al hacer scroll. Antes se acababa a media altura y dejaba un vacío enorme junto a un formulario que seguía bajando: la sección se leía descuadrada.

- **Diagrama de integraciones** — los sistemas convergen en la marca de Gantry y salen a WhatsApp. **La marca ES el nodo central**, no su nombre en texto: en un diagrama de logotipos, el eslabón principal era el único sin identidad. Cada nodo lleva su glifo y una línea de rol, con **el mismo vocabulario que la vista Integraciones de la consola** — son las dos caras de la misma promesa y deben hablar igual.

  Dos números mandan y viven como constantes, no repartidos: `CARD_WIDTH` y `OUTPUT_WIDTH`. Los haces anclan en el **centro** de cada nodo, así que su desplazamiento es media anchura; escritos por separado (una clase `w-40` aquí, un `80` allá) se descuadraron 24px en cuanto la tarjeta creció, y el desplazamiento del haz de salida llegó a ser un valor **medido a mano sobre esa cadena de texto concreta** — cambiar el copy lo habría desalineado en silencio.

  La fila lleva **tope de ancho propio** (`max-w-4xl`), no el del contenedor de lectura: con 1220px los tres grupos quedaban como islas separadas por vacío y los haces cruzaban 250px muertos a cada lado.

- **La consola del hero** — una **demo navegable** de la app con la anatomía de la vista "Automatizaciones" de la referencia Qipeline (`ProductConsole.tsx` + `ConsoleViews.tsx`). Seis vistas accesibles desde la barra lateral: Conversaciones (abre por defecto — es la que cuenta la promesa de la página), Automatizaciones, Tickets, Cobranza, Integraciones y Equipo.

  **Es lo único interactivo de la landing además del formulario y el menú, así que su semántica importa.** La barra lateral es un `tablist` real, cada entrada un `tab` con `aria-selected`, el cuerpo un `tabpanel` etiquetado por su pestaña, con el patrón de teclado completo del APG: roving `tabindex` (sólo la activa entra en el orden de tabulación) y flechas en ambos ejes con Inicio/Fin. Dejó de ser un `role="img"` al volverse interactiva: un lector de pantalla anunciaría "imagen" y luego encontraría botones dentro.

  **Un solo `tablist` en el DOM**, que cambia de disposición por CSS: columna agrupada en `lg`, tira horizontal desplazable por debajo (los contenedores de grupo usan `display: contents` en móvil para que los botones fluyan como hijos directos). Renderizar dos —barra lateral + tira móvil— duplicaba el `id` de cada pestaña, que es HTML inválido y rompe la resolución de `aria-controls`.

  Anatomía visual, en tres zonas:
  - **Marco** teñido de cielo (borde blanco translúcido, relleno azul-hielo `#F2F8FD`, sombra ancha teñida `rgba(23,58,102,0.45)`).
  - **Barra lateral sentada sobre el chrome**, no dentro de la ventana: buscador ⌘K, grupos de navegación, ítem activo en píldora oscura con icono.
  - **Ventana blanca** con cabecera (título + toggle "Modo piloto" en Señal + botones de icono + acción del agente con sparkle en Señal).
  - **Lienzo de flujo**: grilla punteada, deshacer/rehacer arriba a la izquierda, zoom arriba a la derecha, tarjeta de disparador, y nodos conectados. Dibuja el flujo real de `LANDING.flow` — Mensaje → Decisión → Ticket/Técnico/Respuesta, con la Consulta al sistema alimentando la cadena desde la derecha. **El nodo que ramifica es la Decisión, no la Consulta**: es la decisión la que abre en tres salidas.
  - **Panel de configuración** en estilo formulario: pestañas con la activa elevada en blanco, campos etiquetados, y un banner de estado como remate. Donde la referencia enseña un error de autenticación en rojo, Gantry enseña la conexión verificada en un tinte de Señal: el mismo hueco del layout contando el momento contrario.

- **El hilo de WhatsApp es UN componente** (`ui/WhatsAppThread.tsx`), usado por la consola del hero y por las tres escenas de «Casos de uso». Antes había dos: la consola tenía el suyo y los casos una tarjeta blanca con burbujas genéricas — el mismo producto enseñado dos veces con dos aspectos distintos, y el de los casos no se parecía a WhatsApp en nada. Las escenas añaden dos cosas: `stagger` (entrada escalonada de las burbujas al aparecer en pantalla) y **escala**.

  **El hilo tiene dos escalas y no es un capricho.** Dentro de la consola es una columna más de una app densa y debe leerse como tal (`compact`, cuerpo 13px). En «Casos de uso» es una de las dos piezas de la sección, con una columna entera para él: a 13px se veía diminuto y perdía la pelea contra el titular de al lado (`comfortable`, cuerpo 15px, avatar y respiración mayores). Ahí además ocupa su columna completa (~576px), no un `max-w-md` de 448px que lo dejaba flotando pequeño en un hueco más ancho.

  **La vista Conversaciones sigue las convenciones de un cliente de mensajería**, porque es lo que el visitante ya sabe leer: tres columnas (lista de chats con avatar, hilo, ficha del cliente), cabecera de conversación, separador de día, burbujas con cola y hora incrustada, doble check de leído, y composer al pie. El hilo lleva un **papel tapiz** —mosaico SVG propio de marcas abstractas al 5.5%, no los garabatos de WhatsApp, que son obra con derechos— cuya función no es decorar: sin esa textura el hilo y la ficha del cliente se leían como un solo bloque blanco y no se entendía dónde acababa uno. La burbuja saliente **no es verde**: usa el tinte de Señal, como el resto de estados positivos.

  **Cada vista tiene la forma que pide su contenido, no una tabla genérica.** Tickets, Cobranza, Integraciones y Equipo empezaron siendo cuatro tablas idénticas de 4-5 columnas: leían como una hoja de cálculo, nada indicaba cuál es el dato importante de cada fila y las cuatro se confundían entre sí. Ahora el **motivo** manda en un ticket (con el id en cifras tabulares y cliente/zona/técnico como meta), el **monto** manda en un cobro (alineado a la derecha, tabular, porque es lo que se escanea), el **sistema** manda en una integración. Sin totales ni resúmenes: serían cifras inventadas.

  **Los sistemas integrados llevan cada uno su glifo** —router, señal, concentrador, canal de mensajes, código— y las conectadas se ven conectadas (borde de Señal y tejuelo teñido) frente a las disponibles, que muestran su acción. Con el mismo icono para los cinco la lista no distinguía nada. **No son los logotipos reales** de MikroWisp, WiMovil ni WispHub: son marcas de terceros y no hay derecho a reproducirlas, así que el glifo dice qué *es* cada sistema, no cuál es.

  **Altura fija en escritorio, no `max-height`.** Cada vista tiene su altura natural (medido: 574px el lienzo, 420px las tablas) y al cambiar de pestaña la consola saltaba, arrastrando todo lo que hay debajo. Con la ventana fija las seis comparten marco — como una app real, donde la ventana no cambia de tamaño al navegar — y el lienzo gana además la proporción generosa de la referencia. Las vistas con menos contenido dejan aire abajo, que es exactamente lo que hace una app. En móvil la altura sigue siendo natural: ahí las columnas apilan y un alto fijo recortaría el panel.

  **Geometría única**: las coordenadas absolutas de los nodos —y las de la tarjeta de disparador, de la que salen dos conectores— alimentan también el SVG, así las líneas nunca quedan desalineadas. La altura de la tarjeta está **medida sobre el render**: si cambia su copy, hay que re-medirla. Por eso el lienzo **no reflowea**: bajo `lg` se sustituye por una lista vertical de los mismos pasos — recortar el diagrama en un teléfono se habría leído como roto, no como intencional. La ventana lleva `overflow-hidden` para que un nodo mal colocado no escape del marco, pero **sin tope de altura**: el lienzo ya es un escenario de altura fija.
- **Artefactos** (ficha, cadena de decisión, ticket, burbuja) — superficie blanca opaca **en todos los registros, incluida la Sala Oscura**: son la evidencia y deben leerse igual en toda la página. Por eso su tinta/musgo internos están fijos a propósito: cambiarlos a `--text-primary` los volvería blanco sobre blanco en el registro oscuro. Sólo su cromo externo (borde + sombra) reacciona, vía `--card-border` / `--card-shadow`.
- **Sombras** teñidas al fondo. Sobre Nocturno la sombra es un halo neutro amplio —una pantalla encendida en una sala a media luz—, deliberadamente **sin** teñir con el acento.
- **Formularios** — etiqueta arriba, error inline debajo. Nunca un toast.
  - **Opción única corta = fichas, no `<select>`** (`ui/ChoiceGroup.tsx`). Cuatro rangos de clientes o cuatro frentes de trabajo caben a la vista: en un desplegable quedan escondidos y el control es el más genérico que existe. En fichas se ven todos, se elige de un toque, y las propias opciones dicen para quién es el piloto — alguien de 4 000 clientes lee «Más de 3000» y sabe que le hablan a él. Son **radios de verdad** (`input[type=radio]` transparente cubriendo la ficha), no botones con estado: así hay navegación con flechas y anuncio correcto gratis. El input va con `-inset-px`, no `inset-0`: un absoluto se posiciona contra la caja de padding y el borde de 1px dejaba el control en 42px contra un suelo de 44.
  - **Los campos van agrupados y rotulados**, no en una lista plana. Arriba lo que califica (qué sistema usas, de qué tamaño eres); abajo lo que sirve para contactarte. Seis campos idénticos en columna no dicen qué se pregunta ni por qué.
  - **Lo que pasa después se dice antes de enviar**, bajo el botón: reduce la fricción de dejar un WhatsApp.
  - **El panel de éxito sólo aparece si la solicitud se guardó de verdad.** Dice «te escribimos en menos de 48 horas»; enseñarlo cuando el envío se perdió deja a alguien esperando un mensaje que nadie va a mandar, y esa es la peor mentira que puede contar esta página. Si el guardado falla hay un aviso en Coral **encima** del botón —quien va a volver a pulsar tiene que haberlo leído antes de pulsar—, el formulario conserva lo escrito y el botón vuelve a estar activo. Es el único sitio de la landing donde Coral ocupa una caja entera en vez de una línea de texto: no es el error de un campo, es que el envío no llegó. `e2e/form.spec.ts` lo fija con un test para que nadie lo «simplifique» de vuelta.
- **Grano** — capa fija de ruido al 5% en `mix-blend-overlay` sobre toda la página, para que las superficies planas se lean como material. `overlay` es lo que hace que el mismo mosaico funcione igual sobre blanco y sobre Nocturno.

## 7. El cielo

Implementación en `ui/SkyField.tsx`; la técnica, en `lib/cloudTile.ts`.

**Por qué no basta con desenfocar elipses.** Una elipse con `blur` tiene una
sola caída gaussiana y un contorno liso: lee como mancha de degradado. Una nube
tiene estructura en varias escalas y un borde deshilachado. Eso lo da el **ruido
fractal**, no el desenfoque. `GradientField` (parches azules difuminados) quedó
retirado por exactamente esto.

Cinco capas: atmósfera · bancos · jirones (derivando en sentido contrario: es lo
que da profundidad) · dos masas muy difusas que aportan la forma grande (el ruido
da textura pero **no composición**) · bruma de salida.

Tres trampas, todas pagadas ya una vez:

1. **La curva de opacidad.** `fractalNoise` no reparte sus valores de forma uniforme: se apiñan alrededor de 0.5. Una tabla que recién suba pasado 0.6 deja casi toda la nube en opacidad cero y el cielo sale liso. Debe llevar 0.3 → transparente, 0.7 → opaco.
2. **El z-index.** El cielo va con `-z-10`. Un `absolute` con z-index automático se pinta en la capa de posicionados, que va por encima del texto de los elementos no posicionados: sin `-z-10` el cielo tapa el titular (que sigue ahí, con opacidad 1, simplemente detrás).
3. **El coste.** Es (píxeles rasterizados × octavas), y el tamaño en pantalla del mosaico **es** su tamaño de rasterizado. Bajar octavas abarata poco y aplana el detalle plumoso. Lo que funciona: achicar el mosaico y bajar `baseFrequency` en la misma proporción. Medido: **~200 ms una sola vez**, cero por frame después. No subir octavas ni tamaño de mosaico sin volver a medir el primer pintado.

## 8. Layout

- **A sangre completa: sin shell.** La página no vive dentro de un contenedor redondeado con padding y sombra. Ese envoltorio existió para que la landing se leyera como un objeto apoyado sobre una mesa; en una página web real deja un marco gris permanente en los cuatro bordes del viewport y contradice la premisa del Campo Señal, que es un cielo que llega hasta el borde. El `<body>` va en Lienzo, sin padding, y cada registro pinta a sangre.
- Contención por `max-width` **proporcional**, no fija. La misma trampa de §5 un nivel más arriba: con el texto en `vw` y los contenedores en px, el conjunto se descuadra al cambiar de pantalla. Consola del hero: `min(1320px, 78vw)`. Titular: el quiebre **no** se coacciona con `max-w`. El titular son dos frases de largo casi idéntico, así que `text-balance` parte exactamente en el punto — donde debe, porque el corte es un hecho del contenido, no del ancho. El planteamiento anterior (tope en `vw` calibrado a mano sobre la anchura de la frase) aguantaba hasta ~1700px y a 1920 se descolocaba: el cuerpo de letra topa en 5rem mientras el `max-w` seguía creciendo. Verificado de 768 a 2560px.
- Colapso a una columna por debajo de 768px, sin excepciones. Desbordamiento horizontal en móvil = fallo crítico.
- Nada se superpone: cada elemento tiene su zona.
- Objetivos táctiles ≥ 44px.
- Secciones a altura completa con `min-h-[100dvh]`, nunca `h-screen`.

## 9. Movimiento

- **Entrada**: cascada escalonada con muelle (`stiffness: 100, damping: 20`). Nunca montar una lista de golpe.
- **Loops perpetuos: dos, y los dos se los ganan.** La nube derivando a distinta velocidad (52s / 84s, ±28px) en el cielo de la cabecera y en el panel de «Cómo funciona» — amplitud en px y no en %, porque un blob de 60vw recorrería medio viewport: esto es clima. Y los **tres puntos de «escribiendo…»**, lo único de la página que dice que algo está ocurriendo AHORA. El artefacto del panel **no flota**: lleva texto, y un bloque de texto que sube y baja para siempre molesta más de lo que aporta.
- **Dos recorridos automáticos, y ninguno es un bucle.** La consola del hero da **una vuelta** por sus seis vistas (3s cada una) y se para donde empezó; el carrusel de «Cómo funciona» avanza cada 5s. Los dos existen por el mismo motivo: la consola parecía una captura y nadie hace clic en una captura, así que Automatizaciones, Tickets y Cobranza sólo las veía quien adivinaba que la barra lateral era pulsable. Los dos llevan **reloj visible** —un raíl que se llena en el tiempo del turno—, porque una vista que cambia sola sin avisar se lee como un fallo; en «Cómo funciona» es vertical, en la consola es horizontal y vive dentro de la pastilla activa, que es la única caja con la misma forma en la barra lateral de escritorio y en la tira de móvil. Los dos **se apagan para siempre** al primer clic, tecla o foco, y sólo pausan con el ratón encima: quien pasa el cursor va a hacer clic, y cambiarle la vista debajo sería hostil. Con `prefers-reduced-motion` ninguno arranca; en la consola queda en su lugar un rótulo («Demo navegable — ábrela donde quieras») que dice lo mismo con palabras. La consola además espera a estar **en pantalla** para empezar: bajo el pliegue de un móvil, la vuelta se gastaría sin que nadie la viera. El tiempo distinto no es capricho — en la consola sólo hay que mirar, en «Cómo funciona» hay que leer un párrafo.
- **El carrusel de «Cómo funciona» anima en CSS, no en JS** (`flow-rail`, `flow-slide`, `flow-pop`, `typing-dot`): todas se disparan al remontar un nodo con `key`, así que no hay estado que sincronizar ni `initial` que pueda discrepar al hidratar. El raíl vive lleno y la animación lo trae desde vacío — así, con el automático parado o apagado por preferencia del sistema, basta con no animar para que se pinte entero. Las filas del artefacto entran en cascada con `both`: sin él se pintarían todas de golpe y el retardo sólo existiría en el papel.
- Sólo `transform` y `opacity`. Nunca `top`/`left`/`width`/`height`.
- **`prefers-reduced-motion`** se resuelve en CSS (`[data-motion-settle]`), no en JS. `useReducedMotion()` devuelve `null` en el servidor y la respuesta real en el primer render del cliente: usarlo para elegir `initial` provocaba error de hidratación #418 y un remontaje completo. El CSS se aplica desde el primer pintado, incluso antes de hidratar, y gana a cualquier estilo inline.

## 10. Contraste

- Mínimo 4.5:1 en texto normal. Sobre el Campo Señal, Acero **falla** (3.78:1): ahí el secundario es Tinta al 85%.
- **Medir por píxel, no por token.** Leer el valor CSS de `color` no ve la composición real: un texto translúcido sobre una píldora translúcida sobre un fondo que cambia al hacer scroll compone algo que ningún token declara. Esa trampa ya produjo un 1.80:1 real que la comprobación por DOM daba por bueno.

## 10b. Copy

- **El titular nombra la categoría y promete un resultado.** «Tu agente de IA atiende a tus clientes por WhatsApp»: qué es (agente de IA), qué hace (atiende) y por dónde. El anterior —«WhatsApp con el contexto real de cada cliente»— era un sintagma nominal **sin verbo**: describía un estado del producto, no lo que gana quien lee. Y «contexto real» es jerga interna: nadie se levanta pensando que le falta contexto.
- **Dos líneas, no tres.** Un titular de tres líneas diluye el golpe. Se acorta el titular y los detalles bajan al subtítulo, que es su sitio.
- **El quiebre lo hace `text-balance`, no un `max-width` calibrado.** Ver §5.
- **«Contexto» está prohibido en texto visible.** Era la muleta de la página: «WhatsApp con el contexto real», «resuelto con contexto», «un ticket con contexto», «falta de contexto». Es jerga interna — nadie con un ISP se levanta pensando que le falta contexto — y además tapaba el trabajo de explicar: cada vez que aparecía, había una frase concreta sin escribir debajo. Se dice **qué sabe** («sabe quién escribe antes de responder») o **qué pasa** («atendido antes de que abras el chat»), nunca la etiqueta.
- **Verbo antes que sustantivo, hecho antes que intención.** «Se conecta al sistema que ya usas», no «Diseñado para conectarse». Un producto se conecta o no.
- **Los títulos de sección dicen lo que hay debajo.** «Tres cosas, bien hechas» servía para cualquier producto del mundo; «Responde, decide y escala. En ese orden» nombra los tres pilares.
- **Nada que la página no pueda sostener tres secciones más abajo.** El recurso de impacto de la referencia es una promesa de tiempo («in Minutes»); aquí sería mentira, porque el FAQ dice que la implementación depende del sistema de cada operador. El impacto se saca de ser concreto, no rápido.
- **El titular nombra el nicho, y con SU vocabulario.** «…el WhatsApp de tu ISP», y el badge añade WISP. No es una elección estética: así les hablan literalmente sus propios sistemas de gestión — WispHub se anuncia como «sistema para administrar WISP e ISP», MikroWisp como «software de administración ISP». Es la palabra que el lector ve todos los días. **«Telco» sería un error**: en Perú apunta a Movistar y Claro, no a un operador regional de 300–3000 clientes, que es el rango del propio formulario.
- **No se anuncia lo que no existe.** Las llamadas se quitaron del hero por completo. En el FAQ queda la pregunta —es una objeción real— respondida sin prometer nada: «Hoy no: Gantry atiende WhatsApp, no llamadas». Un canal futuro anunciado en el hero, aunque lleve chip de «próximamente», se lee como disponible y revienta en la primera demo.

## 11. Prohibido

- Negro puro `#000000`; usar Tinta o Nocturno.
- El verde de marca `#00E599` en cualquier superficie de la landing (§4).
- Un segundo acento. Verde en cualquier superficie (§3: Fibra se retiró). Coral es semántico de error, no decorativo.
- Glow neón o sombras teñidas con el acento.
- Serifas. Gradiente sobre el texto. Una segunda familia tipográfica (§5: la voz es Inter sola, jerarquía por peso).
- Cápsulas (`rounded-full`) en botones — la geometría es rectángulo de 14–16px (§6).
- Barra de navegación fija o con píldora de fondo (§6).
- Emojis. La iconografía es SVG inline.
- Métricas inventadas: uptimes, tiempos de respuesta, porcentajes. Todo número visible sale del contenido real o no se pone. Tampoco secciones tipo «EN CIFRAS» rellenas de datos fabricados.
- **Testimonios inventados.** Gantry está reclutando su piloto: no tiene clientes todavía. Poner citas con fotos de personas que nunca dijeron eso es engañar al visitante, y contradice de frente el tono del FAQ («no tenemos certificación que mostrarte»). La sección se construye el día que haya una cita real de un operador del piloto.
- Nombres genéricos de relleno. Los ejemplos de la página son un solo cliente coherente (Marisol Quispe, ticket #184) reutilizado en todas las secciones: la landing es una demo, no tres datasets falsos sin relación.
- Clichés de copy («impulsa», «potencia», «sin fricción», «próxima generación»).
- Texto de relleno: «desplázate para explorar», flechas rebotando.
- Spinners circulares genéricos. (La fila de tres tarjetas tiene su excepción razonada en §6: sólo vale si cada una lleva contenido distinto dentro, no un icono y un párrafo.)
- Animar propiedades de layout, o añadir un tercer loop perpetuo (§9).
- Envolver la página en un shell redondeado con padding o sombra (§8).
- Volver a meter en el repositorio maquetas de referencia como páginas navegables: se quedan sin mantener y compiten con la landing en cada búsqueda.
