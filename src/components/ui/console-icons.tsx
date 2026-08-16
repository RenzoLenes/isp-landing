import type { SVGProps } from "react";

/*
 * Glifos de la consola de Gantry (ProductConsole). Trazos de 1.7 sobre
 * `currentColor`, mismo lenguaje que la vista de referencia pero dibujados
 * aquí: son glifos genéricos de UI y no valen una dependencia externa.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 16, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </Svg>
  );
}

export function CollapseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M9.5 4v16" />
    </Svg>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H9l-4.2 3.2a.5.5 0 0 1-.8-.4V6.5Z" />
      <path d="M8.5 9.5h7M8.5 13h4.5" />
    </Svg>
  );
}

export function TicketIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="5" y="4.5" width="14" height="16" rx="2.5" />
      <path d="M9 2.8h6v3.4H9zM9 11h6M9 15h4" />
    </Svg>
  );
}

export function WalletIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M3 10h18M6.5 14.5h4" />
    </Svg>
  );
}

export function CubeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="M4 7.5 12 12l8-4.5M12 12v9" />
    </Svg>
  );
}

export function ShareIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="6" cy="12" r="2.6" />
      <circle cx="17.5" cy="5.5" r="2.6" />
      <circle cx="17.5" cy="18.5" r="2.6" />
      <path d="m8.4 10.7 6.8-4M8.4 13.3l6.8 4" />
    </Svg>
  );
}

export function GearIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7" />
    </Svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <Svg {...props} fill="currentColor" stroke="none">
      <path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z" />
      <path d="M19 15c.3 2 1 2.7 3 3-2 .3-2.7 1-3 3-.3-2-1-2.7-3-3 2-.3 2.7-1 3-3Z" />
    </Svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </Svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c1.2-3.2 3.8-4.8 7-4.8s5.8 1.6 7 4.8" />
    </Svg>
  );
}

/*
 * Marcas de los sistemas que se integran. NO son los logotipos reales de
 * MikroWisp, WiMovil ni WispHub —son marcas registradas de terceros y no
 * tenemos derecho a reproducirlas—, sino un glifo que dice qué ES cada uno:
 * un router, una señal, un concentrador, un canal de mensajes, código. Con el
 * mismo icono para los cinco la lista no distinguía nada.
 */
export function RouterIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="13" width="18" height="7" rx="2" />
      <path d="M7 16.5v.2M10.5 16.5v.2" />
      <path d="M12 13V9M12 9l-3.5-3.5M12 9l3.5-3.5" />
    </Svg>
  );
}

export function WavesIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="17.5" r="1.6" />
      <path d="M8.4 14a5 5 0 0 1 7.2 0" />
      <path d="M5.6 10.8a9 9 0 0 1 12.8 0" />
      <path d="M3 7.6a13 13 0 0 1 18 0" />
    </Svg>
  );
}

export function HubIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="2.6" />
      <circle cx="12" cy="4" r="1.8" />
      <circle cx="19" cy="16" r="1.8" />
      <circle cx="5" cy="16" r="1.8" />
      <path d="M12 6.2v3.2M13.9 13.6l3.3 1.6M10.1 13.6l-3.3 1.6" />
    </Svg>
  );
}

export function CodeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m8.5 8.5-4 3.5 4 3.5M15.5 8.5l4 3.5-4 3.5M13.5 5.5l-3 13" />
    </Svg>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4.5 21 19.5H3L12 4.5Z" />
      <path d="M12 10.5v4M12 17.2v.2" />
    </Svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </Svg>
  );
}

/*
 * WhatsApp: teléfono dentro de una burbuja. Es una versión propia y
 * simplificada, no el asset de Meta. Identificar el canal al que Gantry se
 * conecta con su glifo reconocible es uso nominativo — igual que los iconos de
 * LinkedIn y X en el pie — a diferencia de reproducir el logotipo de un
 * producto ajeno (ver los sistemas de gestión, arriba).
 */
export function WhatsAppIcon(props: IconProps) {
  return (
    <Svg {...props} strokeWidth={1.6}>
      <path d="M3.5 20.5 4.8 16.6A8.2 8.2 0 1 1 7.9 19.6l-4.4.9Z" />
      <path d="M9 8.6c.3-.7.6-.7.9-.7h.6c.2 0 .5 0 .7.6l.7 1.7c.1.3 0 .5-.1.7l-.5.6c-.2.2-.3.4-.1.7a6 6 0 0 0 2.7 2.4c.3.1.5.1.7-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.3.1.5.3.5.5 0 .6-.3 1.3-.9 1.6-.5.3-1.3.4-2.2.1a9.3 9.3 0 0 1-5.5-4.7c-.5-1-.6-2-.3-2.7Z" />
    </Svg>
  );
}

/** Doble check de "leído" (convención de WhatsApp). */
export function CheckDoubleIcon(props: IconProps) {
  return (
    <Svg {...props} strokeWidth={2}>
      <path d="m2 12.5 3.5 3.5L13 8.5" />
      <path d="m10 12.5 3.5 3.5L22 7.5" />
    </Svg>
  );
}

export function SmileIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 14c.9 1.2 2.1 1.8 3.5 1.8s2.6-.6 3.5-1.8" />
      <path d="M9.2 9.5v.2M14.8 9.5v.2" />
    </Svg>
  );
}

export function PaperclipIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M19 11.5 12 18.5a4.6 4.6 0 0 1-6.5-6.5l7.5-7.5a3.1 3.1 0 0 1 4.4 4.4l-7.5 7.5a1.6 1.6 0 0 1-2.2-2.2l6.8-6.8" />
    </Svg>
  );
}

export function MicIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" />
    </Svg>
  );
}

export function UndoIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8.5 5.5 4.5 9.5l4 4" />
      <path d="M4.5 9.5H14a5 5 0 0 1 0 10h-3" />
    </Svg>
  );
}

export function RedoIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m15.5 5.5 4 4-4 4" />
      <path d="M19.5 9.5H10a5 5 0 0 0 0 10h3" />
    </Svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 12h14" />
    </Svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function DotsVerticalIcon(props: IconProps) {
  return (
    <Svg {...props} fill="currentColor" stroke="none">
      <circle cx="12" cy="5.5" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="12" cy="18.5" r="1.4" />
    </Svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 12h16M13 5l7 7-7 7" />
    </Svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Svg>
  );
}

export function DatabaseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6" />
      <path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
    </Svg>
  );
}

export function LinkIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M10 14a4.2 4.2 0 0 0 6 0l3-3a4.24 4.24 0 0 0-6-6l-1.5 1.5" />
      <path d="M14 10a4.2 4.2 0 0 0-6 0l-3 3a4.24 4.24 0 0 0 6 6l1.5-1.5" />
    </Svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.3 2.3 3.4 5.2 3.4 8.5s-1.1 6.2-3.4 8.5c-2.3-2.3-3.4-5.2-3.4-8.5s1.1-6.2 3.4-8.5Z" />
    </Svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m6 9.5 6 6 6-6" />
    </Svg>
  );
}

export function RowsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="4" y="5" width="16" height="14" rx="2.5" />
      <path d="M4 10h16M4 14.5h16" />
    </Svg>
  );
}

export function BranchIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="6" cy="6" r="2.4" />
      <circle cx="6" cy="18" r="2.4" />
      <circle cx="18" cy="12" r="2.4" />
      <path d="M8.4 6H12a3 3 0 0 1 3 3v0M8.4 18H12a3 3 0 0 0 3-3v0" />
    </Svg>
  );
}
