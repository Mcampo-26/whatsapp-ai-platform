// frontend/src/components/ChatList.jsx
import React from 'react';
import { useChatStore } from '../../store/useChatStore.js';

export const ChatList = () => {
  const { chats, activeChat, setActiveChat } = useChatStore();

  return (
    <section className="w-80 h-[calc(100vh-6rem)] rounded-2xl glass-effect border-adapt p-4 flex flex-col gap-3">
      <h3 className="font-bold text-sm text-slate-400 dark:text-slate-400/70 uppercase tracking-wider px-1">
        Conversaciones ({chats.length})
      </h3>
      
      <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
        {chats.map((chat) => {
          const isSelected = activeChat?.id === chat.id;
          return (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`w-full p-3 rounded-xl border border-adapt text-left transition-all duration-200
                ${isSelected 
                  ? 'bg-blue-500/10 border-dron-blue/30 text-dron-blue dark:text-dron-blue-light' 
                  : 'bg-white/40 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300'
                }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-800 dark:text-white truncate">{chat.customerName}</span>
                <span className="text-[10px] text-slate-400">Ahora</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {chat.messages[chat.messages.length - 1]?.text}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
};