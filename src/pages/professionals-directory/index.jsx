import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import Icon from 'components/AppIcon';
import AdaptiveHeader from 'components/ui/AdaptiveHeader';
import UnifiedSearchBar from 'components/ui/UnifiedSearchBar';
import LoadingSpinner from 'components/ui/LoadingSpinner';

const ProfessionalsDirectory = () => {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');

  // Cargar profesionales reales desde Firebase
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        // Buscamos usuarios cuyo rol sea 'professional'
        const q = query(
          collection(db, 'users'), 
          where('role', '==', 'professional')
        );
        
        const querySnapshot = await getDocs(q);
        const prosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setProfessionals(prosData);
      } catch (error) {
        console.error("Error cargando profesionales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  // Filtrado en cliente (por búsqueda o provincia)
  const filteredProfessionals = professionals.filter(pro => {
    const matchesSearch = pro.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pro.specialty?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince = selectedProvince ? pro.province === selectedProvince : true;
    
    return matchesSearch && matchesProvince;
  });

  const handleContact = (proId) => {
    // Si el usuario no está logueado, llevarlo al login, si no, al detalle o chat
    navigate(`/professional/${proId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdaptiveHeader />
      
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header de la sección */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
            Profesionales de confianza
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Encuentra veterinarios, educadores y cuidadores verificados cerca de ti para ayudar a tu nueva mascota.
          </p>
        </div>

        {/* Buscador y Filtros */}
        <div className="bg-surface p-4 rounded-2xl shadow-sm border border-border-light mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <UnifiedSearchBar 
                placeholder="Buscar por nombre o especialidad..." 
                onSearch={setSearchTerm}
              />
            </div>
            <select 
              className="p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none min-w-[200px]"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
            >
              <option value="">Todas las provincias</option>
              <option value="madrid">Madrid</option>
              <option value="barcelona">Barcelona</option>
              <option value="valencia">Valencia</option>
              {/* Se pueden añadir más dinámicamente si es necesario */}
            </select>
          </div>
        </div>

        {/* Lista de Resultados */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Buscando expertos..." />
          </div>
        ) : filteredProfessionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessionals.map((pro) => (
              <div key={pro.id} className="bg-surface rounded-xl border border-border-light hover:shadow-md transition-all duration-300 overflow-hidden group">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {pro.photoURL ? (
                        <img src={pro.photoURL} alt={pro.displayName} className="w-full h-full object-cover" />
                      ) : (
                        <Icon name="User" size={32} className="text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-text-primary group-hover:text-primary transition-colors">
                        {pro.displayName || 'Profesional'}
                      </h3>
                      <p className="text-primary font-medium text-sm">
                        {pro.specialty || 'Servicios Veterinarios'}
                      </p>
                      <div className="flex items-center gap-1 text-text-secondary text-xs mt-1">
                        <Icon name="MapPin" size={12} />
                        <span className="capitalize">{pro.province || 'España'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-text-secondary text-sm line-clamp-2 mb-4 h-10">
                    {pro.bio || 'Profesional verificado de la red Oh My Pawz dedicado al bienestar animal.'}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {pro.services?.slice(0, 3).map((service, idx) => (
                      <span key={idx} className="px-2 py-1 bg-background border border-border rounded-md text-xs text-text-secondary">
                        {service}
                      </span>
                    ))}
                  </div>

                  <button 
                    onClick={() => handleContact(pro.id)}
                    className="w-full btn-outline flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all"
                  >
                    <Icon name="MessageCircle" size={18} />
                    Contactar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface rounded-2xl border border-dashed border-border">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Search" size={32} className="text-text-muted" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">No se encontraron profesionales</h3>
            <p className="text-text-secondary">Intenta cambiar los filtros de búsqueda.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfessionalsDirectory;
