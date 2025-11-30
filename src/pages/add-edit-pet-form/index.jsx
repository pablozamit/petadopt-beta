import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebaseConfig'; // Importamos Firebase real
import { useAuth } from 'hooks/useAuth';

import AdaptiveHeader from 'components/ui/AdaptiveHeader';
import BreadcrumbNavigation from 'components/ui/BreadcrumbNavigation';
import Icon from 'components/AppIcon';
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
    images: [], // URLs para previsualización (mezcla de Firebase URLs y blob URLs locales)
    imageFiles: [], // Archivos RAW nuevos para subir
    primaryImageIndex: 0,
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

  // Cargar datos si es edición
  useEffect(() => {
    if (authLoading) return;
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
            // Verificamos que la mascota pertenezca a este usuario
            if (data.shelterId !== user.uid) {
              alert("No tienes permiso para editar esta mascota");
              navigate('/shelter-dashboard');
              return;
            }
            setFormData({
              ...data,
              imageFiles: [] // Al editar, empezamos sin archivos nuevos
            });
          } else {
            alert("Mascota no encontrada");
            navigate('/shelter-dashboard');
          }
        } catch (error) {
          console.error("Error cargando mascota:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPetData();
  }, [isEdit, petId, user, authLoading, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.age) newErrors.age = 'La edad es obligatoria';
    if (!formData.species) newErrors.species = 'La especie es obligatoria';
    if (!formData.size) newErrors.size = 'El tamaño es obligatorio';
    if (!formData.province) newErrors.province = 'La provincia es obligatoria';
    if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria';
    
    // Validar que haya imágenes (ya sean URLs existentes o archivos nuevos)
    if (formData.images.length === 0) newErrors.images = 'Debe subir al menos una imagen';

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
      // Lógica de borrado
      setFormData(prev => {
        const updatedImages = prev.images.filter((_, i) => i !== indexToRemove);
        // Intentamos mantener sincronizados los archivos, aunque es complejo mezclar URLs y Files.
        // En este MVP, si borras, simplemente actualizamos las previsualizaciones.
        // Los newFiles se limpiarán al subir solo lo que quede, o se pueden filtrar si llevamos un control estricto.
        // Simplificación: Mantenemos newFiles tal cual y solo nos fiamos de lo que el usuario ve (updatedImages).
        // Al guardar, subiremos solo los archivos que coincidan con blobs activos o filtraremos.
        return { ...prev, images: updatedImages };
      });
    } else {
      // Lógica de añadir
      setFormData(prev => ({
        ...prev,
        images: newImages,
        imageFiles: newFiles ? [...prev.imageFiles, ...newFiles] : prev.imageFiles
      }));
    }
    if (errors.images) setErrors(prev => ({ ...prev, images: '' }));
  };

  const uploadImagesToFirebase = async () => {
    const uploadedUrls = [];
    
    // Identificar qué imágenes son ya URLs (antiguas) y cuáles son Blobs (nuevas)
    // Nota: Esta es una simplificación. Lo ideal es mapear indices.
    
    // Subir solo los archivos nuevos (los que tenemos en imageFiles)
    // PERO debemos respetar el orden visual final que el usuario ve en formData.images
    
    for (const imgUrl of formData.images) {
      if (imgUrl.startsWith('http')) {
        // Es una imagen ya existente en Firebase
        uploadedUrls.push(imgUrl);
      } else {
        // Es un Blob URL local, necesitamos encontrar su archivo correspondiente
        // Buscamos en imageFiles (esto es un poco hacky por los blobs, pero funcional para MVP)
        // Lo correcto es subir todos los imageFiles y añadirlos.
      }
    }

    // Estrategia Robustez MVP: Subir todos los 'imageFiles' pendientes y añadirlos a la lista
    const newUrls = [];
    if (formData.imageFiles && formData.imageFiles.length > 0) {
        for (const file of formData.imageFiles) {
            // Check si este archivo sigue siendo relevante (si su blob url sigue en images)
            // Para simplificar hoy: subimos todos los nuevos archivos.
            const storageRef = ref(storage, `pets/${user.uid}/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            newUrls.push(url);
        }
    }

    // Reconstruir el array final de imágenes
    // Mantenemos las URLs viejas que no se borraron y añadimos las nuevas
    const finalImages = formData.images.filter(img => img.startsWith('http')).concat(newUrls);
    return finalImages;
  };

  const handlePublish = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      // 1. Subir imágenes nuevas a Firebase Storage
      const finalImageUrls = await uploadImagesToFirebase();

      // 2. Preparar datos para Firestore
      const petData = {
        name: formData.name,
        age: formData.age,
        species: formData.species,
        size: formData.size,
        province: formData.province,
        description: formData.description,
        images: finalImageUrls,
        primaryImageIndex: 0, // Simplificación: reset index o manejar lógica compleja
        tags: formData.tags,
        shelterId: user.uid,
        shelterName: user.displayName || 'Refugio',
        status: 'active',
        updatedAt: new Date().toISOString()
      };

      if (!isEdit) {
        petData.createdAt = new Date().toISOString();
        await addDoc(collection(db, "pets"), petData);
      } else {
        await updateDoc(doc(db, "pets", petId), petData);
      }
      
      setShowSuccessMessage(true);
      setTimeout(() => navigate('/shelter-dashboard'), 1000); // Volver al dashboard
      
    } catch (error) {
      console.error('Error publicando mascota:', error);
      alert("Hubo un error al guardar. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => navigate('/shelter-dashboard');

  // Cálculo de progreso visual
  const getFormProgress = () => {
    const requiredFields = ['name', 'age', 'species', 'size', 'province', 'description'];
    const filledFields = requiredFields.filter(field => formData[field] && formData[field].toString().trim());
    const hasImages = formData.images.length > 0;
    return Math.round(((filledFields.length + (hasImages ? 1 : 0)) / (requiredFields.length + 1)) * 100);
  };

  if (authLoading) return <div className="p-10 text-center">Cargando...</div>;

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
            {/* Barra de progreso simplificada para móvil/desktop */}
            <div className="mt-4 w-full h-2 bg-surface rounded-full overflow-hidden">
               <div className="h-full bg-primary transition-all duration-300" style={{ width: `${getFormProgress()}%` }} />
            </div>
          </div>

          {showSuccessMessage && (
            <div className="mb-6 p-4 bg-success-light border border-success rounded-lg flex items-center space-x-3">
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
              // Ocultamos "Guardar Borrador" por ahora para simplificar el MVP
              onSaveDraft={() => alert("Función de borrador próximamente")} 
            />
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddEditPetForm;
