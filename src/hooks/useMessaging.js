import { useState, useEffect, useCallback, useRef } from "react"; 
import { 
  onUserConversationsChange, 
  onConversationMessagesChange, 
  sendMessage as sendMessageService, 
  markMessageAsRead, 
  markConversationAsRead, 
  getOrCreateConversation, 
  getTotalUnreadMessages, 
} from "../services/messagingService";
import { logError } from "../services/errorLogger";

/**
 * ✅ PHASE 1: useMessaging Hook con optimizaciones
 */

// ✅ Helper: Debounce function
const createDebounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// ✅ Helper: Throttle function  
const createThrottle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const useMessaging = (currentUserId, currentUserType, currentUserName) => { 
  const [conversations, setConversations] = useState([]); 
  const [currentConversationId, setCurrentConversationId] = useState(null); 
  const [currentMessages, setCurrentMessages] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [totalUnread, setTotalUnread] = useState(0);
  
  // ✅ NUEVO: Rastrear qué mensajes se han marcado como leídos
  const markedAsReadRef = useRef(new Set());
  const throttledMarkAsReadRef = useRef(null);
  const unsubscribersRef = useRef([]);
  const debouncedUpdateUnreadRef = useRef(null);
 
  // Listener en tiempo real para conversaciones 
  useEffect(() => { 
    if (!currentUserId) return; 
     
    setLoading(true); 
    const unsubscribe = onUserConversationsChange(currentUserId, (convs) => { 
      setConversations(convs); 
      setLoading(false); 
    }); 

    unsubscribersRef.current.push(unsubscribe);
    return () => {
      unsubscribe();
    };
  }, [currentUserId]); 
 
  // ✅ NUEVO: Crear throttle para marcar mensajes como leídos
  useEffect(() => {
    throttledMarkAsReadRef.current = createThrottle(() => {
      if (!currentConversationId || !currentUserId) return;
      
      const unreadMessageIds = currentMessages
        .filter(msg => msg.senderId !== currentUserId && !msg.readBy?.[currentUserId])
        .map(msg => msg.id);

      if (unreadMessageIds.length === 0) return;

      // Marcar solo los que no se han marcado en este ciclo
      const toMark = unreadMessageIds.filter(id => !markedAsReadRef.current.has(id));
      
      toMark.forEach(msgId => {
        markMessageAsRead(currentConversationId, msgId, currentUserId);
        markedAsReadRef.current.add(msgId);
      });
    }, 1000); // Máximo una vez por segundo
  }, [currentConversationId, currentUserId, currentMessages]);
 
  // Listener en tiempo real para mensajes de conversación actual 
  useEffect(() => { 
    if (!currentConversationId) { 
      setCurrentMessages([]); 
      markedAsReadRef.current.clear();
      return; 
    } 
 
    const unsubscribe = onConversationMessagesChange( 
      currentConversationId, 
      (messages) => { 
        setCurrentMessages(messages); 
         
        // ✅ OPTIMIZADO: Usar throttle en lugar de timeout
        if (throttledMarkAsReadRef.current) {
          throttledMarkAsReadRef.current();
        }
      } 
    ); 

    unsubscribersRef.current.push(unsubscribe);
    return () => {
      unsubscribe();
    };
  }, [currentConversationId, currentUserId]); 
 
  // ✅ CRÍTICO: Calcular total no leído con debounce y REFRESCAR cuando se cierra conversación
  useEffect(() => { 
    if (!currentUserId) { 
      setTotalUnread(0); 
      return; 
    } 

    const updateUnread = async () => {
      try {
        const count = await getTotalUnreadMessages(currentUserId);
        setTotalUnread(count);
      } catch (err) {
        console.error("Error getting total unread:", err);
      }
    };

    // ✅ NUEVO: Usar debounce para evitar queries excesivas
    if (!debouncedUpdateUnreadRef.current) {
      debouncedUpdateUnreadRef.current = createDebounce(updateUnread, 2000);
    }
    debouncedUpdateUnreadRef.current();
  }, [conversations, currentUserId]); 

  // ✅ CRÍTICO (FIX 2): Refrescar contador de no leídos cuando se CIERRA una conversación
  useEffect(() => {
    if (!currentUserId || currentConversationId !== null) return;
    
    // El usuario cerró la conversación, refrescar contadores
    const updateUnread = async () => {
      try {
        const count = await getTotalUnreadMessages(currentUserId);
        setTotalUnread(count);
      } catch (err) {
        console.error("Error refreshing unread after closing conversation:", err);
      }
    };

    // Esperar un poco para que se procesen los cambios en Firestore
    const timeoutId = setTimeout(updateUnread, 500);
    return () => clearTimeout(timeoutId);
  }, [currentConversationId, currentUserId]);
 
  // Iniciar conversación con otro usuario 
  const startConversation = useCallback(async (otherUserId) => { 
    try { 
      const convId = await getOrCreateConversation(currentUserId, otherUserId); 
      setCurrentConversationId(convId); 
      markedAsReadRef.current.clear();
      await markConversationAsRead(convId, currentUserId); 
    } catch (err) { 
      const errorMsg = err.message || "Error al iniciar conversación";
      setError(errorMsg); 
      await logError({
        type: "startConversation_failed",
        message: errorMsg,
        context: { otherUserId, currentUserId }
      });
    } 
  }, [currentUserId]); 
 
  // Enviar mensaje con validación 
  const sendMessage = useCallback( 
    async (text) => { 
      if (!text.trim() || !currentConversationId) {
        setError("El mensaje no puede estar vacío");
        return;
      }
 
      try { 
        await sendMessageService( 
          currentConversationId, 
          currentUserId, 
          currentUserName, 
          currentUserType, 
          text.trim() 
        );
        setError(null);
      } catch (err) { 
        const errorMsg = err.message || "Error al enviar mensaje";
        setError(errorMsg); 
        await logError({
          type: "sendMessage_failed",
          message: errorMsg,
          context: { conversationId: currentConversationId, userId: currentUserId }
        });
      } 
    }, 
    [currentConversationId, currentUserId, currentUserType, currentUserName] 
  ); 
 
  // Obtener nombre del otro participante 
  const getOtherParticipantId = useCallback((conversation) => { 
    return conversation.participants.find(id => id !== currentUserId); 
  }, [currentUserId]);

  // ✅ NUEVO: Cleanup al desmontar
  useEffect(() => {
    return () => {
      unsubscribersRef.current.forEach(unsub => {
        if (typeof unsub === 'function') unsub();
      });
    };
  }, []);
 
  return { 
    conversations, 
    currentConversationId, 
    setCurrentConversationId, 
    currentMessages, 
    loading, 
    error, 
    setError,
    totalUnread, 
    sendMessage, 
    startConversation, 
    getOtherParticipantId, 
  }; 
}; 
