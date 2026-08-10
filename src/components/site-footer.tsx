import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-3xl px-5 py-8 text-center text-xs text-muted-foreground">
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link to="/aviso-legal" className="hover:text-foreground">
            Aviso legal
          </Link>
          <span aria-hidden>·</span>
          <Link to="/privacidad" className="hover:text-foreground">
            Política de privacidad
          </Link>
          <span aria-hidden>·</span>
          <Link to="/cookies" className="hover:text-foreground">
            Política de cookies
          </Link>
          <span aria-hidden>·</span>
          <Link to="/contacto" className="hover:text-foreground">
            Contacto
          </Link>
        </nav>
        <p className="mt-4">© 2026 Mateo Fernández Prieto. Todos los derechos reservados.</p>
        <p className="mt-2">
          Proyecto independiente sin afiliación oficial con la Junta de Castilla y León.
        </p>
      </div>
    </footer>
  );
}
