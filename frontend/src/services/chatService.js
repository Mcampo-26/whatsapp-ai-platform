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
      // Reemplazar por tu ruta real del backend (ej: /api/chats/${tenantId})
      const response = await api.get(`/api/chats/tenant/${tenantId}`);
      return response.data;
    } catch (error) {
      console.error('Error en getChatsByTenant:', error);
      throw error;
    }
  },

  // Enviar una respuesta manual desde el panel hacia el backend
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