import React from "react"; 
import { formatMessageTime } from "../../utils/messageHelpers"; 
import { Check, CheckCheck } from "lucide-react"; 
 
const MessageBubble = ({ message, isOwn, otherParticipantId }) => { 
  const { isRead } = { 
    isRead: message.readBy?.[otherParticipantId], 
  }; 
 
  return ( 
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}> 
      <div 
        className={`max-w-xs px-4 py-2 rounded-lg ${ 
          isOwn 
            ? "bg-blue-500 text-white rounded-br-none" 
            : "bg-gray-200 text-gray-900 rounded-bl-none" 
        }`} 
      > 
        {!isOwn && ( 
          <p className="text-xs font-semibold mb-1 opacity-70"> 
            {message.senderName} 
          </p> 
        )} 
        <p className="break-words">{message.text}</p> 
        <div className="flex items-center justify-end gap-1 mt-1"> 
          <span className="text-xs opacity-70"> 
            {formatMessageTime(message.createdAt)} 
          </span> 
          {isOwn && ( 
            <span className="text-xs"> 
              {isRead ? ( 
                <CheckCheck size={14} /> 
              ) : ( 
                <Check size={14} /> 
              )} 
            </span> 
          )} 
        </div> 
      </div> 
    </div> 
  ); 
}; 
 
export default MessageBubble; 
