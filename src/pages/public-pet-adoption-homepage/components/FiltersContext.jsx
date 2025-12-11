import React, { createContext, useContext, useState } from 'react';

// Creación de contextos
const FiltersContext = createContext();
const UpdateFiltersContext = createContext();

const initialState = {
  age: [],
  size: [],
  species: '',
  province: ''
};

// Hooks personalizados para usar el contexto
export const useFilters = () => {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error('useFilters debe ser usado dentro de un FiltersProvider');
  }
  return context;
};

export const useUpdateFilters = () => {
  const context = useContext(UpdateFiltersContext);
  if (context === undefined) {
    throw new Error('useUpdateFilters debe ser usado dentro de un FiltersProvider');
  }
  return context;
};

// Proveedor del contexto
export const FiltersProvider = ({ children }) => {
  const [filters, setFilters] = useState(initialState);

  // Objeto con funciones de actualización
  const filterUpdaters = {
    update: (newFilters) => {
      setFilters(prev => ({
        ...prev,
        ...newFilters
      }));
    },
    reset: () => {
      setFilters(initialState);
    }
  };

  return (
    <FiltersContext.Provider value={filters}>
      <UpdateFiltersContext.Provider value={filterUpdaters}>
        {children}
      </UpdateFiltersContext.Provider>
    </FiltersContext.Provider>
  );
};

export default FiltersProvider;
