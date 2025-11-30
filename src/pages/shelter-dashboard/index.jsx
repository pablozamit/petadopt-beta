import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Importamos la DB real
import { useAuth } from 'hooks/useAuth'; // Auth real
import Icon from 'components/AppIcon';

import AdaptiveHeader from 'components/ui/AdaptiveHeader';
import DashboardQuickActions from 'components/ui/DashboardQuickActions';
import DashboardStats from './components/DashboardStats';
import PetManagementGrid from './components/PetManagementGrid';
import RecentActivity from './components/RecentActivity';

const ShelterDashboard = () => {
  const navigate = useNavigate();
  const { user, userData, loading } = useAuth();
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [selectedPets, setSelectedPets] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // 1. Escuchar la base de datos en TIEMPO REAL
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/authentication-login-register');
      return;
    }

    // Consulta: Dame las mascotas donde 'shelterId' sea igual a MI id actual
    const q = query(
      collection(db, "pets"),
      where("shelterId", "==", user.uid)
    );

    // Suscripción a cambios (se ejecuta al inicio y cada vez que algo cambia en la DB)
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const petsData = [];
      querySnapshot.forEach((doc) => {
        petsData.push({ id: doc.id, ...doc.data() });
      });
      setPets(petsData);
      setFilteredPets(petsData);
      setIsLoadingData(false);
    }, (error) => {
      console.error("Error leyendo mascotas:", error);
      setIsLoadingData(false);
    });

    // Limpiar suscripción al desmontar
    return () => unsubscribe();
  }, [user, loading, navigate]);

  // 2. Filtrado local (Búsqueda, Estado, Especie)
  useEffect(() => {
    let filtered = pets;

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(pet =>
        (pet.name && pet.name.toLowerCase().includes(lowerTerm)) ||
        (pet.breed && pet.breed.toLowerCase().includes(lowerTerm))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(pet => pet.status === statusFilter);
    }

    if (speciesFilter !== 'all') {
      filtered = filtered.filter(pet => pet.species === speciesFilter);
    }

    setFilteredPets(filtered);
  }, [pets, searchTerm, statusFilter, speciesFilter]);

  const handleAddPet = () => navigate('/add-edit-pet-form');
  
  const handleEditPet = (petId) => navigate(`/add-edit-pet-form?edit=true&id=${petId}`);

  // 3. Borrado Real en Base de Datos
  const handleDeletePet = async (petId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta mascota permanentemente?')) {
      try {
        await deleteDoc(doc(db, "pets", petId));
        // No necesitamos actualizar el estado manualmente, onSnapshot lo hará
      } catch (error) {
        console.error("Error eliminando:", error);
        alert("Error al eliminar. Inténtalo de nuevo.");
      }
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  if (loading || isLoadingData) {
    return (
      <div className="min-h-screen bg-background">
        <AdaptiveHeader />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary">Cargando tus mascotas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdaptiveHeader />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8 animate-fade-in">
            <div className="bg-gradient-to-r from-primary to-primary-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2">
                    ¡Hola, {userData?.displayName || user?.email}!
                  </h1>
                  <p className="text-primary-100 capitalize">
                    {getCurrentDate()}
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Icon name="Building2" size={32} color="white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <DashboardQuickActions />

          {/* Dashboard Stats */}
          <DashboardStats pets={pets} />

          {/* Search and Filters */}
          <div className="bg-surface rounded-xl p-6 shadow-sm border border-border-light mb-8 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <h2 className="text-xl font-heading font-semibold text-text-primary">
                Gestión de Mascotas
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o raza..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="pending">Pendiente</option>
                <option value="adopted">Adoptado</option>
              </select>

              {/* Species Filter */}
              <select
                value={speciesFilter}
                onChange={(e) => setSpeciesFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">Todas las especies</option>
                <option value="dog">Perros</option>
                <option value="cat">Gatos</option>
              </select>

              {/* Add Pet Button */}
              <button onClick={handleAddPet} className="btn-primary flex items-center justify-center space-x-2">
                <Icon name="Plus" size={20} />
                <span>Añadir Mascota</span>
              </button>
            </div>
          </div>

          {/* Pet Management Grid */}
          <div id="pets-section">
            <PetManagementGrid
              pets={filteredPets}
              selectedPets={selectedPets}
              onSelectPet={setSelectedPets}
              onEditPet={handleEditPet}
              onDeletePet={handleDeletePet}
            />
          </div>

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </main>
    </div>
  );
};

export default ShelterDashboard;
