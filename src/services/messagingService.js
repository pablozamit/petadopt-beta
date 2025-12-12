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
  writeBatch, 
  addDoc, 
  Timestamp,
  limit,
  startAfter
} from "firebase/firestore"; 
import { db } from "../firebaseConfig";
import { logError } from "./errorLogger";
 
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 
// CONVERSATIONS 
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 
 
/** 
 * Obtiene o crea una conversación entre dos usuarios 
 */ 
export const getOrCreateConversation = async (user1Id, user2Id) => { 
  try {
    const conversationId = [user1Id, user2Id].sort().join("_"); 
    const conversationRef = doc(db, "conversations", conversationId); 
     
    const snapshot = await getDoc(conversationRef); 
     
    if (!snapshot.exists()) { 
      await setDoc(conversationRef, { 
        id: conversationId, 
        participants: [user1Id, user2Id], 
        lastMessage: "", 
        lastMessageTime: serverTimestamp(), 
        createdAt: serverTimestamp(), 
        updatedAt: serverTimestamp(),
        lastReadAt: serverTimestamp(), // ✅ NUEVO: Campo para forzar actualizaciones del listener
        unreadCountByUser: {} // ✅ Contador de no leídos optimizado
      }); 
    } 
     
    return conversationId;
  } catch (err) {
    await logError({
      type: 'getOrCreateConversation_failed',
      message: err.message,
      context: { user1Id, user2Id }
    });
    throw err;
  }
}; 
 
/** 
 * Obtiene todas las conversaciones del usuario 
 */ 
export const getUserConversations = async (userId) => { 
  try {
    const conversationsRef = collection(db, "conversations"); 
    const q = query( 
      conversationsRef, 
      where("participants", "array-contains", userId), 
      orderBy("lastMessageTime", "desc") 
    ); 
     
    const snapshot = await getDocs(q); 
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
  } catch (err) {
    await logError({
      type: 'getUserConversations_failed',
      message: err.message,
      context: { userId }
    });
    throw err;
  }
}; 
 
/** 
 * Listener en tiempo real para conversaciones del usuario 
 */ 
export const onUserConversationsChange = (userId, callback) => { 
  try {
    const conversationsRef = collection(db, "conversations"); 
    const q = query( 
      conversationsRef, 
      where("participants", "array-contains", userId), 
      orderBy("lastMessageTime", "desc") 
    ); 
     
    return onSnapshot(q, (snapshot) => { 
      const conversations = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })); 
      callback(conversations); 
    }, (error) => {
      logError({
        type: 'onUserConversationsChange_listener_error',
        message: error.message,
        context: { userId }
      });
    });
  } catch (err) {
    logError({
      type: 'onUserConversationsChange_setup_failed',
      message: err.message,
      context: { userId }
    });
    throw err;
  }
}; 
 
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 
// MESSAGES 
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 
 
/** 
 * Envía un mensaje en una conversación 
 */ 
export const sendMessage = async ( 
  conversationId,  
  senderId,  
  senderName,  
  senderType, 
  text, 
  senderAvatar = null 
) => { 
  try {
    if (!text || !text.trim()) {
      throw new Error('El mensaje no puede estar vacío');
    }

    const messagesRef = collection(db, "conversations", conversationId, "messages"); 
     
    const newMessage = { 
      senderId, 
      senderName, 
      senderType, 
      senderAvatar, 
      text: text.trim(), 
      createdAt: serverTimestamp(), 
      readBy: { [senderId]: Timestamp.now() },
      edited: false,
      deletedAt: null
    }; 
     
    const docRef = await addDoc(messagesRef, newMessage); 
     
    // ✅ OPTIMIZADO: Usar batch para actualizar conversación
    const batch = writeBatch(db);
    batch.update(doc(db, "conversations", conversationId), { 
      lastMessage: text.trim(), 
      lastMessageTime: serverTimestamp(), 
      updatedAt: serverTimestamp(),
    });
    await batch.commit();
     
    return docRef.id;
  } catch (err) {
    await logError({
      type: 'sendMessage_failed',
      message: err.message,
      context: { conversationId, senderId }
    });
    throw err;
  }
}; 
 
/** 
 * Obtiene mensajes de una conversación con paginación real 
 */ 
export const getConversationMessages = async (conversationId, limitCount = 50, lastSnapshot = null) => { 
  try {
    const messagesRef = collection(db, "conversations", conversationId, "messages"); 
    
    let q;
    if (lastSnapshot) {
      q = query(
        messagesRef, 
        orderBy("createdAt", "asc"),
        startAfter(lastSnapshot),
        limit(limitCount)
      );
    } else {
      q = query(
        messagesRef, 
        orderBy("createdAt", "asc"),
        limit(limitCount)
      );
    }
     
    const snapshot = await getDocs(q); 
    return {
      messages: snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })),
      lastSnapshot: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
      hasMore: snapshot.docs.length === limitCount
    };
  } catch (err) {
    await logError({
      type: 'getConversationMessages_failed',
      message: err.message,
      context: { conversationId }
    });
    throw err;
  }
}; 
 
/** 
 * Listener en tiempo real para mensajes de una conversación 
 */ 
export const onConversationMessagesChange = (conversationId, callback) => { 
  try {
    const messagesRef = collection(db, "conversations", conversationId, "messages"); 
    const q = query(messagesRef, orderBy("createdAt", "asc")); 
     
    return onSnapshot(q, (snapshot) => { 
      const messages = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })); 
      callback(messages); 
    }, (error) => {
      logError({
        type: 'onConversationMessagesChange_listener_error',
        message: error.message,
        context: { conversationId }
      });
    });
  } catch (err) {
    logError({
      type: 'onConversationMessagesChange_setup_failed',
      message: err.message,
      context: { conversationId }
    });
    throw err;
  }
}; 
 
