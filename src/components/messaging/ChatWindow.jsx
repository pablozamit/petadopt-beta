import React, { useEffect, useRef } from "react"; 
import MessageBubble from "./MessageBubble"; 
import MessageInput from "./MessageInput"; 
import { formatTimeAgo } from "../../utils/messageHelpers"; 
import { ArrowLeft } from "lucide-react"; 
 
const ChatWindow = ({ 
  otherParticipantId, 
  otherParticipantName, 
  messages, 
  currentUserId, 
  onSendMessage, 
  onBack, 
  loading, 
}) => { 
  const messagesEndRef = useRef(null); 
 
  useEffect(() => { 
    // Scroll al final cuando hay nuevos mensajes 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages]); 
 
  if (loading) { 
    return ( 
      <div className="flex-1 flex items-center justify-center bg-white"> 
        <p className="text-gray-500">Cargando conversación...</p> 
      </div> 
    ); 
  } 
 
  return ( 
    <div className="flex-1 flex flex-col bg-white"> 
      {/* Header */} 
      <div className="border-b p-4 flex items-center gap-3"> 
        <button 
          onClick={onBack} 
          className="md:hidden p-2 hover:bg-gray-100 rounded" 
        > 
          <ArrowLeft size={20} /> 
        </button> 
        <div> 
          <h2 className="font-semibold text-lg">{otherParticipantName}</h2> 
          <p className="text-xs text-gray-500"> 
            {messages.length > 0 
              ? `Última actividad: ${formatTimeAgo(messages[messages.length - 1]?.createdAt)}` 
              : "Sin mensajes"} 
          </p> 
        </div> 
      </div> 
 
      {/* Messages */} 
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50"> 
        {messages.length === 0 ? ( 
          <div className="flex items-center justify-center h-full"> 
            <p className="text-gray-500 text-center"> 
              Inicia una conversación envía un mensaje 
            </p> 
          </div> 
        ) : ( 
          messages.map((message) => ( 
            <MessageBubble 
              key={message.id} 
              message={message} 
              isOwn={message.senderId === currentUserId} 
              otherParticipantId={otherParticipantId} 
            /> 
          )) 
        )} 
        <div ref={messagesEndRef} /> 
      </div> 
 
      {/* Input */} 
      <MessageInput onSendMessage={onSendMessage} /> 
    </div> 
  ); 
}; 
 
export default ChatWindow; 
