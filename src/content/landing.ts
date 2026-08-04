export type ChatMessage = {
  from: "cliente" | "bot";
  text: string;
};

export type UseCase = {
  id: string;
  tag: string;
  title: string;
  description: string;
  chatLabel: string;
  chat: ChatMessage[];
  result: { title: string; meta: string };
};

export type Pillar = {
  number: string;
  title: string;
  body: string;
  visualLabel: string;
};

export type FlowStep = {
  title: string;
  body: string;
};

export const LANDING = {
  nav: {
    brand: "Nexo",
    links: [
      { label: "Producto", href: "#producto" },
      { label: "Casos", href: "#casos" },
      { label: "Cómo funciona", href: "#como-funciona" },
    ],
    cta: { label: "Acceso al piloto", href: "#piloto" },
  },

  hero: {
    eyebrow: "Para pequeños ISPs de Perú y Latinoamérica",
    title: "Una operación más tranquila empieza con una conversación mejor atendida.",
    subtitle:
      "Conecta WhatsApp a tu sistema ISP para responder pagos, soporte e instalaciones con el contexto real de cada cliente.",
    ctaPrimary: { label: "Solicitar acceso al piloto", href: "#piloto" },
    ctaSecondary: { label: "Ver cómo funciona", href: "#como-funciona" },
    composition: {
      chatHeader: "WhatsApp · Marisol Q.",
      chatMessage: "Hola, no tengo internet desde el mediodía.",
      statusLabel: "Consulta al sistema",
      statusTitle: "Servicio activo",
      statusMeta: "Sin deuda · Sin falla masiva en la zona",
      ticketLabel: "Acción automática",
      ticketTitle: "Ticket #184 listo para asignar",
      ticketMeta: "Diagnóstico incluido · Router reiniciado",
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
    eyebrow: "Qué hace Nexo",
    title: "Tres cosas, bien hechas.",
    items: [
      {
        number: "01",
        title: "Responde con el contexto real",
        body: "Nexo saluda a cada cliente sabiendo quién es: su plan, su deuda, su zona y sus tickets anteriores. Nada de respuestas genéricas.",
        visualLabel: "Plan 100 Mbps · Al día · Zona sur",
      },
      {
        number: "02",
        title: "Decide con datos de tu sistema",
        body: "Antes de responder, consulta tu sistema de gestión: ¿hay deuda?, ¿hay corte programado?, ¿hay falla masiva en la zona? La respuesta cambia según lo que encuentra.",
        visualLabel: "Deuda · Cortes · Fallas · Cobertura",
      },
      {
        number: "03",
        title: "Escala a tu equipo con el trabajo hecho",
        body: "Cuando hace falta una persona, el ticket ya llega armado: cliente, diagnóstico y pasos probados. Tu técnico empieza por donde la conversación se quedó.",
        visualLabel: "Ticket con contexto completo",
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
          "Nexo verifica el estado del servicio antes de responder, guía una solución básica y, si no alcanza, deja el ticket listo para el técnico.",
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
          "El cliente pregunta, Nexo responde con el monto y la fecha reales de tu sistema, y valida el pago sin que nadie persiga capturas.",
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
          "Nexo consulta cobertura real, cotiza el plan y agenda la instalación en la agenda de tus cuadrillas. Sin idas y vueltas.",
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
        result: {
          title: "Instalación agendada",
          meta: "Sábado 10 · 9–11 a. m. · Cuadrilla norte",
        },
      },
    ] satisfies UseCase[],
  },

  flow: {
    eyebrow: "Cómo funciona",
    title: "Del mensaje a la acción, sin fricción manual.",
    steps: [
      {
        title: "Mensaje de WhatsApp",
        body: "El cliente escribe como siempre escribe. No aprende nada nuevo.",
      },
      {
        title: "Consulta a tu sistema",
        body: "Nexo revisa deuda, cortes, fallas y cobertura en tu sistema de gestión.",
      },
      {
        title: "Acción automática",
        body: "Responde, valida un pago, agenda una visita o crea un ticket con contexto.",
      },
      {
        title: "Tu equipo, cuando hace falta",
        body: "Una persona entra con el caso ya armado, no desde cero.",
      },
    ] satisfies FlowStep[],
  },

  integrations: {
    eyebrow: "Integraciones",
    title: "Se conecta a lo que ya usas.",
    body: "Nexo trabaja sobre la API de WhatsApp Business y se integra con tu sistema de gestión ISP vía API. Sin migraciones ni cambios de sistema: tu operación sigue igual, pero mejor atendida.",
    chips: ["WhatsApp Business API", "Tu sistema de gestión", "API abierta"],
  },

  pilot: {
    eyebrow: "Piloto",
    title: "Estamos abriendo un piloto con pocos ISPs.",
    body: "Buscamos operadores de Perú y Latinoamérica para implementar Nexo acompañados por nuestro equipo. Sin permanencia: si no te ordena la operación, no sigues.",
    bullets: [
      "Implementación guiada junto a tu sistema de gestión",
      "Cupos limitados por región",
      "Condiciones preferentes para los primeros pilotos",
    ],
    form: {
      title: "Solicitar acceso al piloto",
      fields: {
        nombre: { label: "Tu nombre", placeholder: "Ej. Carla Mendoza" },
        isp: { label: "Nombre de tu ISP", placeholder: "Ej. Red Andina" },
        ciudad: { label: "Ciudad", placeholder: "Ej. Arequipa" },
        whatsapp: { label: "WhatsApp de contacto", placeholder: "Ej. +51 999 888 777" },
      },
      submit: "Enviar solicitud",
      success: {
        title: "Recibimos tu solicitud.",
        body: "Te escribimos por WhatsApp en menos de 48 horas para coordinar los siguientes pasos.",
      },
    },
  },

  footer: {
    brand: "Nexo",
    tagline: "WhatsApp con contexto real para ISPs de Latinoamérica.",
    contact: "equipoventia@gmail.com",
  },
} as const;
