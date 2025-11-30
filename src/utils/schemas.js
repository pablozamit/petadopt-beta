// src/utils/schemas.js

/**
 * Esquema completo de una mascota en Firestore
 * Colección: 'pets'
 */
export const PET_SCHEMA = {
  // Campos existentes (que ya tienes)
  name: '',
  species: '', // 'dog', 'cat', 'other'
  breed: '',
  age: '',
  size: '', // 'small', 'medium', 'large', 'xlarge'
  gender: '', // 'male', 'female'
  location: '',
  province: '', // NUEVO - importante para filtro geográfico
  images: [],
  videos: [],
  description: '',
  healthStatus: '',
  sterilized: false,
  vaccinated: false,
  microchipped: false,
  
  // NUEVOS CAMPOS PARA FILTROS AVANZADOS
  ageCategory: '', // 'puppy' (0-1), 'young' (1-3), 'adult' (3-7), 'senior' (7+)
  
  // Convivencia
  compatibility: {
    dogs: null,      // true/false/null (null = desconocido)
    cats: null,
    children: null,
    otherPets: null
  },
  
  // Necesidades especiales
  specialNeeds: {
    hasSpecialNeeds: false,
    medication: false,
    specialDiet: false,
    physicalDisability: false,
    behavioralNeeds: false,
    details: '' // texto explicativo
  },
  
  // Metadata
  shelterId: '',
  shelterInfo: {},
  status: 'active', // 'active', 'pending', 'adopted', 'inactive'
  createdAt: null,
  updatedAt: null,
  viewCount: 0,
  contactCount: 0
};

/**
 * Constantes para los filtros
 */
export const PROVINCES = [
  'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila',
  'Badajoz', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria',
  'Castellón', 'Ciudad Real', 'Córdoba', 'Cuenca', 'Gerona', 'Granada',
  'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 'Islas Baleares',
  'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas', 'León', 'Lérida',
  'Lugo', 'Madrid', 'Málaga', 'Murcia', 'Navarra', 'Orense', 'Palencia',
  'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife', 'Segovia',
  'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia',
  'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza'
];

export const AGE_CATEGORIES = [
  { value: 'puppy', label: 'Cachorro / Junior (0-1 año)', emoji: '🐶' },
  { value: 'young', label: 'Joven (1-3 años)', emoji: '🐕' },
  { value: 'adult', label: 'Adulto (3-7 años)', emoji: '🐕‍🦺' },
  { value: 'senior', label: 'Senior (+7 años)', emoji: '🦮' }
];

export const SIZE_CATEGORIES = [
  { 
    value: 'small', 
    label: 'Pequeño (hasta 10 kg)', 
    example: 'Ej: Yorkshire, gato pequeño' 
  },
  { 
    value: 'medium', 
    label: 'Mediano (10-25 kg)', 
    example: 'Ej: Beagle, Border Collie' 
  },
  { 
    value: 'large', 
    label: 'Grande (25-40 kg)', 
    example: 'Ej: Pastor Alemán' 
  },
  { 
    value: 'xlarge', 
    label: 'Muy grande (+40 kg)', 
    example: 'Ej: Mastín, Gran Danés' 
  }
];
