import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { useAuth } from 'hooks/useAuth';

const AuthenticationLoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    shelterName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // Hook de autenticación real
  const { login, register, user, loading } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({
      shelterName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setSuccessMessage('');
  }, [isLogin]);

  // Si el usuario ya está logueado, ir al dashboard
  useEffect(() => {
    if (user && !loading) {
        navigate('/shelter-dashboard');
    }
  }, [user, loading, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name] || errors.general) {
      setErrors(prev => ({ ...prev, [name]: '', general: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!isLogin && !formData.shelterName.trim()) {
      newErrors.shelterName = 'El nombre del refugio es obligatorio';
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
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      if (isLogin) {
        // Login Real
        await login(formData.email, formData.password);
      } else {
        // Registro Real: Crea usuario en Auth y datos en Firestore
        await register(formData.email, formData.password, {
            displayName: formData.shelterName,
            role: 'shelter',
            shelterName: formData.shelterName
        });
        setSuccessMessage('¡Registro exitoso! Iniciando sesión automáticamente...');
      }
    } catch (error) {
      console.error("Error de autenticación:", error);
      let msg = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
      
      if (error.code === 'auth/email-already-in-use') msg = 'Este email ya está registrado.';
      if (error.code === 'auth/wrong-password') msg = 'Contraseña incorrecta.';
      if (error.code === 'auth/user-not-found') msg = 'No existe una cuenta con este email.';
      if (error.code === 'auth/invalid-credential') msg = 'Credenciales no válidas.';
      
      setErrors({ general: msg });
    }
  };

  const handleBackToHome = () => navigate('/public-pet-adoption-homepage');

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={handleBackToHome} className="flex items-center space-x-2 text-primary hover:text-primary-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 rounded-lg p-1">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Heart" size={20} color="white" />
              </div>
              <span className="font-heading font-bold text-xl text-text-primary">AdoptaEspaña</span>
            </button>
            <button onClick={handleBackToHome} className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 rounded-lg px-3 py-2">
              <Icon name="ArrowLeft" size={18} />
              <span className="hidden sm:inline font-medium">Volver al inicio</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto lg:max-w-4xl">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div className="w-full">
              <div className="mb-8">
                <div className="flex bg-surface rounded-lg p-1 border border-border-light">
                  <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 ${isLogin ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-primary'}`}>
                    Iniciar Sesión
                  </button>
                  <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 ${!isLogin ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-primary'}`}>
                    Registrarse
                  </button>
                </div>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary mb-2">
                  {isLogin ? 'Bienvenido de vuelta' : 'Únete a nosotros'}
                </h1>
                <p className="text-text-secondary">
                  {isLogin ? 'Accede a tu panel de refugio' : 'Crea tu cuenta para comenzar a ayudar'}
                </p>
              </div>

              {successMessage && (
                <div className="mb-6 p-4 bg-success-light border border-success rounded-lg flex items-center space-x-3 animate-fade-in">
                  <Icon name="CheckCircle" size={20} className="text-success flex-shrink-0" />
                  <span className="text-success font-medium">{successMessage}</span>
                </div>
              )}

              {errors.general && (
                <div className="mb-6 p-4 bg-error-light border border-error rounded-lg flex items-center space-x-3 animate-fade-in">
                  <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0" />
                  <span className="text-error font-medium">{errors.general}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div>
                    <label htmlFor="shelterName" className="block text-sm font-medium text-text-primary mb-2">Nombre del Refugio *</label>
                    <input type="text" id="shelterName" name="shelterName" value={formData.shelterName} onChange={handleInputChange} className={`input-field pl-10 ${errors.shelterName ? 'border-error focus:ring-error-300 focus:border-error' : ''}`} placeholder="Ej: Refugio Esperanza" />
                    {errors.shelterName && <p className="mt-2 text-sm text-error flex items-center space-x-1"><Icon name="AlertCircle" size={16} /><span>{errors.shelterName}</span></p>}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">Email *</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={`input-field pl-10 ${errors.email ? 'border-error focus:ring-error-300 focus:border-error' : ''}`} placeholder="refugio@ejemplo.com" />
                  {errors.email && <p className="mt-2 text-sm text-error flex items-center space-x-1"><Icon name="AlertCircle" size={16} /><span>{errors.email}</span></p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">Contraseña *</label>
                  <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} className={`input-field pl-10 ${errors.password ? 'border-error focus:ring-error-300 focus:border-error' : ''}`} placeholder="••••••••" />
                  {errors.password && <p className="mt-2 text-sm text-error flex items-center space-x-1"><Icon name="AlertCircle" size={16} /><span>{errors.password}</span></p>}
                </div>

                {!isLogin && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">Confirmar Contraseña *</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className={`input-field pl-10 ${errors.confirmPassword ? 'border-error focus:ring-error-300 focus:border-error' : ''}`} placeholder="••••••••" />
                    {errors.confirmPassword && <p className="mt-2 text-sm text-error flex items-center space-x-1"><Icon name="AlertCircle" size={16} /><span>{errors.confirmPassword}</span></p>}
                  </div>
                )}

                <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{isLogin ? 'Iniciando...' : 'Registrando...'}</span>
                    </>
                  ) : (
                    <>
                      <Icon name={isLogin ? "LogIn" : "UserPlus"} size={20} />
                      <span>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100 p-8">
                  <Image src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Refugio" className="w-full h-full object-cover rounded-xl shadow-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthenticationLoginRegister;
