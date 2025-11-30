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
        setHighlightedPets(allPets.slice(0, 6)); // Primeros 6 destacados
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
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-bold bg-gradient-to-r from-text-primary via-primary to-secondary-500 bg-clip-text text-transparent mb-6 leading-tight">
            El amor no se compra,<br />
            <span className="block">se adopta</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Te ayudamos a encontrar al compaero que encaja de verdad con tu vida, y a que las protectoras y profesionales tengan el apoyo que necesitan.
          </p>

          {/* Buscador */}
          <div className="max-w-md mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Perro, gato, conejo"
                className="flex-1 px-5 py-4 rounded-xl border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 bg-surface shadow-sm"
              />
              <input
                type="text"
                placeholder="Ciudad o provincia"
                className="flex-1 px-5 py-4 rounded-xl border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 bg-surface shadow-sm"
              />
              <button className="btn-primary px-8 py-4 rounded-xl flex items-center gap-3 font-bold text-lg shadow-lg hover:shadow-xl transition-all">
                <Icon name="Search" size={20} />
                Encontrar mi compaero
              </button>
            </div>
          </div>

          {/* CTAs Hero */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <button className="btn-primary px-10 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl w-full sm:w-auto">
              Ver animales en adopcin
            </button>
            <button className="btn-outline px-10 py-4 rounded-xl text-lg font-bold w-full sm:w-auto">
              Soy protectora profesional
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
        {/* Seccin 2: Cmo funciona */}
        <section id="how-it-works" className="text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-text-primary mb-6">
            Cmo funciona AdoptaMascotas?
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-16 leading-relaxed">
            Hacemos fcil lo que antes era un lo: ver, elegir y acompaar.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Icon name="Search" size={24} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">1. Descubre</h3>
              <p className="text-text-secondary">
                Filtra por tipo de animal, edad, tamao y ubicacin. Encuentra animales que encajan con tu hogar y tu ritmo de vida.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/20 transition-colors">
                <Icon name="MessageCircle" size={24} className="text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">2. Conecta</h3>
              <p className="text-text-secondary">
                Habla directamente con la protectora y resuelve tus dudas. Recibe informacin clara sobre carcter, salud y necesidades.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                <Icon name="HeartHandshake" size={24} className="text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">3. Acompaa</h3>
              <p className="text-text-secondary">
                No te dejamos solo despus de la adopcin. Accede a consejos de veterinarios, educadores y otros adoptantes.
              </p>
            </div>
          </div>
        </section>

        {/* Seccin 3: Animales destacados */}
        <section>
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-text-primary">
              Peludos que ahora mismo buscan una familia
            </h2>
            <p className="text-lg text-text-secondary">
              Estas son solo algunas de las historias que pueden empezar contigo.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlightedPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="btn-primary px-12 py-4 rounded-xl text-lg font-bold">
              Ver todos los animales en adopcin
            </button>
          </div>
        </section>

        {/* Filtros */}
        <AdvancedFilterBar petsCount={pets.length} noResults={noResults} />

        {/* Lista completa (si no filtros) */}
        {!noResults && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicPetAdoptionHomepage;
