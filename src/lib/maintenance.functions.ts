import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";

const COOKIE = "buscyl_admin";

async function firmar(): Promise<string> {
  const user = process.env["MAINTENANCE_ADMIN_USER"] ?? "";
  const pass = process.env["MAINTENANCE_ADMIN_PASSWORD"] ?? "";
  const data = new TextEncoder().encode(`maint:${user}:${pass}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** true si el visitante ha iniciado sesión como administrador. */
export const getMaintenanceAccess = createServerFn({ method: "GET" }).handler(async () => {
  const token = getCookie(COOKIE);
  return { permitido: Boolean(token) && token === (await firmar()) };
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ usuario: z.string().max(200), password: z.string().max(200) }).parse(d))
  .handler(async ({ data }) => {
    const user = process.env["MAINTENANCE_ADMIN_USER"];
    const pass = process.env["MAINTENANCE_ADMIN_PASSWORD"];
    if (!user || !pass || data.usuario.trim() !== user || data.password !== pass) {
      return { ok: false };
    }
    setCookie(COOKIE, await firmar(), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return { ok: true };
  });
