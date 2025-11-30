import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from './useAuth';

/**
 * Hook personalizado para gestionar favoritos
 * - Si el usuario está autenticado: guarda en Firebase
 * - Si no está autenticado: guarda en localStorage
 */
export const useFavorites = (type = 'pets') => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const storageKey = type === 'pets' ? 'favorites' : 'professionalFavorites';

  // Cargar favoritos al montar el componente
  useEffect(() => {
    loadFavorites();
  }, [user, type]);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      if (user) {
        // Usuario autenticado: cargar desde Firebase
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const cloudFavorites = userData[storageKey] || [];
          setFavorites(cloudFavorites);
          
          // Sincronizar con localStorage para compatibilidad
          localStorage.setItem(storageKey, JSON.stringify(cloudFavorites));
        } else {
          setFavorites([]);
        }
      } else {
        // Usuario no autenticado: cargar desde localStorage
        const localFavorites = JSON.parse(localStorage.getItem(storageKey) || '[]');
        setFavorites(localFavorites);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      // En caso de error, usar localStorage como fallback
      const localFavorites = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setFavorites(localFavorites);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFavorites = async (newFavorites) => {
    try {
      if (user) {
        // Usuario autenticado: guardar en Firebase
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          [storageKey]: newFavorites
        });
      }
      
      // Siempre guardar en localStorage como backup
      localStorage.setItem(storageKey, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
      
      // Disparar evento para actualizar el contador
      window.dispatchEvent(new Event('favoritesChanged'));
    } catch (error) {
      console.error('Error saving favorites:', error);
      // En caso de error, solo guardar en localStorage
      localStorage.setItem(storageKey, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
      window.dispatchEvent(new Event('favoritesChanged'));
    }
  };

  const addFavorite = async (itemId) => {
    if (!favorites.includes(itemId)) {
      const newFavorites = [...favorites, itemId];
      await saveFavorites(newFavorites);
    }
  };

  const removeFavorite = async (itemId) => {
    const newFavorites = favorites.filter(id => id !== itemId);
    await saveFavorites(newFavorites);
  };

  const toggleFavorite = async (itemId) => {
    if (favorites.includes(itemId)) {
      await removeFavorite(itemId);
    } else {
      await addFavorite(itemId);
    }
  };

  const isFavorite = (itemId) => {
    return favorites.includes(itemId);
  };

  const clearAllFavorites = async () => {
    await saveFavorites([]);
  };

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearAllFavorites,
    count: favorites.length
  };
};
