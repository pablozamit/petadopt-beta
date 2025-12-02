import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebaseConfig'; // Asegúrate que la ruta es correcta
import { useAuth } from 'hooks/useAuth';

import AdaptiveHeader from 'components/ui/AdaptiveHeader';
import BreadcrumbNavigation from 'components/ui/BreadcrumbNavigation';
import Icon from 'components/AppIcon';
import LoadingSpinner from 'components/ui/LoadingSpinner'; // Importamos el spinner real
import PetImageUpload from './components/PetImageUpload';
import PetFormFields from './components/PetFormFields';
import PetTagsSection from './components/PetTagsSection';
import FormActions from './components/FormActions';

const AddEditPetForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  const isEdit = searchParams.get('edit') === 'true' || !!searchParams.get('id');
  const petId = searchParams.get('id');

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    species: '',
    size: '',
    province: '',
    description: '',
    images: [],
    imageFiles: [], // Archivos nuevos a subir
    primaryImageIndex: 0,
    // Convivencia
    compatibility: {
      dogs: false, // Inicializamos en false o null según prefieras
      cats: false,
      children: false,
      otherPets: false
    },
    // Necesidades especiales
    specialNeeds: {
      hasSpecialNeeds: false,
      medication: false,
      specialDiet: false,
      physicalDisability: false,
      behavioralNeeds: false,
      details: ''
    },
    tags: {
      vaccinated: false,
      sterilized: false,
      sociable: false,
      urgent: false
    }
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // 1. Cargar datos si es edición
  useEffect(() => {
    if (authLoading) return;
    
    // Si no hay usuario, mandamos al login
    if (!user) {
      navigate('/authentication-login-register');
      return;
    }

    const fetchPetData = async () => {
      if (isEdit && petId) {
        setIsLoading(true);
        try {
          const docRef = doc(db, "pets", petId);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            
            // SEGURIDAD: Verificamos que la mascota pertenezca a este usuario
            if (data.shelterId !== user.uid) {
              alert("No tienes permiso para editar esta mascota");
              navigate('/shelter-dashboard');
              return;
            }

            setFormData(prev => ({
              ...prev,
              ...data,
              imageFiles: [], // Reiniciamos archivos nuevos al cargar
              // Fusionamos objetos para asegurar que no falten campos nuevos
              compatibility: { ...prev.compatibility, ...data.compatibility },
              specialNeeds: { ...prev.specialNeeds, ...data.specialNeeds },
              tags: { ...prev.tags, ...data.tags }
            }));
          } else {
            alert("Mascota no encontrada");
            navigate('/shelter-dashboard');
          }
        } catch (error) {
          console.error("Error cargando mascota:", error);
          alert("Error al cargar los datos de la mascota.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPetData();
  }, [isEdit, petId, user, authLoading, navigate]);

  // 2. Validación
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.age) newErrors.age = 'La edad es obligatoria';
    if (!formData.species) newErrors.species = 'La especie es obligatoria';
    if (!formData.size) newErrors.size = 'El tamaño es obligatorio';
    if (!formData.province) newErrors.province = 'La provincia es obligatoria';
    if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria';
    
    if (formData.images.length === 0 && formData.imageFiles.length === 0) {
       // Si no hay imágenes en pantalla ni archivos nuevos
       newErrors.images = 'Debe subir al menos una imagen';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const handleTagChange = (tag, value) => {
    setFormData(prev => ({
      ...prev,
      tags: { ...prev.tags, [tag]: value }
    }));
  };

  const handleImageUpload = (newImages, newFiles, indexToRemove) => {
    if (indexToRemove !== undefined) {
      // Eliminar imagen
      setFormData(prev => {
        const updatedImages = prev.images.filter((_, i) => i !== indexToRemove);
        // Nota: Eliminar del array imageFiles es complejo sin un ID mapping, 
        // pero para este MVP asumimos que se suben todos los files pendientes.
        return { ...prev, images: updatedImages };
      });
    } else {
      // Añadir imagen
      setFormData(prev => ({
        ...prev,
        images: newImages, // Actualiza las previsualizaciones
        imageFiles: newFiles ? [...prev.imageFiles, ...newFiles] : prev.imageFiles
      }));
    }
    if (errors.images) setErrors(prev => ({ ...prev, images: '' }));
  };

  // 3. Subida de Imágenes a Storage
  const uploadImagesToFirebase = async () => {
    const uploadedUrls = [];
    
    // a) Conservar imágenes que ya son URLs remotas (empiezan por http/https)
    // y filtrar las que son blobs locales (previsualizaciones)
    for (const imgUrl of formData.images) {
      if (typeof imgUrl === 'string' && imgUrl.startsWith('http')) {
        uploadedUrls.push(imgUrl);
      }
    }

    // b) Subir los nuevos archivos
    if (formData.imageFiles && formData.imageFiles.length > 0) {
        for (const file of formData.imageFiles) {
            // Ruta: pets / UID_USUARIO / TIMESTAMP_NOMBRE
            const storageRef = ref(storage, `pets/${user.uid}/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            uploadedUrls.push(url);
        }
    }

    return uploadedUrls;
  };

  // 4. Guardado final (Publish)
  const handlePublish = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      // a) Subir fotos primero
      const finalImageUrls = await uploadImagesToFirebase();

      // b) Preparar objeto para Firestore
      const petData = {
        name: formData.name,
        age: formData.age,
        ageCategory: formData.age, // Mantenemos redundancia si tu esquema lo usaba
        species: formData.species,
        size: formData.size,
        province: formData.province,
        description: formData.description,
        images: finalImageUrls,
        primaryImageIndex: 0, // Por simplicidad, siempre la primera
        compatibility: formData.compatibility,
        specialNeeds: formData.specialNeeds,
        tags: formData.tags,
        shelterId: user.uid,
        shelterName: user.displayName || 'Refugio', // Fallback si no hay nombre
        status: 'active',
        updatedAt: new Date().toISOString()
      };

      if (!isEdit) {
        // CREAR
        petData.createdAt = new Date().toISOString();
        // Inicializar contadores o campos extra si fuera necesario
        await addDoc(collection(db, "pets"), petData);
      } else {
        // ACTUALIZAR
        await updateDoc(doc(db, "pets", petId), petData);
      }
      
      setShowSuccessMessage(true);
      // Redirigir tras 1.5 segundos
      setTimeout(() => navigate('/shelter-dashboard'), 1500);
      
    } catch (error) {
      console.error('Error publicando mascota:', error);
      alert("Hubo un error al guardar. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => navigate('/shelter-dashboard');

  const getFormProgress = () => {
    const requiredFields = ['name', 'age', 'species', 'size', 'province', 'description'];
    const filledFields = requiredFields.filter(field => formData[field] && formData[field].toString().trim());
    const hasImages = formData.images.length > 0;
    return Math.round(((filledFields.length + (hasImages ? 1 : 0)) / (requiredFields.length + 1)) * 100);
  };

  // Renderizado condicional de carga de auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdaptiveHeader />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation />
          
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-text-primary">
              {isEdit ? 'Editar Mascota' : 'Añadir Nueva Mascota'}
            </h1>
            <div className="mt-4 w-full h-2 bg-surface rounded-full overflow-hidden">
               <div className="h-full bg-primary transition-all duration-300" style={{ width: `${getFormProgress()}%` }} />
            </div>
          </div>

          {showSuccessMessage && (
            <div className="mb-6 p-4 bg-success-light border border-success rounded-lg flex items-center space-x-3 animate-fade-in">
              <Icon name="CheckCircle" size={20} className="text-success" />
              <span className="text-success font-medium">¡Mascota guardada correctamente!</span>
            </div>
          )}

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="card p-6">
              <h2 className="text-xl font-heading font-semibold text-text-primary mb-6 flex items-center space-x-2">
                <Icon name="Info" size={20} className="text-primary" /><span>Información Básica</span>
              </h2>
              <PetFormFields formData={formData} errors={errors} onChange={handleInputChange} />
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-heading font-semibold text-text-primary mb-6 flex items-center space-x-2">
                <Icon name="Camera" size={20} className="text-primary" /><span>Fotografías</span>
              </h2>
              <PetImageUpload
                images={formData.images}
                imageFiles={formData.imageFiles}
                onImagesChange={handleImageUpload}
                onPrimaryImageChange={(idx) => setFormData(prev => ({...prev, primaryImageIndex: idx}))}
                error={errors.images}
              />
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-heading font-semibold text-text-primary mb-6 flex items-center space-x-2">
                <Icon name="Tags" size={20} className="text-primary" /><span>Características</span>
              </h2>
              <PetTagsSection tags={formData.tags} onChange={handleTagChange} />
            </div>

            <FormActions
              isEdit={isEdit}
              isLoading={isLoading}
              onPublish={handlePublish}
              onCancel={handleCancel}
              onSaveDraft={() => alert("Función de borrador próximamente")} 
            />
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddEditPetForm;
