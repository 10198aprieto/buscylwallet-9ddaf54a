import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const tokenSchema = z.object({
  idToken: z.string().trim().min(20, "Debes iniciar sesión"),
});

const regenerarSchema = tokenSchema.extend({
  numeroTarjeta: z.string().trim().regex(/^\d{6}$/, "Número de tarjeta no válido"),
});

export const listarMisTarjetas = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => tokenSchema.parse(data))
  .handler(async ({ data }) => {
    const { verifyFirebaseIdToken } = await import("./firebase-admin.server");
    const usuario = await verifyFirebaseIdToken(data.idToken);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: filas, error } = await supabaseAdmin
      .from("card_claims")
      .select("card_number, nombre_completo, created_at, updated_at")
      .eq("firebase_uid", usuario.uid)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error listando card_claims:", error);
      throw new Error("No se han podido cargar tus tarjetas.");
    }

    return {
      email: usuario.email,
      tarjetas: (filas ?? []).map((f) => ({
        numeroTarjeta: f.card_number,
        nombreCompleto: f.nombre_completo ?? "",
        creada: f.created_at,
        actualizada: f.updated_at,
      })),
    };
  });

export const regenerarEnlaceWallet = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => regenerarSchema.parse(data))
  .handler(async ({ data }) => {
    const { verifyFirebaseIdToken } = await import("./firebase-admin.server");
    const usuario = await verifyFirebaseIdToken(data.idToken);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: fila, error } = await supabaseAdmin
      .from("card_claims")
      .select("firebase_uid")
      .eq("card_number", data.numeroTarjeta)
      .maybeSingle();

    if (error) {
      console.error("Error consultando card_claims:", error);
      throw new Error("No se ha podido comprobar la titularidad de la tarjeta.");
    }
    if (!fila || fila.firebase_uid !== usuario.uid) {
      throw new Error("Esta tarjeta no está asociada a tu cuenta.");
    }

    const { buildSaveUrlForExistingCard } = await import("./wallet.server");
    const saveUrl = await buildSaveUrlForExistingCard(data.numeroTarjeta);
    return { saveUrl };
  });
