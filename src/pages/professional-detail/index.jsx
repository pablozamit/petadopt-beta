import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'; // <--- IMPORTANTE: Nuevas importaciones
import { db } from '@/firebaseConfig';            // <--- IMPORTANTE: Conexión a la BD
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import AdaptiveHeader from 'components/ui/AdaptiveHeader';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import ConfirmDialog from 'components/ui/ConfirmDialog';

const ProfessionalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professional, setProfessional] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  // Mantenemos las reseñas como array vacío o simulado por ahora, ya que aún no tenemos sistema de reseñas real
  const [reviews, setReviews] = useState([]); 

  // --- CAMBIO PRINCIPAL: Lógica de carga real desde Firebase ---
  useEffect(() => {
    const fetchProfessional = async () => {
      setIsLoading(true);
      try {
        // 1. Referencia al documento en la colección 'users' usando el ID de la URL
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // 2. Si existe, guardamos los datos reales en el estado
          const data = docSnap.data();
          setProfessional({ id: docSnap.id, ...data });
          
          // Configuramos reseñas vacías o mock por el momento
          setReviews([
             {
               id: 'review_mock_1',
               userName: 'Usuario del sistema',
               rating: 5,
               comment: 'Este es un profesional verificado de la plataforma.',
               date: new Date().toISOString(),
               verified: true
             }
          ]);
        } else {
          console.log("No se encontró el profesional");
          setProfessional(null);
        }
      } catch (error) {
        console.error("Error fetching professional:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProfessional();
    }
  }, [id]);
  // -----------------------------------------------------------

  const getServiceLabel = (service) => {
    const labels = {
      dog_trainer: 'Adiestramiento canino',
      agility_trainer: 'Adiestramiento de agility y deportes caninos',
      service_dog_trainer: 'Adiestramiento de perros de servicio o asistencia',
      behavioral_therapist: 'Asesor/a de comportamiento',
      canine_aesthetician: 'Esteticista canino',
      ethologist: 'Etólogo/a',
      physiotherapist: 'Fisioterapeuta',
      pet_photographer: 'Fotógrafo/a de perros',
      grooming: 'Grooming/Peluquería',
      daycare: 'Guardería',
      obedience_instructor: 'Instructor/a de obediencia',
      nutritionist: 'Nutricionista',
      dog_walker: 'Paseador/a de perros',
      pet_sitter: 'Pet sitter (cuidador/a a domicilio)',
      behavioral_modification_therapist: 'Terapeuta de modificación conductual',
      emergency: 'Urgencias',
      veterinary: 'Veterinaria',
      dentistry: 'Odontología'
    };
    return labels[service] || service;
  };

  const getServiceIcon = (service) => {
    const icons = {
      dog_trainer: 'Award',
      agility_trainer: 'Award',
      service_dog_trainer: 'Award',
      behavioral_therapist: 'Brain',
      canine_aesthetician: 'Scissors',
      ethologist: 'Brain',
      physiotherapist: 'Activity',
      pet_photographer: 'Camera',
      grooming: 'Scissors',
      daycare: 'Users',
      obedience_instructor: 'Award',
      nutritionist: 'Apple',
      dog_walker: 'MapPin',
      pet_sitter: 'Home',
      behavioral_modification_therapist: 'Brain',
      emergency: 'AlertCircle',
      veterinary: 'Stethoscope',
      dentistry: 'Smile'
    };
    return icons[service] || 'Circle';
  };

  const getDayLabel = (day) => {
    const labels = {
      monday: 'Lunes',
      tuesday: 'Martes',
      wednesday: 'Miércoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sábado',
      sunday: 'Domingo'
    };
    return labels[day] || day;
  };

  const handleWhatsApp = () => {
    if (!professional.whatsapp && !professional.phone) return;
    const phone = professional.whatsapp || professional.phone;
    const message = encodeURIComponent(
      `Hola, estoy interesado en sus servicios. ¿Podrían darme más información?`
    );
    const whatsappUrl = `https://wa.me/${phone.replace(/\s+/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmail = () => {
    if (!professional.email) return;
    const subject = encodeURIComponent(`Consulta sobre servicios - ${professional.displayName || professional.name}`);
    const body = encodeURIComponent(
      `Hola,\n\nEstoy interesado en sus servicios.\n\n¿Podrían proporcionarme más información sobre disponibilidad y precios?\n\nGracias.`
    );
    const emailUrl = `mailto:${professional.email}?subject=${subject}&body=${body}`;
    window.location.href = emailUrl;
  };

  const handleReport = () => {
    if (!reportReason.trim()) {
      alert('Por favor, selecciona un motivo para el reporte');
      return;
    }
    
    console.log('Reporting professional:', id, 'Reason:', reportReason);
    alert('Reporte enviado. Gracias por ayudarnos a mantener la plataforma segura.');
    setShowReportDialog(false);
    setReportReason('');
  };

  const renderStars = (rating) => {
    // Si no hay rating, mostramos 5 estrellas vacías o un valor por defecto
    const safeRating = rating || 0;
    const stars = [];
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 !== 0;

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

    const emptyStars = 5 - Math.ceil(safeRating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="Star" size={16} className="text-gray-300" />
      );
    }

    return stars;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AdaptiveHeader />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" text="Cargando información del profesional..." />
        </div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-background">
        <AdaptiveHeader />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
            <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
              Profesional no encontrado
            </h1>
            <p className="text-text-secondary mb-6">
              El profesional que buscas no existe o ha sido eliminado.
            </p>
            <button
              onClick={() => navigate('/professionals')}
              className="btn-primary"
            >
              Volver al directorio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Adaptación de campos: Firebase usa a veces displayName en lugar de name, o photoURL en lugar de logo
  // Aseguramos compatibilidad aquí
  const displayImage = professional.photoURL || professional.logo || professional.image || '/assets/images/no_image.png';
  const displayName = professional.displayName || professional.name || 'Profesional sin nombre';
  const displayAddress = professional.address || `${professional.city || ''}, ${professional.province || ''}`;
  const servicesList = professional.services || [];
  const galleryImages = professional.images || [];

  return (
    <div className="min-h-screen bg-background">
      <AdaptiveHeader />
      
      <main className="pt-16">
        {/* Breadcrumb */}
        <div className="bg-surface border-b border-border-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => navigate('/')}
                className="text-text-secondary hover:text-primary transition-colors duration-200"
              >
                Inicio
              </button>
              <Icon name="ChevronRight" size={16} className="text-text-muted" />
              <button
                onClick={() => navigate('/professionals')}
                className="text-text-secondary hover:text-primary transition-colors duration-200"
              >
                Profesionales
              </button>
              <Icon name="ChevronRight" size={16} className="text-text-muted" />
              <span className="text-text-primary font-medium">{displayName}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div className="bg-surface rounded-xl p-6 shadow-sm border border-border-light">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-background border border-border-light">
                    <Image
                      src={displayImage}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
                        {displayName}
                      </h1>
                      
                      <div className="flex items-center space-x-2">
                        {/* Verificamos si existe el campo verified, sino asumimos false */}
                        {professional.verified && (
                          <div className="flex items-center space-x-1 bg-success-light text-success px-2 py-1 rounded-full text-sm">
                            <Icon name="CheckCircle" size={16} />
                            <span>Verificado</span>
                          </div>
                        )}
                        
                        <button
                          onClick={() => setShowReportDialog(true)}
                          className="p-2 rounded-full border border-border text-text-secondary hover:border-warning hover:text-warning transition-all duration-200"
                        >
                          <Icon name="Flag" size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-1">
                        {renderStars(professional.rating)}
                      </div>
                      <span className="text-lg font-semibold text-text-primary">
                        {professional.rating || 'N/A'}
                      </span>
                      <span className="text-text-secondary">
                        ({reviews.length} reseñas)
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-text-secondary">
                      <Icon name="MapPin" size={18} />
                      <span>{displayAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Emergency Badge */}
                {professional.emergencyAvailable && (
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-2 rounded-lg bg-error-light text-error border border-error/20 font-medium">
                      <Icon name="AlertCircle" size={18} className="mr-2" />
                      Urgencias 24 horas disponibles
                    </span>
                  </div>
                )}

                {/* Services */}
                {servicesList.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-heading font-semibold text-text-primary mb-3">
                      Servicios
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {servicesList.map((service) => (
                        <div
                          key={service}
                          className="flex items-center space-x-2 p-3 bg-background rounded-lg border border-border-light"
                        >
                          <Icon name={getServiceIcon(service)} size={18} className="text-secondary" />
                          <span className="text-sm font-medium text-text-primary">
                            {getServiceLabel(service)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Image Gallery */}
              {galleryImages.length > 0 && (
                <div className="bg-surface rounded-xl p-6 shadow-sm border border-border-light">
                  <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                    Galería
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Main Image */}
                    <div className="relative aspect-video bg-background rounded-lg overflow-hidden">
                      <Image
                        src={galleryImages[currentImageIndex]}
                        alt={`${displayName} - Imagen ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Navigation Arrows */}
                      {galleryImages.length > 1 && (
                        <>
                          <button
                            onClick={() => setCurrentImageIndex(
                              currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1
                            )}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
                          >
                            <Icon name="ChevronLeft" size={20} />
                          </button>
                          <button
                            onClick={() => setCurrentImageIndex(
                              currentImageIndex === galleryImages.length - 1 ? 0 : currentImageIndex + 1
                            )}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
                          >
                            <Icon name="ChevronRight" size={20} />
                          </button>
                        </>
                      )}

                      {/* Image Counter */}
                      <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {galleryImages.length}
                      </div>
                    </div>

                    {/* Thumbnail Gallery */}
                    {galleryImages.length > 1 && (
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {galleryImages.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                              currentImageIndex === index
                                ? 'border-primary shadow-md'
                                : 'border-border hover:border-primary-300'
                            }`}
                          >
                            <Image
                              src={image}
                              alt={`${displayName} - Miniatura ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="bg-surface rounded-xl p-6 shadow-sm border border-border-light">
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                  Sobre {displayName}
                </h3>
                <div className="prose prose-sm max-w-none text-text-secondary whitespace-pre-line">
                  {professional.description || professional.bio || 'Sin descripción disponible.'}
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-surface rounded-xl p-6 shadow-sm border border-border-light">
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                  Reseñas ({reviews.length})
                </h3>
                
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-border-light pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-text-primary">{review.userName}</span>
                              {review.verified && (
                                <Icon name="CheckCircle" size={14} className="text-success" />
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-text-secondary">
                                {formatDate(review.date)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-text-secondary">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                    <p className="text-text-muted text-sm">Aún no hay reseñas para este profesional.</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-surface rounded-xl p-6 shadow-sm border border-border-light sticky top-24">
                <h3 className="text-xl font-heading font-semibold text-text-primary mb-4">
                  Contactar
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="text-sm text-text-secondary">
                    Ponte en contacto con {displayName} para más información sobre sus servicios.
                  </div>
                  
                  <div className="space-y-3">
                    {(professional.whatsapp || professional.phone) && (
                      <button
                        onClick={handleWhatsApp}
                        className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-success text-white rounded-lg font-medium transition-all duration-200 hover:bg-success-600 focus:outline-none focus:ring-2 focus:ring-success-300 active:transform active:scale-95"
                      >
                        <Icon name="MessageCircle" size={20} />
                        <span>WhatsApp</span>
                      </button>
                    )}
                    
                    {professional.email && (
                      <button
                        onClick={handleEmail}
                        className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-border text-text-primary rounded-lg font-medium transition-all duration-200 hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary-300 active:transform active:scale-95"
                      >
                        <Icon name="Mail" size={20} />
                        <span>Email</span>
                      </button>
                    )}
                    
                    {professional.phone && (
                        <a
                        href={`tel:${professional.phone}`}
                        className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-border text-text-primary rounded-lg font-medium transition-all duration-200 hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary-300 active:transform active:scale-95"
                        >
                        <Icon name="Phone" size={20} />
                        <span>Llamar</span>
                        </a>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="pt-4 border-t border-border-light">
                  <div className="space-y-3 text-sm">
                    {professional.phone && (
                        <div className="flex items-center space-x-2">
                        <Icon name="Phone" size={16} className="text-text-muted" />
                        <span className="text-text-secondary">{professional.phone}</span>
                        </div>
                    )}
                    {professional.email && (
                        <div className="flex items-center space-x-2">
                        <Icon name="Mail" size={16} className="text-text-muted" />
                        <span className="text-text-secondary">{professional.email}</span>
                        </div>
                    )}
                    {professional.address && (
                        <div className="flex items-center space-x-2">
                        <Icon name="MapPin" size={16} className="text-text-muted" />
                        <span className="text-text-secondary">{professional.address}</span>
                        </div>
                    )}
                    {professional.website && (
                      <div className="flex items-center space-x-2">
                        <Icon name="Globe" size={16} className="text-text-muted" />
                        <a
                          href={professional.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-600 transition-colors duration-200"
                        >
                          Sitio web
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Opening Hours */}
              {professional.openingHours && (
                  <div className="bg-surface rounded-xl p-6 shadow-sm border border-border-light">
                    <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                      Horarios
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(professional.openingHours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between text-sm">
                          <span className="text-text-secondary">{getDayLabel(day)}:</span>
                          <span className={`font-medium ${hours === 'Cerrado' ? 'text-error' : 'text-text-primary'}`}>
                            {hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Share Card */}
              <div className="bg-surface rounded-xl p-6 shadow-sm border border-border-light">
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                  Compartir
                </h3>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: displayName,
                        text: `Conoce a ${displayName}`,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Enlace copiado al portapapeles');
                    }
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-border text-text-secondary rounded-lg hover:bg-surface-hover transition-all duration-200"
                >
                  <Icon name="Share2" size={16} />
                  <span>Compartir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Report Dialog */}
      <ConfirmDialog
        isOpen={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        onConfirm={handleReport}
        title="Reportar profesional"
        message="¿Por qué quieres reportar este profesional?"
        confirmText="Enviar reporte"
        cancelText="Cancelar"
        type="warning"
      >
        <div className="mt-4">
          <select
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className="input-field w-full"
          >
            <option value="">Selecciona un motivo</option>
            <option value="inappropriate_content">Contenido inapropiado</option>
            <option value="false_information">Información falsa</option>
            <option value="spam">Spam</option>
            <option value="unprofessional_behavior">Comportamiento no profesional</option>
            <option value="other">Otro</option>
          </select>
        </div>
      </ConfirmDialog>
    </div>
  );
};

export default ProfessionalDetail;
