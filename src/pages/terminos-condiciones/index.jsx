import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

const TerminosCondiciones = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border-light shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Heart" size={20} color="white" />
              </div>
              <span className="font-heading font-bold text-xl text-text-primary">
                AdoptaEspaña
              </span>
            </button>

            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors duration-200"
            >
              <Icon name="ArrowLeft" size={20} />
              <span>Volver</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-surface rounded-xl shadow-sm border border-border-light p-8">
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
            Términos y Condiciones de Uso
          </h1>
          <p className="text-sm text-text-secondary mb-8">
            Última actualización: 30 de agosto de 2023
          </p>

          <div className="prose prose-slate max-w-none">
            {/* Identificación del responsable */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                1. Identificación del Responsable
              </h2>
              <p className="text-text-secondary mb-4">
                En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico, el Responsable del sitio web expone sus datos identificativos:
              </p>
              <div className="bg-primary-50 border-l-4 border-primary p-4 mb-4">
                <p className="text-text-primary mb-2">
                  <strong>Denominación social:</strong> Oh My Pawz S.L.
                </p>
                <p className="text-text-primary mb-2">
                  <strong>NIF:</strong> B56178767
                </p>
                <p className="text-text-primary mb-2">
                  <strong>Domicilio social:</strong> Calle Luis Martinez 21, 39005 Santander
                </p>
                <p className="text-text-primary mb-2">
                  <strong>Teléfono:</strong> 615 033 513
                </p>
                <p className="text-text-primary">
                  <strong>Email:</strong> info@paw-unique.com
                </p>
              </div>
            </section>

            {/* Objeto */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                2. Objeto
              </h2>
              <p className="text-text-secondary mb-4">
                El sitio web tiene como objeto facilitar al público, en general, el conocimiento de las actividades que desarrolla Oh My Pawz S.L., así como de los servicios que presta. El acceso y uso del sitio web atribuye la condición de usuario del sitio web (en adelante, el "Usuario") e implica la aceptación plena y sin reservas de todas y cada una de las disposiciones incluidas en este Aviso Legal.
              </p>
              <p className="text-text-secondary mb-4">
                Oh My Pawz S.L. se reserva el derecho de modificar cualquier tipo de información que pudiera aparecer en el sitio web, sin que exista obligación de preavisar o poner en conocimiento de los Usuarios dichas obligaciones, entiendiéndose como suficiente la publicación en el sitio web.
              </p>
            </section>

            {/* Condiciones de uso */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                3. Condiciones de Uso
              </h2>
              <p className="text-text-secondary mb-4">
                El Usuario se compromete a utilizar el sitio web, los contenidos y servicios de conformidad con la Ley, el presente Aviso Legal, las buenas costumbres y el orden público. Del mismo modo, el Usuario se obliga a no utilizar el sitio web o los servicios que se presten a través del mismo con fines o efectos ilícitos o contrarios al contenido del presente Aviso Legal, lesivos de los intereses o derechos de terceros, o que de cualquier forma pueda dañar, inutilizar o deteriorar el sitio web o sus servicios o impedir un normal disfrute del sitio web por otros Usuarios.
              </p>
              <p className="text-text-secondary mb-4">
                El Usuario se obliga a no transmitir, difundir o poner a disposición de terceros cualquier tipo de material contenido en el sitio web, tales como informaciones, textos, datos, contenidos, mensajes, gráficos, dibujos, archivos de sonido y/o imagen, fotografías, software, logotipos, marcas, iconos, tecnología, enlaces, diseño gráfico y códigos fuente, o cualquier otro material al que tuviera acceso en su condición de Usuario del sitio web, sin que esta enumeración tenga carácter limitativo.
              </p>
            </section>

            {/* Responsabilidad */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                4. Responsabilidad
              </h2>
              <p className="text-text-secondary mb-4">
                Oh My Pawz S.L. no se hace responsable de la información y contenidos almacenados en foros, redes sociales o cualesquier otro medio que permita a terceros publicar contenidos de forma independiente en la página web del prestador. Sin embargo, teniendo en cuenta los arts. 11 y 16 de la LSSICE, Oh My Pawz S.L. se compromete a la retirada o en su caso bloqueo de aquellos contenidos que pudieran afectar o contravenir la legislación nacional o internacional, derechos de terceros o la moral y el orden público.
              </p>
              <p className="text-text-secondary mb-4">
                Tampoco Oh My Pawz S.L. se responsabilizará de los daños y perjuicios que se produzcan por fallos o malas configuraciones del software instalado en el ordenador del internauta. Se excluye toda responsabilidad por cualquier daño y perjuicio de toda naturaleza que pudiera deberse al conocimiento que pudieran tener terceros de la clase, condiciones, características y circunstancias del uso que los Usuarios hacen del sitio web.
              </p>
              <p className="text-text-secondary mb-4">
                En todo caso, Oh My Pawz S.L. excluye cualquier responsabilidad por los daños y perjuicios de toda naturaleza que pudieran deberse a la presencia de virus o a la presencia de otros elementos lesivos en los contenidos que puedan producir alteraciones en el sistema informático, documentos electrónicos o ficheros de los Usuarios.
              </p>
            </section>

            {/* Propiedad intelectual e industrial */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                5. Propiedad Intelectual e Industrial
              </h2>
              <p className="text-text-secondary mb-4">
                Todos los contenidos del sitio web, entendiendo por éstos a título meramente enunciativo los textos, fotografías, gráficos, imágenes, iconos, tecnología, software, links y demás contenidos audiovisuales o sonoros, así como su diseño gráfico y códigos fuente, son propiedad intelectual de Oh My Pawz S.L., sin que puedan entenderse cedidos al Usuario ninguno de los derechos de explotación reconocidos por la normativa vigente en materia de propiedad intelectual sobre los mismos.
              </p>
              <p className="text-text-secondary mb-4">
                Las marcas, nombres comerciales o signos distintivos son titularidad de Oh My Pawz S.L., sin que pueda entenderse que el acceso al sitio web atribuya al Usuario derecho alguno sobre las citadas marcas, nombres comerciales y/o signos distintivos.
              </p>
              <p className="text-text-secondary mb-4">
                El Usuario reconoce que la reproducción, distribución, comercialización, transformación y, en general, cualquier otra forma de explotación, por cualquier procedimiento, de todo o parte de los contenidos de esta página web constituye una infracción de los derechos de propiedad intelectual y/o industrial del titular de la página web o del titular de los mismos.
              </p>
            </section>

            {/* Enlaces */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                6. Enlaces
              </h2>
              <p className="text-text-secondary mb-4">
                El sitio web de Oh My Pawz S.L. puede incluir enlaces a sitios web de terceros. Toda vez que Oh My Pawz S.L. no tiene control alguno sobre tales sitios web, en ningún caso será responsable de los contenidos de algún sitio enlazado ni garantiza la disponibilidad técnica, exactitud, veracidad, validez o legalidad de sitios ajenos a su propiedad a los que se pueda acceder por medio de los enlaces.
              </p>
              <p className="text-text-secondary mb-4">
                Asimismo, tampoco garantizará la utilidad de dichos enlaces, ni será responsable de los contenidos o servicios a los que pueda acceder el Usuario por medio de los enlaces, ni de la operatividad o disponibilidad de las páginas web enlazadas.
              </p>
              <p className="text-text-secondary mb-4">
                En el supuesto de que el sitio web permitiera a los Usuarios incluir enlaces hacia otros sitios de Internet, Oh My Pawz S.L. no asume ninguna responsabilidad derivada de la conexión o contenidos de los enlaces a los que hagan referencia los Usuarios y no presta conformidad a los mismos. Será responsabilidad del Usuario el uso y control de los enlaces que introduzca.
              </p>
            </section>

            {/* Protección de datos */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                7. Protección de Datos
              </h2>
              <p className="text-text-secondary mb-4">
                Oh My Pawz S.L. se compromete a cumplir con su obligación de secreto con respecto a los datos de carácter personal y su deber de tratarlos con confidencialidad. A estos efectos, adoptará las medidas necesarias para evitar su alteración, pérdida, tratamiento o acceso no autorizado.
              </p>
              <p className="text-text-secondary mb-4">
                Para más información, puede consultar nuestra <a href="/politica-privacidad" className="text-primary hover:underline">Política de Privacidad</a>.
              </p>
            </section>

            {/* Legislación aplicable */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                8. Legislación Aplicable y Jurisdicción
              </h2>
              <p className="text-text-secondary mb-4">
                Las presentes Condiciones Generales se rigen por la legislación española. Para la resolución de cualquier controversia relativa a la interpretación o aplicación de las presentes Condiciones Generales, las partes se someten a la jurisdicción de los Juzgados y Tribunales de Santander (Cantabria), con renuncia expresa a cualquier otro fuero que pudiera corresponderles.
              </p>
            </section>

            {/* Condiciones específicas para protectoras */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                9. Condiciones Específicas para Protectoras y Refugios
              </h2>
              <p className="text-text-secondary mb-4">
                Las protectoras y refugios que utilicen la plataforma se comprometen a:
              </p>
              <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
                <li>Proporcionar información veraz y actualizada sobre los animales en adopción.</li>
                <li>Cumplir con toda la normativa aplicable en materia de bienestar animal.</li>
                <li>Realizar seguimientos responsables de las adopciones.</li>
                <li>No utilizar la plataforma para fines comerciales no autorizados.</li>
                <li>Responder de manera diligente a las solicitudes de adopción.</li>
              </ul>
            </section>

            {/* Condiciones específicas para profesionales */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                10. Condiciones Específicas para Profesionales del Sector
              </h2>
              <p className="text-text-secondary mb-4">
                Los profesionales (veterinarios, educadores, peluquerías, etc.) que ofrezcan sus servicios a través de la plataforma se comprometen a:
              </p>
              <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
                <li>Contar con las licencias y autorizaciones necesarias para ejercer su actividad.</li>
                <li>Proporcionar servicios de calidad y respeto hacia los animales.</li>
                <li>Mantener actualizada la información de su perfil profesional.</li>
                <li>Cumplir con la normativa aplicable a su sector de actividad.</li>
                <li>Respetar los precios y condiciones publicadas en su perfil.</li>
              </ul>
            </section>

            {/* Modificaciones */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                11. Modificaciones
              </h2>
              <p className="text-text-secondary mb-4">
                Oh My Pawz S.L. se reserva el derecho de efectuar sin previo aviso las modificaciones que considere oportunas en su portal, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se presten a través de la misma como la forma en la que éstos aparezcan presentados o localizados en sus servidores.
              </p>
              <p className="text-text-secondary mb-4">
                La vigencia de las citadas condiciones será la de su exposición y estarán vigentes hasta que sean modificadas por otras debidamente publicadas.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border-light mt-16 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-text-secondary">
          <p>© {new Date().getFullYear()} Oh My Pawz S.L. - AdoptaEspaña. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default TerminosCondiciones;