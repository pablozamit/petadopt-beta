import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, onSnapshot, limit } from 'firebase/firestore';
import Icon from 'components/AppIcon';
import { db, auth } from '@/firebaseConfig';
import { useAuth } from '@/contexts/AuthContext';

const ShelterDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ petsPublished: 0, adoptionRequests: 0, activePets: 0 });
  const [recentPets, setRecentPets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Stats simulados (futuro Firebase queries)
    setStats({
      petsPublished: 24,
      adoptionRequests: 8,
      activePets: 15
    });

    // Últimas mascotas del refugio (Firebase)
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
    });

    // Solicitudes (simuladas)
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
          <p className="text-text-secondary">Preparando tu panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border-light shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                <Icon name="Shield" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-text-primary">
                  Bienvenida a tu panel de control
                </h1>
                <p className="text-text-secondary">
                  {user.email} • Protectora verificada
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn-outline px-6 py-2 rounded-xl">
                Configuración
              </button>
              <button className="btn-primary px-8 py-2 rounded-xl font-semibold">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Stats */}
        <section>
          <h2 className="text-3xl font-heading font-bold text-text-primary mb-8">
            Tu actividad reciente
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="bg-surface rounded-2xl p-8 border border-border-light hover:shadow-md transition-all text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {stats.petsPublished}
              </div>
              <p className="text-sm text-text-secondary uppercase tracking-wider">Mascotas publicadas</p>
            </div>
            <div className="bg-surface rounded-2xl p-8 border border-border-light hover:shadow-md transition-all text-center">
              <div className="text-4xl font-bold text-secondary mb-2">
                {stats.activePets}
              </div>
              <p className="text-sm text-text-secondary uppercase tracking-wider">Activas adopción</p>
            </div>
            <div className="bg-surface rounded-2xl p-8 border border-border-light hover:shadow-md transition-all text-center">
              <div className="text-4xl font-bold text-accent mb-2">
                {stats.adoptionRequests}
              </div>
              <p className="text-sm text-text-secondary uppercase tracking-wider">Solicitudes adopción</p>
            </div>
            <div className="bg-primary/5 border-primary/20 rounded-2xl p-8 hover:shadow-md transition-all text-center">
              <Icon name="TrendingUp" size={32} className="mx-auto mb-4 text-primary" />
              <p className="text-sm text-text-secondary">+20% vs mes anterior</p>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Últimas mascotas */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-text-primary">
                Últimas mascotas publicadas
              </h3>
              <button className="btn-outline px-6 py-2 rounded-xl text-sm">
                Ver todas
              </button>
            </div>
            <div className="space-y-4">
              {recentPets.map((pet) => (
                <div key={pet.id} className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-border-light hover:bg-surface-hover transition-colors">
                  <img src={pet.images?.[0]} alt={pet.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-text-primary truncate">{pet.name}</h4>
                    <p className="text-sm text-text-secondary">{pet.age} • {pet.size}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <span className={`px-2 py-1 rounded-full font-medium ${
                      pet.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {pet.status || 'Activo'}
                    </span>
                  </div>
                  <button className="ml-auto text-primary hover:text-primary/80">
                    <Icon name="Edit" size={18} />
                  </button>
                </div>
              ))}
              {recentPets.length === 0 && (
                <div className="text-center py-12">
                  <Icon name="Plus" size={48} className="mx-auto mb-4 text-text-muted" />
                  <p className="text-text-secondary">No tienes mascotas publicadas</p>
                  <button 
                    onClick={() => navigate('/add-edit-pet-form')}
                    className="btn-primary mt-4 px-8 py-3 rounded-xl"
                  >
                    Publicar primera mascota
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Solicitudes */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-text-primary">
                Solicitudes pendientes
              </h3>
              <button className="btn-outline px-6 py-2 rounded-xl text-sm">
                Ver todas
              </button>
            </div>
            <div className="space-y-4">
              {requests.map((req) => (
                <div key={req.id} className="flex items-start gap-4 p-4 bg-surface rounded-xl border border-border-light hover:bg-surface-hover">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name="User" size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-text-primary text-sm">{req.adopterName}</h4>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                        Pendiente
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mb-2">Interesado en {req.petName}</p>
                    <p className="text-xs text-text-muted">{req.date}</p>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                      <Icon name="Check" size={16} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Icon name="X" size={16} />
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
