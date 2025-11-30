import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const AdaptiveHeader = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null); // 'shelter', 'professional', 'admin'
  const [userInfo, setUserInfo] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Detectar tipo de usuario desde localStorage
    const shelterAuth = localStorage.getItem('isAuthenticated') === 'true';
    const professionalAuth = localStorage.getItem('isProfessional') === 'true';
    const adminAuth = localStorage.getItem('isAdmin') === 'true';
    
    const shelterInfo = JSON.parse(localStorage.getItem('shelterInfo') || 'null');
    const professionalInfo = JSON.parse(localStorage.getItem('professionalInfo') || 'null');
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || 'null');
    
    if (adminAuth) {
      setIsAuthenticated(true);
      setUserType('admin');
      setUserInfo(adminInfo);
    } else if (professionalAuth) {
      setIsAuthenticated(true);
      setUserType('professional');
      setUserInfo(professionalInfo);
    } else if (shelterAuth) {
      setIsAuthenticated(true);
      setUserType('shelter');
      setUserInfo(shelterInfo);
    } else {
      setIsAuthenticated(false);
      setUserType(null);
      setUserInfo(null);
    }
  }, [location]);

  const handleLogout = () => {
    if (userType === 'professional') {
      localStorage.removeItem('isProfessional');
      localStorage.removeItem('professionalInfo');
      navigate('/professionals');
    } else if (userType === 'admin') {
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminInfo');
      navigate('/');
    } else {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('shelterInfo');
      navigate('/');
    }
    setIsAuthenticated(false);
    setUserType(null);
    setUserInfo(null);
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setShowLoginDropdown(false);
  };

  const handleLogoClick = () => {
    if (userType === 'admin') {
      navigate('/admin-panel');
    } else if (userType === 'professional') {
      navigate('/professional-panel');
    } else if (userType === 'shelter') {
      navigate('/shelter-dashboard');
    } else {
      navigate('/');
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getDisplayName = (name) => {
    if (!name) return userType === 'admin' ? 'Admin' : userType === 'professional' ? 'Profesional' : 'Refugio';
    return name.length > 20 ? name.substring(0, 17) + '...' : name;
  };

  const getUserColor = () => {
    if (userType === 'admin') return 'bg-error';
    if (userType === 'professional') return 'bg-secondary';
    return 'bg-primary';
  };

  const getUserIcon = () => {
    if (userType === 'admin') return 'Shield';
    if (userType === 'professional') return 'Stethoscope';
    return 'Building2';
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!isAuthenticated ? (
              <>
                {/* Directorios públicos */}
                <button
                  onClick={() => handleNavigation('/')}
                  className={`nav-link flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200 ${
                    location.pathname === '/' ? 'text-primary font-semibold' : ''
                  }`}
                >
                  <Icon name="Home" size={18} />
                  <span>Mascotas</span>
                </button>

                <button
                  onClick={() => handleNavigation('/professionals')}
                  className={`nav-link flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-secondary-50 transition-all duration-200 ${
                    location.pathname === '/professionals' ? 'text-secondary font-semibold' : ''
                  }`}
                >
                  <Icon name="Stethoscope" size={18} />
                  <span>Profesionales</span>
                </button>

                {/* Login Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                    className="nav-link flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-accent-50 transition-all duration-200"
                  >
                    <Icon name="LogIn" size={18} />
                    <span>Iniciar Sesión</span>
                    <Icon name={showLoginDropdown ? "ChevronUp" : "ChevronDown"} size={16} />
                  </button>

                  {showLoginDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-border-light py-2 z-50">
                      <button
                        onClick={() => handleNavigation('/authentication-login-register')}
                        className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors flex items-center space-x-3"
                      >
                        <Icon name="Building2" size={18} className="text-primary" />
                        <div>
                          <div className="font-medium text-text-primary">Soy Refugio</div>
                          <div className="text-xs text-text-secondary">Gestiona tus mascotas</div>
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

                      <button
                        onClick={() => handleNavigation('/admin-panel')}
                        className="w-full text-left px-4 py-3 hover:bg-error-light transition-colors flex items-center space-x-3"
                      >
                        <Icon name="Shield" size={18} className="text-error" />
                        <div>
                          <div className="font-medium text-text-primary">Administrador</div>
                          <div className="text-xs text-text-secondary">Panel de control</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="flex items-center space-x-3 px-3 py-2 bg-surface rounded-lg">
                  <div className={`w-8 h-8 ${getUserColor()} rounded-full flex items-center justify-center`}>
                    <Icon name={getUserIcon()} size={16} color="white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-text-primary">
                      {getDisplayName(userInfo?.name)}
                    </span>
                    <span className="text-xs text-text-secondary capitalize">{userType}</span>
                  </div>
                </div>

                {/* Dashboard Link */}
                <button
                  onClick={() => {
                    if (userType === 'admin') handleNavigation('/admin-panel');
                    else if (userType === 'professional') handleNavigation('/professional-panel');
                    else handleNavigation('/shelter-dashboard');
                  }}
                  className="nav-link flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-surface transition-all duration-200"
                >
                  <Icon name="LayoutDashboard" size={18} />
                  <span>Panel</span>
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="nav-link flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-error-light hover:text-error transition-all duration-200"
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
              onClick={toggleMobileMenu}
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
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => handleNavigation('/')}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-text-secondary hover:text-primary hover:bg-surface"
                  >
                    <Icon name="Home" size={20} />
                    <span className="font-medium">Mascotas</span>
                  </button>

                  <button
                    onClick={() => handleNavigation('/professionals')}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-text-secondary hover:text-secondary hover:bg-surface"
                  >
                    <Icon name="Stethoscope" size={20} />
                    <span className="font-medium">Profesionales</span>
                  </button>

                  <div className="border-t border-border-light my-2"></div>

                  <button
                    onClick={() => handleNavigation('/authentication-login-register')}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-text-secondary hover:text-primary hover:bg-surface"
                  >
                    <Icon name="Building2" size={20} />
                    <span className="font-medium">Login Refugio</span>
                  </button>

                  <button
                    onClick={() => handleNavigation('/professional-login')}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-text-secondary hover:text-secondary hover:bg-surface"
                  >
                    <Icon name="Stethoscope" size={20} />
                    <span className="font-medium">Login Profesional</span>
                  </button>

                  <button
                    onClick={() => handleNavigation('/admin-panel')}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-text-secondary hover:text-error hover:bg-surface"
                  >
                    <Icon name="Shield" size={20} />
                    <span className="font-medium">Login Admin</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-3 py-3 bg-surface rounded-lg">
                    <div className={`w-10 h-10 ${getUserColor()} rounded-full flex items-center justify-center`}>
                      <Icon name={getUserIcon()} size={18} color="white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-text-primary">
                        {getDisplayName(userInfo?.name)}
                      </span>
                      <span className="text-sm text-text-secondary capitalize">{userType}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (userType === 'admin') handleNavigation('/admin-panel');
                      else if (userType === 'professional') handleNavigation('/professional-panel');
                      else handleNavigation('/shelter-dashboard');
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-text-secondary hover:bg-surface"
                  >
                    <Icon name="LayoutDashboard" size={20} />
                    <span className="font-medium">Panel de Control</span>
                  </button>

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
