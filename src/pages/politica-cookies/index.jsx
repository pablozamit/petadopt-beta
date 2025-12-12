import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

const PoliticaCookies = () => {
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
            Política de Cookies
          </h1>
          <p className="text-sm text-text-secondary mb-8">
            Última actualización: 30 de agosto de 2023
          </p>

          <div className="prose prose-slate max-w-none">
            {/* Información sobre Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                Información sobre Cookies
              </h2>
              <p className="text-text-secondary mb-4">
                Conforme con la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico (LSSI), en relación con el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, General de Protección de Datos (GDPR) y la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos y Garantía de los Derechos Digitales (LOPDGDD), es obligado obtener el consentimiento expreso del usuario de todas las páginas web que usan cookies prescindibles, antes de que este navegue por ellas.
              </p>
            </section>

            {/* ¿Qué son las cookies? */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                ¿Qué son las Cookies?
              </h2>
              <p className="text-text-secondary mb-4">
                Las cookies y otras tecnologías similares tales como local shared objects, flash cookies o píxeles, son herramientas empleadas por los servidores Web para almacenar y recuperar información acerca de sus visitantes, así como para ofrecer un correcto funcionamiento del sitio.
              </p>
              <p className="text-text-secondary mb-4">
                Mediante el uso de estos dispositivos se permite al servidor Web recordar algunos datos concernientes al usuario, como sus preferencias para la visualización de las páginas de ese servidor, nombre y contraseña, productos que más le interesan, etc.
              </p>
            </section>

            {/* Cookies afectadas por la normativa */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                Cookies Afectadas por la Normativa y Cookies Exceptuadas
              </h2>
              <p className="text-text-secondary mb-4">
                Según la directiva de la UE, las cookies que requieren el consentimiento informado por parte del usuario son las cookies de analítica y las de publicidad y afiliación, quedando exceptuadas las de carácter técnico y las necesarias para el funcionamiento del sitio web o la prestación de servicios expresamente solicitados por el usuario.
              </p>
            </section>

            {/* Tipos de cookies según finalidad */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                Tipos de Cookies según la Finalidad
              </h2>
              
              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Cookies técnicas y funcionales
              </h3>
              <p className="text-text-secondary mb-4">
                Son aquellas que permiten al usuario la navegación a través de una página web, plataforma o aplicación y la utilización de las diferentes opciones o servicios que en ella existan.
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Cookies analíticas
              </h3>
              <p className="text-text-secondary mb-4">
                Son aquellas que permiten al responsable de las mismas el seguimiento y análisis del comportamiento de los usuarios de los sitios web a los que están vinculadas. La información recogida mediante este tipo de cookies se utiliza en la medición de la actividad de los sitios web, aplicación o plataforma y para la elaboración de perfiles de navegación de los usuarios de dichos sitios, aplicaciones y plataformas, con el fin de introducir mejoras en función del análisis de los datos de uso que hacen los usuarios del servicio.
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Cookies publicitarias
              </h3>
              <p className="text-text-secondary mb-4">
                Son aquellas que permiten la gestión, de la forma más eficaz posible, de los espacios publicitarios que, en su caso, el editor haya incluido en una página web, aplicación o plataforma desde la que presta el servicio solicitado en base a criterios como el contenido editado o la frecuencia en la que se muestran los anuncios.
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Cookies de publicidad comportamental
              </h3>
              <p className="text-text-secondary mb-4">
                Recogen información sobre las preferencias y elecciones personales del usuario (retargeting) para permitir la gestión, de la forma más eficaz posible, de los espacios publicitarios que, en su caso, el editor haya incluido en una página web, aplicación o plataforma desde la que presta el servicio solicitado.
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Cookies sociales
              </h3>
              <p className="text-text-secondary mb-4">
                Son establecidas por las plataformas de redes sociales en los servicios para permitirle compartir contenido con sus amigos y redes. Las plataformas de medios sociales tienen la capacidad de rastrear su actividad en línea fuera de los Servicios. Esto puede afectar al contenido y los mensajes que ve en otros servicios que visita.
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Cookies de afiliados
              </h3>
              <p className="text-text-secondary mb-4">
                Permiten hacer un seguimiento de las visitas procedentes de otras webs, con las que el sitio web establece un contrato de afiliación (empresas de afiliación).
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Cookies de seguridad
              </h3>
              <p className="text-text-secondary mb-4">
                Almacenan información cifrada para evitar que los datos guardados en ellas sean vulnerables a ataques maliciosos de terceros.
              </p>
            </section>

            {/* Según la propiedad */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                Según la Propiedad
              </h2>
              
              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Cookies propias
              </h3>
              <p className="text-text-secondary mb-4">
                Son aquellas que se envían al equipo terminal del usuario desde un equipo o dominio gestionado por el propio editor y desde el que se presta el servicio solicitado por el usuario.
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Cookies de terceros
              </h3>
              <p className="text-text-secondary mb-4">
                Son aquellas que se envían al equipo terminal del usuario desde un equipo o dominio que no es gestionado por el editor, sino por otra entidad que trata los datos obtenidos través de las cookies.
              </p>
            </section>

            {/* Según el plazo */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                Según el Plazo de Conservación
              </h2>
              
              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Cookies de sesión
              </h3>
              <p className="text-text-secondary mb-4">
                Son un tipo de cookies diseñadas para recabar y almacenar datos mientras el usuario accede a una página web.
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Cookies persistentes
              </h3>
              <p className="text-text-secondary mb-4">
                Son un tipo de cookies en el que los datos siguen almacenados en el terminal y pueden ser accedidos y tratados durante un período definido por el responsable de la cookie, y que puede ir de unos minutos a varios años.
              </p>
            </section>

            {/* Tratamiento de datos personales */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                Tratamiento de Datos Personales
              </h2>
              <p className="text-text-secondary mb-4">
                <strong>Oh My Pawz S.L.</strong> es el Responsable del tratamiento de los datos personales del Interesado y le informa de que estos datos serán tratados de conformidad con lo dispuesto en el Reglamento (UE) 2016/679, de 27 de abril de 2016 (GDPR), por lo que se le facilita la siguiente información del tratamiento:
              </p>

              <div className="bg-primary-50 border-l-4 border-primary p-4 mb-4">
                <p className="text-text-primary mb-2">
                  <strong>Fines del tratamiento:</strong> según se especifica en el apartado de cookies que se utilizan en este sitio web.
                </p>
                <p className="text-text-primary mb-2">
                  <strong>Legitimación del tratamiento:</strong> salvo en los casos en los que resulte necesario para la navegación por la web, por consentimiento del interesado (art. 6.1 GDPR).
                </p>
                <p className="text-text-primary mb-2">
                  <strong>Criterios de conservación de los datos:</strong> según se especifica en el apartado de cookies utilizadas en la web.
                </p>
                <p className="text-text-primary mb-2">
                  <strong>Comunicación de los datos:</strong> no se comunicarán los datos a terceros, excepto en cookies propiedad de terceros o por obligación legal.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Derechos que asisten al Interesado
              </h3>
              <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
                <li>Derecho a retirar el consentimiento en cualquier momento.</li>
                <li>Derecho de acceso, rectificación, portabilidad y supresión de sus datos, y de limitación u oposición a su tratamiento.</li>
                <li>Derecho a presentar una reclamación ante la Autoridad de control (www.aepd.es) si considera que el tratamiento no se ajusta a la normativa vigente.</li>
              </ul>

              <div className="bg-secondary-50 border-l-4 border-secondary p-4">
                <p className="text-text-primary mb-2">
                  <strong>Datos de contacto para ejercer sus derechos:</strong>
                </p>
                <p className="text-text-primary mb-1">Oh My Pawz S.L.</p>
                <p className="text-text-primary mb-1">Calle Luis Martinez 21, 39005 Santander</p>
                <p className="text-text-primary">E-mail: info@paw-unique.com</p>
              </div>
            </section>

            {/* Cómo gestionar las cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                Cómo Gestionar las Cookies desde el Navegador
              </h2>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Eliminar las cookies del dispositivo
              </h3>
              <p className="text-text-secondary mb-4">
                Las cookies que ya están en un dispositivo se pueden eliminar borrando el historial del navegador, con lo que se suprimen las cookies de todos los sitios web visitados. Sin embargo, también se puede perder parte de la información guardada (por ejemplo, los datos de inicio de sesión o las preferencias de sitio web).
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Gestionar las cookies específicas del sitio
              </h3>
              <p className="text-text-secondary mb-4">
                Para tener un control más preciso de las cookies específicas de cada sitio, los usuarios pueden ajustar su configuración de privacidad y cookies en el navegador.
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Bloquear las cookies
              </h3>
              <p className="text-text-secondary mb-4">
                Aunque la mayoría de los navegadores modernos se pueden configurar para evitar que se instalen cookies en los dispositivos, eso puede obligar al ajuste manual de determinadas preferencias cada vez que se visite un sitio o página. Además, algunos servicios y características pueden no funcionar correctamente (por ejemplo, los inicios de sesión con perfil).
              </p>
            </section>

            {/* Cómo eliminar cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
                Cómo Eliminar las Cookies de los Navegadores más Comunes
              </h2>
              <ul className="space-y-2 text-text-secondary">
                <li>
                  <strong>Chrome:</strong>{' '}
                  <a
                    href="https://support.google.com/chrome/answer/95647?hl=es"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://support.google.com/chrome/answer/95647?hl=es
                  </a>
                </li>
                <li>
                  <strong>Edge:</strong>{' '}
                  <a
                    href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Eliminar cookies en Microsoft Edge
                  </a>
                </li>
                <li>
                  <strong>Explorer:</strong>{' '}
                  <a
                    href="https://support.microsoft.com/es-es/help/278835/how-to-delete-cookie-files-in-internet-explorer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Eliminar cookies en Internet Explorer
                  </a>
                </li>
                <li>
                  <strong>Firefox:</strong>{' '}
                  <a
                    href="https://www.mozilla.org/es-ES/privacy/websites/cookies/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://www.mozilla.org/es-ES/privacy/websites/cookies/
                  </a>
                </li>
                <li>
                  <strong>Safari:</strong>{' '}
                  <a
                    href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://support.apple.com/es-es/guide/safari/sfri11471/mac
                  </a>
                </li>
                <li>
                  <strong>Opera:</strong>{' '}
                  <a
                    href="https://help.opera.com/en/latest/security-and-privacy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://help.opera.com/en/latest/security-and-privacy/
                  </a>
                </li>
              </ul>
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

export default PoliticaCookies;