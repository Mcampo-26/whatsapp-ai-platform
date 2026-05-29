// frontend/src/components/chat/ChatList.jsx
import React from 'react';
import { useChatStore } from '../../store/useChatStore.js';

export const ChatList = () => {
  const chats = useChatStore((state) => state.chats);
  const activeChat = useChatStore((state) => state.activeChat);
  const setActiveChat = useChatStore((state) => state.setActiveChat);

  // Helper interno para formatear la hora de forma limpia sin librerías pesadas
  const formatTime = (dateString) => {
    if (!dateString) return 'Ahora';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <section className="w-80 h-[calc(100vh-6rem)] rounded-2xl glass-effect border-adapt p-4 flex flex-col gap-3 select-none">
      <h3 className="font-bold text-sm text-slate-400 dark:text-slate-400/70 uppercase tracking-wider px-1">
        Conversaciones ({chats.length})
      </h3>
      
      <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
        {chats.map((chat) => {
          const isSelected = activeChat?._id === chat._id;
          const hasUnread = chat.unreadCount > 0;
          const lastMessage = chat.messages && chat.messages.length > 0 
            ? chat.messages[chat.messages.length - 1] 
            : null;

          return (
            <button
              key={chat._id}
              onClick={() => setActiveChat(chat)}
              className={`w-full p-3 rounded-xl border border-adapt text-left transition-all duration-200 relative flex flex-col gap-1
                ${isSelected 
                  ? 'bg-blue-500/10 border-dron-blue/30 text-dron-blue dark:text-dron-blue-light shadow-sm' 
                  : 'bg-white/40 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300'
                }`}
            >
              {/* Línea Superior: Nombre e Historial de Tiempo */}
              <div className="flex justify-between items-center w-full">
                <span className={`text-slate-800 dark:text-white truncate pr-2 ${hasUnread ? 'font-extrabold' : 'font-bold'}`}>
                  {chat.customerName}
                </span>
                <span className={`text-[10px] whitespace-nowrap ${hasUnread ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                  {lastMessage ? formatTime(chat.updatedAt || lastMessage.timestamp) : 'Ahora'}
                </span>
              </div>

              {/* Línea Inferior: Extracto de Mensaje y Globo Verde */}
              <div className="flex justify-between items-center w-full gap-2">
                <p className={`text-xs truncate flex-1 ${hasUnread ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                  {lastMessage ? lastMessage.text : 'Sin mensajes'}
                </p>

                {/* 🔔 GLOBO FLOTANTE DE NOTIFICACIÓN REAL (Solo si tiene unreadCount > 0 y no está seleccionado) */}
                {hasUnread && !isSelected && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center shadow-sm animate-fade-in">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};