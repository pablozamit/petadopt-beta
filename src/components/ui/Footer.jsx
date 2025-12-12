import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const legalLinks = [
    { label: 'Política de Privacidad', path: '/politica-privacidad' },
    { label: 'Política de Cookies', path: '/politica-cookies' },
    { label: 'Términos y Condiciones', path: '/terminos-condiciones' },
  ];

  const companyInfo = {
    name: 'Oh My Pawz S.L.',
    address: 'Calle Luis Martinez 21, 39005 Santander',
    phone: '615 033 513',
    email: 'info@paw-unique.com',
    nif: 'B56178767',
  };

  return (
    <footer className="bg-surface border-t border-border-light mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Heart" size={20} color="white" />
              </div>
              <span className="font-heading font-bold text-lg text-text-primary">
                AdoptaEspaña
              </span>
            </div>
            <p className="text-sm text-text-secondary">
              Conectando mascotas con familias. Encuentra tu compañero perfecto hoy.
            </p>
          </div>

          {/* Legal Links Section */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-text-primary">
              Información Legal
            </h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-text-secondary hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Info Section */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-text-primary">
              Contacto
            </h3>
            <div className="space-y-2 text-sm text-text-secondary">
              <div className="flex items-start space-x-2">
                <Icon name="MapPin" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <p>{companyInfo.address}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Phone" size={16} className="text-primary flex-shrink-0" />
                <a
                  href={`tel:${companyInfo.phone.replace(/\s/g, '')}`}
                  className="hover:text-primary transition-colors duration-200"
                >
                  {companyInfo.phone}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Mail" size={16} className="text-primary flex-shrink-0" />
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="hover:text-primary transition-colors duration-200"
                >
                  {companyInfo.email}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-text-primary text-xs bg-primary/10 px-2 py-1 rounded">
                  NIF: {companyInfo.nif}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border-light my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-text-secondary">
            © {currentYear} <span className="font-semibold">{companyInfo.name}</span> - AdoptaEspaña. Todos los derechos reservados.
          </p>

          {/* Social or Additional Links */}
          <div className="flex items-center space-x-4">
            <a
              href="https://www.aepd.es"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-secondary hover:text-primary transition-colors duration-200"
              title="Autoridad de Control - Protección de Datos"
            >
              AEPD
            </a>
          </div>
        </div>

        {/* Accessibility Notice */}
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
          <p className="text-xs text-text-secondary">
            <strong>Aviso de accesibilidad:</strong> Si encuentras problemas para acceder a cualquier parte de este sitio web, por favor{' '}
            <a
              href={`mailto:${companyInfo.email}`}
              className="text-primary hover:underline"
            >
              contáctanos
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;