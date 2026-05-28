// frontend/src/store/useChatStore.js
import { create } from 'zustand';
// 🚀 SOLUCIÓN: Agregamos las llaves en la importación nombrada
import { chatService } from '../services/chatService.js'; 

export const useChatStore = create((set) => ({
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