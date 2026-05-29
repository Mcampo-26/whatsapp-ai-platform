// frontend/src/components/chat/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useChatStore } from '../../store/useChatStore.js';

export const ChatWindow = () => {
  const activeChat = useChatStore((state) => state.activeChat);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const toggleBotStatus = useChatStore((state) => state.toggleBotStatus); // 🚀 Traemos la acción de conmutación
  
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll automático cada vez que entran o se envían mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChat?.messages?.length]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    const messageText = inputText.trim();
    setInputText(''); 

    try {
      await sendMessage(activeChat._id, messageText);
      console.log('🚀 Mensaje del agente enviado con éxito:', messageText);
    } catch (error) {
      console.error('❌ Falló el envío del mensaje del agente en la UI:', error);
    }
  };

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

  // 🚀 Evaluamos si el bot está activo según el esquema enum de tu MongoDB
  const isBotActive = activeChat.status === 'bot_active';

  return (
    <section className="flex-1 h-[calc(100vh-6rem)] rounded-2xl glass-effect border-adapt p-6 flex flex-col justify-between">
      <div className="flex flex-col h-full justify-between">
        
        {/* Cabecera Modificada con Switch Adaptativo */}
        <div className="pb-4 border-b border-adapt flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-dron-blue text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {activeChat.customerName ? activeChat.customerName.substring(0, 2).toUpperCase() : 'WA'}
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white">{activeChat.customerName}</h4>
              <span className="text-xs text-emerald-500 font-medium">Cliente</span>
            </div>
          </div>

          {/* 🤖 BOTÓN SWITCH INTERACTIVO */}
          <button
            onClick={() => toggleBotStatus(activeChat._id, activeChat.status)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all duration-300 flex items-center gap-2 border select-none
              ${isBotActive 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20'
              }`}
          >
            <span>{isBotActive ? '🤖 Asistente IA: Activo' : '👤 Control: Manual'}</span>
            <div className={`w-2 h-2 rounded-full ${isBotActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          </button>
        </div>

        {/* Mensajes */}
        <div className="flex-1 my-4 overflow-y-auto flex flex-col gap-3 pr-2">
          {activeChat.messages && activeChat.messages.map((msg, idx) => {
            const isCustomer = msg.sender === 'customer';
            const isBot = msg.sender === 'ai';

            return (
              <div 
                key={idx} 
                className={`max-w-[75%] min-w-[160px] p-3 rounded-2xl text-sm shadow-sm transition-all duration-300 break-words flex flex-col gap-1
                  ${isCustomer 
                    ? 'bg-white/80 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 self-start rounded-tl-none border border-adapt' 
                    : isBot
                      ? 'bg-blue-600/10 border border-dron-blue/20 text-slate-800 dark:text-slate-100 self-end rounded-tr-none'
                      : 'bg-dron-blue text-white self-end rounded-tr-none'
                  }`}
              >
                {isBot && (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-dron-blue dark:text-dron-blue-light flex items-center gap-1 select-none">
                    🤖 Asistente IA
                  </span>
                )}
                <p className="leading-relaxed text-left whitespace-pre-wrap">{msg.text}</p>
              </div>
            );
          })}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Formulario */}
        <form onSubmit={handleSend} className="flex gap-2">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribí una respuesta..." 
            className="flex-1 px-4 py-3 rounded-xl border border-adapt bg-white/50 dark:bg-slate-800/20 text-sm focus:outline-none focus:border-dron-blue dark:focus:border-dron-blue-light text-slate-800 dark:text-white"
          />
          <button 
            type="submit"
            className="px-6 py-3 bg-dron-blue hover:bg-dron-blue-light text-white rounded-xl font-bold text-sm shadow-md transition-all duration-200"
          >
            Enviar
          </button>
        </form>
      </div>
    </section>
  );
};