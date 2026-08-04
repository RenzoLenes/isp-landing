"use client";

import { useState } from "react";
import { LANDING } from "@/content/landing";
import {
  submitPilotRequest,
  validatePilotForm,
  type PilotFormData,
  type PilotFormErrors,
} from "@/lib/pilot";

const EMPTY: PilotFormData = { nombre: "", isp: "", ciudad: "", whatsapp: "" };
const FIELD_ORDER = ["nombre", "isp", "ciudad", "whatsapp"] as const;

export function PilotForm() {
  const { form } = LANDING.pilot;
  const [data, setData] = useState<PilotFormData>(EMPTY);
  const [errors, setErrors] = useState<PilotFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

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
        role="status"
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
      <p className="font-serif text-2xl text-ink">{form.title}</p>
      <div className="mt-6 flex flex-col gap-5">
        {FIELD_ORDER.map((field) => (
          <div key={field}>
            <label
              htmlFor={`pilot-${field}`}
              className="mb-1.5 block text-sm font-medium text-ink"
            >
              {form.fields[field].label}
            </label>
            <input
              id={`pilot-${field}`}
              name={field}
              type={field === "whatsapp" ? "tel" : "text"}
              value={data[field]}
              placeholder={form.fields[field].placeholder}
              aria-invalid={Boolean(errors[field])}
              aria-describedby={errors[field] ? `pilot-${field}-error` : undefined}
              onChange={(e) => {
                const value = e.target.value;
                setData((prev) => ({ ...prev, [field]: value }));
                // Limpia el error en cuanto el usuario corrige: si no, el mensaje
                // y aria-invalid quedan obsoletos junto a un campo ya válido.
                setErrors((prev) =>
                  prev[field] ? { ...prev, [field]: undefined } : prev,
                );
              }}
              className="min-h-11 w-full rounded-xl border border-whisper bg-fog px-4 py-2.5 text-sm text-ink placeholder:text-moss/60 focus:outline-2 focus:outline-offset-1 focus:outline-blue"
            />
            {errors[field] ? (
              <p
                id={`pilot-${field}-error`}
                className="mt-1.5 text-xs text-coral"
              >
                {errors[field]}
              </p>
            ) : null}
          </div>
        ))}
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
