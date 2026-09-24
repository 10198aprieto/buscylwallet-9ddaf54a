# BusCyL Wallet

Aplicación web para añadir la **Tarjeta de Transporte BusCyL** a **Google Wallet** a partir de una foto de la tarjeta.

🔗 **App en producción:** [buscylwallet.lovable.app](https://buscylwallet.lovable.app) · [buscylgwallet.vercel.app](https://buscylgwallet.vercel.app)

> Proyecto independiente, no afiliado a la Junta de Castilla y León ni a BusCyL.

---

## Cómo funciona

1. El usuario sube o hace una foto de su tarjeta BusCyL (recuadro rojo "Buscyl", código QR y, debajo, nombre y número de 6 dígitos).
2. **En el navegador**, la app:
   - decodifica el QR con [`jsQR`](https://github.com/cozmo/jsQR),
   - extrae nombre y número de tarjeta con OCR ([`tesseract.js`](https://github.com/naptha/tesseract.js)).
3. Se muestra una vista previa **editable** (nombre y número) para corregir cualquier fallo del OCR.
4. Al confirmar, una **Supabase Edge Function** crea/actualiza el pase genérico en la Google Wallet API y devuelve el enlace **"Añadir a Google Wallet"**.

La imagen de la tarjeta nunca sale del dispositivo: al backend solo se envían `nombreCompleto`, `numeroTarjeta` y `valorQR`.

## Stack

| Capa | Tecnología |
| --- | --- |
| Frontend | React 19, TanStack Start / Router / Query, Vite, Tailwind CSS 4, Radix UI (shadcn/ui) |
| Lectura de tarjeta | jsQR (QR), tesseract.js (OCR) |
| Backend | Supabase Edge Functions (Deno/TypeScript), `jose` para firmar JWT (RS256) |
| Wallet | Google Wallet API (`genericObject`) |
| Hosting | Vercel · Firebase Hosting (opcional) |
| Tooling | TypeScript, ESLint, Prettier, Bun/npm |

## Estructura

```
├── public/        # Assets estáticos
├── src/           # Aplicación React (rutas, componentes, lógica de lectura de tarjeta)
├── supabase/      # Edge Function que genera el pase y el enlace de Google Wallet
├── .lovable/      # Configuración de Lovable
├── firebase.json  # Configuración de Firebase Hosting
├── vercel.json    # Configuración de Vercel
└── vite.config.ts
```

## Requisitos

- Node.js 20+ y npm (o Bun)
- Un proyecto de Supabase
- Cuenta de emisor en la [Google Wallet API](https://developers.google.com/wallet) y una cuenta de servicio de Google Cloud con acceso a ella

## Desarrollo local

```bash
git clone https://github.com/10198aprieto/buscylwallet-9ddaf54a.git
cd buscylwallet-9ddaf54a
npm install
npm run dev
```

Scripts disponibles:

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run build:dev` | Build en modo desarrollo |
| `npm run preview` | Previsualizar el build |
| `npm run lint` | Linter (ESLint) |
| `npm run format` | Formatear con Prettier |

## Configuración

### Frontend

Crea un `.env` local (no lo subas al repositorio) con las claves públicas de tu proyecto de Supabase:

```env
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<tu-clave-publica>
```

### Backend (Supabase Edge Function)

Configura como **secretos de Supabase** (nunca en el código ni en el frontend):

- La clave privada de la cuenta de servicio de Google (JSON de la service account).
- El ID de emisor de Google Wallet y el email de la cuenta de servicio.

```bash
supabase secrets set <NOMBRE_DEL_SECRETO>='<contenido>'
supabase functions deploy <nombre-de-la-funcion>
```

La función recibe `{ nombreCompleto, numeroTarjeta, valorQR }`, y:

1. Construye el `genericObject` (título "Tarjeta de Transporte BusCyL", color `#b9002a`, QR con el número como texto alternativo).
2. Lo inserta en la Google Wallet API, o lo actualiza (`patch`) si ya existe, usando un ID único para evitar duplicados.
3. Firma un JWT "Save to Google Wallet" (RS256) y devuelve `https://pay.google.com/gp/v/save/<jwt>`.

## Despliegue

### Vercel

El proyecto incluye `vercel.json`; basta con importar el repositorio en Vercel y definir las variables de entorno del frontend.

### Firebase Hosting

El build (TanStack Start + Nitro) genera:

- `.output/public` → assets estáticos (los que publica Hosting)
- `.output/server` → runtime SSR de Nitro

```bash
npm install -g firebase-tools
firebase login
firebase use --add        # por defecto: tarjeta-buscyl (.firebaserc)
npm run build
firebase deploy --only hosting
```

> ⚠️ Firebase Hosting solo sirve contenido estático: el backend SSR de `.output/server` **no** se despliega automáticamente. Para SSR real hace falta una integración adicional (Cloud Run, Cloud Functions, etc.).

## Seguridad

- La clave privada de Google **solo** vive como secreto en Supabase.
- No subas `.env` con credenciales al repositorio; usa `.gitignore` y rota cualquier clave que se haya publicado.

## Desarrollado con

Proyecto creado con [Lovable](https://lovable.dev) y sincronizado con este repositorio. Los cambios hechos en Lovable se commitean directamente en `main`, y los cambios en `main` se sincronizan de vuelta a Lovable.
