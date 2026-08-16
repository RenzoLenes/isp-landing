"use client";

import { motion } from "motion/react";
import { LANDING, type ThreadMessage } from "@/content/landing";
import { CheckDoubleIcon, MicIcon, PaperclipIcon, SmileIcon } from "@/components/ui/console-icons";

/*
 * El hilo de WhatsApp, compartido por la consola del hero y las escenas de
 * "Casos de uso" (DESIGN.md §6). Vivía suelto dentro de la consola y las
 * escenas usaban una tarjeta blanca con burbujas genéricas: el mismo mensaje
 * se veía de dos maneras distintas en la misma página, y la de los casos no
 * se parecía a WhatsApp en nada.
 *
 * Lo que hace que se lea como un cliente de mensajería y no como una tarjeta:
 * cabecera con avatar, papel tapiz, separador de día, burbujas con cola, hora
 * incrustada, doble check en las salientes, y composer al pie. Ninguno es
 * decorativo — juntos son la convención que el visitante ya sabe leer.
 */

/*
 * Papel tapiz: mosaico SVG propio de marcas abstractas (NO los garabatos de
 * WhatsApp, que son obra con derechos) al 5.5% sobre un tono frío de la rampa.
 * Su función no es adornar: sin textura el hilo se lee como una tarjeta blanca
 * más y se funde con lo que tenga al lado.
 */
const WALLPAPER = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='84' height='84'>" +
    "<g fill='none' stroke='%23131D2A' stroke-opacity='0.055' stroke-width='1.3' stroke-linecap='round'>" +
    "<circle cx='16' cy='18' r='6'/>" +
    "<path d='M46 12h14v10H52l-4 4v-4h-2z'/>" +
    "<path d='M12 52c4-6 10-6 14 0'/>" +
    "<circle cx='62' cy='58' r='4'/>" +
    "<path d='M34 40h8M66 32h8M22 74h10'/>" +
    "<path d='M54 70l4-5 4 5z'/>" +
    "</g></svg>",
)}")`;

/*
 * Dos escalas. Dentro de la consola del hero el hilo es una columna más de una
 * app densa y debe leerse como tal (`compact`). En "Casos de uso" es una de las
 * dos piezas de la sección, con toda una columna para él: a 13px se veía
 * diminuto y perdía la pelea contra el titular de al lado (`comfortable`).
 */
const SCALE = {
  compact: {
    avatar: 32,
    header: "px-3 py-2",
    name: "text-[13.5px]",
    sub: "text-[11px]",
    body: "p-3 gap-1.5",
    bubble: "px-2.5 py-1.5 text-[13px]",
    time: "text-[10px]",
    check: 12,
    day: "px-2.5 py-0.5 text-[10.5px]",
    composer: "px-3 py-2 text-[12px]",
    composerIcon: 16,
  },
  comfortable: {
    avatar: 40,
    header: "px-4 py-3",
    name: "text-[15px]",
    sub: "text-[12px]",
    body: "p-4 gap-2",
    bubble: "px-3.5 py-2.5 text-[15px]",
    time: "text-[11px]",
    check: 13,
    day: "px-3 py-1 text-[11.5px]",
    composer: "px-4 py-3 text-[13.5px]",
    composerIcon: 18,
  },
} as const;

type Scale = keyof typeof SCALE;

export function Avatar({ initials, size = 36 }: { initials: string; size?: number }) {
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full bg-sunk font-medium text-steel"
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {initials}
    </span>
  );
}

/**
 * Una burbuja suelta, con la misma piel que las del hilo. Se exporta porque
 * «Cómo funciona» enseña la respuesta de Gantry fuera de un hilo completo, y
 * el mismo mensaje no puede verse de dos maneras distintas en la misma página
 * — que es justo lo que pasaba antes de que este componente existiera.
 */
export function ChatMessageBubble({
  message,
  scale = "compact",
}: {
  message: ThreadMessage;
  scale?: Scale;
}) {
  return <Bubble message={message} scale={scale} />;
}

/**
 * «Escribiendo…»: tres puntos con el ritmo de un cliente de mensajería. Es el
 * único elemento de la página que dice que algo está ocurriendo AHORA, y por
 * eso se gana su bucle perpetuo (DESIGN.md §9).
 */
