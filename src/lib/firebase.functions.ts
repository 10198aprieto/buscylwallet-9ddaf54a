import { createServerFn } from "@tanstack/react-start";

/**
 * Configuración pública de Firebase (la apiKey de Firebase es pública por diseño).
 * El authDomain puede sobreescribirse con FIREBASE_AUTH_DOMAIN para usar
 * un dominio propio (por ejemplo, buscylwallet.es) en producción.
 */
export const getFirebaseConfig = createServerFn({ method: "GET" }).handler(async () => {
  return {
    apiKey: process.env["GOOGLE_API_KEY"] ?? "",
    authDomain: process.env["FIREBASE_AUTH_DOMAIN"] ?? "tarjeta-buscyl.firebaseapp.com",
    projectId: "tarjeta-buscyl",
    storageBucket: "tarjeta-buscyl.firebasestorage.app",
    messagingSenderId: "437255626552",
    appId: "1:437255626552:web:6c5cfa569c910ad977ebcd",
    measurementId: "G-2BHJD6LBDT",
  };
});
