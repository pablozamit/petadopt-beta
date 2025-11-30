import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import Icon from 'components/AppIcon';
import { db } from '@/firebaseConfig';
import { useFilters } from './components/FiltersContext';
import AdvancedFilterBar from './components/AdvancedFilterBar';
import PetCard from './components/PetCard';

const PublicPetAdoptionHomepage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlightedPets, setHighlightedPets] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const filters = useFilters();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        let q = query(
          collection(db, 'pets'),
          where('status', '==', 'active'),
          orderBy('createdAt', 'desc'),
          limit(20)
        );

        const snapshot = await getDocs(q);
        let allPets = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Aplicar filtros
        if (filters.age?.length) {
          allPets = allPets.filter((pet) => filters.age.includes(pet.age));
        }
        if (filters.size?.length) {
          allPets = allPets.filter((pet) => filters.size.includes(pet.size));
        }

        setPets(allPets);
        setNoResults(allPets.length === 0);
        setHighlightedPets(allPets.slice(0, 6));
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Buscando compaeros perfectos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max
