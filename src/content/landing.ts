// Fuente única de verdad de los rangos permitidos: es copy visible (texto de
// <option>), así que vive aquí como el resto del copy. `src/lib/pilot.ts`
// importa esta lista para su comprobación de pertenencia en la validación.
export const PILOT_CLIENT_RANGES = [
  "Menos de 300",
  "300–1000",
  "1000–3000",
  "Más de 3000",
] as const;

export type ChatMessage = {
  from: "cliente" | "bot";
  text: string;
};

export type ArtifactRow = { label: string; value: string };

export type UseCase = {
  id: string;
  tag: string;
  title: string;
  description: string;
  /** Con quién es la conversación; alimenta la cabecera del hilo. */
  contact: { name: string; initials: string };
  chat: ThreadMessage[];
  lookup: { title: string; rows: readonly ArtifactRow[] };
  result: { title: string; meta: string };
};

export type PillarArtifact =
  | {
      kind: "ficha";
      title: string;
      status: string;
      rows: readonly ArtifactRow[];
    }
  | {
      kind: "decision";
      checks: readonly { question: string; answer: string }[];
      outcome: string;
    }
  | {
      kind: "ticket";
      title: string;
      status: string;
      rows: readonly ArtifactRow[];
      footerLabel: string;
      footerValue: string;
    };

export type Pillar = {
  number: string;
  title: string;
  body: string;
  artifact: PillarArtifact;
};

/**
 * Lo que se ve dentro del panel en cada paso.
 *
 * Cada paso trae el artefacto que le toca, y no todos la misma pieza: un
 * mensaje se enseña como un hilo de WhatsApp, una consulta como el resultado
 * de una consulta, una decisión como una bifurcación con una rama descartada.
 * Cuando los cuatro pintaban el mismo par de filas, ni el mensaje parecía un
 * mensaje ni la decisión parecía una decisión — se leían como cuatro fichas
 * con dos renglones.
 *
 * Lo que mantiene la secuencia legible NO es que el contenido sea idéntico,
 * sino que el marco lo sea: el mismo panel de cielo, el mismo rótulo `Paso N`,
 * el mismo chip arriba y la misma píldora de traspaso abajo. En un carrusel
 * sólo hay un artefacto en pantalla a la vez, así que la repetición vive en el
 * marco y la variedad puede vivir dentro.
 */
export type FlowArtifact =
  | {
      kind: "chat";
      contact: { name: string; initials: string; subtitle: string };
      day: string;
      messages: readonly ThreadMessage[];
      /** Se anuncia a lectores de pantalla; en pantalla son tres puntos. */
      typing: string;
      composer: string;
    }
  | {
      kind: "consulta";
      system: string;
      badge: string;
      rows: readonly ArtifactRow[];
    }
  | {
      kind: "decision";
      question: string;
      /** Las dos ramas. La descartada se enseña: es lo que hace ver que hubo decisión. */
      options: readonly { label: string; note: string; taken: boolean }[];
      reply: ThreadMessage;
    }
  | {
      kind: "ticket";
      id: string;
      status: string;
      rows: readonly ArtifactRow[];
      assignee: { name: string; initials: string; meta: string };
    };

/** Glifo de la fila en el índice. No decora: dice de qué trata el paso. */
export type FlowIcon = "mensaje" | "sistema" | "accion" | "equipo";

/**
 * Un paso del flujo: su artefacto, el chip que dice DÓNDE ocurre y el traspaso
 * con el que termina.
 *
 * `handoff` era un array aparte (`links`) con un elemento menos que `steps`,
 * porque describía el hueco ENTRE tarjetas. En un carrusel no hay huecos: cada
 * paso se enseña solo, así que lo que ocurre al salir de él es suyo — incluido
 * el último, que antes no tenía nada que decir y ahora cierra el caso.
 */
export type FlowStep = {
  title: string;
  body: string;
  chip: string;
  icon: FlowIcon;
  handoff: string;
  artifact: FlowArtifact;
};

export type FaqItem = { question: string; answer: string };

export type PilotTextField = {
  label: string;
  placeholder: string;
};

export type PilotSelectField = {
  label: string;
  placeholder: string;
  options: readonly string[];
};

/** Identificador de cada vista de la consola; es la clave de `console.views`. */
/** Punto del piloto: glifo + titular corto + explicación. */
export type PilotBullet = {
  icon: "sistema" | "region" | "precio";
  title: string;
  body: string;
};

export type ConsoleViewId =
  | "conversaciones"
  | "automatizaciones"
  | "tickets"
  | "cobranza"
  | "integraciones"
  | "equipo";

