import { create } from 'zustand';

export const useChatStore = create((set) => ({
  chats: [],
  activeChat: null,
  loading: false,
  error: null,

  // Setear la lista completa de chats (cuando los traigamos de la API del backend)
  setChats: (chats) => set({ chats }),

  // Seleccionar un chat para abrirlo en la pantalla central
  setActiveChat: (chat) => set({ activeChat: chat }),

  // Agregar un mensaje nuevo en tiempo real (cuando llegue por el webhook)
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