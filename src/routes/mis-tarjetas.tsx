import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, Apple, ArrowLeft, CreditCard, Loader2, RefreshCw } from "lucide-react";
import { descargarApplePass } from "@/lib/apple-pass";
import { useCallback, useEffect, useState } from "react";

import { AuthPanel } from "@/components/auth-panel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { getIdToken } from "@/lib/authService";
import { listarMisTarjetas, regenerarEnlaceWallet } from "@/lib/cards.functions";
import saveToGooglePay from "@/assets/save-to-google-pay-es.svg";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/mis-tarjetas")({
  head: () => ({
    meta: [
      { title: "Mis tarjetas BusCyL | Gestiona tus pases de Google Wallet y Apple Wallet" },
      {
        name: "description",
        content:
          "Consulta las tarjetas de transporte BusCyL asociadas a tu cuenta y vuelve a generar el enlace para añadirlas a Google Wallet o Apple Wallet.",
      },
      { property: "og:title", content: "Mis tarjetas BusCyL" },
      {
        property: "og:description",
        content:
          "Gestiona tus tarjetas BusCyL asociadas y recupera el enlace de Google Wallet o Apple Wallet cuando lo necesites.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MisTarjetas,
});

type Tarjeta = {
  numeroTarjeta: string;
  nombreCompleto: string;
  creada: string;
  actualizada: string;
};

function formatearFecha(valor: string) {
  try {
    return new Date(valor).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function MisTarjetas() {
  const { user, emailVerificado, cargando } = useAuth();
  const listo = Boolean(user) && emailVerificado;

  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const [cargandoLista, setCargandoLista] = useState(false);
  const [error, setError] = useState("");
  const [regenerando, setRegenerando] = useState("");
  const [enlaces, setEnlaces] = useState<Record<string, string>>({});
  const [applePases, setApplePases] = useState<Record<string, string>>({});

  const cargar = useCallback(async () => {
    setError("");
    setCargandoLista(true);
    try {
      const idToken = await getIdToken(true);
      const res = await listarMisTarjetas({ data: { idToken } });
      setTarjetas(res.tarjetas);
    } catch (e) {
      console.error(e);
      setError((e as Error)?.message || "No se han podido cargar tus tarjetas.");
    } finally {
      setCargandoLista(false);
    }
  }, []);

  useEffect(() => {
    if (listo) void cargar();
  }, [listo, cargar]);

  async function regenerar(numeroTarjeta: string) {
    setError("");
    setRegenerando(numeroTarjeta);
    try {
      const idToken = await getIdToken(true);
      const res = await regenerarEnlaceWallet({ data: { idToken, numeroTarjeta } });
      setEnlaces((prev) => ({ ...prev, [numeroTarjeta]: res.saveUrl }));
      if (res.applePassBase64) {
        setApplePases((prev) => ({ ...prev, [numeroTarjeta]: res.applePassBase64! }));
      }
    } catch (e) {
      console.error(e);
      setError((e as Error)?.message || "No se ha podido generar el enlace.");
    } finally {
      setRegenerando("");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-brand text-brand-foreground">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-5">
          <img
            src="/buscyl-logo.png"
            alt="Logo BusCyL"
            className="size-10 rounded-lg object-cover"
          />

          <span className="text-sm/5 font-medium opacity-90">
            Junta de Castilla y León · Transporte
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-20 pt-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Volver al inicio
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Mis tarjetas
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Aquí puedes ver las tarjetas BusCyL asociadas a tu cuenta y volver a generar el enlace
          para añadirlas a Google Wallet o Apple Wallet.
        </p>

        {error ? (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}

        {!listo ? (
          <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <AuthPanel />
          </section>
        ) : (
          <section className="mt-8 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Button variant="outline" size="sm" onClick={() => void cargar()} disabled={cargandoLista}>
                {cargandoLista ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <RefreshCw className="size-4" />
                )}
                Actualizar
              </Button>
            </div>

            {cargandoLista && tarjetas.length === 0 ? (
              <div className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card p-10 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Cargando tus tarjetas…
              </div>
            ) : null}

            {!cargandoLista && tarjetas.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
                <p className="font-semibold text-foreground">Aún no tienes tarjetas asociadas</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sube una foto de tu tarjeta BusCyL para asociarla a tu cuenta.
                </p>
                <Button variant="brand" className="mt-5" asChild>
                  <Link to="/">Añadir mi tarjeta</Link>
                </Button>
              </div>
            ) : null}

            {tarjetas.map((t) => (
              <article
                key={t.numeroTarjeta}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                      <CreditCard className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        Tarjeta {t.numeroTarjeta}
                      </p>
                      <p className="text-sm text-muted-foreground">{t.nombreCompleto}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Asociada el {formatearFecha(t.creada)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={regenerando === t.numeroTarjeta}
                    onClick={() => void regenerar(t.numeroTarjeta)}
                  >
                    {regenerando === t.numeroTarjeta ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <RefreshCw className="size-4" />
                    )}
                    Regenerar enlace
                  </Button>
                </div>

                {enlaces[t.numeroTarjeta] ? (
                  <a
                    href={enlaces[t.numeroTarjeta]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block transition-transform hover:scale-[1.02]"
                  >
                    <img src={saveToGooglePay} alt="Guardar en Google Pay" className="h-12 w-auto" />
                  </a>
                ) : null}

                {applePases[t.numeroTarjeta] ? (
                  <div className="mt-3 flex flex-col items-start gap-1">
                    <Button
                      variant="brand"
                      onClick={() => descargarApplePass(applePases[t.numeroTarjeta]!)}
                    >
                      <Apple className="size-4" />
                      Añadir a Apple Wallet
                    </Button>
                    <p className="text-xs text-muted-foreground">Disponible solo en iPhone</p>
                  </div>
                ) : null}
              </article>
            ))}
          </section>
        )}

        {cargando ? null : null}
      </main>

      <SiteFooter />

    </div>
  );
}
