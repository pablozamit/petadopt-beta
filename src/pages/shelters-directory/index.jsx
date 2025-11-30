import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Icon from 'components/AppIcon';
import AdaptiveHeader from 'components/ui/AdaptiveHeader';
import { db } from '@/firebaseConfig';

const SheltersDirectory = () => {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const navigate = useNavigate();

  const provinces = [
    'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz',
    'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón',
    'Ciudad Real', 'Córdoba', 'Cuenca', 'Girona', 'Granada', 'Guadalajara',
    'Gipuzkoa', 'Huelva', 'Huesca', 'Jaén', 'La Rioja', 'Las Palmas', 'León',
    'Lleida', 'Lugo', 'Madrid', 'Málaga', 'Murcia', 'Navarra', 'Ourense',
    'Palencia', 'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife', 'Segovia',
    'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia',
    'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza'
  ];

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        setLoading(true);
        // Obtener todos los usuarios que son refugios
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('userType', '==', 'shelter'));
        const snapshot = await getDocs(q);
        
        const sheltersList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setShelters(sheltersList);
      } catch (error) {
        console.error('Error fetching shelters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShelters();
  }, []);

  const filteredShelters = shelters.filter(shelter => {
    const matchesSearch = shelter.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince = !selectedProvince || shelter.province === selectedProvince;
    return matchesSearch && matchesProvince;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdaptiveHeader />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-secondary">Cargando refugios...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdaptiveHeader />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 to-accent-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-heading font-bold text-text-primary mb-4">
                Refugios de Animales
              </h1>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Encuentra refugios y protectoras de animales cerca de ti en toda España
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-surface rounded-xl p-6 shadow-sm border border-border-light">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Buscar refugio
                </label>
                <div className="relative">
                  <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nombre del refugio..."
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Province */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Provincia
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="input-field"
                >
                  <option value="">Todas las provincias</option>
                  {provinces.map(province => (
                    <option key={province} value={province.toLowerCase()}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 flex items-center justify-between">
            <h2 className="text-xl font-heading font-bold text-text-primary">
              {filteredShelters.length} refugios encontrados
            </h2>
          </div>

          {/* Shelters Grid */}
          {filteredShelters.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShelters.map((shelter) => (
                <div
                  key={shelter.id}
                  className="bg-surface rounded-xl p-6 shadow-sm border border-border-light hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(`/shelter/${shelter.id}`)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="Building2" size={24} color="white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-bold text-text-primary mb-1 truncate">
                        {shelter.name || 'Refugio'}
                      </h3>
                      <p className="text-sm text-text-secondary flex items-center space-x-1">
                        <Icon name="MapPin" size={14} />
                        <span>{shelter.province || 'España'}</span>
                      </p>
                    </div>
                  </div>

                  {shelter.description && (
                    <p className="mt-4 text-sm text-text-secondary line-clamp-2">
                      {shelter.description}
                    </p>
                  )}

                  <div className="mt-4 pt-4 border-t border-border-light flex items-center justify-between">
                    <span className="text-sm text-text-secondary">
                      {shelter.petsCount || 0} mascotas
                    </span>
                    <button className="text-primary hover:text-primary-600 text-sm font-medium flex items-center space-x-1">
                      <span>Ver perfil</span>
                      <Icon name="ArrowRight" size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 text-center py-20 bg-surface rounded-2xl border border-border-light">
              <div className="w-16 h-16 bg-text-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Building2" size={32} className="text-text-muted" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">
                No se encontraron refugios
              </h3>
              <p className="text-text-secondary">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SheltersDirectory;
