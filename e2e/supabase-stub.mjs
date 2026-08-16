import { createServer } from "node:http";

/*
 * PostgREST de mentira, solo para la suite e2e.
 *
 * La alternativa era darle a los tests las credenciales de la instancia real,
 * y entonces cada `npm run test:e2e` escribiría solicitudes de piloto falsas
 * en la tabla que el equipo lee para llamar a la gente. La otra alternativa
 * era un interruptor de "modo test" dentro de la Server Action, es decir, un
 * camino que se salta el guardado y que vive en el código que sí se publica.
 *
 * Con esto el recorrido que se prueba es el de verdad: Server Action ->
 * supabase-js -> POST HTTP -> respuesta. Lo único fingido es el otro extremo
 * del cable.
 *
 * `ISP_QUE_FALLA` es la palanca para probar el camino de error. Vive aquí, en
 * un archivo que nunca se despliega, y no en la aplicación.
 */

const PORT = Number(process.env.SUPABASE_STUB_PORT ?? 3101);
const ISP_QUE_FALLA = "FALLA-EL-INSERT";

const server = createServer((req, res) => {
  // Sonda de arranque para Playwright, que espera un 2xx antes de levantar la
  // landing.
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "content-type": "text/plain" }).end("stub en pie");
    return;
  }

  if (!req.url?.startsWith("/rest/v1/pilot_requests") || req.method !== "POST") {
    res.writeHead(404).end();
    return;
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    if (body.includes(ISP_QUE_FALLA)) {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "fallo simulado por la suite e2e" }));
      return;
    }
    // `.insert()` sin `.select()` manda `Prefer: return=minimal`, y PostgREST
    // contesta 201 sin cuerpo.
    res.writeHead(201).end();
  });
});

server.listen(PORT, () => {
  console.log(`[stub supabase] escuchando en http://localhost:${PORT}`);
});
