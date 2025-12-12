import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { logError } from "./errorLogger";

/**
 * ✅ PHASE 1: Auth Service
 * Manejo de autenticación y creación automática de perfiles
 */

/**
 * Registra un usuario NORMAL (adoptante)
 */
export const registerUser = async (email, password, displayName) => {
  try {
    // 1. Crear usuario en Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // 2. AUTOMÁTICAMENTE crear documento en /users con campos obligatorios
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
      uid,
      email,
      displayName: displayName || "Usuario",
      role: "user", // ✅ AUTOMÁTICO
      verified: false, // ✅ AUTOMÁTICO (usuarios normales no necesitan verificación)
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return uid;
  } catch (err) {
    await logError({
      type: "registerUser_failed",
      message: err.message,
      context: { email }
    });
    throw err;
  }
};

/**
 * Registra un SHELTER/REFUGIO
 */
export const registerShelter = async (email, password, shelterData) => {
  try {
    // 1. Crear usuario en Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // 2. AUTOMÁTICAMENTE crear documento en /users con campos de shelter
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
      uid,
      email,
      displayName: shelterData.displayName || shelterData.shelterName,
      shelterName: shelterData.shelterName,
      role: "shelter", // ✅ AUTOMÁTICO
      verified: false, // ✅ AUTOMÁTICO (admin debe verificar)
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
      // ... otros campos opcionales que quieras agregar
    });

    return uid;
  } catch (err) {
    await logError({
      type: "registerShelter_failed",
      message: err.message,
      context: { email, shelterName: shelterData.shelterName }
    });
    throw err;
  }
};

/**
 * Login de usuario
 */
export const loginUser = async (email, password) => {
  try {
    // Configurar persistencia local (no cerrar sesión al recargar)
    await setPersistence(auth, browserLocalPersistence);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (err) {
    await logError({
      type: "loginUser_failed",
      message: err.message,
      context: { email }
    });
    throw err;
  }
};

/**
 * Logout
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    await logError({
      type: "logoutUser_failed",
      message: err.message
    });
    throw err;
  }
};

/**
 * Listener para cambios de autenticación
 * Retorna el usuario actual o null
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};
