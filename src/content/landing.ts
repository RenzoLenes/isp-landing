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
  chatLabel: string;
  chat: ChatMessage[];
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

export type FlowStep =
  | { kind: "mensaje"; title: string; body: string; line: string }
  | {
      kind: "consulta";
      title: string;
      body: string;
      system: string;
      rows: readonly ArtifactRow[];
    }
  | {
      kind: "decision";
      title: string;
      body: string;
      condition: string;
      outcome: string;
    }
  | { kind: "resultado"; title: string; body: string; result: string };

export type PilotTextField = {
  label: string;
  placeholder: string;
};

export type PilotSelectField = {
  label: string;
  placeholder: string;
  options: readonly string[];
};

export type ConsoleNavItem = { label: string; active?: boolean };

export type ConsoleConversation = {
  name: string;
  status: string;
  tone: "alert" | "neutral" | "ok";
  active?: boolean;
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
    badge: "Piloto abierto · ISPs de Perú y Latinoamérica",
    title: "Una operación más tranquila empieza con una conversación mejor atendida.",
    subtitle:
      "Conecta WhatsApp a tu sistema ISP para responder pagos, soporte e instalaciones con el contexto real de cada cliente.",
    ctaPrimary: { label: "Solicitar acceso al piloto", href: "#piloto" },
    ctaSecondary: { label: "Ver cómo funciona", href: "#como-funciona" },
    // The product console (§5): an illustrative, dense mock of the app
    // itself — three columns at desktop (sidebar / conversations / context),
    // built from the same example client (Marisol Quispe) and ticket (#184)
    // used elsewhere on the page, so the whole landing reads as one
    // consistent demo rather than three unrelated fake datasets.
    console: {
      sidebarNav: [
        { label: "Conversaciones", active: true },
        { label: "Tickets" },
        { label: "Cobranza" },
        { label: "Integraciones" },
      ] satisfies ConsoleNavItem[],
      conversationsHeading: "Conversaciones",
      contextHeading: "Contexto",
      conversations: [
        { name: "Marisol Q.", status: "Sin señal", tone: "alert", active: true },
        { name: "Jorge R.", status: "Pago", tone: "neutral" },
        { name: "Nuevo contacto", status: "Cobertura", tone: "neutral" },
      ] satisfies ConsoleConversation[],
      openConversation: {
        header: "WhatsApp · Marisol Q.",
        messages: [
          { from: "cliente", text: "Hola, no tengo internet desde el mediodía." },
          {
            from: "bot",
            text: "Hola, Marisol. Veo tu servicio activo y sin deuda pendiente. ¿Probamos reiniciar tu router?",
          },
        ] satisfies ChatMessage[],
      },
      client: {
        title: "Marisol Quispe",
        status: "Al día",
        rows: [
          { label: "Plan", value: "100 Mbps" },
          { label: "Zona", value: "Sur · Nodo 4" },
          { label: "Deuda", value: "S/ 0.00" },
        ] satisfies ArtifactRow[],
      },
      decision: {
        checks: [
          { question: "¿Deuda pendiente?", answer: "No" },
          { question: "¿Falla en la zona?", answer: "No" },
        ],
        outcome: "Sugerir reinicio de router",
      },
      ticket: {
        title: "Ticket #184 listo para asignar",
        meta: "Diagnóstico incluido · Técnico Luis A.",
      },
    },
  },

  problem: {
    eyebrow: "El día a día",
    title: "Cincuenta chats abiertos, y todos preguntan lo mismo.",
    body: "Cobranzas que se persiguen mensaje por mensaje, el mismo «no tengo internet» a toda hora, y técnicos que salen a campo sin saber qué van a encontrar. No es falta de esfuerzo: es falta de contexto.",
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
    title: "Tres cosas, bien hechas.",
    items: [
      {
        number: "01",
        title: "Responde con el contexto real",
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
    title: "Así se ve en una conversación real.",
    items: [
      {
        id: "soporte",
        tag: "Soporte técnico",
        title: "«No tengo internet», resuelto con contexto",
        description:
          "Gantry verifica el estado del servicio antes de responder, guía una solución básica y, si no alcanza, deja el ticket listo para el técnico.",
        chatLabel: "WhatsApp · Marisol Q.",
        chat: [
          { from: "cliente", text: "Hola, no tengo internet desde el mediodía." },
          {
            from: "bot",
            text: "Hola, Marisol. Veo tu servicio activo y sin deuda pendiente, y no hay falla masiva en tu zona. ¿Probamos reiniciar tu router? Te guío en dos pasos.",
          },
          { from: "cliente", text: "Ya lo reinicié y sigue igual." },
          {
            from: "bot",
            text: "Gracias por intentarlo. Creé el ticket #184 con todo lo que probamos. Un técnico te contacta hoy antes de las 6 p. m.",
          },
        ],
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
        chatLabel: "WhatsApp · Jorge R.",
        chat: [
          { from: "cliente", text: "¿Cuánto debo y hasta cuándo puedo pagar?" },
          {
            from: "bot",
            text: "Hola, Jorge. Tu recibo de julio es S/ 65 y vence el viernes 8. Puedes pagarlo por transferencia o billetera digital con tu código 4521.",
          },
          { from: "cliente", text: "Listo, ya pagué. Te mando la captura." },
          {
            from: "bot",
            text: "Pago validado. Tu servicio sigue activo y tu próximo recibo llega el 1 de septiembre.",
          },
        ],
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
        chatLabel: "WhatsApp · Nuevo contacto",
        chat: [
          { from: "cliente", text: "¿Tienen cobertura en el sector La Planicie?" },
          {
            from: "bot",
            text: "Sí, tenemos fibra en tu zona. El plan de 100 Mbps cuesta S/ 60 al mes, sin costo de instalación. ¿Quieres agendar una visita?",
          },
          { from: "cliente", text: "Sí, ¿puede ser el sábado?" },
          {
            from: "bot",
            text: "Agendado: sábado 10, entre 9 y 11 a. m. Te llega la confirmación por aquí.",
          },
        ],
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
    title: "Del mensaje a la acción, sin pasos manuales.",
    steps: [
      {
        kind: "mensaje",
        title: "Mensaje de WhatsApp",
        body: "El cliente escribe como siempre escribe. No aprende nada nuevo.",
        line: "Hola, no tengo internet desde el mediodía.",
      },
      {
        kind: "consulta",
        title: "Consulta a tu sistema",
        body: "Gantry revisa deuda, cortes, fallas y cobertura en tu sistema de gestión.",
        system: "MikroWisp / WiMovil",
        rows: [
          { label: "Deuda", value: "Sin pendiente" },
          { label: "Falla masiva", value: "No" },
        ],
      },
      {
        kind: "decision",
        title: "Acción automática",
        body: "Responde, valida un pago, agenda una visita o crea un ticket con contexto.",
        condition: "¿Falla masiva en la zona?",
        outcome: "Sugerir reinicio de router",
      },
      {
        kind: "resultado",
        title: "Tu equipo, cuando hace falta",
        body: "Una persona entra con el caso ya armado, no desde cero.",
        result: "Ticket #184 asignado a Luis A.",
      },
    ] satisfies FlowStep[],
  },

  integrations: {
    eyebrow: "Integraciones",
    title: "Diseñado para conectarse con lo que ya usas.",
    body: "Gantry lee y escribe en tu sistema de gestión a través de su API. Durante el piloto integramos el que uses hoy, sin que cambies de herramienta.",
    systems: ["MikroWisp", "WiMovil", "WispHub", "Tu propia API"],
    hub: "Gantry",
    output: "WhatsApp Business",
    trust: "Sin migrar clientes, facturación ni operación de red.",
  },

  pilot: {
    eyebrow: "Piloto",
    title: "Estamos abriendo un piloto con pocos ISPs.",
    body: "Buscamos operadores de Perú y Latinoamérica para implementar Gantry acompañados por nuestro equipo. Sin permanencia: si no te ordena la operación, no sigues.",
    bullets: [
      "Implementación guiada junto a tu sistema de gestión",
      "Cupos limitados por región",
      "Precio piloto preferencial para los primeros operadores seleccionados",
    ],
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
      submit: "Enviar solicitud",
      sending: "Enviando…",
      success: {
        title: "Recibimos tu solicitud.",
        body: "Te escribimos por WhatsApp en menos de 48 horas para coordinar los siguientes pasos.",
      },
    },
  },

  footer: {
    brand: "Gantry",
    tagline: "WhatsApp con contexto real para ISPs de Latinoamérica.",
    ctaLabel: "Solicitar acceso al piloto",
    ctaHref: "#piloto",
  },
} as const;
