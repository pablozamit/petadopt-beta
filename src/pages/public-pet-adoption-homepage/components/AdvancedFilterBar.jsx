import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import { SPANISH_PROVINCES } from 'utils/constants';

const AdvancedFilterBar = ({ filters, onFilterChange, resultsCount, onResetFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const speciesOptions = [
    { value: '', label: 'Todas las especies' },
    { value: 'Dog', label: 'Perros' },
    { value: 'Cat', label: 'Gatos' },
    { value: 'Other', label: 'Otros' }
  ];

  // ✅ ACTUALIZADO: Categorías de edad según PDF
  const ageOptions = [
    { value: '', label: 'Todas las edades' },
    { value: 'Puppy', label: 'Cachorro (0-1 año)' },
    { value: 'Young', label: 'Joven (1-3 años)' },
    { value: 'Adult', label: 'Adulto (3-7 años)' },
    { value: 'Senior', label: 'Senior (+7 años)' }
  ];

  // ✅ ACTUALIZADO: Categorías de tamaño según PDF
  const sizeOptions = [
    { value: '', label: 'Todos los tamaños' },
    { value: 'Small', label: 'Pequeño (<10kg)' },
    { value: 'Medium', label: 'Mediano (10-25kg)' },
    { value: 'Large', label: 'Grande (25-40kg)' },
    { value: 'Giant', label: 'Gigante (>40kg)' }
  ];

  const breedOptions = {
    Dog: [
      'Mestizo', 'Labrador', 'Golden Retriever', 'Pastor Alemán', 'Bulldog Francés',
      'Chihuahua', 'Yorkshire Terrier', 'Boxer', 'Cocker Spaniel', 'Beagle',
      'Border Collie', 'Husky Siberiano', 'Rottweiler', 'Dálmata', 'Galgo'
    ],
    Cat: [
      'Mestizo', 'Persa', 'Siamés', 'Maine Coon', 'Ragdoll',
      'British Shorthair', 'Bengalí', 'Abisinio', 'Ruso Azul', 'Sphynx'
    ],
    Other: [
      'Conejo', 'Hurón', 'Cobaya', 'Hámster', 'Chinchilla', 'Loro', 'Canario'
    ]
  };

  const healthStatusOptions = [
    { value: '', label: 'Cualquier estado' },
    { value: 'healthy', label: 'Saludable' },
    { value: 'special_needs', label: 'Necesidades especiales' },
    { value: 'recovering', label: 'En recuperación' }
  ];

  const provinceOptions = [
    { value: '', label: 'Todas las provincias' },
    ...SPANISH_PROVINCES.map(province => ({
      value: province.toLowerCase(),
      label: province
    }))
  ];

  const hasActiveFilters = Object.values(filters).some(filter => 
    filter !== '' && filter !== false && 
    (Array.isArray(filter) ? filter.length > 0 : true)
  );

  const getActiveFilterCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'tags' && Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== false;
    }).length;
  };

  const handleTagToggle = (tag) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    onFilterChange('tags', newTags);
  };

  const availableBreeds = filters.species ? breedOptions[filters.species] || [] : [];

  return (
    <div id="filter-section" className="bg-surface border-b border-border-light shadow-sm sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden py-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:bg-surface-hover transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <Icon name="Filter" size={20} className="text-primary" />
              <span className="font-medium text-text-primary">
                Filtros {hasActiveFilters && `(${getActiveFilterCount()})`}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary">
                {resultsCount} resultados
              </span>
              <Icon 
                name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                size={20} 
                className="text-text-secondary" 
              />
            </div>
          </button>
        </div>

        {/* Filter Controls */}
        <div className={`${isExpanded ? 'block' : 'hidden'} lg:block py-6`}>
          {/* Basic Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
            {/* Species */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Especie
              </label>
              <select
                value={filters.species || ''}
                onChange={(e) => {
                  onFilterChange('species', e.target.value);
                  onFilterChange('breed', ''); // Reset breed when species changes
                }}
                className="input-field text-sm"
              >
                {speciesOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Edad
              </label>
              <select
                value={filters.age || ''}
                onChange={(e) => onFilterChange('age', e.target.value)}
                className="input-field text-sm"
              >
                {ageOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Tamaño
              </label>
              <select
                value={filters.size || ''}
                onChange={(e) => onFilterChange('size', e.target.value)}
                className="input-field text-sm"
              >
                {sizeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Province */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Provincia
              </label>
              <select
                value={filters.province || ''}
                onChange={(e) => onFilterChange('province', e.target.value)}
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
            <div className="flex items-end">
              <div className="w-full">
                {hasActiveFilters && (
                  <button
                    onClick={onResetFilters}
                    className="w-full btn-outline text-sm py-2 px-4 mb-2 flex items-center justify-center space-x-2"
                  >
                    <Icon name="X" size={16} />
                    <span>Limpiar</span>
                  </button>
                )}
                <div className="text-center">
                  <span className="text-sm font-medium text-text-primary">
                    {resultsCount} {resultsCount === 1 ? 'mascota' : 'mascotas'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2 text-primary hover:text-primary-600 transition-colors duration-200"
            >
              <Icon name={showAdvanced ? "ChevronUp" : "ChevronDown"} size={16} />
              <span className="text-sm font-medium">Filtros avanzados</span>
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="bg-background rounded-lg p-4 border border-border-light space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Buscar
                  </label>
                  <div className="relative">
                    <Icon 
                      name="Search" 
                      size={16} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" 
                    />
                    <input
                      type="text"
                      placeholder="Nombre, raza..."
                      value={filters.search || ''}
                      onChange={(e) => onFilterChange('search', e.target.value)}
                      className="input-field pl-10 text-sm"
                    />
                    {filters.search && (
                      <button
                        onClick={() => onFilterChange('search', '')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors duration-200"
                      >
                        <Icon name="X" size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Breed */}
                {filters.species && availableBreeds.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Raza
                    </label>
                    <select
                      value={filters.breed || ''}
                      onChange={(e) => onFilterChange('breed', e.target.value)}
                      className="input-field text-sm"
                    >
                      <option value="">Todas las razas</option>
                      {availableBreeds.map(breed => (
                        <option key={breed} value={breed}>
                          {breed}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Health Status */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Estado de salud
                  </label>
                  <select
                    value={filters.healthStatus || ''}
                    onChange={(e) => onFilterChange('healthStatus', e.target.value)}
                    className="input-field text-sm"
                  >
                    {healthStatusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Sexo
                  </label>
                  <select
                    value={filters.gender || ''}
                    onChange={(e) => onFilterChange('gender', e.target.value)}
                    className="input-field text-sm"
                  >
                    <option value="">Cualquiera</option>
                    <option value="male">Macho</option>
                    <option value="female">Hembra</option>
                  </select>
                </div>
              </div>

              {/* Tags/Characteristics */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Características especiales
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[
                    { key: 'good_with_kids', label: 'Bueno con niños', icon: 'Baby' },
                    { key: 'good_with_pets', label: 'Bueno con mascotas', icon: 'PawPrint' },
                    { key: 'house_trained', label: 'Educado en casa', icon: 'Home' },
                    { key: 'sterilized', label: 'Esterilizado', icon: 'Heart' },
                    { key: 'special_needs', label: 'Necesidades especiales', icon: 'Heart' },
                    { key: 'sociable', label: 'Sociable', icon: 'Users' },
                    { key: 'urgent', label: 'Urgente', icon: 'AlertTriangle' },
                    { key: 'vaccinated', label: 'Vacunado', icon: 'Shield' }
                  ].map(tag => (
                    <button
                      key={tag.key}
                      onClick={() => handleTagToggle(tag.key)}
                      className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all duration-200 text-sm ${
                        (filters.tags || []).includes(tag.key)
                          ? 'border-primary bg-primary-50 text-primary'
                          : 'border-border hover:border-primary-300 hover:bg-surface'
                      }`}
                    >
                      <Icon name={tag.icon} size={16} />
                      <span>{tag.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sterilization Status */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Estado de esterilización
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sterilized"
                      value="true"
                      checked={filters.sterilized === 'true'}
                      onChange={(e) => onFilterChange('sterilized', e.target.value)}
                      className="w-4 h-4 text-primary border-border focus:ring-primary-300"
                    />
                    <span className="text-sm">Esterilizado</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sterilized"
                      value="false"
                      checked={filters.sterilized === 'false'}
                      onChange={(e) => onFilterChange('sterilized', e.target.value)}
                      className="w-4 h-4 text-primary border-border focus:ring-primary-300"
                    />
                    <span className="text-sm">No esterilizado</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sterilized"
                      value=""
                      checked={filters.sterilized === '' || filters.sterilized === undefined}
                      onChange={(e) => onFilterChange('sterilized', e.target.value)}
                      className="w-4 h-4 text-primary border-border focus:ring-primary-300"
                    />
                    <span className="text-sm">Cualquiera</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-border-light">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-text-secondary">Filtros activos:</span>
                
                {filters.search && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary rounded-full text-sm">
                    <span>"{filters.search}"</span>
                    <button
                      onClick={() => onFilterChange('search', '')}
                      className="hover:bg-primary-200 rounded-full p-0.5"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                )}

                {filters.species && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 bg-secondary-100 text-secondary rounded-full text-sm">
                    <span>{speciesOptions.find(opt => opt.value === filters.species)?.label}</span>
                    <button
                      onClick={() => onFilterChange('species', '')}
                      className="hover:bg-secondary-200 rounded-full p-0.5"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                )}

                {filters.breed && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm">
                    <span>{filters.breed}</span>
                    <button
                      onClick={() => onFilterChange('breed', '')}
                      className="hover:bg-accent-200 rounded-full p-0.5"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                )}

                {(filters.tags || []).map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary rounded-full text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleTagToggle(tag)}
                      className="hover:bg-primary-200 rounded-full p-0.5"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilterBar;
