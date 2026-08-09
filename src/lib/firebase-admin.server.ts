import { createRemoteJWKSet, jwtVerify } from "jose";

const PROJECT_ID = process.env["FIREBASE_PROJECT_ID"] || "tarjeta-buscyl";

const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
);

export type FirebaseUsuario = {
  uid: string;
  email: string;
  emailVerificado: boolean;
};

/** Verifica un ID token de Firebase y devuelve el usuario. */
export async function verifyFirebaseIdToken(idToken: string): Promise<FirebaseUsuario> {
  let payload;
  try {
    const res = await jwtVerify(idToken, JWKS, {
      issuer: `https://securetoken.google.com/${PROJECT_ID}`,
      audience: PROJECT_ID,
    });
    payload = res.payload as Record<string, unknown>;
  } catch (e) {
    console.error("Firebase token inválido:", e);
    throw new Error("Tu sesión ha caducado. Vuelve a iniciar sesión.");
  }

  const uid = (payload["user_id"] as string) || (payload["sub"] as string) || "";
  const email = ((payload["email"] as string) || "").toLowerCase();
  const emailVerificado = payload["email_verified"] === true;

  if (!uid || !email) throw new Error("La sesión no incluye un correo electrónico válido.");
  if (!emailVerificado) {
    throw new Error("Debes verificar tu correo electrónico antes de crear el pase.");
  }

  return { uid, email, emailVerificado };
}
