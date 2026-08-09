import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  nombreCompleto: z.string().trim().min(3, "Nombre demasiado corto").max(120),
  numeroTarjeta: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "El número de tarjeta debe tener 6 dígitos"),
  valorQR: z.string().trim().min(1, "Falta el valor del QR").max(2000),
  idToken: z.string().trim().min(20, "Debes iniciar sesión"),
});

export const createWalletPass = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { reclamarTarjeta } = await import("./card-claims.server");
    const { upsertPassAndBuildSaveUrl } = await import("./wallet.server");

    const { email } = await reclamarTarjeta({
      idToken: data.idToken,
      numeroTarjeta: data.numeroTarjeta,
      nombreCompleto: data.nombreCompleto,
    });

    const saveUrl = await upsertPassAndBuildSaveUrl({
      nombreCompleto: data.nombreCompleto,
      numeroTarjeta: data.numeroTarjeta,
      valorQR: data.valorQR,
    });
    return { saveUrl, email };
  });

// Script de setup: crea la genericClass una sola vez (idempotente).
export const setupWalletClass = createServerFn({ method: "POST" }).handler(async () => {
  const { ensureGenericClass } = await import("./wallet.server");
  return ensureGenericClass();
});
