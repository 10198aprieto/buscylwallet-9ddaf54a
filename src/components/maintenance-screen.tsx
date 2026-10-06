import { useRouter } from "@tanstack/react-router";
import { Loader2, Wrench } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { adminLogin } from "@/lib/maintenance.functions";

export function MaintenanceScreen() {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ocupado, setOcupado] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOcupado(true);
    try {
      const r = await adminLogin({ data: { usuario, password } });
      if (r.ok) await router.invalidate();
      else setError("Usuario o contraseña incorrectos.");
    } catch {
      setError("No se ha podido iniciar sesión.");
    } finally {
      setOcupado(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <img src="/buscyl-logo.png" alt="BusCyL" className="mb-6 h-16 w-auto" />
      <Wrench className="mb-4 size-8 text-brand" />
      <h1 className="text-2xl font-semibold text-foreground">
        La web no está disponible por mantenimiento
      </h1>
      <p className="mt-2 text-muted-foreground">Disculpen las molestias.</p>

      <div className="mt-12 w-full max-w-xs">
        {abierto ? (
          <form onSubmit={entrar} className="space-y-3 text-left">
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Usuario"
              autoComplete="username"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
            <input
              type="password"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Contraseña"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="brand" className="w-full" disabled={ocupado}>
              {ocupado ? <Loader2 className="size-4 animate-spin" /> : null}
              Entrar
            </Button>
            {error ? <p className="text-xs text-destructive">{error}</p> : null}
          </form>
        ) : (
          <button
            className="text-xs text-muted-foreground underline"
            onClick={() => setAbierto(true)}
          >
            Acceso administrador
          </button>
        )}
      </div>
    </div>
  );
}
