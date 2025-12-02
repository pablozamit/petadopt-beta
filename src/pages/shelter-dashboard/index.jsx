import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, limit, orderBy } from 'firebase/firestore';
import Icon from 'components/AppIcon';
import AdaptiveHeader from 'components/ui/AdaptiveHeader';
import { db } from '@/firebaseConfig';
import { useAuth } from '../../hooks/useAuth';

const ShelterDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ petsPublished: 0, adoptionRequests: 0, activePets: 0 });
  const [recentPets, setRecentPets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si todavía está cargando el usuario, esperamos
    if (user === undefined) return;

    if (!user) {
      navigate('/login');
      return;
    }

    // Stats simulados (se conectarán a queries reales en fases posteriores)
    setStats({
      petsPublished: 24,
      adoptionRequests: 8,
      activePets: 15
    });

    // Cargar mascotas reales del usuario actual
    const q = query(
      collection(db, 'pets'),
      where('shelterId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const petsList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRecentPets(petsList);
      setLoading(false);
    }, (error) => {
      console.error("Error cargando mascotas:", error);
      setLoading(false);
    });

    // Solicitudes (simuladas por ahora)
    setRequests([
      { id: '1', petName: 'Luna', adopterName: 'Ana G.', date: 'hace 2 días', status: 'pendiente' },
      { id: '2', petName: 'Max', adopterName: 'Carlos L.', date: 'hace 4 días', status: 'contactado' }
    ]);

    return () => unsubscribe();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6" />
          <p className="text-text-secondary">Cargando tu protectora...</p>
        </div>
      </div>
    );
  }

  // Protección extra por si user es null al renderizar
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <AdaptiveHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Stats */}
        <section>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-6">
            Resumen de actividad
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface rounded-2xl p-6 border border-border-light shadow-sm">
              <div className="text-3xl font-bold text-primary mb-1">
                {stats.petsPublished}
              </div>
              <p className="text-xs text-text-secondary uppercase font-semibold tracking-wide">Publicados</p>
            </div>
            <div className="bg-surface rounded-2xl p-6 border border-border-light shadow-sm">
              <div className="text-3xl font-bold text-secondary mb-1">
                {stats.activePets}
              </div>
              <p className="text-xs text-text-secondary uppercase font-semibold tracking-wide">Activos</p>
            </div>
            <div className="bg-surface rounded-2xl p-6 border border-border-light shadow-sm">
              <div className="text-3xl font-bold text-accent mb-1">
                {stats.adoptionRequests}
              </div>
              <p className="text-xs text-text-secondary uppercase font-semibold tracking-wide">Solicitudes</p>
            </div>
             <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => navigate('/add-edit-pet-form')}>
              <Icon name="Plus" size={24} className="text-primary mb-2" />
              <p className="text-sm text-primary font-bold">Publicar Rápido</p>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Últimas mascotas */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-text-primary">
                Inventario reciente
              </h3>
            </div>
            <div className="space-y-3">
              {recentPets.length > 0 ? recentPets.map((pet) => (
                <div key={pet.id} className="flex items-center gap-4 p-3 bg-surface rounded-xl border border-border-light hover:border-primary/30 transition-all cursor-pointer" onClick={() => navigate(`/pet/${pet.id}`)}>
                  <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                     {pet.images && pet.images[0] ? (
                        <img src={pet.images[0]} alt={pet.name} className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Icon name="Image" size={20} />
                        </div>
                     )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-text-primary truncate">{pet.name}</h4>
                    <p className="text-xs text-text-secondary">{pet.breed || 'Mestizo'} • {pet.age}</p>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${pet.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                     <Icon name="ChevronRight" size={16} className="text-gray-300" />
                  </div>
                </div>
              )) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                      <p className="text-text-muted text-sm mb-2">No tienes mascotas activas</p>
                      <button onClick={() => navigate('/add-edit-pet-form')} className="text-primary text-sm font-bold hover:underline">
                          Crear la primera
                      </button>
                  </div>
              )}
            </div>
          </section>

          {/* Solicitudes */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-text-primary">
                Mensajes recientes
              </h3>
            </div>
            <div className="space-y-3">
              {requests.map((req) => (
                <div key={req.id} className="p-4 bg-surface rounded-xl border border-border-light">
                  <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-text-primary text-sm">{req.adopterName}</span>
                      <span className="text-xs text-text-muted">{req.date}</span>
                  </div>
                  <p className="text-sm text-text-secondary mb-3">
                      Hola, me gustaría saber si {req.petName} es compatible con gatos...
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20">
                        Responder
                    </button>
                    <button className="px-3 py-1.5 border border-border text-text-secondary text-xs font-bold rounded-lg hover:bg-gray-50">
                        Ver ficha
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShelterDashboard;
