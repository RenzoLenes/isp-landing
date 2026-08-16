import { CLOUD_MASSES, CLOUD_WISPS } from "@/lib/cloudTile";

/*
 * El Campo Señal de Gantry (DESIGN.md §2): el cielo sobre el que abre la
 * página y sobre el que flota la consola de producto.
 *
 * Reemplaza a los parches azules desenfocados que leían como degradado y no
 * como atmósfera. La técnica de nube fractal vive en `@/lib/cloudTile`, que
 * comparte con el panel de «Cómo funciona»; aquí sólo se define la
 * composición y la paleta.
 *
 * Cinco capas, de atrás hacia delante: atmósfera (degradado vertical) ·
 * bancos · jirones (derivando en sentido contrario, es lo que da profundidad)
 * · dos masas muy difusas que aportan la forma grande (el ruido da textura
 * pero no composición) · bruma que disuelve el cielo antes del corte de
 * registro, para que la sección siguiente no choque contra el azul.
 *
 * Server Component: nada que hidratar. La deriva es CSS pura (globals.css) y
 * anima sólo `transform`, así que después del primer pintado no cuesta nada.
 */
export function SkyField() {
  return (
    /*
     * `-z-10` es obligatorio, no decorativo. Un `absolute` con z-index
     * automático se pinta en la capa de posicionados, que va POR ENCIMA del
     * texto de los elementos no posicionados: sin esto el cielo tapaba el
     * titular, el subtítulo y la consola (el h1 seguía ahí, con opacidad 1 —
     * simplemente quedaba detrás). El `isolate` de la sección acota este
     * z-index negativo para que no se hunda tras el fondo del registro.
     */
    <div
      id="sky-field"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {/* 1. Atmósfera. El azul más saturado vive en el quinto superior y muere
             en Lienzo al pie, donde entra la sección siguiente. */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#b8ddf8_0%,#a4d1f6_20%,#addaf8_45%,#c9e6fa_68%,#e4eef6_88%,#f0f4f9_100%)]" />

      {/* 2. Bancos. Las capas sobresalen un 10% a cada lado para que la deriva
             horizontal nunca meta un borde en cuadro. Sólo la franja del nav
             queda de azul limpio. */}
      <div
        className="sky-drift-slow absolute inset-y-0 -left-[10%] -right-[10%]"
        style={{
          backgroundImage: CLOUD_MASSES,
          backgroundSize: "1350px 790px",
          maskImage:
            "linear-gradient(180deg,transparent 1%,rgba(0,0,0,0.2) 18%,rgba(0,0,0,0.62) 37%,rgba(0,0,0,0.92) 57%,#000 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg,transparent 1%,rgba(0,0,0,0.2) 18%,rgba(0,0,0,0.62) 37%,rgba(0,0,0,0.92) 57%,#000 100%)",
        }}
      />

      {/* 3. Jirones finos en sentido contrario. La banda es estrecha a
             propósito: si cubren todo el alto se suman a los bancos en cada
             píxel y el cielo vuelve a ser niebla pareja. */}
      <div
        className="sky-drift-slower absolute inset-y-0 -left-[10%] -right-[10%] opacity-40"
        style={{
          backgroundImage: CLOUD_WISPS,
          backgroundSize: "950px 590px",
          maskImage:
            "linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.32) 16%,rgba(0,0,0,0.85) 40%,rgba(0,0,0,0.5) 70%,transparent 94%)",
          WebkitMaskImage:
            "linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.32) 16%,rgba(0,0,0,0.85) 40%,rgba(0,0,0,0.5) 70%,transparent 94%)",
        }}
      />

      {/* 4. Composición: la forma grande que el ruido no da. */}
      <div className="sky-drift-slow absolute inset-0">
        <div className="absolute -left-[8%] top-[32%] h-[420px] w-[62%] rounded-full bg-white/35 blur-[110px]" />
        <div className="absolute -right-[10%] top-[44%] h-[460px] w-[58%] rounded-full bg-white/30 blur-[120px]" />
      </div>

      {/* 5. Bruma de salida hacia Lienzo. */}
      <div className="absolute inset-x-0 bottom-0 h-[26%] bg-[linear-gradient(180deg,transparent_0%,rgba(240,244,249,0.55)_55%,#f0f4f9_100%)]" />
    </div>
  );
}
