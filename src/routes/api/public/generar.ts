import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const tarjetaSchema = z.string().trim().regex(/^\d{6}$/, "El número de tarjeta debe tener 6 dígitos");

const crearSchema = z.object({
  numeroTarjeta: tarjetaSchema,
  nombreCompleto: z.string().trim().min(3).max(120),
  valorQR: z.string().trim().min(1).max(2000),
});

const cors = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "content-type, x-api-key, authorization",
  "access-control-allow-methods": "GET, POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...cors },
  });
}

function autorizado(request: Request, url: URL): boolean {
  const esperado = process.env["BUSCYL_API_KEY"];
  if (!esperado) return false;
  const enviado =
    request.headers.get("x-api-key") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    url.searchParams.get("key") ??
    "";
  if (enviado.length !== esperado.length) return false;
  let diff = 0;
  for (let i = 0; i < esperado.length; i++) diff |= enviado.charCodeAt(i) ^ esperado.charCodeAt(i);
  return diff === 0;
}

export const Route = createFileRoute("/api/public/generar")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),

      // GET /api/public/generar?tarjeta=123456[&redirect=1]
      GET: async ({ request }) => {
        const url = new URL(request.url);
        if (!autorizado(request, url)) return json({ error: "No autorizado" }, 401);

        const parsed = tarjetaSchema.safeParse(url.searchParams.get("tarjeta") ?? "");
        if (!parsed.success) return json({ error: "Número de tarjeta no válido" }, 400);
        const numeroTarjeta = parsed.data;

        try {
          const { buildSaveUrlForExistingCard } = await import("@/lib/wallet.server");
          const saveUrl = await buildSaveUrlForExistingCard(numeroTarjeta);

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data: fila } = await supabaseAdmin
            .from("card_claims")
            .select("nombre_completo")
            .eq("card_number", numeroTarjeta)
            .maybeSingle();

          if (url.searchParams.get("redirect")) {
            return new Response(null, { status: 302, headers: { location: saveUrl, ...cors } });
          }
          return json({
            numeroTarjeta,
            nombreCompleto: fila?.nombre_completo ?? null,
            saveUrl,
          });
        } catch (e) {
          const mensaje = e instanceof Error ? e.message : "Error inesperado";
          return json({ error: mensaje }, 404);
        }
      },

      // POST /api/public/generar  { numeroTarjeta, nombreCompleto, valorQR }
      POST: async ({ request }) => {
        const url = new URL(request.url);
        if (!autorizado(request, url)) return json({ error: "No autorizado" }, 401);

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ error: "JSON no válido" }, 400);
        }
        const parsed = crearSchema.safeParse(body);
        if (!parsed.success) {
          return json({ error: parsed.error.issues[0]?.message ?? "Datos no válidos" }, 400);
        }

        try {
          const { upsertPassAndBuildSaveUrl } = await import("@/lib/wallet.server");
          const saveUrl = await upsertPassAndBuildSaveUrl(parsed.data);
          return json({ numeroTarjeta: parsed.data.numeroTarjeta, saveUrl });
        } catch (e) {
          const mensaje = e instanceof Error ? e.message : "Error inesperado";
          return json({ error: mensaje }, 502);
        }
      },
    },
  },
});
