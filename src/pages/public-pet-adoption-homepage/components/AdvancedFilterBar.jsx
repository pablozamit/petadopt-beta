import React from 'react';
import { useFilters, useSetFilters } from './FiltersContext';
import Icon from 'components/AppIcon';

const AdvancedFilterBar = ({ petsCount, noResults }) => {
  const filters = useFilters();
  const setFilters = useSetFilters();

  // Opciones estandarizadas según PDF (Página 11)
  const sizeOptions = [
    { value: 'small', label: 'Pequeño', sub: 'hasta 10 kg', tooltip: 'Ej: Yorkshire, gato pequeño' },
    { value: 'medium', label: 'Mediano', sub: '10-25 kg', tooltip: 'Ej: Beagle, Border Collie' },
    { value: 'large', label: 'Grande', sub: '25-40 kg', tooltip: 'Ej: Pastor Alemán' },
    { value: 'giant', label: 'Muy grande', sub: '+40 kg', tooltip: 'Ej: Mastín, Gran Danés' }
  ];

  // Opciones estandarizadas según PDF (Página 10)
  const ageOptions = [
    { value: 'puppy_junior', label: 'Cachorro / Junior', sub: '0-1 año' },
    { value: 'young', label: 'Joven', sub: '1-3 años' },
    { value: 'adult', label: 'Adulto', sub: '3-7 años' },
    { value: 'senior', label: 'Senior', sub: '+7 años' }
  ];

  const toggleFilter = (category, value) => {
    const current = filters[category] || [];
    const newFilters = current.includes(value)
      ? current.filter((f) => f !== value)
      : [...current, value];
    setFilters({ [category]: newFilters });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const FilterChip = ({ label, sub, value, category, active, tooltip }) => (
    <button
      type="button"
      onClick={() => toggleFilter(category, value)}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
        active
          ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 hover:shadow-lg'
          : 'bg-surface-hover border-border hover:border-primary/60 hover:bg-primary/5 text-text-secondary'
      }`}
      title={tooltip}
    >
      {label}
      {sub && (
        <span className={`text-xs font-normal ${active ? 'text-white/90' : 'text-text-muted'}`}>
          {sub}
        </span>
      )}
      <Icon name={active ? 'Check' : 'Circle'} size={14} />
    </button>
  );

  return (
    <div className="bg-surface rounded-2xl p-6 space-y-6 shadow-sm border border-border-light">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-heading font-bold text-text-primary">
          Filtrar resultados
        </h3>
        <div className="text-sm text-text-secondary flex items-center gap-1">
          <span className="font-bold">{petsCount}</span>
          <span>animales</span>
        </div>
      </div>

      {/* Filtro Edad */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-3">
          Edad del animal
        </label>
        <div className="flex flex-wrap gap-2.5 mb-2">
          {ageOptions.map((option) => (
            <FilterChip
              key={option.value}
              {...option}
              active={filters.age?.includes(option.value)}
              category="age"
            />
          ))}
        </div>
        <p className="text-xs text-text-secondary">
          Puedes elegir varias etapas de vida. [cite_start]No es lo mismo educar a un cachorro que acompañar a un senior[cite: 884].
        </p>
      </div>

      {/* Filtro Tamaño */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-3">
          Tamaño del animal
        </label>
        <div className="flex flex-wrap gap-2.5 mb-2">
          {sizeOptions.map((option) => (
            <FilterChip
              key={option.value}
              {...option}
              active={filters.size?.includes(option.value)}
              category="size"
              tooltip={option.tooltip}
            />
          ))}
        </div>
        <p className="text-xs text-text-secondary">
          [cite_start]Piensa en tu espacio, tu fuerza física y tu estilo de vida[cite: 904].
        </p>
      </div>

      {/* Botón Limpiar filtros */}
      {Object.values(filters).some((arr) => arr?.length > 0) && (
        <div className="pt-4 border-t border-border-light flex justify-end">
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-error hover:bg-error/5 px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Icon name="Trash2" size={16} />
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Mensaje cuando no hay resultados */}
      {noResults && (
        <div className="bg-warning-50 border border-warning-200 rounded-xl p-5">
          <h4 className="text-lg font-heading font-semibold text-warning mb-2">
            No hemos encontrado ningún compañero con estos filtros
          </h4>
          <p className="text-text-secondary mb-4 text-sm">
            [cite_start]Prueba a ampliar la edad o el tamaño (por ejemplo, desmarcando "Senior" o "Muy grande")[cite: 920].
          </p>
          <button
            onClick={clearFilters}
            className="btn-primary w-full sm:w-auto text-sm"
          >
            Ver todos los animales
          </button>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilterBar;
