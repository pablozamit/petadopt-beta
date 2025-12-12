import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  addDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { logError } from "./errorLogger";

/**
 * ✅ PHASE 1: Professionals Service
 * Manejo de profesionales (veterinarios, educadores, peluqueros, etc.)
 */

const PROFESSIONALS_COLLECTION = "professionals";
const VALID_SPECIALIZATIONS = ["vet", "trainer", "groomer", "pet_shop", "daycare", "walker"];

/**
 * Crea el perfil de un profesional
 */
export const createProfessionalProfile = async (uid, professionalData) => {
  try {
    if (!VALID_SPECIALIZATIONS.includes(professionalData.specialization)) {
      throw new Error(`Invalid specialization: ${professionalData.specialization}`);
    }

    const professionalRef = doc(db, PROFESSIONALS_COLLECTION, uid);
    
    await setDoc(professionalRef, {
      uid,
      name: professionalData.name,
      email: professionalData.email,
      specialization: professionalData.specialization,
      location: professionalData.location || "",
      businessName: professionalData.businessName || "",
      bio: professionalData.bio || "",
      phone: professionalData.phone || "",
      website: professionalData.website || "",
      profileImage: professionalData.profileImage || null,
      services: professionalData.services || [],
      verified: false, // Solo admin puede verificar
      rating: 0,
      reviewCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return uid;
  } catch (err) {
    await logError({
      type: "createProfessionalProfile_failed",
      message: err.message,
      context: { uid }
    });
    throw err;
  }
};

/**
 * Obtiene perfil de profesional
 */
export const getProfessionalProfile = async (uid) => {
  try {
    const professionalRef = doc(db, PROFESSIONALS_COLLECTION, uid);
    const snapshot = await getDoc(professionalRef);
    
    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data()
    };
  } catch (err) {
    await logError({
      type: "getProfessionalProfile_failed",
      message: err.message,
      context: { uid }
    });
    throw err;
  }
};

/**
 * Obtiene profesionales verificados por especialización
 */
export const getProfessionalsBySpecialization = async (specialization, locationFilter = null) => {
  try {
    const professionalsRef = collection(db, PROFESSIONALS_COLLECTION);
    let q;

    if (locationFilter) {
      q = query(
        professionalsRef,
        where("specialization", "==", specialization),
        where("verified", "==", true),
        where("location", "==", locationFilter),
        orderBy("rating", "desc")
      );
    } else {
      q = query(
        professionalsRef,
        where("specialization", "==", specialization),
        where("verified", "==", true),
        orderBy("rating", "desc")
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    await logError({
      type: "getProfessionalsBySpecialization_failed",
      message: err.message,
      context: { specialization, locationFilter }
    });
    return [];
  }
};

/**
 * Listener en tiempo real para profesionales verificados
 */
export const onVerifiedProfessionalsChange = (specialization, callback) => {
  try {
    const professionalsRef = collection(db, PROFESSIONALS_COLLECTION);
    const q = query(
      professionalsRef,
      where("verified", "==", true),
      where("specialization", "==", specialization),
      orderBy("rating", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const professionals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(professionals);
    }, (error) => {
      logError({
        type: "onVerifiedProfessionalsChange_listener_error",
        message: error.message,
        context: { specialization }
      });
    });
  } catch (err) {
    logError({
      type: "onVerifiedProfessionalsChange_setup_failed",
      message: err.message,
      context: { specialization }
    });
    throw err;
  }
};

/**
 * Actualiza perfil de profesional
 */
export const updateProfessionalProfile = async (uid, updateData) => {
  try {
    // No permitir actualizar verified o createdAt
    const { verified, createdAt, ...safeData } = updateData;

    const professionalRef = doc(db, PROFESSIONALS_COLLECTION, uid);
    await updateDoc(professionalRef, {
      ...safeData,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    await logError({
      type: "updateProfessionalProfile_failed",
      message: err.message,
      context: { uid }
    });
    throw err;
  }
};

/**
 * Añade una review a un profesional
 */
export const addReviewToProfessional = async (professionalId, userId, review) => {
  try {
    if (review.rating < 1 || review.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const reviewsRef = collection(db, PROFESSIONALS_COLLECTION, professionalId, "reviews");
    
    const reviewDoc = await addDoc(reviewsRef, {
      userId,
      rating: review.rating,
      text: review.text || "",
      createdAt: serverTimestamp()
    });

    // ✅ Actualizar rating promedio del profesional
    await updateProfessionalRating(professionalId);

    return reviewDoc.id;
  } catch (err) {
    await logError({
      type: "addReviewToProfessional_failed",
      message: err.message,
      context: { professionalId, userId }
    });
    throw err;
  }
};

/**
 * Obtiene reviews de un profesional
 */
export const getProfessionalReviews = async (professionalId) => {
  try {
    const reviewsRef = collection(db, PROFESSIONALS_COLLECTION, professionalId, "reviews");
    const q = query(reviewsRef, orderBy("createdAt", "desc"));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    await logError({
      type: "getProfessionalReviews_failed",
      message: err.message,
      context: { professionalId }
    });
    return [];
  }
};

/**
 * Listener en tiempo real para reviews
 */
export const onProfessionalReviewsChange = (professionalId, callback) => {
  try {
    const reviewsRef = collection(db, PROFESSIONALS_COLLECTION, professionalId, "reviews");
    const q = query(reviewsRef, orderBy("createdAt", "desc"));

    return onSnapshot(q, (snapshot) => {
      const reviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(reviews);
    }, (error) => {
      logError({
        type: "onProfessionalReviewsChange_listener_error",
        message: error.message,
        context: { professionalId }
      });
    });
  } catch (err) {
    logError({
      type: "onProfessionalReviewsChange_setup_failed",
      message: err.message,
      context: { professionalId }
    });
    throw err;
  }
};

/**
 * Elimina una review (solo el autor o admin)
 */
export const deleteReview = async (professionalId, reviewId) => {
  try {
    const reviewRef = doc(db, PROFESSIONALS_COLLECTION, professionalId, "reviews", reviewId);
    await deleteDoc(reviewRef);
    
    // Actualizar rating del profesional
    await updateProfessionalRating(professionalId);
  } catch (err) {
    await logError({
      type: "deleteReview_failed",
      message: err.message,
      context: { professionalId, reviewId }
    });
    throw err;
  }
};

/**
 * ✅ HELPER: Actualiza el rating promedio del profesional
 */
const updateProfessionalRating = async (professionalId) => {
  try {
    const reviews = await getProfessionalReviews(professionalId);
    
    if (reviews.length === 0) {
      await updateDoc(doc(db, PROFESSIONALS_COLLECTION, professionalId), {
        rating: 0,
        reviewCount: 0
      });
      return;
    }

    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await updateDoc(doc(db, PROFESSIONALS_COLLECTION, professionalId), {
      rating: Math.round(averageRating * 10) / 10, // 1 decimal
      reviewCount: reviews.length
    });
  } catch (err) {
    await logError({
      type: "updateProfessionalRating_failed",
      message: err.message,
      context: { professionalId }
    });
  }
};

/**
 * Obtiene todos los profesionales sin verificar (para admin)
 */
export const getUnverifiedProfessionals = async () => {
  try {
    const professionalsRef = collection(db, PROFESSIONALS_COLLECTION);
    const q = query(
      professionalsRef,
      where("verified", "==", false),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    await logError({
      type: "getUnverifiedProfessionals_failed",
      message: err.message
    });
    return [];
  }
};

/**
 * Verifica un profesional (solo admin)
 * Esta función es de referencia - en realidad debe hacerse desde admin panel
 */
export const verifyProfessional = async (professionalId) => {
  try {
    // En producción, esto debería ser hecho por admin con Cloud Functions o admin SDK
    console.warn("verifyProfessional should be called from admin panel only");
    
    const professionalRef = doc(db, PROFESSIONALS_COLLECTION, professionalId);
    await updateDoc(professionalRef, {
      verified: true,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    await logError({
      type: "verifyProfessional_failed",
      message: err.message,
      context: { professionalId }
    });
    throw err;
  }
};
