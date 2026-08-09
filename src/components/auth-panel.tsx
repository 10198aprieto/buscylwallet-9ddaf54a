import { Loader2, LogOut, MailCheck, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import {
  loginWithGoogle,
  logout,
  reenviarVerificacion,
  resetPassword,
  signInWithEmail,
  signUpWithEmail,
  traducirError,
} from "@/lib/authService";

type Vista = "login" | "registro" | "recuperar";

export function AuthPanel() {
  const { user, cargando, emailVerificado, refrescar } = useAuth();
  const [vista, setVista] = useState<Vista>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [ocupado, setOcupado] = useState(false);

  async function ejecutar(fn: () => Promise<void>) {
    setError("");
    setAviso("");
    setOcupado(true);
    try {
      await fn();
    } catch (e) {
      setError(traducirError(e));
    } finally {
      setOcupado(false);
    }
  }

  if (cargando) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Comprobando tu sesión…
      </div>
    );
  }

  if (user) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 p-4">
          <div className="flex items-center gap-2 text-sm">
            <ShieldCheck className="size-4 text-brand" />
            <span className="text-foreground">{user.email}</span>
            {emailVerificado ? (
              <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand">
                Verificado
              </span>
            ) : (
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                Sin verificar
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => void logout()}>
            <LogOut className="size-4" />
            Cerrar sesión
          </Button>
        </div>

        {!emailVerificado ? (
          <div className="space-y-3 rounded-xl border border-border p-4 text-sm">
            <p className="flex items-start gap-2 text-muted-foreground">
              <MailCheck className="mt-0.5 size-4 shrink-0 text-brand" />
              Te hemos enviado un correo de verificación. Confírmalo para poder registrar tu
              tarjeta.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="brand"
                size="sm"
                disabled={ocupado}
                onClick={() => void ejecutar(async () => { await refrescar(); })}
              >
                Ya lo he verificado
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={ocupado}
                onClick={() =>
                  void ejecutar(async () => {
                    await reenviarVerificacion();
                    setAviso("Correo de verificación reenviado.");
                  })
                }
              >
                Reenviar correo
              </Button>
            </div>
            {aviso ? <p className="text-xs text-brand">{aviso}</p> : null}
            {error ? <p className="text-xs text-destructive">{error}</p> : null}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="font-semibold text-foreground">Inicia sesión para continuar</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Verificamos tu correo de Google para que nadie pueda registrar tu tarjeta en su nombre.
        </p>
      </div>

      <Button
        variant="outline"
        className="w-full"
        disabled={ocupado}
        onClick={() =>
          void ejecutar(async () => {
            await loginWithGoogle();
          })
        }
      >
        {ocupado ? <Loader2 className="size-4 animate-spin" /> : null}
        Continuar con Google
      </Button>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {aviso ? <p className="text-sm text-brand">{aviso}</p> : null}
    </div>
  );
}

