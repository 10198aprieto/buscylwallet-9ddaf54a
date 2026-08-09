import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Loader2, Upload, ScanLine, CheckCircle2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createWalletPass } from "@/lib/wallet.functions";
import saveToGooglePay from "@/assets/save-to-google-pay-es.svg";
import buscylLogo from "@/assets/buscyl-logo.png.asset.json";
import { AuthPanel } from "@/components/auth-panel";
import { useAuth } from "@/contexts/auth-context";
import { getIdToken } from "@/lib/authService";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BusCyL en Google Wallet | Añade tu tarjeta de transporte" },
      {
        name: "description",
        content:
          "Sube una foto de tu Tarjeta de Transporte BusCyL y añádela a Google Wallet en segundos, con lectura automática del QR y de tus datos.",
      },
      { property: "og:title", content: "BusCyL en Google Wallet" },
      {
        property: "og:description",
        content:
          "Digitaliza tu Tarjeta de Transporte BusCyL y llévala siempre en el móvil con Google Wallet.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Estado = "inicio" | "procesando" | "revision" | "generando" | "listo";

async function leerQR(imageData: ImageData): Promise<string | null> {
  const jsQR = (await import("jsqr")).default;
  const res = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: "attemptBoth",
  });
  return res?.data ?? null;
}

function extraerDatos(texto: string) {
  const lineas = texto
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let numeroTarjeta = "";
  for (let i = lineas.length - 1; i >= 0; i--) {
    const m = lineas[i]?.match(/\b(\d{6})\b/);
    if (m?.[1]) {
      numeroTarjeta = m[1];
      break;
    }
  }

  const candidatos = lineas.filter((l) => {
    const limpio = l.replace(/[^A-ZÁÉÍÓÚÑ ]/gi, "").trim();
    return (
      limpio.length >= 6 &&
      /^[A-ZÁÉÍÓÚÑ\s]+$/.test(l.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s]/g, "").trim()) &&
      !/BUSCYL|JUNTA|CASTILLA|LEON|LEÓN|TARJETA|TRANSPORTE/i.test(l)
    );
  });
  const nombreCompleto = (candidatos.sort((a, b) => b.length - a.length)[0] ?? "")
    .replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

  return { nombreCompleto, numeroTarjeta };
}

