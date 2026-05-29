// frontend/src/components/chat/ChatDashboard.jsx
import React, { useEffect } from 'react';
import { ChatList } from './ChatList.jsx';
import { ChatWindow } from './ChatWindow.jsx';
import { useChatStore } from '../../store/useChatStore.js';
import { socketService } from '../../services/socketService.js'; // 🚀 Reemplazamos io crudo por nuestro helper centralizado

export const ChatDashboard = () => {
  const fetchChats = useChatStore((state) => state.fetchChats);
  const addMessageToChat = useChatStore((state) => state.addMessageToChat);
  const loading = useChatStore((state) => state.loading);
  const error = useChatStore((state) => state.error);
  
  // ID real del Tenant correspondiente a "Tienda de Prueba Maury"
  const currentTenantId = "6a16e86bbdc9dd4ad1824c67";

  // 1. Carga inicial de los chats desde MongoDB Atlas
  useEffect(() => {
    if (typeof fetchChats === 'function') {
      fetchChats(currentTenantId);
    } else {
      console.error("Zustand: fetchChats no está definida en el store.");
    }
  }, [fetchChats]);

  // 2. 📡 NUEVO: Conexión limpia y estable al Socket sin reconexiones infinitas
  useEffect(() => {
    // Inicializamos la conexión única del socket mediante el helper
    socketService.connect();

    // Metemos al operador en la sala exclusiva de este tenant para escuchar sus mensajes
    socketService.joinTenantRoom(currentTenantId);

    // Handler de recepción de mensajes en tiempo real
    const handleIncomingMessage = (data) => {
      console.log('📡 Mensaje recibido por socket en tiempo real:', data);
      
      // Desestructuramos los campos que emite tu backend
      const { tenantId, customerPhone, message } = data;
      
      // Si existe la función en Zustand y tenemos la data, inyectamos en caliente a la UI
      if (typeof addMessageToChat === 'function' && message) {
        addMessageToChat(tenantId || currentTenantId, customerPhone, message);
      }
    };

    // Escuchamos el evento global
    socketService.on('newMessage', handleIncomingMessage);

    // 🧼 Limpieza: Apagamos el listener al desmontar el módulo, PERO no destruimos la conexión
    return () => {
      socketService.off('newMessage', handleIncomingMessage);
    };
  }, [addMessageToChat]); // Ahora que usa socketService, el listener queda blindado contra renders accidentales

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