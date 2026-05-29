// frontend/src/store/useChatStore.js
import { create } from 'zustand';
import { chatService } from '../services/chatService.js'; 

export const useChatStore = create((set, get) => ({
  chats: [],
  activeChat: null,
  loading: false,
  error: null,

  setChats: (chats) => set({ chats }),
  setActiveChat: (chat) => set({ activeChat: chat }),

  fetchChats: async (tenantId) => {
    set({ loading: true, error: null });
    try {
      const data = await chatService.getChatsByTenant(tenantId);
      set({ chats: data, loading: false });
    } catch (err) {
      set({ error: 'No se pudieron cargar los chats desde el servidor', loading: false });
    }
  },

  // 🚀 NUEVA ACCIÓN: Enviar mensaje manual del operador al backend
  sendMessage: async (chatId, text) => {
    try {
      // 1. Golpeamos el endpoint que creamos recién en el back
      const updatedChat = await chatService.sendMessageByAgent(chatId, text);
      
      // 2. Extraemos el último mensaje (el que acaba de crear el agente)
      const newAgentMessage = updatedChat.messages[updatedChat.messages.length - 1];

      // 3. Reutilizamos tu lógica exacta para actualizar el estado local al instante
      set((state) => {
        const updatedChats = state.chats.map((chat) => 
          chat._id === chatId 
            ? { ...chat, messages: [...chat.messages, newAgentMessage], updatedAt: new Date() }
            : chat
        );

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

  addMessageToChat: (tenantId, customerPhone, message) => {
    set((state) => {
      const updatedChats = state.chats.map((chat) => {
        if (chat.tenantId === tenantId && chat.customerPhone === customerPhone) {
          return {
            ...chat,
            messages: [...chat.messages, message],
            updatedAt: new Date(),
          };
        }
        return chat;
      });

      const currentActive = state.activeChat;
      const updatedActive =
        currentActive &&
        currentActive.tenantId === tenantId &&
        currentActive.customerPhone === customerPhone
          ? { ...currentActive, messages: [...currentActive.messages, message] }
          : currentActive;

      return {
        chats: updatedChats,
        activeChat: updatedActive,
      };
    });
  },
}));