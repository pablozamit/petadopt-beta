import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  deleteDoc, 
  doc
  // orderBy // Desactivado temporalmente para evitar error de índice
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from 'hooks/useAuth';

import AdaptiveHeader from 'components/ui/AdaptiveHeader';
import DashboardStats from './components/DashboardStats';
import PetManagementGrid from './components/PetManagementGrid';
import RecentActivity from './components/RecentActivity';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import Icon from 'components/AppIcon';

const ShelterDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [stats, setStats] = useState({
    totalPets: 0,
    adoptedPets: 0,
    activeListings: 0,
    pendingInquiries: 0
  });

  // 1. Cargar mascotas en tiempo real
  useEffect(() => {
    if (authLoading) return;
    
    // Si no hay usuario, redirigir al login
    if (!user) {
      navigate('/authentication-login-register');
      return;
    }

    // Consulta SIMPLIFICADA: Sin orderBy para evitar errores de índice
    const q = query(
      collection(db, "pets"), 
      where("shelterId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const petsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPets(petsData);
      
      // 2. Calcular estadísticas al vuelo
      const total = petsData.length;
      const active = petsData.filter(p => p.status === 'active').length;
      const adopted = petsData.filter(p => p.status === 'adopted').length;
      
      setStats({
        totalPets: total,
        activeListings: active,
        adoptedPets: adopted,
        pendingInquiries: 0 // Placeholder
      });

      setLoadingPets(false);
    }, (error) => {
      console.error("Error cargando mascotas:", error);
      setLoadingPets(false);
    });

    return () => unsubscribe();
  }, [user, authLoading, navigate]);

  // 3. Funciones de Acción
  const handleAddNewPet = () => {
    navigate('/add-edit-pet-form');
  };

  const handleEditPet = (petId) => {
    navigate(`/add-edit-pet-form?edit=true&id=${petId}`);
  };

  const handleDeletePet = async (petId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta mascota? Esta acción no se puede deshacer.")) {
      try {
        await deleteDoc(doc(db, "pets", petId));
        // No hace falta actualizar el estado manual, onSnapshot lo hará por nosotros
      } catch (error) {
        console.error("Error eliminando mascota:", error);
        alert("Error al eliminar la mascota");
      }
    }
  };

  const handleViewDetails = (petId) => {
    navigate(`/pet-detail/${petId}`);
  };

  if (authLoading || loadingPets) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdaptiveHeader />
      
      <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-12 max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary">
              Panel de Control
            </h1>
            <p className="text-text-secondary mt-1">
              Bienvenido, {user.displayName || 'Refugio'}. Aquí tienes el resumen de tu actividad.
            </p>
          </div>
          <button
            onClick={handleAddNewPet}
            className="btn-primary flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all duration-300"
          >
            <Icon name="Plus" size={20} />
            <span>Añadir Nueva Mascota</span>
          </button>
        </div>

        {/* Stats Grid - Usando el componente robusto */}
        <DashboardStats stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pet Management List - Takes up 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface rounded-xl shadow-sm border border-border-light overflow-hidden">
              <div className="p-6 border-b border-border-light flex items-center justify-between">
                <h2 className="text-xl font-heading font-bold text-text-primary flex items-center gap-2">
                  <Icon name="Dog" className="text-primary" />
                  Gestionar Mascotas
                </h2>
                <span className="text-sm text-text-secondary bg-background-light px-3 py-1 rounded-full border border-border">
                  {pets.length} Total
                </span>
              </div>
              
              <div className="p-0">
                <PetManagementGrid 
                  pets={pets}
                  onEdit={handleEditPet}
                  onDelete={handleDeletePet}
                  onView={handleViewDetails}
                />
              </div>
            </div>
          </div>

          {/* Recent Activity Sidebar */}
          <div className="space-y-6">
             {/* Pasamos activity vacía por ahora */}
            <RecentActivity activity={[]} />
            
            {/* Quick Tips Card */}
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-100">
              <h3 className="font-heading font-bold text-primary-900 mb-2 flex items-center gap-2">
                <Icon name="Lightbulb" size={20} />
                Consejo Pro
              </h3>
              <p className="text-primary-800 text-sm">
                Las mascotas con más de 3 fotos y una descripción detallada tienen un 40% más de probabilidades de ser adoptadas rápidamente.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShelterDashboard;
