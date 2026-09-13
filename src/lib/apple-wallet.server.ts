const API_BASE = "https://api.walletwallet.dev/api/passes";


function buildBody(numeroTarjeta: string) {
  return {
    barcodeValue: numeroTarjeta,
    barcodeFormat: "QR",
    logoText: "BusCyL",
    description: "Tarjeta de Transporte BusCyL",
    backgroundColor: "#b9002a",
    foregroundColor: "#ffffff",
    labelColor: "#ffffff",
    primaryFields: [{ label: "Nº de tarjeta", value: numeroTarjeta }],
    backFields: [
      { label: "Web Buscyl", value: "www.buscyl.es" },
      {
        label: "Consulta las rutas bonificadas con Buscyl",
        value:
          "https://archive.org/download/rutasbonificadasbuscyl_202608/Rutas%2Bbonificadas%2B%20%282%29.pdf",
      },
      { label: "Número de tarjeta BusCyL", value: numeroTarjeta },
      {
        label: "Contacta a través de",
        value:
          "https://carreterasytransportes.jcyl.es/web/es/contactar-carreteras-transportes.html",
      },
    ],
  };
}

/**
 * Crea o actualiza el pase de Apple Wallet en WalletWallet y devuelve el .pkpass en base64.
 * Nunca lanza: si algo falla devuelve null para no romper el flujo de Google Wallet.
 */
export async function upsertApplePass(numeroTarjeta: string): Promise<string | null> {
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
      .eq("numero_tarjeta", numeroTarjeta)
      .maybeSingle();

    const headers = {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    };
    const body = JSON.stringify(buildBody(numeroTarjeta));

    let serial = fila?.apple_serial_number ?? null;
    let res: Response;

    if (serial) {
      res = await fetch(`${API_BASE}/${encodeURIComponent(serial)}`, {
        method: "PUT",
        headers,
        body,
      });
      if (res.status === 404) {
        serial = null;
        res = await fetch(API_BASE, { method: "POST", headers, body });
      }
    } else {
      res = await fetch(API_BASE, { method: "POST", headers, body });
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
          { numero_tarjeta: numeroTarjeta, apple_serial_number: nuevoSerial },
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
