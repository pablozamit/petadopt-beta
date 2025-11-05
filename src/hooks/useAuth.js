import React, { useState, useEffect, useContext, createContext } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        // Obtener datos adicionales de Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        } else {
          // Opcional: manejar el caso donde el usuario de Auth existe
          // pero no tiene un documento en Firestore.
          console.warn("No se encontró documento en Firestore para el usuario:", currentUser.uid);
          setUserData(null);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    // Limpiar la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password, additionalData = {}) => {
    try {
      // 1. Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // 2. Crear documento en Firestore
      const userDocRef = doc(db, 'users', newUser.uid);
      await setDoc(userDocRef, {
        uid: newUser.uid,
        email: newUser.email,
        createdAt: serverTimestamp(),
        ...additionalData,
      });

      return userCredential;
    } catch (error) {
      // Manejar errores (e.g., email ya en uso)
      console.error("Error en el registro:", error);
      throw error;
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    userData,
    loading,
    login,
    register,
    logout,
  };

  // Muestra un spinner a pantalla completa mientras se verifica el estado de autenticación
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-light">
        <LoadingSpinner text="Verificando sesión..." size="lg" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
