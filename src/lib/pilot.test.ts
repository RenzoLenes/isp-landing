import { describe, expect, it } from "vitest";
import { validatePilotForm, type PilotFormData } from "./pilot";

const VALID: PilotFormData = {
  nombre: "Carla Mendoza",
  isp: "Red Andina",
  ciudad: "Arequipa",
  whatsapp: "+51 999 888 777",
};

describe("validatePilotForm", () => {
  it("devuelve objeto vacío cuando todos los campos son válidos", () => {
    expect(validatePilotForm(VALID)).toEqual({});
  });

  it("exige cada campo requerido con mensaje en español", () => {
    const errors = validatePilotForm({ nombre: "", isp: "  ", ciudad: "", whatsapp: "" });
    expect(errors.nombre).toBe("Ingresa tu nombre.");
    expect(errors.isp).toBe("Ingresa el nombre de tu ISP.");
    expect(errors.ciudad).toBe("Ingresa tu ciudad.");
    expect(errors.whatsapp).toBe("Ingresa un número de WhatsApp.");
  });

  it("rechaza un WhatsApp con letras", () => {
    expect(
      validatePilotForm({ ...VALID, whatsapp: "no tengo" }).whatsapp,
    ).toBe("Ingresa un número válido (solo dígitos, espacios, + y -).");
  });

  it("rechaza un WhatsApp con menos de 6 dígitos", () => {
    expect(validatePilotForm({ ...VALID, whatsapp: "+51 99" }).whatsapp).toBe(
      "Ingresa un número válido (solo dígitos, espacios, + y -).",
    );
  });

  it("acepta números con espacios, guiones y prefijo internacional", () => {
    expect(validatePilotForm({ ...VALID, whatsapp: "999-888-777" })).toEqual({});
  });

  it("acepta los límites de 6 y 15 dígitos", () => {
    expect(validatePilotForm({ ...VALID, whatsapp: "123456" })).toEqual({});
    expect(
      validatePilotForm({ ...VALID, whatsapp: "+123456789012345" }),
    ).toEqual({});
  });

  it("rechaza más de 15 dígitos", () => {
    expect(
      validatePilotForm({ ...VALID, whatsapp: "+1234567890123456" }).whatsapp,
    ).toBe("Ingresa un número válido (solo dígitos, espacios, + y -).");
  });
});
