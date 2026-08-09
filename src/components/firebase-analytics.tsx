import { useEffect } from "react";

import { getFirebaseConfig } from "@/lib/firebase.functions";

let iniciado = false;

/** Inicializa Firebase Analytics solo en el navegador, una única vez. */
export function FirebaseAnalytics() {
  useEffect(() => {
    if (iniciado) return;
    iniciado = true;

    void (async () => {
      try {
        const config = await getFirebaseConfig();
        if (!config.apiKey) return;

        const { initializeApp, getApps } = await import("firebase/app");
        const { getAnalytics, isSupported } = await import("firebase/analytics");

        if (!(await isSupported())) return;

        const app = getApps()[0] ?? initializeApp(config);
        getAnalytics(app);
      } catch (e) {
        console.error("Firebase Analytics no se ha podido iniciar", e);
      }
    })();
  }, []);

  return null;
}
