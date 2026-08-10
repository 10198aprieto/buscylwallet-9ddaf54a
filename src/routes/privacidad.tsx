import { createFileRoute } from "@tanstack/react-router";

import { LegalLayout } from "@/components/legal-layout";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de privacidad | BusCyL Wallet" },
      {
        name: "description",
        content:
          "Cómo tratamos tus datos personales en buscylwallet.es: responsable, finalidades, plazos, destinatarios y derechos RGPD.",
      },
      { property: "og:title", content: "Política de privacidad | BusCyL Wallet" },
      {
        property: "og:description",
        content: "Tratamiento de datos personales y derechos RGPD en buscylwallet.es.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacidad,
});

function Privacidad() {
  return (
    <LegalLayout title="Política de privacidad">
      <p className="font-medium text-foreground">buscylwallet.es</p>

      <h2>I. Política de privacidad y protección de datos</h2>
      <p>
        Respetando lo establecido en la legislación vigente, este Sitio Web se compromete a adoptar
        las medidas técnicas y organizativas necesarias, según el nivel de seguridad adecuado al
        riesgo de los datos recogidos.
      </p>

      <h3>Leyes que incorpora esta política de privacidad</h3>
      <ul>
        <li>Reglamento (UE) 2016/679, de 27 de abril de 2016 (RGPD).</li>
        <li>Ley Orgánica 3/2018, de 5 de diciembre (LOPD-GDD).</li>
        <li>Real Decreto 1720/2007, de 21 de diciembre (RDLOPD).</li>
        <li>Ley 34/2002, de 11 de julio (LSSI-CE).</li>
      </ul>

      <h3>Responsable del tratamiento</h3>
      <ul>
        <li>Responsable: Mateo Fernández Prieto, NIF 71572693M</li>
        <li>Dirección: C/ San Quince, nº 7, Chalet, 47195 — Arroyo de la Encomienda (Valladolid)</li>
        <li>Teléfono: 644869070</li>
        <li>Email: hola@buscylwallet.es</li>
      </ul>

      <h3>Registro de datos de carácter personal</h3>
      <p>
        Los datos personales recabados mediante los formularios del Sitio Web quedarán incorporados
        y serán tratados con el fin de facilitar, agilizar y cumplir los compromisos establecidos
        entre el Sitio Web y el Usuario, el mantenimiento de la relación que se establezca, o para
        atender una solicitud o consulta. Salvo que sea de aplicación la excepción del artículo 30.5
        del RGPD, se mantiene un registro de actividades de tratamiento.
      </p>

      <h3>Principios aplicables al tratamiento</h3>
      <ul>
        <li>Licitud, lealtad y transparencia.</li>
        <li>Limitación de la finalidad.</li>
        <li>Minimización de datos.</li>
        <li>Exactitud.</li>
        <li>Limitación del plazo de conservación.</li>
        <li>Integridad y confidencialidad.</li>
        <li>Responsabilidad proactiva.</li>
      </ul>

      <h3>Categorías de datos personales</h3>
      <p>
        Se tratan únicamente datos identificativos. En ningún caso se tratan categorías especiales
        de datos personales en el sentido del artículo 9 del RGPD.
      </p>

      <h3>Base legal para el tratamiento</h3>
      <p>
        La base legal es el consentimiento. Se recaba el consentimiento expreso y verificable del
        Usuario para el tratamiento de sus datos personales para uno o varios fines específicos. El
        Usuario podrá retirar su consentimiento en cualquier momento, con la misma facilidad con la
        que lo otorgó. Cuando la cumplimentación de algún campo sea obligatoria por resultar
        imprescindible para la operación, se informará de ello.
      </p>

      <h3>Fines del tratamiento</h3>
      <p>
        Los datos se recaban y gestionan con la finalidad de facilitar, agilizar y cumplir los
        compromisos establecidos entre el Sitio Web y el Usuario, mantener la relación que se
        establezca en los formularios o atender una solicitud o consulta. Igualmente podrán
        utilizarse con finalidad de personalización, operativa y estadística, así como para mejorar
        la calidad, funcionamiento y navegación del Sitio Web.
      </p>

      <h3>Períodos de retención</h3>
      <p>
        Los datos personales solo serán retenidos durante el tiempo mínimo necesario para los fines
        de su tratamiento y, en todo caso, durante un plazo máximo de 24 meses, o hasta que el
        Usuario solicite su supresión.
      </p>

      <h3>Destinatarios de los datos personales</h3>
      <ul>
        <li>Google Ireland Limited, Gordon House, Barrow Street, Dublín 4, Irlanda.</li>
        <li>Lovable Labs Incorporated, Estocolmo, Suecia.</li>
        <li>
          Arsys Internet, S.L.U., C/ Madre de Dios, 21, 26004 Logroño (La Rioja), España, CIF
          B85294916.
        </li>
      </ul>
      <p>
        En caso de que exista la intención de transferir datos personales a un tercer país u
        organización internacional, se informará al Usuario en el momento de la obtención de los
        datos, así como de la existencia o ausencia de decisión de adecuación de la Comisión.
      </p>

      <h3>Datos personales de menores de edad</h3>
      <p>
        Solo los mayores de 14 años podrán otorgar su consentimiento para el tratamiento de sus
        datos personales. En el caso de menores de 14 años, será necesario el consentimiento de los
        padres o tutores.
      </p>

      <h3>Secreto y seguridad de los datos personales</h3>
      <p>
        Se adoptan las medidas técnicas y organizativas necesarias según el nivel de seguridad
        adecuado al riesgo, de forma que se garantice la seguridad de los datos y se evite su
        destrucción, pérdida o alteración accidental o ilícita, o el acceso no autorizado. El Sitio
        Web cuenta con certificado SSL, de modo que la transmisión de datos se realiza de forma
        cifrada.
      </p>
      <p>
        No obstante, al no poder garantizarse la inexpugnabilidad de internet, el Responsable se
        compromete a comunicar al Usuario sin dilación indebida cualquier violación de seguridad de
        los datos personales que pueda entrañar un alto riesgo para sus derechos y libertades. Los
        datos serán tratados como confidenciales.
      </p>

      <h3>Derechos del Usuario</h3>
      <ul>
        <li>Derecho de acceso.</li>
        <li>Derecho de rectificación.</li>
        <li>Derecho de supresión («derecho al olvido»).</li>
        <li>Derecho a la limitación del tratamiento.</li>
        <li>Derecho a la portabilidad de los datos.</li>
        <li>Derecho de oposición.</li>
        <li>
          Derecho a no ser objeto de una decisión basada únicamente en el tratamiento automatizado,
          incluida la elaboración de perfiles.
        </li>
      </ul>
      <p>
        El Usuario podrá ejercitar sus derechos mediante comunicación escrita dirigida al
        Responsable con la referencia «RGPD-buscylwallet.es», indicando: nombre y apellidos y copia
        del DNI (o documento válido en derecho que acredite la identidad, y en su caso la
        representación); petición con los motivos específicos de la solicitud o información a la que
        se quiere acceder; domicilio a efectos de notificaciones; fecha y firma del solicitante; y
        todo documento que acredite la petición.
      </p>
      <p>
        Dirección postal: C/ San Quince, nº 7, Chalet, 47195 — Arroyo de la Encomienda (Valladolid).
        Correo electrónico: hola@buscylwallet.es.
      </p>

      <h3>Enlaces a sitios web de terceros</h3>
      <p>
        El Sitio Web puede incluir enlaces a páginas web de terceros no operadas por el Responsable.
        Los titulares de dichos sitios disponen de sus propias políticas de protección de datos,
        siendo ellos responsables de sus propios ficheros y prácticas de privacidad.
      </p>

      <h3>Reclamaciones ante la autoridad de control</h3>
      <p>
        Si el Usuario considera que existe un problema o infracción de la normativa vigente en el
        tratamiento de sus datos, tiene derecho a la tutela judicial efectiva y a presentar una
        reclamación ante una autoridad de control. En España, la Agencia Española de Protección de
        Datos (
        <a
          className="underline"
          href="https://www.aepd.es/"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.aepd.es
        </a>
        ).
      </p>

      <h2>II. Aceptación y cambios en esta política de privacidad</h2>
      <p>
        Es necesario que el Usuario haya leído y esté conforme con las condiciones sobre protección
        de datos contenidas en esta Política de Privacidad y que acepte el tratamiento de sus datos
        personales. El uso del Sitio Web implicará la aceptación de esta Política de Privacidad.
      </p>
      <p>
        El Responsable se reserva el derecho a modificar esta Política de Privacidad, de acuerdo con
        su propio criterio o motivado por un cambio legislativo, jurisprudencial o doctrinal. Los
        cambios no serán notificados de forma explícita al Usuario, por lo que se recomienda
        consultar esta página de forma periódica.
      </p>

      <p className="pt-4 text-xs">Documento actualizado el 10/08/2026.</p>
    </LegalLayout>
  );
}
