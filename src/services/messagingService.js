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
  Timestamp 
} from "firebase/firestore"; 
import { db } from "../firebaseConfig"; 
 
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 
// CONVERSATIONS 
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 
 
/** 
 * Obtiene o crea una conversación entre dos usuarios 
 */ 
export const getOrCreateConversation = async (user1Id, user2Id) => { 
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
    }); 
  } 
   
  return conversationId; 
}; 
 
/** 
 * Obtiene todas las conversaciones del usuario 
 */ 
export const getUserConversations = async (userId) => { 
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
}; 
 
/** 
 * Listener en tiempo real para conversaciones del usuario 
 */ 
export const onUserConversationsChange = (userId, callback) => { 
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
  }); 
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
  const messagesRef = collection(db, "conversations", conversationId, "messages"); 
   
  const newMessage = { 
    senderId, 
    senderName, 
    senderType, 
    senderAvatar, 
    text, 
    createdAt: serverTimestamp(), 
    readBy: { [senderId]: Timestamp.now() }, // Marcar como leído por el remitente 
  }; 
   
  const docRef = await addDoc(messagesRef, newMessage); 
   
  // Actualizar lastMessage en conversation 
  await updateDoc(doc(db, "conversations", conversationId), { 
    lastMessage: text, 
    lastMessageTime: serverTimestamp(), 
    updatedAt: serverTimestamp(), 
  }); 
   
  return docRef.id; 
}; 
 
/** 
 * Obtiene todos los mensajes de una conversación (paginado) 
 */ 
export const getConversationMessages = async (conversationId, limit = 50) => { 
  const messagesRef = collection(db, "conversations", conversationId, "messages"); 
  const q = query( 
    messagesRef, 
    orderBy("createdAt", "asc") 
  ); 
   
  const snapshot = await getDocs(q); 
  return snapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data() 
  })); 
}; 
 
/** 
 * Listener en tiempo real para mensajes de una conversación 
 */ 
export const onConversationMessagesChange = (conversationId, callback) => { 
  const messagesRef = collection(db, "conversations", conversationId, "messages"); 
  const q = query(messagesRef, orderBy("createdAt", "asc")); 
   
  return onSnapshot(q, (snapshot) => { 
    const messages = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })); 
    callback(messages); 
  }); 
}; 
 
/** 
 * Marca un mensaje como leído por un usuario 
 */ 
export const markMessageAsRead = async (conversationId, messageId, userId) => { 
  const messageRef = doc(db, "conversations", conversationId, "messages", messageId); 
  const messageSnapshot = await getDoc(messageRef); 
  const messageData = messageSnapshot.data(); 
   
  // No actualizar si ya está leído 
  if (messageData.readBy?.[userId]) { 
    return; 
  } 
   
  await updateDoc(messageRef, { 
    [`readBy.${userId}`]: Timestamp.now(), 
  }); 
}; 
 
/** 
 * Marca todos los mensajes de una conversación como leídos 
 */ 
export const markConversationAsRead = async (conversationId, userId) => { 
  const messagesRef = collection(db, "conversations", conversationId, "messages"); 
  const q = query( 
    messagesRef, 
    where(`readBy.${userId}`, "==", null) 
  ); 
   
  const snapshot = await getDocs(q); 
  const batch = writeBatch(db); 
   
  snapshot.docs.forEach(docSnapshot => { 
    batch.update(docSnapshot.ref, { 
      [`readBy.${userId}`]: Timestamp.now(), 
    }); 
  }); 
   
  await batch.commit(); 
}; 
 
/** 
 * Obtiene el contador de mensajes no leídos por conversación 
 */ 
export const getUnreadMessagesCount = async (conversationId, userId) => { 
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
}; 
 
/** 
 * Obtiene total de mensajes no leídos del usuario en todas conversaciones 
 */ 
export const getTotalUnreadMessages = async (userId) => { 
  const conversationsRef = collection(db, "conversations"); 
  const q = query( 
    conversationsRef, 
    where("participants", "array-contains", userId) 
  ); 
   
  const conversationSnapshot = await getDocs(q); 
  let totalUnread = 0; 
   
  for (const conversationDoc of conversationSnapshot.docs) { 
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
}; 
