import React, { createContext, useContext, useState } from 'react';

// Creación de contextos
const FiltersContext = createContext();
const SetFiltersContext = createContext();

// Hooks personalizados para usar el contexto
export const useFilters = () => {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error('useFilters debe ser usado dentro de un FiltersProvider');
  }
  return context;
};

export const useSetFilters = () => {
  const context = useContext(SetFiltersContext);
  if (context === undefined) {
    throw new Error('useSetFilters debe ser usado dentro de un FiltersProvider');
  }
  return context;
};

// Proveedor del contexto
export const FiltersProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    age: [],
    size: [],
    species: '',
    province: ''
  });

  // Función para actualizar filtros (merge con el estado anterior)
  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  return (
    <FiltersContext.Provider value={filters}>
      <SetFiltersContext.Provider value={updateFilters}>
        {children}
      </SetFiltersContext.Provider>
    </FiltersContext.Provider>
  );
};

export default FiltersProvider;
