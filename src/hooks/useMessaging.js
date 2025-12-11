import { useState, useEffect, useCallback } from "react"; 
import { 
  onUserConversationsChange, 
  onConversationMessagesChange, 
  sendMessage as sendMessageService, 
  markMessageAsRead, 
  markConversationAsRead, 
  getOrCreateConversation, 
  getTotalUnreadMessages, 
} from "../services/messagingService"; 
 
export const useMessaging = (currentUserId, currentUserType, currentUserName) => { 
  const [conversations, setConversations] = useState([]); 
  const [currentConversationId, setCurrentConversationId] = useState(null); 
  const [currentMessages, setCurrentMessages] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [totalUnread, setTotalUnread] = useState(0); 
 
  // Listener en tiempo real para conversaciones 
  useEffect(() => { 
    if (!currentUserId) return; 
     
    setLoading(true); 
    const unsubscribe = onUserConversationsChange(currentUserId, (convs) => { 
      setConversations(convs); 
      setLoading(false); 
    }); 
 
    return unsubscribe; 
  }, [currentUserId]); 
 
  // Listener en tiempo real para mensajes de conversación actual 
  useEffect(() => { 
    if (!currentConversationId) { 
      setCurrentMessages([]); 
      return; 
    } 
 
    const unsubscribe = onConversationMessagesChange( 
      currentConversationId, 
      (messages) => { 
        setCurrentMessages(messages); 
         
        // Auto-marcar como leído después de 500ms 
        const timer = setTimeout(() => { 
          messages.forEach(msg => { 
            if (msg.senderId !== currentUserId && !msg.readBy?.[currentUserId]) { 
              markMessageAsRead(currentConversationId, msg.id, currentUserId); 
            } 
          }); 
        }, 500); 
 
        return () => clearTimeout(timer); 
      } 
    ); 
 
    return unsubscribe; 
  }, [currentConversationId, currentUserId]); 
 
  // Calcular total no leído 
  useEffect(() => { 
    if (!currentUserId || !conversations.length) { 
      setTotalUnread(0); 
      return; 
    } 
 
    getTotalUnreadMessages(currentUserId).then(setTotalUnread); 
  }, [conversations, currentUserId]); 
 
  // Iniciar conversación con otro usuario 
  const startConversation = useCallback(async (otherUserId) => { 
    try { 
      const convId = await getOrCreateConversation(currentUserId, otherUserId); 
      setCurrentConversationId(convId); 
      // Marcar conversación como leída 
      await markConversationAsRead(convId, currentUserId); 
    } catch (err) { 
      setError(err.message); 
      console.error("Error al iniciar conversación:", err); 
    } 
  }, [currentUserId]); 
 
  // Enviar mensaje 
  const sendMessage = useCallback( 
    async (text) => { 
      if (!text.trim() || !currentConversationId) return; 
 
      try { 
        await sendMessageService( 
          currentConversationId, 
          currentUserId, 
          currentUserName, 
          currentUserType, 
          text.trim() 
        ); 
      } catch (err) { 
        setError(err.message); 
        console.error("Error al enviar mensaje:", err); 
      } 
    }, 
    [currentConversationId, currentUserId, currentUserType, currentUserName] 
  ); 
 
  // Obtener nombre del otro participante 
  const getOtherParticipantId = useCallback((conversation) => { 
    return conversation.participants.find(id => id !== currentUserId); 
  }, [currentUserId]); 
 
  return { 
    conversations, 
    currentConversationId, 
    setCurrentConversationId, 
    currentMessages, 
    loading, 
    error, 
    totalUnread, 
    sendMessage, 
    startConversation, 
    getOtherParticipantId, 
  }; 
}; 
