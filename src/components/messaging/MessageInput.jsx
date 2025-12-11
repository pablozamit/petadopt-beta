import React, { useState } from "react"; 
import { Send } from "lucide-react"; 
import { validateMessage } from "../../utils/messageHelpers"; 
 
const MessageInput = ({ onSendMessage, disabled = false }) => { 
  const [text, setText] = useState(""); 
  const [error, setError] = useState(""); 
 
  const handleSend = () => { 
    const validation = validateMessage(text); 
     
    if (!validation.valid) { 
      setError(validation.error); 
      return; 
    } 
 
    setError(""); 
    onSendMessage(text); 
    setText(""); 
  }; 
 
  const handleKeyPress = (e) => { 
    if (e.key === "Enter" && !e.shiftKey) { 
      e.preventDefault(); 
      handleSend(); 
    } 
  }; 
 
  return ( 
    <div className="border-t bg-white p-4"> 
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>} 
      <div className="flex gap-2"> 
        <textarea 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          onKeyPress={handleKeyPress} 
          placeholder="Escribe un mensaje..." 
          rows="1" 
          disabled={disabled} 
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" 
        /> 
        <button 
          onClick={handleSend} 
          disabled={disabled || !text.trim()} 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" 
        > 
          <Send size={18} /> 
        </button> 
      </div> 
    </div> 
  ); 
}; 
 
export default MessageInput; 
