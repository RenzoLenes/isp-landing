-- Gantry · esquema propio dentro de la instancia self-hosted compartida.
--
-- POR QUÉ UN ESQUEMA Y NO UN PROYECTO
-- Supabase self-hosted es de un solo proyecto por instalación; está dicho así
-- en la documentación oficial ("Self-hosted Supabase runs as a single project
-- which means that Studio doesn't support multiple organizations or
-- projects"). El `/project/default` del Studio es un nombre fijo, no algo que
-- se pueda duplicar. La separación real entre apps que comparten la máquina se
-- hace por esquema dentro de la misma base.
--
-- CÓMO SE APLICA
-- Pegar en el SQL Editor del Studio. No se puede desde aquí: el 5432 de la
-- máquina no está expuesto a internet (bien así), y PostgREST —lo único que
-- pasa por Kong— no ejecuta DDL.
--
-- DESPUÉS HAY UN SEGUNDO PASO en el docker-compose; está al pie de este
-- archivo. Sin él, PostgREST devuelve 406 y no encuentra el esquema.

create schema if not exists gantry;

comment on schema gantry is
  'Landing y producto de Gantry. Aislado del resto de apps de la instancia.';

create table if not exists gantry.pilot_requests (
  -- `bigint identity` y no `uuid v4`: la fila nunca se expone al navegador, no
  -- hace falta un id impredecible, y el identity no fragmenta el índice.
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),

  -- Sobre la operación.
  isp         text not null check (length(btrim(isp))      between 1 and 120),
  sistema     text not null check (length(btrim(sistema))  between 1 and 120),
  clientes    text not null check (length(btrim(clientes)) between 1 and  40),
  -- El único opcional del formulario, y lo es a propósito.
  reto        text          check (reto is null or length(reto) <= 120),

  -- Cómo contactar.
  nombre      text not null check (length(btrim(nombre))   between 1 and 120),
  whatsapp    text not null check (length(btrim(whatsapp)) between 6 and  40),

  -- Seguimiento manual desde el Studio mientras no haya panel propio.
  estado      text not null default 'nuevo'
              check (estado in ('nuevo', 'contactado', 'descartado'))
);

-- Los topes de longitud no son cosmética. La Server Action que inserta aquí es
-- un POST público: cualquiera puede llamarla sin pasar por el formulario. La
-- validación de `src/lib/pilot.ts` corre en el servidor, pero el último freno
-- tiene que estar en la base.

comment on table gantry.pilot_requests is
  'Solicitudes de acceso al piloto enviadas desde la landing.';
comment on column gantry.pilot_requests.reto is
  'Campo opcional del formulario; puede venir vacío.';
comment on column gantry.pilot_requests.estado is
  'Triage manual: nuevo -> contactado | descartado.';

-- ---------------------------------------------------------------------------
-- Permisos
-- ---------------------------------------------------------------------------
-- `service_role` solo puede INSERTAR. Ni leer, ni actualizar, ni borrar.
-- Si la clave se filtrara alguna vez, el daño posible es basura en la tabla —
-- nunca la fuga de la lista de solicitudes, que es lo que de verdad importa.
--
-- Esto vale para los dos formatos de clave: tanto la `service_role` heredada
-- como una `sb_secret_…` del esquema nuevo actúan como este mismo rol. Cambiar
-- de clave no cambia nada de lo de aquí abajo.
grant usage  on schema gantry            to service_role;
grant insert on gantry.pilot_requests    to service_role;

-- `anon` y `authenticated` no reciben nada. El formulario nunca habla con
-- Supabase desde el navegador: la clave que escribe vive solo en el servidor.
-- Un esquema nuevo no concede permisos por defecto, así que esto es explícito
-- para que quede escrito y nadie lo dé por hecho al leer el archivo.
revoke all on schema gantry         from anon, authenticated;
revoke all on gantry.pilot_requests from anon, authenticated;

-- Defensa en profundidad. `service_role` tiene BYPASSRLS, así que el insert
-- funciona con RLS activo y CERO políticas. Eso es lo correcto y es
-- deliberado: si alguien concede acceso a `anon` más adelante, sin políticas
-- no podrá leer ni escribir una sola fila.
--
-- NO añadir una política permisiva "para que funcione". Si algo falla, el
-- problema es un grant o el esquema sin exponer, no la RLS.
alter table gantry.pilot_requests enable row level security;

-- Sin índices además de la clave primaria: esta tabla se lee a mano desde el
-- Studio y va a tener cientos de filas, no millones. Un índice aquí sería
-- ruido que hay que mantener.

-- ---------------------------------------------------------------------------
-- SEGUNDO PASO — exponer el esquema a PostgREST
-- ---------------------------------------------------------------------------
-- Sin esto, supabase-js manda la cabecera `Content-Profile: gantry`, PostgREST
-- no la reconoce y responde 406 / PGRST106 — sin importar los permisos de
-- arriba. Los permisos dicen QUÉ puede hacer el rol; esto dice si la API
-- siquiera sabe que el esquema existe.
--
-- La instancia corre sobre Coolify, así que NO se edita ningún archivo a mano:
-- en el recurso de Supabase, pestaña Environment Variables, añadir
--
--     PGRST_DB_SCHEMAS = public,storage,graphql_public,gantry
--
-- y volver a desplegar. `public` va PRIMERO: el primero de la lista es el
-- esquema por defecto de la API, y cambiarlo rompería las otras apps que
-- comparten la instancia.
--
-- SI AUN ASÍ DA PGRST106, es que el ajuste está fijado en la base y le gana a
-- la variable de entorno. Se mira y se corrige así:
--
--     select rolname, rolconfig from pg_roles where rolname = 'authenticator';
--     alter role authenticator set pgrst.db_schemas = 'public,storage,graphql_public,gantry';
--
-- Ojo: eso deja el valor guardado en la base, donde no se ve desde Coolify. Es
-- el plan B, no el plan A — si se usa, hay que recordarlo el día que alguien
-- cambie la variable de entorno y no entienda por qué no surte efecto.
--
-- Para que PostgREST recargue sin reiniciar nada:
--
--     notify pgrst, 'reload schema';
