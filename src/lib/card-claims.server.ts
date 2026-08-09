import { verifyFirebaseIdToken } from "./firebase-admin.server";

export type ResultadoReclamacion =
  | { ok: true; email: string; uid: string }
  | { ok: false; motivo: string };

/**
 * Reserva un número de tarjeta para una cuenta verificada.
 * Si la tarjeta ya pertenece a otra cuenta, se rechaza.
 */
export async function reclamarTarjeta(input: {
  idToken: string;
  numeroTarjeta: string;
  nombreCompleto: string;
}): Promise<{ email: string; uid: string }> {
  const usuario = await verifyFirebaseIdToken(input.idToken);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: existente, error: errorLectura } = await supabaseAdmin
    .from("card_claims")
    .select("firebase_uid, email")
    .eq("card_number", input.numeroTarjeta)
    .maybeSingle();

  if (errorLectura) {
    console.error("Error consultando card_claims:", errorLectura);
    throw new Error("No se ha podido comprobar la titularidad de la tarjeta.");
  }

  if (existente && existente.firebase_uid !== usuario.uid) {
    throw new Error(
      "Esta tarjeta ya está registrada por otra persona. Si es tuya, escríbenos para reclamarla.",
    );
  }

  if (existente) {
    const { error } = await supabaseAdmin
      .from("card_claims")
      .update({
        nombre_completo: input.nombreCompleto,
        email: usuario.email,
        updated_at: new Date().toISOString(),
      })
      .eq("card_number", input.numeroTarjeta);
    if (error) {
      console.error("Error actualizando card_claims:", error);
      throw new Error("No se ha podido actualizar la titularidad de la tarjeta.");
    }
  } else {
    const { error } = await supabaseAdmin.from("card_claims").insert({
      card_number: input.numeroTarjeta,
      firebase_uid: usuario.uid,
      email: usuario.email,
      nombre_completo: input.nombreCompleto,
    });
    if (error) {
      // Carrera con otra petición sobre la misma tarjeta.
      if (error.code === "23505") {
        throw new Error("Esta tarjeta acaba de ser registrada por otra persona.");
      }
      console.error("Error registrando card_claims:", error);
      throw new Error("No se ha podido registrar la tarjeta.");
    }
  }

  return { email: usuario.email, uid: usuario.uid };
}
