"use server";

import { getServiceClient } from "./supabase";
import { validatePilotForm, type PilotFormData, type PilotFormErrors } from "./pilot";

/*
 * El envío del formulario del piloto.
 *
 * Una Server Action es un POST público contra la página: el `"use server"` de
 * arriba crea un endpoint al que cualquiera puede llamar sin pasar por el
 * formulario ni por el navegador. Que el formulario valide antes de enviar no
 * cuenta como control — es comodidad para quien escribe, nada más. Por eso
 * aquí se vuelve a validar entero, se limpia campo por campo, y la base tiene
 * sus propios `check` como último freno (ver la migración).
 */

/** Topes por campo. Coinciden con los `check` de la tabla a propósito: si un
 *  día divergen, el que corta primero es este y el error nunca llega a
 *  Postgres. */
const MAX = {
  nombre: 120,
  isp: 120,
  sistema: 120,
  clientes: 40,
  reto: 120,
  whatsapp: 40,
} as const;

export type PilotSubmitResult =
  | { ok: true }
  /** No pasó la validación en el servidor. Trae los mismos mensajes que pinta
   *  el formulario, para que el cliente no tenga que inventarlos. */
  | { ok: false; kind: "invalid"; errors: PilotFormErrors }
  /** Supabase no aceptó la fila, o falta configuración. El detalle se queda en
   *  el log del servidor: al navegador solo vuelve que falló. */
  | { ok: false; kind: "failed" };

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function submitPilotRequest(
  input: PilotFormData,
): Promise<PilotSubmitResult> {
  // Campo por campo, nunca esparciendo `input`. Lo que llegue de más —un
  // `estado`, un `id`— se queda fuera por construcción.
  const data: PilotFormData = {
    nombre: clean(input?.nombre, MAX.nombre),
    isp: clean(input?.isp, MAX.isp),
    sistema: clean(input?.sistema, MAX.sistema),
    clientes: clean(input?.clientes, MAX.clientes),
    reto: clean(input?.reto, MAX.reto),
    whatsapp: clean(input?.whatsapp, MAX.whatsapp),
  };

  const errors = validatePilotForm(data);
  if (Object.keys(errors).length > 0) {
    return { ok: false, kind: "invalid", errors };
  }

  try {
    const { error } = await getServiceClient()
      .from("pilot_requests")
      .insert({
        nombre: data.nombre,
        isp: data.isp,
        sistema: data.sistema,
        clientes: data.clientes,
        // `reto` es el único opcional del formulario. Vacío se guarda como
        // NULL y no como cadena vacía: son cosas distintas al leer la tabla.
        reto: data.reto || null,
        whatsapp: data.whatsapp,
      });

    if (error) {
      console.error("[piloto] Supabase rechazó la solicitud:", error.message);
      return { ok: false, kind: "failed" };
    }
  } catch (cause) {
    // Red caída, instancia apagada, configuración ausente.
    console.error("[piloto] No se pudo guardar la solicitud:", cause);
    return { ok: false, kind: "failed" };
  }

  return { ok: true };
}
