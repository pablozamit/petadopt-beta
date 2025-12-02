import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Icon from '../AppIcon';
import { useAuth } from '../../hooks/useAuth';

const AdaptiveHeader = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setShowLoginDropdown(false);
  };

  const handleLogoClick = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border-light shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-2 text-primary hover:text-primary-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 rounded-lg p-1"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Heart" size={20} color="white" />
              </div>
              <span className="font-heading font-bold text-xl text-text-primary">
                AdoptaEspaña
              </span>
            </button>
          </div>

          {/* Desktop Navigation - Enlaces visibles para TODOS */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`nav-link flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200 ${
                location.pathname === '/' ? 'text-primary font-semibold' : ''
              }`}
            >
              <Icon name="Home" size={18} />
              <span>Mascotas</span>
            </Link>

            <Link
              to="/como-funciona"
              className="nav-link flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200"
            >
              <Icon name="HelpCircle" size={18} />
              <span>Cómo Funciona</span>
            </Link>

            <Link
              to="/shelters"
              className={`nav-link flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-accent-50 transition-all duration-200 ${
                location.pathname === '/shelters' ? 'text-accent font-semibold' : ''
              }`}
            >
              <Icon name="Building2" size={18} />
              <span>Refugios</span>
            </Link>

            <Link
              to="/professionals"
              className={`nav-link flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-secondary-50 transition-all duration-200 ${
                location.pathname === '/professionals' ? 'text-secondary font-semibold' : ''
              }`}
            >
              <Icon name="Stethoscope" size={18} />
              <span>Profesionales</span>
            </Link>

            {/* Auth Buttons - Solo esto cambia según el estado */}
            {!user ? (
              /* LOGIN/REGISTRO Dropdown */
              <div className="relative">
                <button
                  onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                  className="btn-primary flex items-center space-x-2 px-5 py-2 rounded-lg"
                >
                  <Icon name="User" size={18} />
                  <span>Acceder</span>
                  <Icon name={showLoginDropdown ? "ChevronUp" : "ChevronDown"} size={16} />
                </button>

                {showLoginDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-border-light py-2 z-50">
                    <button
                      onClick={() => handleNavigation('/authentication-login-register')}
                      className="w-full text-left px-4 py-3 hover:bg-surface transition-colors flex items-center space-x-3"
                    >
                      <Icon name="Heart" size={18} className="text-accent" />
                      <div>
                        <div className="font-medium text-text-primary">Soy Adoptante</div>
                        <div className="text-xs text-text-secondary">Busco una mascota</div>
                      </div>
                    </button>

                    <div className="border-t border-border-light my-1"></div>

                    <button
                      onClick={() => handleNavigation('/authentication-login-register')}
                      className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors flex items-center space-x-3"
                    >
                      <Icon name="Building2" size={18} className="text-primary" />
                      <div>
                        <div className="font-medium text-text-primary">Soy Refugio</div>
                        <div className="text-xs text-text-secondary">Gestiono mascotas</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavigation('/professional-login')}
                      className="w-full text-left px-4 py-3 hover:bg-secondary-50 transition-colors flex items-center space-x-3"
                    >
                      <Icon name="Stethoscope" size={18} className="text-secondary" />
                      <div>
                        <div className="font-medium text-text-primary">Soy Profesional</div>
                        <div className="text-xs text-text-secondary">Veterinario, educador...</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* LOGGED IN Actions */
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="nav-link flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-error-light hover:text-error transition-all duration-200 border border-transparent hover:border-error-light"
                >
                  <Icon name="LogOut" size={18} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-surface transition-all duration-200"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border-light bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Enlaces comunes para Móvil */}
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-text-secondary hover:text-primary hover:bg-surface"
              >
                <Icon name="Home" size={20} />
                <span className="font-medium">Mascotas</span>
              </Link>

              <Link
                to="/como-funciona"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-text-secondary hover:text-primary hover:bg-surface"
              >
                <Icon name="HelpCircle" size={20} />
                <span className="font-medium">Cómo Funciona</span>
              </Link>

              <Link
                to="/shelters"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-text-secondary hover:text-accent hover:bg-surface"
              >
                <Icon name="Building2" size={20} />
                <span className="font-medium">Refugios</span>
              </Link>

              <Link
                to="/professionals"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-text-secondary hover:text-secondary hover:bg-surface"
              >
                <Icon name="Stethoscope" size={20} />
                <span className="font-medium">Profesionales</span>
              </Link>

              <div className="border-t border-border-light my-2"></div>

              {/* Lógica condicional Auth para Móvil */}
              {!user ? (
                <>
                  <button
                    onClick={() => handleNavigation('/authentication-login-register')}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-text-secondary hover:bg-surface"
                  >
                    <Icon name="Heart" size={20} />
                    <span className="font-medium">Soy Adoptante</span>
                  </button>

                  <button
                    onClick={() => handleNavigation('/authentication-login-register')}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-text-secondary hover:bg-surface"
                  >
                    <Icon name="Building2" size={20} />
                    <span className="font-medium">Soy Refugio</span>
                  </button>

                  <button
                    onClick={() => handleNavigation('/professional-login')}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-text-secondary hover:bg-surface"
                  >
                    <Icon name="Stethoscope" size={20} />
                    <span className="font-medium">Soy Profesional</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-text-secondary hover:text-error hover:bg-error-light"
                  >
                    <Icon name="LogOut" size={20} />
                    <span className="font-medium">Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdaptiveHeader;
