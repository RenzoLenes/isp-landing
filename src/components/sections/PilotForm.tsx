"use client";

import { useEffect, useRef, useState } from "react";
import { LANDING } from "@/content/landing";
import {
  submitPilotRequest,
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

// Orden de los campos tal como pide la spec: tres de texto, dos selects y el
// WhatsApp al final. `whatsapp` usa `<input type="tel">`; el resto de texto usa
// `<input type="text">`. Los que faltan aquí se resuelven como select porque
// su copy en `landing.ts` trae `options`.
const FIELD_ORDER: readonly (keyof PilotFormData)[] = [
  "nombre",
  "isp",
  "sistema",
  "clientes",
  "reto",
  "whatsapp",
];

const CONTROL_CLASS =
  "min-h-11 w-full rounded-xl border border-whisper bg-fog px-4 py-2.5 text-sm text-ink placeholder:text-moss/60 focus:outline-2 focus:outline-offset-1 focus:outline-blue";

export function PilotForm() {
  const { form } = LANDING.pilot;
  const [data, setData] = useState<PilotFormData>(EMPTY);
  const [errors, setErrors] = useState<PilotFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  function handleFieldChange(name: keyof PilotFormData, value: string) {
    setData((prev) => ({ ...prev, [name]: value }));
    // Limpia el error en cuanto el usuario corrige: si no, el mensaje
    // y aria-invalid quedan obsoletos junto a un campo ya válido.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validatePilotForm(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSending(true);
    await submitPilotRequest(data);
    setSending(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        ref={successRef}
        role="status"
        tabIndex={-1}
        className="rounded-3xl border border-fiber/40 bg-fiber/15 p-8"
      >
        <p className="font-serif text-2xl text-ink">{form.success.title}</p>
        <p className="mt-2 leading-relaxed text-moss">{form.success.body}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-whisper bg-surface p-6 shadow-float md:p-8"
    >
      <h3 className="font-serif text-2xl text-ink">{form.title}</h3>
      <div className="mt-6 flex flex-col gap-5">
        {FIELD_ORDER.map((name) => {
          const field = form.fields[name];
          const error = errors[name];
          const controlId = `pilot-${name}`;
          const errorId = error ? `${controlId}-error` : undefined;

          return (
            <div key={name}>
              <label
                htmlFor={controlId}
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                {field.label}
              </label>
              {"options" in field ? (
                <div className="relative">
                  <select
                    id={controlId}
                    name={name}
                    value={data[name]}
                    aria-invalid={Boolean(error)}
                    aria-describedby={errorId}
                    onChange={(e) => handleFieldChange(name, e.target.value)}
                    className={`${CONTROL_CLASS} appearance-none pr-10`}
                  >
                    <option value="">{field.placeholder}</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <svg
                    aria-hidden
                    viewBox="0 0 20 20"
                    fill="none"
                    className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-moss"
                  >
                    <path
                      d="M5 7.5 10 12.5 15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              ) : (
                <input
                  id={controlId}
                  name={name}
                  type={name === "whatsapp" ? "tel" : "text"}
                  value={data[name]}
                  placeholder={field.placeholder}
                  aria-invalid={Boolean(error)}
                  aria-describedby={errorId}
                  onChange={(e) => handleFieldChange(name, e.target.value)}
                  className={CONTROL_CLASS}
                />
              )}
              {error ? (
                <p id={errorId} className="mt-1.5 text-xs text-coral-deep">
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
      <button
        type="submit"
        disabled={sending}
        className="mt-7 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-blue px-6 py-3 text-sm font-medium text-surface shadow-card transition-[background-color,transform] duration-200 hover:bg-blue-deep active:translate-y-px disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      >
        {sending ? form.sending : form.submit}
      </button>
    </form>
  );
}
