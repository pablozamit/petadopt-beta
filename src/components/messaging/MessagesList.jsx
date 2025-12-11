import React, { useState, useMemo } from "react"; 
import ConversationItem from "./ConversationItem"; 
import { MessageSquare } from "lucide-react"; 
 
const MessagesList = ({ 
  conversations, 
  currentConversationId, 
  onSelectConversation, 
  loading, 
  getUnreadCount, 
  getOtherParticipantInfo, // Función que devuelve {name, type} 
}) => { 
  const [searchTerm, setSearchTerm] = useState(""); 
 
  const filteredConversations = useMemo(() => { 
    if (!searchTerm) return conversations; 
     
    return conversations.filter((conv) => { 
      const otherInfo = getOtherParticipantInfo(conv); 
      return otherInfo.name.toLowerCase().includes(searchTerm.toLowerCase()); 
    }); 
  }, [conversations, searchTerm, getOtherParticipantInfo]); 
 
  if (loading) { 
    return ( 
      <div className="w-full md:w-80 border-r bg-white flex items-center justify-center"> 
        <p className="text-gray-500">Cargando conversaciones...</p> 
      </div> 
    ); 
  } 
 
  return ( 
    <div className="w-full md:w-80 border-r bg-white flex flex-col h-full"> 
      {/* Header */} 
      <div className="p-4 border-b"> 
        <h2 className="text-xl font-bold flex items-center gap-2 mb-3"> 
          <MessageSquare size={24} /> 
          Mensajes 
        </h2> 
        <input 
          type="text" 
          placeholder="Buscar conversaciones..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
        /> 
      </div> 
 
      {/* Conversations List */} 
      <div className="flex-1 overflow-y-auto"> 
        {filteredConversations.length === 0 ? ( 
          <div className="flex items-center justify-center h-full"> 
            <p className="text-gray-500 text-center px-4"> 
              {searchTerm 
                ? "No se encontraron conversaciones" 
                : "Sin conversaciones aún"} 
            </p> 
          </div> 
        ) : ( 
          filteredConversations.map((conversation) => { 
            const otherInfo = getOtherParticipantInfo(conversation); 
            const unreadCount = getUnreadCount(conversation); 
             
            return ( 
              <ConversationItem 
                key={conversation.id} 
                conversation={conversation} 
                otherParticipantName={otherInfo.name} 
                isActive={currentConversationId === conversation.id} 
                unreadCount={unreadCount} 
                onClick={() => onSelectConversation(conversation.id)} 
              /> 
            ); 
          }) 
        )} 
      </div> 
    </div> 
  ); 
}; 
 
export default MessagesList; 
