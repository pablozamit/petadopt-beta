import React, { useState, useRef } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

// CORRECCIÓN: Añadimos 'primaryImageIndex' a las props recibidas
const PetImageUpload = ({ images, imageFiles, onImagesChange, onPrimaryImageChange, primaryImageIndex, error }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles.length > 0) {
      // 1. Crear URLs de previsualización
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      const updatedImages = [...images, ...newPreviews];
      
      // 2. Guardar los archivos reales
      const updatedFiles = [...(imageFiles || []), ...validFiles];

      if (updatedImages.length <= 6) {
        onImagesChange(updatedImages, updatedFiles);
      } else {
        alert("Máximo 6 imágenes permitidas");
      }
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages, null, index);
    
    // Ajustar el índice principal si borramos una imagen
    // Usamos 'primaryImageIndex' de las props, que ahora sí existe
    if (primaryImageIndex >= newImages.length) {
      onPrimaryImageChange(Math.max(0, newImages.length - 1));
    } else if (primaryImageIndex === index) {
      onPrimaryImageChange(0);
    } else if (primaryImageIndex > index) {
      onPrimaryImageChange(primaryImageIndex - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-primary bg-primary-50'
            : error
            ? 'border-error bg-error-light' :'border-border hover:border-primary-300 hover:bg-surface'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
            dragActive ? 'bg-primary text-white' : 'bg-surface text-primary'
          }`}>
            <Icon name="Upload" size={24} />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-2">Subir fotografías</h3>
            <p className="text-text-secondary mb-4">Arrastra las imágenes aquí o haz clic para seleccionar</p>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-outline">
              <Icon name="Plus" size={16} className="mr-2" />
              Seleccionar imágenes
            </button>
          </div>
          
          <div className="text-sm text-text-muted">
            <p>• Máximo 6 imágenes</p>
            <p>• Formatos: JPG, PNG, WebP</p>
            <p>• Tamaño máximo: 5MB</p>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-error flex items-center space-x-1">
          <Icon name="AlertCircle" size={14} /><span>{error}</span>
        </p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className={`relative group rounded-lg overflow-hidden border-2 ${primaryImageIndex === index ? 'border-primary shadow-md' : 'border-border'}`}>
              <div className="aspect-square">
                <Image src={image} alt={`Pet ${index}`} className="w-full h-full object-cover" />
              </div>
              {primaryImageIndex === index && (
                <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded text-xs font-medium flex items-center space-x-1">
                  <Icon name="Star" size={12} /><span>Principal</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                {primaryImageIndex !== index && (
                  <button type="button" onClick={() => onPrimaryImageChange(index)} className="bg-white text-text-primary p-2 rounded-full hover:bg-primary hover:text-white">
                    <Icon name="Star" size={16} />
                  </button>
                )}
                <button type="button" onClick={() => removeImage(index)} className="bg-white text-error p-2 rounded-full hover:bg-error hover:text-white">
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PetImageUpload;
