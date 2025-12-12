import React, { useState, useMemo } from "react"; 
import ConversationItem from "./ConversationItem"; 
import { MessageSquare, Inbox } from "lucide-react"; 
 
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
        {loading ? ( 
          // Estado de carga
          <div className="flex items-center justify-center h-full"> 
            <div className="text-center"> 
              <div className="inline-block"> 
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div> 
              </div> 
              <p className="text-gray-500 text-sm">Cargando conversaciones...</p> 
            </div> 
          </div> 
        ) : filteredConversations.length === 0 ? ( 
          // Estado vacío 
          <div className="flex items-center justify-center h-full"> 
            <div className="text-center px-4"> 
              <Inbox size={48} className="mx-auto text-gray-300 mb-3" /> 
              <p className="text-gray-600 font-medium mb-1"> 
                {searchTerm ? "No se encontraron conversaciones" : "Sin conversaciones aún"} 
              </p> 
              {!searchTerm && ( 
                <p className="text-gray-500 text-sm"> 
                  Cuando recibas o envíes mensajes, aparecerán aquí 
                </p> 
              )} 
            </div> 
          </div> 
        ) : ( 
          // Lista de conversaciones 
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
