import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebaseConfig';
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
    images: [],
    imageFiles: [],
    primaryImageIndex: 0,
    // NUEVO - Convivencia
    compatibility: {
      dogs: null,
      cats: null,
      children: null,
      otherPets: null
    },
    // NUEVO - Necesidades especiales
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
              imageFiles: [],
              // Asegurar que los nuevos campos existan
              compatibility: data.compatibility || {
                dogs: null,
                cats: null,
                children: null,
                otherPets: null
              },
              specialNeeds: data.specialNeeds || {
                hasSpecialNeeds: false,
                medication: false,
                specialDiet: false,
                physicalDisability: false,
                behavioralNeeds: false,
                details: ''
              }
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
      setFormData(prev => {
        const updatedImages = prev.images.filter((_, i) => i !== indexToRemove);
        return { ...prev, images: updatedImages };
      });
    } else {
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
    
    for (const imgUrl of formData.images) {
      if (imgUrl.startsWith('http')) {
        uploadedUrls.push(imgUrl);
      }
    }

    const newUrls = [];
    if (formData.imageFiles && formData.imageFiles.length > 0) {
        for (const file of formData.imageFiles) {
            const storageRef = ref(storage, `pets/${user.uid}/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            newUrls.push(url);
        }
    }

    const finalImages = formData.images.filter(img => img.startsWith('http')).concat(newUrls);
    return finalImages;
  };

  const handlePublish = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const finalImageUrls = await uploadImagesToFirebase();

      const petData = {
        name: formData.name,
        age: formData.age,
        ageCategory: formData.age,
        species: formData.species,
        size: formData.size,
        province: formData.province,
        description: formData.description,
        images: finalImageUrls,
        primaryImageIndex: 0,
        compatibility: formData.compatibility,
        specialNeeds: formData.specialNeeds,
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
      setTimeout(() => navigate('/shelter-dashboard'), 1000);
      
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
              onSaveDraft={() => alert("Función de borrador próximamente")} 
            />
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddEditPetForm;
