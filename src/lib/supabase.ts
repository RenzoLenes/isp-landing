import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/*
 * Cliente de Supabase para el servidor, y SOLO para el servidor.
 *
 * `import "server-only"` de arriba no es adorno: si algún día alguien importa
 * este archivo desde un componente cliente, la compilación falla en vez de
 * empaquetar la clave de servicio en el bundle del navegador. Por eso tampoco
 * hay ninguna variable `NEXT_PUBLIC_` aquí — ese prefijo es precisamente lo
 * que Next manda al cliente.
 *
 * La instancia es self-hosted y compartida con otras apps. Supabase
 * self-hosted es de un solo proyecto, así que el aislamiento de Gantry es el
 * esquema `gantry` (ver `supabase/migrations/`), y se selecciona abajo con
 * `db.schema`. supabase-js lo traduce a las cabeceras `Accept-Profile` /
 * `Content-Profile` de PostgREST.
 *
 * La clave es indiferente para este archivo: una `sb_secret_…` del esquema
 * nuevo y la `service_role` heredada se pasan igual y actúan como el mismo rol
 * de Postgres (`service_role`, con BYPASSRLS). Por eso la variable se llama
 * `SUPABASE_SECRET_KEY` y no por el nombre del rol: el rol es de la base, la
 * clave es de la API, y ahora hay dos formatos que valen.
 */

const SCHEMA = "gantry";

/** Lo que la tabla acepta. Escrito a mano porque el esquema cabe en una tabla
 *  y generar tipos exige acceso directo a Postgres, que desde fuera no hay. */
type PilotRequestInsert = {
  isp: string;
  sistema: string;
  clientes: string;
  reto: string | null;
  nombre: string;
  whatsapp: string;
};

type PilotRequestRow = PilotRequestInsert & {
  id: number;
  created_at: string;
  estado: string;
};

type Database = {
  gantry: {
    Tables: {
      pilot_requests: {
        Row: PilotRequestRow;
        Insert: PilotRequestInsert;
        Update: Partial<PilotRequestInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type { PilotRequestInsert };

let cached: SupabaseClient<Database, typeof SCHEMA> | null = null;

/**
 * Devuelve el cliente con la clave de servicio, creándolo una sola vez.
 *
 * Lanza si falta configuración en vez de crear un cliente a medias: un envío
 * que se pierde en silencio es peor que uno que falla a la vista, porque quien
 * escribió se queda esperando una respuesta que nadie va a mandar.
 */
export function getServiceClient(): SupabaseClient<Database, typeof SCHEMA> {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      "Faltan SUPABASE_URL y/o SUPABASE_SECRET_KEY. Ver .env.example.",
    );
  }

  cached = createClient<Database, typeof SCHEMA>(url, secretKey, {
    db: { schema: SCHEMA },
    // No hay sesiones de usuario en esta landing y el proceso es de servidor:
    // persistir o refrescar tokens no tendría dónde guardarlos ni para qué.
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}
