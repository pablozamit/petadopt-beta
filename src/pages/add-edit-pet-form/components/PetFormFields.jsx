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

      {/* NUEVO - Convivencia */}
      <div className="lg:col-span-2">
        <label className="block text-sm font-medium text-text-primary mb-3">
          Convivencia
        </label>
        <p className="text-sm text-text-secondary mb-4">
          ¿Con quién puede convivir esta mascota?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Con perros */}
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary flex items-center space-x-2">
                <Icon name="Dog" size={16} />
                <span>Con perros</span>
              </span>
            </div>
            <select
              value={formData.compatibility?.dogs ?? ''}
              onChange={(e) => onChange('compatibility', {
                ...formData.compatibility,
                dogs: e.target.value === '' ? null : e.target.value === 'true'
              })}
              className="input-field text-sm"
            >
              <option value="">No especificado</option>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* Con gatos */}
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary flex items-center space-x-2">
                <Icon name="Cat" size={16} />
                <span>Con gatos</span>
              </span>
            </div>
            <select
              value={formData.compatibility?.cats ?? ''}
              onChange={(e) => onChange('compatibility', {
                ...formData.compatibility,
                cats: e.target.value === '' ? null : e.target.value === 'true'
              })}
              className="input-field text-sm"
            >
              <option value="">No especificado</option>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* Con niños */}
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary flex items-center space-x-2">
                <Icon name="Users" size={16} />
                <span>Con niños</span>
              </span>
            </div>
            <select
              value={formData.compatibility?.children ?? ''}
              onChange={(e) => onChange('compatibility', {
                ...formData.compatibility,
                children: e.target.value === '' ? null : e.target.value === 'true'
              })}
              className="input-field text-sm"
            >
              <option value="">No especificado</option>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
      </div>

      {/* NUEVO - Necesidades Especiales */}
      <div className="lg:col-span-2">
        <label className="block text-sm font-medium text-text-primary mb-3">
          Necesidades Especiales
        </label>
        
        <div className="space-y-4">
          {/* Toggle principal */}
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
            <div className="flex items-center space-x-3">
              <Icon name="Heart" size={20} className="text-accent" />
              <div>
                <p className="font-medium text-text-primary">¿Tiene necesidades especiales?</p>
                <p className="text-sm text-text-secondary">Medicación, dieta, discapacidad, etc.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChange('specialNeeds', {
                ...formData.specialNeeds,
                hasSpecialNeeds: !formData.specialNeeds?.hasSpecialNeeds
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.specialNeeds?.hasSpecialNeeds ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.specialNeeds?.hasSpecialNeeds ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Detalles si tiene necesidades especiales */}
          {formData.specialNeeds?.hasSpecialNeeds && (
            <div className="ml-4 space-y-3 pl-4 border-l-2 border-accent">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.specialNeeds?.medication || false}
                  onChange={(e) => onChange('specialNeeds', {
                    ...formData.specialNeeds,
                    medication: e.target.checked
                  })}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-text-primary">Requiere medicación</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.specialNeeds?.specialDiet || false}
                  onChange={(e) => onChange('specialNeeds', {
                    ...formData.specialNeeds,
                    specialDiet: e.target.checked
                  })}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-text-primary">Dieta especial</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.specialNeeds?.physicalDisability || false}
                  onChange={(e) => onChange('specialNeeds', {
                    ...formData.specialNeeds,
                    physicalDisability: e.target.checked
                  })}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-text-primary">Discapacidad física</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.specialNeeds?.behavioralNeeds || false}
                  onChange={(e) => onChange('specialNeeds', {
                    ...formData.specialNeeds,
                    behavioralNeeds: e.target.checked
                  })}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-text-primary">Necesidades de comportamiento</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Detalles adicionales
                </label>
                <textarea
                  value={formData.specialNeeds?.details || ''}
                  onChange={(e) => onChange('specialNeeds', {
                    ...formData.specialNeeds,
                    details: e.target.value
                  })}
                  rows={3}
                  className="input-field resize-none text-sm"
                  placeholder="Describe las necesidades especiales con más detalle..."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetFormFields;
