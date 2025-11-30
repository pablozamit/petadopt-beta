import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import Icon from 'components/AppIcon';
import { db } from '@/firebaseConfig';

const ProfessionalsDirectory = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'professionals'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const prosList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProfessionals(prosList);
      } catch (error) {
        console.error('Error fetching professionals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessionals();
  }, []);

  const filteredPros = professionals.filter((pro) => {
    if (categoryFilter === 'all') return true;
    return pro.category === categoryFilter;
  });

  const categories = [
    { value: 'all', label: 'Todos', icon: 'Users' },
    { value: 'vet', label: 'Veterinarios', icon: 'Stethoscope' },
    { value: 'trainer', label: 'Educadores', icon: 'Zap' },
    { value: 'groomer', label: 'Peluqueras', icon: 'Scissors' },
    { value: 'residence', label: 'Residencias', icon: 'Home' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Activity" size={48} className="animate-spin mx-auto mb-4 text-primary" />
          <p className="text-text-secondary text-lg">Cargando profesionales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="bg-gradient-to-r from-primary via-primary/90 to-secondary-500 text-white py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Icon name="ShieldCheck" size={64} className="mx-auto mb-8 opacity-90" />
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 leading-tight">
            Profesionales que cuidan de tus compaeros
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed opacity-95">
            Veterinarios, educadores, peluqueras y residencias que entienden que tu animal es un miembro ms de la familia. Todos verificados, cerca de ti y con valores alineados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <button 
              className="btn-primary-inverted px-12 py-5 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-white/20 transition-all"
              onClick={() => setCategoryFilter('vet')}
            >
              Buscar veterinario
            </button>
            <button className="btn-outline-inverted px-12 py-5 rounded-2xl text-xl font-bold">
              Ver todos
            </button>
          </div>
        </div>
      </header>

      {/* Filtro categora */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center mb-16">
          <div className="bg-surface rounded-2xl p-1 shadow-lg border border-border-light flex gap-1">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoryFilter(cat.value)}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  categoryFilter === cat.value
                    ? 'bg-primary text-white shadow-md'
                    : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                }`}
              >
                <Icon name={cat.icon} size={16} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista profesionales */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPros.length > 0 ? (
            filteredPros.map((pro) => (
              <div
                key={pro.id}
                className="group bg-surface rounded-2xl shadow-sm border border-border-light hover:shadow-xl hover:border-primary/60 overflow-hidden transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/professional/${pro.id}`)}
              >
                {/* Logo */}
                <div className="h-56 bg-gradient-to-br from-primary/5 relative overflow-hidden">
                  <img
                    src={pro.logo || '/placeholder-pro.jpg'}
                    alt={pro.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-primary shadow-md">
                    {pro.category?.toUpperCase()}
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <h3 className="text-xl font-heading font-bold text-text-primary mb-2 truncate">
                    {pro.name}
                  </h3>
                  <p className="text-text-secondary text-sm mb-1">
                    {pro.location}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-text-muted mb-4">
                    <Icon name="Star" size={14} className="text-accent fill-accent" />
                    <span>{pro.rating || 4.8}</span> ({pro.reviews || 23} reseas)
                  </div>
                  <p className="text-sm text-text-secondary line-clamp-3 mb-6">
                    {pro.description || 'Profesional especializado en el cuidado integral de tu mascota.'}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Icon name="Phone" size={14} />
                      {pro.phone || '+34 600 123 456'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="MapPin" size={14} />
                      {pro.distance || '2.4 km'}
                    </span>
                  </div>
                  <button className="w-full mt-6 btn-primary py-3 rounded-xl font-semibold text-sm">
                    Ver perfil y reservar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <Icon name="Search" size={64} className="mx-auto mb-6 text-text-muted" />
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                No hay profesionales de esta categora cerca
              </h3>
              <p className="text-text-secondary mb-8">
                Prueba con otra categora o amplia el radio de bsqueda.
              </p>
              <button 
                onClick={() => setCategoryFilter('all')}
                className="btn-primary px-8 py-3 rounded-xl font-semibold"
              >
                Ver todos
              </button>
            </div>
          )}
        </div>

        {/* CTA final */}
        {filteredPros.length > 0 && (
          <div className="text-center mt-20">
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              {professionals.length} profesionales disponibles
            </h3>
            <button className="btn-outline px-12 py-4 rounded-xl text-lg font-bold">
              Ver ms profesionales
            </button>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="mt-20 py-16 bg-gradient-to-r from-primary to-secondary-500 text-white text-center">
        <h2 className="text-3xl font-heading font-bold mb-6">
          Eres profesional del sector?
        </h2>
        <p className="text-xl opacity-95 mb-8">
          Unete a nuestra comunidad y llega a miles de adoptantes sensibles.
        </p>
        <button className="bg-white text-primary px-12 py-5 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-white/20">
          Quiero aparecer en la gua
        </button>
      </div>
    </div>
  );
};

export default ProfessionalsDirectory;
