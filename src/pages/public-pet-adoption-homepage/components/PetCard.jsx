import React from 'react';
import Icon from 'components/AppIcon';
import { useNavigate } from 'react-router-dom';

const PetCard = ({ pet }) => {
  const navigate = useNavigate();
  const daysWaiting = Math.floor(Math.random() * 90) + 10; // Simulado desde Firebase real

  const tags = [
    pet.chip ? 'Chip' : null,
    pet.vaccinated ? 'Vacunado' : null,
    pet.spayed ? 'Castrado/a' : null,
    pet.houseTrained ? 'Educado' : null
  ].filter(Boolean);

  return (
    <div className="group bg-surface rounded-2xl shadow-sm border border-border-light overflow-hidden hover:shadow-xl hover:border-primary/60 transition-all duration-300 cursor-pointer" onClick={() => navigate(`/pet/${pet.id}`)}>
      {/* Foto principal */}
      <div className="relative h-64 bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
        <img
          src={pet.images?.[0] || '/placeholder-pet.jpg'}
          alt={pet.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
          Galería {pet.images?.length || 1} fotos
        </div>
      </div>

      {/* Datos básicos */}
      <div className="p-6">
        <h3 className="text-2xl font-heading font-bold text-text-primary mb-1">
          {pet.name}
        </h3>
        <div className="flex items-center gap-2 text-text-secondary text-sm mb-3">
          <span>{pet.age} • {pet.size} • {pet.location}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted mb-4">
          <Icon name="Clock" size={14} />
          <span>Esperando familia desde hace {daysWaiting} días</span>
        </div>

        {/* Mi historia */}
        <div className="mb-4">
          <h4 className="font-semibold text-text-primary mb-2 text-sm">Mi historia</h4>
          <p className="text-sm text-text-secondary line-clamp-3">
            {pet.description || 'Una descripción especial te espera en mi ficha completa...'}
          </p>
        </div>

        {/* Encajo contigo si */}
        <div className="mb-4">
          <h5 className="font-semibold text-text-primary mb-1 text-xs uppercase tracking-wider">
            Encajo contigo si...
          </h5>
          <ul className="space-y-1 text-xs text-text-secondary">
            <li>• Tienes jardín o sales mucho a pasear</li>
            <li>• Eres activo/a y te gustan los juegos</li>
            <li>• Puedes darme rutinas de ejercicio diario</li>
          </ul>
        </div>

        {/* No soy para ti si */}
        <div className="mb-6">
          <h5 className="font-semibold text-text-primary mb-1 text-xs uppercase tracking-wider">
            No soy para ti si...
          </h5>
          <ul className="space-y-1 text-xs text-warning">
            <li>• Pasas fuera de casa ms de 6 horas</li>
            <li>• No tienes experiencia con razas energéticas</li>
            <li>• Buscas un perro totalmente calmado</li>
          </ul>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button className="w-full btn-primary py-3 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
          <Icon name="HeartHandshake" size={20} />
          Quiero conocer a {pet.name}
        </button>
      </div>
    </div>
  );
};

export default PetCard;