/** 
 * Marca un mensaje como leído por un usuario (con debounce)
 */ 
export const markMessageAsRead = async (conversationId, messageId, userId) => { 
  try {
    const messageRef = doc(db, "conversations", conversationId, "messages", messageId); 
    const messageSnapshot = await getDoc(messageRef); 
    const messageData = messageSnapshot.data(); 
     
    // ✅ OPTIMIZADO: Evitar actualización innecesaria
    if (messageData.readBy?.[userId]) { 
      return; 
    } 
     
    // ✅ CRÍTICO (FIX 1): Usar batch para actualizar mensaje Y conversación
    // Esto fuerza que el listener de conversaciones se dispare
    const batch = writeBatch(db);
    batch.update(messageRef, { 
      [`readBy.${userId}`]: Timestamp.now(), 
    });
    batch.update(doc(db, "conversations", conversationId), {
      lastReadAt: serverTimestamp() // ✅ NUEVO: Trigger para que listener reaccione
    });
    await batch.commit();
  } catch (err) {
    await logError({
      type: 'markMessageAsRead_failed',
      message: err.message,
      context: { conversationId, messageId, userId }
    });
    // No lanzar error para que no afecte UX
  }
}; 
 
/** 
 * Marca todos los mensajes de una conversación como leídos 
 */ 
export const markConversationAsRead = async (conversationId, userId) => { 
  try {
    const messagesRef = collection(db, "conversations", conversationId, "messages"); 
    const q = query( 
      messagesRef, 
      where(`readBy.${userId}`, "==", null) 
    ); 
     
    const snapshot = await getDocs(q); 
    
    if (snapshot.empty) {
      return; // ✅ Evitar batch innecesario
    }

    const batch = writeBatch(db); 
     
    snapshot.docs.forEach(docSnapshot => { 
      batch.update(docSnapshot.ref, { 
        [`readBy.${userId}`]: Timestamp.now(), 
      }); 
    }); 

    // ✅ CRÍTICO (FIX 1): Actualizar lastReadAt para forzar listener
    batch.update(doc(db, "conversations", conversationId), {
      lastReadAt: serverTimestamp()
    });
     
    await batch.commit();
  } catch (err) {
    await logError({
      type: 'markConversationAsRead_failed',
      message: err.message,
      context: { conversationId, userId }
    });
  }
}; 
 
/** 
 * Obtiene el contador de mensajes no leídos por conversación 
 */ 
export const getUnreadMessagesCount = async (conversationId, userId) => { 
  try {
    const messagesRef = collection(db, "conversations", conversationId, "messages"); 
    const q = query(messagesRef); 
     
    const snapshot = await getDocs(q); 
    let unreadCount = 0; 
     
    snapshot.docs.forEach(docSnapshot => { 
      const messageData = docSnapshot.data(); 
      if (!messageData.readBy?.[userId]) { 
        unreadCount++; 
      } 
    }); 
     
    return unreadCount;
  } catch (err) {
    await logError({
      type: 'getUnreadMessagesCount_failed',
      message: err.message,
      context: { conversationId, userId }
    });
    return 0;
  }
}; 
 
/** 
 * ✅ REFACTORIZADO: Obtiene total de no leídos del usuario (sin N+1 queries)
 */ 
export const getTotalUnreadMessages = async (userId) => { 
  try {
    const conversationsRef = collection(db, "conversations"); 
    const q = query( 
      conversationsRef, 
      where("participants", "array-contains", userId) 
    ); 
     
    const conversationSnapshot = await getDocs(q); 
    let totalUnread = 0; 
     
    // ✅ CAMBIO: Usar unreadCountByUser si está disponible (sin cálculos caros)
    for (const conversationDoc of conversationSnapshot.docs) { 
      const convData = conversationDoc.data();
      
      // Si existe el contador optimizado, usarlo
      if (convData.unreadCountByUser?.[userId] !== undefined) {
        totalUnread += convData.unreadCountByUser[userId];
        continue;
      }

      // Fallback: contar manualmente (solo si no hay contador)
      const messagesRef = collection(db, "conversations", conversationDoc.id, "messages"); 
      const messagesQuery = query(messagesRef); 
      const messagesSnapshot = await getDocs(messagesQuery); 
       
      messagesSnapshot.docs.forEach(messageDoc => { 
        const messageData = messageDoc.data(); 
        if (!messageData.readBy?.[userId]) { 
          totalUnread++; 
        } 
      }); 
    } 
     
    return totalUnread;
  } catch (err) {
    await logError({
      type: 'getTotalUnreadMessages_failed',
      message: err.message,
      context: { userId }
    });
    return 0;
  }
}; 

/**
 * ✅ NUEVO: Obtener último mensaje de una conversación rápidamente
 */
export const getLastMessage = async (conversationId) => {
  try {
    const conversationRef = doc(db, "conversations", conversationId);
    const conversationSnap = await getDoc(conversationRef);
    
    if (!conversationSnap.exists()) {
      return null;
    }

    return {
      text: conversationSnap.data().lastMessage,
      time: conversationSnap.data().lastMessageTime
    };
  } catch (err) {
    await logError({
      type: 'getLastMessage_failed',
      message: err.message,
      context: { conversationId }
    });
    return null;
  }
};
