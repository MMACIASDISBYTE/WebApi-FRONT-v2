// api.js

import axios from 'axios';

const apiKey = process.env.ChatIa;

const openai = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: { 
    'Authorization': `Bearer ${apiKey}`, // Reemplaza YOUR_API_KEY con tu clave API real
  }
});

export const sendMessageToOpenAI = async (message) => {
  try {
    const response = await openai.post('/engines/davinci-codex/completions', {
      prompt: message,
      max_tokens: 150,
    });
    return response.data.choices[0].text;
  } catch (error) {
    console.error('Error al enviar mensaje a OpenAI:', error);
    throw error;
  }
};
