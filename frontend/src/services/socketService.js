// frontend/src/services/socketService.js
import { io } from 'socket.io-client';
import { API_URL } from '../config/config';

let socket = null;

export const socketService = {
  // Inicializa la conexión de forma segura si no existe
  connect: () => {
    if (socket) return socket;

    console.log('📡 Intentando conectar al servidor de WebSockets...');
    
    // Conectamos usando la URL base de tu API
    socket = io(API_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      transports: ['websocket', 'polling'] // Forzamos transportes estables para evitar caídas
    });

    socket.on('connect', () => {
      console.log(`✅ Conectado al Socket del Servidor con ID: ${socket.id}`);
    });

    socket.on('disconnect', (reason) => {
      console.warn(`❌ Socket desconectado. Motivo: ${reason}`);
    });

    socket.on('connect_error', (error) => {
      console.error('⚠️ Error de conexión en el Socket:', error);
    });

    return socket;
  },

  // Método limpio para unirse a la sala de una tienda (Tenant)
  joinTenantRoom: (tenantId) => {
    if (!socket) socketService.connect();
    console.log(`🏢 Solicitando unión a la sala del Tenant: ${tenantId}`);
    socket.emit('joinTenant', tenantId);
  },

  // Escuchar un evento específico (ej: 'newMessage')
  on: (eventName, callback) => {
    if (!socket) socketService.connect();
    socket.on(eventName, callback);
  },

  // Dejar de escuchar un evento para evitar duplicados en memoria
  off: (eventName, callback) => {
    if (socket) {
      socket.off(eventName, callback);
    }
  },

  // Retornar la instancia cruda por si la necesitás para otra cosa
  getSocket: () => socket
};