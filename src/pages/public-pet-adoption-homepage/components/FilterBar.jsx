import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const FilterBar = ({ filters, onFilterChange, resultsCount }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const speciesOptions = [
    { value: '', label: 'Todas las especies' },
    { value: 'Dog', label: 'Perros' },
    { value: 'Cat', label: 'Gatos' },
    { value: 'Other', label: 'Otros' }
  ];

  const ageOptions = [
    { value: '', label: 'Todas las edades' },
    { value: 'Puppy', label: 'Cachorro/Gatito' },
    { value: 'Adult', label: 'Adulto' },
    { value: 'Senior', label: 'Senior' }
  ];

  const sizeOptions = [
    { value: '', label: 'Todos los tamaños' },
    { value: 'Small', label: 'Pequeño' },
    { value: 'Medium', label: 'Mediano' },
    { value: 'Large', label: 'Grande' }
  ];

  const provinceOptions = [
    { value: '', label: 'Todas las provincias' },
    { value: 'Madrid', label: 'Madrid' },
    { value: 'Barcelona', label: 'Barcelona' },
    { value: 'Valencia', label: 'Valencia' },
    { value: 'Sevilla', label: 'Sevilla' },
    { value: 'Vizcaya', label: 'Vizcaya' },
    { value: 'Zaragoza', label: 'Zaragoza' },
    { value: 'Málaga', label: 'Málaga' },
    { value: 'Murcia', label: 'Murcia' },
    { value: 'Baleares', label: 'Baleares' },
    { value: 'Las Palmas', label: 'Las Palmas' },
    { value: 'Cantabria', label: 'Cantabria' },
    { value: 'Valladolid', label: 'Valladolid' },
    { value: 'Pontevedra', label: 'Pontevedra' },
    { value: 'Asturias', label: 'Asturias' },
    { value: 'Córdoba', label: 'Córdoba' },
    { value: 'Granada', label: 'Granada' },
    { value: 'Alicante', label: 'Alicante' },
    { value: 'Salamanca', label: 'Salamanca' },
    { value: 'Cádiz', label: 'Cádiz' },
    { value: 'Badajoz', label: 'Badajoz' },
    { value: 'La Rioja', label: 'La Rioja' },
    { value: 'Navarra', label: 'Navarra' },
    { value: 'Álava', label: 'Álava' },
    { value: 'Castellón', label: 'Castellón' },
    { value: 'Huelva', label: 'Huelva' },
    { value: 'Jaén', label: 'Jaén' },
    { value: 'Almería', label: 'Almería' },
    { value: 'Ciudad Real', label: 'Ciudad Real' },
    { value: 'Cuenca', label: 'Cuenca' },
    { value: 'Guadalajara', label: 'Guadalajara' }
  ];

  const hasActiveFilters = Object.values(filters).some(filter => filter !== '');

  // 🆕 NUEVO: Función para manejar cambios de filtro SIN scroll
  const handleFilterChange = (filterName, value) => {
    const scrollPos = window.scrollY;
    onFilterChange(filterName, value);
    
    // Restaurar scroll después del cambio
    setTimeout(() => {
      window.scrollTo(0, scrollPos);
    }, 0);
  };

  const clearAllFilters = () => {
    onFilterChange('species', '');
    onFilterChange('age', '');
    onFilterChange('size', '');
    onFilterChange('province', '');
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div id="filter-section" className="bg-surface border-b border-border-light shadow-sm sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden py-4">
          <button
            onClick={toggleExpanded}
            className="w-full flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:bg-surface-hover transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <Icon name="Filter" size={20} className="text-primary" />
              <span className="font-medium text-text-primary">
                Filtros {hasActiveFilters && `(${Object.values(filters).filter(f => f !== '').length})`}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {/* Species Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Especie
              </label>
              <select
                value={filters.species}
                onChange={(e) => handleFilterChange('species', e.target.value)}
                className="input-field text-sm"
              >
                {speciesOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Age Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Edad
              </label>
              <select
                value={filters.age}
                onChange={(e) => handleFilterChange('age', e.target.value)}
                className="input-field text-sm"
              >
                {ageOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Size Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Tamaño
              </label>
              <select
                value={filters.size}
                onChange={(e) => handleFilterChange('size', e.target.value)}
                className="input-field text-sm"
              >
                {sizeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Province Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Provincia
              </label>
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

            {/* Clear Filters & Results */}
            <div className="space-y-2 lg:col-span-1 xl:col-span-1">
              <div className="flex flex-col h-full justify-end">
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="btn-outline text-sm py-2 px-4 mb-2 flex items-center justify-center space-x-2"
                  >
                    <Icon name="X" size={16} />
                    <span>Limpiar</span>
                  </button>
                )}
                <div className="text-center lg:text-left">
                  <span className="text-sm font-medium text-text-primary">
                    {resultsCount} {resultsCount === 1 ? 'mascota' : 'mascotas'}
                  </span>
                  <span className="text-xs text-text-secondary block">
                    encontradas
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-border-light">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-text-secondary">Filtros activos:</span>
                {filters.species && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary rounded-full text-sm">
                    <span>{speciesOptions.find(opt => opt.value === filters.species)?.label}</span>
                    <button
                      onClick={() => handleFilterChange('species', '')}
                      className="hover:bg-primary-200 rounded-full p-0.5"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                )}
                {filters.age && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 bg-secondary-100 text-secondary rounded-full text-sm">
                    <span>{ageOptions.find(opt => opt.value === filters.age)?.label}</span>
                    <button
                      onClick={() => handleFilterChange('age', '')}
                      className="hover:bg-secondary-200 rounded-full p-0.5"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                )}
                {filters.size && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm">
                    <span>{sizeOptions.find(opt => opt.value === filters.size)?.label}</span>
                    <button
                      onClick={() => handleFilterChange('size', '')}
                      className="hover:bg-accent-200 rounded-full p-0.5"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                )}
                {filters.province && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary rounded-full text-sm">
                    <span>{provinceOptions.find(opt => opt.value === filters.province)?.label}</span>
                    <button
                      onClick={() => handleFilterChange('province', '')}
                      className="hover:bg-primary-200 rounded-full p-0.5"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
