"use client";

import { useEffect, useRef, useState } from "react";
import { LANDING } from "@/content/landing";
import { ChoiceGroup } from "@/components/ui/ChoiceGroup";
import { submitPilotRequest } from "@/lib/pilot-actions";
import {
  validatePilotForm,
  type PilotFormData,
  type PilotFormErrors,
} from "@/lib/pilot";

const EMPTY: PilotFormData = {
  nombre: "",
  isp: "",
  sistema: "",
  clientes: "",
  reto: "",
  whatsapp: "",
};

const CONTROL_CLASS =
  "min-h-11 w-full rounded-xl border border-whisper bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-steel/60 focus:outline-2 focus:outline-offset-1 focus:outline-signal";


/*
 * `TextField` y `ChoiceField` viven FUERA de `PilotForm` a propósito. Estaban
 * definidas dentro de su cuerpo y React las trataba como un tipo nuevo en cada
 * render: el input se remontaba en cada pulsación y perdía el foco a la
 * primera letra. Reciben todo por props para que sigan siendo puras.
 */
function TextField({
  name,
  field,
  value,
  error,
  onChange,
}: {
  name: keyof PilotFormData;
  field: { label: string; placeholder: string };
  value: string;
  error?: string;
  onChange: (name: keyof PilotFormData, value: string) => void;
}) {
  const controlId = `pilot-${name}`;
  const errorId = error ? `${controlId}-error` : undefined;
  return (
    <div>
      <label htmlFor={controlId} className="mb-1.5 block text-sm font-medium text-ink">
        {field.label}
      </label>
      <input
        id={controlId}
        name={name}
        type={name === "whatsapp" ? "tel" : "text"}
        value={value}
        placeholder={field.placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        onChange={(e) => onChange(name, e.target.value)}
        className={CONTROL_CLASS}
      />
      {error ? (
        <p id={errorId} className="mt-1.5 text-xs text-coral-deep">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Grupo de fichas + su error, con el mismo contrato ARIA que un campo. */
function ChoiceField({
  name,
  field,
  value,
  error,
  onChange,
}: {
  name: "clientes" | "reto";
  field: { label: string; options: readonly string[] };
  value: string;
  error?: string;
  onChange: (name: keyof PilotFormData, value: string) => void;
}) {
  const controlId = `pilot-${name}`;
  const errorId = error ? `${controlId}-error` : undefined;
  return (
    <div>
      <ChoiceGroup
        id={controlId}
        name={name}
        label={field.label}
        options={field.options}
        value={value}
        onChange={(v) => onChange(name, v)}
        invalid={Boolean(error)}
        describedBy={errorId}
      />
      {error ? (
        <p id={errorId} className="mt-1.5 text-xs text-coral-deep">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function PilotForm() {
  const { form } = LANDING.pilot;
  const [data, setData] = useState<PilotFormData>(EMPTY);
  const [errors, setErrors] = useState<PilotFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  /* El envío llegó al servidor pero no se guardó. Distinto de un campo mal
     puesto: no hay nada que corregir, solo volver a intentar. */
  const [failed, setFailed] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  function handleFieldChange(name: keyof PilotFormData, value: string) {
    setData((prev) => ({ ...prev, [name]: value }));
    // Limpia el error en cuanto el usuario corrige: si no, el mensaje
    // y aria-invalid quedan obsoletos junto a un campo ya válido.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    setFailed(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFailed(false);
    const nextErrors = validatePilotForm(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSending(true);
    // La validación de arriba es para ayudar a quien escribe; la de la acción
    // es la que manda. Si el servidor devuelve errores, se pintan igual que
    // los locales en vez de tragárselos.
    const result = await submitPilotRequest(data);
    setSending(false);

    if (result.ok) {
      setSubmitted(true);
      return;
    }
    if (result.kind === "invalid") {
      setErrors(result.errors);
      return;
    }
    // No se guardó. NO se enseña el mensaje de éxito: prometería una respuesta
    // en 48 horas que nadie recibió y que por tanto nadie va a contestar.
    setFailed(true);
  }

  if (submitted) {
    return (
      // Was a translucent green wash with no opaque base — safe
      // while this section sat on a light register, but with no white
      // backing of its own that tint composites toward near-black once the
      // Pilot section's true background is `night`, taking `text-ink`/
      // `text-steel` down with it. Rebuilt as the same white "artifact that
      // glows" as the form it replaces (`bg-surface`, chrome-only border/
      // shadow vars), with the accent reserved for a small confirmation
      // dot. El verde de Fibra que llevaba ese punto se retiró con el resto
      // (globals.css): la landing sostiene un solo acento.
      <div
        ref={successRef}
        role="status"
        tabIndex={-1}
        className="rounded-3xl border border-[color:var(--card-border)] bg-surface p-8 shadow-[var(--card-shadow-strong)]"
      >
        <div className="flex items-center gap-2.5">
          <span aria-hidden className="size-2 shrink-0 rounded-full bg-signal" />
          <p className="font-display text-2xl text-ink">{form.success.title}</p>
        </div>
        <p className="mt-2 pl-[18px] leading-relaxed text-steel">{form.success.body}</p>
      </div>
    );
  }

  const { groups, reassurance } = form;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      // Chrome-only register adaptation, same as DataCard: this form is the
      // Pilot section's own "artifact that glows" on `night` (§6) — the border
      // drops and the shadow widens there, while every field inside stays
      // hardcoded ink/steel since they sit on this card's own permanently-white
      // fill, not on the section's register.
      className="rounded-3xl border border-[color:var(--card-border)] bg-surface p-6 shadow-[var(--card-shadow-strong)] md:p-8"
    >
      <h3 className="font-display text-2xl font-medium tracking-[-0.02em] text-ink">
        {form.title}
      </h3>

      {/*
        Dos bloques rotulados en vez de una lista plana de seis campos. Los
        de arriba son los que califican (qué sistema usas, de qué tamaño
        eres); los de abajo son sólo para contactarte. Antes todos pesaban lo
        mismo y no se entendía qué se preguntaba ni por qué.
      */}
      <fieldset className="mt-7">
        <legend className="text-[11px] font-medium uppercase tracking-[0.14em] text-steel">
          {groups.operacion}
        </legend>
        <div className="mt-4 flex flex-col gap-5">
          <TextField
            name="isp"
            field={form.fields.isp}
            value={data.isp}
            error={errors.isp}
            onChange={handleFieldChange}
          />
          <TextField
            name="sistema"
            field={form.fields.sistema}
            value={data.sistema}
            error={errors.sistema}
            onChange={handleFieldChange}
          />
          <ChoiceField
            name="clientes"
            field={form.fields.clientes}
            value={data.clientes}
            error={errors.clientes}
            onChange={handleFieldChange}
          />
          <ChoiceField
            name="reto"
            field={form.fields.reto}
            value={data.reto}
            error={errors.reto}
            onChange={handleFieldChange}
          />
        </div>
      </fieldset>

      <fieldset className="mt-8 border-t border-whisper pt-6">
        <legend className="text-[11px] font-medium uppercase tracking-[0.14em] text-steel">
          {groups.contacto}
        </legend>
        {/* Los dos cortos van en pareja: apilados desperdiciaban el ancho y
            alargaban el formulario sin motivo. */}
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <TextField
            name="nombre"
            field={form.fields.nombre}
            value={data.nombre}
            error={errors.nombre}
            onChange={handleFieldChange}
          />
          <TextField
            name="whatsapp"
            field={form.fields.whatsapp}
            value={data.whatsapp}
            error={errors.whatsapp}
            onChange={handleFieldChange}
          />
        </div>
      </fieldset>

      {/* Va ANTES del botón, no debajo: quien vuelve a pulsar tiene que haber
          leído por qué antes de pulsar. `role="alert"` lo anuncia solo. */}
      {failed ? (
        <div
          role="alert"
          className="mt-7 rounded-2xl border border-coral/40 bg-coral/[0.07] px-4 py-3.5"
        >
          <p className="text-sm font-medium text-coral-deep">{form.error.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-steel">{form.error.body}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={sending}
        className={`${failed ? "mt-4" : "mt-7"} inline-flex min-h-11 w-full items-center justify-center rounded-[16px] bg-ink px-6 py-3 text-[clamp(0.9375rem,1vw,1.0625rem)] font-medium text-surface shadow-[0_16px_36px_-14px_rgba(19,29,42,0.55)] transition-[background-color,transform] duration-200 hover:-translate-y-0.5 active:translate-y-px active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal`}
      >
        {sending ? form.sending : form.submit}
      </button>

      <p className="mt-3 text-center text-xs leading-relaxed text-steel">{reassurance}</p>
    </form>
  );
}
