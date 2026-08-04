import { PILOT_CLIENT_RANGES } from "@/content/landing";

export type PilotFormData = {
  nombre: string;
  isp: string;
  sistema: string;
  clientes: string;
  reto: string;
  whatsapp: string;
};

export type PilotFormErrors = Partial<Record<keyof PilotFormData, string>>;

const WHATSAPP_INVALID =
  "Ingresa un número válido (solo dígitos, espacios, + y -).";

export function validatePilotForm(data: PilotFormData): PilotFormErrors {
  const errors: PilotFormErrors = {};

  if (!data.nombre.trim()) errors.nombre = "Ingresa tu nombre.";
  if (!data.isp.trim()) errors.isp = "Ingresa el nombre de tu ISP.";
  if (!data.sistema.trim()) errors.sistema = "Ingresa el sistema que usas hoy.";

  const clientes = data.clientes.trim();
  if (
    !clientes ||
    !PILOT_CLIENT_RANGES.includes(clientes as (typeof PILOT_CLIENT_RANGES)[number])
  ) {
    errors.clientes = "Selecciona un rango de clientes.";
  }

  const whatsapp = data.whatsapp.trim();
  if (!whatsapp) {
    errors.whatsapp = "Ingresa un número de WhatsApp.";
  } else {
    const digits = whatsapp.replace(/\D/g, "");
    const validChars = /^[+\d\s-]+$/.test(whatsapp);
    if (!validChars || digits.length < 6 || digits.length > 15) {
      errors.whatsapp = WHATSAPP_INVALID;
    }
  }

  return errors;
}

// Punto único de conexión con el backend futuro. Hoy solo resuelve.
export async function submitPilotRequest(_data: PilotFormData): Promise<void> {
  return Promise.resolve();
}