export function TypingBubble({
  label,
  scale = "compact",
}: {
  label: string;
  scale?: Scale;
}) {
  const s = SCALE[scale];
  return (
    <div className="flex justify-end">
      <div
        className={`flex items-center gap-1 rounded-[10px] rounded-tr-[3px] bg-signal/12 shadow-[0_1px_1px_rgba(16,24,40,0.12)] ${s.bubble}`}
      >
        <span className="sr-only">{label}</span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden
            data-typing-dot
            className="size-1.5 rounded-full bg-signal-deep/70"
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function Bubble({ message, scale }: { message: ThreadMessage; scale: Scale }) {
  const isCliente = message.from === "cliente";
  const s = SCALE[scale];
  return (
    <div className={`flex ${isCliente ? "justify-start" : "justify-end"}`}>
      <div
        className={`relative max-w-[86%] rounded-[10px] leading-snug shadow-[0_1px_1px_rgba(16,24,40,0.12)] ${s.bubble} ${
          isCliente
            ? "rounded-tl-[3px] bg-surface text-ink"
            : "rounded-tr-[3px] bg-signal/12 text-ink"
        }`}
      >
        <span className="sr-only">{LANDING.chatSpeakers[message.from]}: </span>
        {message.text}{" "}
        {/* La hora va DENTRO de la burbuja y flota al final del último renglón,
            como en un cliente real: `float` es lo que hace que el texto la
            esquive en vez de dejar una línea suelta debajo. */}
        <span
          className={`float-right ml-2 mt-1 flex translate-y-[3px] items-center gap-0.5 text-steel ${s.time}`}
        >
          {message.time}
          {isCliente ? null : (
            <CheckDoubleIcon size={s.check} className="text-signal" aria-label="Leído" />
          )}
        </span>
      </div>
    </div>
  );
}

export function WhatsAppThread({
  contact,
  daySeparator,
  messages,
  composerPlaceholder,
  typing,
  popIn = false,
  scale = "compact",
  stagger = false,
  className = "",
}: {
  contact: { name: string; initials: string; subtitle?: string };
  daySeparator: string;
  messages: readonly ThreadMessage[];
  composerPlaceholder?: string;
  /** Texto anunciado mientras se pintan los tres puntos de «escribiendo». */
  typing?: string;
  /**
   * Entrada en cascada por CSS (`data-flow-pop`), sin `motion`. Es para el
   * carrusel de «Cómo funciona», donde el hilo se remonta cada vez que el paso
   * vuelve a estar activo: `stagger` no sirve ahí porque depende de entrar en
   * pantalla una sola vez, y el hilo ya está en pantalla cuando le toca.
   */
  popIn?: boolean;
  /** `compact` dentro de la consola; `comfortable` cuando el hilo protagoniza. */
  scale?: Scale;
  /** Entrada escalonada de las burbujas, para las escenas que se revelan al hacer scroll. */
  stagger?: boolean;
  className?: string;
}) {
  const s = SCALE[scale];
  return (
    <div className={`flex flex-col overflow-hidden ${className}`}>
      <div className={`flex items-center gap-2.5 border-b border-whisper bg-surface ${s.header}`}>
        <Avatar initials={contact.initials} size={s.avatar} />
        <span className="min-w-0">
          <span className={`block truncate font-medium text-ink ${s.name}`}>{contact.name}</span>
          {contact.subtitle ? (
            <span className={`block truncate text-steel ${s.sub}`}>{contact.subtitle}</span>
          ) : null}
        </span>
      </div>

      <div
        className={`flex flex-1 flex-col bg-[#eef3f9] ${s.body}`}
        style={{ backgroundImage: WALLPAPER }}
      >
        <p
          className={`mx-auto rounded-full bg-surface/90 text-steel shadow-[0_1px_1px_rgba(16,24,40,0.08)] ${s.day}`}
        >
          {daySeparator}
        </p>
        {messages.map((message, i) =>
          stagger ? (
            // `initial` incondicional a propósito (ver Hero.tsx `Beat`): el
            // apagado bajo `prefers-reduced-motion` lo hace el CSS de
            // `data-motion-settle`, no un hook que difiera entre servidor y
            // primer render del cliente.
            <motion.div
              key={i}
              data-motion-settle
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.22 }}
            >
              <Bubble message={message} scale={scale} />
            </motion.div>
          ) : popIn ? (
            <span key={i} data-flow-pop style={{ animationDelay: `${0.15 + i * 0.35}s` }}>
              <Bubble message={message} scale={scale} />
            </span>
          ) : (
            <Bubble key={i} message={message} scale={scale} />
          ),
        )}
        {typing ? (
          // El «escribiendo» entra DESPUÉS del último mensaje, con su retardo:
          // primero se lee lo que preguntó el cliente y sólo entonces se ve
          // que Gantry ya está contestando. Al revés no contaría nada.
          <span
            data-flow-pop={popIn ? "" : undefined}
            style={popIn ? { animationDelay: `${0.35 + messages.length * 0.35}s` } : undefined}
          >
            <TypingBubble label={typing} scale={scale} />
          </span>
        ) : null}
      </div>

      {composerPlaceholder ? (
        <div className={`flex items-center gap-2 border-t border-whisper bg-surface ${s.composer}`}>
          <SmileIcon size={s.composerIcon} className="shrink-0 text-steel" />
          <PaperclipIcon size={s.composerIcon} className="shrink-0 text-steel" />
          <span className="flex-1 truncate rounded-full bg-sunk/70 px-3 py-1.5 text-steel">
            {composerPlaceholder}
          </span>
          <MicIcon size={s.composerIcon} className="shrink-0 text-steel" />
        </div>
      ) : null}
    </div>
  );
}