function Index() {
  const [estado, setEstado] = useState<Estado>("inicio");
  const [progreso, setProgreso] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [numero, setNumero] = useState("");
  const [valorQR, setValorQR] = useState("");
  const [saveUrl, setSaveUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, emailVerificado } = useAuth();
  const puedeContinuar = Boolean(user) && emailVerificado;

  async function procesarArchivo(file: File) {
    setError("");
    setEstado("procesando");
    setProgreso("Cargando la imagen…");

    try {
      const url = URL.createObjectURL(file);
      setPreview(url);

      const img = new Image();
      img.src = url;
      await img.decode();

      const maxLado = 1600;
      const escala = Math.min(1, maxLado / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * escala);
      canvas.height = Math.round(img.height * escala);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No se ha podido procesar la imagen.");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      setProgreso("Leyendo el código QR…");
      const qr = await leerQR(imageData);

      setProgreso("Reconociendo tus datos…");
      let datos = { nombreCompleto: "", numeroTarjeta: "" };
      try {
        const Tesseract = await import("tesseract.js");
        const { data } = await Tesseract.recognize(canvas, "spa");
        datos = extraerDatos(data.text ?? "");
      } catch {
        // OCR opcional: el usuario puede rellenar los campos a mano.
      }

      if (!qr) {
        setError(
          "No se ha podido leer el QR. Inténtalo con mejor luz, sin reflejos y con la tarjeta bien enfocada.",
        );
        setEstado("inicio");
        return;
      }

      setValorQR(qr);
      setNombre(datos.nombreCompleto);
      setNumero(datos.numeroTarjeta);
      setEstado("revision");
    } catch (e) {
      console.error(e);
      setError("No hemos podido procesar la imagen. Prueba con otra foto.");
      setEstado("inicio");
    }
  }

  async function confirmar() {
    setError("");
    if (nombre.trim().length < 3) {
      setError("Revisa el nombre y apellidos.");
      return;
    }
    if (!/^\d{6}$/.test(numero.trim())) {
      setError("Revisa el número de tarjeta: deben ser 6 dígitos.");
      return;
    }
    if (!puedeContinuar) {
      setError("Inicia sesión con tu correo verificado para registrar la tarjeta.");
      return;
    }
    setEstado("generando");
    try {
      const idToken = await getIdToken(true);
      const res = await createWalletPass({
        data: {
          nombreCompleto: nombre.trim().toUpperCase(),
          numeroTarjeta: numero.trim(),
          valorQR,
          idToken,
        },
      });
      setSaveUrl(res.saveUrl);
      setEstado("listo");
    } catch (e) {
      console.error(e);
      const mensaje = (e as Error)?.message ?? "";
      setError(
        /tarjeta ya|acaba de ser|verificar tu correo|sesión ha caducado|Debes iniciar/i.test(mensaje)
          ? mensaje
          : "No se ha podido generar el pase. Inténtalo de nuevo en unos minutos.",
      );
      setEstado("revision");
    }
  }

  function reiniciar() {
    setEstado("inicio");
    setPreview(null);
    setNombre("");
    setNumero("");
    setValorQR("");
    setSaveUrl("");
    setError("");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-brand text-brand-foreground">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-5">
          <img
            src={buscylLogo.url}
            alt="Logo BusCyL"
            className="size-10 rounded-lg object-cover"
          />
          <span className="text-sm/5 font-medium opacity-90">
            Junta de Castilla y León · Transporte
          </span>
          <Link
            to="/mis-tarjetas"
            className="ml-auto rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium hover:bg-white/25"
          >
            Mis tarjetas
          </Link>

        </div>
      </header>


      <main className="mx-auto max-w-3xl px-5 pb-20 pt-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Añade tu Tarjeta BusCyL a Google Wallet
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Sube una foto de tu tarjeta. Leemos el código QR y tus datos en tu propio navegador y
          creamos el pase digital para tu móvil.
        </p>

        {error ? (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}

        <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          {estado === "inicio" ? (
            <div className="flex flex-col items-center gap-5 py-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-brand-soft text-brand">
                <ScanLine className="size-7" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Sube o fotografía tu tarjeta</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Formato JPG o PNG. Asegúrate de que el QR se vea completo.
                </p>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void procesarArchivo(file);
                }}
              />
              <Button variant="brand" size="lg" onClick={() => inputRef.current?.click()}>
                <Upload className="size-4" />
                Seleccionar imagen
              </Button>
            </div>
          ) : null}

          {estado === "procesando" ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <Loader2 className="size-8 animate-spin text-brand" />
              <p className="text-sm font-medium text-foreground">{progreso}</p>
              <p className="text-xs text-muted-foreground">
                Todo el análisis ocurre en tu dispositivo.
              </p>
            </div>
          ) : null}

          {estado === "revision" || estado === "generando" ? (
            <div className="grid gap-6 sm:grid-cols-[160px_1fr]">
              {preview ? (
                <img
                  src={preview}
                  alt="Vista previa de la tarjeta BusCyL subida"
                  className="h-40 w-full rounded-xl border border-border object-cover sm:h-auto"
                />
              ) : null}
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Comprueba los datos y corrígelos si hace falta.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre y apellidos</Label>
                  <Input
                    id="nombre"
                    value={nombre}
                    maxLength={120}
                    placeholder="NOMBRE APELLIDO APELLIDO"
                    onChange={(e) => setNombre(e.target.value.toUpperCase())}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero">Número de tarjeta (6 dígitos)</Label>
                  <Input
                    id="numero"
                    value={numero}
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="123456"
                    onChange={(e) => setNumero(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  />
                </div>
                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <AuthPanel />
                </div>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Button
                    variant="brand"
                    onClick={confirmar}
                    disabled={estado === "generando" || !puedeContinuar}
                  >
                    {estado === "generando" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Generando pase…
                      </>
                    ) : (
                      "Confirmar y crear pase"
                    )}
                  </Button>
                  <Button variant="outline" onClick={reiniciar} disabled={estado === "generando"}>
                    Cambiar imagen
                  </Button>
                </div>
                {!puedeContinuar ? (
                  <p className="text-xs text-muted-foreground">
                    Inicia sesión y verifica tu correo para registrar la tarjeta a tu nombre.
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {estado === "listo" ? (
            <div className="flex flex-col items-center gap-5 py-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-brand-soft text-brand">
                <CheckCircle2 className="size-7" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Tu pase está listo</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {nombre} · Tarjeta {numero}
                </p>
              </div>
              <a
                href={saveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-transform hover:scale-[1.02]"
              >
                <img
                  src={saveToGooglePay}
                  alt="Guardar en Google Pay"
                  className="h-14 w-auto"
                />
              </a>
              <Button variant="ghost" onClick={reiniciar}>
                Añadir otra tarjeta
              </Button>
            </div>
          ) : null}
        </section>

        <p className="mt-6 text-xs text-muted-foreground">
          Tus datos solo se envían para generar el pase de Google Wallet. La imagen no sale de tu
          dispositivo.
        </p>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-3xl px-5 py-6 text-center text-xs text-muted-foreground">
          © 2026 Mateo Fernández Prieto. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
