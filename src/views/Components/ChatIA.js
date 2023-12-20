import { sendMessageToOpenAI } from 'helpers/ChatHelper';
import React, { useState } from 'react';

const ChatIA = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSendMessage = async () => {
    try {
      const aiResponse = await sendMessageToOpenAI(message);
      setResponse(aiResponse);
    } catch (error) {
      console.error('Error al obtener respuesta:', error);
    }
  };

  return (
    <div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Enviar</button>
      <p>Respuesta de AI: {response}</p>
    </div>
  );
};

export default ChatIA;
