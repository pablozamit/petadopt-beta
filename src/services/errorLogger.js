import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * ✅ PHASE 1: Error Logging System
 * Centralizado para rastrear todos los errores en tiempo real
 */

const ERROR_LOGS_COLLECTION = "error_logs";
const MAX_LOG_RETENTION_DAYS = 30;

/**
 * Registra un error en la base de datos
 */
export const logError = async (errorData) => {
  try {
    const errorLog = {
      timestamp: serverTimestamp(),
      severity: errorData.severity || "ERROR",
      type: errorData.type || "unknown",
      message: errorData.message || "Unknown error",
      stack: errorData.stack || null,
      context: errorData.context || {},
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      url: typeof window !== "undefined" ? window.location.href : null,
      environment: process.env.NODE_ENV || "unknown",
      resolved: false,
      resolvedAt: null
    };

    await addDoc(collection(db, ERROR_LOGS_COLLECTION), errorLog);
  } catch (err) {
    // Fallback: log a console si no se puede guardar
    console.error("[ErrorLogger Failed]", errorData, err);
  }
};

/**
 * Registra un warning
 */
export const logWarning = async (warningData) => {
  return logError({
    ...warningData,
    severity: "WARNING"
  });
};

/**
 * Registra información general
 */
export const logInfo = async (infoData) => {
  return logError({
    ...infoData,
    severity: "INFO"
  });
};

/**
 * Obtiene últimos errores
 */
export const getRecentErrors = async (limitCount = 100, minutesBack = 60) => {
  try {
    const cutoffTime = new Date(Date.now() - minutesBack * 60000);
    const q = query(
      collection(db, ERROR_LOGS_COLLECTION),
      where("timestamp", ">=", cutoffTime),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    console.error("[getRecentErrors Failed]", err);
    return [];
  }
};

/**
 * Obtiene errores por tipo
 */
export const getErrorsByType = async (errorType, limitCount = 50) => {
  try {
    const q = query(
      collection(db, ERROR_LOGS_COLLECTION),
      where("type", "==", errorType),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    console.error("[getErrorsByType Failed]", err);
    return [];
  }
};

/**
 * Cuenta errores por tipo en las últimas N horas
 */
export const getErrorCountByType = async (hoursBack = 24) => {
  try {
    const cutoffTime = new Date(Date.now() - hoursBack * 3600000);
    const q = query(
      collection(db, ERROR_LOGS_COLLECTION),
      where("timestamp", ">=", cutoffTime),
      orderBy("timestamp", "desc")
    );

    const snapshot = await getDocs(q);
    const counts = {};

    snapshot.docs.forEach(doc => {
      const errorType = doc.data().type;
      counts[errorType] = (counts[errorType] || 0) + 1;
    });

    return counts;
  } catch (err) {
    console.error("[getErrorCountByType Failed]", err);
    return {};
  }
};

/**
 * Marca un error como resuelto
 */
export const resolveError = async (errorId) => {
  try {
    await updateDoc(doc(db, ERROR_LOGS_COLLECTION, errorId), {
      resolved: true,
      resolvedAt: serverTimestamp()
    });
  } catch (err) {
    console.error("[resolveError Failed]", err);
  }
};

/**
 * Limpia logs antiguos (para ejecutar con Cloud Functions)
 */
export const cleanOldErrorLogs = async (retentionDays = MAX_LOG_RETENTION_DAYS) => {
  try {
    const cutoffTime = new Date(Date.now() - retentionDays * 24 * 3600000);
    const q = query(
      collection(db, ERROR_LOGS_COLLECTION),
      where("timestamp", "<", cutoffTime)
    );

    const snapshot = await getDocs(q);
    let deletedCount = 0;

    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(db, ERROR_LOGS_COLLECTION, docSnap.id));
      deletedCount++;
    }

    console.log(`Cleaned ${deletedCount} old error logs`);
    return deletedCount;
  } catch (err) {
    console.error("[cleanOldErrorLogs Failed]", err);
    return 0;
  }
};

/**
 * Exporta errores para análisis (CSV format)
 */
export const exportErrorsToCSV = async (hoursBack = 24) => {
  try {
    const errors = await getRecentErrors(1000, hoursBack * 60);
    
    const headers = ["Timestamp", "Type", "Severity", "Message", "Context", "URL"];
    const rows = errors.map(err => [
      new Date(err.timestamp?.toDate?.() || err.timestamp).toISOString(),
      err.type,
      err.severity,
      err.message,
      JSON.stringify(err.context),
      err.url
    ]);

    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    return csv;
  } catch (err) {
    console.error("[exportErrorsToCSV Failed]", err);
    return "";
  }
};

/**
 * Hook para monitorear Firestore usage en tiempo real
 */
export const createFirestoreUsageMonitor = () => {
  let readCount = 0;
  let writeCount = 0;
  const THRESHOLD_READ = 100;
  const THRESHOLD_WRITE = 50;

  const trackRead = () => {
    readCount++;
    checkThresholds();
  };

  const trackWrite = () => {
    writeCount++;
    checkThresholds();
  };

  const checkThresholds = () => {
    if (readCount > THRESHOLD_READ) {
      logWarning({
        type: "high_firestore_read_usage",
        message: `High Firestore read usage: ${readCount} reads in monitoring period`,
        context: { readCount, threshold: THRESHOLD_READ }
      });
    }

    if (writeCount > THRESHOLD_WRITE) {
      logWarning({
        type: "high_firestore_write_usage",
        message: `High Firestore write usage: ${writeCount} writes in monitoring period`,
        context: { writeCount, threshold: THRESHOLD_WRITE }
      });
    }
  };

  const reset = () => {
    readCount = 0;
    writeCount = 0;
  };

  return { trackRead, trackWrite, reset, checkThresholds };
};

/**
 * Global error handler para el app
 */
export const setupGlobalErrorHandler = () => {
  if (typeof window === "undefined") return;

  // Uncaught errors
  window.addEventListener("error", (event) => {
    logError({
      type: "uncaught_error",
      message: event.message,
      stack: event.error?.stack,
      context: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    });
  });

  // Unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    logError({
      type: "unhandled_promise_rejection",
      message: event.reason?.message || String(event.reason),
      stack: event.reason?.stack,
      context: {
        promise: "Promise"
      }
    });
  });
};
