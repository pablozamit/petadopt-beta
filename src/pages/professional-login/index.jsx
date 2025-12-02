import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import AdaptiveHeader from 'components/ui/AdaptiveHeader';
import { useAuth } from 'hooks/useAuth'; // <-- 1. Importamos el hook real

const ProfessionalLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, user, loading } = useAuth(); // <-- 2. Usamos el hook

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessType: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Get redirect path from URL params
  const redirectTo = new URLSearchParams(location.search).get('redirect') || '/professional-panel';

  // 3. Redirección automática si ya está logueado
  useEffect(() => {
    if (user && !loading) {
      navigate(redirectTo);
    }
  }, [user, loading, navigate, redirectTo]);

  useEffect(() => {
    // Clear form when switching modes
    setFormData({
      businessName: '',
      email: '',
      password: '',
      confirmPassword: '',
      businessType: '',
      acceptTerms: false
    });
    setErrors({});
    setSuccessMessage('');
  }, [isLogin]);

  const businessTypes = [
    { value: 'clinic', label: 'Clínica Veterinaria', icon: 'Building2' },
    { value: 'individual', label: 'Veterinario Individual', icon: 'User' },
    { value: 'grooming', label: 'Peluquería Canina', icon: 'Scissors' },
    { value: 'training', label: 'Adiestramiento', icon: 'Award' },
    { value: 'pet_store', label: 'Tienda de Mascotas', icon: 'Store' },
    { value: 'other', label: 'Otro Servicio', icon: 'MoreHorizontal' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && !formData.businessName.trim()) {
      newErrors.businessName = 'El nombre del negocio es obligatorio';
    }

    if (!isLogin && !formData.businessType) {
      newErrors.businessType = 'Selecciona el tipo de negocio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Por favor, introduce un email válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!isLogin && !formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        // 4. Login Real con Firebase
        await login(formData.email, formData.password);
        // La redirección la maneja el useEffect
      } else {
        // 5. Registro Real con Firebase + Datos adicionales
        await register(formData.email, formData.password, {
            displayName: formData.businessName,
            role: 'professional',
            businessType: formData.businessType,
            acceptTerms: true
        });
        setSuccessMessage('¡Registro exitoso! Iniciando sesión...');
      }
    } catch (error) {
      console.error("Error auth profesional:", error);
      let msg = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
      if (error.code === 'auth/email-already-in-use') msg = 'Este email ya está registrado.';
      if (error.code === 'auth/wrong-password') msg = 'Contraseña incorrecta.';
      if (error.code === 'auth/user-not-found') msg = 'No existe cuenta con este email.';
      if (error.code === 'auth/invalid-credential') msg = 'Credenciales inválidas.';
      
      setErrors({ general: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToDirectory = () => {
    navigate('/professionals');
  };

  const handleForgotPassword = () => {
    alert('Funcionalidad pendiente: Implementar resetPassword en useAuth');
  };

  return (
    <div className="min-h-screen bg-background">
      <AdaptiveHeader />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-secondary-50 to-accent-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-heading font-bold text-text-primary mb-4">
                Portal de Profesionales
              </h1>
              <p className="text-lg text-text-secondary mb-6 max-w-2xl mx-auto">
                Accede a tu panel profesional para gestionar tu perfil, servicios y conectar con dueños de mascotas
              </p>
            </div>
          </div>
        </section>

        {/* Login/Register Form */}
        <section className="py-12">
          <div className="max-w-md mx-auto lg:max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
              {/* Form Section */}
              <div className="w-full">
                {/* Mode Toggle */}
                <div className="mb-8">
                  <div className="flex bg-surface rounded-lg p-1 border border-border-light">
                    <button
                      onClick={() => setIsLogin(true)}
                      className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-300 ${
                        isLogin
                          ? 'bg-secondary text-white shadow-sm'
                          : 'text-text-secondary hover:text-secondary'
                      }`}
                    >
                      Iniciar Sesión
                    </button>
                    <button
                      onClick={() => setIsLogin(false)}
                      className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-300 ${
                        !isLogin
                          ? 'bg-secondary text-white shadow-sm'
                          : 'text-text-secondary hover:text-secondary'
                      }`}
                    >
                      Registrarse
                    </button>
                  </div>
                </div>

                {/* Form Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary mb-2">
                    {isLogin ? 'Accede a tu panel' : 'Únete como profesional'}
                  </h2>
                  <p className="text-text-secondary">
                    {isLogin 
                      ? 'Gestiona tu perfil profesional y conecta con clientes'
                      : 'Registra tu negocio y comienza a recibir clientes'
                    }
                  </p>
                </div>

                {/* Success Message */}
                {successMessage && (
                  <div className="mb-6 p-4 bg-success-light border border-success rounded-lg flex items-center space-x-3 animate-fade-in">
                    <Icon name="CheckCircle" size={20} className="text-success flex-shrink-0" />
                    <span className="text-success font-medium">{successMessage}</span>
                  </div>
                )}

                {/* General Error */}
                {errors.general && (
                  <div className="mb-6 p-4 bg-error-light border border-error rounded-lg flex items-center space-x-3 animate-fade-in">
                    <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0" />
                    <span className="text-error font-medium">{errors.general}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Business Name (Register only) */}
                  {!isLogin && (
                    <div>
                      <label htmlFor="businessName" className="block text-sm font-medium text-text-primary mb-2">
                        Nombre del Negocio *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Icon name="Building2" size={20} className="text-text-muted" />
                        </div>
                        <input
                          type="text"
                          id="businessName"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          className={`input-field pl-10 ${errors.businessName ? 'border-error focus:ring-error-300 focus:border-error' : ''}`}
                          placeholder="Ej: Clínica Veterinaria San Antón"
                        />
                      </div>
                      {errors.businessName && (
                        <p className="mt-2 text-sm text-error flex items-center space-x-1">
                          <Icon name="AlertCircle" size={16} />
                          <span>{errors.businessName}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Business Type (Register only) */}
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Tipo de Negocio *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {businessTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => handleInputChange({ target: { name: 'businessType', value: type.value } })}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                              formData.businessType === type.value
                                ? 'border-secondary bg-secondary-50'
                                : 'border-border hover:border-secondary-300 hover:bg-surface'
                            }`}
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <Icon name={type.icon} size={16} className={formData.businessType === type.value ? 'text-secondary' : 'text-text-muted'} />
                              <span className={`text-sm font-medium ${formData.businessType === type.value ? 'text-secondary' : 'text-text-primary'}`}>
                                {type.label}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                      {errors.businessType && (
                        <p className="mt-2 text-sm text-error flex items-center space-x-1">
                          <Icon name="AlertCircle" size={16} />
                          <span>{errors.businessType}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                      Email Profesional *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon name="Mail" size={20} className="text-text-muted" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`input-field pl-10 ${errors.email ? 'border-error focus:ring-error-300 focus:border-error' : ''}`}
                        placeholder="contacto@tunegocio.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-error flex items-center space-x-1">
                        <Icon name="AlertCircle" size={16} />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                      Contraseña *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon name="Lock" size={20} className="text-text-muted" />
                      </div>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`input-field pl-10 ${errors.password ? 'border-error focus:ring-error-300 focus:border-error' : ''}`}
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-sm text-error flex items-center space-x-1">
                        <Icon name="AlertCircle" size={16} />
                        <span>{errors.password}</span>
                      </p>
                    )}
                  </div>

                  {/* Confirm Password (Register only) */}
                  {!isLogin && (
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
                        Confirmar Contraseña *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Icon name="Lock" size={20} className="text-text-muted" />
                        </div>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`input-field pl-10 ${errors.confirmPassword ? 'border-error focus:ring-error-300 focus:border-error' : ''}`}
                          placeholder="••••••••"
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-2 text-sm text-error flex items-center space-x-1">
                          <Icon name="AlertCircle" size={16} />
                          <span>{errors.confirmPassword}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Terms (Register only) */}
                  {!isLogin && (
                    <div>
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="acceptTerms"
                          checked={formData.acceptTerms}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-secondary border-border rounded focus:ring-secondary-300 mt-1"
                        />
                        <span className="text-sm text-text-secondary">
                          Acepto los{' '}
                          <a href="/terms" target="_blank" className="text-secondary hover:text-secondary-600 underline">
                            términos y condiciones
                          </a>{' '}
                          y la{' '}
                          <a href="/privacy" target="_blank" className="text-secondary hover:text-secondary-600 underline">
                            política de privacidad
                          </a>
                        </span>
                      </label>
                      {errors.acceptTerms && (
                        <p className="mt-2 text-sm text-error flex items-center space-x-1">
                          <Icon name="AlertCircle" size={16} />
                          <span>{errors.acceptTerms}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-secondary text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-secondary-300 active:transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>{isLogin ? 'Iniciando sesión...' : 'Registrando...'}</span>
                      </>
                    ) : (
                      <>
                        <Icon name={isLogin ? "LogIn" : "UserPlus"} size={20} />
                        <span>{isLogin ? 'Acceder al Panel' : 'Crear Cuenta Profesional'}</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Additional Links */}
                <div className="mt-8 text-center space-y-4">
                  <button
                    onClick={handleBackToDirectory}
                    className="text-text-secondary hover:text-primary transition-colors duration-200 text-sm flex items-center space-x-2 mx-auto"
                  >
                    <Icon name="ArrowLeft" size={16} />
                    <span>Volver al directorio de profesionales</span>
                  </button>
                  
                  <div className="text-sm text-text-muted">
                    ¿Eres un adoptante?{' '}
                    <button
                      onClick={() => navigate('/')}
                      className="text-primary hover:text-primary-600 underline"
                    >
                      Buscar mascotas
                    </button>
                  </div>
                </div>
              </div>

              {/* Benefits Section (Desktop only) */}
              <div className="hidden lg:block">
                <div className="bg-gradient-to-br from-secondary-50 to-accent-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-heading font-bold text-text-primary mb-6">
                    Beneficios para Profesionales
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Benefits Items - Static content */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="Users" size={24} color="white" />
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-text-primary mb-2">
                          Conecta con Clientes
                        </h4>
                        <p className="text-text-secondary text-sm">
                          Accede a miles de dueños de mascotas que buscan servicios profesionales en tu área.
                        </p>
                      </div>
                    </div>
                    {/* ... (resto de beneficios igual) ... */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfessionalLogin;
