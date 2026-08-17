/**
 * El hilo punteado con un pulso que lo recorre.
 *
 * Era `motion` con `repeat: Infinity`. Ahora son dos `@keyframes` en
 * globals.css, y el componente se queda sin un solo hook — así que deja de ser
 * componente de cliente y pasa a ser HTML servido, sin nada que hidratar.
 *
 * Eso además borra de un plumazo todo lo que este archivo documentaba sobre
 * hidratación: no hay `useReducedMotion()` que devuelva una cosa en el
 * servidor y otra en el cliente, así que no hay estructura que pueda
 * discrepar. El apagado bajo `prefers-reduced-motion` lo hace el propio CSS,
 * y lo hace de verdad —`animation: none`, no una animación lenta— como pide
 * DESIGN.md §9.
 *
 * `data-signal-pulse` es el anclaje de los tests. Antes se localizaba por
 * forma de clases y el selector acabó capturando también la capa de atmósfera
 * de `SkyField`, igual de `aria-hidden` e igual de `absolute inset-0`. Un
 * atributo explícito no colisiona.
 */
export function SignalThread({
  orientation,
  className = "",
}: {
  orientation: "vertical" | "horizontal";
  className?: string;
}) {
  const isVertical = orientation === "vertical";

  return (
    <div
      aria-hidden
      className={`relative ${isVertical ? "h-full w-px" : "h-px w-full"} ${className}`}
    >
      <div
        className={`absolute inset-0 border-signal ${
          isVertical ? "border-l border-dashed" : "border-t border-dashed"
        }`}
      />
      <div
        data-signal-pulse
        data-axis={isVertical ? "vertical" : "horizontal"}
        className="absolute inset-0"
      >
        <span className="absolute -left-[3px] -top-[3px] block size-1.5 rounded-full bg-signal" />
      </div>
    </div>
  );
}
