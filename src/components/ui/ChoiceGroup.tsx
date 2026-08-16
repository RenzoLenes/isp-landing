"use client";

/*
 * Grupo de opción única en fichas, en lugar de un `<select>`.
 *
 * Por qué no un desplegable: los rangos de clientes y los frentes de trabajo
 * son cuatro opciones cortas y cerradas. En un `<select>` quedan escondidas
 * —el visitante tiene que abrir, leer y elegir— y además el control es el más
 * genérico que existe. En fichas se ven todas de golpe, se elige con un toque,
 * y las propias opciones comunican para quién es el piloto: alguien de 4 000
 * clientes ve «Más de 3000» y sabe que le hablan a él.
 *
 * Semántica: son radios de verdad (`input[type=radio]` visualmente oculto
 * dentro de la etiqueta), no botones con estado. Eso da gratis la navegación
 * con flechas, el envío por teclado y el anuncio correcto del lector de
 * pantalla. El contenedor lleva `role="radiogroup"` con el mismo `id` que
 * tenía el `<select>`, así que `aria-invalid` y `aria-describedby` siguen
 * colgando de un único elemento localizable.
 */
export function ChoiceGroup({
  id,
  name,
  label,
  options,
  value,
  onChange,
  invalid,
  describedBy,
}: {
  id: string;
  name: string;
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
  describedBy?: string;
}) {
  const labelId = `${id}-label`;

  return (
    <div>
      <p id={labelId} className="mb-2 text-sm font-medium text-ink">
        {label}
      </p>
      <div
        id={id}
        role="radiogroup"
        aria-labelledby={labelId}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const selected = value === option;
          return (
            <label
              key={option}
              className={`relative flex min-h-11 cursor-pointer items-center rounded-[12px] border px-3.5 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-signal ${
                selected
                  ? "border-ink bg-ink font-medium text-surface"
                  : "border-whisper bg-canvas text-ink hover:border-ink/25"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
                /*
                 * Cubre la ficha entera en vez de ir `sr-only`. Con `sr-only`
                 * el input mide 1x1px y la auditoría de objetivos táctiles lo
                 * contaba como un objetivo diminuto — correctamente: el que
                 * medía 44px era la etiqueta, no el control. Así el propio
                 * control ocupa el área que se toca, sin excepciones que
                 * explicar en la prueba.
                 *
                 * `-inset-px` y no `inset-0`: un absoluto se posiciona contra
                 * la caja de PADDING del contenedor, así que con `inset-0` el
                 * borde de 1px por lado queda fuera y el control medía 42px
                 * contra un suelo de 44. El píxel negativo lo estira hasta
                 * cubrir la caja de borde completa.
                 */
                className="absolute -inset-px cursor-pointer appearance-none opacity-0"
              />
              {option}
            </label>
          );
        })}
      </div>
    </div>
  );
}
