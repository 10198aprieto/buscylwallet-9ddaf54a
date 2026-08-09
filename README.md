# BusCyL Wallet Bridge

Quiero una aplicación web sencilla y con buen diseño para añadir la "Tarjeta de Transporte BusCyL" a Google Wallet.

FLUJO DE USUARIO:
1. El usuario sube o hace una foto de su tarjeta BusCyL (una imagen con: recuadro rojo "Buscyl" arriba, un código QR grande en el centro, y debajo el nombre completo y un número de tarjeta de 6 dígitos).
2. La app procesa la imagen en el navegador:
   - Decodifica el QR con una librería JS (usa "jsqr" o "zxing-js") para extraer el valor del código QR.
   - Extrae el texto (nombre y apellidos, y el número de 6 dígitos debajo del QR) usando OCR en el navegador con "tesseract.js". El nombre está en mayúsculas, el número de tarjeta son 6 dígitos justo debajo.
3. Muestra al usuario una vista previa editable con: "Nombre y apellidos" y "Número de tarjeta", para que pueda corregir manualmente si el OCR falla antes de continuar.
4. Al confirmar, la app llama a un backend seguro (Supabase Edge Function) que genera el objeto del pase y devuelve un enlace "Añadir a Google Wallet".

BACKEND (Supabase Edge Function, en Deno/TypeScript):
- Recibe { nombreCompleto, numeroTarjeta, valorQR }.
- La clave privada de la cuenta de servicio de Google (formato JSON de service account) se guarda como variable de entorno secreta (nunca en el código ni en el frontend).
- Genera un JWT firmado con esa clave privada (algoritmo RS256) para autenticar contra la Google Wallet API.
- Construye el objeto del pase genérico ("genericObject") de Google Wallet con esta plantilla, sustituyendo los valores dinámicos:

{
  "id": "3388000000023186156.<numeroTarjeta>",
  "classId": "3388000000023186156.buscyl_class",
  "logo": {
    "sourceUri": {
      "uri": "https://archive.org/download/buscyl-wallet/buscyl%20logo%20app%20-%202.png"
    },
    "contentDescription": {
      "defaultValue": { "language": "es-ES", "value": "Logo BusCyL" }
    }
  },
  "cardTitle": {
    "defaultValue": { "language": "es-ES", "value": "Tarjeta de Transporte BusCyL" }
  },
  "subheader": {
    "defaultValue": { "language": "es-ES", "value": "Pasajero" }
  },
  "header": {
    "defaultValue": { "language": "es-ES", "value": "<NOMBRE_COMPLETO>" }
  },
  "barcode": {
    "type": "QR_CODE",
    "value": "<VALOR_QR>",
    "alternateText": "<NUMERO_TARJETA>"
  },
  "hexBackgroundColor": "#b9002a",
  "heroImage": {
    "sourceUri": {
      "uri": "https://ia903205.us.archive.org/32/items/hero-image-buscyl-2/HERO%20IMAGE%20BUSCYL%20%282%29.png"
    },
    "contentDescription": {
      "defaultValue": { "language": "es-ES", "value": "Imagen tarjeta BusCyL" }
    }
  }
}

- Inserta o actualiza este objeto en la Google Wallet API (endpoint genericobject, método insert o patch si ya existe, usando el id "<ISSUER_ID>.<numeroTarjeta>" como identificador único para evitar duplicados si el usuario repite el proceso).
- Genera un JWT "Save to Google Wallet" firmado (con "iss" = email de la cuenta de servicio, "aud" = "google", "typ" = "savetowallet", incluyendo el genericObject en "payload.genericObjects") y devuelve al frontend la URL: https://pay.google.com/gp/v/save/<JWT>

FRONTEND:
- Al recibir la URL, muestra el botón oficial "Add to Google Wallet" que enlaza a esa URL.
- Diseño limpio, en español, con los colores corporativos de BusCyL (rojo #b9002a) y de la Junta de Castilla y León.
- Maneja errores con mensajes claros (ej. "No se ha podido leer el QR, inténtalo con mejor luz" o "Revisa el número de tarjeta").

DATOS FIJOS A USAR EN EL BACKEND:
- ID de emisor de Google Wallet: 3388000000023186156
- Email cuenta de servicio: buscyl-agregator@arroyobus.iam.gserviceaccount.com
- (La clave privada la subiré yo manualmente como secreto en las variables de entorno del proyecto, no la incluyas en el código)

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://buscylwallet.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bda7cd60-7561-43c4-a20e-046df5c152ad).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
