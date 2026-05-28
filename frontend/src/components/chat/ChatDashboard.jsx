// frontend/src/components/chat/ChatDashboard.jsx
import React, { useEffect } from 'react';
import { ChatList } from './ChatList.jsx';
import { ChatWindow } from './ChatWindow.jsx';
import { useChatStore } from '../../store/useChatStore.js';
import { io } from 'socket.io-client'; // 🚀 Agregado: Cliente de Socket.io para escuchar el canal
import { API_URL } from '../../config/config.js'; // 🚀 Agregado: Para saber a qué dirección conectarse

export const ChatDashboard = () => {
  // 🚀 SOLUCIÓN: Usamos selectores explícitos para asegurarnos de que Zustand devuelva la función correctamente
  const fetchChats = useChatStore((state) => state.fetchChats);
  const addMessageToChat = useChatStore((state) => state.addMessageToChat); // 🚀 Agregado: Acción para inyectar mensajes en caliente
  const loading = useChatStore((state) => state.loading);
  const error = useChatStore((state) => state.error);
  
  // ID real del Tenant correspondiente a "Tienda de Prueba Maury"
  const currentTenantId = "6a16e86bbdc9dd4ad1824c67";

  useEffect(() => {
    // Verificamos que exista la función antes de patear la petición
    if (typeof fetchChats === 'function') {
      fetchChats(currentTenantId);
    } else {
      console.error("Zustand: fetchChats no está definida en el store.");
    }
  }, [fetchChats]);

  // 🚀 NUEVO: useEffect dedicado a mantener viva la escucha del socket en tiempo real
  useEffect(() => {
    // Abrimos la conexión con el servidor backend usando tu API_URL (http://localhost:5000)
    const socket = io(API_URL);

    // Escuchamos el evento global 'newMessage' que emite el backend
    socket.on('newMessage', (data) => {
      console.log('📡 Mensaje recibido por socket en tiempo real:', data);
      
      const { tenantId, customerPhone, message } = data;
      
      // Si existe la función en Zustand, empujamos el mensaje directo a la UI
      if (typeof addMessageToChat === 'function') {
        addMessageToChat(tenantId, customerPhone, message);
      }
    });

    // Limpieza: Desconectamos el socket al desmontar el componente para evitar duplicación de listeners
    return () => {
      socket.disconnect();
    };
  }, [addMessageToChat]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-dron-blue dark:text-dron-blue-light font-medium text-sm">
        <span className="w-2 h-2 rounded-full bg-current animate-ping mr-2"></span>
        Cargando bandeja de entrada desde Atlas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-rose-500 font-medium text-sm">
        ⚠️ {error} (Revisá que el backend esté corriendo en el puerto 5000)
      </div>
    );
  }

  return (
    <>
      <ChatList />
      <ChatWindow />
    </>
  );
};