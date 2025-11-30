import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import Icon from 'components/AppIcon';
import { db } from '@/firebaseConfig';
// Importamos el Provider y el Hook del archivo que acabamos de crear
import { FiltersProvider, useFilters } from './components/FiltersContext';
import AdvancedFilterBar from './components/AdvancedFilterBar';
import PetCard from './components/PetCard';
import HeroSection from './components/HeroSection';

// Componente interno que contiene la lógica de la página
const PublicPetAdoptionContent = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const filters = useFilters(); // Ahora sí funcionará porque está dentro del Provider
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        // Consulta base a Firebase
        let q = query(
          collection(db, 'pets'),
          where('status', '==', 'active'),
          orderBy('createdAt', 'desc'),
          limit(50)
        );

        const snapshot = await getDocs(q);
        let allPets = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Filtrado en cliente según los criterios del PDF
        if (filters.age && filters.age.length > 0) {
          allPets = allPets.filter((pet) => filters.age.includes(pet.age));
        }
        
        if (filters.size && filters.size.length > 0) {
          allPets = allPets.filter((pet) => filters.size.includes(pet.size));
        }

        if (filters.species) {
           allPets = allPets.filter(pet => pet.species === filters.species);
        }

        setPets(allPets);
        setNoResults(allPets.length === 0);
      } catch (error) {
        console.error('Error fetching pets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [filters]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary font-medium">Buscando compañeros perfectos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-10">
        
        {/* Barra de Filtros */}
        <div className="mb-10">
          <AdvancedFilterBar petsCount={pets.length} noResults={noResults} />
        </div>

        {/* Grid de Resultados */}
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-heading font-bold text-text-primary">
                    Mascotas en adopción
                </h2>
            </div>

            {pets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map((pet) => (
                    <PetCard key={pet.id} pet={pet} />
                ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-surface rounded-2xl border border-border-light">
                    <div className="w-16 h-16 bg-text-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="Search" size={32} className="text-text-muted" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">
                        No encontramos coincidencias
                    </h3>
                    <p className="text-text-secondary max-w-md mx-auto">
                        Intenta ajustar los filtros de edad o tamaño para ver más resultados.
                    </p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

// Componente Principal que exportamos envuelto en el Provider
const PublicPetAdoptionHomepage = () => {
  return (
    <FiltersProvider>
      <PublicPetAdoptionContent />
    </FiltersProvider>
  );
};

export default PublicPetAdoptionHomepage;
