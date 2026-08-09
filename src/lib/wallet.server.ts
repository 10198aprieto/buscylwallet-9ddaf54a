import { SignJWT, importPKCS8 } from "jose";

const ISSUER_ID = "3388000000023186156";
const CLASS_SUFFIX = "buscyl_class";

function getCredentials() {
  const issuerId = process.env["GOOGLE_ISSUER_ID"] || ISSUER_ID;

  // Preferred: full service-account JSON in GOOGLE_SERVICE_ACCOUNT_KEY.
  const saJson = process.env["GOOGLE_SERVICE_ACCOUNT_KEY"];
  if (saJson && saJson.trim().startsWith("{")) {
    const parsed = JSON.parse(saJson.trim()) as {
      client_email?: string;
      private_key?: string;
    };
    if (parsed.client_email && parsed.private_key) {
      return {
        clientEmail: parsed.client_email,
        privateKey: parsed.private_key.replace(/\\n/g, "\n").trim(),
        issuerId,
      };
    }
  }

  // Fallback: separate email + private key secrets.
  const clientEmail = process.env["GOOGLE_CLIENT_EMAIL"];
  const rawKey = process.env["GOOGLE_PRIVATE_KEY"];
  if (!clientEmail || !rawKey) {
    throw new Error("Faltan las credenciales de la cuenta de servicio de Google.");
  }
  let privateKey = rawKey;
  const trimmed = rawKey.trim();
  if (trimmed.startsWith("{")) {
    const parsed = JSON.parse(trimmed) as { private_key?: string };
    privateKey = parsed.private_key ?? "";
  }
  privateKey = privateKey.replace(/\\n/g, "\n").trim();
  return { clientEmail, privateKey, issuerId };
}

