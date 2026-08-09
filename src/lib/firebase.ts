import type { Auth, GoogleAuthProvider as GoogleProviderType } from "firebase/auth";

import { getFirebaseConfig } from "./firebase.functions";

let authPromise: Promise<Auth> | null = null;

/** Inicializa Firebase en el navegador (una sola vez) y devuelve el servicio Auth. */
export async function getFirebaseAuth(): Promise<Auth> {
  if (!authPromise) {
    authPromise = (async () => {
      const config = await getFirebaseConfig();
      if (!config.apiKey) {
        throw new Error("Falta la configuración de Firebase (API key).");
      }
      const { initializeApp, getApps } = await import("firebase/app");
      const { getAuth, setPersistence, browserLocalPersistence } = await import("firebase/auth");
      const app = getApps()[0] ?? initializeApp(config);
      const auth = getAuth(app);
      auth.languageCode = "es";
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch {
        // Persistencia no disponible: seguimos con la de por defecto.
      }
      return auth;
    })();
  }
  return authPromise;
}

/** Proveedor de Google con el scope de email. */
export async function getGoogleProvider(): Promise<GoogleProviderType> {
  const { GoogleAuthProvider } = await import("firebase/auth");
  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/userinfo.email");
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}
