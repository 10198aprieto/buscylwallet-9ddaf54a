import { getFirebaseAuth, getGoogleProvider } from "./firebase";

function mensajeError(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "El correo electrónico no es válido.";
    case "auth/missing-password":
      return "Introduce tu contraseña.";
    case "auth/weak-password":
      return "La contraseña debe tener al menos 6 caracteres.";
    case "auth/email-already-in-use":
      return "Ya existe una cuenta con ese correo. Inicia sesión.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Correo o contraseña incorrectos.";
    case "auth/too-many-requests":
      return "Demasiados intentos. Prueba de nuevo en unos minutos.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Has cerrado la ventana de Google antes de terminar.";
    case "auth/popup-blocked":
      return "El navegador ha bloqueado la ventana de Google. Permite las ventanas emergentes.";
    case "auth/unauthorized-domain":
      return "Este dominio todavía no está autorizado en Firebase.";
    default:
      return "No se ha podido completar la operación. Inténtalo de nuevo.";
  }
}

export function traducirError(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;
  if (code) return mensajeError(code);
  return (error as Error)?.message || "Se ha producido un error inesperado.";
}

/** Inicio de sesión con Google mediante ventana emergente. */
export async function loginWithGoogle() {
  const auth = await getFirebaseAuth();
  const provider = await getGoogleProvider();
  const { signInWithPopup } = await import("firebase/auth");
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

/** Registro con email + envío del correo de verificación. */
export async function signUpWithEmail(email: string, password: string) {
  const auth = await getFirebaseAuth();
  const { createUserWithEmailAndPassword, sendEmailVerification } = await import("firebase/auth");
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(cred.user, { url: window.location.origin });
  return cred.user;
}

/** Inicio de sesión con email y contraseña. */
export async function signInWithEmail(email: string, password: string) {
  const auth = await getFirebaseAuth();
  const { signInWithEmailAndPassword } = await import("firebase/auth");
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

/** Reenvía el correo de verificación al usuario actual. */
export async function reenviarVerificacion() {
  const auth = await getFirebaseAuth();
  const { sendEmailVerification } = await import("firebase/auth");
  if (!auth.currentUser) throw new Error("No hay ninguna sesión iniciada.");
  await sendEmailVerification(auth.currentUser, { url: window.location.origin });
}

/** Envía el correo de restablecimiento de contraseña. */
export async function resetPassword(email: string) {
  const auth = await getFirebaseAuth();
  const { sendPasswordResetEmail } = await import("firebase/auth");
  await sendPasswordResetEmail(auth, email, { url: window.location.origin });
  return "Te hemos enviado un correo para restablecer la contraseña.";
}

/** Cierra la sesión. */
export async function logout() {
  const auth = await getFirebaseAuth();
  const { signOut } = await import("firebase/auth");
  await signOut(auth);
}

/** Token de identidad del usuario actual (para llamadas al backend). */
export async function getIdToken(forzar = false): Promise<string> {
  const auth = await getFirebaseAuth();
  if (!auth.currentUser) throw new Error("Debes iniciar sesión.");
  await auth.currentUser.reload();
  return auth.currentUser.getIdToken(forzar);
}
