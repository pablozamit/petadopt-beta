import React from "react"; 
import { formatTimeAgo, formatMessageTime } from "../../utils/messageHelpers"; 
import { User } from "lucide-react"; 
 
const ConversationItem = ({ 
  conversation, 
  otherParticipantName, 
  isActive, 
  unreadCount, 
  onClick, 
}) => { 
  return ( 
    <div 
      onClick={onClick} 
      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${ 
        isActive ? "bg-blue-50 border-l-4 border-l-blue-500" : "" 
      }`} 
    > 
      <div className="flex items-center gap-3"> 
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0"> 
          <User size={20} className="text-gray-600" /> 
        </div> 
         
        <div className="flex-1 min-w-0"> 
          <div className="flex items-center justify-between"> 
            <h3 className={`font-semibold text-sm ${ 
              unreadCount > 0 ? "text-gray-900" : "text-gray-700" 
            }`}> 
              {otherParticipantName} 
            </h3> 
            <span className="text-xs text-gray-500"> 
              {formatMessageTime(conversation.lastMessageTime)} 
            </span> 
          </div> 
           
          <p className={`text-sm truncate ${ 
            unreadCount > 0 
              ? "text-gray-800 font-medium" 
              : "text-gray-600" 
          }`}> 
            {conversation.lastMessage || "Sin mensajes"} 
          </p> 
        </div> 
 
        {unreadCount > 0 && ( 
          <div className="bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"> 
            {unreadCount} 
          </div> 
        )} 
      </div> 
    </div> 
  ); 
}; 
 
export default ConversationItem; 
