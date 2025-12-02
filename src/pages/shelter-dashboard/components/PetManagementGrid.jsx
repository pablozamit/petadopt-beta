import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const PetManagementGrid = ({ pets, onEdit, onDelete, onView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // PROTECCIÓN CONTRA UNDEFINED:
  // Si 'pets' no llega, usamos un array vacío para evitar el crash.
  const safePets = pets || [];

  const filteredPets = safePets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (pet.breed || '').toLowerCase().includes(searchTerm.toLowerCase()); // Breed puede no existir
    const matchesStatus = filterStatus === 'all' || pet.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success-light text-success border-success';
      case 'pending': return 'bg-warning-light text-warning border-warning';
      case 'adopted': return 'bg-primary-50 text-primary border-primary';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'En Adopción';
      case 'pending': return 'En Proceso';
      case 'adopted': return 'Adoptado';
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border-light overflow-hidden">
      {/* Header & Filters */}
      <div className="p-6 border-b border-border-light space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between bg-surface">
        <div className="relative max-w-xs w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Search" size={18} className="text-text-muted" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="input-field pl-10 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-text-secondary">Estado:</span>
          <select
            className="input-field py-2 text-sm w-auto"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="active">En Adopción</option>
            <option value="pending">En Proceso</option>
            <option value="adopted">Adoptados</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background-light">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Mascota</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Estadísticas</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {filteredPets.length > 0 ? (
              filteredPets.map((pet) => (
                <tr key={pet.id} className="hover:bg-surface transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-border-light">
                        <Image 
                          src={pet.images && pet.images.length > 0 ? pet.images[0] : null} 
                          alt={pet.name} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-text-primary">{pet.name}</div>
                        <div className="text-xs text-text-secondary">{pet.species} • {pet.age}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full border ${getStatusColor(pet.status)}`}>
                      {getStatusLabel(pet.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4 text-xs text-text-secondary">
                      <div className="flex items-center space-x-1" title="Vistas">
                        <Icon name="Eye" size={14} />
                        <span>{pet.views || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1" title="Favoritos">
                        <Icon name="Heart" size={14} />
                        <span>{pet.favorites || 0}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => onView(pet.id)}
                        className="p-1 text-text-secondary hover:text-primary transition-colors" 
                        title="Ver detalle"
                      >
                        <Icon name="ExternalLink" size={18} />
                      </button>
                      <button 
                        onClick={() => onEdit(pet.id)}
                        className="p-1 text-text-secondary hover:text-accent transition-colors" 
                        title="Editar"
                      >
                        <Icon name="Edit" size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(pet.id)}
                        className="p-1 text-text-secondary hover:text-error transition-colors" 
                        title="Eliminar"
                      >
                        <Icon name="Trash2" size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-text-secondary">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="p-3 bg-background rounded-full">
                      <Icon name="Search" size={24} className="text-text-muted" />
                    </div>
                    <p>No se encontraron mascotas.</p>
                    {searchTerm && <p className="text-xs">Prueba con otros términos de búsqueda.</p>}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PetManagementGrid;