export type ConsoleNavItem = { id: ConsoleViewId; label: string };

export type ConsoleNavGroup = {
  label: string;
  items: readonly ConsoleNavItem[];
};

/** Tono semántico de los chips de estado dentro de la consola. */
export type ConsoleTone = "ok" | "alert" | "neutral";

/** Mensaje de un hilo de WhatsApp: como `ChatMessage`, más la hora. */
export type ThreadMessage = ChatMessage & { time: string };

/** Glifo de un sistema integrado; ver `INTEGRATION_ICONS` en ConsoleViews. */
export type ConsoleIntegrationIcon = "router" | "waves" | "hub" | "chat" | "code";

export type IntegrationSystem = {
  name: string;
  role: string;
  icon: ConsoleIntegrationIcon;
};

export type FooterLinkIcon = "linkedin" | "x" | "mail";

export type FooterLink = {
  label: string;
  href: string;
  icon?: FooterLinkIcon;
};

export type FooterColumn = {
  label: string;
  links: readonly FooterLink[];
};

export type ConsoleIntegration = {
  name: string;
  role: string;
  icon: ConsoleIntegrationIcon;
  status: string;
  tone: ConsoleTone;
  connected: boolean;
};

export const LANDING = {
  nav: {
    brand: "Gantry",
    links: [
      { label: "Producto", href: "#producto" },
      { label: "Casos", href: "#casos" },
      { label: "Cómo funciona", href: "#como-funciona" },
    ],
    cta: { label: "Acceso al piloto", href: "#piloto" },
  },

  hero: {
    badge: "Piloto abierto · ISPs y WISPs de Perú y Latinoamérica",
    title: "El agente de IA que atiende el WhatsApp de tu ISP.",
    subtitle:
      "Responde soporte, cobranza e instalaciones con el plan, la deuda y el historial de cada cliente, leídos de tu sistema de gestión.",
    ctaPrimary: { label: "Solicitar acceso al piloto", href: "#piloto" },
    ctaSecondary: { label: "Ver cómo funciona", href: "#como-funciona" },
    // La consola del hero es una demo navegable de la app (DESIGN.md §6): la
    // barra lateral es un tablist real y cada entrada abre su vista. El caso
    // de ejemplo es el mismo en todas — Marisol Quispe, ticket #184, Luis A.,
    // MikroWisp — para que la consola se lea como una sola operación y no como
    // seis pantallas inventadas por separado.
    console: {
      label: "Consola de Gantry",
      search: "Buscar",
      toggleLabel: "Modo piloto",
      zoom: "100%",
      groups: [
        {
          label: "Operación",
          items: [
            { id: "conversaciones", label: "Conversaciones" },
            { id: "automatizaciones", label: "Automatizaciones" },
            { id: "tickets", label: "Tickets" },
            { id: "cobranza", label: "Cobranza" },
          ],
        },
        {
          label: "Ajustes",
          items: [
            { id: "integraciones", label: "Integraciones" },
            { id: "equipo", label: "Equipo" },
          ],
        },
      ] satisfies ConsoleNavGroup[],

      views: {
        // La vista prioritaria. Estructura de cliente de WhatsApp —lista de
        // chats, hilo, y composer— con la columna que Gantry añade: el
        // contexto del cliente al lado. Es la promesa de la página, mostrada.
        conversaciones: {
          action: "Sugerir respuesta",
          listHeading: "Chats",
          searchPlaceholder: "Buscar un chat",
          list: [
            {
              name: "Marisol Quispe",
              initials: "MQ",
              preview: "Ya lo reinicié y sigue igual.",
              status: "Sin señal",
              tone: "alert",
              time: "12:09",
              unread: 2,
            },
            {
              name: "Jorge R.",
              initials: "JR",
              preview: "¿Cuánto debo y hasta cuándo puedo pagar?",
              status: "Pago",
              tone: "neutral",
              time: "11:47",
            },
            {
              name: "Nuevo contacto",
              initials: "+51",
              preview: "¿Tienen cobertura en el sector La Planicie?",
              status: "Cobertura",
              tone: "neutral",
              time: "10:22",
            },
          ],
          thread: {
            name: "Marisol Quispe",
            initials: "MQ",
            // Sin número de teléfono inventado: la subcabecera lleva datos que
            // ya existen en la ficha del cliente.
            subtitle: "Sur · Nodo 4 · 100 Mbps",
            daySeparator: "Hoy",
            composerPlaceholder: "Escribe un mensaje",
            messages: [
              {
                from: "cliente",
                text: "Hola, no tengo internet desde el mediodía.",
                time: "12:04",
              },
              {
                from: "bot",
                text: "Hola, Marisol. Veo tu servicio activo y sin deuda pendiente, y no hay falla masiva en tu zona. ¿Probamos reiniciar tu router? Te guío en dos pasos.",
                time: "12:04",
              },
              { from: "cliente", text: "Ya lo reinicié y sigue igual.", time: "12:09" },
              {
                from: "bot",
                text: "Gracias por intentarlo. Creé el ticket #184 con todo lo que probamos. Un técnico te contacta hoy antes de las 6 p. m.",
                time: "12:10",
              },
            ] satisfies ThreadMessage[],
          },
          contextHeading: "Ficha del cliente",
          client: {
            title: "Marisol Quispe",
            status: "Al día",
            rows: [
              { label: "Plan", value: "100 Mbps" },
              { label: "Zona", value: "Sur · Nodo 4" },
              { label: "Deuda", value: "S/ 0.00" },
              { label: "Último ticket", value: "#171 · cerrado" },
            ],
          },
          decisionHeading: "Lo que Gantry consultó",
          decision: {
            checks: [
              { question: "¿Deuda pendiente?", answer: "No" },
              { question: "¿Falla masiva en la zona?", answer: "No" },
            ],
            outcome: "Sugerir reinicio de router",
          },
          ticket: {
            title: "Ticket #184 listo para asignar",
            meta: "Diagnóstico incluido · Técnico Luis A.",
          },
        },

        automatizaciones: {
          action: "Sugerir flujo",
          canvas: {
            trigger: {
              question: "¿Qué dispara esta automatización?",
              options: ["Mensaje de WhatsApp", "Pago recibido"],
              addAction: "Añadir paso",
            },
            nodes: {
              message: "Mensaje",
              addStep: "Añadir paso",
              lookup: "Consulta",
              decision: "Decisión",
              ticket: "Ticket",
              technician: "Técnico",
              reply: "Respuesta",
            },
            decisionLine: "¿Falla masiva en la zona?",
          },
          panel: {
            title: "Conectar tu sistema",
            tabs: ["Conexión", "Campos", "Prueba"],
            methodLabel: "Método",
            method: "GET",
            urlLabel: "URL",
            url: "https://api.tu-isp.com/",
            queryLabel: "Consulta",
            queryPlaceholder: "Insertar dato",
            addValue: "Añadir valor",
            status: "Conexión verificada con MikroWisp",
            descriptionLabel: "Descripción",
            descriptionPlaceholder: "Describe qué hace este paso…",
          },
        },

        // Cola de tickets. Cada uno lleva su motivo como línea fuerte y el
        // resto como meta: cliente, zona y técnico. La tabla genérica anterior
        // no dejaba ver cuál es el dato importante de un ticket (el motivo).
        tickets: {
          action: "Asignar técnico",
          items: [
            {
              id: "#184",
              motivo: "Sin señal tras reinicio",
              cliente: "Marisol Quispe",
              zona: "Sur · Nodo 4",
              tecnico: "Luis A.",
              status: "Abierto",
              tone: "alert",
            },
            {
              id: "#171",
              motivo: "Se volvió a caer la señal",
              cliente: "Marisol Quispe",
              zona: "Sur · Nodo 4",
              tecnico: "Luis A.",
              status: "Cerrado",
              tone: "ok",
            },
            {
              id: "#168",
              motivo: "Sigo esperando al técnico",
              cliente: "Jorge R.",
              tecnico: "Luis A.",
              status: "Cerrado",
              tone: "ok",
            },
          ],
        },

        // Cobranza: el monto manda, alineado a la derecha, porque es el dato
        // que se escanea. Sin totales ni resúmenes — serían cifras inventadas.
        cobranza: {
          action: "Enviar recordatorio",
          items: [
            {
              cliente: "Jorge R.",
              initials: "JR",
              concepto: "Recibo julio 2026",
              vence: "Vence viernes 8",
              monto: "S/ 65",
              status: "Validado",
              tone: "ok",
            },
            {
              cliente: "Marisol Quispe",
              initials: "MQ",
              concepto: "Recibo julio 2026",
              vence: "Sin pendiente",
              monto: "S/ 0.00",
              status: "Al día",
              tone: "ok",
            },
            {
              cliente: "Nuevo contacto",
              initials: "+51",
              concepto: "Instalación 100 Mbps",
              vence: "Vence sábado 10",
              monto: "S/ 60",
              status: "Pendiente",
              tone: "neutral",
            },
          ],
        },

        integraciones: {
          action: "Conectar sistema",
          note: "Gantry lee y escribe en tu sistema a través de su API. No migras clientes ni cambias de herramienta.",
          connectAction: "Conectar",
          items: [
            {
              name: "MikroWisp",
              role: "Sistema de gestión",
              icon: "router",
              status: "Conectado",
              tone: "ok",
              connected: true,
            },
            {
              name: "WhatsApp Business",
              role: "Canal de mensajes",
              icon: "chat",
              status: "Conectado",
              tone: "ok",
              connected: true,
            },
            {
              name: "WiMovil",
              role: "Sistema de gestión",
              icon: "waves",
              status: "Disponible",
              tone: "neutral",
              connected: false,
            },
            {
              name: "WispHub",
              role: "Sistema de gestión",
              icon: "hub",
              status: "Disponible",
              tone: "neutral",
              connected: false,
            },
            {
              name: "Tu propia API",
              role: "Conexión a medida",
              icon: "code",
              status: "A evaluar",
              tone: "neutral",
              connected: false,
            },
          ] satisfies ConsoleIntegration[],
        },

        equipo: {
          action: "Invitar a alguien",
          note: "Cada rol ve lo suyo: el técnico entra al ticket con el diagnóstico ya hecho.",
          vacantLabel: "Sin asignar",
          items: [
            {
              nombre: "Luis A.",
              initials: "LA",
              rol: "Técnico de campo",
              alcance: "Tickets asignados · Sur",
              status: "Activo",
              tone: "ok",
            },
            {
              rol: "Soporte",
              alcance: "Conversaciones y escalamientos",
              status: "Vacante",
              tone: "neutral",
            },
            {
              rol: "Administración",
              alcance: "Cobranza y facturación",
              status: "Vacante",
              tone: "neutral",
            },
          ],
        },
      },
    },
  },

  problem: {
    eyebrow: "El día a día",
    // Rótulos de los dos paneles: el contraste antes/después estaba
    // implícito en la maquetación y nadie lo leía.
    chaosLabel: "Hoy: tu bandeja",
    chaosNote: "Todos abiertos. Todos esperando a que alguien escriba.",
    orderLabel: "Con Gantry",
    orderNote: "Respondidos con los datos de tu sistema, sin que abras el chat.",
    title: "Cincuenta chats abiertos, y todos preguntan lo mismo.",
    body: "Una operación más tranquila empieza con una conversación mejor atendida. Cobranzas que se persiguen mensaje por mensaje, el mismo «no tengo internet» a toda hora, y técnicos que salen a campo sin saber qué van a encontrar. No es falta de esfuerzo: es que responder bien exige abrir tu sistema de gestión, y nadie lo abre cincuenta veces al día.",
    chaos: [
      "Señor, no tengo internet",
      "¿Hasta cuándo puedo pagar?",
      "Sigo esperando al técnico…",
      "¿Llegan al sector La Planicie?",
      "Ya pagué, le mando el voucher",
      "Se volvió a caer la señal",
    ],
    order: [
      { text: "Señor, no tengo internet", status: "Ticket #184 creado" },
      { text: "Ya pagué, le mando el voucher", status: "Pago validado" },
      { text: "¿Llegan al sector La Planicie?", status: "Instalación agendada" },
    ],
  },

  pillars: {
    eyebrow: "Qué hace Gantry",
    title: "Responde, decide y escala. En ese orden.",
    items: [
      {
        number: "01",
        title: "Sabe quién escribe antes de responder",
        body: "Gantry saluda a cada cliente sabiendo quién es: su plan, su deuda, su zona y sus tickets anteriores. Nada de respuestas genéricas.",
        artifact: {
          kind: "ficha",
          title: "Marisol Quispe",
          status: "Al día",
          rows: [
            { label: "Plan", value: "100 Mbps" },
            { label: "Zona", value: "Sur · Nodo 4" },
            { label: "Deuda", value: "S/ 0.00" },
            { label: "Último ticket", value: "#171 · cerrado" },
          ],
        },
      },
      {
        number: "02",
        title: "Decide con datos de tu sistema",
        body: "Antes de responder, consulta tu sistema de gestión: ¿hay deuda?, ¿hay corte programado?, ¿hay falla masiva en la zona? La respuesta cambia según lo que encuentra.",
        artifact: {
          kind: "decision",
          checks: [
            { question: "¿Tiene deuda?", answer: "No" },
            { question: "¿Corte programado?", answer: "No" },
            { question: "¿Falla masiva en la zona?", answer: "No" },
          ],
          outcome: "Sugerir reinicio de router",
        },
      },
      {
        number: "03",
        title: "Escala a tu equipo con el trabajo hecho",
        body: "Cuando hace falta una persona, el ticket ya llega armado: cliente, diagnóstico y pasos probados. Tu técnico empieza por donde la conversación se quedó.",
        artifact: {
          kind: "ticket",
          title: "Ticket #184",
          status: "Prioridad media",
          rows: [
            { label: "Motivo", value: "Sin señal tras reinicio" },
            { label: "Ya probado", value: "Reinicio de router, cables" },
            { label: "Zona", value: "Sur · Nodo 4" },
          ],
          footerLabel: "Técnico asignado",
          footerValue: "Luis A. · hoy 18:00",
        },
      },
    ] satisfies Pillar[],
  },

  useCases: {
    eyebrow: "Casos de uso",
    daySeparator: "Hoy",
    composerPlaceholder: "Escribe un mensaje",
    title: "Las tres conversaciones que hoy te comen el día.",
    items: [
      {
        id: "soporte",
        tag: "Soporte técnico",
        title: "«No tengo internet», atendido antes de que abras el chat",
        description:
          "Gantry verifica el estado del servicio antes de responder, guía una solución básica y, si no alcanza, deja el ticket listo para el técnico.",
        contact: { name: "Marisol Quispe", initials: "MQ" },
        chat: [
          {
            from: "cliente",
            text: "Hola, no tengo internet desde el mediodía.",
            time: "12:04",
          },
          {
            from: "bot",
            text: "Hola, Marisol. Veo tu servicio activo y sin deuda pendiente, y no hay falla masiva en tu zona. ¿Probamos reiniciar tu router? Te guío en dos pasos.",
            time: "12:04",
          },
          { from: "cliente", text: "Ya lo reinicié y sigue igual.", time: "12:09" },
          {
            from: "bot",
            text: "Gracias por intentarlo. Creé el ticket #184 con todo lo que probamos. Un técnico te contacta hoy antes de las 6 p. m.",
            time: "12:10",
          },
        ] satisfies ThreadMessage[],
        lookup: {
          title: "Consulta al sistema",
          rows: [
            { label: "Servicio", value: "Activo" },
            { label: "Deuda", value: "S/ 0.00" },
            { label: "Falla masiva", value: "No" },
          ],
        },
        result: {
          title: "Ticket #184 listo para asignar",
          meta: "Diagnóstico incluido · Router reiniciado · Sin falla masiva",
        },
      },
      {
        id: "cobranza",
        tag: "Cobranza",
        title: "La deuda se consulta sola, el pago se valida solo",
        description:
          "El cliente pregunta, Gantry responde con el monto y la fecha reales de tu sistema, y valida el pago sin que nadie persiga capturas.",
        contact: { name: "Jorge R.", initials: "JR" },
        chat: [
          {
            from: "cliente",
            text: "¿Cuánto debo y hasta cuándo puedo pagar?",
            time: "11:47",
          },
          {
            from: "bot",
            text: "Hola, Jorge. Tu recibo de julio es S/ 65 y vence el viernes 8. Puedes pagarlo por transferencia o billetera digital con tu código 4521.",
            time: "11:48",
          },
          { from: "cliente", text: "Listo, ya pagué. Te mando la captura.", time: "11:52" },
          {
            from: "bot",
            text: "Pago validado. Tu servicio sigue activo y tu próximo recibo llega el 1 de septiembre.",
            time: "11:53",
          },
        ] satisfies ThreadMessage[],
        lookup: {
          title: "Consulta al sistema",
          rows: [
            { label: "Recibo", value: "Julio 2026" },
            { label: "Monto", value: "S/ 65" },
            { label: "Vence", value: "Viernes 8" },
          ],
        },
        result: {
          title: "Pago validado",
          meta: "Recibo de julio · S/ 65 · Servicio activo",
        },
      },
      {
        id: "instalacion",
        tag: "Ventas e instalaciones",
        title: "De «¿llegan a mi zona?» a instalación agendada",
        description:
          "Gantry consulta cobertura real, cotiza el plan y coordina la instalación en la agenda de tus cuadrillas. Sin idas y vueltas.",
        contact: { name: "Nuevo contacto", initials: "+51" },
        chat: [
          {
            from: "cliente",
            text: "¿Tienen cobertura en el sector La Planicie?",
            time: "10:22",
          },
          {
            from: "bot",
            text: "Sí, tenemos fibra en tu zona. El plan de 100 Mbps cuesta S/ 60 al mes, sin costo de instalación. ¿Quieres agendar una visita?",
            time: "10:23",
          },
          { from: "cliente", text: "Sí, ¿puede ser el sábado?", time: "10:26" },
          {
            from: "bot",
            text: "Agendado: sábado 10, entre 9 y 11 a. m. Te llega la confirmación por aquí.",
            time: "10:27",
          },
        ] satisfies ThreadMessage[],
        lookup: {
          title: "Consulta de cobertura",
          rows: [
            { label: "Zona", value: "La Planicie" },
            { label: "Cobertura", value: "Fibra disponible" },
            { label: "Cuadrilla", value: "Norte" },
          ],
        },
        result: {
          title: "Instalación agendada",
          meta: "Sábado 10 · 9–11 a. m. · Cuadrilla norte",
        },
      },
    ] satisfies UseCase[],
  },

  chatSpeakers: {
    cliente: "Cliente",
    bot: "Gantry",
  },

  flow: {
    eyebrow: "Cómo funciona",
    stepLabel: "Paso",
    title: "Del mensaje a la acción, sin pasos manuales.",
    body: "Marisol se queda sin internet un martes al mediodía. Esto es todo lo que pasa desde que escribe hasta que su caso queda cerrado, y en qué momento entra alguien de tu equipo.",
    steps: [
      {
        title: "Mensaje de WhatsApp",
        body: "El cliente escribe como siempre escribe, al mismo número de siempre. No instala nada ni aprende nada nuevo. Gantry lo reconoce por su número y abre su ficha.",
        chip: "WhatsApp",
        icon: "mensaje",
        handoff: "Sigue solo, nadie tiene que tomarlo",
        artifact: {
          kind: "chat",
          // El subtítulo de la cabecera ES el reconocimiento: al abrirse el
          // hilo, el plan y el nodo ya están ahí. No hace falta una segunda
          // ficha que diga «cliente identificado».
          contact: {
            name: "Marisol Quispe",
            initials: "MQ",
            subtitle: "Plan 100 Mbps · Sur · Nodo 4",
          },
          day: "Hoy",
          messages: [
            { from: "cliente", text: "Hola, no tengo internet desde el mediodía.", time: "12:04" },
          ],
          typing: "Gantry está escribiendo",
          composer: "Escribe un mensaje",
        },
      },
      {
        title: "Consulta a tu sistema",
        body: "Antes de responder nada, Gantry mira los mismos datos que miraría tu equipo: si debe, si tiene corte, si hay una falla abierta en su nodo.",
        chip: "MikroWisp",
        icon: "sistema",
        handoff: "Sigue solo, con el diagnóstico hecho",
        artifact: {
          kind: "consulta",
          system: "MikroWisp",
          badge: "Consulta a la API",
          rows: [
            { label: "Deuda", value: "Sin pendiente · julio al día" },
            { label: "Corte por mora", value: "No" },
            { label: "Falla masiva en Nodo 4", value: "Ninguna abierta" },
            { label: "Última visita técnica", value: "Hace 8 meses" },
          ],
        },
      },
      {
        title: "Acción automática",
        body: "Con esos datos decide y actúa: responde, valida un pago, agenda una visita o crea un ticket. Aquí termina la mayoría de los casos.",
        chip: "Gantry",
        icon: "accion",
        handoff: "Sólo si no se resuelve, pasa a una persona",
        artifact: {
          kind: "decision",
          question: "¿La falla es de la red o del equipo del cliente?",
          options: [
            {
              label: "De la red",
              note: "Avisar del corte y dar hora estimada",
              taken: false,
            },
            {
              label: "Del equipo del cliente",
              note: "Guiar el reinicio paso a paso",
              taken: true,
            },
          ],
          reply: {
            from: "bot",
            text: "Marisol, no veo cortes en tu zona. Probemos algo: desconecta el router 30 segundos y vuelve a conectarlo. Te espero.",
            time: "12:05",
          },
        },
      },
      {
        title: "Tu equipo, cuando hace falta",
        body: "Si el caso necesita a alguien, llega con todo lo probado escrito. Nadie vuelve a preguntar lo que el cliente ya contestó.",
        chip: "Tickets",
        icon: "equipo",
        handoff: "El caso queda cerrado y registrado",
        artifact: {
          kind: "ticket",
          id: "Ticket #184",
          status: "Asignado",
          rows: [
            { label: "Cliente", value: "Marisol Quispe · Nodo 4" },
            { label: "Ya probado", value: "Reinicio de router · cables revisados" },
            { label: "Síntoma", value: "Sigue sin señal tras el reinicio" },
          ],
          assignee: {
            name: "Luis A.",
            initials: "LA",
            meta: "Técnico de campo · hoy antes de las 18:00",
          },
        },
      },
    ] satisfies FlowStep[],
  },

  integrations: {
    eyebrow: "Integraciones",
    title: "Se conecta al sistema que ya usas.",
    body: "Gantry lee y escribe en tu sistema de gestión a través de su API. Durante el piloto integramos el que uses hoy, sin que cambies de herramienta.",
    // Cada sistema con su glifo — el mismo vocabulario que la consola, para
    // que las dos partes de la página hablen igual. Los `icon` NO son los
    // logotipos reales (marcas de terceros): dicen qué ES cada sistema.
    systems: [
      { name: "MikroWisp", role: "Sistema de gestión", icon: "router" },
      { name: "WiMovil", role: "Sistema de gestión", icon: "waves" },
      { name: "WispHub", role: "Sistema de gestión", icon: "hub" },
      { name: "Tu propia API", role: "Conexión a medida", icon: "code" },
    ] satisfies IntegrationSystem[],
    hub: "Gantry",
    hubRole: "Lee, decide y responde",
    output: "WhatsApp Business",
    outputRole: "Canal de tus clientes",
    trust: "Sin migrar clientes, facturación ni operación de red.",
  },

  faq: {
    eyebrow: "Preguntas frecuentes",
    title: "Las dudas que tendrías antes de decir que sí.",
    body: "Esto es lo que sabemos con certeza hoy. Donde la respuesta honesta es «depende» o «lo acordamos contigo», lo decimos así.",
    items: [
      {
        question: "¿Y si el bot responde mal?",
        answer:
          "Es la duda real, y la respuesta corta es: cuando no está seguro, Gantry no inventa un «tal vez», escala la conversación a una persona de tu equipo. Cada respuesta automática que sí entrega se arma con datos reales de tu sistema de gestión: plan, deuda, estado del servicio, nunca información inventada.",
      },
      {
        question: "¿Tengo que cambiar mi sistema de gestión?",
        answer:
          "No. Gantry se conecta al que ya usas: lee tu información (plan, deuda, tickets) y también escribe en él (valida pagos, crea tickets, agenda visitas) a través de su API. No migras clientes ni cambias de herramienta para el piloto: conectamos lo que ya tienes.",
      },
      {
        question: "¿Qué pasa con los datos de mis clientes?",
        answer:
          "Es una pregunta justa: nos estás confiando tu base de clientes. Hoy no tenemos una certificación que mostrarte, así que preferimos ser directos: acordamos por contrato con cada operador del piloto cómo se accede a esos datos y quién responde por ellos, antes de conectar nada.",
      },
      {
        question: "¿Cuánto tarda la implementación?",
        answer:
          "Depende de tu sistema de gestión y de qué tan ordenados estén tus datos, no hay un número que sirva para todos. El piloto incluye la conexión guiada a tu sistema, la configuración de los flujos de soporte y cobranza, y acompañamiento de nuestro equipo hasta que funcione con tu operación real, no con datos de prueba.",
      },
      {
        question: "¿Cuánto cuesta después del piloto?",
        answer:
          "Todavía no fijamos un precio de lista: preferimos definirlo con datos reales de tu operación, no con una tabla genérica. Los operadores del piloto acceden a un precio preferencial, y las condiciones se acuerdan contigo antes de que el piloto termine, nunca después.",
      },
      {
        question: "¿Gantry también atiende llamadas?",
        answer:
          "Hoy no: Gantry atiende WhatsApp, no llamadas. Si buena parte de tu operación entra por teléfono, preferimos decírtelo antes que venderte un canal que no tenemos. Cuéntanoslo al aplicar al piloto y evaluamos si aun así te ordena el resto.",
      },
      {
        question: "¿Funciona si mi sistema no tiene API?",
        answer:
          "Si tu sistema no tiene una API disponible, es una limitación real y preferimos decirlo así: sin una vía para leer y escribir datos, Gantry no puede consultar tu información en tiempo real. Cuéntanos qué sistema usas al aplicar al piloto, lo evaluamos caso por caso antes de avanzar.",
      },
    ] satisfies FaqItem[],
  },

  pilot: {
    eyebrow: "Piloto",
    title: "Estamos abriendo un piloto con pocos ISPs.",
    body: "Buscamos operadores de Perú y Latinoamérica para implementar Gantry acompañados por nuestro equipo. Sin permanencia: si no te ordena la operación, no sigues.",
    // Cada punto con su glifo: eran tres líneas con un punto delante,
    // indistinguibles entre sí y sin peso frente al formulario de al lado.
    bullets: [
      {
        icon: "sistema",
        title: "Implementación guiada",
        body: "Conectamos Gantry a tu sistema de gestión junto a tu equipo, no te dejamos con una API y un manual.",
      },
      {
        icon: "region",
        title: "Cupos limitados por región",
        body: "Trabajamos con pocos operadores a la vez para acompañar cada implementación de verdad.",
      },
      {
        icon: "precio",
        title: "Precio piloto preferencial",
        body: "Los primeros operadores seleccionados acceden a condiciones que se acuerdan contigo antes de terminar el piloto.",
      },
    ] satisfies PilotBullet[],
    form: {
      title: "Solicitar acceso al piloto",
      fields: {
        nombre: {
          label: "Tu nombre",
          placeholder: "Ej. Carla Mendoza",
        } satisfies PilotTextField,
        isp: {
          label: "Nombre de tu ISP",
          placeholder: "Ej. Red Andina",
        } satisfies PilotTextField,
        sistema: {
          label: "Sistema actual",
          placeholder: "Ej. MikroWisp",
        } satisfies PilotTextField,
        clientes: {
          label: "Cantidad de clientes",
          placeholder: "Selecciona un rango",
          options: PILOT_CLIENT_RANGES,
        } satisfies PilotSelectField,
        reto: {
          label: "¿Qué te quita más tiempo? (opcional)",
          placeholder: "Selecciona una opción",
          options: ["Soporte", "Cobranza", "Instalaciones", "Ventas"],
        } satisfies PilotSelectField,
        whatsapp: {
          label: "WhatsApp de contacto",
          placeholder: "Ej. +51 999 888 777",
        } satisfies PilotTextField,
      },
      // Rótulos de los dos bloques del formulario: seis campos idénticos en
      // columna no dicen qué se pregunta ni por qué.
      groups: {
        operacion: "Sobre tu operación",
        contacto: "Cómo te contactamos",
      },
      // Lo que pasa después, dicho ANTES de enviar: reduce la fricción de
      // dejar un WhatsApp. Es la misma promesa del mensaje de éxito.
      reassurance: "Te escribimos por WhatsApp en menos de 48 horas. Sin llamadas de venta.",
      submit: "Enviar solicitud",
      sending: "Enviando…",
      success: {
        title: "Recibimos tu solicitud.",
        body: "Te escribimos por WhatsApp en menos de 48 horas para coordinar los siguientes pasos.",
      },
      // Este mensaje sale cuando el envío NO llegó. Existe porque el de éxito
      // promete una respuesta en 48 horas: enseñarlo cuando la solicitud se
      // perdió sería dejar a alguien esperando un mensaje que nadie va a
      // mandar. Dice qué pasó y qué hacer, sin disculparse ni echar la culpa.
      error: {
        title: "No pudimos enviar tu solicitud.",
        body: "Vuelve a intentarlo en un momento. Tus datos siguen en el formulario.",
      },
    },
  },

  footer: {
    brand: "Gantry",
    tagline: "Soporte y cobranza por WhatsApp para ISPs de Latinoamérica.",
    // El año lo pone el componente con `getFullYear()`. Sin "Inc.": no sabemos
    // qué figura legal tiene Gantry, y un aviso de copyright no es sitio para
    // suponerlo.
    rights: "Todos los derechos reservados.",

    // ⚠️ PENDIENTE ANTES DE PUBLICAR — los `href: "#"` de aquí abajo son
    // marcadores. Hay que sustituirlos por destinos reales:
    //   · Legal: dos páginas que todavía no existen. El texto de una política
    //     de privacidad y unos términos NO se puede inventar; los redacta
    //     quien corresponda y luego se enlazan aquí.
    //   · Contacto: los perfiles reales de Gantry y un correo de contacto de
    //     la empresa (no uno personal).
    // Mientras un enlace conserve "#", el footer lo pinta como texto y no como
    // enlace: un enlace que no lleva a ninguna parte es peor que ninguno.
    columns: [
      {
        label: "Legal",
        links: [
          { label: "Política de privacidad", href: "#" },
          { label: "Términos del servicio", href: "#" },
        ],
      },
      {
        label: "Contacto",
        links: [
          { label: "LinkedIn", href: "#", icon: "linkedin" },
          { label: "X", href: "#", icon: "x" },
          { label: "Correo", href: "#", icon: "mail" },
        ],
      },
    ] satisfies FooterColumn[],
  },
} as const;
