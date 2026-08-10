import { createFileRoute } from "@tanstack/react-router";

import { LegalLayout } from "@/components/legal-layout";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Política de cookies | BusCyL Wallet" },
      {
        name: "description",
        content:
          "Información sobre las cookies propias y de terceros utilizadas en buscylwallet.es y cómo deshabilitarlas o eliminarlas.",
      },
      { property: "og:title", content: "Política de cookies | BusCyL Wallet" },
      {
        property: "og:description",
        content: "Cookies utilizadas en buscylwallet.es y cómo gestionarlas.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Cookies,
});

function Cookies() {
  return (
    <LegalLayout title="Política de cookies">
      <p className="font-medium text-foreground">buscylwallet.es</p>

      <p>
        El acceso a este Sitio Web puede implicar la utilización de cookies. Las cookies son
        pequeñas cantidades de información que se almacenan en el navegador utilizado por cada
        Usuario —en los distintos dispositivos que pueda utilizar para navegar— para que el servidor
        recuerde cierta información que posteriormente y únicamente el servidor que la implementó
        leerá. Las cookies facilitan la navegación, la hacen más amigable y no dañan el dispositivo.
      </p>
      <p>
        Las cookies son procedimientos automáticos de recogida de información relativa a las
        preferencias determinadas por el Usuario durante su visita al Sitio Web, con el fin de
        reconocerlo como Usuario, personalizar su experiencia y ayudar a identificar y resolver
        errores.
      </p>
      <p>
        La información recabada puede incluir la fecha y hora de las visitas, las páginas
        visionadas, el tiempo de permanencia y los sitios visitados justo antes y después. Ninguna
        cookie permite contactar con el número de teléfono del Usuario ni con cualquier otro medio
        de contacto personal, ni extraer información del disco duro o robar información personal.
      </p>
      <p>
        Las cookies que permiten identificar a una persona se consideran datos personales, por lo
        que les resulta de aplicación la Política de Privacidad. Para su utilización será necesario
        el consentimiento del Usuario, comunicado mediante una decisión afirmativa y positiva, antes
        del tratamiento inicial, revocable y documentado. La gestión del consentimiento se realiza
        mediante el banner de Cookiebot, desde el que puede aceptar, rechazar o cambiar sus
        preferencias en cualquier momento.
      </p>

      <h2>Cookies propias</h2>
      <p>
        Son las cookies enviadas al dispositivo del Usuario y gestionadas exclusivamente por este
        Sitio Web para su mejor funcionamiento. La información recabada se emplea para mejorar la
        calidad del Sitio Web, su Contenido y la experiencia del Usuario, permitiendo reconocerlo
        como visitante recurrente y adaptar el contenido a sus preferencias.
      </p>

      <h2>Cookies de terceros</h2>
      <p>
        Son cookies utilizadas y gestionadas por entidades externas que prestan servicios a este
        Sitio Web. Sus principales objetivos son la obtención de estadísticas de acceso y el
        análisis de la información de navegación, es decir, cómo interactúa el Usuario con el Sitio
        Web.
      </p>
      <p>
        La información obtenida se refiere, por ejemplo, al número de páginas visitadas, el idioma,
        el lugar desde el que accede el Usuario, el número de Usuarios que acceden, la frecuencia y
        reincidencia de las visitas, el tiempo de visita, el navegador, el operador o el tipo de
        dispositivo. Esta información se recopila de forma anónima y se elaboran informes de
        tendencias sin identificar a usuarios individuales.
      </p>
      <ul>
        <li>
          Google Analytics:{" "}
          <a
            className="underline"
            href="https://developers.google.com/analytics"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://developers.google.com/analytics
          </a>
        </li>
        <li>
          Cookiebot (gestión del consentimiento):{" "}
          <a
            className="underline"
            href="https://www.cookiebot.com/es/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            política de privacidad de Cookiebot
          </a>
        </li>
      </ul>
      <p>
        Las entidades encargadas del suministro de cookies podrán ceder esta información a terceros,
        siempre y cuando lo exija la ley o sea un tercero el que procese esta información para
        dichas entidades.
      </p>

      <h2>Deshabilitar, rechazar y eliminar cookies</h2>
      <p>
        El Usuario puede deshabilitar, rechazar y eliminar las cookies —total o parcialmente—
        instaladas en su dispositivo mediante la configuración de su navegador (Chrome, Firefox,
        Safari, Edge, etc.). Los procedimientos para rechazar y eliminar cookies pueden diferir de
        un navegador a otro, por lo que el Usuario debe acudir a las instrucciones facilitadas por
        su propio navegador. En caso de rechazar el uso de cookies, podrá seguir usando el Sitio
        Web, si bien podrá tener limitada la utilización de algunas prestaciones.
      </p>

      <p className="pt-4 text-xs">Documento actualizado el 10/08/2026.</p>
    </LegalLayout>
  );
}
