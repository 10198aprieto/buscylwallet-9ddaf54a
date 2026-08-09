import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  nombreCompleto: z.string().trim().min(3, "Nombre demasiado corto").max(120),
  numeroTarjeta: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "El número de tarjeta debe tener 6 dígitos"),
  valorQR: z.string().trim().min(1, "Falta el valor del QR").max(2000),
});

export const createWalletPass = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { upsertPassAndBuildSaveUrl } = await import("./wallet.server");
    const saveUrl = await upsertPassAndBuildSaveUrl(data);
    return { saveUrl };
  });

// Script de setup: crea la genericClass una sola vez (idempotente).
export const setupWalletClass = createServerFn({ method: "POST" }).handler(async () => {
  const { ensureGenericClass } = await import("./wallet.server");
  return ensureGenericClass();
});
