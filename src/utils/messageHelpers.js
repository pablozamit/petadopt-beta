import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns"; 
import { es } from "date-fns/locale"; 
 
/** 
 * Formatea timestamp de Firestore a fecha legible 
 */ 
export const formatMessageTime = (timestamp) => { 
  if (!timestamp) return ""; 
   
  const date = timestamp.toDate?.() || new Date(timestamp); 
   
  if (isToday(date)) { 
    return format(date, "HH:mm", { locale: es }); 
  } 
   
  if (isYesterday(date)) { 
    return "Ayer " + format(date, "HH:mm", { locale: es }); 
  } 
   
  return format(date, "d/M/yyyy HH:mm", { locale: es }); 
}; 
 
/** 
 * Formatea timestamp relativo (hace 5 minutos) 
 */ 
export const formatTimeAgo = (timestamp) => { 
  if (!timestamp) return ""; 
   
  const date = timestamp.toDate?.() || new Date(timestamp); 
  return formatDistanceToNow(date, { addSuffix: true, locale: es }); 
}; 
 
/** 
 * Obtiene estado de lectura de un mensaje 
 */ 
export const getMessageReadStatus = (message, recipientId) => { 
  // Devuelve si fue leído y cuándo 
  return { 
    isRead: !!message.readBy?.[recipientId], 
    readAt: message.readBy?.[recipientId], 
  }; 
}; 
 
/** 
 * Genera ID único para conversación 
 */ 
export const generateConversationId = (userId1, userId2) => { 
  return [userId1, userId2].sort().join("_"); 
}; 
 
/** 
 * Valida mensaje antes de enviar 
 */ 
export const validateMessage = (text) => { 
  const trimmed = text.trim(); 
   
  if (!trimmed) return { valid: false, error: "El mensaje no puede estar vacío" }; 
  if (trimmed.length > 5000) return { valid: false, error: "El mensaje es demasiado largo (máx 5000 caracteres)" }; 
   
  return { valid: true }; 
}; 
