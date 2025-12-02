import React from 'react';
import Icon from 'components/AppIcon';

const StatCard = ({ title, value, icon, color, trend }) => (
  <div className="bg-surface rounded-xl p-6 shadow-sm border border-border-light hover:shadow-md transition-shadow duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon name={icon} className={`text-${color.replace('bg-', '')}`} size={24} />
      </div>
      {trend && (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-success-light text-success' : 'bg-error-light text-error'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div>
      <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-heading font-bold text-text-primary">{value || 0}</h3>
    </div>
  </div>
);

const DashboardStats = ({ stats }) => {
  // Protección contra datos nulos o indefinidos
  const safeStats = stats || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Mascotas"
        value={safeStats.totalPets || 0}
        icon="Dog"
        color="bg-primary"
        trend={12}
      />
      <StatCard
        title="En Adopción"
        value={safeStats.activeListings || 0}
        icon="Heart"
        color="bg-accent"
      />
      <StatCard
        title="Adoptados"
        value={safeStats.adoptedPets || 0}
        icon="Home"
        color="bg-success"
        trend={5}
      />
      <StatCard
        title="Solicitudes"
        value={safeStats.pendingInquiries || 0}
        icon="MessageCircle"
        color="bg-secondary"
      />
    </div>
  );
};

export default DashboardStats;
