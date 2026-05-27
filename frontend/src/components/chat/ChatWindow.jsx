// frontend/src/components/ChatWindow.jsx
import React from 'react';
import { useChatStore } from '../../store/useChatStore.js';

export const ChatWindow = () => {
  const { activeChat } = useChatStore();

  if (!activeChat) {
    return (
      <section className="flex-1 h-[calc(100vh-6rem)] rounded-2xl glass-effect border-adapt p-6 flex flex-col items-center justify-center text-center gap-3 text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-300 dark:text-slate-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.33.018.662.037.994.058a.75.75 0 01.678.747v10.3c0 .416-.34.743-.755.743a9.835 9.835 0 01-6.191-2.15l-3.328-2.66a.75.75 0 00-.469-.165H5.03A2.25 2.25 0 012.775 13.5V6A2.25 2.25 0 015.03 3.75h10.94a2.25 2.25 0 012.25 2.25v2.511z" />
        </svg>
        <p className="text-sm font-medium">Seleccioná una conversación de la lista para ver el chat</p>
      </section>
    );
  }

  return (
    <section className="flex-1 h-[calc(100vh-6rem)] rounded-2xl glass-effect border-adapt p-6 flex flex-col justify-between">
      <div className="flex flex-col h-full justify-between">
        {/* Cabecera */}
        <div className="pb-4 border-b border-adapt flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-dron-blue text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {activeChat.customerName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-white">{activeChat.customerName}</h4>
            <span className="text-xs text-emerald-500 font-medium">Cliente</span>
          </div>
        </div>

        {/* Mensajes */}
        <div className="flex-1 my-4 overflow-y-auto flex flex-col gap-3 pr-2">
          {activeChat.messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm transition-all duration-300
                ${msg.sender === 'customer' 
                  ? 'bg-white/80 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 self-start rounded-tl-none border border-adapt' 
                  : 'bg-dron-blue text-white self-end rounded-tr-none'
                }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Escribí una respuesta..." 
            className="flex-1 px-4 py-3 rounded-xl border border-adapt bg-white/50 dark:bg-slate-800/20 text-sm focus:outline-none focus:border-dron-blue dark:focus:border-dron-blue-light text-slate-800 dark:text-white"
          />
          <button className="px-6 py-3 bg-dron-blue hover:bg-dron-blue-light text-white rounded-xl font-bold text-sm shadow-md transition-all duration-200">
            Enviar
          </button>
        </div>
      </div>
    </section>
  );
};