import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

const PoliticaPrivacidad = () => {
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
            Política de Privacidad
          </h1>
          <p className="text-sm text-text-secondary mb-8">
            Última actualización: 30 de agosto de 2023
          </p>

          <div className="prose prose-slate max-w-none">
            {/* Introducción */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                Protección de Datos
              </h2>
              <p className="text-text-secondary mb-4">
                De conformidad con las normativas de protección de datos, le facilitamos la siguiente información del tratamiento:
              </p>
              <div className="bg-primary-50 border-l-4 border-primary p-4 mb-4">
                <p className="text-text-primary mb-2">
                  <strong>Responsable:</strong> OH MY PAWZ, S.L.
                </p>
                <p className="text-text-primary mb-2">
                  <strong>NIF:</strong> B56178767
                </p>
                <p className="text-text-primary mb-2">
                  <strong>Dirección:</strong> Calle Luis Martínez, 21 - 39005 Santander (Cantabria)
                </p>
                <p className="text-text-primary mb-2">
                  <strong>Teléfono:</strong> 615 033 513
                </p>
                <p className="text-text-primary">
                  <strong>Email:</strong> info@paw-unique.com
                </p>
              </div>
            </section>

            {/* Información completa del tratamiento */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                Información Completa del Tratamiento
              </h2>
              <p className="text-text-secondary mb-4">
                <strong>OH MY PAWZ, S.L.</strong> es el Responsable del tratamiento de los datos personales del Interesado y le informa de que estos datos se tratarán de conformidad con lo dispuesto en el Reglamento (UE) 2016/679, de 27 de abril (GDPR), y la Ley Orgánica 3/2018, de 5 de diciembre (LOPDGDD), por lo que se le facilita la siguiente información del tratamiento:
              </p>
            </section>

            {/* Fines y legitimación */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                Fines y Legitimación del Tratamiento
              </h2>
              <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
                <li>
                  <strong>Por interés legítimo del responsable</strong> (GDPR, art. 6.1.f): mantener una relación comercial con el interesado.
                </li>
                <li>
                  <strong>Por consentimiento del interesado</strong> (GDPR, art. 6.1.a): el envío de comunicaciones de productos o servicios.
                </li>
              </ul>
            </section>

            {/* Criterios de conservación */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                Criterios de Conservación de los Datos
              </h2>
              <p className="text-text-secondary mb-4">
                Se conservarán durante no más tiempo del necesario para mantener el fin del tratamiento o existan prescripciones legales que dictaminen su custodia y cuando ya no sea necesario para ello, se suprimirán con medidas de seguridad adecuadas para garantizar la anonimización de los datos o la destrucción total de los mismos.
              </p>
            </section>

            {/* Comunicación de datos */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                Comunicación de los Datos
              </h2>
              <p className="text-text-secondary mb-4">
                No se comunicarán los datos a terceros, salvo obligación legal.
              </p>
            </section>

            {/* Derechos del interesado */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                Derechos que Asisten al Interesado
              </h2>
              <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
                <li>Derecho a retirar el consentimiento en cualquier momento.</li>
                <li>Derecho de acceso, rectificación, portabilidad y supresión de sus datos y de limitación u oposición a su tratamiento.</li>
                <li>Derecho a presentar una reclamación ante la Autoridad de control (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.aepd.es</a>) si considera que el tratamiento no se ajusta a la normativa vigente.</li>
              </ul>

              <div className="bg-secondary-50 border-l-4 border-secondary p-4">
                <p className="text-text-primary mb-2">
                  <strong>Datos de contacto para ejercer sus derechos:</strong>
                </p>
                <p className="text-text-primary mb-1">OH MY PAWZ, S.L.</p>
                <p className="text-text-primary mb-1">Calle Luis Martínez, 21 - 39005 Santander (Cantabria)</p>
                <p className="text-text-primary">E-mail: info@paw-unique.com</p>
              </div>
            </section>

            {/* Consentimiento para publicidad */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                Consentimiento para el Envío de Publicidad (Newsletter)
              </h2>
              <p className="text-text-secondary mb-4">
                En cumplimiento de lo previsto en el artículo 21 de la Ley 34/2002 de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI), solicitamos su consentimiento para la suscripción y envío de nuestra newsletter.
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Fines y legitimación del tratamiento
              </h3>
              <p className="text-text-secondary mb-4">
                Envío de comunicaciones de productos o servicios a través del Boletín de Noticias al que se ha suscrito con el consentimiento del interesado (art. 6.1.a GDPR).
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Criterios de conservación
              </h3>
              <p className="text-text-secondary mb-4">
                Se conservarán durante no más tiempo del necesario para mantener el fin del tratamiento o mientras existan prescripciones legales que dictaminen su custodia y cuando ya no sea necesario para ello, se suprimirán con medidas de seguridad adecuadas para garantizar la anonimización de los datos o la destrucción total de los mismos.
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Comunicación de los datos
              </h3>
              <p className="text-text-secondary mb-4">
                No se comunicarán los datos a terceros, salvo obligación legal.
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Derechos que asisten al Interesado
              </h3>
              <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
                <li>Derecho a retirar el consentimiento en cualquier momento.</li>
                <li>Derecho de acceso, rectificación, portabilidad y supresión de sus datos, y de limitación u oposición a su tratamiento.</li>
                <li>Derecho a presentar una reclamación ante la Autoridad de control (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.aepd.es</a>) si considera que el tratamiento no se ajusta a la normativa vigente.</li>
              </ul>
            </section>

            {/* Correo electrónico */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                Correo Electrónico y Publicidad
              </h2>
              
              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Aviso Legal
              </h3>
              <p className="text-text-secondary mb-4">
                Este mensaje y sus archivos adjuntos van dirigidos exclusivamente a su destinatario, pudiendo contener información confidencial sometida a secreto profesional. No está permitida su comunicación, reproducción o distribución sin la autorización expresa de OH MY PAWZ, S.L. Si usted no es el destinatario final, por favor, elimínelo e infórmenos por esta vía.
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Protección de Datos
              </h3>
              <p className="text-text-secondary mb-4">
                De conformidad con lo dispuesto en el Reglamento (UE) 2016/679, de 27 de abril (GDPR), y la Ley Orgánica 3/2018, de 5 de diciembre (LOPDGDD), le informamos de que los datos personales y la dirección de correo electrónico del interesado, se tratarán bajo la responsabilidad de OH MY PAWZ, S.L. por un interés legítimo y para el envío de comunicaciones sobre nuestros productos y servicios, y se conservarán mientras ninguna de las partes se oponga a ello. Los datos no se comunicarán a terceros, salvo obligación legal.
              </p>
              <p className="text-text-secondary mb-4">
                Le informamos de que puede ejercer los derechos de acceso, rectificación, portabilidad y supresión de sus datos y los de limitación y oposición a su tratamiento dirigiéndose a Calle Luis Martínez, 21 - 39005 Santander (Cantabria). E-mail: info@paw-unique.com. Si considera que el tratamiento no se ajusta a la normativa vigente, podrá presentar una reclamación ante la autoridad de control en <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.aepd.es</a>.
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Publicidad
              </h3>
              <p className="text-text-secondary mb-4">
                En cumplimiento de lo previsto en el artículo 21 de la Ley 34/2002 de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSICE), si usted no desea recibir más información sobre nuestros productos y/o servicios, puede darse de baja enviando un correo electrónico a info@paw-unique.com, indicando en el Asunto "BAJA" o "NO ENVIAR".
              </p>
            </section>

            {/* Derecho de desistimiento */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                Derecho de Desistimiento
              </h2>
              <p className="text-text-secondary mb-4">
                Podrá ejercer el derecho de desistimiento dentro del período de 14 días establecidos por ley a partir del día siguiente de la fecha de un contrato de servicios o del día de la recepción de un producto.
              </p>
              <p className="text-text-secondary mb-4">
                De conformidad con el artículo 102 y siguientes del Real Decreto Legislativo 1/2007, de 16 de noviembre, por el que se aprueba el texto refundido de la Ley General para la Defensa de los Consumidores y Usuarios y otras leyes complementarias, le comunicamos que puede desistir del contrato dentro del término establecido, para lo cual deberá ponerse en contacto mediante los datos de contacto facilitados.
              </p>

              <div className="bg-accent-50 border-l-4 border-accent p-4">
                <p className="text-text-primary mb-2">
                  <strong>Para ejercer su derecho de desistimiento, contacte con:</strong>
                </p>
                <p className="text-text-primary mb-1">OH MY PAWZ, S.L.</p>
                <p className="text-text-primary mb-1">NIF: B56178767</p>
                <p className="text-text-primary mb-1">Calle Luis Martínez, 21 - 39005 Santander (Cantabria)</p>
                <p className="text-text-primary mb-1">Teléfono: 615 033 513</p>
                <p className="text-text-primary">Email: mabbn2003@yahoo.es</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border-light mt-16 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-text-secondary">
          <p>© {new Date().getFullYear()} OH MY PAWZ, S.L. - AdoptaEspaña. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default PoliticaPrivacidad;
