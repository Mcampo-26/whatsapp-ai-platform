// frontend/src/components/Sidebar.jsx
import React, { useState } from 'react';

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('chats');

  const menuItems = [
    {
      id: 'chats',
      label: 'Bandeja de Chats',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.33.018.662.037.994.058a.75.75 0 01.678.747v10.3c0 .416-.34.743-.755.743a9.835 9.835 0 01-6.191-2.15l-3.328-2.66a.75.75 0 00-.469-.165H5.03A2.25 2.25 0 012.775 13.5V6A2.25 2.25 0 015.03 3.75h10.94a2.25 2.25 0 012.25 2.25v2.511z" />
        </svg>
      )
    },
    {
      id: 'tenants',
      label: 'Configuración Comercio',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75V21m-4.5 0H2.36m19.28 0h-4.58m-1.34 0h-1.172c-.199 0-.392-.079-.536-.22l-1.428-1.428a.75.75 0 00-1.06 0l-1.428 1.428a.75.75 0 01-.536.22H7.5mM21 21V9a2.25 2.25 0 00-2.25-2.25h-13.5A2.25 2.25 0 003 9v12m18-12V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3m18 0h-18" />
        </svg>
      )
    }
  ];

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] flex flex-col justify-between border-r transition-colors duration-300
      bg-slate-50 border-slate-200 text-slate-700
      dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400"
    >
      <div className="p-4 flex flex-col gap-2">
        <span className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Navegación
        </span>
        
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                ${isActive 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' 
                  : 'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-slate-100'
                }`}
            >
              <div className={`transition-colors duration-200 
                ${isActive ? 'text-emerald-500' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}
              >
                {item.icon}
              </div>
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/30">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Inquilino Activo</span>
          <span className="text-sm font-semibold truncate text-slate-800 dark:text-slate-200">
            Tienda de Prueba Maury
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">WhatsApp Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
};