export async function ensureGenericClass(): Promise<{ created: boolean; classId: string }> {
  const { issuerId } = getCredentials();
  const classId = `${issuerId}.${CLASS_SUFFIX}`;
  const token = await getAccessToken();
  const base = "https://walletobjects.googleapis.com/walletobjects/v1/genericClass";

  const existing = await fetch(`${base}/${encodeURIComponent(classId)}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  if (existing.ok) return { created: false, classId };
  if (existing.status !== 404) {
    console.error("Wallet class lookup error:", await existing.text());
    throw new Error("No se ha podido consultar la clase del pase en Google Wallet.");
  }

  const genericClass = {
    id: classId,
    issuerName: "BusCyL - Junta de Castilla y León",
    reviewStatus: "UNDER_REVIEW",
    classTemplateInfo: {
      cardTemplateOverride: {
        cardRowTemplateInfos: [
          {
            twoItems: {
              startItem: {
                firstValue: { fields: [{ fieldPath: "object.subheader" }] },
              },
              endItem: {
                firstValue: { fields: [{ fieldPath: "object.barcode.alternateText" }] },
              },
            },
          },
        ],
      },
    },
  };

  const created = await fetch(base, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(genericClass),
  });
  if (!created.ok && created.status !== 409) {
    console.error("Wallet class insert error:", await created.text());
    throw new Error("No se ha podido crear la clase del pase en Google Wallet.");
  }
  return { created: true, classId };
}


async function getKey(privateKey: string) {
  return importPKCS8(privateKey, "RS256");
}

async function getAccessToken(): Promise<string> {
  const { clientEmail, privateKey } = getCredentials();
  const key = await getKey(privateKey);
  const now = Math.floor(Date.now() / 1000);

  const assertion = await new SignJWT({
    scope: "https://www.googleapis.com/auth/wallet_object.issuer",
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(clientEmail)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(key);

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("Google OAuth error:", detail);
    throw new Error("No se ha podido autenticar con Google Wallet.");
  }
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

export function buildGenericObject(input: {
  nombreCompleto: string;
  numeroTarjeta: string;
  valorQR: string;
  issuerId: string;
}) {
  return {
    id: `${input.issuerId}.${input.numeroTarjeta}`,
    classId: `${input.issuerId}.${CLASS_SUFFIX}`,
    logo: {
      sourceUri: {
        uri: "https://buscylwallet.lovable.app/__l5e/assets-v1/aa19bbf2-9fcb-4844-8bce-caec745f4f11/buscyl-logo.png",
      },
      contentDescription: {
        defaultValue: { language: "es-ES", value: "Logo BusCyL" },
      },
    },
    cardTitle: {
      defaultValue: { language: "es-ES", value: "Tarjeta de Transporte BusCyL" },
    },
    subheader: {
      defaultValue: { language: "es-ES", value: "Pasajero" },
    },
    header: {
      defaultValue: { language: "es-ES", value: input.nombreCompleto },
    },
    barcode: {
      type: "QR_CODE",
      value: input.valorQR,
      alternateText: input.numeroTarjeta,
    },
    hexBackgroundColor: "#b9002a",
    heroImage: {
      sourceUri: {
        uri: "https://ia903205.us.archive.org/32/items/hero-image-buscyl-2/HERO%20IMAGE%20BUSCYL%20%282%29.png",
      },
      contentDescription: {
        defaultValue: { language: "es-ES", value: "Imagen tarjeta BusCyL" },
      },
    },
  };
}

export async function upsertPassAndBuildSaveUrl(input: {
  nombreCompleto: string;
  numeroTarjeta: string;
  valorQR: string;
}): Promise<string> {
  const { clientEmail, privateKey, issuerId } = getCredentials();
  const genericObject = buildGenericObject({ ...input, issuerId });

  await ensureGenericClass();
  const token = await getAccessToken();
  const base = "https://walletobjects.googleapis.com/walletobjects/v1/genericObject";
  const objectId = encodeURIComponent(genericObject.id);

  const existing = await fetch(`${base}/${objectId}`, {
    headers: { authorization: `Bearer ${token}` },
  });

  if (existing.ok) {
    const patch = await fetch(`${base}/${objectId}`, {
      method: "PATCH",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(genericObject),
    });
    if (!patch.ok) {
      console.error("Wallet patch error:", await patch.text());
      throw new Error("No se ha podido actualizar el pase en Google Wallet.");
    }
  } else if (existing.status === 404) {
    const insert = await fetch(base, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(genericObject),
    });
    if (!insert.ok) {
      console.error("Wallet insert error:", await insert.text());
      throw new Error("No se ha podido crear el pase en Google Wallet.");
    }
  } else {
    console.error("Wallet lookup error:", await existing.text());
    throw new Error("No se ha podido contactar con Google Wallet.");
  }

  const key = await getKey(privateKey);
  const saveJwt = await new SignJWT({
    iss: clientEmail,
    aud: "google",
    typ: "savetowallet",
    origins: [],
    payload: { genericObjects: [genericObject] },
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuedAt()
    .sign(key);

  return `https://pay.google.com/gp/v/save/${saveJwt}`;
}

/** Vuelve a generar el enlace "Guardar en Google Wallet" de un pase ya existente. */
export async function buildSaveUrlForExistingCard(numeroTarjeta: string): Promise<string> {
  const { clientEmail, privateKey, issuerId } = getCredentials();
  const objectId = `${issuerId}.${numeroTarjeta}`;
  const token = await getAccessToken();

  const res = await fetch(
    `https://walletobjects.googleapis.com/walletobjects/v1/genericObject/${encodeURIComponent(objectId)}`,
    { headers: { authorization: `Bearer ${token}` } },
  );
  if (res.status === 404) {
    throw new Error("Este pase ya no existe en Google Wallet. Vuelve a subir la foto de la tarjeta.");
  }
  if (!res.ok) {
    console.error("Wallet lookup error:", await res.text());
    throw new Error("No se ha podido contactar con Google Wallet.");
  }
  const genericObject = (await res.json()) as Record<string, unknown>;

  const key = await getKey(privateKey);
  const saveJwt = await new SignJWT({
    iss: clientEmail,
    aud: "google",
    typ: "savetowallet",
    origins: [],
    payload: { genericObjects: [{ id: genericObject["id"], classId: genericObject["classId"] }] },
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuedAt()
    .sign(key);

  return `https://pay.google.com/gp/v/save/${saveJwt}`;
}
