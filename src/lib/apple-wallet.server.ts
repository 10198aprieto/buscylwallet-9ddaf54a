const API_BASE = "https://api.walletwallet.dev/api/passes";

const BRAND_COLOR = "#ba0c2f";
const LOGO_URL =
  "https://buscylwallet.es/__l5e/assets-v1/aa19bbf2-9fcb-4844-8bce-caec745f4f11/buscyl-logo.png";
const HERO_URL =
  "https://ia903205.us.archive.org/32/items/hero-image-buscyl-2/HERO%20IMAGE%20BUSCYL%20%282%29.png";

type Datos = {
  numeroTarjeta: string;
  nombreCompleto?: string | null;
  valorQR?: string | null;
};

function buildBody({ numeroTarjeta, nombreCompleto, valorQR }: Datos, conImagenes: boolean) {
  const body: Record<string, unknown> = {
    barcodeValue: valorQR && valorQR.length > 0 ? valorQR : numeroTarjeta,
    barcodeFormat: "QR",
    logoText: "BusCyL",
    description: "Tarjeta de Transporte BusCyL",
    backgroundColor: BRAND_COLOR,
    foregroundColor: "#ffffff",
    labelColor: "#ffffff",
    primaryFields: [{ label: "Nº de tarjeta", value: numeroTarjeta }],
    secondaryFields: nombreCompleto
      ? [{ label: "Titular", value: nombreCompleto }]
      : [],
    auxiliaryFields: [
      { label: "Tarjeta de Transporte", value: "Junta de Castilla y León" },
    ],
    backFields: [
      { label: "Titular", value: nombreCompleto ?? "—" },
      { label: "Número de tarjeta BusCyL", value: numeroTarjeta },
      { label: "Web Buscyl", value: "www.buscyl.es" },
      {
        label: "Consulta las rutas bonificadas con Buscyl",
        value:
          "https://archive.org/download/rutasbonificadasbuscyl_202608/Rutas%2Bbonificadas%2B%20%282%29.pdf",
      },
      {
        label: "Contacta a través de",
        value:
          "https://carreterasytransportes.jcyl.es/web/es/contactar-carreteras-transportes.html",
      },
    ],
  };

  if (conImagenes) {
    body["logoURL"] = LOGO_URL;
    body["iconURL"] = LOGO_URL;
    body["thumbnailURL"] = LOGO_URL;
    body["stripURL"] = HERO_URL;
  }

  return body;
}

/**
 * Crea o actualiza el pase de Apple Wallet en WalletWallet y devuelve el .pkpass en base64.
 * Nunca lanza: si algo falla devuelve null para no romper el flujo de Google Wallet.
 */
export async function upsertApplePass(datos: Datos): Promise<string | null> {
  const apiKey = process.env["WALLETWALLET_API_KEY"];
  if (!apiKey) {
    console.error("Falta WALLETWALLET_API_KEY");
    return null;
  }

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: fila } = await supabaseAdmin
      .from("wallet_passes")
      .select("apple_serial_number")
      .eq("numero_tarjeta", datos.numeroTarjeta)
      .maybeSingle();

    const headers = {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    };

    let serial = fila?.apple_serial_number ?? null;

    // Intenta primero con imágenes (plan Pro). Si la API las rechaza, reintenta sin ellas.
    const enviar = async (conImagenes: boolean): Promise<Response> => {
      const body = JSON.stringify(buildBody(datos, conImagenes));
      if (serial) {
        const res = await fetch(`${API_BASE}/${encodeURIComponent(serial)}`, {
          method: "PUT",
          headers,
          body,
        });
        if (res.status !== 404) return res;
        serial = null;
      }
      return fetch(API_BASE, { method: "POST", headers, body });
    };

    let res = await enviar(true);
    if (!res.ok) {
      const detalle = await res.text();
      console.error("WalletWallet (con imágenes) error:", res.status, detalle);
      res = await enviar(false);
    }

    if (!res.ok) {
      console.error("WalletWallet error:", res.status, await res.text());
      return null;
    }

    const json = (await res.json()) as {
      serialNumber?: string;
      applePass?: string;
      pass?: { serialNumber?: string; applePass?: string };
    };
    const nuevoSerial = json.serialNumber ?? json.pass?.serialNumber ?? serial;
    const applePass = json.applePass ?? json.pass?.applePass ?? null;

    if (nuevoSerial && nuevoSerial !== fila?.apple_serial_number) {
      const { error } = await supabaseAdmin
        .from("wallet_passes")
        .upsert(
          { numero_tarjeta: datos.numeroTarjeta, apple_serial_number: nuevoSerial },
          { onConflict: "numero_tarjeta" },
        );
      if (error) console.error("Error guardando wallet_passes:", error);
    }

    return applePass;
  } catch (e) {
    console.error("Error creando el pase de Apple Wallet:", e);
    return null;
  }
}
