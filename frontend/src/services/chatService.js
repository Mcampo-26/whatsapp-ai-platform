// frontend/src/services/chatService.js
import axios from 'axios';
import { API_URL } from '../config/config';

// Creamos una instancia de axios centralizada
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatService = {
  // Obtener todos los chats del inquilino (Tenant) desde MongoDB
  getChatsByTenant: async (tenantId) => {
    try {
      const response = await api.get(`/api/chats/tenant/${tenantId}`);
      return response.data;
    } catch (error) {
      console.error('Error en getChatsByTenant:', error);
      throw error;
    }
  },

  // Enviar una respuesta manual usando el ID único del chat
  sendMessageByAgent: async (chatId, text) => {
    try {
      const response = await api.post(`/api/chats/${chatId}/message`, { text });
      return response.data; // Devuelve el objeto del chat actualizado
    } catch (error) {
      console.error('Error en sendMessageByAgent:', error);
      throw error;
    }
  },

  // 🚀 NUEVO ENDPOINT: Conmutar el estado de la IA (Activo/Manual) en Atlas
  toggleBot: async (chatId, status) => {
    try {
      const response = await api.patch(`/api/chats/${chatId}/toggle-bot`, { status });
      return response.data; // Devuelve el objeto del chat con el status modificado
    } catch (error) {
      console.error('❌ Error en toggleBot (Service):', error);
      throw error;
    }
  },

  // Enviar una respuesta manual desde el panel (Mantenido por compatibilidad si se requiere)
  sendMessage: async (tenantId, customerPhone, text) => {
    try {
      const response = await api.post('/api/chats/send', {
        tenantId,
        customerPhone,
        text,
      });
      return response.data;
    } catch (error) {
      console.error('Error en sendMessage:', error);
      throw error;
    }
  }
};