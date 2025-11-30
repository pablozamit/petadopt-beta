import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import AdaptiveHeader from 'components/ui/AdaptiveHeader';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import { SPANISH_PROVINCES } from 'utils/constants';

const ProfessionalsDirectory = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [professionals, setProfessionals] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    service: '',
    province: '',
    city: ''
  });

  // Servicios ordenados alfabéticamente (sin hospedaje)
  const serviceOptions = [
    { value: '', label: 'Todos los servicios' },
    { value: 'dog_trainer', label: 'Adiestramiento canino' },
    { value: 'agility_trainer', label: 'Adiestramiento de agility y deportes caninos' },
    { value: 'service_dog_trainer', label: 'Adiestramiento de perros de servicio o asistencia' },
    { value: 'behavioral_therapist', label: 'Asesor/a de comportamiento' },
    { value: 'canine_aesthetician', label: 'Esteticista canino' },
    { value: 'ethologist', label: 'Etólogo/a' },
    { value: 'physiotherapist', label: 'Fisioterapeuta' },
    { value: 'pet_photographer', label: 'Fotógrafo/a de perros' },
    { value: 'grooming', label: 'Grooming/Peluquería' },
    { value: 'daycare', label: 'Guardería' },
    { value: 'obedience_instructor', label: 'Instructor/a de obediencia' },
    { value: 'nutritionist', label: 'Nutricionista' },
    { value: 'dog_walker', label: 'Paseador/a de perros' },
    { value: 'pet_sitter', label: 'Pet sitter (cuidador/a a domicilio)' },
    { value: 'behavioral_modification_therapist', label: 'Terapeuta de modificación conductual' },
    { value: 'emergency', label: 'Urgencias' },
    { value: 'veterinary', label: 'Veterinaria' }
  ];

  const provinceOptions = [
    { value: '', label: 'Todas las provincias' },
    ...SPANISH_PROVINCES.map(province => ({
      value: province.toLowerCase(),
      label: province
    }))
  ];

  // ✅ NUEVA LÓGICA: Cargar profesionales desde Firebase
  useEffect(() => {
    const loadProfessionals = async () => {
      setIsLoading(true);
      try {
        // Consulta a Firebase: solo usuarios con role='professional'
        const professionalsRef = collection(db, 'users');
        const q = query(professionalsRef, where('role', '==', 'professional'));
        const querySnapshot = await getDocs(q);
        
        // Mapear los documentos a un array de objetos
        const professionalsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setProfessionals(professionalsData);
        setFilteredProfessionals(professionalsData);
      } catch (error) {
        console.error('Error loading professionals from Firebase:', error);
        // Si hay error, mostramos array vacío
        setProfessionals([]);
        setFilteredProfessionals([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfessionals();
  }, []);

  useEffect(() => {
    let filtered = professionals;

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(prof =>
        prof.name?.toLowerCase().includes(searchTerm) ||
        prof.description?.toLowerCase().includes(searchTerm) ||
        prof.city?.toLowerCase().includes(searchTerm)
      );
    }

    // Service filter
    if (filters.service) {
      filtered = filtered.filter(prof =>
        prof.services?.includes(filters.service)
      );
    }

    // Province filter
    if (filters.province) {
      filtered = filtered.filter(prof => prof.province === filters.province);
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(prof =>
        prof.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    setFilteredProfessionals(filtered);
  }, [filters, professionals]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      service: '',
      province: '',
      city: ''
    });
  };

  const getServiceLabel = (service) => {
    const option = serviceOptions.find(opt => opt.value === service);
    return option ? option.label : service;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'clinic':
        return 'Building2';
      case 'individual':
        return 'User';
      case 'business':
        return 'Store';
      default:
        return 'MapPin';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'clinic':
        return 'Clínica';
      case 'individual':
        return 'Profesional';
      case 'business':
        return 'Negocio';
      default:
        return type;
    }
  };

  const handleWhatsApp = (professional) => {
    const message = encodeURIComponent(
      `Hola, estoy interesado en sus servicios de ${professional.services?.map(s => getServiceLabel(s)).join(', ')}. ¿Podrían darme más información?`
    );
    const whatsappUrl = `https://wa.me/${professional.whatsapp?.replace(/\s+/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmail = (professional) => {
    const subject = encodeURIComponent(`Consulta sobre servicios - ${professional.name}`);
    const body = encodeURIComponent(
      `Hola,

Estoy interesado en sus servicios de ${professional.services?.map(s => getServiceLabel(s)).join(', ')}.

¿Podrían proporcionarme más información sobre disponibilidad y precios?

Gracias.`
    );
    const emailUrl = `mailto:${professional.email}?subject=${subject}&body=${body}`;
    window.location.href = emailUrl;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={i} name="Star" size={16} className="text-accent fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="Star" size={16} className="text-accent fill-current opacity-50" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating || 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="Star" size={16} className="text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-background">
      <AdaptiveHeader />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-secondary-50 to-accent-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-heading font-bold text-text-primary mb-6">
                Directorio de Profesionales
              </h1>
              <p className="text-lg text-text-secondary mb-8 max-w-3xl mx-auto">
                Encuentra veterinarios, peluquerías, tiendas y servicios especializados para el cuidado de tu mascota en toda España
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-1">
                    {professionals.length}+
                  </div>
                  <div className="text-sm text-text-secondary">
                    Profesionales
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {serviceOptions.length - 1}
                  </div>
                  <div className="text-sm text-text-secondary">
                    Tipos de Servicios
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1">
                    50+
                  </div>
                  <div className="text-sm text-text-secondary">
                    Ciudades
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-surface border-b border-border-light sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {/* Search */}
              <div className="xl:col-span-2">
                <div className="relative">
                  <Icon 
                    name="Search" 
                    size={20} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" 
                  />
                  <input
                    type="text"
                    placeholder="Buscar profesionales..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="input-field pl-10 text-sm"
                  />
                </div>
              </div>

              {/* Service */}
              <div>
                <select
                  value={filters.service}
                  onChange={(e) => handleFilterChange('service', e.target.value)}
                  className="input-field text-sm"
                >
                  {serviceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Province */}
              <div>
                <select
                  value={filters.province}
                  onChange={(e) => handleFilterChange('province', e.target.value)}
                  className="input-field text-sm"
                >
                  {provinceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {Object.values(filters).some(filter => filter !== '') && (
                  <button
                    onClick={handleResetFilters}
                    className="btn-outline text-sm px-4 py-2 flex items-center space-x-2"
                  >
                    <Icon name="X" size={16} />
                    <span>Limpiar</span>
                  </button>
                )}
                <div className="text-sm text-text-secondary">
                  {filteredProfessionals.length} resultados
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Cargando profesionales..." />
            </div>
          ) : filteredProfessionals.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Search" size={48} className="text-secondary" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-4">
                No se encontraron profesionales
              </h3>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">
                No hay profesionales que coincidan con tus criterios de búsqueda.
              </p>
              <button
                onClick={handleResetFilters}
                className="btn-outline"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {filteredProfessionals.map((professional) => (
                <div key={professional.id} className="card p-6 group">
                  {/* Header */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface">
                      <Image
                        src={professional.logo}
                        alt={professional.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-heading font-semibold text-text-primary group-hover:text-primary transition-colors duration-200 line-clamp-2">
                          {professional.name}
                        </h3>
                        {professional.verified && (
                          <div className="flex-shrink-0 ml-2">
                            <Icon name="CheckCircle" size={18} className="text-success" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-text-secondary mb-2">
                        <Icon name={getTypeIcon(professional.type)} size={14} />
                        <span>{getTypeLabel(professional.type)}</span>
                      </div>
                      
                      {professional.rating && (
                        <div className="flex items-center space-x-1 mb-2">
                          <div className="flex items-center space-x-1">
                            {renderStars(professional.rating)}
                          </div>
                          <span className="text-sm font-medium text-text-primary">
                            {professional.rating}
                          </span>
                          {professional.reviewsCount && (
                            <span className="text-sm text-text-secondary">
                              ({professional.reviewsCount})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  {professional.address && (
                    <div className="flex items-center space-x-2 text-sm text-text-secondary mb-3">
                      <Icon name="MapPin" size={14} />
                      <span className="line-clamp-1">{professional.address}</span>
                    </div>
                  )}

                  {/* Services */}
                  {professional.services && professional.services.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {professional.services.slice(0, 3).map((service) => (
                          <span
                            key={service}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary border border-secondary/20"
                          >
                            {getServiceLabel(service)}
                          </span>
                        ))}
                        {professional.services.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-text-muted bg-opacity-10 text-text-muted border border-text-muted border-opacity-20">
                            +{professional.services.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {professional.description && (
                    <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                      {professional.description}
                    </p>
                  )}

                  {/* Emergency Badge */}
                  {professional.emergencyAvailable && (
                    <div className="mb-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error-light text-error border border-error/20">
                        <Icon name="AlertCircle" size={12} className="mr-1" />
                        Urgencias 24h
                      </span>
                    </div>
                  )}

                  {/* Contact Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    {professional.whatsapp && (
                      <button
                        onClick={() => handleWhatsApp(professional)}
                        className="flex items-center justify-center space-x-2 px-4 py-3 bg-success text-white rounded-lg font-medium transition-all duration-200 hover:bg-success-600 focus:outline-none focus:ring-2 focus:ring-success-300 active:transform active:scale-95"
                      >
                        <Icon name="MessageCircle" size={16} />
                        <span className="text-sm">WhatsApp</span>
                      </button>
                    )}
                    
                    {professional.email && (
                      <button
                        onClick={() => handleEmail(professional)}
                        className="flex items-center justify-center space-x-2 px-4 py-3 border border-border text-text-primary rounded-lg font-medium transition-all duration-200 hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary-300 active:transform active:scale-95"
                      >
                        <Icon name="Mail" size={16} />
                        <span className="text-sm">Email</span>
                      </button>
                    )}
                  </div>

                  {/* Additional Actions */}
                  <div className="mt-4 pt-4 border-t border-border-light">
                    <div className="flex items-center justify-between">
                      {professional.website ? (
                        <a
                          href={professional.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-primary hover:text-primary-600 transition-colors duration-200 text-sm"
                        >
                          <Icon name="Globe" size={14} />
                          <span>Sitio web</span>
                        </a>
                      ) : (
                        <div></div>
                      )}
                      
                      <button
                        onClick={() => navigate(`/professional/${professional.id}`)}
                        className="flex items-center space-x-1 text-primary hover:text-primary-600 transition-colors duration-200 text-sm"
                      >
                        <span>Ver detalles</span>
                        <Icon name="ArrowRight" size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-secondary py-16 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              ¿Eres un profesional del sector?
            </h2>
            <p className="text-secondary-100 mb-8 max-w-2xl mx-auto">
              Únete a nuestro directorio y conecta con miles de dueños de mascotas en toda España
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/professional-login')}
                className="bg-white text-secondary px-8 py-4 rounded-lg font-semibold hover:bg-secondary-50 transition-colors duration-200"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => navigate('/professional-register')}
                className="bg-accent text-white px-8 py-4 rounded-lg font-semibold hover:bg-accent-600 transition-colors duration-200"
              >
                Registrar mi negocio
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfessionalsDirectory;
