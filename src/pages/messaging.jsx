import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { useMessaging } from "../hooks/useMessaging";
import MessagingLayout from "../components/messaging/MessagingLayout";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const MessagingPage = () => {
  const { user, userData } = useAuth();
  const { 
    conversations, 
    currentConversationId, 
    setCurrentConversationId, 
    currentMessages, 
    loading, 
    error, 
    sendMessage, 
    getOtherParticipantId, 
  } = useMessaging(user?.uid, userData?.role, userData?.displayName);

  const [userProfiles, setUserProfiles] = useState({});

  const fetchUserProfile = useCallback(async (userId) => {
    if (!userId || userProfiles[userId]) {
      return;
    }
    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setUserProfiles(prev => ({ ...prev, [userId]: userDocSnap.data() }));
      } else {
        setUserProfiles(prev => ({ ...prev, [userId]: { displayName: "Usuario Desconocido" } }));
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setUserProfiles(prev => ({ ...prev, [userId]: { displayName: "Error" } }));
    }
  }, [userProfiles]);

  useEffect(() => {
    const participantIds = new Set();
    conversations.forEach(conv => {
      conv.participants.forEach(id => {
        if (id !== user?.uid) {
          participantIds.add(id);
        }
      });
    });
    participantIds.forEach(id => {
      fetchUserProfile(id);
    });
  }, [conversations, user?.uid, fetchUserProfile]);
 
  const getOtherParticipantInfo = useCallback((conversation) => {
    if (!conversation) return { name: "Usuario", type: "unknown" };
    
    const otherUserId = getOtherParticipantId(conversation);
    const profile = userProfiles[otherUserId];

    if (profile) {
      return {
        id: otherUserId,
        name: profile.displayName || `Usuario ${otherUserId?.slice(0, 8)}`,
        type: profile.role || "user",
      };
    }
    
    return { 
      id: otherUserId, 
      name: "Cargando...", 
      type: "user" 
    };
  }, [getOtherParticipantId, userProfiles]);
 
  // Calcular no leídos por conversación (implementado según especificación)
  const getUnreadCount = useMemo(() => {
    return (conversation) => {
      if (!user?.uid) return 0;
      
      let count = 0;
      // Esta lógica cuenta los no leídos solo para la conversación activa.
      if (conversation.id === currentConversationId) {
        currentMessages.forEach((msg) => {
          if (msg.senderId !== user.uid && !msg.readBy?.[user.uid]) {
            count++;
          }
        });
      }
      return count;
    };
  }, [currentMessages, user?.uid, currentConversationId]);
 
  if (!user) { 
    return ( 
      <div className="flex items-center justify-center h-screen bg-gray-50"> 
        <p className="text-gray-600">Por favor inicia sesión para acceder a mensajes</p> 
      </div> 
    ); 
  } 
 
  if (error) { 
    return ( 
      <div className="flex items-center justify-center h-screen bg-gray-50"> 
        <p className="text-red-600">Error: {error}</p> 
      </div> 
    ); 
  } 
 
  return ( 
    <MessagingLayout 
      conversations={conversations} 
      currentConversationId={currentConversationId} 
      currentMessages={currentMessages} 
      currentUserId={user.uid} 
      loading={loading} 
      onSelectConversation={setCurrentConversationId} 
      onSendMessage={sendMessage} 
      getUnreadCount={getUnreadCount} 
      getOtherParticipantInfo={getOtherParticipantInfo} 
      getOtherParticipantId={getOtherParticipantId} 
    /> 
  ); 
}; 
 
export default MessagingPage;
