import { createFileRoute } from "@tanstack/react-router";

import { LegalLayout } from "@/components/legal-layout";

export const Route = createFileRoute("/aviso-legal")({
  head: () => ({
    meta: [
      { title: "Aviso legal y condiciones de uso | BusCyL Wallet" },
      {
        name: "description",
        content:
          "Aviso legal y condiciones generales de uso de buscylwallet.es, proyecto independiente para añadir la tarjeta BusCyL a Google Wallet.",
      },
      { property: "og:title", content: "Aviso legal | BusCyL Wallet" },
      {
        property: "og:description",
        content: "Condiciones generales de uso y titularidad del sitio buscylwallet.es.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AvisoLegal,
});

function AvisoLegal() {
  return (
    <LegalLayout title="Aviso legal y condiciones generales de uso">
      <p className="font-medium text-foreground">buscylwallet.es</p>

      <h2>0. Independencia y titularidad de las marcas</h2>
      <p>
        Este sitio web <strong>no está afiliado, asociado ni respaldado oficialmente</strong> por la
        Junta de Castilla y León ni por ninguna administración pública. Se trata de un proyecto
        independiente desarrollado por un particular.
      </p>
      <p>
        Los nombres, marcas y logotipos «Junta de Castilla y León», «BusCyL», «Google Wallet»,
        «Google Pay» y cualesquiera otros que aparezcan en el Sitio Web pertenecen a sus respectivos
        titulares y se citan aquí con fines meramente informativos y descriptivos, sin que su uso
        implique relación, patrocinio o aprobación alguna por parte de dichos titulares.
      </p>

      <h2>I. Información general</h2>
      <p>
        En cumplimiento del deber de información de la Ley 34/2002, de 11 de julio, de Servicios de
        la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se facilitan los
        siguientes datos:
      </p>
      <ul>
        <li>Titular: Mateo Fernández Prieto</li>
        <li>NIF: 71572693M</li>
        <li>Dirección: C/ San Quince, nº 7, Chalet, 47195 — Arroyo de la Encomienda (Valladolid)</li>
        <li>Teléfono: 644869070</li>
        <li>Email: hola@buscylwallet.es</li>
      </ul>

      <h2>II. Términos y condiciones generales de uso</h2>
      <h3>El objeto de las condiciones: el Sitio Web</h3>
      <p>
        El objeto de las presentes Condiciones Generales de Uso (en adelante, Condiciones) es
        regular el acceso y la utilización del Sitio Web, entendiendo por tal la apariencia externa
        de los interfaces de pantalla, el árbol de navegación y todos los elementos integrados en
        ellos (Contenidos), así como los servicios o recursos en línea que se ofrezcan (Servicios).
      </p>
      <p>
        El titular se reserva la facultad de modificar en cualquier momento, y sin aviso previo, la
        presentación y configuración del Sitio Web y de los Contenidos y Servicios incorporados. El
        Usuario reconoce y acepta que en cualquier momento puedan interrumpirse, desactivarse o
        cancelarse cualquiera de estos elementos o el acceso a los mismos.
      </p>
      <p>
        El acceso al Sitio Web tiene carácter libre y, por regla general, gratuito, salvo en lo
        relativo al coste de conexión a través de la red de telecomunicaciones del proveedor de
        acceso contratado por el Usuario. La utilización de algunos Contenidos o Servicios podrá
        requerir el registro previo del Usuario.
      </p>

      <h3>El Usuario</h3>
      <p>
        El acceso, la navegación y el uso del Sitio Web confieren la condición de Usuario, por lo
        que se aceptan, desde que se inicia la navegación, todas las Condiciones aquí establecidas y
        sus ulteriores modificaciones, sin perjuicio de la normativa legal de obligado cumplimiento
        aplicable. Se recomienda al Usuario leerlas cada vez que visite el Sitio Web.
      </p>
      <p>El Usuario asume su responsabilidad de realizar un uso correcto del Sitio Web, que incluye:</p>
      <ul>
        <li>
          Un uso de la información, Contenidos, Servicios y datos que no sea contrario a estas
          Condiciones, la Ley, la moral o el orden público, ni lesione derechos de terceros o el
          funcionamiento del Sitio Web.
        </li>
        <li>
          La veracidad y licitud de las informaciones aportadas en los formularios del Sitio Web. El
          Usuario notificará de forma inmediata cualquier hecho que permita el uso indebido de dicha
          información (robo, extravío o acceso no autorizado a identificadores y/o contraseñas) para
          proceder a su cancelación.
        </li>
      </ul>
      <p>
        El mero acceso al Sitio Web no supone entablar ningún tipo de relación comercial. El Usuario
        declara ser mayor de edad y disponer de capacidad jurídica suficiente para vincularse por
        estas Condiciones; el Sitio Web no se dirige a menores de edad.
      </p>
      <p>
        El Sitio Web está dirigido principalmente a Usuarios residentes en España y no se asegura el
        cumplimiento de legislaciones de otros países. El acceso desde otros lugares se realiza bajo
        la propia responsabilidad del Usuario.
      </p>

      <h2>III. Acceso y navegación: exclusión de garantías y responsabilidad</h2>
      <p>
        No se garantiza la continuidad, disponibilidad ni utilidad del Sitio Web, de los Contenidos
        o de los Servicios. Se hará todo lo posible por su buen funcionamiento, pero no se
        responsabiliza ni garantiza que el acceso sea ininterrumpido o esté libre de error.
      </p>
      <p>
        Tampoco se responsabiliza de que el contenido o software accesible a través del Sitio Web
        esté libre de error o cause daños al sistema informático del Usuario. En ningún caso se será
        responsable por pérdidas, daños o perjuicios de cualquier tipo derivados del acceso,
        navegación y uso del Sitio Web, incluidos los provocados por la introducción de virus, ni de
        caídas, interrupciones o defectos en las telecomunicaciones.
      </p>

      <h2>IV. Política de enlaces</h2>
      <p>
        El Sitio Web puede poner a disposición de los Usuarios medios de enlace (links, banners,
        botones), directorios y motores de búsqueda que permiten acceder a sitios web de terceros,
        con el único objeto de facilitar la búsqueda y el acceso a la información disponible en
        Internet, sin que ello suponga sugerencia, recomendación o invitación a visitarlos.
      </p>
      <p>
        No se ofrecen ni comercializan los productos y/o servicios disponibles en dichos sitios
        enlazados, ni se garantiza su disponibilidad técnica, exactitud, veracidad, validez o
        legalidad. No se revisa ni controla el contenido de otros sitios web ni se asume
        responsabilidad alguna por los daños y perjuicios que pudieran derivarse de su acceso o uso.
      </p>
      <p>Quien realice un hipervínculo hacia este Sitio Web deberá saber que:</p>
      <ul>
        <li>
          No se permite la reproducción —total o parcial— de ninguno de los Contenidos y/o Servicios
          sin autorización expresa.
        </li>
        <li>
          No se permite ninguna manifestación falsa, inexacta o incorrecta sobre el Sitio Web ni
          sobre sus Contenidos y/o Servicios.
        </li>
        <li>
          Salvo el propio hipervínculo, el sitio de origen no contendrá ningún elemento de este
          Sitio Web protegido como propiedad intelectual, salvo autorización expresa.
        </li>
        <li>
          El establecimiento del hipervínculo no implica la existencia de relación alguna, ni el
          conocimiento y aceptación de los contenidos, servicios y/o actividades del otro sitio, y
          viceversa.
        </li>
      </ul>

      <h2>V. Propiedad intelectual e industrial</h2>
      <p>
        El titular, por sí o como parte cesionaria, es titular de todos los derechos de propiedad
        intelectual e industrial del Sitio Web y de los elementos contenidos en el mismo (imágenes,
        sonido, audio, vídeo, software, textos, marcas o logotipos propios, combinaciones de
        colores, estructura y diseño, selección de materiales usados, programas de ordenador
        necesarios para su funcionamiento, etc.), sin perjuicio de las marcas de terceros citadas en
        el apartado 0.
      </p>
      <p>
        Todos los derechos reservados. Quedan expresamente prohibidas la reproducción, distribución
        y comunicación pública, incluida su puesta a disposición, de la totalidad o parte de los
        contenidos con fines comerciales, en cualquier soporte y por cualquier medio técnico, sin
        autorización. El Usuario podrá visualizar, imprimir o almacenar los elementos del Sitio Web
        exclusivamente para su uso personal, y no podrá suprimir, alterar o manipular ningún
        dispositivo de protección o sistema de seguridad instalado.
      </p>
      <p>
        Si el Usuario o un tercero considera que algún Contenido vulnera derechos de propiedad
        intelectual, deberá comunicarlo de inmediato a través de los datos de contacto del apartado
        de Información general.
      </p>

      <h2>VI. Acciones legales, legislación aplicable y jurisdicción</h2>
      <p>
        El titular se reserva la facultad de presentar las acciones civiles o penales que considere
        necesarias por la utilización indebida del Sitio Web y sus Contenidos o por el
        incumplimiento de estas Condiciones.
      </p>
      <p>
        La relación entre el Usuario y el titular se regirá por la normativa vigente y de aplicación
        en el territorio español. Cualquier controversia relativa a la interpretación y/o aplicación
        de estas Condiciones se someterá a la jurisdicción ordinaria, ante los jueces y tribunales
        que correspondan conforme a derecho.
      </p>

      <p className="pt-4 text-xs">Documento actualizado el 10/08/2026.</p>
    </LegalLayout>
  );
}
