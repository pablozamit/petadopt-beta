import React from "react"; 
import MessagesList from "./MessagesList"; 
import ChatWindow from "./ChatWindow"; 
 
const MessagingLayout = ({ 
  conversations, 
  currentConversationId, 
  currentMessages, 
  currentUserId, 
  loading, 
  onSelectConversation, 
  onSendMessage, 
  getUnreadCount, 
  getOtherParticipantInfo, 
  getOtherParticipantId, 
}) => { 
  const currentConversation = conversations.find( 
    (c) => c.id === currentConversationId 
  ); 
  const otherParticipantId = currentConversation ? getOtherParticipantId(currentConversation) : null; 
  const otherInfo = currentConversation 
    ? getOtherParticipantInfo(currentConversation) 
    : null; 
 
  return ( 
    <div className="flex h-screen bg-white"> 
      {/* Lista de conversaciones - siempre visible en desktop, oculto si hay chat abierto en mobile */} 
      <div 
        className={`${ 
          currentConversationId ? "hidden md:flex" : "flex" 
        } md:flex flex-col w-full md:w-80`} 
      > 
        <MessagesList 
          conversations={conversations} 
          currentConversationId={currentConversationId} 
          onSelectConversation={onSelectConversation} 
          loading={loading} 
          getUnreadCount={getUnreadCount} 
          getOtherParticipantInfo={getOtherParticipantInfo} 
        /> 
      </div> 
 
      {/* Chat Window - visible cuando se selecciona conversación */} 
      {currentConversationId && otherInfo ? ( 
        <ChatWindow 
          otherParticipantId={otherParticipantId} 
          otherParticipantName={otherInfo.name} 
          messages={currentMessages} 
          currentUserId={currentUserId} 
          onSendMessage={onSendMessage} 
          onBack={() => { 
            // Cerrar chat en mobile 
            // setCurrentConversationId(null); 
          }} 
          loading={loading} 
        /> 
      ) : ( 
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50"> 
          <p className="text-gray-500 text-center"> 
            Selecciona una conversación para continuar 
          </p> 
        </div> 
      )} 
    </div> 
  ); 
}; 
 
export default MessagingLayout; 
