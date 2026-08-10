import { createFileRoute } from "@tanstack/react-router";

import { LegalLayout } from "@/components/legal-layout";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto | BusCyL Wallet" },
      {
        name: "description",
        content:
          "¿Dudas o incidencias al añadir tu tarjeta BusCyL a Google Wallet? Escríbenos con el formulario de contacto de buscylwallet.es.",
      },
      { property: "og:title", content: "Contacto | BusCyL Wallet" },
      {
        property: "og:description",
        content: "Formulario de contacto y datos de soporte de buscylwallet.es.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Contacto,
});

function Contacto() {
  return (
    <LegalLayout title="Contacto">
      <p>
        ¿Tienes dudas, sugerencias o algún problema al añadir tu tarjeta BusCyL a Google Wallet?
        Escríbenos a{" "}
        <a className="underline" href="mailto:hola@buscylwallet.es">
          hola@buscylwallet.es
        </a>{" "}
        o rellena el siguiente formulario.
      </p>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <iframe
          title="Formulario de contacto"
          src="https://docs.google.com/forms/d/e/1FAIpQLSdLCmZai3M8A5fI-8kLm9qXLdQa22maIuM0pKY6MTfymzTs2Q/viewform?embedded=true"
          className="h-[1189px] w-full"
          loading="lazy"
        >
          Cargando…
        </iframe>
      </div>
    </LegalLayout>
  );
}
