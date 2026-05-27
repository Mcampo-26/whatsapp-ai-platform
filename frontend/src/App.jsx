// frontend/src/App.jsx
import React, { useEffect } from 'react';
import { Navbar } from './components/layout/Navbar.jsx';
import { Sidebar } from './components/layout/Sidebar.jsx';
import { ChatList } from './components/chat/ChatList.jsx';
import { ChatWindow } from './components/chat/ChatWindow.jsx';
import  {useChatStore} from './store/useChatStore.js'

function App() {
  const { setChats } = useChatStore();

  // Simulamos la carga inicial en el store de Zustand
  useEffect(() => {
    const mockChats = [
      {
        id: "6a16e86b3932787496d7c4d1",
        tenantId: "6a16e86bbdc9dd4ad1824c67",
        customerPhone: "549381XXXXXXX",
        customerName: "Lautaro",
        messages: [
          { sender: "customer", text: "Hola pa, ¿pudiste armar el webhook?", timestamp: new Date() }
        ],
        updatedAt: new Date()
      }
    ];
    setChats(mockChats);
  }, [setChats]);

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <Navbar />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 p-6 bg-slate-100/50 dark:bg-slate-900/40 transition-colors duration-300 flex gap-6">
          {/* Componente de la lista */}
          <ChatList />

          {/* Componente del chat abierto */}
          <ChatWindow />
        </main>
      </div>
    </div>
  );
}

export default App;