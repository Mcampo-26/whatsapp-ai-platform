// frontend/src/store/useChatStore.js
import { create } from 'zustand';
import { chatService } from '../services/chatService.js'; 

export const useChatStore = create((set, get) => ({
  chats: [],
  activeChat: null,
  loading: false,
  error: null,

  setChats: (chats) => set({ chats }),

  // 🔔 MODIFICADO: Al seleccionar un chat activo, limpiamos sus mensajes no leídos al toque
  setActiveChat: (chat) => set((state) => {
    const updatedChats = state.chats.map((c) => 
      c._id === chat._id ? { ...c, unreadCount: 0 } : c
    );
    return { 
      activeChat: { ...chat, unreadCount: 0 },
      chats: updatedChats
    };
  }),

  fetchChats: async (tenantId) => {
    set({ loading: true, error: null });
    try {
      const data = await chatService.getChatsByTenant(tenantId);
      // Mapeamos los chats iniciales asegurando que tengan unreadCount y su status por defecto si no vienen
      const formattedChats = data.map(chat => ({
        ...chat,
        unreadCount: chat.unreadCount || 0,
        status: chat.status || 'bot_active'
      }));
      set({ chats: formattedChats, loading: false });
    } catch (err) {
      set({ error: 'No se pudieron cargar los chats desde el servidor', loading: false });
    }
  },

  // 🚀 NUEVA ACCIÓN: Conmutar el estado de la IA en caliente entre el panel y la BD
  toggleBotStatus: async (chatId, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'bot_active' ? 'agent_active' : 'bot_active';
      
      // Golpeamos el nuevo endpoint PATCH que acabamos de corregir en las rutas
      const updatedChat = await chatService.toggleBot(chatId, nextStatus);

      set((state) => {
        // 1. Actualizamos el estado del chat dentro de la lista global
        const updatedChats = state.chats.map((c) =>
          c._id === chatId ? { ...c, status: updatedChat.status } : c
        );

        // 2. Si es el chat que el operador está mirando en pantalla, actualizamos su cabecera
        const updatedActive = state.activeChat && state.activeChat._id === chatId
          ? { ...state.activeChat, status: updatedChat.status }
          : state.activeChat;

        return {
          chats: updatedChats,
          activeChat: updatedActive
        };
      });
    } catch (err) {
      console.error('❌ Error al cambiar el estado del bot en Zustand:', err);
    }
  },

  // 🚀 Enviar mensaje manual del operador al backend
  sendMessage: async (chatId, text) => {
    try {
      const updatedChat = await chatService.sendMessageByAgent(chatId, text);
      const newAgentMessage = updatedChat.messages[updatedChat.messages.length - 1];

      set((state) => {
        let targetChat = null;
        
        // 1. Filtramos y extraemos el chat modificado de la lista actual
        const remainingChats = state.chats.filter((chat) => {
          if (chat._id === chatId) {
            targetChat = {
              ...chat,
              messages: [...chat.messages, newAgentMessage],
              updatedAt: new Date()
            };
            return false; // Lo sacamos temporalmente de su posición vieja
          }
          return true;
        });

        // 2. Si lo encontramos, lo mandamos derecho arriba de todo (índice 0)
        const updatedChats = targetChat ? [targetChat, ...remainingChats] : state.chats;

        const updatedActive = state.activeChat && state.activeChat._id === chatId
          ? { ...state.activeChat, messages: [...state.activeChat.messages, newAgentMessage] }
          : state.activeChat;

        return {
          chats: updatedChats,
          activeChat: updatedActive
        };
      });

    } catch (err) {
      console.error('❌ Error al enviar mensaje desde el Store:', err);
      set({ error: 'No se pudo enviar el mensaje. Intentá de nuevo.' });
    }
  },

  // 📡 Escucha de WebSockets en caliente
  addMessageToChat: (tenantId, customerPhone, message) => {
    set((state) => {
      let targetChat = null;
      const currentActive = state.activeChat;

      // Determinamos si el mensaje entrante pertenece al chat que está mirando el operador
      const isCurrentlyReading = currentActive && 
        currentActive.tenantId === tenantId && 
        currentActive.customerPhone === customerPhone;

      // 1. Filtramos la lista para mover el chat que recibe el mensaje al tope
      const remainingChats = state.chats.filter((chat) => {
        if (chat.tenantId === tenantId && chat.customerPhone === customerPhone) {
          targetChat = {
            ...chat,
            messages: [...chat.messages, message],
            updatedAt: new Date(),
            // 🔔 Si lo está leyendo, queda en 0. Si está en otro chat, suma +1
            unreadCount: isCurrentlyReading ? 0 : (chat.unreadCount || 0) + 1
          };
          return false; // Lo removemos de su ubicación previa
        }
        return true;
      });

      // 2. Lo inyectamos en la primera posición de la bandeja de entrada
      const updatedChats = targetChat ? [targetChat, ...remainingChats] : state.chats;

      // 3. Actualizamos la ventana de conversación si corresponde
      const updatedActive = isCurrentlyReading
        ? { ...currentActive, messages: [...currentActive.messages, message], unreadCount: 0 }
        : currentActive;

      return {
        chats: updatedChats,
        activeChat: updatedActive,
      };
    });
  },
}));