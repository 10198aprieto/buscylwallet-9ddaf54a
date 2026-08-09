import { createServerFn } from "@tanstack/react-start";

export const getFirebaseConfig = createServerFn({ method: "GET" }).handler(async () => {
  return {
    apiKey: process.env["GOOGLE_API_KEY"] ?? "",
    authDomain: "tarjeta-buscyl.firebaseapp.com",
    projectId: "tarjeta-buscyl",
    storageBucket: "tarjeta-buscyl.firebasestorage.app",
    messagingSenderId: "437255626552",
    appId: "1:437255626552:web:6c5cfa569c910ad977ebcd",
    measurementId: "G-2BHJD6LBDT",
  };
});
