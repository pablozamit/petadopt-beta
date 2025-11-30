import React from 'react';
import Icon from 'components/AppIcon';

const PetFormFields = ({ formData, errors, onChange }) => {
  // Opciones sincronizadas con el PDF
  const ageOptions = [
    { value: 'puppy_junior', label: 'Cachorro / Junior (0-1 año)' },
    { value: 'young', label: 'Joven (1-3 años)' },
    { value: 'adult', label: 'Adulto (3-7 años)' },
    { value: 'senior', label: 'Senior (+7 años)' }
  ];

  const speciesOptions = [
    { value: 'dog', label: 'Perro', icon: 'Dog' },
    { value: 'cat', label: 'Gato', icon: 'Cat' },
    { value: 'other', label: 'Otro', icon: 'Rabbit' }
  ];

  const sizeOptions = [
    { value: 'small', label: 'Pequeño', description: 'Hasta 10 kg (Ej: Yorkshire, Gatos)' },
    { value: 'medium', label: 'Mediano', description: '10-25 kg (Ej: Beagle)' },
    { value: 'large', label: 'Grande', description: '25-40 kg (Ej: Pastor Alemán)' },
    { value: 'giant', label: 'Muy grande', description: '+40 kg (Ej: Mastín)' }
  ];

  const spanishProvinces = [
    'A Coruña', 'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz',
    'Baleares', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real',
    'Córdoba', 'Cuenca', 'Girona', 'Granada', 'Guadalajara', 'Gipuzkoa', 'Huelva', 'Huesca',
    'Jaén', 'La Rioja', 'Las Palmas', 'León', 'Lleida', 'Lugo', 'Madrid', 'Málaga', 'Murcia',
    'Navarra', 'Ourense', 'Palencia', 'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife',
    'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid',
    'Vizcaya', 'Zamora', 'Zaragoza'
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pet Name */}
      <div className="lg:col-span-2">
        <label className="block text-sm font-medium text-text-primary mb-2">
          Nombre de la mascota *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          className={`input-field ${errors.name ? 'border-error focus:ring-error-light' : ''}`}
          placeholder="Ej: Luna, Max, Mia..."
        />
        {errors.name && (
          <p className="mt-1 text-sm text-error flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.name}</span>
          </p>
        )}
      </div>

      {/* Age */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Edad *
        </label>
        <select
          value={formData.age}
          onChange={(e) => onChange('age', e.target.value)}
          className={`input-field ${errors.age ? 'border-error focus:ring-error-light' : ''}`}
        >
          <option value="">Selecciona la edad</option>
          {ageOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.age && (
          <p className="mt-1 text-sm text-error flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.age}</span>
          </p>
        )}
      </div>

      {/* Species */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Especie *
        </label>
        <div className="grid grid-cols-3 gap-2">
          {speciesOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange('species', option.value)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                formData.species === option.value
                  ? 'border-primary bg-primary-50 text-primary' :'border-border hover:border-primary-300 hover:bg-surface'
              }`}
            >
              <Icon name={option.icon} size={20} />
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
        {errors.species && (
          <p className="mt-1 text-sm text-error flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.species}</span>
          </p>
        )}
      </div>

      {/* Size */}
      <div className="lg:col-span-2">
        <label className="block text-sm font-medium text-text-primary mb-2">
          Tamaño *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {sizeOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange('size', option.value)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                formData.size === option.value
                  ? 'border-primary bg-primary-50' :'border-border hover:border-primary-300 hover:bg-surface'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-medium ${
                  formData.size === option.value ? 'text-primary' : 'text-text-primary'
                }`}>
                  {option.label}
                </span>
                {formData.size === option.value && (
                  <Icon name="Check" size={16} className="text-primary" />
                )}
              </div>
              <p className="text-sm text-text-secondary">{option.description}</p>
            </button>
          ))}
        </div>
        {errors.size && (
          <p className="mt-1 text-sm text-error flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.size}</span>
          </p>
        )}
      </div>

      {/* Province */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Provincia *
        </label>
        <select
          value={formData.province}
          onChange={(e) => onChange('province', e.target.value)}
          className={`input-field ${errors.province ? 'border-error focus:ring-error-light' : ''}`}
        >
          <option value="">Selecciona la provincia</option>
          {spanishProvinces.map(province => (
            <option key={province.toLowerCase()} value={province.toLowerCase()}>
              {province}
            </option>
          ))}
        </select>
        {errors.province && (
          <p className="mt-1 text-sm text-error flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.province}</span>
          </p>
        )}
      </div>

      {/* Description */}
      <div className="lg:col-span-2">
        <label className="block text-sm font-medium text-text-primary mb-2">
          Descripción *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          rows={6}
          className={`input-field resize-none ${errors.description ? 'border-error focus:ring-error-light' : ''}`}
          placeholder={`Describe la personalidad, comportamiento y necesidades de la mascota...

Ejemplo:
- Personalidad: Cariñoso, juguetón, tranquilo
- Comportamiento con otros animales y niños
- Necesidades especiales o cuidados
- Historia o situación actual`}
        />
        <div className="flex items-center justify-between mt-2">
          {errors.description ? (
            <p className="text-sm text-error flex items-center space-x-1">
              <Icon name="AlertCircle" size={14} />
              <span>{errors.description}</span>
            </p>
          ) : (
            <p className="text-sm text-text-secondary">
              Mínimo 50 caracteres para una descripción completa
            </p>
          )}
          <span className={`text-sm ${
            formData.description.length < 50 ? 'text-warning' : 'text-success'
          }`}>
            {formData.description.length} caracteres
          </span>
        </div>
      </div>
    </div>
  );
};

export default PetFormFields;
